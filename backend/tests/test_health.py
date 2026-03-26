"""
Tests for the health endpoint and basic app config.
"""
from __future__ import annotations

from fastapi.testclient import TestClient


class TestHealthEndpoint:
    def test_health_returns_200(self, client: TestClient):
        resp = client.get("/health")
        assert resp.status_code == 200

    def test_health_body_has_status_ok(self, client: TestClient):
        body = client.get("/health").json()
        assert body["status"] == "ok"

    def test_health_body_has_version(self, client: TestClient):
        body = client.get("/health").json()
        assert "version" in body
        assert isinstance(body["version"], str)

    def test_openapi_schema_accessible(self, client: TestClient):
        resp = client.get("/openapi.json")
        assert resp.status_code == 200
        schema = resp.json()
        # Must have at minimum 5 paths
        assert len(schema["paths"]) >= 5

    def test_docs_accessible(self, client: TestClient):
        resp = client.get("/docs")
        assert resp.status_code == 200

    def test_unknown_route_returns_404(self, client: TestClient):
        resp = client.get("/does-not-exist")
        assert resp.status_code == 404
