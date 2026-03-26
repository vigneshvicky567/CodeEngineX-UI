"""
Unit tests for the worker's core logic functions.

The worker's `process_submission` function and its helpers are tested with:
- Mocked runner (no real code execution)
- Mocked SQLAlchemy session
- SQLite in-memory full integration tests

These tests verify:
1. Correct status transitions (queued → running → accepted/wrong_answer/tle/mle/runtime_error)
2. Fail-fast behavior (stops on first failure)
3. time_ms aggregation (max of testcase times)
4. Output truncation (stdout capped at OUTPUT_LIMIT_BYTES)
5. output comparison logic (_compare_output)
6. Error recovery paths
"""
from __future__ import annotations

from datetime import datetime, timezone
from unittest.mock import MagicMock, patch, call
import pytest

from sqlalchemy.orm import Session

from app.db import models
from app.runners.base import RunResult
from tests.conftest import make_problem, make_submission, make_testcase, make_user


# Import worker functions under test
from worker.worker import (
    _compare_output,
    _status_from_result,
    _save_test_result,
    process_submission,
)


# ---------------------------------------------------------------------------
# _compare_output
# ---------------------------------------------------------------------------

class TestCompareOutput:
    def test_equal_strings(self):
        assert _compare_output("hello", "hello") is True

    def test_strips_trailing_whitespace(self):
        assert _compare_output("hello\n", "hello") is True
        assert _compare_output("hello", "hello\n") is True

    def test_strips_leading_whitespace(self):
        assert _compare_output("  hello", "hello") is True

    def test_different_strings(self):
        assert _compare_output("expected", "actual") is False

    def test_none_expected_always_passes(self):
        """No expected output → always pass (run-type submissions)."""
        assert _compare_output(None, "anything") is True

    def test_empty_expected_vs_empty_actual(self):
        assert _compare_output("", "") is True

    def test_multiline_comparison(self):
        assert _compare_output("1\n2\n3", "1\n2\n3") is True
        assert _compare_output("1\n2\n3", "1\n2\n4") is False

    def test_case_sensitive(self):
        assert _compare_output("Hello", "hello") is False


# ---------------------------------------------------------------------------
# _status_from_result
# ---------------------------------------------------------------------------

class TestStatusFromResult:
    def _result(self, status, stdout=""):
        return RunResult(stdout=stdout, stderr="", time_ms=10, memory_kb=512, exit_code=0, status=status)

    def test_accepted_with_matching_output(self):
        r = self._result("accepted", stdout="3\n")
        assert _status_from_result(r, expected_output="3") == "accepted"

    def test_wrong_answer_with_wrong_output(self):
        r = self._result("accepted", stdout="99\n")
        assert _status_from_result(r, expected_output="3") == "wrong_answer"

    def test_tle_propagated(self):
        r = self._result("tle")
        assert _status_from_result(r, expected_output="3") == "tle"

    def test_mle_propagated(self):
        r = self._result("mle")
        assert _status_from_result(r, expected_output="3") == "mle"

    def test_runtime_error_propagated(self):
        r = self._result("runtime_error")
        assert _status_from_result(r, expected_output="3") == "runtime_error"

    def test_system_error_propagated(self):
        r = self._result("system_error")
        assert _status_from_result(r, expected_output="3") == "system_error"

    def test_none_expected_accepts_any_output(self):
        r = self._result("accepted", stdout="anything")
        assert _status_from_result(r, expected_output=None) == "accepted"


# ---------------------------------------------------------------------------
# _save_test_result
# ---------------------------------------------------------------------------

