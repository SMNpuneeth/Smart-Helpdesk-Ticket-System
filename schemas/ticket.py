from datetime import datetime
from pydantic import BaseModel, Field
from models.enums import TicketPriority, TicketStatus

class TicketCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=2)
    priority: TicketPriority

class TicketUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    description: str | None = Field(default=None, min_length=2)
    priority: TicketPriority | None = None

class TicketAssign(BaseModel):
    agent_id: int

class TicketStatusUpdate(BaseModel):
    status: TicketStatus

class TicketOut(BaseModel):
    id: int
    title: str
    description: str
    priority: TicketPriority
    status: TicketStatus
    created_by: int
    assigned_to: int | None
    created_at: datetime
    updated_at: datetime
