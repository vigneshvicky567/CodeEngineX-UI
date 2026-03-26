"""
Pydantic schemas for the quick-run endpoint.
"""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class RunRequest(BaseModel):
    user_id: int = Field(..., gt=0)
    language: str = Field(..., min_length=1, max_length=50)
    source: str = Field(..., min_length=1)
    stdin: Optional[str] = None
    persist: bool = False  # If True, store the run as a submission row


class RunResponse(BaseModel):
    status: str
    stdout: str
    stderr: str
    time_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    submission_id: Optional[int] = None  # populated when persist=True
