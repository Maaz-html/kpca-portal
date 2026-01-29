from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime, date
from uuid import UUID

class AssignmentBase(BaseModel):
    assignment_code: str
    client_code: str
    proposal_id: Optional[int] = None
    title: str
    service_line: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    partner_lead: Optional[UUID] = None
    director: Optional[UUID] = None
    manager: Optional[UUID] = None
    contracted_fee: float = 0
    status: str = "Planned"

    @validator('end_date')
    def date_check(cls, v, values):
        if 'start_date' in values and v and values['start_date'] and v < values['start_date']:
            raise ValueError('end_date must be >= start_date')
        return v

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    service_line: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    partner_lead: Optional[UUID] = None
    director: Optional[UUID] = None
    manager: Optional[UUID] = None
    contracted_fee: Optional[float] = None
    status: Optional[str] = None

class Assignment(AssignmentBase):
    created_at: datetime
    created_by: UUID

    class Config:
        from_attributes = True
