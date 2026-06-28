from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from api.deps import current_user_dep
from schemas.rating import RatingCreate
from services.rating_service import (
    get_ticket_rating,
    submit_rating,
    get_agent_rating_stats,
)

router = APIRouter(tags=["Ratings"])


@router.post("/")
def submit(
    ticket_id: int,
    payload: RatingCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(current_user_dep),
) -> dict:
    rating = submit_rating(db, current_user, ticket_id, payload.rating, payload.feedback)
    return {"success": True, "message": "Rating submitted", "data": rating}


@router.get("/ticket/{ticket_id}")
def fetch_ticket_rating(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(current_user_dep),
) -> dict:
    rating = get_ticket_rating(db, ticket_id)
    return {
        "success": True,
        "message": "Ticket rating fetched",
        "data": {"ticket_id": ticket_id, "rating": rating},
    }


@router.get("/agent/{agent_id}")
def fetch_agent_rating_stats(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(current_user_dep),
) -> dict:
    stats = get_agent_rating_stats(db, agent_id)
    return {"success": True, "message": "Agent rating stats fetched", "data": stats}