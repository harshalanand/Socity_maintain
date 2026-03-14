# 🏠 Aashiyana Homes — Society Management System
**Full-Stack Application · Node.js + Express + SQLite + React**

---

## 🚀 Quick Start (3 steps)

### 1. Install Node.js
Download from https://nodejs.org (v18 or higher)

### 2. Install dependencies
Open terminal in this folder and run:
```bash
npm install
```

### 3. Start the server
```bash
npm start
```

Open your browser at → **http://localhost:3000**

---

## 🔐 Default Login Credentials

| Username   | Password         | Role   |
|------------|------------------|--------|
| admin      | aashiyana@123    | Admin  |
| secretary  | sec@123          | Editor |

> **Admin** → Full access (add, edit, delete, manage users, view audit log, settings)
> **Editor** → Add & edit records only (no delete, no admin panels)
> **Public** → View everything without logging in

---

## 📁 Project Structure

```
aashiyana-homes/
├── server.js          ← Express backend + all API routes
├── package.json       ← Node.js dependencies
├── public/
│   └── index.html     ← React frontend (single-page app)
├── db/
│   ├── aashiyana.db   ← SQLite database (auto-created)
│   └── sessions.db    ← Session storage (auto-created)
└── README.md
```

---

## 🗄️ Database Schema

### Tables
- **users** — Login accounts (admin / editor roles)
- **members** — Flat residents (owner / tenant)
- **collections** — Monthly maintenance payments
- **expenses** — Society expenditures with categories
- **staff** — Society staff (security guard, sweeper, etc.)
- **audit_logs** — Every action tracked with user + timestamp
- **settings** — Society name, maintenance amount, etc.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | /api/auth/login  | Login              |
| POST   | /api/auth/logout | Logout             |
| GET    | /api/auth/me     | Get current user   |

### Members
| Method | Endpoint           | Auth Required |
|--------|--------------------|---------------|
| GET    | /api/members       | No            |
| POST   | /api/members       | Any login     |
| PUT    | /api/members/:id   | Any login     |
| DELETE | /api/members/:id   | Admin only    |

### Collections
| Method | Endpoint              | Auth Required |
|--------|-----------------------|---------------|
| GET    | /api/collections      | No            |
| POST   | /api/collections      | Any login     |
| DELETE | /api/collections/:id  | Any login     |

### Expenses
| Method | Endpoint           | Auth Required |
|--------|--------------------|---------------|
| GET    | /api/expenses      | No            |
| POST   | /api/expenses      | Any login     |
| DELETE | /api/expenses/:id  | Any login     |

### Staff
| Method | Endpoint        | Auth Required |
|--------|-----------------|---------------|
| GET    | /api/staff      | No            |
| POST   | /api/staff      | Any login     |
| PUT    | /api/staff/:id  | Any login     |
| DELETE | /api/staff/:id  | Admin only    |

### Users (Admin only)
| Method | Endpoint        |
|--------|-----------------|
| GET    | /api/users      |
| POST   | /api/users      |
| PUT    | /api/users/:id  |
| DELETE | /api/users/:id  |

### Other
| Method | Endpoint       | Auth |
|--------|----------------|------|
| GET    | /api/dashboard | No   |
| GET    | /api/logs      | Admin|
| GET    | /api/settings  | No   |
| PUT    | /api/settings  | Admin|

---

## 📱 Mobile App Conversion

### Option A: PWA (Recommended — Free, No App Store)
1. Add to `public/` folder: `manifest.json` and a service worker `sw.js`
2. Host on any server (Render.com free tier works great)
3. Open in Chrome/Safari → "Add to Home Screen"
4. Works offline, looks like a native app

### Option B: Capacitor (iOS + Android)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
npx cap open android   # Opens Android Studio
```

### Option C: Electron (Desktop App)
```bash
npm install electron
# Add "electron": "electron ." to package.json scripts
# Add main.js Electron entry point
```

---

## 🌐 Deploy to Production (Free)

### Render.com (Easiest)
1. Push to GitHub
2. Create "Web Service" on render.com
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variable: `SESSION_SECRET=your_random_secret`

### Railway.app
```bash
npm install -g railway
railway login
railway up
```

---

## ⚙️ Environment Variables

| Variable        | Default              | Description              |
|-----------------|----------------------|--------------------------|
| PORT            | 3000                 | Server port              |
| SESSION_SECRET  | aashiyana_secret_... | Change in production!    |

Create a `.env` file (optional):
```
PORT=3000
SESSION_SECRET=my_very_secure_random_string_here
```

---

## 📲 Change Maintenance Amount
Login as admin → Settings tab → Update "Monthly Maintenance Amount"

## 👤 Add New User
Login as admin → User Accounts tab → + Add User

## 📄 Export PDF
Reports / PDF tab → Choose monthly or annual → Download

## 💬 WhatsApp Reminder
Outstanding tab → Select month → Click "Send WhatsApp Reminder" button next to each pending flat

---

## 🛡️ Security Notes
- All passwords are hashed with bcrypt (salt rounds: 10)
- Sessions expire after 24 hours
- Admin-only routes protected server-side
- SQL injection prevented via parameterized queries
- Foreign key constraints enforced

---

## 📞 Support
For questions, check the audit log to trace all changes.
Default admin password should be changed after first login via Settings.
