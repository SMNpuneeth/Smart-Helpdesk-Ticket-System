from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from models.enums import Role

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=3, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=3, max_length=128)

class AdminUserCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=3)
    role: Role

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
    is_active: bool
    created_at: datetime

class UserRoleUpdate(BaseModel):
    role: Role

class AdminResetPasswordIn(BaseModel):
    new_password: str = Field(min_length=3)
