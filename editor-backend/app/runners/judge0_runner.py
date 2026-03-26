"""
Judge0 Runner implementation.

Calls the Judge0 CE REST API (v2 token-based or RapidAPI) to compile and
execute user code.  Supports both the public Judge0 CE SaaS (RapidAPI) and a
self-hosted instance — set JUDGE0_URL accordingly.

Judge0 language IDs reference:
  https://ce.judge0.com/languages/

TODO (production hardening):
  - Map language strings → Judge0 language IDs dynamically via /languages.
  - Store language-id map in DB / config rather than hard-coding.
  - Add retry logic with exponential backoff on 5xx.
  - Rotate API keys / use multiple tokens.
"""
from __future__ import annotations

import base64
import logging
import time
from typing import Optional, TYPE_CHECKING

import httpx

from app.core.config import settings
from app.runners.base import Runner, RunResult

if TYPE_CHECKING:
    from app.db.models import Submission, TestCase

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Language → Judge0 language_id mapping (extend as needed)
# ---------------------------------------------------------------------------
LANGUAGE_MAP: dict[str, int] = {
    "python": 71,       # Python 3.8
    "python3": 71,
    "python2": 70,
    "c": 50,            # C (GCC)
    "cpp": 54,          # C++ (GCC)
    "c++": 54,
    "java": 62,         # Java (OpenJDK)
    "javascript": 63,   # Node.js
    "js": 63,
    "typescript": 74,   # TypeScript
    "ts": 74,
    "go": 60,
    "rust": 73,
    "ruby": 72,
    "bash": 46,
    "csharp": 51,
    "c#": 51,
    "php": 68,
    "kotlin": 78,
    "swift": 83,
}


def _language_id(language: str) -> int:
    lang = language.strip().lower()
    lid = LANGUAGE_MAP.get(lang)
    if lid is None:
        raise ValueError(f"Unsupported language: '{language}'. Supported: {list(LANGUAGE_MAP)}")
    return lid


def _b64(text: Optional[str]) -> Optional[str]:
    if text is None:
        return None
    return base64.b64encode(text.encode()).decode()


def _from_b64(text: Optional[str]) -> str:
    if not text:
        return ""
    return base64.b64decode(text).decode(errors="replace")


