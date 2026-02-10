from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from api.deps import employee_dep,admin_dep,agent_dep,agent_or_admin_dep,current_user_dep
from schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketAssign,
    TicketStatusUpdate,
)
from services.ticket_service import (
    create_ticket,
    get_my_tickets,
    get_all_tickets,
    get_ticket_by_id,
    update_ticket,
    assign_ticket,
    update_ticket_status,
    close_ticket,
)

router = APIRouter( tags=["Tickets"])

@router.post("/")
def create(
    payload: TicketCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(employee_dep),
) -> dict:
    ticket = create_ticket(db, current_user, payload)
    return {"success": True, "message": "Ticket created", "data": ticket}

@router.get("/me")
def my_tickets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(current_user_dep),
) -> dict:
    tickets = get_my_tickets(db, current_user)
    return {"success": True, "message": "My tickets", "data": {"tickets": tickets}}

@router.get("/")
def all_tickets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_dep),
) -> dict:
    tickets = get_all_tickets(db)
    return {"success": True, "message": "All tickets", "data": {"tickets": tickets}}

@router.get("/{ticket_id}")
def get_by_id(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(current_user_dep),
) -> dict:
    ticket = get_ticket_by_id(db, current_user, ticket_id)
    return {"success": True, "message": "Ticket fetched", "data": ticket}

@router.patch("/{ticket_id}")
def edit_ticket(
    ticket_id: int,
    payload: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(current_user_dep),
) -> dict:
    ticket = update_ticket(db, current_user, ticket_id, payload)
    return {"success": True, "message": "Ticket updated", "data": ticket}

@router.patch("/{ticket_id}/assign")
def assign(
    ticket_id: int,
    payload: TicketAssign,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_dep),
) -> dict:
    ticket = assign_ticket(db, current_user, ticket_id, payload.agent_id)
    return {"success": True, "message": "Ticket assigned", "data": ticket}

@router.patch("/{ticket_id}/status")
def change_status(
    ticket_id: int,
    payload: TicketStatusUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(agent_dep),
) -> dict:
    ticket = update_ticket_status(db, current_user, ticket_id, payload.status)
    return {"success": True, "message": "Status updated", "data": ticket}

@router.patch("/{ticket_id}/close")
def close(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(agent_or_admin_dep),
) -> dict:
    ticket = close_ticket(db, current_user, ticket_id)
    return {"success": True, "message": "Ticket closed", "data": ticket}
