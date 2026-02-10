from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.user import UserCreate, UserLogin
from services.auth_service import register_employee, login_user
from core.security import get_current_user

router = APIRouter( tags=["Auth"])

@router.post("/register")
def register(
    payload: UserCreate,
    db: Session = Depends(get_db),
) -> dict:
    user = register_employee(
        db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
    )
    return {"success": True, "message": "User registered", "data": user}


@router.post("/login")
def login(
    payload: UserLogin,
    db: Session = Depends(get_db),
) -> dict:
    token = login_user(
        db,
        email=payload.email,
        password=payload.password,
    )
    return {"success": True, "message": "Login successful", "data":token}


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)) -> dict:
    return {"success": True, "message": "Current user", "data": current_user}
