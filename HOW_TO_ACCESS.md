# 🌐 HOW TO ACCESS AASHIYANA HOMES v2.1

## ✅ SERVERS ARE RUNNING

Both backend and frontend servers are currently **RUNNING** and ready to use!

---

## 🚀 **QUICK ACCESS**

### **Option 1: Local Access (Same Computer)**
```
Frontend:  http://localhost:5174
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
```

### **Option 2: Network Access (Other Computers)**
Available network addresses shown in your terminal:
```
Frontend:  http://10.61.0.215:5174
Frontend:  http://172.29.128.1:5174
Frontend:  http://192.168.31.148:5174
Frontend:  http://172.16.0.1:5174

Backend:   http://<YOUR_IP>:8000
```

---

## 🔑 **LOGIN CREDENTIALS**

```
Username: admin
Password: admin
```

---

## 📍 **ACCESSING FROM BROWSER**

### **Step 1: Open Browser**
Chrome, Firefox, Edge, Safari, etc.

### **Step 2: Go to URL**
```
Type: http://localhost:5174
      (or any network IP shown above)
```

### **Step 3: Login**
```
Username: admin
Password: admin
Click: Login
```

### **Step 4: Navigate**
- Dashboard - Overview of all data
- Members - Manage society members
- Maintenance - Track maintenance charges
- Projects - Manage projects
- Expenses - Track expenses
- Assets - Manage assets
- Vendors - Manage vendors
- Invoices - Track invoices

---

## 🔌 **AVAILABLE ADDRESSES**

Copy any of these to your browser address bar:

**Frontend (React App):**
- `http://localhost:5174` - Local only
- `http://10.61.0.215:5174` - Network (Change IP as needed)
- `http://172.29.128.1:5174` - Network
- `http://192.168.31.148:5174` - Network (Most common)
- `http://172.16.0.1:5174` - Network

**Backend API (FastAPI):**
- `http://localhost:8000` - Local only
- `http://localhost:8000/docs` - API Documentation (Swagger)
- `http://localhost:8000/redoc` - Alternative API Docs

---

## 📱 **ACCESSING FROM PHONE/TABLET**

1. Find your **main computer's IP** (use `ipconfig` on Windows)
2. On phone/tablet browser, type:
   ```
   http://192.168.31.148:5174
   ```
   (Replace `192.168.31.148` with YOUR_IP)
3. Login with: `admin` / `admin`

---

## 🔗 **API ENDPOINTS**

### **Test API (Using Postman or Browser)**

**Health Check:**
```
GET http://localhost:8000/health
```

**List Members:**
```
GET http://localhost:8000/api/members/list
```

**List Flats:**
```
GET http://localhost:8000/api/flats/list
```

**List Maintenance Charges:**
```
GET http://localhost:8000/api/maintenance/charges/list
```

---

## 📊 **AVAILABLE PAGES**

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Overview & Analytics |
| Members | `/members` | Manage Members |
| Maintenance | `/maintenance` | Track Charges |
| Projects | `/projects` | Project Management |
| Expenses | `/expenses` | Expense Tracking |
| Assets | `/assets` | Asset Management |
| Vendors | `/vendors` | Vendor Management |
| Invoices | `/invoices` | Invoice Management |

---

## 🛠️ **TROUBLESHOOTING**

### **Page Not Loading?**
1. Check if both servers are running (see terminal output)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito/private mode
4. Check firewall settings

### **Can't Access from Network?**
1. Ensure firewall allows ports 5174 and 8000
2. Check if using correct IP (not localhost)
3. Verify both are on same WiFi/network
4. Check server status in terminal

### **Login Not Working?**
1. Username: `admin` (lowercase)
2. Password: `admin` (lowercase)
3. Clear cookies/cache
4. Try different browser

### **API Not Responding?**
1. Check backend server status
2. Verify port 8000 is accessible
3. Check API documentation at `/docs`

---

## 📈 **WHAT TO TRY FIRST**

### **1. Verify Login**
```
URL:      http://localhost:5174/login
Username: admin
Password: admin
```

### **2. View Dashboard**
```
Should show analytics and charts
```

### **3. Go to Members**
```
Sidebar > Members
Should show members list (empty if first time)
```

### **4. Go to Maintenance**
```
Sidebar > Maintenance
Should show charge statistics
```

### **5. Test API**
```
http://localhost:8000/docs
Try out endpoints in Swagger UI
```

---

## 🔄 **KEEPING SERVERS RUNNING**

**Backend Terminal:** Keep window open (or runs as service)
**Frontend Terminal:** Keep window open (or runs as service)

If either stops:
1. Note the error message
2. Check requirements are installed
3. Restart the server

---

## 💾 **DATABASE**

**Location:** `backend/aashiyana.db`

The database is created automatically on first run with:
- All tables for v2.1 features
- Default admin user (admin/admin)
- Ready for test data

---

## 🌍 **DIFFERENT NETWORKS**

### **Same WiFi:**
Use your computer's local IP (192.168.x.x)

### **Different WiFi/Network:**
Requires port forwarding on router

### **Over Internet:**
Requires:
- Static IP or DynamicDNS
- Port forwarding
- SSL certificate (HTTPS)
- Production deployment

---

## ✨ **WHAT'S NEW (v2.1)**

**From Main Dashboard:**
- Members Management (NEW)
- Maintenance Charges (NEW)
- Flat Management (NEW)
- Notices & Complaints (NEW)
- Plus all v2.0 features

---

## 💡 **TIPS**

1. **First Time?** Start with Dashboard to see app
2. **Create Data:** Use Members page to add test members
3. **Test Features:** Go through each menu item
4. **View API:** Visit `/docs` for all endpoints
5. **Need Help?** Check terminal for error messages

---

## 📞 **CONTACT**

```
Repository: https://github.com/harshalanand/Socity_maintain
Issues:     Report bugs on GitHub
Docs:       Read IMPROVEMENTS_v2.1.md for features
Setup:      Read SETUP_GUIDE_v2.1.md for detailed guide
```

---

## ✅ **YOU'RE ALL SET!**

The application is **ready to use**. 

👉 **Next Step:** Open your browser and visit:
```
http://localhost:5174
```

Then login with:
```
Username: admin
Password: admin
```

Enjoy managing your society! 🏢

---

**Aashiyana Homes v2.1 | Society Management System**
