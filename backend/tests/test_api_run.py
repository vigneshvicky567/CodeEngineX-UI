"""
API endpoint tests for POST /api/v1/run.

The runner is mocked with unittest.mock.patch so no real Judge0 calls are
made. Tests verify: request validation, runner invocation, response shape,
error handling, and the `persist` flag.
"""
from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.runners.base import RunResult
from tests.conftest import make_user


# A reusable successful RunResult
ACCEPTED_RESULT = RunResult(
    stdout="Hello, World!\n",
    stderr="",
    time_ms=42,
    memory_kb=8192,
    exit_code=0,
    status="accepted",
)

TLE_RESULT = RunResult(
    stdout="",
    stderr="",
    time_ms=5001,
    memory_kb=8192,
    exit_code=1,
    status="tle",
)

COMPILE_ERROR_RESULT = RunResult(
    stdout="",
    stderr="SyntaxError: invalid syntax",
    time_ms=None,
    memory_kb=None,
    exit_code=1,
    status="compile_error",
)


def _mock_runner(result: RunResult) -> MagicMock:
    """Return a mock runner that returns `result` from run_testcase."""
    runner = MagicMock()
    runner.prepare.return_value = None
    runner.compile.return_value = None  # no compile error
    runner.run_testcase.return_value = result
    runner.cleanup.return_value = None
    return runner


class TestRunEndpoint:
    # ------------------------------------------------------------------
    # Happy paths
    # ------------------------------------------------------------------

    def test_run_accepted_returns_200(self, client: TestClient, db: Session):
        make_user(db)
        runner = _mock_runner(ACCEPTED_RESULT)
        with patch("app.api.v1.run._get_runner", return_value=runner):
            resp = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": 'print("Hello, World!")',
            })
        assert resp.status_code == 200

    def test_run_response_has_required_fields(self, client: TestClient, db: Session):
        make_user(db)
        runner = _mock_runner(ACCEPTED_RESULT)
        with patch("app.api.v1.run._get_runner", return_value=runner):
            body = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "x",
            }).json()
        assert "status" in body
        assert "stdout" in body
        assert "stderr" in body
        assert "time_ms" in body
        assert "memory_kb" in body

    def test_run_returns_correct_stdout(self, client: TestClient, db: Session):
        make_user(db)
        runner = _mock_runner(ACCEPTED_RESULT)
        with patch("app.api.v1.run._get_runner", return_value=runner):
            body = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "x",
            }).json()
        assert body["stdout"] == "Hello, World!\n"
        assert body["status"] == "accepted"
        assert body["time_ms"] == 42
        assert body["memory_kb"] == 8192

    def test_run_tle_result(self, client: TestClient, db: Session):
        make_user(db)
        runner = _mock_runner(TLE_RESULT)
        with patch("app.api.v1.run._get_runner", return_value=runner):
            body = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "while True: pass",
            }).json()
        assert body["status"] == "tle"

    def test_run_compile_error_returned_inline(self, client: TestClient, db: Session):
        make_user(db)
        runner = MagicMock()
        runner.prepare.return_value = None
        runner.compile.return_value = COMPILE_ERROR_RESULT  # compile failed
        runner.cleanup.return_value = None
        with patch("app.api.v1.run._get_runner", return_value=runner):
            body = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "def f(:",
            }).json()
        assert body["status"] == "compile_error"
        assert "SyntaxError" in body["stderr"]

    # ------------------------------------------------------------------
    # persist=True  →  submission row created
    # ------------------------------------------------------------------

    def test_run_persist_creates_submission_row(self, client: TestClient, db: Session):
        make_user(db)
        runner = _mock_runner(ACCEPTED_RESULT)
        with patch("app.api.v1.run._get_runner", return_value=runner):
            body = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "x", "persist": True,
            }).json()
        assert body["submission_id"] is not None
        assert isinstance(body["submission_id"], int)

    def test_run_no_persist_submission_id_is_null(self, client: TestClient, db: Session):
        make_user(db)
        runner = _mock_runner(ACCEPTED_RESULT)
        with patch("app.api.v1.run._get_runner", return_value=runner):
            body = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "x", "persist": False,
            }).json()
        assert body["submission_id"] is None

    # ------------------------------------------------------------------
    # Validation errors
    # ------------------------------------------------------------------

    def test_run_missing_user_id_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/run", json={"language": "python", "source": "x"})
        assert resp.status_code == 422

    def test_run_missing_language_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/run", json={"user_id": 1, "source": "x"})
        assert resp.status_code == 422

    def test_run_missing_source_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/run", json={"user_id": 1, "language": "python"})
        assert resp.status_code == 422

    def test_run_empty_source_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/run", json={"user_id": 1, "language": "python", "source": ""})
        assert resp.status_code == 422

    def test_run_invalid_user_id_zero_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/run", json={"user_id": 0, "language": "python", "source": "x"})
        assert resp.status_code == 422

    # ------------------------------------------------------------------
    # Runner cleanup called even on error
    # ------------------------------------------------------------------

    def test_run_cleanup_called_on_runner_exception(self, client: TestClient, db: Session):
        make_user(db)
        runner = MagicMock()
        runner.prepare.return_value = None
        runner.compile.return_value = None
        runner.run_testcase.side_effect = RuntimeError("sandbox crash")
        runner.cleanup.return_value = None
        with patch("app.api.v1.run._get_runner", return_value=runner):
            resp = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "x",
            })
        assert resp.status_code == 500
        runner.cleanup.assert_called_once()

    def test_run_not_implemented_runner_returns_501(self, client: TestClient, db: Session):
        make_user(db)
        runner = MagicMock()
        runner.prepare.side_effect = NotImplementedError("docker not implemented")
        with patch("app.api.v1.run._get_runner", return_value=runner):
            resp = client.post("/api/v1/run", json={
                "user_id": 1, "language": "python", "source": "x",
            })
        assert resp.status_code == 501
