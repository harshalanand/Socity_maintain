from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from database import get_db
from models import Project, ProjectStatus, WorkItem

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    description: str
    budget: float
    start_date: date
    end_date: date

class ProjectUpdate(BaseModel):
    name: str = None
    description: str = None
    status: str = None
    budget: float = None
    actual_cost: float = None
    completion_percentage: float = None
    end_date: date = None

class WorkItemCreate(BaseModel):
    title: str
    description: str
    assigned_to: str
    start_date: date
    end_date: date

@router.post("/create")
async def create_project(project: ProjectCreate, user_id: int, db: Session = Depends(get_db)):
    """Create a new project"""
    new_project = Project(
        name=project.name,
        description=project.description,
        budget=project.budget,
        start_date=project.start_date,
        end_date=project.end_date,
        created_by=user_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return {"message": "Project created successfully", "project_id": new_project.id}

@router.get("/list")
async def list_projects(db: Session = Depends(get_db)):
    """List all projects"""
    projects = db.query(Project).all()
    return [{
        "id": p.id,
        "name": p.name,
        "status": p.status.value,
        "budget": p.budget,
        "actual_cost": p.actual_cost,
        "completion_percentage": p.completion_percentage,
        "start_date": p.start_date.isoformat(),
        "end_date": p.end_date.isoformat()
    } for p in projects]

@router.get("/{project_id}")
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get project details"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    work_items = db.query(WorkItem).filter(WorkItem.project_id == project_id).all()
    
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status.value,
        "budget": project.budget,
        "actual_cost": project.actual_cost,
        "completion_percentage": project.completion_percentage,
        "start_date": project.start_date.isoformat(),
        "end_date": project.end_date.isoformat(),
        "work_items": [{
            "id": w.id,
            "title": w.title,
            "status": w.status.value,
            "completion_percentage": w.completion_percentage,
            "assigned_to": w.assigned_to
        } for w in work_items]
    }

@router.put("/{project_id}")
async def update_project(project_id: int, project_data: ProjectUpdate, db: Session = Depends(get_db)):
    """Update project details"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_data.name:
        project.name = project_data.name
    if project_data.description:
        project.description = project_data.description
    if project_data.status:
        project.status = ProjectStatus[project_data.status.upper()]
    if project_data.budget is not None:
        project.budget = project_data.budget
    if project_data.actual_cost is not None:
        project.actual_cost = project_data.actual_cost
    if project_data.completion_percentage is not None:
        project.completion_percentage = project_data.completion_percentage
    if project_data.end_date:
        project.end_date = project_data.end_date
    
    db.commit()
    return {"message": "Project updated successfully"}

@router.post("/{project_id}/work-items")
async def create_work_item(project_id: int, item: WorkItemCreate, db: Session = Depends(get_db)):
    """Create a work item for a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_item = WorkItem(
        project_id=project_id,
        title=item.title,
        description=item.description,
        assigned_to=item.assigned_to,
        start_date=item.start_date,
        end_date=item.end_date
    )
    db.add(new_item)
    db.commit()
    
    return {"message": "Work item created successfully", "work_item_id": new_item.id}
