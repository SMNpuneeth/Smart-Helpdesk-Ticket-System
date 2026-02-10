from datetime import datetime
from pydantic import BaseModel, Field

class CommentCreate(BaseModel):
    comment: str = Field(min_length=1)

class CommentOut(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    comment: str
    created_at: datetime

    model_config = {"from_attributes": True}
    #this allows pydantic to read like commentOut.id and .....