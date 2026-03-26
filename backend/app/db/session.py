"""
Database session factory.

We use synchronous psycopg2 throughout (API + worker share the same pool).
FastAPI endpoints use a dependency-injected session; the worker opens its own.
"""
from __future__ import annotations

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    **({} if settings.DATABASE_URL.startswith("sqlite") else {
        "pool_size": 10,
        "max_overflow": 20,
    }),
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session and closes it after the request."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_ctx() -> Generator[Session, None, None]:
    """Context-manager helper used by the worker process."""
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
