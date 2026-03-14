from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

# Enums
class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    CANCELLED = "cancelled"

class ExpenseType(str, enum.Enum):
    MAINTENANCE = "maintenance"
    REPAIR = "repair"
    UTILITIES = "utilities"
    STAFF = "staff"
    SECURITY = "security"
    LANDSCAPING = "landscaping"
    MISCELLANEOUS = "miscellaneous"

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    SECRETARY = "secretary"
    ACCOUNTANT = "accountant"
    MEMBER = "member"

# User Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    full_name = Column(String(255))
    phone = Column(String(20))
    role = Column(Enum(UserRole), default=UserRole.MEMBER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    projects = relationship("Project", back_populates="created_by_user")
    expenses = relationship("Expense", back_populates="created_by_user")

# Project Model
class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(Text)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANNING)
    budget = Column(Float, default=0.0)
    actual_cost = Column(Float, default=0.0)
    start_date = Column(Date)
    end_date = Column(Date)
    completion_percentage = Column(Float, default=0.0)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    created_by_user = relationship("User", back_populates="projects")
    work_items = relationship("WorkItem", back_populates="project", cascade="all, delete-orphan")
    quotations = relationship("Quotation", back_populates="project", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="project", cascade="all, delete-orphan")

# Work Item Model (for project tracking)
class WorkItem(Base):
    __tablename__ = "work_items"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String(255))
    description = Column(Text)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANNING)
    assigned_to = Column(String(255))
    completion_percentage = Column(Float, default=0.0)
    start_date = Column(Date)
    end_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="work_items")

# Quotation Model
class Quotation(Base):
    __tablename__ = "quotations"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    quotation_number = Column(String(100), unique=True, index=True)
    amount = Column(Float)
    description = Column(Text)
    validity_date = Column(Date)
    document_path = Column(String(255))
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="quotations")
    vendor = relationship("Vendor", back_populates="quotations")

# Expense Model
class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    expense_type = Column(Enum(ExpenseType))
    amount = Column(Float)
    description = Column(Text)
    narration = Column(Text)
    invoice_number = Column(String(100))
    expense_date = Column(Date)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="expenses")
    created_by_user = relationship("User", back_populates="expenses")
    invoice = relationship("Invoice", back_populates="expense", uselist=False)

# Invoice Model
class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    invoice_number = Column(String(100), unique=True, index=True)
    amount = Column(Float)
    invoice_date = Column(Date)
    document_path = Column(String(255))
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    expense = relationship("Expense", back_populates="invoice")
    vendor = relationship("Vendor", back_populates="invoices")

# Asset Model
class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    category = Column(String(100))
    description = Column(Text)
    purchase_date = Column(Date)
    purchase_value = Column(Float)
    current_value = Column(Float)
    location = Column(String(255))
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

# Vendor Model
class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    vendor_type = Column(String(100))  # AMP, AMC, Contractor, Supplier, etc.
    contact_person = Column(String(255))
    email = Column(String(100))
    phone = Column(String(20))
    address = Column(Text)
    amc_details = Column(Text)  # For AMC vendors
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    quotations = relationship("Quotation", back_populates="vendor")
    invoices = relationship("Invoice", back_populates="vendor")
