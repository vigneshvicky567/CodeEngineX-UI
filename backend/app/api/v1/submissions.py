"""
GET /api/v1/submissions/{id} — retrieve a submission with test results.
GET /api/v1/submissions — paginated listing with optional filters.
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.db.models import Submission
from app.db.session import get_db
from app.schemas.submission import PaginatedSubmissions, SubmissionOut
from app.services.submission_service import get_submission, list_submissions

router = APIRouter()


@router.get(
    "/submissions/{submission_id}",
    response_model=SubmissionOut,
    summary="Get submission details including per-testcase results",
)
def get_submission_detail(submission_id: int, db: Session = Depends(get_db)) -> SubmissionOut:
    sub = db.query(Submission).options(
        joinedload(Submission.test_results)
    ).filter(Submission.id == submission_id).first()

    if sub is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found.")
    return SubmissionOut.model_validate(sub)


@router.get(
    "/submissions",
    response_model=PaginatedSubmissions,
    summary="List submissions with optional filtering",
)
def get_submissions(
    user_id: Optional[int] = Query(default=None, description="Filter by user"),
    problem_id: Optional[int] = Query(default=None, description="Filter by problem"),
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(default=20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
) -> PaginatedSubmissions:
    return list_submissions(db, user_id=user_id, problem_id=problem_id, page=page, limit=limit)
