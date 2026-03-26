"""
Background worker process.

Polls the submissions table for queued rows and executes them using the
configured Runner. Run as a separate Docker service.

Design decisions:
  - Uses SELECT ... FOR UPDATE SKIP LOCKED to claim jobs atomically without
    message-broker infrastructure.
  - time_ms on the submission is set to the MAXIMUM of all testcase times
    (represents worst-case latency; document alternative: sum = total CPU).
  - Stops processing further testcases on the first failure (fail-fast).
"""
from __future__ import annotations

import logging
import logging.config
import os
import sys
import time
from datetime import datetime, timezone

from sqlalchemy import select, text, update
from sqlalchemy.orm import Session

# Allow running as a standalone script
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.core.config import settings
from app.db.models import Submission, SubmissionStatus, SubmissionTestResult
from app.db.session import SessionLocal
from app.runners.base import RunResult

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "structured": {
            "format": '{"time":"%(asctime)s","level":"%(levelname)s","worker":"rce-worker","msg":%(message)r}',
            "datefmt": "%Y-%m-%dT%H:%M:%S",
        }
    },
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "structured"}},
    "root": {"level": "INFO", "handlers": ["console"]},
}
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Runner factory
# ---------------------------------------------------------------------------

def _get_runner():
    runner_name = settings.RUNNER.lower()
    if runner_name == "judge0":
        from app.runners.judge0_runner import Judge0Runner
        return Judge0Runner()
    elif runner_name == "docker":
        from app.runners.docker_runner import DockerRunner
        return DockerRunner()
    else:
        raise ValueError(f"Unknown RUNNER env: {runner_name!r}")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _now() -> datetime:
    return datetime.now(tz=timezone.utc)


def _claim_submission(db: Session) -> Submission | None:
    """
    Atomically claim one queued submission using SELECT FOR UPDATE SKIP LOCKED.
    Returns the claimed (now 'running') submission or None.
    """
    stmt = (
        select(Submission)
        .where(Submission.status == SubmissionStatus.queued.value)
        .order_by(Submission.created_at)
        .limit(1)
        .with_for_update(skip_locked=True)
    )
    sub = db.scalars(stmt).first()
    if sub is None:
        return None

    sub.status = SubmissionStatus.running.value
    sub.updated_at = _now()
    db.flush()
    logger.info("Claimed submission %d", sub.id)
    return sub


def _compare_output(expected: str | None, actual: str) -> bool:
    """Normalize newlines and trailing whitespace before comparing."""
    if expected is None:
        return True  # no expected output → always pass (useful for 'run' type)
    return expected.strip() == actual.strip()


def _status_from_result(result: RunResult, expected_output: str | None) -> str:
    """Map a RunResult to a final testcase status string."""
    if result.status not in ("accepted", "wrong_answer"):
        return result.status  # tle, mle, runtime_error, compile_error, system_error
    if not _compare_output(expected_output, result.stdout):
        return SubmissionStatus.wrong_answer.value
    return SubmissionStatus.accepted.value


OUTPUT_LIMIT = settings.OUTPUT_LIMIT_BYTES


# ---------------------------------------------------------------------------
# Main processing logic
# ---------------------------------------------------------------------------

