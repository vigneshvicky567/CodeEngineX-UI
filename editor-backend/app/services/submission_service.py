"""
Submission service — business logic for creating and querying submissions.
"""
from __future__ import annotations

import logging
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import Problem, Submission, SubmissionStatus, User
from app.schemas.submission import PaginatedSubmissions, SubmissionOut, SubmitRequest

logger = logging.getLogger(__name__)


def _ensure_user_exists(db: Session, user_id: int) -> User:
    """Fetch or auto-create a user row (for MVP convenience).

    TODO (production): remove auto-create; require authenticated user via JWT.
    """
    user = db.get(User, user_id)
    if not user:
        user = User(id=user_id, username=f"user_{user_id}")
        db.add(user)
        db.flush()
    return user


def create_submission(db: Session, req: SubmitRequest) -> Submission:
    """Validate and persist a new submission in 'queued' state."""
    _ensure_user_exists(db, req.user_id)

    problem = db.get(Problem, req.problem_id)
    if problem is None:
        raise ValueError(f"Problem {req.problem_id} not found.")

    submission = Submission(
        user_id=req.user_id,
        problem_id=req.problem_id,
        language=req.language,
        source_text=req.source,
        status=SubmissionStatus.queued.value,
        run_type=req.run_type,
    )
    db.add(submission)
    db.flush()  # populate submission.id before commit
    logger.info("Created submission %d for user %d / problem %d", submission.id, req.user_id, req.problem_id)
    return submission


def get_submission(db: Session, submission_id: int) -> Optional[Submission]:
    """Get a submission by id including test results (eager-ish via joined load)."""
    stmt = (
        select(Submission)
        .where(Submission.id == submission_id)
    )
    return db.scalars(stmt).first()


def list_submissions(
    db: Session,
    user_id: Optional[int],
    problem_id: Optional[int],
    page: int,
    limit: int,
) -> PaginatedSubmissions:
    """Return a paginated list of submissions, optionally filtered."""
    stmt = select(Submission)
    if user_id is not None:
        stmt = stmt.where(Submission.user_id == user_id)
    if problem_id is not None:
        stmt = stmt.where(Submission.problem_id == problem_id)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total: int = db.scalar(count_stmt) or 0

    stmt = stmt.order_by(Submission.created_at.desc()).offset((page - 1) * limit).limit(limit)
    rows = list(db.scalars(stmt))

    return PaginatedSubmissions(
        total=total,
        page=page,
        limit=limit,
        items=[SubmissionOut.model_validate(r) for r in rows],
    )
