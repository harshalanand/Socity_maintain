from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date, datetime
from database import get_db
from models import Notice, Complaint, User

router = APIRouter()

# Schemas
class NoticeCreate(BaseModel):
    title: str
    description: str
    notice_type: str  # Maintenance, Emergency, General, Meeting
    posted_by: int
    expiry_date: date = None
    attachment_path: str = None

class NoticeUpdate(BaseModel):
    title: str = None
    description: str = None
    notice_type: str = None
    expiry_date: date = None
    is_active: bool = None

class NoticeResponse(BaseModel):
    id: int
    title: str
    notice_type: str
    posted_date: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class ComplaintCreate(BaseModel):
    member_id: int
    flat_id: int
    subject: str
    description: str
    category: str
    severity: str  # Low, Medium, High, Critical

class ComplaintUpdate(BaseModel):
    status: str = None
    assigned_to: int = None
    resolution_notes: str = None

class ComplaintResponse(BaseModel):
    id: int
    subject: str
    category: str
    severity: str
    status: str
    created_date: datetime
    
    class Config:
        from_attributes = True

# Notice Routes
@router.post("/notice/create")
async def create_notice(notice_data: NoticeCreate, db: Session = Depends(get_db)):
    """Create a new notice"""
    user = db.query(User).filter(User.id == notice_data.posted_by).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    notice = Notice(
        title=notice_data.title,
        description=notice_data.description,
        notice_type=notice_data.notice_type,
        posted_by=notice_data.posted_by,
        expiry_date=notice_data.expiry_date,
        attachment_path=notice_data.attachment_path
    )
    db.add(notice)
    db.commit()
    db.refresh(notice)
    
    return {"message": "Notice created successfully", "notice_id": notice.id}

@router.get("/notices/list")
async def list_notices(
    skip: int = 0,
    limit: int = 100,
    notice_type: str = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all notices"""
    query = db.query(Notice)
    
    if active_only:
        query = query.filter(Notice.is_active == True)
    
    if notice_type:
        query = query.filter(Notice.notice_type == notice_type)
    
    notices = query.order_by(Notice.posted_date.desc()).offset(skip).limit(limit).all()
    total = query.count()
    
    return {"total": total, "notices": notices}

@router.get("/notices/{notice_id}")
async def get_notice(notice_id: int, db: Session = Depends(get_db)):
    """Get specific notice"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return notice

@router.put("/notices/{notice_id}")
async def update_notice(notice_id: int, notice_data: NoticeUpdate, db: Session = Depends(get_db)):
    """Update notice"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    if notice_data.title:
        notice.title = notice_data.title
    if notice_data.description:
        notice.description = notice_data.description
    if notice_data.notice_type:
        notice.notice_type = notice_data.notice_type
    if notice_data.expiry_date:
        notice.expiry_date = notice_data.expiry_date
    if notice_data.is_active is not None:
        notice.is_active = notice_data.is_active
    
    db.commit()
    db.refresh(notice)
    
    return {"message": "Notice updated successfully", "notice": notice}

@router.delete("/notices/{notice_id}")
async def delete_notice(notice_id: int, db: Session = Depends(get_db)):
    """Delete notice"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    db.delete(notice)
    db.commit()
    
    return {"message": "Notice deleted successfully"}

# Complaint Routes
@router.post("/complaint/create")
async def create_complaint(complaint_data: ComplaintCreate, db: Session = Depends(get_db)):
    """Create a new complaint"""
    complaint = Complaint(
        member_id=complaint_data.member_id,
        flat_id=complaint_data.flat_id,
        subject=complaint_data.subject,
        description=complaint_data.description,
        category=complaint_data.category,
        severity=complaint_data.severity
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    
    return {"message": "Complaint created successfully", "complaint_id": complaint.id}

@router.get("/complaints/list")
async def list_complaints(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    severity: str = None,
    db: Session = Depends(get_db)
):
    """Get all complaints"""
    query = db.query(Complaint)
    
    if status:
        query = query.filter(Complaint.status == status)
    
    if severity:
        query = query.filter(Complaint.severity == severity)
    
    complaints = query.order_by(Complaint.created_date.desc()).offset(skip).limit(limit).all()
    total = query.count()
    
    return {"total": total, "complaints": complaints}

@router.get("/complaints/{complaint_id}")
async def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    """Get specific complaint"""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/complaints/{complaint_id}")
async def update_complaint(complaint_id: int, complaint_data: ComplaintUpdate, db: Session = Depends(get_db)):
    """Update complaint status and details"""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if complaint_data.status:
        complaint.status = complaint_data.status
        if complaint_data.status == "resolved":
            complaint.resolved_date = datetime.utcnow()
    
    if complaint_data.assigned_to:
        user = db.query(User).filter(User.id == complaint_data.assigned_to).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        complaint.assigned_to = complaint_data.assigned_to
    
    if complaint_data.resolution_notes:
        complaint.resolution_notes = complaint_data.resolution_notes
    
    db.commit()
    db.refresh(complaint)
    
    return {"message": "Complaint updated successfully", "complaint": complaint}

@router.delete("/complaints/{complaint_id}")
async def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    """Delete complaint"""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    db.delete(complaint)
    db.commit()
    
    return {"message": "Complaint deleted successfully"}

@router.get("/complaints/member/{member_id}")
async def get_member_complaints(member_id: int, db: Session = Depends(get_db)):
    """Get all complaints filed by a member"""
    complaints = db.query(Complaint).filter(Complaint.member_id == member_id).all()
    return {"member_id": member_id, "count": len(complaints), "complaints": complaints}

@router.get("/complaints/summary/statistics")
async def get_complaints_statistics(db: Session = Depends(get_db)):
    """Get complaint statistics"""
    total = db.query(Complaint).count()
    open_count = db.query(Complaint).filter(Complaint.status == "open").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "in_progress").count()
    resolved = db.query(Complaint).filter(Complaint.status == "resolved").count()
    
    critical_count = db.query(Complaint).filter(Complaint.severity == "critical").count()
    high_count = db.query(Complaint).filter(Complaint.severity == "high").count()
    
    return {
        "total_complaints": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved,
        "critical": critical_count,
        "high": high_count
    }
