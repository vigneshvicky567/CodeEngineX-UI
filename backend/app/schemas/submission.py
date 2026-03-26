"""
Pydantic schemas for Submission-related requests and responses.
"""
from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------


class SubmitRequest(BaseModel):
    user_id: int = Field(..., gt=0)
    problem_id: int = Field(..., gt=0)
    language: str = Field(..., min_length=1, max_length=50)
    source: str = Field(..., min_length=1)
    run_type: Literal["run", "submit"] = "submit"


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------


class SubmitResponse(BaseModel):
    submission_id: int


class TestResultOut(BaseModel):
    id: int
    testcase_id: int
    status: str
    time_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    stdout: Optional[str] = None

    model_config = {"from_attributes": True}


class SubmissionOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    problem_id: Optional[int] = None
    language: str
    status: str
    time_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    run_type: str
    created_at: datetime
    updated_at: datetime
    test_results: list[TestResultOut] = []

    model_config = {"from_attributes": True}


class PaginatedSubmissions(BaseModel):
    total: int
    page: int
    limit: int
    items: list[SubmissionOut]
