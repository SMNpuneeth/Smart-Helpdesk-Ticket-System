"""add ticket ratings and reopened status

Revision ID: 8f1a2b3c4d5e
Revises: 7c3c43e81635
Create Date: 2026-06-27 21:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8f1a2b3c4d5e'
down_revision: Union[str, Sequence[str], None] = '7c3c43e81635'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Existing PostgreSQL enum values for `ticket_status` (created in prior
# migration `7c3c43e81635_add_users_updated_at.py`).
_TICKET_STATUS_OLD_VALUES = (
    "open",
    "assigned",
    "in_progress",
    "resolved",
    "closed",
)


def upgrade() -> None:
    # 1. Extend the existing PostgreSQL ticket_status enum with 'reopened'.
    #    PostgreSQL supports `ALTER TYPE ... ADD VALUE` inside a transaction
    #    only if the value is not used in the same transaction afterwards;
    #    since we don't write any rows here, this is safe. We still guard
    #    with a check so re-running an interrupted migration is idempotent.
    bind = op.get_bind()
    existing_values = set(
        bind.exec_driver_sql(
            "SELECT unnest(enum_range(NULL::ticket_status))"
        ).scalars()
    )
    if "reopened" not in existing_values:
        op.execute("ALTER TYPE ticket_status ADD VALUE 'reopened'")

    # 2. Create the ticket_ratings table.
    op.create_table(
        'ticket_ratings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ticket_id', sa.Integer(), nullable=False),
        sa.Column('employee_id', sa.Integer(), nullable=True),
        sa.Column('agent_id', sa.Integer(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['agent_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['employee_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('ticket_id', name='uq_ticket_ratings_ticket_id'),
        sa.CheckConstraint('rating >= 1 AND rating <= 5', name='ck_ticket_ratings_rating_range'),
    )
    op.create_index('ix_ticket_ratings_agent_id', 'ticket_ratings', ['agent_id'])
    op.create_index('ix_ticket_ratings_ticket_id', 'ticket_ratings', ['ticket_id'])


def downgrade() -> None:
    # 1. Drop the ticket_ratings table (this also drops the indexes and
    #    the UNIQUE/CHECK constraints).
    op.drop_index('ix_ticket_ratings_ticket_id', table_name='ticket_ratings')
    op.drop_index('ix_ticket_ratings_agent_id', table_name='ticket_ratings')
    op.drop_table('ticket_ratings')

    # 2. Rebuild the ticket_status enum without 'reopened'.
    #    PostgreSQL does not support removing a value from an enum directly.
    #    We guard against downgrading while rows still hold 'reopened', which
    #    would silently lose data on type rebuild.
    bind = op.get_bind()
    reopened_count = bind.exec_driver_sql(
        "SELECT COUNT(*) FROM tickets WHERE status::text = 'reopened'"
    ).scalar()
    if reopened_count and reopened_count > 0:
        raise RuntimeError(
            "Cannot downgrade: one or more tickets still have status='reopened'. "
            "Reassign or close those tickets before downgrading this migration."
        )

    # Convert column to plain text, drop and recreate the enum, then
    # convert back. This is the standard reversible enum-removal pattern.
    op.execute("ALTER TABLE tickets ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE tickets ALTER COLUMN status TYPE VARCHAR USING status::text")
    op.execute("DROP TYPE ticket_status")
    enum_values_sql = ", ".join(f"'{v}'" for v in _TICKET_STATUS_OLD_VALUES)
    op.execute(f"CREATE TYPE ticket_status AS ENUM ({enum_values_sql})")
    op.execute(
        "ALTER TABLE tickets ALTER COLUMN status TYPE ticket_status "
        "USING status::ticket_status"
    )
    op.execute("ALTER TABLE tickets ALTER COLUMN status SET DEFAULT 'open'")