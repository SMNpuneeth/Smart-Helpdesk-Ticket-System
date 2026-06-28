"""add resolution_cycle to ticket ratings and ticket table

Revision ID: 9c0d1e2f3a4b
Revises: 9b2a1c3f4d5e
Create Date: 2026-06-28

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9c0d1e2f3a4b"
down_revision: Union[str, Sequence[str], None] = "9b2a1c3f4d5e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) tickets.current_resolution_cycle
    op.add_column(
        "tickets",
        sa.Column("current_resolution_cycle", sa.Integer(), nullable=False, server_default="1"),
    )
    op.alter_column("tickets", "current_resolution_cycle", server_default=None)

    # 2) ticket_ratings.resolution_cycle
    op.add_column(
        "ticket_ratings",
        sa.Column("resolution_cycle", sa.Integer(), nullable=False, server_default="1"),
    )
    op.alter_column("ticket_ratings", "resolution_cycle", server_default=None)

    # 3) Update unique constraint to (ticket_id, resolution_cycle)
    # Drop existing unique constraint from earlier implementation.
    op.drop_constraint(
        "uq_ticket_ratings_ticket_agent",
        "ticket_ratings",
        type_="unique",
    )
    op.create_unique_constraint(
        "uq_ticket_ratings_ticket_cycle",
        "ticket_ratings",
        ["ticket_id", "resolution_cycle"],
    )


def downgrade() -> None:
    # 1) Revert unique constraint
    op.drop_constraint(
        "uq_ticket_ratings_ticket_cycle",
        "ticket_ratings",
        type_="unique",
    )
    op.create_unique_constraint(
        "uq_ticket_ratings_ticket_agent",
        "ticket_ratings",
        ["ticket_id", "agent_id"],
    )

    # 2) Drop resolution_cycle from ticket_ratings
    op.drop_column("ticket_ratings", "resolution_cycle")

    # 3) Drop current_resolution_cycle from tickets
    op.drop_column("tickets", "current_resolution_cycle")

