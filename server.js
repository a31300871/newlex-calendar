// server.js – New Lexington Community Calendar Backend
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const { getDb } = require('./db');

const app    = express();
const PORT   = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'newlex-calendar-jwt-secret-change-me';

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
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

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const db = await getDb();
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) return res.status(409).json({ error: 'That email is already registered.' });

    const hash = bcrypt.hashSync(password, 10);
    const result = await db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase(), hash]
    );
    const user  = { id: result.lastID, name: name.trim(), email: email.toLowerCase(), is_admin: 0 };
    const token = jwt.sign(user, SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const db = await getDb();
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email?.toLowerCase()]);
    if (!row || !bcrypt.compareSync(password || '', row.password_hash)) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    const user  = { id: row.id, name: row.name, email: row.email, is_admin: row.is_admin };
    const token = jwt.sign(user, SECRET, { expiresIn: '30d' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/events
app.get('/api/events', async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT e.id, e.cat, e.name, e.location, e.date, e.time, e.price, e.contact,
             e.added_by, e.created_at, u.name AS author_name
      FROM   events e
      JOIN   users  u ON u.id = e.added_by
      ORDER  BY e.date ASC, e.time ASC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/events
app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const { cat, name, location, date, time, price, contact } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) {
      return res.status(400).json({ error: 'Event name, location, and date are required.' });
    }
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO events (cat, name, location, date, time, price, contact, added_by) VALUES (?,?,?,?,?,?,?,?)',
      [cat || 'other', name.trim(), location.trim(), date,
       time?.trim() || 'TBD', price?.trim() || 'Free', contact?.trim() || '-', req.user.id]
    );
    const event = await db.get(
      'SELECT e.*, u.name AS author_name FROM events e JOIN users u ON u.id = e.added_by WHERE e.id = ?',
      [result.lastID]
    );
    res.status(201).json(event);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/events/:id
app.delete('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const event = await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    if (event.added_by !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'You can only remove your own events.' });
    }
    await db.run('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true, id: Number(req.params.id) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize DB then start server
getDb().then(() => {
  app.listen(PORT, () => {
    console.log('New Lexington Community Calendar running on port ' + PORT);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
