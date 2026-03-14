from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal
from database import get_db
from models import (
    MaintenanceCharge, MaintenancePayment, MaintenanceChargeConfig, 
    Flat, Member, PaymentStatus, FlatType
)

router = APIRouter()

# Schemas
class MaintenanceChargeConfigCreate(BaseModel):
    flat_type: str
    monthly_charge: Decimal
    effective_from: date
    description: str = None

class MaintenanceChargeCreate(BaseModel):
    flat_id: int
    member_id: int
    month: int
    year: int
    amount: Decimal
    due_date: date

class MaintenancePaymentCreate(BaseModel):
    maintenance_charge_id: int
    member_id: int
    flat_id: int
    amount_paid: Decimal
    payment_date: date
    payment_method: str  # Cash, Cheque, Online Transfer, UPI
    transaction_reference: str = None
    notes: str = None

class MaintenanceChargeResponse(BaseModel):
    id: int
    flat_id: int
    month: int
    year: int
    amount: Decimal
    status: str
    due_date: date
    
    class Config:
        from_attributes = True

# Routes for Maintenance Charge Configuration
@router.post("/config/create")
async def create_maintenance_config(config_data: MaintenanceChargeConfigCreate, db: Session = Depends(get_db)):
    """Create maintenance charge configuration for flat types"""
    try:
        flat_type = FlatType[config_data.flat_type.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid flat type")
    
    # Check if config already exists
    existing_config = db.query(MaintenanceChargeConfig).filter(
        MaintenanceChargeConfig.flat_type == flat_type
    ).first()
    if existing_config:
        raise HTTPException(status_code=400, detail="Configuration already exists for this flat type")
    
    config = MaintenanceChargeConfig(
        flat_type=flat_type,
        monthly_charge=config_data.monthly_charge,
        effective_from=config_data.effective_from,
        description=config_data.description
    )
    db.add(config)
    db.commit()
    db.refresh(config)
    
    return {"message": "Maintenance charge configuration created", "config_id": config.id}

@router.get("/config/list")
async def list_maintenance_configs(db: Session = Depends(get_db)):
    """Get all maintenance charge configurations"""
    configs = db.query(MaintenanceChargeConfig).all()
    return {"total": len(configs), "configs": configs}

# Routes for Monthly Maintenance Charges
@router.post("/charge/create")
async def create_maintenance_charge(charge_data: MaintenanceChargeCreate, db: Session = Depends(get_db)):
    """Create a maintenance charge for a flat"""
    flat = db.query(Flat).filter(Flat.id == charge_data.flat_id).first()
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    
    member = db.query(Member).filter(Member.id == charge_data.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Check if charge already exists
    existing_charge = db.query(MaintenanceCharge).filter(
        (MaintenanceCharge.flat_id == charge_data.flat_id) &
        (MaintenanceCharge.month == charge_data.month) &
        (MaintenanceCharge.year == charge_data.year)
    ).first()
    if existing_charge:
        raise HTTPException(status_code=400, detail="Charge already exists for this period")
    
    charge = MaintenanceCharge(
        flat_id=charge_data.flat_id,
        member_id=charge_data.member_id,
        month=charge_data.month,
        year=charge_data.year,
        amount=charge_data.amount,
        due_date=charge_data.due_date,
        status=PaymentStatus.PENDING
    )
    db.add(charge)
    db.commit()
    db.refresh(charge)
    
    return {"message": "Maintenance charge created", "charge_id": charge.id}

@router.get("/charges/list")
async def list_maintenance_charges(
    skip: int = 0, 
    limit: int = 100, 
    flat_id: int = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    """Get maintenance charges with optional filters"""
    query = db.query(MaintenanceCharge)
    
    if flat_id:
        query = query.filter(MaintenanceCharge.flat_id == flat_id)
    
    if status:
        try:
            payment_status = PaymentStatus[status.upper()]
            query = query.filter(MaintenanceCharge.status == payment_status)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid status")
    
    charges = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {"total": total, "charges": charges}

@router.get("/charges/{charge_id}")
async def get_maintenance_charge(charge_id: int, db: Session = Depends(get_db)):
    """Get specific maintenance charge details"""
    charge = db.query(MaintenanceCharge).filter(MaintenanceCharge.id == charge_id).first()
    if not charge:
        raise HTTPException(status_code=404, detail="Charge not found")
    return charge

@router.put("/charges/{charge_id}/mark-paid")
async def mark_charge_as_paid(charge_id: int, db: Session = Depends(get_db)):
    """Mark maintenance charge as paid"""
    charge = db.query(MaintenanceCharge).filter(MaintenanceCharge.id == charge_id).first()
    if not charge:
        raise HTTPException(status_code=404, detail="Charge not found")
    
    charge.status = PaymentStatus.PAID
    db.commit()
    db.refresh(charge)
    
    return {"message": "Charge marked as paid", "charge": charge}

# Routes for Maintenance Payments
@router.post("/payment/create")
async def record_maintenance_payment(payment_data: MaintenancePaymentCreate, db: Session = Depends(get_db)):
    """Record a maintenance payment"""
    charge = db.query(MaintenanceCharge).filter(
        MaintenanceCharge.id == payment_data.maintenance_charge_id
    ).first()
    if not charge:
        raise HTTPException(status_code=404, detail="Maintenance charge not found")
    
    member = db.query(Member).filter(Member.id == payment_data.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    payment = MaintenancePayment(
        maintenance_charge_id=payment_data.maintenance_charge_id,
        member_id=payment_data.member_id,
        flat_id=payment_data.flat_id,
        amount_paid=payment_data.amount_paid,
        payment_date=payment_data.payment_date,
        payment_method=payment_data.payment_method,
        transaction_reference=payment_data.transaction_reference,
        notes=payment_data.notes
    )
    db.add(payment)
    
    # Update charge status
    if payment_data.amount_paid >= charge.amount:
        charge.status = PaymentStatus.PAID
    else:
        charge.status = PaymentStatus.PARTIAL
    
    db.commit()
    db.refresh(payment)
    
    return {"message": "Payment recorded successfully", "payment_id": payment.id}

@router.get("/payments/list")
async def list_maintenance_payments(
    skip: int = 0,
    limit: int = 100,
    flat_id: int = None,
    member_id: int = None,
    db: Session = Depends(get_db)
):
    """Get maintenance payments with optional filters"""
    query = db.query(MaintenancePayment)
    
    if flat_id:
        query = query.filter(MaintenancePayment.flat_id == flat_id)
    
    if member_id:
        query = query.filter(MaintenancePayment.member_id == member_id)
    
    payments = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {"total": total, "payments": payments}

@router.get("/payments/{payment_id}")
async def get_maintenance_payment(payment_id: int, db: Session = Depends(get_db)):
    """Get specific payment details"""
    payment = db.query(MaintenancePayment).filter(MaintenancePayment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.get("/summary/flat/{flat_id}")
async def get_flat_maintenance_summary(flat_id: int, db: Session = Depends(get_db)):
    """Get maintenance payment summary for a flat"""
    flat = db.query(Flat).filter(Flat.id == flat_id).first()
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    
    charges = db.query(MaintenanceCharge).filter(MaintenanceCharge.flat_id == flat_id).all()
    payments = db.query(MaintenancePayment).filter(MaintenancePayment.flat_id == flat_id).all()
    
    total_due = sum(float(c.amount) for c in charges if c.status != PaymentStatus.PAID)
    total_paid = sum(float(p.amount_paid) for p in payments)
    
    return {
        "flat": flat.flat_number,
        "total_charges": len(charges),
        "total_payments": len(payments),
        "total_due": total_due,
        "total_paid": total_paid,
        "balance": total_due - total_paid
    }

@router.get("/summary/member/{member_id}")
async def get_member_maintenance_summary(member_id: int, db: Session = Depends(get_db)):
    """Get maintenance payment summary for a member"""
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    charges = db.query(MaintenanceCharge).filter(MaintenanceCharge.member_id == member_id).all()
    payments = db.query(MaintenancePayment).filter(MaintenancePayment.member_id == member_id).all()
    
    total_due = sum(float(c.amount) for c in charges if c.status != PaymentStatus.PAID)
    total_paid = sum(float(p.amount_paid) for p in payments)
    
    pending_charges = [c for c in charges if c.status == PaymentStatus.PENDING]
    overdue_charges = [c for c in pending_charges if c.due_date < date.today()]
    
    return {
        "member": member.name,
        "flat": member.flat.flat_number,
        "total_charges": len(charges),
        "total_payments": len(payments),
        "total_due": total_due,
        "total_paid": total_paid,
        "balance": total_due - total_paid,
        "pending_count": len(pending_charges),
        "overdue_count": len(overdue_charges)
    }
