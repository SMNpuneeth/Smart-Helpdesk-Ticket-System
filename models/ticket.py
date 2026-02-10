from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy import Enum as SqlEnum
from datetime import datetime, timezone

from db.db import Base
from models.enums import TicketPriority, TicketStatus

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(
        SqlEnum(
            TicketPriority,
            name="ticket_priority",
            values_callable=lambda x: [e.value for e in x]
        ),
        nullable=False
    )
    status = Column(
        SqlEnum(
            TicketStatus,
            name="ticket_status",
            values_callable=lambda x: [e.value for e in x]
        ),
        nullable=False,
        default=TicketStatus.OPEN
    )
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc))
