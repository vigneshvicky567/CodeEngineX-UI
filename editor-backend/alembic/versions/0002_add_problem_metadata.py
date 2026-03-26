"""Add problem metadata columns.

Revision ID: 0002
Create Date: 2026-03-08
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: str = "0001"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.add_column("problems", sa.Column("difficulty", sa.Text, nullable=True, server_default="easy"))
    op.add_column("problems", sa.Column("description", sa.Text, nullable=True, server_default=""))
    op.add_column("problems", sa.Column("examples_json", sa.Text, nullable=True, server_default="[]"))
    op.add_column("problems", sa.Column("constraints_json", sa.Text, nullable=True, server_default="[]"))
    op.add_column("problems", sa.Column("code_templates_json", sa.Text, nullable=True, server_default="{}"))

    # Set default values for existing rows
    op.execute("UPDATE problems SET difficulty = 'easy' WHERE difficulty IS NULL")
    op.execute("UPDATE problems SET description = '' WHERE description IS NULL")
    op.execute("UPDATE problems SET examples_json = '[]' WHERE examples_json IS NULL")
    op.execute("UPDATE problems SET constraints_json = '[]' WHERE constraints_json IS NULL")
    op.execute("UPDATE problems SET code_templates_json = '{}' WHERE code_templates_json IS NULL")

    # Now make them NOT NULL
    op.alter_column("problems", "difficulty", nullable=False)
    op.alter_column("problems", "description", nullable=False)
    op.alter_column("problems", "examples_json", nullable=False)
    op.alter_column("problems", "constraints_json", nullable=False)
    op.alter_column("problems", "code_templates_json", nullable=False)


def downgrade() -> None:
    op.drop_column("problems", "code_templates_json")
    op.drop_column("problems", "constraints_json")
    op.drop_column("problems", "examples_json")
    op.drop_column("problems", "description")
    op.drop_column("problems", "difficulty")
