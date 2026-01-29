from supabase import Client
from schemas.audit import AuditLogCreate
from datetime import datetime

def log_action(db: Client, log: AuditLogCreate):
    data = {
        "user_id": log.user_id,
        "action": log.action,
        "entity_type": log.entity_type,
        "entity_id": log.entity_id,
        "details": log.details,
        "created_at": datetime.now().isoformat()
    }
    return db.table("audit_logs").insert(data).execute()

def get_audit_logs(db: Client, limit: int = 100):
    return db.table("audit_logs") \
        .select("*") \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute().data
