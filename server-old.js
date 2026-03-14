/**
 * Aashiyana Homes — Society Management System
 * Backend: Express.js + SQLite (better-sqlite3)
 * Version: 2.0.0
 */

"use strict";

const express       = require("express");
const Database      = require("better-sqlite3");
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
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initDB() {
  db.exec(`
    /* Users */
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      username    TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      name        TEXT NOT NULL,
      role        TEXT NOT NULL CHECK(role IN ('admin','editor')),
      created_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    /* Members / Residents */
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

    /* Fund Collections */
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

    /* Expenses */
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

    /* Staff */
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

    /* Audit Logs */
    CREATE TABLE IF NOT EXISTS audit_logs (
      id          TEXT PRIMARY KEY,
      action      TEXT NOT NULL,
      user_id     TEXT,
      user_name   TEXT,
      ip          TEXT,
      created_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    /* Settings */
    CREATE TABLE IF NOT EXISTS settings (
      key         TEXT PRIMARY KEY,
      value       TEXT NOT NULL,
      updated_at  TEXT DEFAULT (datetime('now','localtime'))
    );
  `);

  /* Seed default admin user */
  const adminExists = db.prepare("SELECT id FROM users WHERE username = 'admin'").get();
  if (!adminExists) {
    const hash = bcrypt.hashSync("aashiyana@123", 10);
    db.prepare(`INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)`)
      .run(uuidv4(), "admin", hash, "Administrator", "admin");
  }

  /* Seed default secretary */
  const secExists = db.prepare("SELECT id FROM users WHERE username = 'secretary'").get();
  if (!secExists) {
    const hash = bcrypt.hashSync("sec@123", 10);
    db.prepare(`INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)`)
      .run(uuidv4(), "secretary", hash, "Secretary", "editor");
  }

  /* Seed default settings */
  const defaults = {
    society_name:        "Aashiyana Homes",
    maintenance_amount:  "1500",
    penalty_per_month:   "100",
    address:             "",
    contact_email:       "",
  };
  const insertSetting = db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)"
  );
  for (const [k, v] of Object.entries(defaults)) {
    insertSetting.run(k, v);
  }

  /* Seed sample members */
  const memberCount = db.prepare("SELECT COUNT(*) AS cnt FROM members").get().cnt;
  if (memberCount === 0) {
    const sampleMembers = [
      ["A-101","Rajesh Sharma",  "9876543210","owner"],
      ["A-102","Priya Patel",    "9876543211","owner"],
      ["A-201","Sunil Verma",    "9876543212","tenant"],
      ["A-202","Meena Gupta",    "9876543213","owner"],
      ["A-301","Amit Kumar",     "9876543214","owner"],
      ["A-302","Sunita Singh",   "9876543215","tenant"],
      ["A-401","Vikram Joshi",   "9876543216","owner"],
      ["A-402","Neha Agarwal",   "9876543217","owner"],
    ];
    const ins = db.prepare(
      "INSERT INTO members (id, flat, name, phone, type) VALUES (?, ?, ?, ?, ?)"
    );
    for (const [flat, name, phone, type] of sampleMembers) {
      ins.run(uuidv4(), flat, name, phone, type);
    }
  }

  /* Seed sample staff */
  const staffCount = db.prepare("SELECT COUNT(*) AS cnt FROM staff").get().cnt;
  if (staffCount === 0) {
    db.prepare(
      "INSERT INTO staff (id, name, role, salary, phone, join_date) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(uuidv4(), "Ramesh Kumar", "Security Guard", 8000, "9876500001", "2024-01-01");
  }

  console.log("✅ Database initialised at:", DB_PATH);
}

initDB();
startApp();

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
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    httpOnly: true,
    sameSite: "lax",
  },
}));

/* Serve React frontend */
app.use(express.static(path.join(__dirname, "public")));

