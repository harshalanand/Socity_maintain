from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from database import get_db
from models import Asset

router = APIRouter()

class AssetCreate(BaseModel):
    name: str
    category: str
    description: str
    purchase_date: date
    purchase_value: float
    location: str

@router.post("/create")
async def create_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    """Create a new asset"""
    new_asset = Asset(
        name=asset.name,
        category=asset.category,
        description=asset.description,
        purchase_date=asset.purchase_date,
        purchase_value=asset.purchase_value,
        current_value=asset.purchase_value,
        location=asset.location
    )
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    
    return {"message": "Asset created successfully", "asset_id": new_asset.id}

@router.get("/list")
async def list_assets(db: Session = Depends(get_db)):
    """List all assets"""
    assets = db.query(Asset).all()
    return [{
        "id": a.id,
        "name": a.name,
        "category": a.category,
        "purchase_value": a.purchase_value,
        "current_value": a.current_value,
        "location": a.location,
        "status": a.status
    } for a in assets]

@router.get("/by-category")
async def assets_by_category(db: Session = Depends(get_db)):
    """Get assets grouped by category"""
    assets = db.query(Asset).all()
    grouped = {}
    
    for asset in assets:
        category = asset.category
        if category not in grouped:
            grouped[category] = []
        grouped[category].append({
            "id": asset.id,
            "name": asset.name,
            "value": asset.current_value
        })
    
    return grouped

@router.put("/{asset_id}")
async def update_asset(asset_id: int, data: dict, db: Session = Depends(get_db)):
    """Update asset details"""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    if "current_value" in data:
        asset.current_value = data["current_value"]
    if "status" in data:
        asset.status = data["status"]
    
    db.commit()
    return {"message": "Asset updated successfully"}
