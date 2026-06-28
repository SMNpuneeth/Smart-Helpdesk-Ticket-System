from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from models.enums import Role, TicketStatus
from models.rating import TicketRating
from models.ticket import Ticket
from models.user import User


def _rating_dict(r: TicketRating) -> dict:
    return {
        "id": r.id,
        "ticket_id": r.ticket_id,
        "resolution_cycle": r.resolution_cycle,
        "employee_id": r.employee_id,
        "agent_id": r.agent_id,
        "rating": r.rating,
        "feedback": r.feedback,
        "created_at": r.created_at,
    }


def _get_ticket_or_404(db: Session, ticket_id: int) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


def get_ticket_rating(db: Session, ticket_id: int) -> dict:
    """Return the existing rating for a ticket, or `None` if not yet rated."""
    ticket = _get_ticket_or_404(db, ticket_id)
    ticket_cycle = int(getattr(ticket, "current_resolution_cycle", 1) or 1)

    rating = (
        db.query(TicketRating)
        .filter(
            TicketRating.ticket_id == ticket_id,
            TicketRating.resolution_cycle == ticket_cycle,
        )
        .first()
    )
    return _rating_dict(rating) if rating else None


def submit_rating(
    db: Session,
    current_user: dict,
    ticket_id: int,
    rating_value: int,
    feedback: str | None,
) -> dict:
    """Persist a rating for a closed, owner-authored ticket.

    Validation matrix:
      - role must be employee (403 otherwise)
      - ticket must exist (404)
      - current user must be the ticket creator (403)
      - ticket must be closed (400)
      - ticket must be assigned to an agent (400 — unrated tickets cannot exist
        for unassigned ones, and we want a stable `agent_id` for averaging)
      - ticket must not already be rated (409)
      - rating must be 1..5 (the schema enforces this too; service is
        the final guard)
    """
    role = current_user.get("role")
    user_id = current_user.get("user_id")
    if role != Role.EMPLOYEE.value:
        raise HTTPException(status_code=403, detail="Only the ticket owner can rate a ticket")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    if rating_value is None or not isinstance(rating_value, int) or rating_value < 1 or rating_value > 5:
        raise HTTPException(status_code=400, detail="Rating must be an integer between 1 and 5.")
    if feedback is not None and len(feedback) > 4000:
        raise HTTPException(status_code=400, detail="Feedback is too long.")

    ticket = _get_ticket_or_404(db, ticket_id)
    if ticket.created_by != user_id:
        raise HTTPException(status_code=403, detail="Only the ticket owner can rate this ticket")
    if ticket.status != TicketStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Tickets can only be rated after they are closed")
    if ticket.assigned_to is None:
        # Defensive: a ticket cannot be closed without being assigned first
        # in the normal flow, but we guard here in case of legacy data.
        raise HTTPException(status_code=400, detail="Cannot rate a ticket that has no assigned agent")

    ticket_cycle = int(getattr(ticket, "current_resolution_cycle", 1) or 1)

    # One rating per completed resolution cycle.
    existing_for_cycle = (
        db.query(TicketRating)
        .filter(
            TicketRating.ticket_id == ticket_id,
            TicketRating.resolution_cycle == ticket_cycle,
        )
        .first()
    )
    if existing_for_cycle:
        raise HTTPException(status_code=409, detail="This resolution cycle has already been rated")

    rating = TicketRating(
        ticket_id=ticket_id,
        resolution_cycle=ticket_cycle,
        employee_id=user_id,
        agent_id=ticket.assigned_to,
        rating=rating_value,
        feedback=(feedback.strip() if feedback else None),
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)
    return _rating_dict(rating)


def get_agent_rating_stats(db: Session, agent_id: int) -> dict:
    """Compute `AVG(rating)` and `COUNT(*)` for an agent on demand.

    The aggregate is computed in a single query; the result is NEVER persisted
    on the User model. Returns `None` for `average_rating` when no ratings
    exist yet so the frontend can render "No ratings yet" without an extra
    zero check.
    """
    agent = db.query(User).filter(User.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="User not found")

    avg_rating, total = (
        db.query(func.avg(TicketRating.rating), func.count(TicketRating.id))
        .filter(TicketRating.agent_id == agent_id)
        .one()
    )

    average = float(avg_rating) if avg_rating is not None else None
    # SQLAlchemy may return Decimal here depending on dialect; coerce to a
    # plain float with two-decimal precision for stable display.
    if average is not None:
        average = round(average, 2)

    return {
        "agent_id": agent_id,
        "average_rating": average,
        "total_ratings": int(total or 0),
    }