from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from database import get_db
from models import Invoice

router = APIRouter()

class InvoiceCreate(BaseModel):
    expense_id: int
    invoice_number: str
    amount: float
    invoice_date: date
    vendor_id: int = None

@router.post("/create")
async def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    """Create a new invoice"""
    new_invoice = Invoice(
        expense_id=invoice.expense_id,
        invoice_number=invoice.invoice_number,
        amount=invoice.amount,
        invoice_date=invoice.invoice_date,
        vendor_id=invoice.vendor_id
    )
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    
    return {"message": "Invoice created successfully", "invoice_id": new_invoice.id}

@router.get("/list")
async def list_invoices(db: Session = Depends(get_db)):
    """List all invoices"""
    invoices = db.query(Invoice).all()
    return [{
        "id": i.id,
        "invoice_number": i.invoice_number,
        "amount": i.amount,
        "invoice_date": i.invoice_date.isoformat(),
        "vendor_id": i.vendor_id
    } for i in invoices]

@router.get("/{invoice_id}")
async def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Get invoice details"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "amount": invoice.amount,
        "invoice_date": invoice.invoice_date.isoformat(),
        "vendor_id": invoice.vendor_id,
        "expense_id": invoice.expense_id
    }
