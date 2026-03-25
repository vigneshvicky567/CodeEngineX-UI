"""
Integration test stubs for the RCE API.

Run with: pytest tests/ -v

These tests require a running API server. Set TEST_API_URL env var
(default: http://localhost:8000).

TODO (full integration tests):
  - Use docker-compose test profile or pytest-docker fixture.
  - Mock Judge0 HTTP calls with respx or httpretty.
  - Add fixtures to seed a problem row before submission tests.
"""
from __future__ import annotations

import os

import pytest

API_URL = os.getenv("TEST_API_URL", "http://localhost:8000")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _client():
    """Return an httpx client pointing at the API."""
    try:
        import httpx
        return httpx.Client(base_url=API_URL, timeout=15)
    except ImportError:
        pytest.skip("httpx not installed")


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------


def test_health_check():
    """GET /health should return 200 with status=ok."""
    with _client() as c:
        try:
            resp = c.get("/health")
        except Exception as exc:
            pytest.skip(f"API server not reachable: {exc}")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert "version" in body


# ---------------------------------------------------------------------------
# Quick Run endpoint
# ---------------------------------------------------------------------------


def test_run_returns_expected_shape():
    """
    POST /api/v1/run with a simple Python Hello World.

    Checks that the response contains all required fields.
    This test will SKIP if the API server is not running or Judge0 is
    not configured.
    """
    with _client() as c:
        try:
            resp = c.post(
                "/api/v1/run",
                json={
                    "user_id": 1,
                    "language": "python",
                    "source": 'print("Hello, world!")',
                    "stdin": None,
                    "persist": False,
                },
            )
        except Exception as exc:
            pytest.skip(f"API server not reachable: {exc}")

    # Accept 200 (success) or 501 (runner not configured)
    assert resp.status_code in (200, 501), f"Unexpected status: {resp.status_code}\n{resp.text}"

    if resp.status_code == 200:
        body = resp.json()
        required_fields = {"status", "stdout", "stderr"}
        assert required_fields.issubset(body.keys()), f"Missing fields in response: {body}"
        # Optional fields should be present (may be None)
        assert "time_ms" in body
        assert "memory_kb" in body


# ---------------------------------------------------------------------------
# Submit endpoint (requires a problem row in DB)
# ---------------------------------------------------------------------------


def test_submit_nonexistent_problem_returns_404():
    """POST /api/v1/submit for a non-existent problem should return 404."""
    with _client() as c:
        try:
            resp = c.post(
                "/api/v1/submit",
                json={
                    "user_id": 1,
                    "problem_id": 999999,
                    "language": "python",
                    "source": "print(1)",
                    "run_type": "submit",
                },
            )
        except Exception as exc:
            pytest.skip(f"API server not reachable: {exc}")

    assert resp.status_code == 404


def test_submissions_list_returns_paginated():
    """GET /api/v1/submissions should return a paginated response shape."""
    with _client() as c:
        try:
            resp = c.get("/api/v1/submissions", params={"page": 1, "limit": 5})
        except Exception as exc:
            pytest.skip(f"API server not reachable: {exc}")

    assert resp.status_code == 200
    body = resp.json()
    assert "total" in body
    assert "page" in body
    assert "limit" in body
    assert "items" in body
    assert isinstance(body["items"], list)
