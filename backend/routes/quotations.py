from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from database import get_db
from models import Quotation

router = APIRouter()

class QuotationCreate(BaseModel):
    project_id: int
    vendor_id: int
    quotation_number: str
    amount: float
    description: str
    validity_date: date

@router.post("/create")
async def create_quotation(quotation: QuotationCreate, db: Session = Depends(get_db)):
    """Create a new quotation"""
    new_quotation = Quotation(
        project_id=quotation.project_id,
        vendor_id=quotation.vendor_id,
        quotation_number=quotation.quotation_number,
        amount=quotation.amount,
        description=quotation.description,
        validity_date=quotation.validity_date
    )
    db.add(new_quotation)
    db.commit()
    db.refresh(new_quotation)
    
    return {"message": "Quotation created successfully", "quotation_id": new_quotation.id}

@router.get("/project/{project_id}")
async def get_project_quotations(project_id: int, db: Session = Depends(get_db)):
    """Get quotations for a project"""
    quotations = db.query(Quotation).filter(Quotation.project_id == project_id).all()
    return [{
        "id": q.id,
        "quotation_number": q.quotation_number,
        "vendor_id": q.vendor_id,
        "amount": q.amount,
        "status": q.status,
        "validity_date": q.validity_date.isoformat()
    } for q in quotations]

@router.put("/{quotation_id}/approve")
async def approve_quotation(quotation_id: int, db: Session = Depends(get_db)):
    """Approve a quotation"""
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    quotation.status = "approved"
    db.commit()
    
    return {"message": "Quotation approved successfully"}