/* ══════════════════════════════════════════════════════
   HELPER FUNCTIONS
══════════════════════════════════════════════════════ */
function audit(action, req) {
  try {
    db.prepare(
      "INSERT INTO audit_logs (id, action, user_id, user_name, ip) VALUES (?, ?, ?, ?, ?)"
    ).run(uuidv4(), action, req.session?.user?.id || null, req.session?.user?.name || "Unknown", req.ip);
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

function getSettings() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  return rows.reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {});
}

/* ══════════════════════════════════════════════════════
   AUTH ROUTES
══════════════════════════════════════════════════════ */
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  req.session.user = { id: user.id, username: user.username, name: user.name, role: user.role };
  audit(`Logged in`, req);
  res.json({ user: req.session.user });
});

app.post("/api/auth/logout", (req, res) => {
  if (req.session.user) audit("Logged out", req);
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/auth/me", (req, res) => {
  res.json({ user: req.session?.user || null });
});

/* ══════════════════════════════════════════════════════
   MEMBERS
══════════════════════════════════════════════════════ */
app.get("/api/members", (req, res) => {
  const members = db.prepare("SELECT * FROM members ORDER BY flat ASC").all();
  res.json(members);
});

app.post("/api/members", requireAuth, (req, res) => {
  const { flat, name, phone, type, email } = req.body;
  if (!flat || !name) return res.status(400).json({ error: "Flat and name required" });
  const id = uuidv4();
  db.prepare(
    "INSERT INTO members (id, flat, name, phone, type, email) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, flat, name, phone || null, type || "owner", email || null);
  audit(`Added resident: ${flat} – ${name}`, req);
  res.json(db.prepare("SELECT * FROM members WHERE id = ?").get(id));
});

app.put("/api/members/:id", requireAuth, (req, res) => {
  const { flat, name, phone, type, email } = req.body;
  if (!flat || !name) return res.status(400).json({ error: "Flat and name required" });
  db.prepare(
    "UPDATE members SET flat=?, name=?, phone=?, type=?, email=?, updated_at=datetime('now','localtime') WHERE id=?"
  ).run(flat, name, phone || null, type || "owner", email || null, req.params.id);
  audit(`Updated resident: ${flat} – ${name}`, req);
  res.json(db.prepare("SELECT * FROM members WHERE id = ?").get(req.params.id));
});

app.delete("/api/members/:id", requireAdmin, (req, res) => {
  const m = db.prepare("SELECT flat, name FROM members WHERE id = ?").get(req.params.id);
  db.prepare("DELETE FROM members WHERE id = ?").run(req.params.id);
  if (m) audit(`Removed resident: ${m.flat} – ${m.name}`, req);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════
   FUND COLLECTIONS
══════════════════════════════════════════════════════ */
app.get("/api/collections", (req, res) => {
  let query = "SELECT * FROM collections";
  const params = [];
  const conds  = [];
  if (req.query.month !== undefined) { conds.push("month = ?"); params.push(Number(req.query.month)); }
  if (req.query.year  !== undefined) { conds.push("year = ?");  params.push(Number(req.query.year));  }
  if (conds.length) query += " WHERE " + conds.join(" AND ");
  query += " ORDER BY flat_no ASC";
  res.json(db.prepare(query).all(...params));
});

app.post("/api/collections", requireAuth, (req, res) => {
  const { member_id, flat_no, member_name, phone, month, year, amount, date, note } = req.body;
  if (!member_id || !amount) return res.status(400).json({ error: "Member and amount required" });

  /* Duplicate check */
  const exists = db.prepare(
    "SELECT id FROM collections WHERE member_id = ? AND month = ? AND year = ?"
  ).get(member_id, Number(month), Number(year));
  if (exists) return res.status(409).json({ error: "Payment already recorded for this month" });

  const id = uuidv4();
  db.prepare(`
    INSERT INTO collections (id, member_id, flat_no, member_name, phone, month, year, amount, date, note, by_id, by_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, member_id, flat_no, member_name, phone||null, Number(month), Number(year),
         Number(amount), date, note||null, req.session.user.id, req.session.user.name);

  audit(`Recorded payment: ${flat_no} – ₹${amount} for ${month+1}/${year}`, req);
  res.json(db.prepare("SELECT * FROM collections WHERE id = ?").get(id));
});

app.delete("/api/collections/:id", requireAuth, (req, res) => {
  const c = db.prepare("SELECT flat_no, month, year FROM collections WHERE id = ?").get(req.params.id);
  db.prepare("DELETE FROM collections WHERE id = ?").run(req.params.id);
  if (c) audit(`Deleted payment: ${c.flat_no} – ${c.month+1}/${c.year}`, req);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════
   EXPENSES
══════════════════════════════════════════════════════ */
app.get("/api/expenses", (req, res) => {
  let query = "SELECT * FROM expenses";
  const params = [];
  const conds  = [];
  if (req.query.year)     { conds.push("strftime('%Y', date) = ?"); params.push(String(req.query.year)); }
  if (req.query.month)    { conds.push("strftime('%m', date) = ?"); params.push(String(req.query.month).padStart(2,"0")); }
  if (req.query.category && req.query.category !== "All") { conds.push("category = ?"); params.push(req.query.category); }
  if (conds.length) query += " WHERE " + conds.join(" AND ");
  query += " ORDER BY date DESC";
  res.json(db.prepare(query).all(...params));
});

app.post("/api/expenses", requireAuth, (req, res) => {
  const { category, description, amount, date, note } = req.body;
  if (!description || !amount) return res.status(400).json({ error: "Description and amount required" });
  const id = uuidv4();
  db.prepare(`
    INSERT INTO expenses (id, category, description, amount, date, note, added_by, by_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, category||"Other", description, Number(amount), date, note||null,
         req.session.user.name, req.session.user.id);
  audit(`Added expense: ${description} – ₹${amount} (${category})`, req);
  res.json(db.prepare("SELECT * FROM expenses WHERE id = ?").get(id));
});

app.delete("/api/expenses/:id", requireAuth, (req, res) => {
  const e = db.prepare("SELECT description, amount FROM expenses WHERE id = ?").get(req.params.id);
  db.prepare("DELETE FROM expenses WHERE id = ?").run(req.params.id);
  if (e) audit(`Deleted expense: ${e.description} – ₹${e.amount}`, req);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════
   STAFF
══════════════════════════════════════════════════════ */
app.get("/api/staff", (req, res) => {
  res.json(db.prepare("SELECT * FROM staff ORDER BY name ASC").all());
});

app.post("/api/staff", requireAuth, (req, res) => {
  const { name, role, salary, phone, join_date } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const id = uuidv4();
  db.prepare(
    "INSERT INTO staff (id, name, role, salary, phone, join_date) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, name, role||"Other", Number(salary)||0, phone||null, join_date||null);
  audit(`Added staff: ${name} (${role})`, req);
  res.json(db.prepare("SELECT * FROM staff WHERE id = ?").get(id));
});

app.put("/api/staff/:id", requireAuth, (req, res) => {
  const { name, role, salary, phone, join_date } = req.body;
  db.prepare(
    "UPDATE staff SET name=?, role=?, salary=?, phone=?, join_date=?, updated_at=datetime('now','localtime') WHERE id=?"
  ).run(name, role||"Other", Number(salary)||0, phone||null, join_date||null, req.params.id);
  audit(`Updated staff: ${name}`, req);
  res.json(db.prepare("SELECT * FROM staff WHERE id = ?").get(req.params.id));
});

app.delete("/api/staff/:id", requireAdmin, (req, res) => {
  const s = db.prepare("SELECT name FROM staff WHERE id = ?").get(req.params.id);
  db.prepare("DELETE FROM staff WHERE id = ?").run(req.params.id);
  if (s) audit(`Removed staff: ${s.name}`, req);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════
   USERS (admin only)
══════════════════════════════════════════════════════ */
app.get("/api/users", requireAdmin, (req, res) => {
  const users = db.prepare("SELECT id, username, name, role, created_at FROM users ORDER BY created_at ASC").all();
  res.json(users);
});

app.post("/api/users", requireAdmin, (req, res) => {
  const { username, password, name, role } = req.body;
  if (!username || !password || !name) return res.status(400).json({ error: "All fields required" });
  const exists = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (exists) return res.status(409).json({ error: "Username already exists" });
  const id   = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    "INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)"
  ).run(id, username, hash, name, role||"editor");
  audit(`Created user account: ${name} (${role})`, req);
  res.json({ id, username, name, role });
});

app.put("/api/users/:id", requireAdmin, (req, res) => {
  const { name, role, password } = req.body;
  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare("UPDATE users SET name=?, role=?, password=? WHERE id=?").run(name, role, hash, req.params.id);
  } else {
    db.prepare("UPDATE users SET name=?, role=? WHERE id=?").run(name, role, req.params.id);
  }
  audit(`Updated user account: ${name}`, req);
  res.json(db.prepare("SELECT id, username, name, role FROM users WHERE id = ?").get(req.params.id));
});

app.delete("/api/users/:id", requireAdmin, (req, res) => {
  const admins = db.prepare("SELECT COUNT(*) AS cnt FROM users WHERE role='admin'").get();
  const user   = db.prepare("SELECT name, role FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.role === "admin" && admins.cnt <= 1) {
    return res.status(400).json({ error: "Cannot remove the last admin" });
  }
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  audit(`Removed user account: ${user.name}`, req);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════
   AUDIT LOGS
══════════════════════════════════════════════════════ */
app.get("/api/logs", requireAdmin, (req, res) => {
  const limit  = Math.min(Number(req.query.limit) || 100, 500);
  const search = req.query.search ? `%${req.query.search}%` : null;
  const logs = search
    ? db.prepare("SELECT * FROM audit_logs WHERE action LIKE ? OR user_name LIKE ? ORDER BY created_at DESC LIMIT ?").all(search, search, limit)
    : db.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?").all(limit);
  res.json(logs);
});

/* ══════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════ */
app.get("/api/settings", (req, res) => {
  res.json(getSettings());
});

app.put("/api/settings", requireAdmin, (req, res) => {
  const allowed = ["society_name","maintenance_amount","penalty_per_month","address","contact_email"];
  const upsert  = db.prepare(
    "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now','localtime')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at"
  );
  for (const key of allowed) {
    if (req.body[key] !== undefined) upsert.run(key, String(req.body[key]));
  }
  audit("Updated society settings", req);
  res.json(getSettings());
});

/* ══════════════════════════════════════════════════════
   DASHBOARD SUMMARY
══════════════════════════════════════════════════════ */
app.get("/api/dashboard", (req, res) => {
  const now    = new Date();
  const month  = now.getMonth();
  const year   = now.getFullYear();
  const mm     = String(now.getMonth()+1).padStart(2,"0");

  const totalMembers     = db.prepare("SELECT COUNT(*) AS c FROM members").get().c;
  const totalBalance     = db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM collections").get().s
                         - db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM expenses").get().s;
  const monthCollected   = db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM collections WHERE month=? AND year=?").get(month, year).s;
  const monthPaid        = db.prepare("SELECT COUNT(*) AS c FROM collections WHERE month=? AND year=?").get(month, year).c;
  const monthExpenses    = db.prepare(`SELECT COALESCE(SUM(amount),0) AS s FROM expenses WHERE strftime('%Y-%m', date)=?`).get(`${year}-${mm}`).s;
  const recentCollections= db.prepare("SELECT * FROM collections ORDER BY created_at DESC LIMIT 6").all();
  const recentExpenses   = db.prepare("SELECT * FROM expenses ORDER BY created_at DESC LIMIT 5").all();

  res.json({
    totalMembers,
    totalBalance,
    monthCollected,
    monthPaid,
    monthPending: totalMembers - monthPaid,
    monthExpenses,
    currentMonth: month,
    currentYear:  year,
    recentCollections,
    recentExpenses,
  });
});

/* ══════════════════════════════════════════════════════
   CATCH-ALL → Serve React App
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
