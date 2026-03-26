"""
ORM models for the RCE system.

All timestamps default to the server's current UTC time via server_default.
"""
from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Text,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class JudgeType(str, enum.Enum):
    normal = "normal"
    special = "special"
    interactive = "interactive"


class SubmissionStatus(str, enum.Enum):
    queued = "queued"
    running = "running"
    accepted = "accepted"
    wrong_answer = "wrong_answer"
    tle = "tle"
    mle = "mle"
    runtime_error = "runtime_error"
    compile_error = "compile_error"
    system_error = "system_error"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    submissions: Mapped[list["Submission"]] = relationship(back_populates="user")


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(Text, nullable=False, default="easy")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    examples_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    constraints_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    code_templates_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    time_limit_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=1_000)
    memory_limit_kb: Mapped[int] = mapped_column(Integer, nullable=False, default=262_144)
    judge_type: Mapped[JudgeType] = mapped_column(
        Enum(JudgeType, name="judge_type_enum"), nullable=False, default=JudgeType.normal
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    testcases: Mapped[list["TestCase"]] = relationship(back_populates="problem", order_by="TestCase.ordinal")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="problem")


class TestCase(Base):
    __tablename__ = "testcases"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    problem_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("problems.id", ondelete="CASCADE"), nullable=False)
    ordinal: Mapped[int] = mapped_column(Integer, nullable=False)
    input_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    output_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    problem: Mapped["Problem"] = relationship(back_populates="testcases")
    test_results: Mapped[list["SubmissionTestResult"]] = relationship(back_populates="testcase")

    __table_args__ = (
        Index("ix_testcases_problem_id", "problem_id"),
    )


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    problem_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("problems.id", ondelete="SET NULL"), nullable=True
    )
    language: Mapped[str] = mapped_column(Text, nullable=False)
    source_s3_key: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Text, nullable=False, default=SubmissionStatus.queued.value)
    time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    memory_kb: Mapped[int | None] = mapped_column(Integer, nullable=True)
    run_type: Mapped[str] = mapped_column(Text, nullable=False, default="submit")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="submissions")
    problem: Mapped["Problem"] = relationship(back_populates="submissions")
    test_results: Mapped[list["SubmissionTestResult"]] = relationship(back_populates="submission")

    __table_args__ = (
        Index("ix_submissions_user_id", "user_id"),
        Index("ix_submissions_problem_id", "problem_id"),
        Index("ix_submissions_created_at_desc", "created_at"),
    )


class SubmissionTestResult(Base):
    __tablename__ = "submission_test_results"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    submission_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False
    )
    testcase_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("testcases.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(Text, nullable=False)
    time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    memory_kb: Mapped[int | None] = mapped_column(Integer, nullable=True)
    stdout: Mapped[str | None] = mapped_column(Text, nullable=True)

    submission: Mapped["Submission"] = relationship(back_populates="test_results")
    testcase: Mapped["TestCase"] = relationship(back_populates="test_results")

    __table_args__ = (
        Index("ix_str_submission_id", "submission_id"),
    )
