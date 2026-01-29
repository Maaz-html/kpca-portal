from supabase import Client
from schemas.transaction import InvoiceCreate, InvoiceUpdate, ReceiptCreate
from schemas.audit import AuditLogCreate
from crud.audit import log_action
from uuid import UUID
from datetime import date

# INVOICES
def get_invoices(db: Client):
    result = db.table("invoices").select("*").execute()
    return result.data

def create_invoice(db: Client, invoice: InvoiceCreate, user_id: UUID):
    data = invoice.dict(exclude_unset=True)
    for key in ["invoice_date", "due_date"]:
        if key in data and data[key]:
            data[key] = data[key].isoformat()
    data["created_by"] = str(user_id)
    result = db.table("invoices").insert(data).execute()
    new_inv = result.data[0]
    
    log_action(db, AuditLogCreate(
        user_id=str(user_id),
        action="CREATE",
        entity_type="invoice",
        entity_id=new_inv["invoice_no"],
        details=f"Generated invoice for assignment: {new_inv['assignment_code']}"
    ))
    
    return new_inv
    
# RECEIPTS
def get_receipts(db: Client):
    result = db.table("receipts").select("*").execute()
    return result.data

def create_receipt(db: Client, receipt: ReceiptCreate, user_id: UUID):
    data = receipt.dict(exclude_unset=True)
    if "receipt_date" in data and data["receipt_date"]:
        data["receipt_date"] = data["receipt_date"].isoformat()
    data["created_by"] = str(user_id)
    result = db.table("receipts").insert(data).execute()
    new_rec = result.data[0]
    
    log_action(db, AuditLogCreate(
        user_id=str(user_id),
        action="CREATE",
        entity_type="receipt",
        entity_id=str(new_rec["receipt_id"]),
        details=f"Recorded receipt for invoice: {new_rec['invoice_no']}"
    ))
    
    return new_rec
