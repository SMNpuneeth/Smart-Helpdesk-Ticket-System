from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from models.ticket import Ticket
from models.user import User
from models.enums import Role, TicketStatus
from schemas.ticket import TicketCreate, TicketUpdate

def _now():
    return datetime.now(timezone.utc)

def _ticket_dict(ticket: Ticket) -> dict:
    return {
        "id": ticket.id,
        "title": ticket.title,
        "description": ticket.description,
        "priority": ticket.priority.value,
        "status": ticket.status.value,
        "created_by": ticket.created_by,
        "assigned_to": ticket.assigned_to,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
    }

def _get_ticket_or_404(db: Session, ticket_id: int) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

def _can_access_ticket(current_user: dict, ticket: Ticket) -> bool:
    role = current_user.get("role")
    user_id = current_user.get("user_id")

    if role is None or user_id is None:
        return False
    if role == Role.ADMIN.value:
        return True
    if ticket.created_by == user_id:
        return True
    if role == Role.AGENT.value and ticket.assigned_to == user_id:
        return True
    return False

def create_ticket(db: Session, current_user: dict, payload: TicketCreate) -> dict:
    if current_user.get("role") != Role.EMPLOYEE.value:
        raise HTTPException(status_code=403, detail="Only employees can create tickets")
    user_id = current_user.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    ticket = Ticket(
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        status=TicketStatus.OPEN,
        created_by=user_id,
        assigned_to=None,
        created_at=_now(),
        updated_at=_now(),
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return _ticket_dict(ticket)

def get_my_tickets(db: Session, current_user: dict) -> list[dict]:
    user_id = current_user.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    tickets = db.query(Ticket).filter(Ticket.created_by == user_id).all()
    data: list[dict] = []
    for t in tickets:
        data.append(_ticket_dict(t))
    return data

def get_all_tickets(db: Session) -> list[dict]:
    tickets = db.query(Ticket).order_by(Ticket.id.asc()).all()
    data: list[dict] = []
    for t in tickets:
        data.append(_ticket_dict(t))
    return data

def get_ticket_by_id(db: Session, current_user: dict, ticket_id: int) -> dict:
    ticket = _get_ticket_or_404(db, ticket_id)
    if not _can_access_ticket(current_user, ticket):
        raise HTTPException(status_code=403, detail="Not allowed to view this ticket")
    return _ticket_dict(ticket)

def update_ticket(db: Session, current_user: dict, ticket_id: int, payload: TicketUpdate) -> dict:
    ticket = _get_ticket_or_404(db, ticket_id)
    # access: only owner OR admin can edit
    role = current_user.get("role")
    user_id = current_user.get("user_id")

    if role is None or user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    if role != Role.ADMIN.value and ticket.created_by != user_id:
        raise HTTPException(status_code=403, detail="Only owner or admin can edit ticket")
    # Closed tickets cannot be edited
    if ticket.status == TicketStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Closed tickets cannot be edited")
    # Priority cannot be changed after assignment
    if payload.priority is not None:
        if ticket.status != TicketStatus.OPEN:
            raise HTTPException(status_code=400, detail="Priority cannot be changed after assignment")
        ticket.priority = payload.priority
    # Update title|description if provided
    if payload.title is not None:
        ticket.title = payload.title
    if payload.description is not None:
        ticket.description = payload.description
    ticket.updated_at = _now()
    db.commit()
    db.refresh(ticket)
    return _ticket_dict(ticket)

def assign_ticket(db: Session, current_user: dict, ticket_id: int, agent_id: int) -> dict:
    if current_user.get("role") != Role.ADMIN.value:
        raise HTTPException(status_code=403, detail="Only admin can assign tickets")
    ticket = _get_ticket_or_404(db, ticket_id)
    if ticket.status == TicketStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Closed tickets cannot be edited")
    if current_user.get("user_id") == ticket.created_by:
        raise HTTPException(status_code=403, detail="Ticket creator cannot assign ticket")
    agent = db.query(User).filter(User.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if agent.role.value != Role.AGENT.value:
        raise HTTPException(status_code=400, detail="User is not an agent")
    if ticket.status != TicketStatus.OPEN:
        raise HTTPException(status_code=400, detail="Ticket can be assigned only when status is open")
    ticket.assigned_to = agent_id
    ticket.status = TicketStatus.ASSIGNED
    ticket.updated_at = _now()
    db.commit()
    db.refresh(ticket)
    return _ticket_dict(ticket)

def update_ticket_status(db: Session, current_user: dict, ticket_id: int, new_status: TicketStatus) -> dict:
    ticket = _get_ticket_or_404(db, ticket_id)
    if ticket.status == TicketStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Closed tickets cannot be edited")
    role = current_user.get("role")
    user_id = current_user.get("user_id")
    if role is None or user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    allowed_next = {
        TicketStatus.OPEN: TicketStatus.ASSIGNED,
        TicketStatus.ASSIGNED: TicketStatus.IN_PROGRESS,
        TicketStatus.IN_PROGRESS: TicketStatus.RESOLVED,
        TicketStatus.RESOLVED: TicketStatus.CLOSED,
    }
    expected_next = allowed_next.get(ticket.status)
    if expected_next is None:
        raise HTTPException(status_code=400, detail="Invalid current ticket status")
    if new_status != expected_next:
        raise HTTPException(status_code=400, detail="Invalid status transition")
    # assigned -> in_progress : only assigned agent
    if new_status == TicketStatus.IN_PROGRESS:
        if role != Role.AGENT.value:
            raise HTTPException(status_code=403, detail="Only agent can move ticket to in_progress")
        if ticket.assigned_to is None or ticket.assigned_to != user_id:
            raise HTTPException(status_code=403, detail="Agent can update only assigned tickets")
    # in_progress -> resolved : agent(assigned) OR admin
    if new_status == TicketStatus.RESOLVED:
        if role == Role.AGENT.value:
            if ticket.assigned_to is None or ticket.assigned_to != user_id:
                raise HTTPException(status_code=403, detail="Agent can resolve only assigned tickets")
        elif role != Role.ADMIN.value:
            raise HTTPException(status_code=403, detail="Only agent or admin can resolve ticket")
    # resolved -> closed : agent(assigned) OR admin
    if new_status == TicketStatus.CLOSED:
        if role == Role.AGENT.value:
            if ticket.assigned_to is None or ticket.assigned_to != user_id:
                raise HTTPException(status_code=403, detail="Agent can close only assigned tickets")
        elif role != Role.ADMIN.value:
            raise HTTPException(status_code=403, detail="Only agent or admin can close ticket")
    ticket.status = new_status
    ticket.updated_at = _now()
    db.commit()
    db.refresh(ticket)
    return _ticket_dict(ticket)

def close_ticket(db: Session, current_user: dict, ticket_id: int) -> dict:
    ticket = _get_ticket_or_404(db, ticket_id)
    if ticket.status != TicketStatus.RESOLVED:
        raise HTTPException(status_code=400, detail="Ticket must be resolved before closing")
    return update_ticket_status(db, current_user, ticket_id, TicketStatus.CLOSED)
