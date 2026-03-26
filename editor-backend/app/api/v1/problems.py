"""
GET  /api/v1/problems             — list all problems (lightweight).
GET  /api/v1/problems/{problem_id} — retrieve full problem metadata + testcase metadata.
POST /api/v1/problems              — create problem (admin endpoint, MVP, no auth).
PATCH /api/v1/problems/{problem_id} — update metadata of an existing problem.
"""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel

from app.db.models import JudgeType, Problem, TestCase
from app.db.session import get_db
from app.schemas.problem import ProblemCreateRequest, ProblemListItem, ProblemOut

router = APIRouter()
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Patch schema — all fields optional so you can update just what you need
# ---------------------------------------------------------------------------
class ProblemPatchRequest(BaseModel):
    title:               Optional[str] = None
    difficulty:          Optional[str] = None
    description:         Optional[str] = None
    examples_json:       Optional[str] = None
    constraints_json:    Optional[str] = None
    code_templates_json: Optional[str] = None
    time_limit_ms:       Optional[int] = None
    memory_limit_kb:     Optional[int] = None


@router.get(
    "/problems",
    response_model=list[ProblemListItem],
    summary="List all problems (lightweight)",
)
def list_problems(db: Session = Depends(get_db)) -> list[ProblemListItem]:
    """Returns id, slug, title, difficulty for all problems."""
    problems = db.query(Problem).order_by(Problem.id).all()
    return [ProblemListItem.model_validate(p) for p in problems]


@router.get(
    "/problems/{problem_id}",
    response_model=ProblemOut,
    summary="Get full problem data — description, examples, templates, testcases",
)
def get_problem(problem_id: int, db: Session = Depends(get_db)) -> ProblemOut:
    """Returns everything the frontend needs to render a problem."""
    problem = (
        db.query(Problem)
        .options(joinedload(Problem.testcases))
        .filter(Problem.id == problem_id)
        .first()
    )
    if problem is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")
    return ProblemOut.model_validate(problem)


@router.post(
    "/problems",
    response_model=ProblemOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new problem with testcases (admin)",
)
def create_problem(req: ProblemCreateRequest, db: Session = Depends(get_db)) -> ProblemOut:
    """
    Admin endpoint to create a problem and its testcases.
    """
    # Check for duplicate slug
    existing = db.query(Problem).filter(Problem.slug == req.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A problem with slug '{req.slug}' already exists.",
        )

    problem = Problem(
        slug=req.slug,
        title=req.title,
        difficulty=req.difficulty,
        description=req.description,
        examples_json=req.examples_json,
        constraints_json=req.constraints_json,
        code_templates_json=req.code_templates_json,
        time_limit_ms=req.time_limit_ms,
        memory_limit_kb=req.memory_limit_kb,
        judge_type=JudgeType(req.judge_type),
    )
    db.add(problem)
    db.flush()  # get the auto-generated id

    for tc_in in req.testcases:
        tc = TestCase(
            problem_id=problem.id,
            ordinal=tc_in.ordinal,
            input_text=tc_in.input_text,
            output_text=tc_in.output_text,
            is_hidden=tc_in.is_hidden,
        )
        db.add(tc)

    db.commit()
    db.refresh(problem)

    # Re-fetch with joined testcases for response
    problem = (
        db.query(Problem)
        .options(joinedload(Problem.testcases))
        .filter(Problem.id == problem.id)
        .first()
    )
    logger.info("Created problem %d: %s", problem.id, problem.slug)
    return ProblemOut.model_validate(problem)


@router.patch(
    "/problems/{problem_id}",
    response_model=ProblemOut,
    summary="Update metadata of an existing problem (admin)",
)
def patch_problem(
    problem_id: int,
    req: ProblemPatchRequest,
    db: Session = Depends(get_db),
) -> ProblemOut:
    """Partial update — only the fields you send are changed."""
    problem = (
        db.query(Problem)
        .options(joinedload(Problem.testcases))
        .filter(Problem.id == problem_id)
        .first()
    )
    if problem is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

    update_data = req.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(problem, field, value)

    db.commit()
    db.refresh(problem)

    problem = (
        db.query(Problem)
        .options(joinedload(Problem.testcases))
        .filter(Problem.id == problem_id)
        .first()
    )
    logger.info("Patched problem %d", problem_id)
    return ProblemOut.model_validate(problem)
