from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.user import User
from models.enums import Role
from core.security import hash_password, verify_password, create_access_token

def register_employee(db: Session, name: str, email: str, password: str) -> dict:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=Role.EMPLOYEE,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
        "is_active": user.is_active
    }

def login_user(db: Session, email: str, password: str) -> dict:
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    payload = {"sub": user.email, "role": user.role.value, "user_id": user.id}
    token = create_access_token(payload)
    return {"access_token": token, "token_type": "bearer"}

def get_user_by_id(db: Session, user_id: int) -> dict:
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }

def update_user_role(db: Session, user_id: int, role: Role) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }