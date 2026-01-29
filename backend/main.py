from fastapi import FastAPI, Depends, HTTPException, Security, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from database import get_supabase
from auth import get_current_user, RoleChecker, UserRole
from schemas.client import Client, ClientCreate, ClientUpdate
from schemas.proposal import Proposal, ProposalCreate, ProposalUpdate
from schemas.assignment import Assignment, AssignmentCreate, AssignmentUpdate
from schemas.transaction import Invoice, InvoiceCreate, Receipt, ReceiptCreate
from crud import client as client_crud
from crud import proposal as proposal_crud
from crud import assignment as assignment_crud
from crud import transaction as transaction_crud
from crud import reports as reports_crud
from crud import audit as audit_crud
from crud import user as user_crud
from utils import io as io_utils
from utils import upload as upload_utils

app = FastAPI(title="KPCA Portal API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Client Endpoints
@app.get("/api/clients", response_model=List[Client])
async def read_clients(user=Depends(get_current_user), db=Depends(get_supabase)):
    return client_crud.get_clients(db, user["id"], user["role"])

@app.post("/api/clients", response_model=Client, status_code=201)
async def create_new_client(
    client: ClientCreate,
    user=Depends(RoleChecker([UserRole.PARTNER, UserRole.DIRECTOR, UserRole.MANAGER])),
    db=Depends(get_supabase)
):
    return client_crud.create_client(db, client, user["id"])

# Proposal Endpoints
@app.get("/api/proposals", response_model=List[Proposal])
async def read_proposals(user=Depends(get_current_user), db=Depends(get_supabase)):
    return proposal_crud.get_proposals(db)

@app.post("/api/proposals", response_model=Proposal, status_code=201)
async def create_new_proposal(
    proposal: ProposalCreate,
    user=Depends(RoleChecker([UserRole.PARTNER, UserRole.DIRECTOR, UserRole.MANAGER])),
    db=Depends(get_supabase)
):
    return proposal_crud.create_proposal(db, proposal, user["id"])

# Assignment Endpoints
@app.get("/api/assignments", response_model=List[Assignment])
async def read_assignments(user=Depends(get_current_user), db=Depends(get_supabase)):
    return assignment_crud.get_assignments(db)

@app.post("/api/assignments", response_model=Assignment, status_code=201)
async def create_new_assignment(
    assignment: AssignmentCreate,
    user=Depends(RoleChecker([UserRole.PARTNER, UserRole.DIRECTOR])),
    db=Depends(get_supabase)
):
    return assignment_crud.create_assignment(db, assignment, user["id"])

# Billing & Collections
@app.get("/api/invoices", response_model=List[Invoice])
async def read_invoices(
    user=Depends(RoleChecker([UserRole.PARTNER, UserRole.DIRECTOR, UserRole.MANAGER])),
    db=Depends(get_supabase)
):
    return transaction_crud.get_invoices(db)

@app.post("/api/invoices", response_model=Invoice, status_code=201)
async def create_new_invoice(
    invoice: InvoiceCreate,
    user=Depends(RoleChecker([UserRole.DIRECTOR, UserRole.PARTNER])),
    db=Depends(get_supabase)
):
    return transaction_crud.create_invoice(db, invoice, user["id"])

@app.get("/api/receipts", response_model=List[Receipt])
async def read_receipts(user=Depends(get_current_user), db=Depends(get_supabase)):
    return transaction_crud.get_receipts(db)

@app.post("/api/receipts", response_model=Receipt, status_code=201)
async def create_new_receipt(
    receipt: ReceiptCreate,
    user=Depends(RoleChecker([UserRole.DIRECTOR, UserRole.PARTNER])),
    db=Depends(get_supabase)
):
    return transaction_crud.create_receipt(db, receipt, user["id"])

# Export Endpoint
@app.get("/api/export/{entity}")
async def export_data(
    entity: str,
    format: str = "xlsx",
    user=Depends(get_current_user),
    db=Depends(get_supabase)
):
    # Map entity string to CRUD function
    data_map = {
        "clients": client_crud.get_clients,
        "proposals": proposal_crud.get_proposals,
        "assignments": assignment_crud.get_assignments,
        "invoices": transaction_crud.get_invoices,
        "receipts": transaction_crud.get_receipts
    }
    
    if entity not in data_map:
        raise HTTPException(status_code=400, detail="Invalid entity")
    
    # Fetch data - simplified (role logic should be in CRUD or handled here)
    if entity == "clients":
        data = data_map[entity](db, user["id"], user["role"])
    else:
        data = data_map[entity](db)
        
    if format == "xlsx":
        return io_utils.export_to_excel(data, entity, user.get("email", "System User"))
    else:
        return io_utils.export_to_csv(data, entity)

# Reporting Endpoints
@app.get("/api/reports/billing")
async def billing_summary(user=Depends(RoleChecker([UserRole.PARTNER, UserRole.DIRECTOR])), db=Depends(get_supabase)):
    return reports_crud.get_billing_summary(db)

@app.get("/api/reports/aging")
async def ar_aging(user=Depends(RoleChecker([UserRole.PARTNER, UserRole.DIRECTOR])), db=Depends(get_supabase)):
    return reports_crud.get_ar_aging(db)

@app.get("/api/reports/proposals")
async def proposal_stats(user=Depends(get_current_user), db=Depends(get_supabase)):
    return reports_crud.get_proposal_stats(db)

@app.get("/api/audit-logs")
async def audit_logs(user=Depends(RoleChecker([UserRole.PARTNER, UserRole.DIRECTOR])), db=Depends(get_supabase)):
    return audit_crud.get_audit_logs(db)

@app.get("/api/users")
async def get_users(user=Depends(RoleChecker([UserRole.PARTNER])), db=Depends(get_supabase)):
    return user_crud.get_users(db)

@app.put("/api/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role_update: dict,
    user=Depends(RoleChecker([UserRole.PARTNER])),
    db=Depends(get_supabase)
):
    role = role_update.get("role")
    if role not in [r.value for r in UserRole]:
        raise HTTPException(status_code=400, detail="Invalid role")
    return user_crud.update_user_role(db, user_id, role)

@app.post("/api/upload/{entity}")
async def upload_data(
    entity: str,
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db=Depends(get_supabase)
):
    try:
        content = await file.read()
        data = upload_utils.parse_upload_file(content, file.filename)
        
        if entity == "clients":
            validated_data = upload_utils.validate_clients(data)
            created_count = 0
            for client_create in validated_data:
                client_crud.create_client(db, client_create, user["id"])
                created_count += 1
            return {"message": f"Successfully uploaded {created_count} clients"}
        else:
            raise HTTPException(status_code=400, detail="Bulk upload for this entity is not yet implemented")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
