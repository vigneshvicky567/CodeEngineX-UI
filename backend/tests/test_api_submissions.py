"""
API endpoint tests for:
  POST /api/v1/submit
  GET  /api/v1/submissions/{id}
  GET  /api/v1/submissions
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db import models
from tests.conftest import make_problem, make_submission, make_testcase, make_user


class TestSubmitEndpoint:
    # ------------------------------------------------------------------
    # Happy path
    # ------------------------------------------------------------------

    def test_submit_returns_202(self, client: TestClient, db: Session):
        make_user(db)
        p = make_problem(db, slug="submit-ep-ok")
        resp = client.post("/api/v1/submit", json={
            "user_id": 1, "problem_id": p.id,
            "language": "python", "source": "print(1)", "run_type": "submit",
        })
        assert resp.status_code == 202

    def test_submit_returns_submission_id(self, client: TestClient, db: Session):
        make_user(db)
        p = make_problem(db, slug="submit-ep-id")
        body = client.post("/api/v1/submit", json={
            "user_id": 1, "problem_id": p.id,
            "language": "python", "source": "print(1)",
        }).json()
        assert "submission_id" in body
        assert isinstance(body["submission_id"], int)
        assert body["submission_id"] > 0

    def test_submit_creates_queued_row(self, client: TestClient, db: Session):
        make_user(db)
        p = make_problem(db, slug="submit-ep-queue")
        resp = client.post("/api/v1/submit", json={
            "user_id": 1, "problem_id": p.id,
            "language": "cpp", "source": "#include<bits/stdc++.h>",
        })
        sub_id = resp.json()["submission_id"]
        sub = db.get(models.Submission, sub_id)
        assert sub is not None
        assert sub.status == "queued"
        assert sub.language == "cpp"

    def test_submit_run_type_run_is_stored(self, client: TestClient, db: Session):
        make_user(db)
        p = make_problem(db, slug="submit-ep-rtype")
        resp = client.post("/api/v1/submit", json={
            "user_id": 1, "problem_id": p.id,
            "language": "python", "source": "x", "run_type": "run",
        })
        sub_id = resp.json()["submission_id"]
        sub = db.get(models.Submission, sub_id)
        assert sub.run_type == "run"

    def test_submit_auto_creates_user(self, client: TestClient, db: Session):
        p = make_problem(db, slug="submit-ep-auto-u")
        resp = client.post("/api/v1/submit", json={
            "user_id": 888, "problem_id": p.id,
            "language": "python", "source": "x",
        })
        assert resp.status_code == 202
        user = db.get(models.User, 888)
        assert user is not None

    # ------------------------------------------------------------------
    # Error cases
    # ------------------------------------------------------------------

    def test_submit_nonexistent_problem_returns_404(self, client: TestClient, db: Session):
        make_user(db)
        resp = client.post("/api/v1/submit", json={
            "user_id": 1, "problem_id": 999999,
            "language": "python", "source": "x",
        })
        assert resp.status_code == 404

    def test_submit_missing_user_id_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/submit", json={
            "problem_id": 1, "language": "python", "source": "x",
        })
        assert resp.status_code == 422

    def test_submit_invalid_run_type_returns_422(self, client: TestClient, db: Session):
        make_user(db)
        p = make_problem(db, slug="submit-ep-badtype")
        resp = client.post("/api/v1/submit", json={
            "user_id": 1, "problem_id": p.id,
            "language": "python", "source": "x", "run_type": "judge",  # invalid
        })
        assert resp.status_code == 422

    def test_submit_empty_source_returns_422(self, client: TestClient, db: Session):
        make_user(db)
        p = make_problem(db, slug="submit-ep-nosrc")
        resp = client.post("/api/v1/submit", json={
            "user_id": 1, "problem_id": p.id,
            "language": "python", "source": "",
        })
        assert resp.status_code == 422


class TestGetSubmission:
    def test_get_existing_submission(self, client: TestClient, db: Session):
        u = make_user(db, user_id=2, username="getter")
        p = make_problem(db, slug="get-sub-ep")
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="accepted")
        resp = client.get(f"/api/v1/submissions/{sub.id}")
        assert resp.status_code == 200
        body = resp.json()
        assert body["id"] == sub.id
        assert body["status"] == "accepted"

    def test_get_submission_has_expected_fields(self, client: TestClient, db: Session):
        u = make_user(db, user_id=3, username="field_checker")
        p = make_problem(db, slug="fields-sub-ep")
        sub = make_submission(db, user_id=u.id, problem_id=p.id)
        body = client.get(f"/api/v1/submissions/{sub.id}").json()
        required = {"id", "user_id", "problem_id", "language", "status",
                    "run_type", "created_at", "updated_at", "test_results"}
        assert required.issubset(body.keys())

    def test_get_submission_includes_test_results(self, client: TestClient, db: Session):
        u = make_user(db, user_id=4, username="tr_checker")
        p = make_problem(db, slug="tr-sub-ep")
        tc = make_testcase(db, problem_id=p.id, ordinal=0)
        sub = make_submission(db, user_id=u.id, problem_id=p.id, status="accepted")
        tr = models.SubmissionTestResult(
            submission_id=sub.id, testcase_id=tc.id,
            status="accepted", time_ms=30, memory_kb=2048, stdout="out",
        )
        db.add(tr)
        db.flush()
        body = client.get(f"/api/v1/submissions/{sub.id}").json()
        assert len(body["test_results"]) == 1
        assert body["test_results"][0]["status"] == "accepted"
        assert body["test_results"][0]["stdout"] == "out"

    def test_get_nonexistent_submission_returns_404(self, client: TestClient):
        resp = client.get("/api/v1/submissions/9999999")
        assert resp.status_code == 404

    def test_get_submission_id_must_be_int(self, client: TestClient):
        resp = client.get("/api/v1/submissions/not-an-int")
        assert resp.status_code == 422


class TestListSubmissions:
    def test_list_returns_200(self, client: TestClient, db: Session):
        resp = client.get("/api/v1/submissions")
        assert resp.status_code == 200

    def test_list_response_shape(self, client: TestClient, db: Session):
        body = client.get("/api/v1/submissions").json()
        assert "total" in body
        assert "page" in body
        assert "limit" in body
        assert "items" in body
        assert isinstance(body["items"], list)

    def test_list_default_pagination_values(self, client: TestClient, db: Session):
        body = client.get("/api/v1/submissions").json()
        assert body["page"] == 1
        assert body["limit"] == 20

    def test_list_filter_by_user(self, client: TestClient, db: Session):
        u1 = make_user(db, user_id=10, username="filter_u1")
        u2 = make_user(db, user_id=11, username="filter_u2")
        p = make_problem(db, slug="list-filter-ep")
        make_submission(db, user_id=u1.id, problem_id=p.id)
        make_submission(db, user_id=u2.id, problem_id=p.id)
        body = client.get("/api/v1/submissions", params={"user_id": 10}).json()
        assert all(item["user_id"] == 10 for item in body["items"])

    def test_list_filter_by_problem(self, client: TestClient, db: Session):
        u = make_user(db, user_id=12, username="filter_prob")
        p1 = make_problem(db, slug="list-ep-p1")
        p2 = make_problem(db, slug="list-ep-p2")
        make_submission(db, user_id=u.id, problem_id=p1.id)
        make_submission(db, user_id=u.id, problem_id=p2.id)
        body = client.get("/api/v1/submissions", params={"problem_id": p1.id}).json()
        assert all(item["problem_id"] == p1.id for item in body["items"])

    def test_list_limit_respected(self, client: TestClient, db: Session):
        u = make_user(db, user_id=13, username="limit_user")
        p = make_problem(db, slug="list-limit-ep")
        for _ in range(5):
            make_submission(db, user_id=u.id, problem_id=p.id)
        body = client.get("/api/v1/submissions", params={"user_id": 13, "limit": 2}).json()
        assert len(body["items"]) <= 2

    def test_list_limit_out_of_range_returns_422(self, client: TestClient):
        resp = client.get("/api/v1/submissions", params={"limit": 200})
        assert resp.status_code == 422

    def test_list_page_zero_returns_422(self, client: TestClient):
        resp = client.get("/api/v1/submissions", params={"page": 0})
        assert resp.status_code == 422
