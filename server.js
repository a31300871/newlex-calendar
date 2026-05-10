// server.js – New Lexington Community Calendar Backend
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const db       = require('./db');

const app    = express();
const PORT   = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'newlex-calendar-jwt-secret-change-me';

// ──────────────────────────────────────────────
//  MIDDLEWARE
// ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth guard – attach req.user when a valid Bearer token is present
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

// ──────────────────────────────────────────────
//  AUTH ROUTES
// ──────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'That email is already registered.' });

  const hash   = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  ).run(name.trim(), email.toLowerCase(), hash);

  const user  = { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase(), is_admin: 0 };
  const token = jwt.sign(user, SECRET, { expiresIn: '30d' });

  res.status(201).json({ token, user });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email?.toLowerCase());
  if (!row || !bcrypt.compareSync(password ?? '', row.password_hash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  const user  = { id: row.id, name: row.name, email: row.email, is_admin: row.is_admin };
  const token = jwt.sign(user, SECRET, { expiresIn: '30d' });

  res.json({ token, user });
});

// ──────────────────────────────────────────────
//  EVENT ROUTES
// ──────────────────────────────────────────────

// GET /api/events  (public)
app.get('/api/events', (req, res) => {
  const rows = db.prepare(`
    SELECT e.id, e.cat, e.name, e.location, e.date, e.time, e.price, e.contact,
           e.added_by, e.created_at, u.name AS author_name
    FROM   events e
    JOIN   users  u ON u.id = e.added_by
    ORDER  BY e.date ASC, e.time ASC
  `).all();
  res.json(rows);
});

// POST /api/events  (auth required)
app.post('/api/events', requireAuth, (req, res) => {
  const { cat, name, location, date, time, price, contact } = req.body ?? {};

  if (!name?.trim() || !location?.trim() || !date) {
    return res.status(400).json({ error: 'Event name, location, and date are required.' });
  }

  const result = db.prepare(`
    INSERT INTO events (cat, name, location, date, time, price, contact, added_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    cat || 'other',
    name.trim(),
    location.trim(),
    date,
    time?.trim() || 'TBD',
    price?.trim() || 'Free',
    contact?.trim() || '—',
    req.user.id,
  );

  const event = db.prepare(`
    SELECT e.*, u.name AS author_name
    FROM events e JOIN users u ON u.id = e.added_by
    WHERE e.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(event);
});

// DELETE /api/events/:id  (auth required – owner or admin)
app.delete('/api/events/:id', requireAuth, (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);

  if (!event) return res.status(404).json({ error: 'Event not found.' });

  if (event.added_by !== req.user.id && !req.user.is_admin) {
    return res.status(403).json({ error: 'You can only remove your own events.' });
  }

  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true, id: Number(req.params.id) });
});

// ──────────────────────────────────────────────
//  SPA FALLBACK (serve index.html for all other routes)
// ──────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ──────────────────────────────────────────────
//  START
// ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🗓️  New Lexington Community Calendar`);
  console.log(`   Running at → http://localhost:${PORT}\n`);
});
