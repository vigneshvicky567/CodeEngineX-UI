"""
Application configuration — all values drawn from environment variables (12-factor).
"""
from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore")

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------
    DATABASE_URL: str = Field(
        default="postgresql+psycopg2://rce:rce_password@localhost:5432/rce_db",
        description="SQLAlchemy-compatible DB URL.",
    )

    # ------------------------------------------------------------------
    # API
    # ------------------------------------------------------------------
    APP_TITLE: str = "RCE Backend MVP"
    APP_VERSION: str = "0.1.0"
    PORT: int = 8000
    DEBUG: bool = False

    # ------------------------------------------------------------------
    # Runner selection
    # ------------------------------------------------------------------
    RUNNER: Literal["judge0", "docker"] = "judge0"

    # ------------------------------------------------------------------
    # Judge0
    # ------------------------------------------------------------------
    JUDGE0_URL: str = "https://judge0-ce.p.rapidapi.com"
    JUDGE0_API_KEY: str = ""
    JUDGE0_TIMEOUT_S: int = 30  # HTTP request timeout

    # ------------------------------------------------------------------
    # Default resource limits (conservative MVP defaults)
    # ------------------------------------------------------------------
    DEFAULT_TIME_LIMIT_MS: int = 1_000          # 1 second
    DEFAULT_MEMORY_LIMIT_KB: int = 262_144      # 256 MB
    OUTPUT_LIMIT_BYTES: int = 10 * 1024 * 1024  # 10 MB

    # ------------------------------------------------------------------
    # Worker
    # ------------------------------------------------------------------
    WORKER_POLL_INTERVAL_S: float = 2.0  # seconds between polls


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings: Settings = get_settings()
