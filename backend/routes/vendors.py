from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Vendor

router = APIRouter()

class VendorCreate(BaseModel):
    name: str
    vendor_type: str  # AMP, AMC, Contractor, Supplier
    contact_person: str
    email: str
    phone: str
    address: str
    amc_details: str = None

@router.post("/create")
async def create_vendor(vendor: VendorCreate, db: Session = Depends(get_db)):
    """Create a new vendor"""
    new_vendor = Vendor(
        name=vendor.name,
        vendor_type=vendor.vendor_type,
        contact_person=vendor.contact_person,
        email=vendor.email,
        phone=vendor.phone,
        address=vendor.address,
        amc_details=vendor.amc_details
    )
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)
    
    return {"message": "Vendor created successfully", "vendor_id": new_vendor.id}

@router.get("/list")
async def list_vendors(db: Session = Depends(get_db)):
    """List all vendors"""
    vendors = db.query(Vendor).all()
    return [{
        "id": v.id,
        "name": v.name,
        "vendor_type": v.vendor_type,
        "contact_person": v.contact_person,
        "email": v.email,
        "phone": v.phone
    } for v in vendors]

@router.get("/by-type/{vendor_type}")
async def vendors_by_type(vendor_type: str, db: Session = Depends(get_db)):
    """Get vendors by type"""
    vendors = db.query(Vendor).filter(Vendor.vendor_type == vendor_type).all()
    return [{
        "id": v.id,
        "name": v.name,
        "contact_person": v.contact_person,
        "email": v.email,
        "phone": v.phone
    } for v in vendors]

@router.get("/{vendor_id}")
async def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    """Get vendor details"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    return {
        "id": vendor.id,
        "name": vendor.name,
        "vendor_type": vendor.vendor_type,
        "contact_person": vendor.contact_person,
        "email": vendor.email,
        "phone": vendor.phone,
        "address": vendor.address,
        "amc_details": vendor.amc_details
    }
