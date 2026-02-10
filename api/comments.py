from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.comment import CommentCreate
from api.deps import employee_dep,current_user_dep
from services.comment_service import add_comment, list_comments

router = APIRouter(tags=["Comments"])

@router.post("/{ticket_id}/comments")
def create_comment(
    ticket_id: int,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(employee_dep),
) -> dict:
    comment = add_comment(db, current_user, ticket_id, payload)
    return {"success": True, "message": "Comment added", "data": comment}

@router.get("/{ticket_id}/comments")
def get_comments(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(current_user_dep),
) -> dict:
    comments = list_comments(db, current_user, ticket_id)
    return {"success": True, "message": "Comments fetched", "data": {"comments": comments}}
