import os

# Point settings at SQLite BEFORE any app import so config is resolved once.
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("RUNNER", "judge0")
os.environ.setdefault("JUDGE0_URL", "http://fake-judge0")
os.environ.setdefault("JUDGE0_API_KEY", "test-key")

from datetime import datetime, timezone
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, Integer, BigInteger, inspect, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db import models  # noqa: F401 — register all mappers


# ---------------------------------------------------------------------------
# SQLite engine — use StaticPool + single connection for in-memory persistence
# ---------------------------------------------------------------------------

SQLITE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLITE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # same in-memory DB shared across all connections
)

# Enable FK enforcement in SQLite (off by default)
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_conn, _connection_record):
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# Patch BigInteger → Integer so SQLite auto-increments work correctly.
# SQLite only auto-increments INTEGER PRIMARY KEY, not BIGINT.
from sqlalchemy import BigInteger as _BigInteger
from sqlalchemy.dialects import sqlite as _sqlite_dialect

_BigInteger = _BigInteger().with_variant(_sqlite_dialect.INTEGER(), "sqlite")


def _patch_big_integer():
    """Replace BigInteger columns with Integer on the mapped metadata for SQLite."""
    from sqlalchemy import Integer as SAInteger
    from sqlalchemy.dialects.sqlite import INTEGER as SQLiteINTEGER
    for table in Base.metadata.tables.values():
        for col in table.columns:
            if isinstance(col.type, BigInteger):
                col.type = SAInteger()


_patch_big_integer()


TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


@pytest.fixture(scope="session", autouse=True)
def create_tables():
    """Create all tables once for the entire test session."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db() -> Generator[Session, None, None]:
    """
    Provide a clean DB session for each test by truncating all tables before
    the test runs.  This avoids UNIQUE-constraint bleed-over between tests
    while keeping the StaticPool / single-connection setup that lets the
    in-memory SQLite DB persist across fixtures.
    """
    # Truncate every table in dependency order (children first)
    with engine.begin() as conn:
        # Disable FK checks so we can truncate in any order
        conn.execute(text("PRAGMA foreign_keys=OFF"))
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())
        conn.execute(text("PRAGMA foreign_keys=ON"))

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


# ---------------------------------------------------------------------------
# FastAPI test client with overridden DB session
# ---------------------------------------------------------------------------

@pytest.fixture()
def client(db: Session) -> Generator[TestClient, None, None]:
    """
    TestClient with the DB dependency overridden to the transactional session.
    Each test gets a clean rollback.
    """
    from app.main import app
    from app.db.session import get_db

    def _override_get_db():
        try:
            yield db
        finally:
            pass  # session lifecycle managed by the `db` fixture

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Common DB seed helpers
# ---------------------------------------------------------------------------

def make_user(db: Session, *, user_id: int = 1, username: str = "alice") -> models.User:
    u = models.User(id=user_id, username=username)
    db.add(u)
    db.flush()
    return u


def make_problem(
    db: Session,
    *,
    slug: str = "two-sum",
    title: str = "Two Sum",
    time_limit_ms: int = 1000,
    memory_limit_kb: int = 262144,
) -> models.Problem:
    p = models.Problem(
        slug=slug,
        title=title,
        time_limit_ms=time_limit_ms,
        memory_limit_kb=memory_limit_kb,
        judge_type=models.JudgeType.normal,
    )
    db.add(p)
    db.flush()
    return p


def make_testcase(
    db: Session,
    *,
    problem_id: int,
    ordinal: int = 0,
    input_text: str = "1 2",
    output_text: str = "3",
    is_hidden: bool = False,
) -> models.TestCase:
    tc = models.TestCase(
        problem_id=problem_id,
        ordinal=ordinal,
        input_text=input_text,
        output_text=output_text,
        is_hidden=is_hidden,
    )
    db.add(tc)
    db.flush()
    return tc


def make_submission(
    db: Session,
    *,
    user_id: int = 1,
    problem_id: int | None = None,
    language: str = "python",
    source: str = "print(3)",
    status: str = "queued",
    run_type: str = "submit",
) -> models.Submission:
    sub = models.Submission(
        user_id=user_id,
        problem_id=problem_id,
        language=language,
        source_text=source,
        status=status,
        run_type=run_type,
        updated_at=datetime.now(tz=timezone.utc),
        created_at=datetime.now(tz=timezone.utc),
    )
    db.add(sub)
    db.flush()
    return sub
