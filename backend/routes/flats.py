from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Flat, FlatType

router = APIRouter()

# Schemas
class FlatCreate(BaseModel):
    flat_number: str
    building: str
    flat_type: str
    area: float
    floor_number: int
    parking_slots: int = 1

class FlatUpdate(BaseModel):
    flat_number: str = None
    building: str = None
    flat_type: str = None
    area: float = None
    floor_number: int = None
    parking_slots: int = None
    status: str = None

class FlatResponse(BaseModel):
    id: int
    flat_number: str
    building: str
    flat_type: str
    area: float
    floor_number: int
    parking_slots: int
    status: str
    
    class Config:
        from_attributes = True

# Routes
@router.post("/create")
async def create_flat(flat_data: FlatCreate, db: Session = Depends(get_db)):
    """Create a new flat/unit"""
    # Validate flat type
    try:
        flat_type = FlatType[flat_data.flat_type.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail=f"Invalid flat type. Must be one of: {[e.value for e in FlatType]}")
    
    # Check if flat already exists
    existing_flat = db.query(Flat).filter(Flat.flat_number == flat_data.flat_number).first()
    if existing_flat:
        raise HTTPException(status_code=400, detail="Flat number already exists")
    
    flat = Flat(
        flat_number=flat_data.flat_number,
        building=flat_data.building,
        flat_type=flat_type,
        area=flat_data.area,
        floor_number=flat_data.floor_number,
        parking_slots=flat_data.parking_slots
    )
    db.add(flat)
    db.commit()
    db.refresh(flat)
    
    return {"message": "Flat created successfully", "flat_id": flat.id}

@router.get("/list")
async def list_flats(
    skip: int = 0,
    limit: int = 100,
    building: str = None,
    flat_type: str = None,
    db: Session = Depends(get_db)
):
    """Get all flats with optional filters"""
    query = db.query(Flat)
    
    if building:
        query = query.filter(Flat.building == building)
    
    if flat_type:
        try:
            type_enum = FlatType[flat_type.upper()]
            query = query.filter(Flat.flat_type == type_enum)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid flat type")
    
    flats = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {"total": total, "flats": flats}

@router.get("/{flat_id}")
async def get_flat(flat_id: int, db: Session = Depends(get_db)):
    """Get specific flat details with member info"""
    flat = db.query(Flat).filter(Flat.id == flat_id).first()
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    
    return {
        "flat": flat,
        "members_count": len(flat.members),
        "members": flat.members
    }

@router.put("/{flat_id}")
async def update_flat(flat_id: int, flat_data: FlatUpdate, db: Session = Depends(get_db)):
    """Update flat details"""
    flat = db.query(Flat).filter(Flat.id == flat_id).first()
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    
    if flat_data.flat_number:
        # Check if new flat number already exists
        existing = db.query(Flat).filter(
            (Flat.flat_number == flat_data.flat_number) &
            (Flat.id != flat_id)
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Flat number already exists")
        flat.flat_number = flat_data.flat_number
    
    if flat_data.building:
        flat.building = flat_data.building
    
    if flat_data.flat_type:
        try:
            flat.flat_type = FlatType[flat_data.flat_type.upper()]
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid flat type")
    
    if flat_data.area:
        flat.area = flat_data.area
    
    if flat_data.floor_number:
        flat.floor_number = flat_data.floor_number
    
    if flat_data.parking_slots:
        flat.parking_slots = flat_data.parking_slots
    
    if flat_data.status:
        flat.status = flat_data.status
    
    db.commit()
    db.refresh(flat)
    
    return {"message": "Flat updated successfully", "flat": flat}

@router.delete("/{flat_id}")
async def delete_flat(flat_id: int, db: Session = Depends(get_db)):
    """Delete a flat"""
    flat = db.query(Flat).filter(Flat.id == flat_id).first()
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    
    if flat.members:
        raise HTTPException(status_code=400, detail="Cannot delete flat with existing members")
    
    db.delete(flat)
    db.commit()
    
    return {"message": "Flat deleted successfully"}

@router.get("/building/{building}/list")
async def get_building_flats(building: str, db: Session = Depends(get_db)):
    """Get all flats in a specific building"""
    flats = db.query(Flat).filter(Flat.building == building).all()
    
    return {
        "building": building,
        "total_flats": len(flats),
        "flats": flats
    }

@router.get("/summary/overview")
async def get_flats_overview(db: Session = Depends(get_db)):
    """Get overview of all flats"""
    flats = db.query(Flat).all()
    buildings = db.query(Flat.building).distinct().all()
    flat_types = {}
    
    for flat_type in FlatType:
        count = db.query(Flat).filter(Flat.flat_type == flat_type).count()
        flat_types[flat_type.value] = count
    
    return {
        "total_flats": len(flats),
        "buildings": [b[0] for b in buildings],
        "flat_types": flat_types
    }
