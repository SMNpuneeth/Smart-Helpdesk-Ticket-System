from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from models.comment import TicketComment
from models.ticket import Ticket
from models.enums import Role, TicketStatus
from schemas.comment import CommentCreate


def _now():
    return datetime.now(timezone.utc)


def _comment_dict(c: TicketComment) -> dict:
    return {
        "id": c.id,
        "ticket_id": c.ticket_id,
        "user_id": c.user_id,
        "comment": c.comment,
        "created_at": c.created_at,
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
    # Admin can access any ticket
    if role == Role.ADMIN.value:
        return True
    # Ticket owner can access
    if ticket.created_by == user_id:
        return True
    # Assigned agent can access
    if role == Role.AGENT.value and ticket.assigned_to == user_id:
        return True
    return False


def add_comment(db: Session, current_user: dict, ticket_id: int, payload: CommentCreate) -> dict:
    ticket = _get_ticket_or_404(db, ticket_id)
    if not _can_access_ticket(current_user, ticket):
        raise HTTPException(status_code=403, detail="Not allowed to comment on this ticket")
    # Closed tickets cannot be edited (so no new comments)
    if ticket.status == TicketStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Closed tickets cannot be edited")
    user_id = current_user.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    comment = TicketComment(
        ticket_id=ticket_id,
        user_id=user_id,
        comment=payload.comment,
        created_at=_now(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _comment_dict(comment)


def list_comments(db: Session, current_user: dict, ticket_id: int) -> list[dict]:
    ticket = _get_ticket_or_404(db, ticket_id)
    if not _can_access_ticket(current_user, ticket):
        raise HTTPException(status_code=403, detail="Not allowed to view comments for this ticket")
    comments = (
        db.query(TicketComment)
        .filter(TicketComment.ticket_id == ticket_id)
        .order_by(TicketComment.id.asc())
        .all()
    )
    data: list[dict] = []
    for c in comments:
        data.append(_comment_dict(c))
    return data
