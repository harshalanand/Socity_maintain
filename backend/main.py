"""
Aashiyana Homes - Society Management System
FastAPI Application Entry Point

This application provides a comprehensive solution for managing society projects,
expenses, assets, vendors, and analytics.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database initialization
from database import init_db

# Import routes
from routes import auth, users, projects, expenses, assets, vendors, quotations, invoices, analytics, members, maintenance, flats, notices

# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    init_db()
    print("✓ Database initialized successfully")
    yield
    # Shutdown event
    print("✓ Application shutting down")

# Create FastAPI application
app = FastAPI(
    title="Aashiyana Homes - Society Management System",
    description="Comprehensive society management with projects, expenses, assets, and analytics",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(assets.router, prefix="/api/assets", tags=["Assets"])
app.include_router(vendors.router, prefix="/api/vendors", tags=["Vendors"])
app.include_router(quotations.router, prefix="/api/quotations", tags=["Quotations"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(members.router, prefix="/api/members", tags=["Members Management"])
app.include_router(maintenance.router, prefix="/api/maintenance", tags=["Maintenance Charges"])
app.include_router(flats.router, prefix="/api/flats", tags=["Flats/Units"])
app.include_router(notices.router, prefix="/api/notices", tags=["Notices & Complaints"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Aashiyana Homes Society Management System API",
        "version": "2.1.0",
        "documentation": "Visit http://localhost:8000/docs",
        "features": [
            "Project Management",
            "Expense Tracking",
            "Asset Management",
            "Vendor Management",
            "Quotations",
            "Invoices",
            "Analytics & Reports",
            "Society Members Management",
            "Flat/Unit Management",
            "Maintenance Charges & Payments",
            "Utility Tracking",
            "Notices & Announcements",
            "Complaints Management",
            "Committee Management",
            "Meeting Minutes"
        ]
    }

# Health check endpoint
@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Aashiyana Homes server is running"
    }

if __name__ == "__main__":
    import uvicorn
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"""
    ╔═══════════════════════════════════════════════════════════════╗
    ║     Aashiyana Homes - Society Management System v2.0          ║
    ║                                                               ║
    ║  Starting server on http://{host}:{port}                      ║
    ║  API Documentation: http://localhost:{port}/docs              ║
    ║  ReDoc: http://localhost:{port}/redoc                        ║
    ║                                                               ║
    ║  Press Ctrl+C to stop the server                             ║
    ╚═══════════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
