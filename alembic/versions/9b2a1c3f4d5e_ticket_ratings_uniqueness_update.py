"""Allow one rating per (ticket, agent) instead of (ticket) only.

This fixes the scenario where an employee rates an agent, then reopens the
same ticket and it gets reassigned to a new agent.

Revision ID: 9b2a1c3f4d5e
Revises: 8f1a2b3c4d5e
Create Date: 2026-06-28

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9b2a1c3f4d5e"
down_revision: Union[str, Sequence[str], None] = "8f1a2b3c4d5e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop old uniqueness (ticket_id only)
    op.drop_constraint(
        "uq_ticket_ratings_ticket_id",
        "ticket_ratings",
        type_="unique",
    )

    # Add new uniqueness (ticket_id, agent_id)
    op.create_unique_constraint(
        "uq_ticket_ratings_ticket_agent",
        "ticket_ratings",
        ["ticket_id", "agent_id"],
    )


def downgrade() -> None:
    # Reverse: restore old unique (ticket_id only)
    op.drop_constraint(
        "uq_ticket_ratings_ticket_agent",
        "ticket_ratings",
        type_="unique",
    )

    op.create_unique_constraint(
        "uq_ticket_ratings_ticket_id",
        "ticket_ratings",
        ["ticket_id"],
    )

