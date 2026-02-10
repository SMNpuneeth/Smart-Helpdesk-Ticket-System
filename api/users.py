from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.user import AdminUserCreate, UserRoleUpdate,AdminResetPasswordIn
from api.deps import admin_dep
from services.user_service import (
    list_users,
    get_user_by_id,
    create_user_by_admin,
    update_user_role,
    admin_pwd_update
)

router = APIRouter(tags=["Users"])

@router.get("/")
def admin_list_users(
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_dep),
) -> dict:
    users = list_users(db)
    return {"success": True, "message": "Users fetched", "data": {"users": users}}

@router.get("/{user_id}")
def admin_get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_dep),
) -> dict:
    user = get_user_by_id(db, user_id)
    return {"success": True, "message": "User fetched", "data": user}

@router.post("/create-user")
def admin_create_user(
    payload: AdminUserCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_dep),
) -> dict:
    user = create_user_by_admin(
        db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        role=payload.role,
    )
    return {"success": True, "message": "User created", "data": user}

@router.patch("/{user_id}/role")
def admin_update_user_role(
    user_id: int,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_dep),
) -> dict:
    user = update_user_role(db, user_id, payload.role)
    return {"success": True, "message": "User role updated", "data": user}

@router.patch("/users/{user_id}/reset-password")
def admin_reset_password(
    user_id: int,
    data: AdminResetPasswordIn,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_dep),
) -> dict:
    result=  admin_pwd_update(db,user_id,data.new_password)
    return {"message": "Password reset successful", "data":result}
