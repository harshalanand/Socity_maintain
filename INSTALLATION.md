# Installation & Setup Guide - Aashiyana Homes v2.0

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Quick Start (Windows)

### 1. Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create database tables (automatically done on first run)
python main.py
```

The backend will start on `http://localhost:8000`
- Swagger API Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 2. Frontend Setup

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Quick Start (Linux/Mac)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python main.py
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Using Start Scripts

### Windows
```powershell
# From root directory
.\start.bat
```

This will open two command windows - one for backend, one for frontend.

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

## Default Login Credentials

**Demo Account:**
- Username: `admin`
- Password: `admin`

You can register new users through the application once logged in.

## Project Structure

```
aashiyana-homes-v2/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── requirements.txt         # Python dependencies
│   └── routes/
│       ├── auth.py             # Authentication endpoints
│       ├── users.py            # User management
│       ├── projects.py         # Project management
│       ├── expenses.py         # Expense tracking
│       ├── assets.py           # Asset management
│       ├── vendors.py          # Vendor management
│       ├── quotations.py       # Quotation management
│       ├── invoices.py         # Invoice management
│       └── analytics.py        # Analytics endpoints
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # Global styles
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Dashboard page
│   │   │   ├── Projects.jsx    # Projects page
│   │   │   ├── Expenses.jsx    # Expenses page
│   │   │   ├── Assets.jsx      # Assets page
│   │   │   └── Login.jsx       # Login page
│   │   ├── services/
│   │   │   └── api.js          # API client
│   │   └── context/
│   │       └── AuthContext.jsx # Auth state management
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── .gitignore
├── start.bat                   # Windows start script
└── start.sh                    # Unix start script
```

## Database Schema

The system automatically creates these tables on first run:

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- full_name
- phone
- role (admin, secretary, accountant, member)
- is_active
- created_at
```

### Projects Table
```sql
- id
- name
- description
- status (planning, in_progress, completed, on_hold, cancelled)
- budget
- actual_cost
- start_date
- end_date
- completion_percentage
- created_by (FK to Users)
```

### Other Tables
- WorkItems (project tasks)
- Expenses (spending records)
- Invoices (billing documents)
- Assets (inventory)
- Vendors (suppliers)
- Quotations (vendor proposals)

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

All API endpoints are documented and can be tested directly from the browser.

## Key Features Demo

### 1. Dashboard
- Real-time KPI cards
- Interactive expense charts
- Project completion status
- Budget vs Actual comparison
- Asset valuation overview
- Time range filters (All, Monthly, Quarterly)

### 2. Projects
- Create projects with budgets
- Track project status
- Monitor completion percentage
- Add work items for detailed tracking
- Budget utilization analysis

### 3. Expenses
- Record expenses with categories
- Link to invoices
- Track by project
- View expense breakdown
- Generate monthly reports

### 4. Assets
- Add society assets
- Track purchase and current value
- Monitor depreciation
- Organize by category
- Calculate total asset value

### 5. Vendors
- Manage vendor details
- Separate AMP, AMC, contractors
- Store contact information
- Link to quotations and invoices

## Troubleshooting

### Backend Issues

**Port already in use:**
```powershell
# Kill the process using port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database locked:**
Delete `aashiyana.db` file and restart - it will be recreated.

**Import errors:**
```powershell
pip install --upgrade fastapi uvicorn sqlalchemy
```

### Frontend Issues

**Port 5173 in use:**
```bash
npm run dev -- --port 5174
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

Create a `.env` file in the backend root:

```
DATABASE_URL=sqlite:///./aashiyana.db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

## Performance Tips

1. **Database Optimization**: Use PostgreSQL for production instead of SQLite
2. **API Caching**: Add Redis for frequently accessed data
3. **Frontend**: Run `npm run build` for production
4. **Logging**: Enable logging for debugging in development

## Security Considerations

1. Change default admin credentials immediately
2. Use strong passwords
3. Enable HTTPS in production
4. Set appropriate CORS origins
5. Implement API rate limiting
6. Validate all user inputs

## Deployment

### Deploy Backend (Heroku example)
```bash
cd backend
# Follow Heroku Flask deployment guide
```

### Deploy Frontend (Vercel example)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

## Support & Documentation

- API Documentation: `http://localhost:8000/docs`
- Frontend Source: View in browser dev tools
- Database: SQLite (aashiyana.db)

## Next Steps

1. Explore the dashboard
2. Create sample projects
3. Add expenses and track them
4. Register vendors
5. Generate reports

Enjoy using Aashiyana Homes!
