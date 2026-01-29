from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class ClientBase(BaseModel):
    client_code: Optional[str] = None
    client_name: str
    group_name: Optional[str] = None
    industry: Optional[str] = None
    relationship_partner: Optional[UUID] = None
    primary_contact_name: Optional[str] = None
    primary_contact_email: Optional[EmailStr] = None
    status: str = "Active"

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    client_name: Optional[str] = None
    group_name: Optional[str] = None
    industry: Optional[str] = None
    relationship_partner: Optional[UUID] = None
    primary_contact_name: Optional[str] = None
    primary_contact_email: Optional[EmailStr] = None
    status: Optional[str] = None

class Client(ClientBase):
    created_at: datetime
    created_by: UUID

    class Config:
        from_attributes = True
