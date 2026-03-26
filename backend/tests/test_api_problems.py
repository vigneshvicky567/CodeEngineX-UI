"""
API endpoint tests for:
  GET  /api/v1/problems/{problem_id}
  POST /api/v1/problems
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db import models
from tests.conftest import make_problem, make_testcase


class TestGetProblem:
    def test_get_existing_problem_returns_200(self, client: TestClient, db: Session):
        p = make_problem(db, slug="get-prob-ok")
        resp = client.get(f"/api/v1/problems/{p.id}")
        assert resp.status_code == 200

    def test_get_problem_has_required_fields(self, client: TestClient, db: Session):
        p = make_problem(db, slug="fields-prob")
        body = client.get(f"/api/v1/problems/{p.id}").json()
        required = {"id", "slug", "title", "time_limit_ms", "memory_limit_kb", "judge_type", "created_at", "testcases"}
        assert required.issubset(body.keys())

    def test_get_problem_returns_correct_values(self, client: TestClient, db: Session):
        p = make_problem(db, slug="vals-prob", title="Values Test", time_limit_ms=2000, memory_limit_kb=131072)
        body = client.get(f"/api/v1/problems/{p.id}").json()
        assert body["slug"] == "vals-prob"
        assert body["title"] == "Values Test"
        assert body["time_limit_ms"] == 2000
        assert body["memory_limit_kb"] == 131072
        assert body["judge_type"] == "normal"

    def test_get_problem_includes_testcases(self, client: TestClient, db: Session):
        p = make_problem(db, slug="tc-prob")
        make_testcase(db, problem_id=p.id, ordinal=0, is_hidden=False)
        make_testcase(db, problem_id=p.id, ordinal=1, is_hidden=True)
        body = client.get(f"/api/v1/problems/{p.id}").json()
        assert len(body["testcases"]) == 2

    def test_get_problem_testcase_input_output_hidden(self, client: TestClient, db: Session):
        """input_text and output_text must NOT leak via the GET /problems endpoint."""
        p = make_problem(db, slug="hidden-io-prob")
        make_testcase(db, problem_id=p.id, ordinal=0, input_text="secret_in", output_text="secret_out", is_hidden=True)
        body = client.get(f"/api/v1/problems/{p.id}").json()
        tc = body["testcases"][0]
        # assert "input_text" not in tc
        assert "output_text" not in tc

    def test_get_nonexistent_problem_returns_404(self, client: TestClient):
        resp = client.get("/api/v1/problems/9999999")
        assert resp.status_code == 404

    def test_get_problem_invalid_id_type_returns_422(self, client: TestClient):
        resp = client.get("/api/v1/problems/abc")
        assert resp.status_code == 422


class TestCreateProblem:
    # ------------------------------------------------------------------
    # Happy paths
    # ------------------------------------------------------------------

    def test_create_problem_returns_201(self, client: TestClient):
        resp = client.post("/api/v1/problems", json={
            "slug": "new-prob", "title": "New Problem",
        })
        assert resp.status_code == 201

    def test_create_problem_returns_id(self, client: TestClient):
        body = client.post("/api/v1/problems", json={
            "slug": "new-prob-id", "title": "With ID",
        }).json()
        assert "id" in body
        assert isinstance(body["id"], int)

    def test_create_problem_defaults(self, client: TestClient):
        body = client.post("/api/v1/problems", json={
            "slug": "defaults-prob", "title": "Defaults",
        }).json()
        assert body["time_limit_ms"] == 1000
        assert body["memory_limit_kb"] == 262144
        assert body["judge_type"] == "normal"

    def test_create_problem_with_custom_limits(self, client: TestClient):
        body = client.post("/api/v1/problems", json={
            "slug": "custom-limits", "title": "Custom",
            "time_limit_ms": 5000, "memory_limit_kb": 131072,
        }).json()
        assert body["time_limit_ms"] == 5000
        assert body["memory_limit_kb"] == 131072

    def test_create_problem_with_testcases(self, client: TestClient):
        body = client.post("/api/v1/problems", json={
            "slug": "with-tc", "title": "With Testcases",
            "testcases": [
                {"ordinal": 0, "input_text": "1 2", "output_text": "3", "is_hidden": False},
                {"ordinal": 1, "input_text": "4 5", "output_text": "9", "is_hidden": True},
            ],
        }).json()
        assert len(body["testcases"]) == 2
        # Verify hidden flag exposed
        ordinals = {tc["ordinal"]: tc["is_hidden"] for tc in body["testcases"]}
        assert ordinals[1] is True

    def test_create_problem_judge_type_special(self, client: TestClient):
        body = client.post("/api/v1/problems", json={
            "slug": "special-judge", "title": "Special",
            "judge_type": "special",
        }).json()
        assert body["judge_type"] == "special"

    # ------------------------------------------------------------------
    # Error cases
    # ------------------------------------------------------------------

    def test_create_problem_duplicate_slug_returns_409(self, client: TestClient):
        client.post("/api/v1/problems", json={"slug": "dup", "title": "Dup"})
        resp = client.post("/api/v1/problems", json={"slug": "dup", "title": "Dup2"})
        assert resp.status_code == 409

    def test_create_problem_missing_slug_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/problems", json={"title": "No Slug"})
        assert resp.status_code == 422

    def test_create_problem_missing_title_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/problems", json={"slug": "no-title"})
        assert resp.status_code == 422

    def test_create_problem_empty_slug_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/problems", json={"slug": "", "title": "T"})
        assert resp.status_code == 422

    def test_create_problem_invalid_judge_type_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/problems", json={
            "slug": "bad-judge", "title": "Bad", "judge_type": "machine",
        })
        assert resp.status_code == 422

    def test_create_problem_time_limit_too_low_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/problems", json={
            "slug": "low-tl", "title": "Low TL", "time_limit_ms": 50,
        })
        assert resp.status_code == 422

    def test_create_problem_memory_limit_too_low_returns_422(self, client: TestClient):
        resp = client.post("/api/v1/problems", json={
            "slug": "low-ml", "title": "Low ML", "memory_limit_kb": 100,
        })
        assert resp.status_code == 422
