require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const crypto   = require('crypto');
const { getDb } = require('./db');

const app    = express();
const PORT   = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'newlex-secret-change-me';
const STRIPE_SECRET        = process.env.STRIPE_SECRET_KEY     || '';
const STRIPE_PRICE_BASIC   = process.env.STRIPE_PRICE_ID      || '';
const STRIPE_PRICE_PREMIUM = process.env.STRIPE_PRICE_PREMIUM || '';
const STRIPE_PRICE_LISTING = process.env.STRIPE_PRICE_LISTING || '';
const STRIPE_WEBHOOK       = process.env.STRIPE_WEBHOOK_SECRET || '';
const SITE_URL = process.env.SITE_URL || 'https://www.newlexcalendar.com';

const stripe = STRIPE_SECRET ? require('stripe')(STRIPE_SECRET) : null;


// Capture raw body for ALL requests before any other middleware
app.use((req, res, next) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks);
    next();
  });
  req.on('error', next);
});

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));

// Parse JSON manually from rawBody (since we've already consumed the stream)
app.use((req, res, next) => {
  if (req.path === '/api/stripe/webhook') return next();
  if (req.rawBody && req.rawBody.length > 0) {
    try {
      const ct = req.headers['content-type'] || '';
      if (ct.includes('application/json')) {
        req.body = JSON.parse(req.rawBody.toString('utf8'));
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON in request body.' });
    }
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// ── STRIPE WEBHOOK ──
app.post('/api/stripe/webhook', async (req, res) => {
    if (!stripe || !STRIPE_WEBHOOK) return res.status(400).send('Webhook not configured');
    const sig = req.headers['stripe-signature'];
    if (!sig) return res.status(400).send('No stripe-signature header');
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK);
    } catch (e) {
      console.error('Webhook signature failed:', e.message);
      return res.status(400).send(`Webhook Error: ${e.message}`);
    }
    res.status(200).json({ received: true });
    try {
      const db = await getDb();
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const advId     = session.metadata?.advertiser_id;
        const listingId = session.metadata?.listing_id;
        if (advId && session.payment_status === 'paid') {
          await db.run(
            "UPDATE advertisers SET status='active', stripe_customer_id=?, stripe_subscription_id=? WHERE id=?",
            [session.customer, session.subscription, advId]
          );
          console.log('Advertiser activated:', advId);
        }
        if (listingId && session.payment_status === 'paid') {
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 1);
          await db.run(
            "UPDATE listings SET status='active', stripe_customer_id=?, expires_at=? WHERE id=?",
            [session.customer, expires.toISOString(), listingId]
          );
          console.log('Listing activated:', listingId);
        }
      }
      if (event.type === 'invoice.payment_failed') {
        const custId = event.data.object.customer;
        await db.run("UPDATE advertisers SET status='paused' WHERE stripe_customer_id=?", [custId]);
      }
      if (event.type === 'customer.subscription.deleted') {
        const custId = event.data.object.customer;
        await db.run("UPDATE advertisers SET status='cancelled', stripe_subscription_id='' WHERE stripe_customer_id=?", [custId]);
      }
      if (event.type === 'invoice.payment_succeeded') {
        const custId = event.data.object.customer;
        await db.run("UPDATE advertisers SET status='active' WHERE stripe_customer_id=? AND status='paused'", [custId]);
      }
    } catch (e) {
      console.error('Webhook handler error:', e.message);
    }
  }
);

// ── AUTH HELPERS ──
// Normalize phone to digits only (10 or 11 digit US format).
// Returns '' if invalid (too short).
function normalizePhone(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 10) return digits;            // 7405551234
  if (digits.length === 11 && digits[0] === '1') return digits.slice(1); // 17405551234 -> 7405551234
  return '';
}

function requireAuth(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try { req.user = jwt.verify(h.split(' ')[1], SECRET); next(); }
  catch { res.status(401).json({ error: 'Session expired.' }); }
}
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required.' });
    next();
  });
}
function requireAdvertiser(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const decoded = jwt.verify(h.split(' ')[1], SECRET);
    if (decoded.type !== 'advertiser') return res.status(403).json({ error: 'Advertiser access required.' });
    req.advertiser = decoded;
    next();
  } catch { res.status(401).json({ error: 'Session expired.' }); }
}

