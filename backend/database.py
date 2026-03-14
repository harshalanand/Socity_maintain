from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
import os

# Database URL - Using SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aashiyana.db")

# Create engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
else:
    engine = create_engine(DATABASE_URL)

# Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables and create default admin user"""
    Base.metadata.create_all(bind=engine)
    
    # Create default admin user if it doesn't exist
    from models import User, UserRole
    from passlib.context import CryptContext
    
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            admin_user = User(
                username="admin",
                email="admin@aashiyana.com",
                password_hash=pwd_context.hash("admin"),
                full_name="System Administrator",
                role=UserRole.ADMIN
            )
            db.add(admin_user)
            db.commit()
            print("✓ Default admin user created (username: admin, password: admin)")
    except Exception as e:
        print(f"Error creating default admin user: {e}")
        db.rollback()
    finally:
        db.close()
