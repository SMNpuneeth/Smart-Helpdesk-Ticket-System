from fastapi import Depends
from sqlalchemy.orm import Session

from db.db import get_db
from core.security import get_current_user, role_required
from models.enums import Role

def db_dep(db: Session = Depends(get_db)) -> Session:
    return db

def current_user_dep(current_user: dict = Depends(get_current_user)) -> dict:
    return current_user

def admin_dep(current_user: dict = Depends(role_required(Role.ADMIN))) -> dict:
    return current_user

def agent_dep(current_user: dict = Depends(role_required(Role.AGENT))) -> dict:
    return current_user

def employee_dep(current_user: dict = Depends(role_required(Role.EMPLOYEE))) -> dict:
    return current_user

def employee_or_agent_dep(current_user: dict = Depends(role_required(Role.EMPLOYEE, Role.AGENT))) -> dict:
    return current_user

def agent_or_admin_dep(current_user: dict =Depends(role_required(Role.AGENT,Role.ADMIN))) -> dict:
    return current_user