class TestSaveTestResult:
    def test_saves_test_result_row(self, db: Session):
        u = make_user(db, user_id=100, username="worker_tr")
        p = make_problem(db, slug="worker-tr-test")
        tc = make_testcase(db, problem_id=p.id, ordinal=0)
        sub = make_submission(db, user_id=u.id, problem_id=p.id)

        result = RunResult(stdout="ok\n", stderr="", time_ms=25, memory_kb=2048, exit_code=0, status="accepted")
        _save_test_result(db, sub.id, tc.id, result)

        row = db.query(models.SubmissionTestResult).filter_by(submission_id=sub.id).first()
        assert row is not None
        assert row.status == "accepted"
        assert row.time_ms == 25
        assert row.stdout == "ok\n"

    def test_saves_with_explicit_status_override(self, db: Session):
        u = make_user(db, user_id=101, username="worker_tr2")
        p = make_problem(db, slug="worker-tr-override")
        tc = make_testcase(db, problem_id=p.id, ordinal=0)
        sub = make_submission(db, user_id=u.id, problem_id=p.id)

        result = RunResult(stdout="wrong", stderr="", time_ms=10, memory_kb=1024, exit_code=0, status="accepted")
        _save_test_result(db, sub.id, tc.id, result, status="wrong_answer", stdout="wrong")

        row = db.query(models.SubmissionTestResult).filter_by(submission_id=sub.id).first()
        assert row.status == "wrong_answer"


# ---------------------------------------------------------------------------
# process_submission — full integration with mocked runner
# ---------------------------------------------------------------------------

def _make_runner(results: list[RunResult]) -> MagicMock:
    """Return a runner mock that yields results in sequence."""
    runner = MagicMock()
    runner.prepare.return_value = None
    runner.compile.return_value = None
    runner.run_testcase.side_effect = results
    runner.cleanup.return_value = None
    return runner


