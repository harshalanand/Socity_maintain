# 🚀 Setup Guide - Aashiyana Homes v2.1

## Step-by-Step Installation

### **Prerequisites**
- Python 3.8+
- Node.js 16+
- npm or yarn
- Windows PowerShell / Linux Terminal / Mac Terminal

---

## **Step 1: Install Backend Dependencies**

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## **Step 2: Configure Backend Environment**

Create `.env` file in backend folder with:

```ini
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Database
DATABASE_URL=sqlite:///./aashiyana.db

# Security (Change in production)
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## **Step 3: Initialize Database**

The database initializes automatically on first run, including:
- All tables creation
- Default admin user (username: `admin`, password: `admin`)

---

## **Step 4: Start Backend Server**

```powershell
cd backend
python main.py
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════╗
║  Aashiyana Homes - Society Management System v2.1 ║
║  Starting server on http://0.0.0.0:8000          ║
║  API Documentation: http://localhost:8000/docs   ║
╚═══════════════════════════════════════════════════╝
```

---

## **Step 5: Install Frontend Dependencies**

In a new terminal:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

---

## **Step 6: Configure Frontend**

Create `.env` file in frontend folder (optional):

```ini
VITE_API_URL=http://localhost:8000/api
```

---

## **Step 7: Start Frontend Server**

```powershell
cd frontend
npm run dev
```

**Output:**
```
  VITE v5.0.0  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://YOUR_IP:5173/
```

---

## **Step 8: Access Application**

### **Local Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### **Network Access:**
Replace `YOUR_IP` with your actual IP (from `ipconfig` on Windows)
- Frontend: http://YOUR_IP:5173
- Backend API: http://YOUR_IP:8000

### **Login:**
- Username: `admin`
- Password: `admin`

---

## **Quick Setup Using Batch File (Windows)**

```powershell
cd D:\application\aashiyana-homes\aashiyana-homes-v2
.\start.bat
```

This opens both backend and frontend in separate windows.

---

## **Verify Installation**

### **Check Backend:**
```
curl http://localhost:8000/health
```
Expected response:
```json
{
  "status": "healthy",
  "message": "Aashiyana Homes server is running"
}
```

### **Check Frontend:**
Open http://localhost:5173 in browser - you should see login page

### **API Documentation:**
Visit http://localhost:8000/docs to see all available API endpoints

---

## **Initial Setup Tasks**

### **1. Create Flats/Units**
```
Navigate to: http://localhost:5173/flats
Click: Add Flat
Fill: Flat Number, Building, Type (1BHK, 2BHK, etc.), Area, Floor
```

### **2. Add Society Members**
```
Navigate to: http://localhost:5173/members
Click: Add Member
Fill: Name, Email, Phone, Flat ID, Member Type
```

### **3. Configure Maintenance Charges**
```
API Call (using Postman or curl):
POST http://localhost:8000/api/maintenance/config/create
{
  "flat_type": "2BHK",
  "monthly_charge": 5000.00,
  "effective_from": "2024-03-14",
  "description": "Monthly maintenance charge"
}
```

### **4. Create Monthly Charges**
```
API Call:
POST http://localhost:8000/api/maintenance/charge/create
{
  "flat_id": 1,
  "member_id": 1,
  "month": 3,
  "year": 2024,
  "amount": 5000.00,
  "due_date": "2024-03-31"
}
```

### **5. Record Payments**
```
API Call:
POST http://localhost:8000/api/maintenance/payment/create
{
  "maintenance_charge_id": 1,
  "member_id": 1,
  "flat_id": 1,
  "amount_paid": 5000.00,
  "payment_date": "2024-03-20",
  "payment_method": "Online Transfer",
  "transaction_reference": "TXN123456"
}
```

---

## **Troubleshooting**

### **Issue: Port Already in Use**

**Backend (Port 8000):**
```powershell
# Windows - Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Then start backend with different port
$env:PORT=9000; python main.py
```

**Frontend (Port 5173):**
```powershell
# Press Ctrl+C to stop dev server
# Then run again:
npm run dev -- --port 3000
```

### **Issue: Module Not Found**

```powershell
# Ensure virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

### **Issue: Database Error**

```powershell
# Delete and recreate database
del backend\aashiyana.db
python backend\main.py
```

---

## **Development Mode Tips**

### **Hot Reload:**
- Backend automatically reloads on file changes (with `DEBUG=True`)
- Frontend hot-reloads when you save files

### **API Testing:**
- Use Swagger UI at http://localhost:8000/docs
- Use ReDoc at http://localhost:8000/redoc
- Use Postman for advanced testing

### **Database Inspection:**
```powershell
# Install sqlite browser (optional)
pip install db-browser-sqlite

# Open database
db-browser-sqlite backend\aashiyana.db
```

---

## **Production Deployment**

### **Before Going Live:**

1. **Change Security Settings in `.env`:**
   ```ini
   DEBUG=False
   SECRET_KEY=<generate-strong-random-key>
   ALLOWED_ORIGINS=["https://yourdomain.com"]
   ```

2. **Use PostgreSQL instead of SQLite:**
   ```ini
   DATABASE_URL=postgresql://user:pass@host/aashiyana_homes
   ```

3. **Build Frontend:**
   ```powershell
   cd frontend
   npm run build
   # Output: frontend/dist/
   ```

4. **Use Production Server:**
   ```powershell
   cd backend
   gunicorn -w 4 -b 0.0.0.0:8000 main:app
   ```

---

## **Environment Variables Reference**

| Variable | Default | Description |
|----------|---------|------------|
| `HOST` | 0.0.0.0 | Server host (0.0.0.0 = all interfaces) |
| `PORT` | 8000 | Backend port |
| `DEBUG` | True | Debug mode (set False in production) |
| `DATABASE_URL` | sqlite | Database connection string |
| `SECRET_KEY` | - | JWT secret (required for production) |
| `ALLOWED_ORIGINS` | ["*"] | CORS origins |

---

## **Network Configuration**

### **Allow Windows Firewall:**

```powershell
# Allow Python.exe
netsh advfirewall firewall add rule name="Python" dir=in action=allow program="C:\Python\python.exe" enable=yes

# Allow specific ports
netsh advfirewall firewall add rule name="Port 8000" dir=in action=allow protocol=tcp localport=8000
netsh advfirewall firewall add rule name="Port 5173" dir=in action=allow protocol=tcp localport=5173
```

### **Allow Linux Firewall:**

```bash
sudo ufw allow 8000
sudo ufw allow 5173
sudo ufw enable
```

---

## **Next Steps**

1. ✅ Complete installation
2. ✅ Login to application
3. ✅ Create test data
4. ✅ Explore all features
5. ✅ Customize for your society
6. ✅ Backup database regularly
7. ✅ Plan for updates and maintenance

---

**For Support:**
- Check logs in terminal/console
- Review API documentation at /docs
- Check database with DB Browser

---

**Happy Society Management! 🏢**
