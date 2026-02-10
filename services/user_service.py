from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.user import User
from models.enums import Role
from core.security import hash_password

#Based on admin things like listing,user with role,view users and everything like this 
def user_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }

def get_user_by_id(db: Session, user_id: int) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_dict(user)

def list_users(db: Session) -> list[dict]:
    users = db.query(User).order_by(User.id.asc()).all()
    data: list[dict] = []
    for u in users:
        data.append(user_dict(u))
    return { 'Data' : data}

def create_user_by_admin(db: Session, name: str, email: str, password: str, role: Role) -> dict:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,          # Role Enum stored in DB
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user_dict(user)

def update_user_role(db: Session, user_id: int, role: Role) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    db.refresh(user)
    return user_dict(user)

def admin_pwd_update(db: Session,user_id: int,new_password:str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    user.password_hash = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return {"user_id": user_id}


