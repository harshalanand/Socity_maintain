# 🏢 Aashiyana Homes v2.1 - Enhanced Society Management System

## 🎉 NEW FEATURES ADDED

### ✨ **Society Members Management** ✨
- **Add/Remove Members** - Complete member lifecycle management
- **Member Details** - Store contact info, identification, joining date
- **Member Status Tracking** - Active, Inactive, Moved Out, Suspended
- **Flat Association** - Link members to flats/units
- **Member Types** - Owner, Tenant, Co-owner classification
- **Search & Filter** - Quick member lookup by name, email, phone

### 💰 **Maintenance Charges System** 💰
- **Monthly Charges** - Configure charges per flat type
- **Charge Tracking** - Track pending, paid, partial, overdue payments
- **Payment Recording** - Record payments with multiple methods (Cash, Cheque, Online, UPI)
- **Payment History** - Complete payment audit trail
- **Summary Reports** - Individual and flat-level summaries
- **Overdue Tracking** - Automatic overdue detection

### 🏠 **Flat/Unit Management** 🏠
- **Flat Registration** - Register all units/flats
- **Building Organization** - Group flats by building
- **Flat Types** - 1BHK, 2BHK, 3BHK, 4BHK, Shop, Office, Parking
- **Detailed Information** - Area, floor number, parking slots
- **Flat Status** - Active/Inactive tracking
- **Building Overview** - See all flats in a building

### 📢 **Notices & Announcements** 📢
- **Create Notices** - Post important announcements
- **Notice Types** - Maintenance, Emergency, General, Meeting notices
- **Expiry Management** - Set notice validity periods
- **Document Attachments** - Attach PDFs and documents
- **Member Visibility** - Notices visible to all members

### ⚠️ **Complaints Management** ⚠️
- **File Complaints** - Members can lodge grievances
- **Complaint Categories** - Maintenance, Noise, Parking, etc.
- **Priority Levels** - Low, Medium, High, Critical severity
- **Status Tracking** - Open, In-Progress, Resolved, Closed
- **Assignment** - Assign to staff for resolution
- **Resolution Notes** - Track resolution details
- **Statistics** - Complaint metrics and analytics

### 📊 **Utility Charges** 📊
- **Water Tracking** - Monthly water consumption and charges
- **Electricity Tracking** - Monthly electricity consumption
- **Gas Tracking** - Gas consumption tracking
- **Unit-based Billing** - Track by units consumed
- **Payment Status** - Pending/Paid tracking

### 👥 **Committee Management** 👥
- **Committee Members** - Register society committee
- **Positions** - President, Vice-President, Secretary, Treasurer
- **Term Management** - Track tenure dates
- **Contact Information** - Committee member details

### 📝 **Meeting Minutes** 📝
- **Meeting Records** - Document all society meetings
- **Agenda & Minutes** - Store meeting details
- **Action Items** - Track decisions and tasks
- **Document Storage** - Attach meeting documents

---

## 🌐 **Network Access Configuration**

### **Public IP Access (Network Ready)**

The application is now configured to work on your local network and internet:

**Backend Server:**
- Configured to listen on `0.0.0.0:8000` (all network interfaces)
- Access from network: `http://<YOUR_IP>:8000`
- API documentation: `http://<YOUR_IP>:8000/docs`

**Frontend Server:**
- Configured to listen on `0.0.0.0:5173` (all network interfaces)
- Access from network: `http://<YOUR_IP>:5173`

### **Finding Your IP Address:**

**Windows:**
```powershell
ipconfig
# Look for "IPv4 Address" (usually 192.168.x.x or 10.x.x.x)
```

**Linux/Mac:**
```bash
ifconfig
# or
ip addr show
```

### **Accessing from Another Computer:**

1. Find your server's IP address (e.g., `192.168.1.100`)
2. From another computer, open browser and go to:
   - Frontend: `http://192.168.1.100:5173`
   - API: `http://192.168.1.100:8000`

### **Firewall Configuration:**

To ensure network access works:
- **Windows Firewall:** Allow ports 8000 and 5173
- **Linux Firewall:** Open ports with `sudo ufw allow 8000 5173`
- **Router:** Port forward if accessing from internet

---

## 📚 **Complete API Endpoints**

### **Members Management**
```
POST   /api/members/create              - Create new member
GET    /api/members/list                - List all members
GET    /api/members/{id}                - Get member details
PUT    /api/members/{id}                - Update member
DELETE /api/members/{id}                - Delete member
GET    /api/members/flat/{flat_id}/members
GET    /api/members/status/{status}/list
```

### **Flat/Unit Management**
```
POST   /api/flats/create                - Create flat
GET    /api/flats/list                  - List flats
GET    /api/flats/{id}                  - Get flat details
PUT    /api/flats/{id}                  - Update flat
DELETE /api/flats/{id}                  - Delete flat
GET    /api/flats/building/{building}/list
GET    /api/flats/summary/overview
```

