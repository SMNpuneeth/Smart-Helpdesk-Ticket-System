from datetime import datetime
from pydantic import BaseModel, Field


class RatingCreate(BaseModel):
    rating: int = Field(ge=1, le=5, description="Star rating from 1 (worst) to 5 (best).")
    feedback: str | None = Field(default=None, max_length=4000)


class RatingOut(BaseModel):
    id: int
    ticket_id: int
    employee_id: int | None
    agent_id: int | None
    rating: int
    feedback: str | None
    created_at: datetime


class AgentRatingStats(BaseModel):
    agent_id: int
    average_rating: float | None
    total_ratings: int


class TicketRatingStatus(BaseModel):
    """Lightweight payload returned by GET /ratings/ticket/{ticket_id}.

    `rating` is null when the ticket has not been rated yet. This shape lets
    the frontend decide between the rating form and the "already rated" view
    with a single round-trip.
    """

    ticket_id: int
    rating: RatingOut | None