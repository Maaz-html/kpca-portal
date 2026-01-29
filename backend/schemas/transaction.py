from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from uuid import UUID

# INVOICE
class InvoiceBase(BaseModel):
    invoice_no: str
    assignment_code: str
    invoice_date: date
    amount_before_tax: float = 0
    gst_pct: float = 18.00
    due_date: Optional[date] = None
    status: str = "Issued"

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    invoice_date: Optional[date] = None
    amount_before_tax: Optional[float] = None
    gst_pct: Optional[float] = None
    due_date: Optional[date] = None
    status: Optional[str] = None

class Invoice(InvoiceBase):
    amount_with_tax: float
    created_at: datetime
    created_by: UUID

    class Config:
        from_attributes = True

# RECEIPT
class ReceiptBase(BaseModel):
    invoice_no: str
    amount_received: float = 0
    tds_amount: float = 0
    receipt_date: date
    mode: str

class ReceiptCreate(ReceiptBase):
    pass

class Receipt(ReceiptBase):
    receipt_id: int
    created_at: datetime
    created_by: UUID

    class Config:
        from_attributes = True
