/**
 * Aashiyana Homes — Society Management System
 * Backend: Express.js + SQLite (sqlite3)
 * Version: 2.0.0
 */

"use strict";

const express       = require("express");
const sqlite3       = require("sqlite3").verbose();
const session       = require("express-session");
const SQLiteStore   = require("connect-sqlite3")(session);
const bcrypt        = require("bcryptjs");
const path          = require("path");
const { v4: uuidv4 }= require("uuid");

const app  = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "db", "aashiyana.db");

/* ══════════════════════════════════════════════════════
   DATABASE SETUP
══════════════════════════════════════════════════════ */
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA foreign_keys = ON");
  initDB();
});

function initDB() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      username    TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      name        TEXT NOT NULL,
      role        TEXT NOT NULL CHECK(role IN ('admin','editor')),
      created_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS members (
      id          TEXT PRIMARY KEY,
      flat        TEXT NOT NULL,
      name        TEXT NOT NULL,
      phone       TEXT,
      type        TEXT NOT NULL CHECK(type IN ('owner','tenant')),
      email       TEXT,
      created_at  TEXT DEFAULT (datetime('now','localtime')),
      updated_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS collections (
      id          TEXT PRIMARY KEY,
      member_id   TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      flat_no     TEXT NOT NULL,
      member_name TEXT NOT NULL,
      phone       TEXT,
      month       INTEGER NOT NULL,
      year        INTEGER NOT NULL,
      amount      REAL NOT NULL,
      date        TEXT NOT NULL,
      note        TEXT,
      by_id       TEXT REFERENCES users(id),
      by_name     TEXT,
      created_at  TEXT DEFAULT (datetime('now','localtime')),
      UNIQUE(member_id, month, year)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id          TEXT PRIMARY KEY,
      category    TEXT NOT NULL,
      description TEXT NOT NULL,
      amount      REAL NOT NULL,
      date        TEXT NOT NULL,
      note        TEXT,
      added_by    TEXT,
      by_id       TEXT REFERENCES users(id),
      created_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS staff (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      role        TEXT NOT NULL,
      salary      REAL DEFAULT 0,
      phone       TEXT,
      join_date   TEXT,
      created_at  TEXT DEFAULT (datetime('now','localtime')),
      updated_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id          TEXT PRIMARY KEY,
      action      TEXT NOT NULL,
      user_id     TEXT,
      user_name   TEXT,
      ip          TEXT,
      created_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key         TEXT PRIMARY KEY,
      value       TEXT NOT NULL,
      updated_at  TEXT DEFAULT (datetime('now','localtime'))
    );
  `;

  const statements = schema.split(';').filter(s => s.trim());
  let stmtIndex = 0;

  function executeNext() {
    if (stmtIndex >= statements.length) {
      seedData();
      return;
    }
    db.run(statements[stmtIndex] + ';', (err) => {
      if (err) console.error("Schema error:", err);
      stmtIndex++;
      executeNext();
    });
  }

  executeNext();
}

function seedData() {
  // Seed admin user
  db.get("SELECT id FROM users WHERE username = 'admin'", (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync("aashiyana@123", 10);
      db.run(
        `INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), "admin", hash, "Administrator", "admin"]
      );
    }
  });

  // Seed secretary user
  db.get("SELECT id FROM users WHERE username = 'secretary'", (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync("sec@123", 10);
      db.run(
        `INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), "secretary", hash, "Secretary", "editor"]
      );
    }
  });

  // Seed settings
  const defaults = {
    society_name: "Aashiyana Homes",
    maintenance_amount: "1500",
    penalty_per_month: "100",
    address: "",
    contact_email: "",
  };
  
  for (const [k, v] of Object.entries(defaults)) {
    db.run(
      "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
      [k, v]
    );
  }

  // Seed members
  db.get("SELECT COUNT(*) AS cnt FROM members", (err, row) => {
    if (row && row.cnt === 0) {
      const sampleMembers = [
        ["A-101", "Rajesh Sharma", "9876543210", "owner"],
        ["A-102", "Priya Patel", "9876543211", "owner"],
        ["A-201", "Sunil Verma", "9876543212", "tenant"],
        ["A-202", "Meena Gupta", "9876543213", "owner"],
        ["A-301", "Amit Kumar", "9876543214", "owner"],
        ["A-302", "Sunita Singh", "9876543215", "tenant"],
        ["A-401", "Vikram Joshi", "9876543216", "owner"],
        ["A-402", "Neha Agarwal", "9876543217", "owner"],
      ];
      
      for (const [flat, name, phone, type] of sampleMembers) {
        db.run(
          "INSERT INTO members (id, flat, name, phone, type) VALUES (?, ?, ?, ?, ?)",
          [uuidv4(), flat, name, phone, type]
        );
      }
    }
  });

  // Seed staff
  db.get("SELECT COUNT(*) AS cnt FROM staff", (err, row) => {
    if (row && row.cnt === 0) {
      db.run(
        "INSERT INTO staff (id, name, role, salary, phone, join_date) VALUES (?, ?, ?, ?, ?, ?)",
        [uuidv4(), "Ramesh Kumar", "Security Guard", 8000, "9876500001", "2024-01-01"]
      );
    }
  });

  console.log("✅ Database initialised at:", DB_PATH);
  startApp();
}

function startApp() {
  /* ══════════════════════════════════════════════════════
     MIDDLEWARE
  ══════════════════════════════════════════════════════ */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    store: new SQLiteStore({ db: "sessions.db", dir: path.join(__dirname, "db") }),
    secret: process.env.SESSION_SECRET || "aashiyana_secret_2024_xyz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    },
  }));

  app.use(express.static(path.join(__dirname, "public")));

  /* ══════════════════════════════════════════════════════
     HELPER FUNCTIONS
  ══════════════════════════════════════════════════════ */
  function audit(action, req) {
    try {
      db.run(
        "INSERT INTO audit_logs (id, action, user_id, user_name, ip) VALUES (?, ?, ?, ?, ?)",
        [uuidv4(), action, req.session?.user?.id || null, req.session?.user?.name || "Unknown", req.ip]
      );
    } catch {}
  }

  function requireAuth(req, res, next) {
    if (!req.session?.user) return res.status(401).json({ error: "Not authenticated" });
    next();
  }

  function requireAdmin(req, res, next) {
    if (!req.session?.user) return res.status(401).json({ error: "Not authenticated" });
    if (req.session.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    next();
  }

  function getSettings(callback) {
    db.all("SELECT key, value FROM settings", (err, rows) => {
      if (err) return callback(err, null);
      const settings = {};
      if (rows) {
        rows.forEach(r => { settings[r.key] = r.value; });
      }
      callback(null, settings);
    });
  }

  /* ══════════════════════════════════════════════════════
     AUTH ROUTES
  ══════════════════════════════════════════════════════ */
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (err || !user) return res.status(401).json({ error: "Invalid credentials" });
      
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.user = { id: user.id, name: user.name, role: user.role };
      audit(`Login: ${username}`, req);
      res.json({ success: true, user: req.session.user });
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    audit("Logout", req);
    req.session.destroy();
    res.json({ success: true });
  });

  app.get("/api/auth/user", requireAuth, (req, res) => {
    res.json({ user: req.session.user });
  });

  /* ══════════════════════════════════════════════════════
     MEMBERS ROUTES
  ══════════════════════════════════════════════════════ */
  app.get("/api/members", requireAuth, (req, res) => {
    db.all("SELECT * FROM members ORDER BY flat ASC", (err, members) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(members || []);
    });
  });

  app.post("/api/members", requireAuth, (req, res) => {
    const { flat, name, phone, type, email } = req.body;
    const id = uuidv4();
    
    db.run(
      "INSERT INTO members (id, flat, name, phone, type, email) VALUES (?, ?, ?, ?, ?, ?)",
      [id, flat, name, phone, type, email],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        audit(`Added member: ${name}`, req);
        res.json({ id, flat, name, phone, type, email });
      }
    );
  });

  app.get("/api/members/:id", requireAuth, (req, res) => {
    db.get("SELECT * FROM members WHERE id = ?", [req.params.id], (err, member) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(member || {});
    });
  });

  app.put("/api/members/:id", requireAuth, (req, res) => {
    const { flat, name, phone, type, email } = req.body;
    
    db.run(
      "UPDATE members SET flat=?, name=?, phone=?, type=?, email=?, updated_at=datetime('now','localtime') WHERE id=?",
      [flat, name, phone, type, email, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        audit(`Updated member: ${name}`, req);
        db.get("SELECT * FROM members WHERE id = ?", [req.params.id], (err, member) => {
          res.json(member);
        });
      }
    );
  });

  app.delete("/api/members/:id", requireAdmin, (req, res) => {
    db.get("SELECT name FROM members WHERE id = ?", [req.params.id], (err, member) => {
      if (member) audit(`Deleted member: ${member.name}`, req);
      
      db.run("DELETE FROM members WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    });
  });

  /* ══════════════════════════════════════════════════════
     COLLECTIONS ROUTES
  ══════════════════════════════════════════════════════ */
  app.get("/api/collections", requireAuth, (req, res) => {
    db.all("SELECT * FROM collections ORDER BY year DESC, month DESC", (err, collections) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(collections || []);
    });
  });

  app.post("/api/collections", requireAuth, (req, res) => {
    const { member_id, flat_no, member_name, phone, month, year, amount, note } = req.body;
    const id = uuidv4();
    
    db.run(
      `INSERT INTO collections 
       (id, member_id, flat_no, member_name, phone, month, year, amount, date, note, by_id, by_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now','localtime'), ?, ?, ?)`,
      [id, member_id, flat_no, member_name, phone, month, year, amount, note, req.session.user.id, req.session.user.name],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        audit(`Added collection: ${member_name} - ${amount}`, req);
        res.json({ id, member_id, flat_no, member_name, phone, month, year, amount, note });
      }
    );
  });

  app.delete("/api/collections/:id", requireAdmin, (req, res) => {
    db.run("DELETE FROM collections WHERE id = ?", [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      audit("Deleted collection", req);
      res.json({ success: true });
    });
  });

  /* ══════════════════════════════════════════════════════
     EXPENSES ROUTES
  ══════════════════════════════════════════════════════ */
  app.get("/api/expenses", requireAuth, (req, res) => {
    db.all("SELECT * FROM expenses ORDER BY date DESC", (err, expenses) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(expenses || []);
    });
  });

  app.post("/api/expenses", requireAuth, (req, res) => {
    const { category, description, amount, note } = req.body;
    const id = uuidv4();
    
    db.run(
      `INSERT INTO expenses 
       (id, category, description, amount, date, note, added_by, by_id) 
       VALUES (?, ?, ?, ?, datetime('now','localtime'), ?, ?, ?)`,
      [id, category, description, amount, note, req.session.user.name, req.session.user.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        audit(`Added expense: ${category} - ${amount}`, req);
        res.json({ id, category, description, amount, note });
      }
    );
  });

  app.delete("/api/expenses/:id", requireAdmin, (req, res) => {
    db.run("DELETE FROM expenses WHERE id = ?", [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      audit("Deleted expense", req);
      res.json({ success: true });
    });
  });

  /* ══════════════════════════════════════════════════════
     STAFF ROUTES
  ══════════════════════════════════════════════════════ */
  app.get("/api/staff", requireAuth, (req, res) => {
    db.all("SELECT * FROM staff ORDER BY name ASC", (err, staff) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(staff || []);
    });
  });

  app.post("/api/staff", requireAuth, (req, res) => {
    const { name, role, salary, phone, join_date } = req.body;
    const id = uuidv4();
    
    db.run(
      "INSERT INTO staff (id, name, role, salary, phone, join_date) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, role, salary, phone, join_date],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        audit(`Added staff: ${name}`, req);
        res.json({ id, name, role, salary, phone, join_date });
      }
    );
  });

  app.put("/api/staff/:id", requireAuth, (req, res) => {
    const { name, role, salary, phone } = req.body;
    
    db.run(
      "UPDATE staff SET name=?, role=?, salary=?, phone=?, updated_at=datetime('now','localtime') WHERE id=?",
      [name, role, salary, phone, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        audit(`Updated staff: ${name}`, req);
        res.json({ success: true });
      }
    );
  });

  app.delete("/api/staff/:id", requireAdmin, (req, res) => {
    db.run("DELETE FROM staff WHERE id = ?", [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      audit("Deleted staff", req);
      res.json({ success: true });
    });
  });

  /* ══════════════════════════════════════════════════════
     DASHBOARD / STATS
  ══════════════════════════════════════════════════════ */
  app.get("/api/dashboard", requireAuth, (req, res) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    Promise.all([
      new Promise((resolve) => db.get("SELECT COUNT(*) AS count FROM members", (err, row) => resolve(row?.count || 0))),
      new Promise((resolve) => db.get("SELECT COUNT(*) AS count FROM staff", (err, row) => resolve(row?.count || 0))),
      new Promise((resolve) => db.get("SELECT SUM(amount) AS total FROM collections", (err, row) => resolve(row?.total || 0))),
      new Promise((resolve) => db.get(`SELECT SUM(amount) AS total FROM collections WHERE month = ? AND year = ?`, [currentMonth, currentYear], (err, row) => resolve(row?.total || 0))),
      new Promise((resolve) => db.get("SELECT COUNT(*) AS count FROM collections WHERE month = ? AND year = ?", [currentMonth, currentYear], (err, row) => resolve(row?.count || 0))),
      new Promise((resolve) => db.get("SELECT SUM(amount) AS total FROM expenses", (err, row) => resolve(row?.total || 0))),
      new Promise((resolve) => db.all("SELECT * FROM collections ORDER BY date DESC LIMIT 5", (err, rows) => resolve(rows || []))),
      new Promise((resolve) => db.all("SELECT * FROM expenses ORDER BY date DESC LIMIT 5", (err, rows) => resolve(rows || []))),
      new Promise((resolve) => getSettings((err, settings) => resolve(settings || {})))
    ]).then(([totalMembers, staffCount, totalBalance, monthCollected, monthPayments, totalExpenses, recentCollections, recentExpenses, settings]) => {
      res.json({
        totalMembers,
        staffCount,
        totalBalance,
        monthCollected,
        monthPayments,
        monthPending: Math.max(0, totalMembers - monthPayments),
        totalExpenses,
        currentMonth,
        currentYear,
        recentCollections,
        recentExpenses,
        settings
      });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
  });

  /* ══════════════════════════════════════════════════════
     SETTINGS ROUTES
  ══════════════════════════════════════════════════════ */
  app.get("/api/settings", requireAuth, (req, res) => {
    getSettings((err, settings) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(settings);
    });
  });

  app.put("/api/settings", requireAdmin, (req, res) => {
    const { key, value } = req.body;
    
    db.run(
      "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now','localtime'))",
      [key, value],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        audit(`Updated setting: ${key}`, req);
        res.json({ key, value });
      }
    );
  });

  /* ══════════════════════════════════════════════════════
     AUDIT LOGS
  ══════════════════════════════════════════════════════ */
  app.get("/api/audit-logs", requireAdmin, (req, res) => {
    db.all(
      "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100",
      (err, logs) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(logs || []);
      }
    );
  });

  /* ══════════════════════════════════════════════════════
     FALLBACK ROUTE
  ══════════════════════════════════════════════════════ */
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  /* ══════════════════════════════════════════════════════
     START SERVER
  ══════════════════════════════════════════════════════ */
  app.listen(PORT, () => {
    console.log(`\n🏠 Aashiyana Homes — Society Management System`);
    console.log(`   Server  : http://localhost:${PORT}`);
    console.log(`   Database: ${DB_PATH}`);
    console.log(`\n   Admin Login :`);
    console.log(`   Username: admin`);
    console.log(`   Password: aashiyana@123\n`);
  });
}

module.exports = app;