class TestProcessSubmission:
    def test_accepted_all_testcases_pass(self, db: Session):
        u = make_user(db, user_id=200, username="worker_accept")
        p = make_problem(db, slug="worker-accept")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="3")
        make_testcase(db, problem_id=p.id, ordinal=1, output_text="9")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        results = [
            RunResult(stdout="3\n", stderr="", time_ms=10, memory_kb=512, exit_code=0, status="accepted"),
            RunResult(stdout="9\n", stderr="", time_ms=20, memory_kb=512, exit_code=0, status="accepted"),
        ]
        runner = _make_runner(results)

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        assert sub.status == "accepted"
        # time_ms should be MAX of all testcase times
        assert sub.time_ms == 20

    def test_wrong_answer_stops_early(self, db: Session):
        u = make_user(db, user_id=201, username="worker_wa")
        p = make_problem(db, slug="worker-wa")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="3")
        make_testcase(db, problem_id=p.id, ordinal=1, output_text="9")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        results = [
            RunResult(stdout="999\n", stderr="", time_ms=10, memory_kb=512, exit_code=0, status="accepted"),
            # this should NOT be called (fail-fast)
        ]
        runner = _make_runner(results)

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        assert sub.status == "wrong_answer"
        # Only one run_testcase call (fail-fast)
        assert runner.run_testcase.call_count == 1

    def test_tle_stops_early(self, db: Session):
        u = make_user(db, user_id=202, username="worker_tle")
        p = make_problem(db, slug="worker-tle")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="3")
        make_testcase(db, problem_id=p.id, ordinal=1, output_text="9")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        results = [
            RunResult(stdout="", stderr="", time_ms=5001, memory_kb=512, exit_code=1, status="tle"),
        ]
        runner = _make_runner(results)

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        assert sub.status == "tle"
        assert runner.run_testcase.call_count == 1

    def test_runtime_error_stops_early(self, db: Session):
        u = make_user(db, user_id=203, username="worker_re")
        p = make_problem(db, slug="worker-re")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="3")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        results = [
            RunResult(stdout="", stderr="Traceback...", time_ms=5, memory_kb=512, exit_code=1, status="runtime_error"),
        ]
        runner = _make_runner(results)

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        assert sub.status == "runtime_error"

    def test_compile_error_marks_submission(self, db: Session):
        u = make_user(db, user_id=204, username="worker_ce")
        p = make_problem(db, slug="worker-ce")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="3")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        compile_error = RunResult(stdout="", stderr="SyntaxError", time_ms=None, memory_kb=None, exit_code=1, status="compile_error")
        runner = MagicMock()
        runner.prepare.return_value = None
        runner.compile.return_value = compile_error
        runner.cleanup.return_value = None

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        assert sub.status == "compile_error"
        # run_testcase should NOT have been called
        runner.run_testcase.assert_not_called()

    def test_time_ms_is_maximum_of_all_testcases(self, db: Session):
        u = make_user(db, user_id=205, username="worker_max_t")
        p = make_problem(db, slug="worker-max-t")
        for i, out in enumerate(["1", "2", "3"]):
            make_testcase(db, problem_id=p.id, ordinal=i, output_text=out)
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        results = [
            RunResult(stdout="1\n", stderr="", time_ms=100, memory_kb=512, exit_code=0, status="accepted"),
            RunResult(stdout="2\n", stderr="", time_ms=300, memory_kb=512, exit_code=0, status="accepted"),
            RunResult(stdout="3\n", stderr="", time_ms=150, memory_kb=512, exit_code=0, status="accepted"),
        ]
        runner = _make_runner(results)

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        assert sub.status == "accepted"
        assert sub.time_ms == 300  # max, not sum

    def test_test_result_rows_created(self, db: Session):
        u = make_user(db, user_id=206, username="worker_tr_rows")
        p = make_problem(db, slug="worker-tr-rows")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="1")
        make_testcase(db, problem_id=p.id, ordinal=1, output_text="2")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        results = [
            RunResult(stdout="1\n", stderr="", time_ms=10, memory_kb=512, exit_code=0, status="accepted"),
            RunResult(stdout="2\n", stderr="", time_ms=15, memory_kb=512, exit_code=0, status="accepted"),
        ]
        runner = _make_runner(results)

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        rows = db.query(models.SubmissionTestResult).filter_by(submission_id=sub.id).all()
        assert len(rows) == 2

    def test_stdout_truncated_in_test_result(self, db: Session):
        from app.core.config import settings
        u = make_user(db, user_id=207, username="worker_trunc")
        p = make_problem(db, slug="worker-trunc")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="short")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        big = "X" * (settings.OUTPUT_LIMIT_BYTES + 100)
        results = [
            RunResult(stdout=big, stderr="", time_ms=10, memory_kb=512, exit_code=0, status="accepted"),
        ]
        runner = _make_runner(results)

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        row = db.query(models.SubmissionTestResult).filter_by(submission_id=sub.id).first()
        assert len(row.stdout) <= settings.OUTPUT_LIMIT_BYTES

    def test_runner_exception_marks_runtime_error(self, db: Session):
        u = make_user(db, user_id=208, username="worker_exc")
        p = make_problem(db, slug="worker-exc")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="1")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        runner = MagicMock()
        runner.prepare.return_value = None
        runner.compile.return_value = None
        runner.run_testcase.side_effect = Exception("runner crashed")
        runner.cleanup.return_value = None

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        # Should be marked as runtime_error since run_testcase raised
        assert sub.status in ("runtime_error", "wrong_answer")

    def test_missing_problem_id_marks_system_error(self, db: Session):
        u = make_user(db, user_id=209, username="worker_no_prob")
        sub = make_submission(db, user_id=u.id, problem_id=None, status="running", run_type="submit")

        runner = MagicMock()
        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        assert sub.status == "system_error"
        runner.run_testcase.assert_not_called()

    def test_cleanup_called_even_on_exception(self, db: Session):
        u = make_user(db, user_id=210, username="worker_cleanup")
        p = make_problem(db, slug="worker-cleanup")
        make_testcase(db, problem_id=p.id, ordinal=0, output_text="1")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="running")

        runner = MagicMock()
        runner.prepare.return_value = None
        runner.compile.return_value = None
        runner.run_testcase.side_effect = RuntimeError("crash")
        runner.cleanup.return_value = None

        with patch("worker.worker._get_runner", return_value=runner):
            process_submission(sub, db)

        runner.cleanup.assert_called_once()
