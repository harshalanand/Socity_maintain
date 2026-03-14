from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from database import get_db
from models import Expense, ExpenseType

router = APIRouter()

class ExpenseCreate(BaseModel):
    project_id: int = None
    expense_type: str
    amount: float
    description: str
    narration: str = None
    invoice_number: str = None
    expense_date: date

@router.post("/create")
async def create_expense(expense: ExpenseCreate, user_id: int, db: Session = Depends(get_db)):
    """Create a new expense"""
    new_expense = Expense(
        project_id=expense.project_id,
        expense_type=ExpenseType[expense.expense_type.upper()],
        amount=expense.amount,
        description=expense.description,
        narration=expense.narration,
        invoice_number=expense.invoice_number,
        expense_date=expense.expense_date,
        created_by=user_id
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    
    return {"message": "Expense created successfully", "expense_id": new_expense.id}

@router.get("/list")
async def list_expenses(db: Session = Depends(get_db)):
    """List all expenses"""
    expenses = db.query(Expense).all()
    return [{
        "id": e.id,
        "expense_type": e.expense_type.value,
        "amount": e.amount,
        "description": e.description,
        "invoice_number": e.invoice_number,
        "expense_date": e.expense_date.isoformat()
    } for e in expenses]

@router.get("/project/{project_id}")
async def get_project_expenses(project_id: int, db: Session = Depends(get_db)):
    """Get expenses for a project"""
    expenses = db.query(Expense).filter(Expense.project_id == project_id).all()
    return [{
        "id": e.id,
        "expense_type": e.expense_type.value,
        "amount": e.amount,
        "description": e.description,
        "expense_date": e.expense_date.isoformat()
    } for e in expenses]

@router.get("/summary")
async def get_expense_summary(db: Session = Depends(get_db)):
    """Get expense summary by type"""
    expenses = db.query(Expense).all()
    summary = {}
    
    for expense in expenses:
        exp_type = expense.expense_type.value
        if exp_type not in summary:
            summary[exp_type] = 0
        summary[exp_type] += expense.amount
    
    return summary
