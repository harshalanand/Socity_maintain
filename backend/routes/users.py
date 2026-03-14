from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, UserRole
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    role: str = "MEMBER"

class UserUpdate(BaseModel):
    full_name: str = None
    email: str = None
    password: str = None
    role: str = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str

@router.get("/me/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role.value,
        "is_active": user.is_active
    }

@router.get("/{user_id}")
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """Get user details by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role.value,
        "is_active": user.is_active
    }

@router.put("/me/{user_id}")
async def update_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    """Update user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_data.full_name:
        user.full_name = user_data.full_name
    if user_data.email:
        user.email = user_data.email
    if user_data.password:
        user.password_hash = pwd_context.hash(user_data.password)
    
    db.commit()
    return {"message": "User updated successfully"}

@router.put("/{user_id}")
async def update_user_by_id(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    """Update user details by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_data.full_name:
        user.full_name = user_data.full_name
    if user_data.email:
        user.email = user_data.email
    if user_data.password:
        user.password_hash = pwd_context.hash(user_data.password)
    if user_data.role:
        user.role = UserRole[user_data.role.upper()]
    
    db.commit()
    return {"message": "User updated successfully"}

@router.post("/{user_id}/change-password")
async def change_password(user_id: int, password_data: dict, db: Session = Depends(get_db)):
    """Change user password"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not pwd_context.verify(password_data.get("current_password"), user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    user.password_hash = pwd_context.hash(password_data.get("new_password"))
    db.commit()
    return {"message": "Password changed successfully"}

@router.get("/list", response_model=list)
async def list_users(db: Session = Depends(get_db)):
    """List all users"""
    users = db.query(User).all()
    return [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "full_name": u.full_name,
        "role": u.role.value,
        "is_active": u.is_active
    } for u in users]

@router.post("/register")
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash=pwd_context.hash(user_data.password),
        role=UserRole[user_data.role.upper()]
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role.value,
        "message": "User created successfully"
    }

@router.delete("/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