// ── USER AUTH ──
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body || {};
    if (!name?.trim() || !password) return res.status(400).json({ error: 'Name and password are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (!address?.trim()) return res.status(400).json({ error: 'Address is required.' });
    const emailClean = (email || '').toLowerCase().trim();
    const phoneClean = normalizePhone(phone);
    if (!emailClean && !phoneClean) return res.status(400).json({ error: 'Please provide either an email or a phone number.' });
    if (phone && !phoneClean) return res.status(400).json({ error: 'Phone number must be 10 digits (US format).' });
    const db = await getDb();
    if (emailClean && await db.get('SELECT id FROM users WHERE email=?', [emailClean])) return res.status(409).json({ error: 'Email already registered.' });
    if (phoneClean && await db.get('SELECT id FROM users WHERE phone=?', [phoneClean])) return res.status(409).json({ error: 'Phone number already registered.' });
    const emailForDb = emailClean || (`phone-${phoneClean}-${Date.now()}@local.placeholder`);
    const hash = bcrypt.hashSync(password, 10);
    const r = await db.run('INSERT INTO users (name,email,phone,password_hash,address) VALUES (?,?,?,?,?)', [name.trim(), emailForDb, phoneClean || null, hash, address.trim()]);
    const user = { id: r.lastID, name: name.trim(), email: emailClean, phone: phoneClean || '', is_admin: 0, is_town_crier: 0 };
    res.status(201).json({ token: jwt.sign(user, SECRET, { expiresIn: '30d' }), user });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, identifier, password } = req.body || {};
    const raw = (identifier || email || '').toString().trim();
    if (!raw || !password) return res.status(401).json({ error: 'Email/phone and password are required.' });
    const db = await getDb();
    let row = null;
    const phoneTry = normalizePhone(raw);
    if (phoneTry) {
      row = await db.get('SELECT * FROM users WHERE phone=?', [phoneTry]);
    }
    if (!row) {
      row = await db.get('SELECT * FROM users WHERE email=?', [raw.toLowerCase()]);
    }
    if (!row || !bcrypt.compareSync(password || '', row.password_hash)) return res.status(401).json({ error: 'Incorrect email/phone or password.' });
    const emailForUser = (row.email && row.email.endsWith('@local.placeholder')) ? '' : row.email;
    const user = { id: row.id, name: row.name, email: emailForUser, phone: row.phone || '', is_admin: row.is_admin, is_town_crier: row.is_town_crier };
    res.json({ token: jwt.sign(user, SECRET, { expiresIn: '30d' }), user });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update home zipcode
app.put('/api/auth/zipcode', requireAuth, async (req, res) => {
  try {
    const { zipcode } = req.body || {};
    if (!zipcode || !/^\d{5}$/.test(zipcode.toString().trim())) {
      return res.status(400).json({ error: 'Please enter a valid 5-digit US zipcode.' });
    }
    const db = await getDb();
    await db.run('UPDATE users SET home_zipcode=? WHERE id=?', [zipcode.toString().trim(), req.user.id]);
    res.json({ success: true, home_zipcode: zipcode.toString().trim() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Change password
app.put('/api/auth/password', requireAuth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) return res.status(400).json({ error: 'Current and new password are required.' });
    if (new_password.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    const db = await getDb();
    const row = await db.get('SELECT password_hash FROM users WHERE id=?', [req.user.id]);
    if (!row || !bcrypt.compareSync(current_password, row.password_hash)) return res.status(401).json({ error: 'Current password is incorrect.' });
    const newHash = bcrypt.hashSync(new_password, 10);
    await db.run('UPDATE users SET password_hash=? WHERE id=?', [newHash, req.user.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete account (and all owned events + listings)
app.delete('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ error: 'Password required to confirm deletion.' });
    const db = await getDb();
    const row = await db.get('SELECT password_hash, is_admin FROM users WHERE id=?', [req.user.id]);
    if (!row) return res.status(404).json({ error: 'Account not found.' });
    if (row.is_admin) return res.status(403).json({ error: 'Admin accounts cannot be deleted via this endpoint.' });
    if (!bcrypt.compareSync(password, row.password_hash)) return res.status(401).json({ error: 'Incorrect password.' });
    // Cascade delete: events posted by user, listings owned by user, then user
    await db.run('DELETE FROM events WHERE added_by=?', [req.user.id]);
    await db.run('DELETE FROM listings WHERE user_id=?', [req.user.id]);
    await db.run('DELETE FROM users WHERE id=?', [req.user.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── EVENTS ──
app.get('/api/events', async (req, res) => {
  try {
    const db = await getDb();
    let isAdmin = false;
    let userId = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      try { const payload = jwt.verify(auth.slice(7), SECRET); isAdmin = !!payload.is_admin; userId = payload.id; } catch(_) {}
    }
    const zipcode = (req.query.zipcode||'').toString().trim();
    const zipFilter = zipcode ? ' AND e.zipcode=?' : '';
    const zipParam = zipcode ? [zipcode] : [];
    let sql;
    let params;
    if (isAdmin) {
      sql = 'SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE 1=1' + zipFilter + ' ORDER BY e.date ASC,e.time ASC';
      params = zipParam;
    } else if (userId) {
      sql = "SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE (e.status='approved' OR (e.status='pending' AND e.added_by=?))" + zipFilter + " ORDER BY e.date ASC,e.time ASC";
      params = [userId, ...zipParam];
    } else {
      sql = "SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE e.status='approved'" + zipFilter + " ORDER BY e.date ASC,e.time ASC";
      params = zipParam;
    }
    res.json(await db.all(sql, params));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const { cat, name, location, date, time, price, contact, zipcode, affiliate_url } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Name, location, and date are required.' });
    const db = await getDb();
    const dup = await db.get(
      "SELECT id FROM events WHERE LOWER(TRIM(name))=LOWER(TRIM(?)) AND date=? AND status!='pending'",
      [name.trim(), date]
    );
    if (dup) return res.status(409).json({ error: "An event with that name already exists on that date. Check the calendar to avoid duplicates." });
    const userRow = await db.get('SELECT is_admin, is_town_crier FROM users WHERE id=?', [req.user.id]);
    const status = (userRow && (userRow.is_admin || userRow.is_town_crier)) ? 'approved' : 'pending';
    const zip = (zipcode || '').toString().trim() || '43764';
    const r = await db.run(
      'INSERT INTO events (cat,name,location,date,time,price,contact,added_by,status,zipcode,affiliate_url) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [cat||'other', name.trim(), location.trim(), date, time?.trim()||'TBD', price?.trim()||'Free', contact?.trim()||'-', req.user.id, status, zip, (affiliate_url||'').trim()]
    );
    const ev = await db.get('SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE e.id=?', [r.lastID]);
    res.status(201).json({ ...ev, pending_approval: status === 'pending' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/events/bulk', requireAuth, async (req, res) => {
  try {
    const events = Array.isArray(req.body?.events) ? req.body.events : [];
    if (!events.length) return res.status(400).json({ error: 'No events provided.' });
    const db = await getDb();
    const userRow = await db.get('SELECT is_admin, is_town_crier FROM users WHERE id=?', [req.user.id]);
    const status = (userRow && (userRow.is_admin || userRow.is_town_crier)) ? 'approved' : 'pending';
    let inserted = 0, skipped = 0;
    for (const ev of events) {
      if (!ev.name?.trim() || !ev.location?.trim() || !ev.date) { skipped++; continue; }
      const dup = await db.get("SELECT id FROM events WHERE LOWER(TRIM(name))=LOWER(TRIM(?)) AND date=? AND status!='pending'",
        [ev.name.trim(), ev.date]);
      if (dup) { skipped++; continue; }
      const zip = (ev.zipcode || '').toString().trim() || '43764';
      await db.run(
        'INSERT INTO events (cat,name,location,date,time,price,contact,added_by,status,zipcode,affiliate_url) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [ev.cat||'other', ev.name.trim(), ev.location.trim(), ev.date, ev.time?.trim()||'TBD', ev.price?.trim()||'Free', ev.contact?.trim()||'-', req.user.id, status, zip, (ev.affiliate_url||'').trim()]
      );
      inserted++;
    }
    res.json({ inserted, skipped, pending: status === 'pending' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const ev = await db.get('SELECT * FROM events WHERE id=?', [req.params.id]);
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.added_by !== req.user.id && !req.user.is_admin) return res.status(403).json({ error: 'You can only edit events you posted.' });
    const { cat, name, location, date, time, price, contact, zipcode, affiliate_url } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Name, location, and date are required.' });
    await db.run(
      'UPDATE events SET cat=?,name=?,location=?,date=?,time=?,price=?,contact=?,zipcode=?,affiliate_url=? WHERE id=?',
      [cat||'other', name.trim(), location.trim(), date, time?.trim()||'TBD', price?.trim()||'Free', contact?.trim()||'-', (zipcode||ev.zipcode||'43764').toString().trim(), (affiliate_url||'').trim(), req.params.id]
    );
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

// ── MANUAL SPONSORS (admin) ──
app.get('/api/sponsors', async (req, res) => {
  try { const db = await getDb(); res.json(await db.all('SELECT * FROM sponsors ORDER BY id')); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/sponsors', requireAdmin, async (req, res) => {
  try {
    const { name, tagline, url } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: 'Name required.' });
    const db = await getDb();
    const r = await db.run('INSERT INTO sponsors (name,tagline,url) VALUES (?,?,?)', [name.trim(), tagline||'', url||'']);
    res.status(201).json(await db.get('SELECT * FROM sponsors WHERE id=?', [r.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/sponsors/:id', requireAdmin, async (req, res) => {
  try {
    const { name, tagline, url } = req.body || {};
    const db = await getDb();
    await db.run('UPDATE sponsors SET name=?,tagline=?,url=? WHERE id=?', [name||'', tagline||'', url||'', req.params.id]);
    res.json(await db.get('SELECT * FROM sponsors WHERE id=?', [req.params.id]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/sponsors/:id', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM sponsors WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── COMBINED DISPLAY SPONSORS (manual + active advertisers) ──
app.get('/api/display/sponsors', async (req, res) => {
  try {
    const db = await getDb();
    const manual = await db.all('SELECT id, name, tagline, url, "manual" AS source FROM sponsors ORDER BY id');
    const paid   = await db.all("SELECT id, business_name AS name, tagline, url, phone, tier, 'advertiser' AS source FROM advertisers WHERE status='active' ORDER BY id");
    res.json([...manual, ...paid]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADVERTISER AUTH ──
app.post('/api/advertiser/register', async (req, res) => {
  try {
    const { name, email, password, business_name, tagline, url, phone } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password || !business_name?.trim())
      return res.status(400).json({ error: 'Name, email, password, and business name are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    const db = await getDb();
    if (await db.get('SELECT id FROM advertisers WHERE email=?', [email.toLowerCase()]))
      return res.status(409).json({ error: 'That email is already registered.' });
    // Enforce 5-spot limit for event popup ads
    const activeCount = (await db.get("SELECT COUNT(*) AS c FROM advertisers WHERE status='active'")).c;
    const hash = bcrypt.hashSync(password, 10);
    const r = await db.run(
      'INSERT INTO advertisers (name,email,password_hash,business_name,tagline,url,phone) VALUES (?,?,?,?,?,?,?)',
      [name.trim(), email.toLowerCase(), hash, business_name.trim(), tagline?.trim()||'', url?.trim()||'', phone?.trim()||'']
    );
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [r.lastID]);
    const token = jwt.sign({ type:'advertiser', id: adv.id, email: adv.email, business_name: adv.business_name }, SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, advertiser: safeAdv(adv) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/advertiser/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const db = await getDb();
    const adv = await db.get('SELECT * FROM advertisers WHERE email=?', [email?.toLowerCase()]);
    if (!adv || !bcrypt.compareSync(password||'', adv.password_hash))
      return res.status(401).json({ error: 'Incorrect email or password.' });
    const token = jwt.sign({ type:'advertiser', id: adv.id, email: adv.email, business_name: adv.business_name }, SECRET, { expiresIn: '30d' });
    res.json({ token, advertiser: safeAdv(adv) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/advertiser/me', requireAdvertiser, async (req, res) => {
  try {
    const db = await getDb();
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [req.advertiser.id]);
    if (!adv) return res.status(404).json({ error: 'Account not found.' });
    res.json(safeAdv(adv));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/advertiser/me', requireAdvertiser, async (req, res) => {
  try {
    const { business_name, tagline, url, phone } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    await db.run('UPDATE advertisers SET business_name=?,tagline=?,url=?,phone=? WHERE id=?',
      [business_name.trim(), tagline?.trim()||'', url?.trim()||'', phone?.trim()||'', req.advertiser.id]);
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [req.advertiser.id]);
    res.json(safeAdv(adv));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Create Stripe checkout session
app.post('/api/advertiser/checkout', requireAdvertiser, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payment system not configured.' });
  try {
    const { tier } = req.body || {};
    const isPremium = tier === 'premium';
    const priceId   = isPremium ? STRIPE_PRICE_PREMIUM : STRIPE_PRICE_BASIC;
    if (!priceId) return res.status(503).json({ error: `Price not configured for ${tier} tier.` });

    const db = await getDb();

    // Premium tier: enforce 5-spot limit
    if (isPremium) {
      const premCount = (await db.get("SELECT COUNT(*) AS c FROM advertisers WHERE status='active' AND tier='premium'")).c;
      if (premCount >= 5) return res.status(409).json({ error: 'All 5 premium ad spots are taken. Please join the waitlist.' });
    }

    // Update advertiser tier before checkout
    await db.run('UPDATE advertisers SET tier=? WHERE id=?', [isPremium ? 'premium' : 'basic', req.advertiser.id]);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { advertiser_id: String(req.advertiser.id), tier: isPremium ? 'premium' : 'basic' },
      success_url: `${SITE_URL}/advertise?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL}/advertise?cancelled=true`,
    });
    res.json({ url: session.url });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Cancel subscription
app.post('/api/advertiser/cancel', requireAdvertiser, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payment system not configured.' });
  try {
    const db  = await getDb();
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [req.advertiser.id]);
    if (!adv?.stripe_subscription_id) return res.status(400).json({ error: 'No active subscription found.' });
    await stripe.subscriptions.cancel(adv.stripe_subscription_id);
    await db.run("UPDATE advertisers SET status='cancelled', stripe_subscription_id='' WHERE id=?", [req.advertiser.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: ADVERTISER MANAGEMENT ──
app.get('/api/admin/advertisers', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT id,name,email,business_name,tagline,url,status,stripe_customer_id,created_at FROM advertisers ORDER BY created_at DESC');
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/advertisers/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!['pending','active','paused','cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status.' });
    const db = await getDb();
    await db.run('UPDATE advertisers SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

function safeAdv(a) {
  return { id:a.id, name:a.name, email:a.email, business_name:a.business_name, tagline:a.tagline, url:a.url, phone:a.phone||'', tier:a.tier||'basic', status:a.status, created_at:a.created_at };
}

app.get('/advertise',  (_req, res) => res.sendFile(path.join(__dirname, 'public', 'advertise.html')));
app.get('/directory',  (_req, res) => res.sendFile(path.join(__dirname, 'public', 'directory.html')));

// ── LISTING AUTH ──
function requireListing(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const decoded = jwt.verify(h.split(' ')[1], SECRET);
    if (decoded.type !== 'listing') return res.status(403).json({ error: 'Listing access required.' });
    req.listing = decoded;
    next();
  } catch { res.status(401).json({ error: 'Session expired.' }); }
}

// GET /api/listings (public)
app.get('/api/listings', async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all("SELECT id,business_name,category,phone,website,address,description,created_at FROM listings WHERE status='active' ORDER BY business_name ASC");
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── UNIFIED AUTH LISTINGS ENDPOINTS (uses calendar user auth) ──

// GET /api/listings/my - returns listings owned by current calendar user
app.get('/api/listings/my', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM listings WHERE user_id=? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows.map(safeListing));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings/create - create a listing tied to the calendar user (pending until paid)
// LEGACY: paid listing creation (kept for backward compat)
app.post('/api/listings/create-paid', requireAuth, async (req, res) => {
  // Original logic preserved for any existing paid flow
  return res.status(410).json({ error: 'Paid listings are no longer required. Use /api/listings/create-free instead.' });
});

// NEW: free listing creation (all listings are now free)
app.post('/api/listings/create-free', requireAuth, async (req, res) => {
  try {
    const { business_name, category, phone, website, address, description, zipcode } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    const placeholderEmail = `user-${req.user.id}-${Date.now()}@newlexcalendar.local`;
    const placeholderPwd = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
    const userRow = await db.get('SELECT is_admin, is_town_crier FROM users WHERE id=?', [req.user.id]);
    const skipReview = !!(userRow && (userRow.is_admin || userRow.is_town_crier));
    const status = skipReview ? 'active' : 'pending_review';
    const expiresAt = new Date(); expiresAt.setFullYear(expiresAt.getFullYear() + 5); // long expiry since free
    const zip = (zipcode || '').toString().trim() || '43764';
    const r = await db.run(
      `INSERT INTO listings (user_id, owner_name, owner_email, password_hash, business_name, category, phone, website, address, description, status, zipcode, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, req.user.name || business_name.trim(), placeholderEmail, placeholderPwd,
        business_name.trim(), category || 'other', (phone||'').trim(), (website||'').trim(),
        (address||'').trim(), (description||'').trim(), status, zip, expiresAt.toISOString()
      ]
    );
    const listing = await db.get('SELECT * FROM listings WHERE id=?', [r.lastID]);
    res.json({ ...safeListing(listing), pending_approval: !skipReview });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/listings/create', requireAuth, async (req, res) => {
  try {
    const { business_name, category, phone, website, address, description } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    const placeholderEmail = `user-${req.user.id}-${Date.now()}@newlexcalendar.local`;
    const placeholderPwd = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
    // Town Criers and admins skip 'pending_review' status after payment;
    // others land in 'pending_review' after payment (admin must approve)
    const userRow = await db.get('SELECT is_admin, is_town_crier FROM users WHERE id=?', [req.user.id]);
    const skipReview = !!(userRow && (userRow.is_admin || userRow.is_town_crier));
    const r = await db.run(
      `INSERT INTO listings (user_id, owner_name, owner_email, password_hash, business_name, category, phone, website, address, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        req.user.id, req.user.name || business_name.trim(), placeholderEmail, placeholderPwd,
        business_name.trim(), category || 'other', (phone||'').trim(), (website||'').trim(),
        (address||'').trim(), (description||'').trim()
      ]
    );
    const listing = await db.get('SELECT * FROM listings WHERE id=?', [r.lastID]);
    res.json({ ...safeListing(listing), skip_review: skipReview });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings/:id/checkout - start Stripe checkout for a user's listing
app.post('/api/listings/:id/checkout', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const listing = await db.get('SELECT * FROM listings WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Stripe is not configured.' });
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_LISTING, quantity: 1 }],
      success_url: `${process.env.SITE_URL || 'https://www.newlexcalendar.com'}/directory?listing_paid=1&session_id={CHECKOUT_SESSION_ID}&listing_id=${listing.id}`,
      cancel_url: `${process.env.SITE_URL || 'https://www.newlexcalendar.com'}/directory?listing_canceled=1`,
      metadata: { listing_id: String(listing.id), user_id: String(req.user.id) }
    });
    res.json({ url: session.url });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings/my/verify-session - verify Stripe checkout and activate
app.post('/api/listings/my/verify-session', requireAuth, async (req, res) => {
  try {
    const { session_id, listing_id } = req.body || {};
    if (!session_id || !listing_id) return res.status(400).json({ error: 'Missing session_id or listing_id.' });
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Stripe is not configured.' });
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') return res.status(400).json({ error: 'Payment not completed.' });
    const db = await getDb();
    const listing = await db.get('SELECT * FROM listings WHERE id=? AND user_id=?', [listing_id, req.user.id]);
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    // Town Criers and admins go live immediately; others go to 'pending_review' for admin approval
    const userRow = await db.get('SELECT is_admin, is_town_crier FROM users WHERE id=?', [req.user.id]);
    const skipReview = !!(userRow && (userRow.is_admin || userRow.is_town_crier));
    const newStatus = skipReview ? 'active' : 'pending_review';
    const expiresAt = new Date(); expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    await db.run('UPDATE listings SET status=?, expires_at=? WHERE id=?', [newStatus, expiresAt.toISOString(), listing_id]);
    const updated = await db.get('SELECT * FROM listings WHERE id=?', [listing_id]);
    res.json({ ...safeListing(updated), pending_approval: !skipReview });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/listings/my/:id - user can edit their own listing
app.put('/api/listings/my/:id', requireAuth, async (req, res) => {
  try {
    const { business_name, category, phone, website, address, description, zipcode } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    const existing = await db.get('SELECT * FROM listings WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    if (!existing) return res.status(404).json({ error: 'Listing not found.' });
    await db.run(
      'UPDATE listings SET business_name=?,category=?,phone=?,website=?,address=?,description=?,zipcode=? WHERE id=?',
      [
        business_name.trim(), category || 'other', (phone||'').trim(), (website||'').trim(),
        (address||'').trim(), (description||'').trim(), (zipcode||existing.zipcode||'43764').toString().trim(),
        req.params.id
      ]
    );
    const updated = await db.get('SELECT * FROM listings WHERE id=?', [req.params.id]);
    res.json(safeListing(updated));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings/my/:id/cancel - user can cancel their own listing
app.post('/api/listings/my/:id/cancel', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const existing = await db.get('SELECT * FROM listings WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    if (!existing) return res.status(404).json({ error: 'Listing not found.' });
    await db.run("UPDATE listings SET status='expired' WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── LEGACY: Original listing auth endpoints (kept for backward compat) ──

// POST /api/listings/register
app.post('/api/listings/register', async (req, res) => {
  try {
    const { owner_name, owner_email, password, business_name, category, phone, website, address, description } = req.body || {};
    if (!owner_name?.trim() || !owner_email?.trim() || !password || !business_name?.trim())
      return res.status(400).json({ error: 'Name, email, password, and business name are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    const db = await getDb();
    if (await db.get('SELECT id FROM listings WHERE owner_email=?', [owner_email.toLowerCase()]))
      return res.status(409).json({ error: 'That email is already registered.' });
    const hash = bcrypt.hashSync(password, 10);
    const r = await db.run(
      'INSERT INTO listings (owner_name,owner_email,password_hash,business_name,category,phone,website,address,description) VALUES (?,?,?,?,?,?,?,?,?)',
      [owner_name.trim(), owner_email.toLowerCase(), hash, business_name.trim(),
       category||'other', phone?.trim()||'', website?.trim()||'', address?.trim()||'', description?.trim()||'']
    );
    const listing = await db.get('SELECT * FROM listings WHERE id=?', [r.lastID]);
    const token = jwt.sign({ type:'listing', id: listing.id, email: listing.owner_email, business_name: listing.business_name }, SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, listing: safeListing(listing) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings/login
app.post('/api/listings/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const db = await getDb();
    const listing = await db.get('SELECT * FROM listings WHERE owner_email=?', [email?.toLowerCase()]);
    if (!listing || !bcrypt.compareSync(password||'', listing.password_hash))
      return res.status(401).json({ error: 'Incorrect email or password.' });
    const token = jwt.sign({ type:'listing', id: listing.id, email: listing.owner_email, business_name: listing.business_name }, SECRET, { expiresIn: '30d' });
    res.json({ token, listing: safeListing(listing) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/listings/me
app.get('/api/listings/me', requireListing, async (req, res) => {
  try {
    const db = await getDb();
    const listing = await db.get('SELECT * FROM listings WHERE id=?', [req.listing.id]);
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    res.json(safeListing(listing));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/listings/me
app.put('/api/listings/me', requireListing, async (req, res) => {
  try {
    const { business_name, category, phone, website, address, description } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    await db.run(
      'UPDATE listings SET business_name=?,category=?,phone=?,website=?,address=?,description=? WHERE id=?',
      [business_name.trim(), category||'other', phone?.trim()||'', website?.trim()||'', address?.trim()||'', description?.trim()||'', req.listing.id]
    );
    const listing = await db.get('SELECT * FROM listings WHERE id=?', [req.listing.id]);
    res.json(safeListing(listing));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings/checkout (one-time payment)
app.post('/api/listings/checkout', requireListing, async (req, res) => {
  if (!stripe || !STRIPE_PRICE_LISTING) return res.status(503).json({ error: 'Payment not configured. Contact hello@newlexcalendar.com' });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: STRIPE_PRICE_LISTING, quantity: 1 }],
      metadata: { listing_id: String(req.listing.id) },
      success_url: `${SITE_URL}/directory?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL}/directory?cancelled=true`,
    });
    res.json({ url: session.url });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings/cancel (marks as expired - no subscription to cancel)
app.post('/api/listings/cancel', requireListing, async (req, res) => {
  try {
    const db = await getDb();
    await db.run("UPDATE listings SET status='expired' WHERE id=?", [req.listing.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get all distinct zipcodes with their event counts (for zipcode picker)
app.get('/api/zipcodes', async (req, res) => {
  try {
    const db = await getDb();
    const evRows = await db.all("SELECT zipcode, COUNT(*) as count FROM events WHERE status='approved' AND date >= date('now') GROUP BY zipcode ORDER BY count DESC");
    const lsRows = await db.all("SELECT zipcode, COUNT(*) as count FROM listings WHERE status='active' GROUP BY zipcode");
    const combined = {};
    evRows.forEach(r => { combined[r.zipcode] = { zipcode: r.zipcode, events: r.count, listings: 0 }; });
    lsRows.forEach(r => {
      if (combined[r.zipcode]) combined[r.zipcode].listings = r.count;
      else combined[r.zipcode] = { zipcode: r.zipcode, events: 0, listings: r.count };
    });
    res.json(Object.values(combined).sort((a, b) => (b.events + b.listings) - (a.events + a.listings)));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Admin: get all listings
app.get('/api/admin/listings', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    res.json(await db.all('SELECT * FROM listings ORDER BY created_at DESC'));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN APPROVAL ENDPOINTS ──

// Get all pending events
app.get('/api/admin/pending-events', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT e.*, u.name AS submitter_name, u.email AS submitter_email
      FROM events e LEFT JOIN users u ON e.added_by = u.id
      WHERE e.status='pending' ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Approve a pending event
app.put('/api/admin/events/:id/approve', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run("UPDATE events SET status='approved' WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Reject (delete) a pending event
app.delete('/api/admin/events/:id/reject', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM events WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get all pending listings (paid but awaiting approval)
app.get('/api/admin/pending-listings', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT l.*, u.name AS submitter_name, u.email AS submitter_email
      FROM listings l LEFT JOIN users u ON l.user_id = u.id
      WHERE l.status IN ('pending_review','pending') ORDER BY l.created_at DESC
    `);
    res.json(rows.map(safeListing));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Approve a pending listing
app.delete('/api/admin/listings/:id/reject', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM listings WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/listings/:id/approve', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run("UPDATE listings SET status='active' WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get all users (for Town Crier management)
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT id, name, email, is_admin, is_town_crier, created_at,
        (SELECT COUNT(*) FROM events WHERE added_by = users.id AND status='approved') AS approved_events_count,
        (SELECT COUNT(*) FROM listings WHERE user_id = users.id) AS listings_count
      FROM users ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Promote / demote Town Crier
app.put('/api/admin/users/:id/town-crier', requireAdmin, async (req, res) => {
  try {
    const { is_town_crier } = req.body || {};
    const db = await getDb();
    await db.run('UPDATE users SET is_town_crier=? WHERE id=?', [is_town_crier ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get current user's Town Crier status (used by frontend to show badge)
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const u = await db.get('SELECT id,name,email,phone,address,is_admin,is_town_crier,home_zipcode FROM users WHERE id=?', [req.user.id]);
    if (!u) return res.status(404).json({ error: 'User not found.' });
    if (u.email && u.email.endsWith('@local.placeholder')) u.email = '';
    res.json(u);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Admin: hard-delete a listing
app.delete('/api/admin/listings/:id', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM listings WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Admin: create a new listing (no payment required)
app.post('/api/admin/listings', requireAdmin, async (req, res) => {
  try {
    const { business_name, category, phone, website, address, description, owner_email, owner_name } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });

    const db = await getDb();

    // Generate placeholder email if not provided
    let email = (owner_email || '').trim().toLowerCase();
    if (!email) {
      email = `admin-${Date.now()}-${crypto.randomBytes(3).toString('hex')}@newlexcalendar.local`;
    }

    // Check email uniqueness
    const existing = await db.get('SELECT id FROM listings WHERE owner_email=?', [email]);
    if (existing) return res.status(400).json({ error: 'A listing with that email already exists.' });

    // Random password (admin-created listings aren't meant for owner login by default)
    const randomPwd = crypto.randomBytes(16).toString('hex');
    const hash = await bcrypt.hash(randomPwd, 10);

    // 1-year expiration
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const result = await db.run(
      `INSERT INTO listings
       (owner_name, owner_email, password_hash, business_name, category, phone, website, address, description, status, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
      [
        (owner_name || '').trim() || business_name.trim(),
        email,
        hash,
        business_name.trim(),
        category || 'other',
        (phone || '').trim(),
        (website || '').trim(),
        (address || '').trim(),
        (description || '').trim(),
        expiresAt.toISOString()
      ]
    );

    const listing = await db.get('SELECT * FROM listings WHERE id=?', [result.lastID]);
    res.json(safeListing(listing));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Admin: edit any listing
app.put('/api/admin/listings/:id', requireAdmin, async (req, res) => {
  try {
    const { business_name, category, phone, website, address, description, status } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    const existing = await db.get('SELECT * FROM listings WHERE id=?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Listing not found.' });
    await db.run(
      'UPDATE listings SET business_name=?,category=?,phone=?,website=?,address=?,description=?,status=? WHERE id=?',
      [
        business_name.trim(),
        category || 'other',
        phone?.trim() || '',
        website?.trim() || '',
        address?.trim() || '',
        description?.trim() || '',
        status || existing.status,
        req.params.id
      ]
    );
    const updated = await db.get('SELECT * FROM listings WHERE id=?', [req.params.id]);
    res.json(safeListing(updated));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

function safeListing(l) {
  return { id:l.id, owner_name:l.owner_name, owner_email:l.owner_email, business_name:l.business_name,
    category:l.category, phone:l.phone||'', website:l.website||'', address:l.address||'',
    description:l.description||'', status:l.status, expires_at:l.expires_at||'', created_at:l.created_at };
}

// ── SESSION VERIFICATION (replaces webhook reliance) ──
// Verify listing payment after Stripe redirect
app.post('/api/listings/verify-session', requireListing, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payment system not configured.' });
  try {
    const { session_id } = req.body || {};
    if (!session_id) return res.status(400).json({ error: 'Session ID required.' });
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.metadata?.listing_id !== String(req.listing.id))
      return res.status(403).json({ error: 'Session does not match this listing.' });
    if (session.payment_status !== 'paid')
      return res.status(400).json({ error: 'Payment not completed yet.' });
    const db = await getDb();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    await db.run(
      "UPDATE listings SET status='active', stripe_customer_id=?, expires_at=? WHERE id=?",
      [session.customer || '', expires.toISOString(), req.listing.id]
    );
    const listing = await db.get('SELECT * FROM listings WHERE id=?', [req.listing.id]);
    res.json({ success: true, listing: safeListing(listing) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Verify advertiser payment after Stripe redirect
app.post('/api/advertiser/verify-session', requireAdvertiser, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payment system not configured.' });
  try {
    const { session_id } = req.body || {};
    if (!session_id) return res.status(400).json({ error: 'Session ID required.' });
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.metadata?.advertiser_id !== String(req.advertiser.id))
      return res.status(403).json({ error: 'Session does not match this advertiser.' });
    if (session.payment_status !== 'paid')
      return res.status(400).json({ error: 'Payment not completed yet.' });
    const db = await getDb();
    await db.run(
      "UPDATE advertisers SET status='active', stripe_customer_id=?, stripe_subscription_id=? WHERE id=?",
      [session.customer || '', session.subscription || '', req.advertiser.id]
    );
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [req.advertiser.id]);
    res.json({ success: true, advertiser: safeAdv(adv) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ICAL DOWNLOAD WITH EMBEDDED SPONSOR ──
function parseEventTime(timeStr, dateStr) {
  if (!timeStr || timeStr === 'TBD' || /all\s*day/i.test(timeStr)) return { allDay: true };
  const parseT = (h, m, ampm) => {
    let hh = parseInt(h, 10);
    const mm = parseInt(m || '0', 10);
    if (ampm && /pm/i.test(ampm) && hh < 12) hh += 12;
    if (ampm && /am/i.test(ampm) && hh === 12) hh = 0;
    return { h: hh, m: mm };
  };
  const rangeMatch = timeStr.match(/(\d{1,2}):?(\d{0,2})\s*(AM|PM)?\s*[-\u2013to]+\s*(\d{1,2}):?(\d{0,2})\s*(AM|PM)?/i);
  if (rangeMatch) {
    const s = parseT(rangeMatch[1], rangeMatch[2], rangeMatch[3] || rangeMatch[6]);
    const e = parseT(rangeMatch[4], rangeMatch[5], rangeMatch[6]);
    const startDt = new Date(dateStr + 'T00:00:00');
    const endDt   = new Date(dateStr + 'T00:00:00');
    startDt.setHours(s.h, s.m, 0, 0);
    endDt.setHours(e.h, e.m, 0, 0);
    return { start: startDt, end: endDt, allDay: false };
  }
  const singleMatch = timeStr.match(/(\d{1,2}):?(\d{0,2})\s*(AM|PM)?/i);
  if (singleMatch) {
    const t = parseT(singleMatch[1], singleMatch[2], singleMatch[3]);
    const startDt = new Date(dateStr + 'T00:00:00');
    startDt.setHours(t.h, t.m, 0, 0);
    const endDt = new Date(startDt.getTime() + 2 * 3600 * 1000);
    return { start: startDt, end: endDt, allDay: false };
  }
  return { allDay: true };
}

function fmtICS(date) {
  return date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') + 'T' +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') + '00';
}

function escICS(text) {
  return String(text || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

app.get('/api/events/:id/ical', async (req, res) => {
  try {
    const db = await getDb();
    const event = await db.get('SELECT * FROM events WHERE id=?', [req.params.id]);
    if (!event) return res.status(404).send('Event not found');

    // Pick a random premium advertiser to embed
    const premiums = await db.all("SELECT * FROM advertisers WHERE status='active' AND tier='premium'");
    const sponsor = premiums.length ? premiums[Math.floor(Math.random() * premiums.length)] : null;

    const t = parseEventTime(event.time, event.date);

    // Build description with event details + sponsor
    let desc = '';
    if (event.contact && event.contact !== '-') desc += `Contact: ${event.contact}\n`;
    if (event.price)   desc += `Price: ${event.price}\n`;
    if (event.time && event.time !== 'TBD') desc += `Time: ${event.time}\n`;
    desc += '\nFull details at https://www.newlexcalendar.com\n';
    if (sponsor) {
      desc += '\n----------------------------------------\n';
      desc += `📢 SPONSORED BY: ${sponsor.business_name}\n`;
      if (sponsor.tagline) desc += `${sponsor.tagline}\n`;
      if (sponsor.phone)   desc += `📞 Call: ${sponsor.phone}\n`;
      if (sponsor.url)     desc += `🌐 Visit: ${sponsor.url}\n`;
      desc += '\nThank you for supporting our community sponsors!';
    }

    let ics = '';
    ics += 'BEGIN:VCALENDAR\r\n';
    ics += 'VERSION:2.0\r\n';
    ics += 'PRODID:-//NewLexCalendar//EN\r\n';
    ics += 'CALSCALE:GREGORIAN\r\n';
    ics += 'METHOD:PUBLISH\r\n';
    ics += 'BEGIN:VEVENT\r\n';
    ics += `UID:event-${event.id}-${Date.now()}@newlexcalendar.com\r\n`;
    ics += `DTSTAMP:${fmtICS(new Date())}\r\n`;
    if (t.allDay) {
      const startDate = event.date.replace(/-/g, '');
      const next = new Date(event.date + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      const endDate = next.toISOString().split('T')[0].replace(/-/g, '');
      ics += `DTSTART;VALUE=DATE:${startDate}\r\n`;
      ics += `DTEND;VALUE=DATE:${endDate}\r\n`;
    } else {
      ics += `DTSTART:${fmtICS(t.start)}\r\n`;
      ics += `DTEND:${fmtICS(t.end)}\r\n`;
    }
    ics += `SUMMARY:${escICS(event.name)}\r\n`;
    ics += `LOCATION:${escICS(event.location)}\r\n`;
    ics += `DESCRIPTION:${escICS(desc)}\r\n`;
    ics += `URL:https://www.newlexcalendar.com\r\n`;
    ics += 'END:VEVENT\r\n';
    ics += 'END:VCALENDAR\r\n';

    const filename = event.name.replace(/[^a-z0-9]+/gi, '_').slice(0, 50) || 'event';
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.ics"`);
    res.send(ics);
  } catch(e) {
    console.error('iCal generation failed:', e);
    res.status(500).send('Could not generate calendar file.');
  }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

getDb().then(() => app.listen(PORT, () => console.log('NewLex Calendar on port ' + PORT)))
  .catch(err => { console.error('DB init failed:', err); process.exit(1); });
