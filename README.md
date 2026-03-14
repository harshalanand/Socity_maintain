# Aashiyana Homes - Society Management System v2.0

A powerful, modern, and comprehensive Society Management System built with FastAPI (Python) backend and React frontend.

## Features

### Core Modules
- **Projects Management**: Track society projects with budgets, timelines, and completion progress
- **Work Items Tracking**: Detailed task tracking with assignments and status updates
- **Expense Management**: Comprehensive expense tracking with multiple categories and invoice support
- **Asset Management**: Maintain an inventory of all society assets with depreciation tracking
- **Vendor Management**: Manage AMP, AMC, contractors, and suppliers with contact details
- **Quotations**: Upload and manage quotations from multiple vendors for projects
- **Invoices**: Invoice management linked to expenses with document storage

### Analytics & Reporting
- **Interactive Dashboard**: Real-time metrics and KPIs
- **Monthly Expense Trends**: Visualize spending patterns over time
- **Budget vs Actual Analysis**: Compare budgeted amounts with actual spending
- **Project Completion Status**: Track project progress and completion rates
- **Expense Breakdown**: Pie charts and analysis by expense type
- **Asset Valuation**: Total asset value, depreciation tracking, and category breakdown
- **Dynamic Filters**: View data by month, quarter, or custom date ranges

### User Features
- **Role-Based Access**: Admin, Secretary, Accountant, and Member roles
- **Multi-Project Management**: Handle multiple projects simultaneously
- **Document Management**: Upload and store quotations and invoices
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite/PostgreSQL**: Database support
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **Recharts**: Interactive charts and graphs
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Lucide React**: Icon library

## Installation & Setup

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects/list` - List all projects
- `POST /api/projects/create` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project

### Expenses
- `GET /api/expenses/list` - List expenses
- `POST /api/expenses/create` - Create expense
- `GET /api/expenses/summary` - Get expense summary
- `GET /api/expenses/project/{id}` - Get project expenses

### Assets
- `GET /api/assets/list` - List assets
- `POST /api/assets/create` - Add asset
- `GET /api/assets/by-category` - Get assets by category

### Analytics
- `GET /api/analytics/dashboard-summary` - Dashboard KPIs
- `GET /api/analytics/monthly-expenses` - Monthly expense trends
- `GET /api/analytics/project-completion` - Project status
- `GET /api/analytics/expense-breakdown` - Expense analysis
- `GET /api/analytics/budget-vs-actual` - Budget comparison

## Database Schema

The system includes tables for:
- Users (with role-based access)
- Projects (with budget tracking)
- Work Items (project tasks)
- Expenses (categorized spending)
- Invoices (linked to expenses)
- Assets (with depreciation tracking)
- Vendors (AMP, AMC, contractors)
- Quotations (vendor proposals)

## Usage Guide

### Creating a Project
1. Navigate to Projects
2. Click "New Project"
3. Fill in project details (name, budget, timeline)
4. Add work items to track specific tasks
5. Monitor progress with real-time completion percentage

### Recording Expenses
1. Go to Expenses
2. Click "Add Expense"
3. Select expense type and amount
4. Add invoice number and description
5. View summary by type in the dashboard

### Managing Assets
1. Navigate to Assets
2. Add new assets with purchase value
3. Track current value and depreciation
4. Organize by category

### Viewing Analytics
1. Dashboard shows real-time KPIs
2. Select time range (All, Monthly, Quarterly)
3. Interactive charts for expense trends, budgets, and completion
4. Export ready reports

## Configuration

### Environment Variables (.env)
```
DATABASE_URL=sqlite:///./aashiyana.db
VITE_API_URL=http://localhost:8000/api
SECRET_KEY=your-secret-key
```

## Future Enhancements
- Mobile app (React Native)
- Email notifications
- PDF report generation
- Document OCR for invoice processing
- SMS alerts
- Budget forecasting with AI
- Automated maintenance reminders
- Tenant portal

## Support
For issues or feature requests, please contact the development team.

## License
Proprietary - Aashiyana Homes
