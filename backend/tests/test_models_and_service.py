"""
Tests for ORM models + the submission service business logic.

Uses the transactional `db` fixture from conftest.py (SQLite in-memory).
"""
from __future__ import annotations

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import models
from app.schemas.submission import SubmitRequest
from app.services import submission_service
from tests.conftest import make_problem, make_submission, make_testcase, make_user


# ---------------------------------------------------------------------------
# User model
# ---------------------------------------------------------------------------

class TestUserModel:
    def test_create_user(self, db: Session):
        u = make_user(db, user_id=10, username="bob")
        assert u.id == 10
        assert u.username == "bob"

    def test_username_must_be_unique(self, db: Session):
        make_user(db, user_id=20, username="unique_alice")
        db.add(models.User(id=21, username="unique_alice"))
        with pytest.raises(Exception):  # IntegrityError under Postgres, generic under SQLite
            db.flush()


# ---------------------------------------------------------------------------
# Problem model
# ---------------------------------------------------------------------------

class TestProblemModel:
    def test_create_problem(self, db: Session):
        p = make_problem(db, slug="fib", title="Fibonacci")
        assert p.id is not None
        assert p.slug == "fib"
        assert p.time_limit_ms == 1000

    def test_slug_must_be_unique(self, db: Session):
        make_problem(db, slug="dup-slug")
        db.add(models.Problem(
            slug="dup-slug", title="Another",
            time_limit_ms=1000, memory_limit_kb=262144,
            judge_type=models.JudgeType.normal,
        ))
        with pytest.raises(Exception):
            db.flush()

    def test_judge_type_enum_normal(self, db: Session):
        p = make_problem(db, slug="normal-judge")
        assert p.judge_type == models.JudgeType.normal


# ---------------------------------------------------------------------------
# TestCase model
# ---------------------------------------------------------------------------

class TestTestCaseModel:
    def test_create_testcase(self, db: Session):
        p = make_problem(db, slug="tc-test")
        tc = make_testcase(db, problem_id=p.id, ordinal=0, input_text="1", output_text="1")
        assert tc.id is not None
        assert tc.problem_id == p.id
        assert tc.is_hidden is False

    def test_hidden_testcase(self, db: Session):
        p = make_problem(db, slug="tc-hidden")
        tc = make_testcase(db, problem_id=p.id, ordinal=0, is_hidden=True)
        assert tc.is_hidden is True

    def test_testcase_without_output(self, db: Session):
        p = make_problem(db, slug="tc-no-out")
        tc = make_testcase(db, problem_id=p.id, ordinal=0, input_text="abc", output_text=None)
        assert tc.output_text is None


# ---------------------------------------------------------------------------
# Submission model
# ---------------------------------------------------------------------------

class TestSubmissionModel:
    def test_create_submission(self, db: Session):
        u = make_user(db)
        p = make_problem(db, slug="submit-test")
        sub = make_submission(db, user_id=u.id, problem_id=p.id)
        assert sub.id is not None
        assert sub.status == "queued"
        assert sub.run_type == "submit"

    def test_submission_without_problem(self, db: Session):
        u = make_user(db)
        sub = make_submission(db, user_id=u.id, problem_id=None, run_type="run")
        assert sub.problem_id is None

    def test_submission_status_default(self, db: Session):
        u = make_user(db)
        p = make_problem(db, slug="default-sub")
        sub = make_submission(db, user_id=u.id, problem_id=p.id)
        assert sub.status == models.SubmissionStatus.queued.value


# ---------------------------------------------------------------------------
# SubmissionTestResult model
# ---------------------------------------------------------------------------

class TestSubmissionTestResultModel:
    def test_create_test_result(self, db: Session):
        u = make_user(db)
        p = make_problem(db, slug="str-test")
        tc = make_testcase(db, problem_id=p.id, ordinal=0)
        sub = make_submission(db, user_id=u.id, problem_id=p.id)
        result = models.SubmissionTestResult(
            submission_id=sub.id,
            testcase_id=tc.id,
            status="accepted",
            time_ms=50,
            memory_kb=4096,
            stdout="3\n",
        )
        db.add(result)
        db.flush()
        assert result.id is not None
        assert result.status == "accepted"


# ---------------------------------------------------------------------------
# Submission service
# ---------------------------------------------------------------------------

class TestSubmissionService:
    def test_create_submission_success(self, db: Session):
        make_user(db)
        p = make_problem(db, slug="svc-test")
        req = SubmitRequest(user_id=1, problem_id=p.id, language="python", source="print(1)")
        sub = submission_service.create_submission(db, req)
        assert sub.id is not None
        assert sub.status == "queued"
        assert sub.source_text == "print(1)"

    def test_create_submission_auto_creates_user(self, db: Session):
        # No pre-seeded user — service should auto-create one
        p = make_problem(db, slug="auto-user-svc")
        req = SubmitRequest(user_id=999, problem_id=p.id, language="python", source="x")
        sub = submission_service.create_submission(db, req)
        assert sub.user_id == 999
        user = db.get(models.User, 999)
        assert user is not None

    def test_create_submission_missing_problem_raises(self, db: Session):
        make_user(db)
        req = SubmitRequest(user_id=1, problem_id=99999, language="python", source="x")
        with pytest.raises(ValueError, match="not found"):
            submission_service.create_submission(db, req)

    def test_get_submission_existing(self, db: Session):
        u = make_user(db)
        p = make_problem(db, slug="get-svc-test")
        sub = make_submission(db, user_id=u.id, problem_id=p.id)
        found = submission_service.get_submission(db, sub.id)
        assert found is not None
        assert found.id == sub.id

    def test_get_submission_nonexistent_returns_none(self, db: Session):
        result = submission_service.get_submission(db, 9999999)
        assert result is None

    def test_list_submissions_no_filter(self, db: Session):
        u = make_user(db)
        p = make_problem(db, slug="list-svc")
        make_submission(db, user_id=u.id, problem_id=p.id)
        make_submission(db, user_id=u.id, problem_id=p.id)
        result = submission_service.list_submissions(db, user_id=None, problem_id=None, page=1, limit=10)
        assert result.total >= 2
        assert len(result.items) >= 2

    def test_list_submissions_filtered_by_user(self, db: Session):
        u1 = make_user(db, user_id=5, username="filtered_user_1")
        u2 = make_user(db, user_id=6, username="filtered_user_2")
        p = make_problem(db, slug="filter-user-svc")
        make_submission(db, user_id=u1.id, problem_id=p.id)
        make_submission(db, user_id=u2.id, problem_id=p.id)
        result = submission_service.list_submissions(db, user_id=5, problem_id=None, page=1, limit=10)
        assert all(item.user_id == 5 for item in result.items)

    def test_list_submissions_pagination(self, db: Session):
        u = make_user(db, user_id=7, username="paginate_user")
        p = make_problem(db, slug="paginate-svc")
        for _ in range(5):
            make_submission(db, user_id=u.id, problem_id=p.id)
        page1 = submission_service.list_submissions(db, user_id=7, problem_id=None, page=1, limit=3)
        page2 = submission_service.list_submissions(db, user_id=7, problem_id=None, page=2, limit=3)
        assert len(page1.items) == 3
        assert len(page2.items) == 2  # 5 total, 3 on page 1, 2 on page 2
        assert page1.items[0].id != page2.items[0].id
