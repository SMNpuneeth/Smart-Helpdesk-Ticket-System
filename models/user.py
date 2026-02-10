from sqlalchemy import Column,String,Integer,Boolean,DateTime,Enum
from datetime import datetime,timezone
from sqlalchemy import Enum as SqlEnum
from models.enums import Role

from db.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(
    SqlEnum(Role, name="role", values_callable=lambda x: [e.value for e in x]),
    nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))



