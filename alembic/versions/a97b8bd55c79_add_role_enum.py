"""add role enum

Revision ID: a97b8bd55c79
Revises: 2c38a3830051
Create Date: 2026-01-30 15:53:14.877302

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a97b8bd55c79'
down_revision: Union[str, Sequence[str], None] = '2c38a3830051'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    role_enum = sa.Enum("employee", "agent", "admin", name="role")
    role_enum.create(op.get_bind(), checkfirst=True)

    # Make sure existing data matches enum values (safe even if already lowercase)
    op.execute("UPDATE users SET role = LOWER(role)")

    op.alter_column(
        "users",
        "role",
        existing_type=sa.VARCHAR(),
        type_=role_enum,
        existing_nullable=False,
        postgresql_using="role::role"
    )

def downgrade():
    op.alter_column(
        "users",
        "role",
        existing_type=sa.Enum("employee", "agent", "admin", name="role"),
        type_=sa.VARCHAR(),
        existing_nullable=False
    )

    role_enum = sa.Enum("employee", "agent", "admin", name="role")
    role_enum.drop(op.get_bind(), checkfirst=True)

