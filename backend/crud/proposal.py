from supabase import Client
from schemas.proposal import ProposalCreate, ProposalUpdate
from schemas.audit import AuditLogCreate
from crud.audit import log_action
from uuid import UUID
from datetime import date

def get_proposals(db: Client):
    result = db.table("proposals").select("*").execute()
    return result.data

def create_proposal(db: Client, proposal: ProposalCreate, user_id: UUID):
    data = proposal.dict(exclude_unset=True)
    for key, value in data.items():
        if isinstance(value, (date,)):
            data[key] = value.isoformat()
    data["created_by"] = str(user_id)
    result = db.table("proposals").insert(data).execute()
    new_proposal = result.data[0]
    
    log_action(db, AuditLogCreate(
        user_id=str(user_id),
        action="CREATE",
        entity_type="proposal",
        entity_id=str(new_proposal["proposal_id"]),
        details=f"Created proposal for client: {new_proposal['client_code']}"
    ))
    
    return new_proposal

def update_proposal(db: Client, proposal_id: int, proposal: ProposalUpdate):
    data = proposal.dict(exclude_unset=True)
    for key, value in data.items():
        if isinstance(value, (date,)):
            data[key] = value.isoformat()
    result = db.table("proposals").update(data).eq("proposal_id", proposal_id).execute()
    return result.data[0]
