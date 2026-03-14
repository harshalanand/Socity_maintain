# 🚀 Quick Start Guide - Aashiyana Homes v2.2

## ⚡ 5-Minute Setup

### Step 1: Verify Servers Running
Both servers should be running. Check terminals:

**Backend Terminal Output:**
```
✓ Database initialized successfully
INFO: Application startup complete.
Uvicorn running on http://0.0.0.0:8000
```

**Frontend Terminal Output:**
```
VITE v5.4.21 ready in 324 ms
➜ Local: http://localhost:5173/
```

### Step 2: Open Application
1. Open browser
2. Go to: `http://localhost:5173`
3. Login with:
   - **Username:** admin
   - **Password:** admin

### Step 3: Explore Features

#### Main Navigation (Left Sidebar)
- **Dashboard** - Overview and statistics
- **Members** - Manage society members
- **Maintenance** - Track maintenance charges
- **Projects** - Manage projects
- **Expenses** - Record expenses
- **Assets** - Track assets
- **Users** - Create and manage users ⭐ NEW
- **Settings** - System configuration ⭐ NEW
- **And more...**

#### User Menu (Top-Right Corner)
Click your name/avatar to access:
- **My Profile** - View and edit profile
- **Settings** - Profile, security, and system settings
- **Logout** - Sign out safely

---

## 🎯 Common Tasks

### Create a New User
1. Click **Users** in sidebar
2. Click **Add User** button
3. Fill in:
   - Username (unique)
   - Full Name
   - Email (unique)
   - Password
   - Role (Admin/Member)
4. Click **Create User**

### Manage Your Profile
1. Click avatar/username in top-right
2. Click **My Profile**
3. Click **Edit Profile**
4. Update information
5. Click **Save Changes**

### Change Password
1. Click avatar in top-right
2. Click **Settings**
3. Go to **Security** tab
4. Enter current and new password
5. Click **Update Password**

### Configure System Settings
1. Click avatar in top-right
2. Click **Settings**
3. Go to **System** tab
4. Update:
   - Organization Name
   - Organization Address
   - Notification Email
   - Timezone
5. Click **Save Settings**

---

## 🔧 Server Management

### Start Servers (Fresh Start)
```powershell
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Stop Servers
- Press `Ctrl+C` in each terminal

### Check if Running
```powershell
# Check backend
curl http://localhost:8000/docs

# Check frontend
curl http://localhost:5173
```

---

## 📱 Network Access

Access from other devices:

**Option 1: Using Localhost**
- Same computer only
- http://localhost:5173

**Option 2: Using Network IP**
From the terminal, you'll see:
```
➜ Network: http://10.61.0.215:5173/
➜ Network: http://172.29.128.1:5173/
➜ Network: http://192.168.31.148:5173/
```

**Use one of these IPs from other devices on the same network**

---

## 🔒 Security Notes

### Default Admin
- Username: `admin`
- Password: `admin` (Change on first login!)

### After First Login
1. Create admin user with strong password
2. Change default admin password
3. Set up role-based users
4. Configure system settings

### Best Practices
- Don't share passwords
- Change default admin password immediately
- Use unique, strong passwords
- Regularly backup database
- Review user list monthly

---

## 🛠️ Troubleshooting

### "Cannot connect to server"
✅ **Fix:**
1. Check both terminals are running
2. Backend should show "Application startup complete"
3. Frontend should show "VITE ready"

### "Invalid credentials"
✅ **Fix:**
1. Ensure backend database is initialized
2. Default user is auto-created on first run
3. Check console for errors
4. Restart backend: `python main.py`

### "Page not found after login"
✅ **Fix:**
1. Check sidebar is visible
2. Click Dashboard in sidebar
3. Clear browser cache (Ctrl+Shift+Del)
4. Reload page (Ctrl+R)

### "User creation failed"
✅ **Fix:**
1. Check username is unique
2. Check email format is correct
3. Check password requirements
4. View backend console for errors

### "Settings not saving"
✅ **Fix:**
1. Check network connection
2. Verify backend is responding
3. Check browser console for errors
4. Try reloading page

---

## 📊 What's New in v2.2

| Feature | Status | Location |
|---------|--------|----------|
| User Management | ✅ NEW | Sidebar > Users |
| Settings Page | ✅ NEW | Top Menu > Settings |
| Profile Page | ✅ NEW | Top Menu > My Profile |
| Header User Menu | ✅ NEW | Top-Right Corner |
| Improved Layout | ✅ FIXED | Full App |
| Multiple Navigator | ✅ FIXED | Fixed Layout |

---

## 🎓 Tips & Tricks

### Sidebar Tips
- Click hamburger icon to collapse sidebar
- Collapsed sidebar shows only icons
- Full menu shows labels and icons

### Quick Access
- Use sidebar menu for navigation
- Use top-right menu for personal settings
- Use avatar for quick profile access

### Responsive Design
- Works on desktop and tablets
- Works on mobile (touch-friendly)
- Sidebar collapses on smaller screens

### Dark Mode (If Enabled)
- Check User Menu > Settings
- Toggle appearance preference

---

## 📞 Getting Help

### Check API Documentation
```
http://localhost:8000/docs
```

### View Error Logs
1. Open browser console (F12)
2. Check for red error messages
3. Backend terminal will show detailed errors

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Route doesn't exist | Check URL in sidebar |
| 401 Unauthorized | Not logged in | Login again |
| 500 Server Error | Backend issue | Check backend terminal, restart |
| CORS Error | Cross-origin issue | Verify backend CORS settings |

---

## 🎉 Next Steps

1. ✅ Login to application
2. ✅ Explore all menu items
3. ✅ Create test users
4. ✅ Configure system settings
5. ✅ Add real data (members, flats, etc.)
6. ✅ Set up maintenance charges
7. ✅ Configure notifications

---

## 📌 Important Notes

- ⚠️ Default admin password should be changed immediately
- ⚠️ Database file: `aashiyana.db` (SQLite)
- ⚠️ Backup database regularly
- ⚠️ All user passwords are hashed with bcrypt
- ⚠️ Settings are stored in memory (not persistent yet)

---

**Happy Managing! 🏠**

*For detailed documentation, see IMPROVEMENTS_v2.2.md*
