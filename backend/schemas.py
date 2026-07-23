from pydantic import BaseModel
from typing import Optional

class ItemCreate(BaseModel):
    text: str 
    number: float
    binary: bool

class ItemUpdate(BaseModel):
    text: Optional[str] = None
    number: Optional[float] = None
    binary: Optional[bool] = None

class ItemResponse(BaseModel):
    id: int
    text: str
    number: float
    binary: bool 

    model_config = {"from_attributes": True}

# Role Schemas

class UserRoleResponse(BaseModel):
    id: int
    user_id: str
    role: str
    created_by: Optional[str]

    model_config = {"from_attributes": True}

class UserRoleUpdate(BaseModel):
    role: str



