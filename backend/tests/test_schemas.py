"""
Unit tests for Pydantic schemas — validation rules, defaults, error cases.
"""
from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.submission import SubmitRequest, SubmissionOut
from app.schemas.problem import ProblemCreateRequest, TestCaseIn
from app.schemas.run import RunRequest, RunResponse


# ---------------------------------------------------------------------------
# SubmitRequest
# ---------------------------------------------------------------------------

class TestSubmitRequest:
    def test_valid_request(self):
        req = SubmitRequest(user_id=1, problem_id=2, language="python", source="print(1)")
        assert req.run_type == "submit"  # default

    def test_valid_run_type_run(self):
        req = SubmitRequest(user_id=1, problem_id=2, language="python", source="x", run_type="run")
        assert req.run_type == "run"

    def test_invalid_run_type_raises(self):
        with pytest.raises(ValidationError):
            SubmitRequest(user_id=1, problem_id=2, language="python", source="x", run_type="invalid")

    def test_user_id_must_be_positive(self):
        with pytest.raises(ValidationError):
            SubmitRequest(user_id=0, problem_id=2, language="python", source="x")

    def test_problem_id_must_be_positive(self):
        with pytest.raises(ValidationError):
            SubmitRequest(user_id=1, problem_id=-1, language="python", source="x")

    def test_source_cannot_be_empty(self):
        with pytest.raises(ValidationError):
            SubmitRequest(user_id=1, problem_id=2, language="python", source="")

    def test_language_cannot_be_empty(self):
        with pytest.raises(ValidationError):
            SubmitRequest(user_id=1, problem_id=2, language="", source="print(1)")

    def test_language_max_length(self):
        with pytest.raises(ValidationError):
            SubmitRequest(user_id=1, problem_id=2, language="x" * 51, source="x")


# ---------------------------------------------------------------------------
# RunRequest
# ---------------------------------------------------------------------------

class TestRunRequest:
    def test_defaults(self):
        req = RunRequest(user_id=1, language="python", source="print(1)")
        assert req.stdin is None
        assert req.persist is False

    def test_persist_flag(self):
        req = RunRequest(user_id=1, language="python", source="x", persist=True)
        assert req.persist is True

    def test_stdin_accepted(self):
        req = RunRequest(user_id=1, language="python", source="x", stdin="hello")
        assert req.stdin == "hello"

    def test_user_id_must_be_positive(self):
        with pytest.raises(ValidationError):
            RunRequest(user_id=0, language="python", source="x")

    def test_source_cannot_be_empty(self):
        with pytest.raises(ValidationError):
            RunRequest(user_id=1, language="python", source="")


# ---------------------------------------------------------------------------
# ProblemCreateRequest
# ---------------------------------------------------------------------------

class TestProblemCreateRequest:
    def test_defaults(self):
        req = ProblemCreateRequest(slug="hello", title="Hello World")
        assert req.time_limit_ms == 1000
        assert req.memory_limit_kb == 262144
        assert req.judge_type == "normal"
        assert req.testcases == []

    def test_judge_type_enum_values(self):
        for jt in ("normal", "special", "interactive"):
            req = ProblemCreateRequest(slug="x", title="T", judge_type=jt)
            assert req.judge_type == jt

    def test_invalid_judge_type(self):
        with pytest.raises(ValidationError):
            ProblemCreateRequest(slug="x", title="T", judge_type="unknown")

    def test_time_limit_min_bound(self):
        with pytest.raises(ValidationError):
            ProblemCreateRequest(slug="x", title="T", time_limit_ms=99)

    def test_time_limit_max_bound(self):
        with pytest.raises(ValidationError):
            ProblemCreateRequest(slug="x", title="T", time_limit_ms=30_001)

    def test_memory_limit_min_bound(self):
        with pytest.raises(ValidationError):
            ProblemCreateRequest(slug="x", title="T", memory_limit_kb=1023)

    def test_slug_cannot_be_empty(self):
        with pytest.raises(ValidationError):
            ProblemCreateRequest(slug="", title="T")

    def test_testcases_included(self):
        req = ProblemCreateRequest(
            slug="x", title="T",
            testcases=[TestCaseIn(ordinal=0, input_text="a", output_text="b")]
        )
        assert len(req.testcases) == 1


# ---------------------------------------------------------------------------
# RunResponse
# ---------------------------------------------------------------------------

class TestRunResponse:
    def test_all_fields_optional_except_status_stdout_stderr(self):
        resp = RunResponse(status="accepted", stdout="hi", stderr="")
        assert resp.time_ms is None
        assert resp.memory_kb is None
        assert resp.submission_id is None

    def test_all_fields_populated(self):
        resp = RunResponse(
            status="accepted", stdout="hi", stderr="",
            time_ms=42, memory_kb=1024, submission_id=7
        )
        assert resp.time_ms == 42
        assert resp.memory_kb == 1024
        assert resp.submission_id == 7
