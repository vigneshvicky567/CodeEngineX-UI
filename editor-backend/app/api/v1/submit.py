"""
POST /api/v1/submit — queue a submission for async processing.
"""
from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.submission import SubmitRequest, SubmitResponse
from app.services.submission_service import create_submission

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(
    "/submit",
    response_model=SubmitResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Submit code for async judging",
)
def submit(req: SubmitRequest, db: Session = Depends(get_db)) -> SubmitResponse:
    """
    Queue a submission for background evaluation.

    - Validates that the problem exists.
    - Inserts a submission row with `status=queued`.
    - Returns the `submission_id` immediately; poll `GET /submissions/{id}` for results.
    """
    try:
        submission = create_submission(db, req)
        db.commit()
        return SubmitResponse(submission_id=submission.id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        db.rollback()
        logger.exception("Unexpected error creating submission")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
