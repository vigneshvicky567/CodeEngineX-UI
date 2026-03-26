"""Initial migration — create all tables.

Revision ID: 0001
Create Date: 2024-01-01 00:00:00.000000
"""
from __future__ import annotations

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: str | None = None
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    # ------------------------------------------------------------------
    # ENUM types
    # ------------------------------------------------------------------
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'judge_type_enum') THEN
                CREATE TYPE judge_type_enum AS ENUM ('normal', 'special', 'interactive');
            END IF;
        END
        $$;
    """)

    # ------------------------------------------------------------------
    # users
    # ------------------------------------------------------------------
    op.create_table(
        "users",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("username", sa.Text, nullable=False, unique=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ------------------------------------------------------------------
    # problems
    # ------------------------------------------------------------------
    op.create_table(
        "problems",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("slug", sa.Text, nullable=False, unique=True),
        sa.Column("title", sa.Text, nullable=False),
        sa.Column("time_limit_ms", sa.Integer, nullable=False, server_default="1000"),
        sa.Column("memory_limit_kb", sa.Integer, nullable=False, server_default="262144"),
        sa.Column(
            "judge_type",
            postgresql.ENUM("normal", "special", "interactive", name="judge_type_enum", create_type=False),
            nullable=False,
            server_default="normal",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ------------------------------------------------------------------
    # testcases
    # ------------------------------------------------------------------
    op.create_table(
        "testcases",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("problem_id", sa.BigInteger, sa.ForeignKey("problems.id", ondelete="CASCADE"), nullable=False),
        sa.Column("ordinal", sa.Integer, nullable=False),
        sa.Column("input_text", sa.Text, nullable=True),
        sa.Column("output_text", sa.Text, nullable=True),
        sa.Column("is_hidden", sa.Boolean, nullable=False, server_default="false"),
    )
    op.create_index("ix_testcases_problem_id", "testcases", ["problem_id"])

    # ------------------------------------------------------------------
    # submissions
    # ------------------------------------------------------------------
    op.create_table(
        "submissions",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.BigInteger, sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("problem_id", sa.BigInteger, sa.ForeignKey("problems.id", ondelete="SET NULL"), nullable=True),
        sa.Column("language", sa.Text, nullable=False),
        sa.Column("source_s3_key", sa.Text, nullable=True),
        sa.Column("source_text", sa.Text, nullable=True),
        sa.Column("status", sa.Text, nullable=False, server_default="queued"),
        sa.Column("time_ms", sa.Integer, nullable=True),
        sa.Column("memory_kb", sa.Integer, nullable=True),
        sa.Column("run_type", sa.Text, nullable=False, server_default="submit"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_submissions_user_id", "submissions", ["user_id"])
    op.create_index("ix_submissions_problem_id", "submissions", ["problem_id"])
    op.create_index("ix_submissions_created_at_desc", "submissions", ["created_at"])

    # ------------------------------------------------------------------
    # submission_test_results
    # ------------------------------------------------------------------
    op.create_table(
        "submission_test_results",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column(
            "submission_id",
            sa.BigInteger,
            sa.ForeignKey("submissions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "testcase_id",
            sa.BigInteger,
            sa.ForeignKey("testcases.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", sa.Text, nullable=False),
        sa.Column("time_ms", sa.Integer, nullable=True),
        sa.Column("memory_kb", sa.Integer, nullable=True),
        sa.Column("stdout", sa.Text, nullable=True),
    )
    op.create_index("ix_str_submission_id", "submission_test_results", ["submission_id"])


def downgrade() -> None:
    op.drop_table("submission_test_results")
    op.drop_table("submissions")
    op.drop_table("testcases")
    op.drop_table("problems")
    op.drop_table("users")
    sa.Enum(name="judge_type_enum").drop(op.get_bind(), checkfirst=True)