### **Maintenance Charges**
```
POST   /api/maintenance/config/create   - Create charge config
GET    /api/maintenance/config/list     - List configurations
POST   /api/maintenance/charge/create   - Create charge
GET    /api/maintenance/charges/list    - List charges
GET    /api/maintenance/charges/{id}    - Get charge details
PUT    /api/maintenance/charges/{id}/mark-paid
POST   /api/maintenance/payment/create  - Record payment
GET    /api/maintenance/payments/list   - List payments
GET    /api/maintenance/summary/flat/{flat_id}
GET    /api/maintenance/summary/member/{member_id}
```

### **Notices & Complaints**
```
POST   /api/notices/notice/create       - Create notice
GET    /api/notices/notices/list        - List notices
PUT    /api/notices/notices/{id}        - Update notice
DELETE /api/notices/notices/{id}        - Delete notice

POST   /api/notices/complaint/create    - Create complaint
GET    /api/notices/complaints/list     - List complaints
PUT    /api/notices/complaints/{id}     - Update complaint
GET    /api/notices/complaints/member/{member_id}
GET    /api/notices/complaints/summary/statistics
```

---

## 🚀 **Quick Start**

### **Option 1: Windows Batch File (Easiest)**
```powershell
cd D:\application\aashiyana-homes\aashiyana-homes-v2
.\start.bat
```

### **Option 2: Manual Setup**

**Terminal 1 - Backend:**
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

### **Access Points:**
| Service | Local URL | Network URL |
|---------|-----------|------------|
| Frontend | http://localhost:5173 | http://YOUR_IP:5173 |
| Backend API | http://localhost:8000 | http://YOUR_IP:8000 |
| API Docs | http://localhost:8000/docs | http://YOUR_IP:8000/docs |
| Login | http://localhost:5173/login | http://YOUR_IP:5173/login |

### **Default Credentials:**
- Username: `admin`
- Password: `admin`

---

## 📁 **Database Models**

### **Core Models:**
1. **User** - System users with roles (Admin, Secretary, Accountant, Member)
2. **Flat** - Residential units with details
3. **Member** - Society residents with contact info
4. **Project** - Society projects and works
5. **Expense** - Expense tracking and categorization
6. **Asset** - Asset inventory management
7. **Vendor** - Vendor management (AMP, AMC, contractors)
8. **Quotation** - Project quotations
9. **Invoice** - Invoice management

### **New Models (v2.1):**
1. **MaintenanceChargeConfig** - Charge templates per flat type
2. **MaintenanceCharge** - Monthly charges per flat
3. **MaintenancePayment** - Payment records
4. **UtilityCharge** - Water, electricity, gas tracking
5. **Notice** - Announcements and notices
6. **Complaint** - Member grievances
7. **CommitteeMember** - Committee information
8. **MeetingMinutes** - Meeting records

---

## 🔐 **User Roles & Permissions**

| Role | Dashboard | Members | Maintenance | Complaints | Notices |
|------|-----------|---------|------------|-----------|---------|
| **Admin** | Full Access | Create/Edit/Delete | Full Access | Full Access | Create/Manage |
| **Secretary** | View | View/Edit | View/Edit | Manage | Create |
| **Accountant** | View | View | Create/View | View | View |
| **Member** | View Own | View | Pay/View Own | Create | View |

---

## 💾 **Database**

The system uses **SQLite** by default (development) but supports PostgreSQL for production.

**Database Location:** `backend/aashiyana.db`

### **Switch to PostgreSQL:**
1. Install PostgreSQL
2. Create database: `createdb aashiyana_homes`
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost/aashiyana_homes
   ```

---

## 🔄 **Version History**

### **v2.1 (Latest) - Enhanced Society Management**
- ✅ Society Members Management
- ✅ Flat/Unit Management
- ✅ Maintenance Charges & Payments
- ✅ Utility Tracking
- ✅ Notices & Announcements
- ✅ Complaints Management
- ✅ Committee Management
- ✅ Network Access Configuration
- ✅ Enhanced Analytics

### **v2.0 - Initial Release**
- Project Management
- Expense Tracking
- Asset Management
- Vendor Management
- Quotations
- Invoices
- Basic Analytics

---

## 🛠️ **Technology Stack**

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Tailwind CSS, Recharts, Axios |
| **Backend** | FastAPI, SQLAlchemy, Pydantic |
| **Database** | SQLite / PostgreSQL |
| **Server** | Uvicorn (Python ASGI) |
| **Build** | Vite, npm |

---

## 📞 **Support & Documentation**

- **API Documentation:** http://localhost:8000/docs (Swagger UI)
- **ReDoc:** http://localhost:8000/redoc
- **GitHub:** https://github.com/harshalanand/Socity_maintain

---

## 🎯 **Next Steps**

1. ✅ Install and run the application
2. ✅ Login with default credentials
3. ✅ Create flats/units
4. ✅ Add society members
5. ✅ Configure maintenance charges
6. ✅ Start tracking payments
7. ✅ Post notices and manage complaints
8. ✅ View analytics and reports

---

**Built with ❤️ for better society management**
