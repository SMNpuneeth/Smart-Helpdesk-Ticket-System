from sqlalchemy import (
    Column,
    Integer,
    Text,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
)
from datetime import datetime, timezone

from db.db import Base


class TicketRating(Base):
    __tablename__ = "ticket_ratings"
    __table_args__ = (
        # One rating per completed resolution cycle.
        UniqueConstraint("ticket_id", "resolution_cycle", name="uq_ticket_ratings_ticket_cycle"),
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_ticket_ratings_rating_range"),
    )


    id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False)
    resolution_cycle = Column(Integer, nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    agent_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)