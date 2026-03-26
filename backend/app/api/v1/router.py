"""
Central API router — aggregates all v1 endpoint routers.
"""
from fastapi import APIRouter

from app.api.v1 import problems, run, submissions, submit

router = APIRouter(prefix="/api/v1")

router.include_router(submit.router, tags=["submissions"])
router.include_router(run.router, tags=["run"])
router.include_router(submissions.router, tags=["submissions"])
router.include_router(problems.router, tags=["problems"])
