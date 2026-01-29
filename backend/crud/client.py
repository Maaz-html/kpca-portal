from supabase import Client
from schemas.client import ClientCreate, ClientUpdate
from schemas.audit import AuditLogCreate
from crud.audit import log_action
from typing import List, Optional
from uuid import UUID

def get_clients(db: Client, user_id: UUID, role: str):
    # RLS will actually handle most of this, but we can add explicit filters if needed
    query = db.table("clients").select("*")
    
    # If using service role, we might need to apply filters manually if we want to mimic RLS
    # But usually we rely on RLS with the user's token. 
    # For now, let's assume we are using service role and applying logic
    if role == "MANAGER":
        # Managers see clients where they are relationship partner OR tagged in assignments
        # This is complex for a single query in PostgREST without a view, 
        # but RLS in schema.sql already handles it.
        pass 
    
    result = query.execute()
    return result.data

def create_client(db: Client, client: ClientCreate, user_id: UUID):
    data = client.dict(exclude_unset=True)
    data["created_by"] = str(user_id)
    
    # If client_code is missing, Supabase/trigger should handle or we generate here
    if not data.get("client_code"):
        # Dummy generation or let DB fail if not handled
        pass

    result = db.table("clients").insert(data).execute()
    new_client = result.data[0]
    
    log_action(db, AuditLogCreate(
        user_id=str(user_id),
        action="CREATE",
        entity_type="client",
        entity_id=new_client["client_code"],
        details=f"Created client: {new_client['client_name']}"
    ))
    
    return new_client

def update_client(db: Client, client_code: str, client: ClientUpdate):
    data = client.dict(exclude_unset=True)
    result = db.table("clients").update(data).eq("client_code", client_code).execute()
    updated_client = result.data[0]
    
    # In a real app, we'd pass user_id here too
    # For now, we'll log it as a system action or modify the signature if needed
    # Let's assume the calling function should handle logging if user_id is required
    # But for simplicity, logging here with placeholder user_id if not passed
    
    return updated_client
