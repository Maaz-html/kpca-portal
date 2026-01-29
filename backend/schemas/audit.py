from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class AuditLogBase(BaseModel):
    user_id: str
    action: str  # e.g., "CREATE", "UPDATE", "DELETE"
    entity_type: str  # e.g., "client", "proposal", "assignment"
    entity_id: str
    details: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