def process_submission(sub: Submission, db: Session) -> None:
    """
    Execute all testcases for a submission, inserting result rows and finally
    updating the submission status.
    """
    runner = _get_runner()
    final_status = SubmissionStatus.accepted.value
    max_time_ms: int = 0

    # Fetch problem with testcases (already loaded via relationship if session-bound)
    from sqlalchemy.orm import joinedload
    problem = (
        db.query(sub.problem.__class__)
        .options(joinedload(sub.problem.__class__.testcases))
        .filter(sub.problem.__class__.id == sub.problem_id)
        .first()
    ) if sub.problem_id else None

    if problem is None:
        if sub.run_type == "run":
            # Quick runs without a problem row are handled by the API; skip.
            sub.status = SubmissionStatus.system_error.value
            sub.updated_at = _now()
            logger.warning("Submission %d has no problem_id; marking system_error", sub.id)
            return
        sub.status = SubmissionStatus.system_error.value
        sub.updated_at = _now()
        logger.error("Submission %d references missing problem %s", sub.id, sub.problem_id)
        return

    time_limit_ms = problem.time_limit_ms
    memory_limit_kb = problem.memory_limit_kb
    testcases = problem.testcases

    try:
        runner.prepare(sub)
        compile_result = runner.compile(sub)
        if compile_result is not None and compile_result.status == "compile_error":
            final_status = SubmissionStatus.compile_error.value
            _save_test_result(db, sub.id, testcases[0].id if testcases else -1, compile_result)
            sub.status = final_status
            sub.updated_at = _now()
            runner.cleanup(sub)
            return
    except Exception as exc:
        logger.exception("prepare/compile failed for submission %d", sub.id)
        final_status = SubmissionStatus.runtime_error.value
        return
    finally:
        # Always write the final status in the outer finally
        pass

    try:
        for tc in testcases:
            try:
                result: RunResult = runner.run_testcase(sub, tc, time_limit_ms, memory_limit_kb)
            except Exception as exc:
                logger.exception("run_testcase raised for submission %d testcase %d", sub.id, tc.id)
                result = RunResult(
                    stdout="", stderr=str(exc),
                    time_ms=None, memory_kb=None, exit_code=1, status="runtime_error"
                )

            tc_status = _status_from_result(result, tc.output_text)

            # Cap stdout
            stdout_capped = (result.stdout or "")[:OUTPUT_LIMIT]
            _save_test_result(db, sub.id, tc.id, result, tc_status, stdout_capped)

            if result.time_ms is not None:
                max_time_ms = max(max_time_ms, result.time_ms)

            if tc_status != SubmissionStatus.accepted.value:
                final_status = tc_status
                break  # Fail-fast: stop after first failure
    except Exception as exc:
        logger.exception("Unhandled exception processing submission %d", sub.id)
        final_status = SubmissionStatus.runtime_error.value
    finally:
        try:
            runner.cleanup(sub)
        except Exception:
            pass

    sub.status = final_status
    sub.time_ms = max_time_ms if max_time_ms else None
    sub.updated_at = _now()
    logger.info("Submission %d finished with status=%s time_ms=%s", sub.id, final_status, max_time_ms or "N/A")


def _save_test_result(
    db: Session,
    submission_id: int,
    testcase_id: int,
    result: RunResult,
    status: str | None = None,
    stdout: str | None = None,
) -> None:
    tr = SubmissionTestResult(
        submission_id=submission_id,
        testcase_id=testcase_id,
        status=status or result.status,
        time_ms=result.time_ms,
        memory_kb=result.memory_kb,
        stdout=stdout if stdout is not None else (result.stdout or "")[:OUTPUT_LIMIT],
    )
    db.add(tr)
    db.flush()


# ---------------------------------------------------------------------------
# Poll loop
# ---------------------------------------------------------------------------

def run_worker() -> None:
    logger.info("RCE Worker started. RUNNER=%s poll_interval=%.1fs", settings.RUNNER, settings.WORKER_POLL_INTERVAL_S)
    while True:
        try:
            with SessionLocal() as db:
                sub = _claim_submission(db)
                if sub is None:
                    time.sleep(settings.WORKER_POLL_INTERVAL_S)
                    continue

                try:
                    process_submission(sub, db)
                    db.commit()
                except Exception as exc:
                    db.rollback()
                    logger.exception("Failed processing submission %d; marking runtime_error", sub.id)
                    # Re-open session to update status after rollback
                    with SessionLocal() as err_db:
                        err_sub = err_db.get(Submission, sub.id)
                        if err_sub:
                            err_sub.status = SubmissionStatus.runtime_error.value
                            err_sub.updated_at = _now()
                            err_db.commit()

        except Exception as exc:
            logger.exception("Unhandled error in poll loop — sleeping before retry")
            time.sleep(settings.WORKER_POLL_INTERVAL_S * 3)


if __name__ == "__main__":
    run_worker()