class Judge0Runner(Runner):
    """
    Runner that delegates execution to a Judge0 instance via its REST API.

    Judge0 handles sandboxing, resource enforcement and multiple languages.
    The worker calls prepare() once, then run_testcase() for each testcase.
    compile() is a no-op here because Judge0 compiles internally.
    """

    def __init__(self) -> None:
        self._client: Optional[httpx.Client] = None

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @property
    def _base_url(self) -> str:
        return settings.JUDGE0_URL.rstrip("/")

    @property
    def _headers(self) -> dict:
        headers: dict = {"Content-Type": "application/json", "Accept": "application/json"}
        if settings.JUDGE0_API_KEY:
            # RapidAPI style; adjust header name for self-hosted setups.
            headers["X-RapidAPI-Key"] = settings.JUDGE0_API_KEY
            headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com"
        return headers

    def _get_client(self) -> httpx.Client:
        if self._client is None or self._client.is_closed:
            self._client = httpx.Client(
                base_url=self._base_url,
                headers=self._headers,
                timeout=settings.JUDGE0_TIMEOUT_S,
            )
        return self._client

    # ------------------------------------------------------------------
    # Runner interface
    # ------------------------------------------------------------------

    def prepare(self, submission: "Submission") -> None:
        """No-op — Judge0 manages its own sandbox."""
        logger.debug("Judge0Runner.prepare called for submission %d", submission.id)

    def compile(self, submission: "Submission") -> Optional[RunResult]:
        """No-op — Judge0 compiles internally when the submission is created."""
        return None

    def run_testcase(
        self,
        submission: "Submission",
        testcase: "TestCase",
        time_limit_ms: int,
        memory_limit_kb: int,
    ) -> RunResult:
        """Submit the source to Judge0 and poll until a result is ready."""
        language_id = _language_id(submission.language)
        client = self._get_client()

        payload = {
            "source_code": _b64(submission.source_text),
            "language_id": language_id,
            "stdin": _b64(testcase.input_text),
            "cpu_time_limit": time_limit_ms / 1000.0,        # seconds (float)
            "memory_limit": memory_limit_kb,                  # KB
            "max_file_size": min(settings.OUTPUT_LIMIT_BYTES // 1024, 4096),  # KB, Judge0 max 4096
            "base64_encoded": True,
            "wait": False,
            "enable_network": False,
        }

        # Submit to Judge0
        try:
            resp = client.post("/submissions", params={"base64_encoded": "true"}, json=payload)
            resp.raise_for_status()
        except httpx.HTTPStatusError as exc:
            logger.error("Judge0 submission failed: %s", exc.response.text)
            return RunResult(
                stdout="", stderr=f"Judge0 Error: {exc.response.text}",
                time_ms=None, memory_kb=None, exit_code=-1, status="system_error"
            )
        except httpx.RequestError as exc:
            logger.error("Judge0 connection error: %s", exc)
            return RunResult(
                stdout="", stderr=f"Connection error: {exc}",
                time_ms=None, memory_kb=None, exit_code=-1, status="system_error"
            )

        token = resp.json().get("token")
        if not token:
            return RunResult(
                stdout="", stderr="Judge0 did not return a submission token.",
                time_ms=None, memory_kb=None, exit_code=-1, status="system_error"
            )

        return self._poll_result(client, token, time_limit_ms)

    def _poll_result(self, client: httpx.Client, token: str, time_limit_ms: int) -> RunResult:
        """Poll Judge0 until status is not 'In Queue' (1) or 'Processing' (2)."""
        deadline = time.monotonic() + settings.JUDGE0_TIMEOUT_S + 5
        while time.monotonic() < deadline:
            try:
                resp = client.get(f"/submissions/{token}", params={"base64_encoded": "true"})
                resp.raise_for_status()
            except httpx.RequestError as exc:
                logger.warning("Poll error: %s — retrying", exc)
                time.sleep(1)
                continue

            data = resp.json()
            status_id: int = data.get("status", {}).get("id", 0)

            # 1 = In Queue, 2 = Processing
            if status_id in (1, 2):
                time.sleep(0.5)
                continue

            return self._parse_result(data)

        # Timeout polling
        return RunResult(
            stdout="", stderr="Polling timed out waiting for Judge0 result.",
            time_ms=None, memory_kb=None, exit_code=-1, status="system_error"
        )

    def _parse_result(self, data: dict) -> RunResult:
        """Map Judge0 response dict → RunResult."""
        status_id: int = data.get("status", {}).get("id", 0)
        stdout = _from_b64(data.get("stdout"))
        stderr = _from_b64(data.get("stderr")) or _from_b64(data.get("compile_output"))

        # Truncate to output limit
        limit = settings.OUTPUT_LIMIT_BYTES
        stdout = stdout[:limit]

        time_s: Optional[float] = data.get("time")
        time_ms = int(float(time_s) * 1000) if time_s else None
        memory_kb: Optional[int] = data.get("memory")  # Judge0 returns KB

        # Map Judge0 status ids to internal status strings
        # https://ce.judge0.com/statuses
        status_map = {
            3: "accepted",
            4: "wrong_answer",
            5: "tle",
            6: "compile_error",
            7: "runtime_error",   # SIGSEGV
            8: "runtime_error",   # SIGXFSZ
            9: "runtime_error",   # SIGFPE
            10: "runtime_error",  # SIGABRT
            11: "runtime_error",  # NZEC
            12: "runtime_error",  # other
            13: "system_error",
            14: "mle",
        }
        status = status_map.get(status_id, "system_error")
        exit_code = data.get("exit_code") or (0 if status == "accepted" else 1)

        return RunResult(
            stdout=stdout,
            stderr=stderr,
            time_ms=time_ms,
            memory_kb=memory_kb,
            exit_code=exit_code,
            status=status,
        )

    def cleanup(self, submission: "Submission") -> None:
        """Close HTTP client resources."""
        if self._client and not self._client.is_closed:
            self._client.close()
        self._client = None
