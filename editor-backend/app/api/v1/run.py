"""
POST /api/v1/run — synchronous quick-execute endpoint.

Runs user code immediately against optional stdin and returns results inline.
No problem or testcase row is required. Optionally persists a submission row
when `persist=true`.
"""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Submission, SubmissionStatus
from app.db.session import get_db
from app.runners.base import RunResult
from app.schemas.run import RunRequest, RunResponse

router = APIRouter()
logger = logging.getLogger(__name__)


def _get_runner():
    """Return the active runner instance based on the RUNNER env var."""
    if settings.RUNNER == "judge0":
        from app.runners.judge0_runner import Judge0Runner
        return Judge0Runner()
    elif settings.RUNNER == "docker":
        from app.runners.docker_runner import DockerRunner
        return DockerRunner()
    else:
        raise ValueError(f"Unknown runner: {settings.RUNNER}")


# Minimal stub testcase object for quick-run (no DB row required)
class _QuickRunTestcase:
    def __init__(self, stdin: Optional[str]):
        self.id = 0
        self.input_text = stdin
        self.output_text = None
        self.is_hidden = False
        self.ordinal = 0


# Minimal stub submission for runner interface
class _QuickRunSubmission:
    def __init__(self, user_id: int, language: str, source: str):
        self.id = 0
        self.user_id = user_id
        self.language = language
        self.source_text = source


@router.post(
    "/run",
    response_model=RunResponse,
    status_code=status.HTTP_200_OK,
    summary="Synchronously run code and return results",
)
def run_code(req: RunRequest, db: Session = Depends(get_db)) -> RunResponse:
    """
    Executes the given source code synchronously against optional stdin.

    - Does **not** require a problem or testcase row.
    - Returns stdout, stderr, time_ms, memory_kb, and a status string inline.
    - Set `persist=true` to also save a submission row (useful for debugging).
    """
    runner = _get_runner()
    stub_sub = _QuickRunSubmission(req.user_id, req.language, req.source)
    stub_tc = _QuickRunTestcase(req.stdin)

    submission_id: Optional[int] = None

    try:
        runner.prepare(stub_sub)  # type: ignore[arg-type]
        compile_result = runner.compile(stub_sub)  # type: ignore[arg-type]
        if compile_result is not None and compile_result.status == "compile_error":
            result: RunResult = compile_result
        else:
            result = runner.run_testcase(
                stub_sub,  # type: ignore[arg-type]
                stub_tc,  # type: ignore[arg-type]
                time_limit_ms=settings.DEFAULT_TIME_LIMIT_MS,
                memory_limit_kb=settings.DEFAULT_MEMORY_LIMIT_KB,
            )
    except NotImplementedError as exc:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(exc),
        )
    except Exception as exc:
        logger.exception("Unhandled error in /run")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Runner error: {exc}",
        )
    finally:
        try:
            runner.cleanup(stub_sub)  # type: ignore[arg-type]
        except Exception:
            pass

    if req.persist:
        sub = Submission(
            user_id=req.user_id,
            problem_id=None,
            language=req.language,
            source_text=req.source,
            status=result.status,
            time_ms=result.time_ms,
            memory_kb=result.memory_kb,
            run_type="run",
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)
        submission_id = sub.id

    return RunResponse(
        status=result.status,
        stdout=result.stdout,
        stderr=result.stderr,
        time_ms=result.time_ms,
        memory_kb=result.memory_kb,
        submission_id=submission_id,
    )
