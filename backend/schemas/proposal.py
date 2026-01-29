from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from uuid import UUID

class ProposalBase(BaseModel):
    client_code: str
    service_line: Optional[str] = None
    scope_summary: Optional[str] = None
    estimated_fees: float = 0
    issued_date: Optional[date] = None
    status: str = "Draft"
    outcome_reason: Optional[str] = None

class ProposalCreate(ProposalBase):
    pass

class ProposalUpdate(BaseModel):
    service_line: Optional[str] = None
    scope_summary: Optional[str] = None
    estimated_fees: Optional[float] = None
    issued_date: Optional[date] = None
    status: Optional[str] = None
    outcome_reason: Optional[str] = None

class Proposal(ProposalBase):
    proposal_id: int
    created_at: datetime
    created_by: UUID

    class Config:
        from_attributes = True
