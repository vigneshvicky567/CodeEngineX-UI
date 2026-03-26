"""
Pydantic schemas for Problem-related requests and responses.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------


class TestCaseIn(BaseModel):
    ordinal: int = Field(..., ge=0)
    input_text: Optional[str] = None
    output_text: Optional[str] = None
    is_hidden: bool = False


class ProblemCreateRequest(BaseModel):
    slug: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=255)
    difficulty: str = Field(default="easy", description="easy | medium | hard")
    description: str = Field(default="", description="Problem statement (markdown)")
    examples_json: str = Field(default="[]", description='JSON array of {input, output, explanation?}')
    constraints_json: str = Field(default="[]", description="JSON array of constraint strings")
    code_templates_json: str = Field(default="{}", description='JSON dict {lang: template_code}')
    time_limit_ms: int = Field(default=1_000, ge=100, le=30_000)
    memory_limit_kb: int = Field(default=262_144, ge=1024, le=524_288)
    judge_type: Literal["normal", "special", "interactive"] = "normal"
    testcases: list[TestCaseIn] = []


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------


class TestCaseOut(BaseModel):
    id: int
    ordinal: int
    is_hidden: bool
    # Expose input_text for visible testcases so the frontend can pre-fill
    # custom input. output_text is kept hidden to avoid spoiling answers.
    input_text: Optional[str] = None

    model_config = {"from_attributes": True}


class ProblemListItem(BaseModel):
    """Lightweight item for the problem list endpoint."""
    id: int
    slug: str
    title: str
    difficulty: str

    model_config = {"from_attributes": True}


class ProblemOut(BaseModel):
    """Full problem data — returned by GET /problems/{id}."""
    id: int
    slug: str
    title: str
    difficulty: str
    description: str
    examples_json: str
    constraints_json: str
    code_templates_json: str
    time_limit_ms: int
    memory_limit_kb: int
    judge_type: str
    created_at: datetime
    testcases: list[TestCaseOut] = []

    model_config = {"from_attributes": True}
