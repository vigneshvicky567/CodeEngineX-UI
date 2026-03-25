from __future__ import annotations

import subprocess
import time
from typing import Optional, TYPE_CHECKING

from app.runners.base import Runner, RunResult

if TYPE_CHECKING:
    from app.db.models import Submission, TestCase

class DockerRunner(Runner):
    def prepare(self, submission: "Submission") -> None:
        pass

    def compile(self, submission: "Submission") -> Optional[RunResult]:
        return None

    def run_testcase(
        self,
        submission: "Submission",
        testcase: "TestCase",
        time_limit_ms: int,
        memory_limit_kb: int,
    ) -> RunResult:
        start_time = time.time()
        try:
            if submission.language == "python":
                cmd = ["python", "-c", submission.source_text]
            elif submission.language == "javascript":
                cmd = ["node", "-e", submission.source_text]
            else:
                return RunResult(status="error", stdout="", stderr=f"Unsupported language: {submission.language}", time_ms=0, memory_kb=0, exit_code=1)

            process = subprocess.run(
                cmd,
                input=testcase.input_text.encode() if getattr(testcase, 'input_text', None) else None,
                capture_output=True,
                timeout=time_limit_ms / 1000.0,
            )
            time_ms = int((time.time() - start_time) * 1000)

            if process.returncode == 0:
                return RunResult(status="accepted", stdout=process.stdout.decode(), stderr=process.stderr.decode(), time_ms=time_ms, memory_kb=0, exit_code=0)
            else:
                return RunResult(status="runtime_error", stdout=process.stdout.decode(), stderr=process.stderr.decode(), time_ms=time_ms, memory_kb=0, exit_code=process.returncode)

        except subprocess.TimeoutExpired:
            return RunResult(status="time_limit_exceeded", stdout="", stderr="Execution timed out.", time_ms=time_limit_ms, memory_kb=0, exit_code=124)
        except Exception as e:
            return RunResult(status="system_error", stdout="", stderr=str(e), time_ms=0, memory_kb=0, exit_code=1)

    def cleanup(self, submission: "Submission") -> None:
        pass
