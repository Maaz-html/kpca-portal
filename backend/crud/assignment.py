from supabase import Client
from schemas.assignment import AssignmentCreate, AssignmentUpdate
from schemas.audit import AuditLogCreate
from crud.audit import log_action
from uuid import UUID
from datetime import date

def get_assignments(db: Client):
    result = db.table("assignments").select("*").execute()
    return result.data

def create_assignment(db: Client, assignment: AssignmentCreate, user_id: UUID):
    data = assignment.dict(exclude_unset=True)
    # Convert dates to string for JSON serialization
    for key in ["start_date", "end_date"]:
        if key in data and data[key]:
            data[key] = data[key].isoformat()
    # UUIDs to string
    for key in ["partner_lead", "director", "manager"]:
        if key in data and data[key]:
            data[key] = str(data[key])
            
    data["created_by"] = str(user_id)
    result = db.table("assignments").insert(data).execute()
    new_asg = result.data[0]
    
    log_action(db, AuditLogCreate(
        user_id=str(user_id),
        action="CREATE",
        entity_type="assignment",
        entity_id=new_asg["assignment_code"],
        details=f"Created assignment: {new_asg['title']}"
    ))
    
    return new_asg

def update_assignment(db: Client, assignment_code: str, assignment: AssignmentUpdate):
    data = assignment.dict(exclude_unset=True)
    for key in ["start_date", "end_date"]:
        if key in data and data[key]:
            data[key] = data[key].isoformat()
    for key in ["partner_lead", "director", "manager"]:
        if key in data and data[key]:
            data[key] = str(data[key])
            
    result = db.table("assignments").update(data).eq("assignment_code", assignment_code).execute()
    return result.data[0]
