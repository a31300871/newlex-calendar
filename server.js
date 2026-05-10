require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const path    = require('path');
const { getDb } = require('./db');

const app    = express();
const PORT   = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'newlex-calendar-jwt-secret-change-me';

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try { req.user = jwt.verify(header.split(' ')[1], SECRET); next(); }
  catch { res.status(401).json({ error: 'Session expired. Please sign in again.' }); }
}
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required.' });
    next();
  });
}

// ── AUTH ──
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, address } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (!address?.trim()) return res.status(400).json({ error: 'Address is required.' });
    const db = await getDb();
    if (await db.get('SELECT id FROM users WHERE email=?', [email.toLowerCase()])) return res.status(409).json({ error: 'That email is already registered.' });
    const hash = bcrypt.hashSync(password, 10);
    const result = await db.run('INSERT INTO users (name,email,password_hash,address) VALUES (?,?,?,?)', [name.trim(), email.toLowerCase(), hash, address.trim()]);
    const user = { id: result.lastID, name: name.trim(), email: email.toLowerCase(), is_admin: 0 };
    res.status(201).json({ token: jwt.sign(user, SECRET, { expiresIn: '30d' }), user });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const db = await getDb();
    const row = await db.get('SELECT * FROM users WHERE email=?', [email?.toLowerCase()]);
    if (!row || !bcrypt.compareSync(password || '', row.password_hash)) return res.status(401).json({ error: 'Incorrect email or password.' });
    const user = { id: row.id, name: row.name, email: row.email, is_admin: row.is_admin };
    res.json({ token: jwt.sign(user, SECRET, { expiresIn: '30d' }), user });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── EVENTS ──
app.get('/api/events', async (req, res) => {
  try {
    const db = await getDb();
    res.json(await db.all('SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by ORDER BY e.date ASC,e.time ASC'));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const { cat, name, location, date, time, price, contact } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Name, location, and date are required.' });
    const db = await getDb();
    const result = await db.run('INSERT INTO events (cat,name,location,date,time,price,contact,added_by) VALUES (?,?,?,?,?,?,?,?)',
      [cat||'other', name.trim(), location.trim(), date, time?.trim()||'TBD', price?.trim()||'Free', contact?.trim()||'-', req.user.id]);
    res.status(201).json(await db.get('SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE e.id=?', [result.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Bulk import
app.post('/api/events/bulk', requireAuth, async (req, res) => {
  try {
    const { events } = req.body || {};
    if (!Array.isArray(events) || events.length === 0) return res.status(400).json({ error: 'No events provided.' });
    if (events.length > 200) return res.status(400).json({ error: 'Maximum 200 events per import.' });
    const db = await getDb();
    let imported = 0;
    for (const ev of events) {
      if (!ev.name?.trim() || !ev.location?.trim() || !ev.date) continue;
      await db.run('INSERT INTO events (cat,name,location,date,time,price,contact,added_by) VALUES (?,?,?,?,?,?,?,?)',
        [ev.cat||'other', ev.name.trim(), ev.location.trim(), ev.date, ev.time||'TBD', ev.price||'Free', ev.contact||'-', req.user.id]);
      imported++;
    }
    res.json({ success: true, imported });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const ev = await db.get('SELECT * FROM events WHERE id=?', [req.params.id]);
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.added_by !== req.user.id && !req.user.is_admin) return res.status(403).json({ error: 'You can only edit your own events.' });
    const { cat, name, location, date, time, price, contact } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Name, location, and date are required.' });
    await db.run('UPDATE events SET cat=?,name=?,location=?,date=?,time=?,price=?,contact=? WHERE id=?',
      [cat||'other', name.trim(), location.trim(), date, time?.trim()||'TBD', price?.trim()||'Free', contact?.trim()||'-', req.params.id]);
    res.json(await db.get('SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE e.id=?', [req.params.id]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const ev = await db.get('SELECT * FROM events WHERE id=?', [req.params.id]);
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.added_by !== req.user.id && !req.user.is_admin) return res.status(403).json({ error: 'You can only remove your own events.' });
    await db.run('DELETE FROM events WHERE id=?', [req.params.id]);
    res.json({ success: true, id: Number(req.params.id) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── SPONSORS ──
app.get('/api/sponsors', async (req, res) => {
  try { const db = await getDb(); res.json(await db.all('SELECT * FROM sponsors ORDER BY id ASC')); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/sponsors', requireAdmin, async (req, res) => {
  try {
    const { name, tagline, url } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    const result = await db.run('INSERT INTO sponsors (name,tagline,url) VALUES (?,?,?)', [name.trim(), tagline?.trim()||'', url?.trim()||'']);
    res.status(201).json(await db.get('SELECT * FROM sponsors WHERE id=?', [result.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/sponsors/:id', requireAdmin, async (req, res) => {
  try {
    const { name, tagline, url } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    await db.run('UPDATE sponsors SET name=?,tagline=?,url=? WHERE id=?', [name.trim(), tagline?.trim()||'', url?.trim()||'', req.params.id]);
    res.json(await db.get('SELECT * FROM sponsors WHERE id=?', [req.params.id]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/sponsors/:id', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM sponsors WHERE id=?', [req.params.id]);
    res.json({ success: true, id: Number(req.params.id) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

getDb().then(() => {
  app.listen(PORT, () => console.log('New Lexington Community Calendar on port ' + PORT));
}).catch(err => { console.error('DB init failed:', err); process.exit(1); });
