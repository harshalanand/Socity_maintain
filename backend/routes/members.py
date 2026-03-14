from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from database import get_db
from models import Member, Flat, MemberStatus

router = APIRouter()

# Schemas
class FlatResponse(BaseModel):
    id: int
    flat_number: str
    building: str
    flat_type: str
    
    class Config:
        from_attributes = True

class MemberCreate(BaseModel):
    flat_id: int
    name: str
    email: str
    phone: str
    alternate_phone: str = None
    date_of_joining: date
    owner_type: str  # Owner, Tenant, Co-owner
    identification_type: str
    identification_number: str
    notes: str = None

class MemberUpdate(BaseModel):
    name: str = None
    email: str = None
    phone: str = None
    alternate_phone: str = None
    member_status: str = None
    notes: str = None

class MemberResponse(BaseModel):
    id: int
    flat_id: int
    name: str
    email: str
    phone: str
    member_status: str
    owner_type: str
    date_of_joining: date
    
    class Config:
        from_attributes = True

# Routes
@router.post("/create")
async def create_member(member_data: MemberCreate, db: Session = Depends(get_db)):
    """Create a new society member"""
    # Check if flat exists
    flat = db.query(Flat).filter(Flat.id == member_data.flat_id).first()
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    
    # Check if member already exists for this flat
    existing_member = db.query(Member).filter(Member.flat_id == member_data.flat_id).first()
    if existing_member:
        raise HTTPException(status_code=400, detail="Member already exists for this flat")
    
    new_member = Member(
        flat_id=member_data.flat_id,
        name=member_data.name,
        email=member_data.email,
        phone=member_data.phone,
        alternate_phone=member_data.alternate_phone,
        date_of_joining=member_data.date_of_joining,
        owner_type=member_data.owner_type,
        identification_type=member_data.identification_type,
        identification_number=member_data.identification_number,
        notes=member_data.notes,
        member_status=MemberStatus.ACTIVE
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    return {"message": "Member created successfully", "member_id": new_member.id}

@router.get("/list")
async def list_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all society members"""
    members = db.query(Member).offset(skip).limit(limit).all()
    return {
        "total": db.query(Member).count(),
        "members": members
    }

@router.get("/{member_id}")
async def get_member(member_id: int, db: Session = Depends(get_db)):
    """Get specific member details"""
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@router.put("/{member_id}")
async def update_member(member_id: int, member_data: MemberUpdate, db: Session = Depends(get_db)):
    """Update member details"""
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if member_data.name:
        member.name = member_data.name
    if member_data.email:
        member.email = member_data.email
    if member_data.phone:
        member.phone = member_data.phone
    if member_data.alternate_phone:
        member.alternate_phone = member_data.alternate_phone
    if member_data.member_status:
        member.member_status = MemberStatus[member_data.member_status.upper()]
    if member_data.notes:
        member.notes = member_data.notes
    
    db.commit()
    db.refresh(member)
    
    return {"message": "Member updated successfully", "member": member}

@router.delete("/{member_id}")
async def delete_member(member_id: int, db: Session = Depends(get_db)):
    """Delete a member"""
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db.delete(member)
    db.commit()
    
    return {"message": "Member deleted successfully"}

@router.get("/flat/{flat_id}/members")
async def get_flat_members(flat_id: int, db: Session = Depends(get_db)):
    """Get all members in a specific flat"""
    flat = db.query(Flat).filter(Flat.id == flat_id).first()
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    
    members = db.query(Member).filter(Member.flat_id == flat_id).all()
    return {"flat": flat.flat_number, "members": members}

@router.get("/status/{status}/list")
async def get_members_by_status(status: str, db: Session = Depends(get_db)):
    """Get members by status (active, inactive, moved_out, suspended)"""
    try:
        member_status = MemberStatus[status.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    members = db.query(Member).filter(Member.member_status == member_status).all()
    return {"status": status, "count": len(members), "members": members}
