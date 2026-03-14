from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from database import get_db
from models import Project, Expense, Asset, Invoice

router = APIRouter()

@router.get("/dashboard-summary")
async def dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary metrics"""
    
    total_projects = db.query(Project).count()
    active_projects = db.query(Project).filter(Project.status.in_(["planning", "in_progress"])).count()
    total_budget = db.query(func.sum(Project.budget)).scalar() or 0
    total_spent = db.query(func.sum(Expense.amount)).scalar() or 0
    total_assets = db.query(Asset).count()
    total_invoices = db.query(Invoice).count()
    
    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "total_budget": total_budget,
        "total_spent": total_spent,
        "remaining_budget": total_budget - total_spent,
        "total_assets": total_assets,
        "total_invoices": total_invoices,
        "budget_utilization_percentage": ((total_spent / total_budget) * 100) if total_budget > 0 else 0
    }

@router.get("/monthly-expenses")
async def monthly_expenses(db: Session = Depends(get_db)):
    """Get monthly expense trends"""
    today = datetime.now()
    last_12_months = today - timedelta(days=365)
    
    expenses = db.query(Expense).filter(Expense.created_at >= last_12_months).all()
    
    monthly_data = {}
    for expense in expenses:
        month_key = expense.created_at.strftime("%Y-%m")
        if month_key not in monthly_data:
            monthly_data[month_key] = 0
        monthly_data[month_key] += expense.amount
    
    return sorted(monthly_data.items())

@router.get("/project-completion")
async def project_completion_status(db: Session = Depends(get_db)):
    """Get project completion status"""
    projects = db.query(Project).all()
    
    status_count = {
        "planning": 0,
        "in_progress": 0,
        "completed": 0,
        "on_hold": 0,
        "cancelled": 0
    }
    
    for project in projects:
        status_count[project.status.value] += 1
    
    return status_count

@router.get("/expense-breakdown")
async def expense_breakdown(db: Session = Depends(get_db)):
    """Get expense breakdown by type"""
    expenses = db.query(Expense).all()
    
    breakdown = {}
    for expense in expenses:
        exp_type = expense.expense_type.value
        if exp_type not in breakdown:
            breakdown[exp_type] = 0
        breakdown[exp_type] += expense.amount
    
    return breakdown

@router.get("/monthly-budget-vs-actual")
async def budget_vs_actual(db: Session = Depends(get_db)):
    """Get monthly budget vs actual comparison"""
    projects = db.query(Project).all()
    
    data = []
    for project in projects:
        data.append({
            "project_name": project.name,
            "budget": project.budget,
            "actual_cost": project.actual_cost,
            "variance": project.budget - project.actual_cost,
            "variance_percentage": ((project.budget - project.actual_cost) / project.budget * 100) if project.budget > 0 else 0
        })
    
    return data

@router.get("/asset-valuation")
async def asset_valuation(db: Session = Depends(get_db)):
    """Get total asset valuation"""
    assets = db.query(Asset).all()
    
    total_purchase_value = sum(a.purchase_value for a in assets)
    total_current_value = sum(a.current_value for a in assets)
    depreciation = total_purchase_value - total_current_value
    
    by_category = {}
    for asset in assets:
        category = asset.category
        if category not in by_category:
            by_category[category] = {"count": 0, "value": 0}
        by_category[category]["count"] += 1
        by_category[category]["value"] += asset.current_value
    
    return {
        "total_purchase_value": total_purchase_value,
        "total_current_value": total_current_value,
        "depreciation": depreciation,
        "by_category": by_category
    }
