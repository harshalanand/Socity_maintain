from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, Date, Enum, ForeignKey, DECIMAL
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

class MemberStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MOVED_OUT = "moved_out"
    SUSPENDED = "suspended"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    PARTIAL = "partial"
    OVERDUE = "overdue"

class FlatType(str, enum.Enum):
    FLAT_1BHK = "1BHK"
    FLAT_2BHK = "2BHK"
    FLAT_3BHK = "3BHK"
    FLAT_4BHK = "4BHK"
    SHOP = "shop"
    OFFICE = "office"
    PARKING = "parking"

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

# ====== NEW MODELS FOR SOCIETY MANAGEMENT ======

# Flat/Unit Model
class Flat(Base):
    __tablename__ = "flats"
    
    id = Column(Integer, primary_key=True, index=True)
    flat_number = Column(String(50), unique=True, index=True)
    building = Column(String(100))
    flat_type = Column(Enum(FlatType))
    area = Column(Float)  # in sq ft
    floor_number = Column(Integer)
    parking_slots = Column(Integer, default=1)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    members = relationship("Member", back_populates="flat", cascade="all, delete-orphan")

# Society Member Model
class Member(Base):
    __tablename__ = "members"
    
    id = Column(Integer, primary_key=True, index=True)
    flat_id = Column(Integer, ForeignKey("flats.id"))
    name = Column(String(255), index=True)
    email = Column(String(100))
    phone = Column(String(20))
    alternate_phone = Column(String(20))
    date_of_joining = Column(Date)
    member_status = Column(Enum(MemberStatus), default=MemberStatus.ACTIVE)
    owner_type = Column(String(50))  # Owner, Tenant, Co-owner
    identification_type = Column(String(50))  # Aadhar, PAN, Passport
    identification_number = Column(String(50))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    flat = relationship("Flat", back_populates="members")
    maintenance_payments = relationship("MaintenancePayment", back_populates="member", cascade="all, delete-orphan")

# Maintenance Charge Configuration Model
class MaintenanceChargeConfig(Base):
    __tablename__ = "maintenance_charge_config"
    
    id = Column(Integer, primary_key=True, index=True)
    flat_type = Column(Enum(FlatType), unique=True)
    monthly_charge = Column(DECIMAL(10, 2))  # Monthly maintenance charge
    effective_from = Column(Date)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Monthly Maintenance Charge Model
class MaintenanceCharge(Base):
    __tablename__ = "maintenance_charges"
    
    id = Column(Integer, primary_key=True, index=True)
    flat_id = Column(Integer, ForeignKey("flats.id"))
    member_id = Column(Integer, ForeignKey("members.id"))
    month = Column(Integer)  # 1-12
    year = Column(Integer)
    amount = Column(DECIMAL(10, 2))
    due_date = Column(Date)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    payments = relationship("MaintenancePayment", back_populates="maintenance_charge", cascade="all, delete-orphan")

# Maintenance Payment Model
class MaintenancePayment(Base):
    __tablename__ = "maintenance_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    maintenance_charge_id = Column(Integer, ForeignKey("maintenance_charges.id"))
    member_id = Column(Integer, ForeignKey("members.id"))
    flat_id = Column(Integer, ForeignKey("flats.id"))
    amount_paid = Column(DECIMAL(10, 2))
    payment_date = Column(Date)
    payment_method = Column(String(50))  # Cash, Cheque, Online Transfer, UPI
    transaction_reference = Column(String(100))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    maintenance_charge = relationship("MaintenanceCharge", back_populates="payments")
    member = relationship("Member", back_populates="maintenance_payments")

# Utility Charges Model (Water, Electricity, etc.)
class UtilityCharge(Base):
    __tablename__ = "utility_charges"
    
    id = Column(Integer, primary_key=True, index=True)
    flat_id = Column(Integer, ForeignKey("flats.id"))
    utility_type = Column(String(50))  # Water, Electricity, Gas
    month = Column(Integer)
    year = Column(Integer)
    units_consumed = Column(Float)
    rate_per_unit = Column(DECIMAL(10, 2))
    total_amount = Column(DECIMAL(10, 2))
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

# Notice & Announcement Model
class Notice(Base):
    __tablename__ = "notices"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    notice_type = Column(String(50))  # Maintenance, Emergency, General, Meeting
    posted_by = Column(Integer, ForeignKey("users.id"))
    posted_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(Date, nullable=True)
    attachment_path = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Complaint/Grievance Model
class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    flat_id = Column(Integer, ForeignKey("flats.id"))
    subject = Column(String(255), index=True)
    description = Column(Text)
    category = Column(String(50))  # Maintenance, Noise, Parking, etc.
    severity = Column(String(50))  # Low, Medium, High, Critical
    status = Column(String(50), default="open")  # open, in_progress, resolved, closed
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_date = Column(DateTime, default=datetime.utcnow)
    resolved_date = Column(DateTime, nullable=True)
    resolution_notes = Column(Text)

# Committee Member Model (For managing society administration)
class CommitteeMember(Base):
    __tablename__ = "committee_members"
    
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    position = Column(String(100))  # President, Vice-President, Secretary, Treasurer, Member
    term_start_date = Column(Date)
    term_end_date = Column(Date, nullable=True)
    contact_phone = Column(String(20))
    contact_email = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

# Meeting Minutes Model
class MeetingMinutes(Base):
    __tablename__ = "meeting_minutes"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_date = Column(Date)
    meeting_type = Column(String(100))  # AGM, Committee Meeting, General Meeting
    agenda = Column(Text)
    minutes = Column(Text)
    attendees = Column(Text)  # JSON or comma-separated member IDs
    action_items = Column(Text)
    document_path = Column(String(255), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

