require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
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

// ── STRIPE WEBHOOK (raw body — MUST be before express.json) ──
app.post('/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    if (!stripe || !STRIPE_WEBHOOK) return res.sendStatus(400);
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], STRIPE_WEBHOOK);
    } catch (e) {
      console.error('Webhook signature failed:', e.message);
      return res.sendStatus(400);
    }
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
    res.sendStatus(200);
  }
);

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── AUTH HELPERS ──
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
    const { name, email, password, address } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (!address?.trim()) return res.status(400).json({ error: 'Address is required.' });
    const db = await getDb();
    if (await db.get('SELECT id FROM users WHERE email=?', [email.toLowerCase()])) return res.status(409).json({ error: 'Email already registered.' });
    const hash = bcrypt.hashSync(password, 10);
    const r = await db.run('INSERT INTO users (name,email,password_hash,address) VALUES (?,?,?,?)', [name.trim(), email.toLowerCase(), hash, address.trim()]);
    const user = { id: r.lastID, name: name.trim(), email: email.toLowerCase(), is_admin: 0 };
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
    const dup = await db.get(
      "SELECT id FROM events WHERE LOWER(TRIM(name))=LOWER(TRIM(?)) AND date=?",
      [name.trim(), date]
    );
    if (dup) return res.status(409).json({ error: "An event with that name already exists on that date. Check the calendar to avoid duplicates." });
    const r = await db.run('INSERT INTO events (cat,name,location,date,time,price,contact,added_by) VALUES (?,?,?,?,?,?,?,?)',
      [cat||'other', name.trim(), location.trim(), date, time?.trim()||'TBD', price?.trim()||'Free', contact?.trim()||'-', req.user.id]);
    res.status(201).json(await db.get('SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE e.id=?', [r.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/events/bulk', requireAuth, async (req, res) => {
  try {
    const { events } = req.body || {};
    if (!Array.isArray(events) || !events.length) return res.status(400).json({ error: 'No events provided.' });
    if (events.length > 200) return res.status(400).json({ error: 'Maximum 200 events per import.' });
    const db = await getDb();
    let imported = 0;
    for (const ev of events) {
      if (!ev.name?.trim() || !ev.location?.trim() || !ev.date) continue;
      const dup = await db.get(
        "SELECT id FROM events WHERE LOWER(TRIM(name))=LOWER(TRIM(?)) AND date=?",
        [ev.name.trim(), ev.date]
      );
      if (dup) continue; // skip duplicates silently in bulk import
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
      success_url: `${SITE_URL}/advertise?success=true`,
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
      success_url: `${SITE_URL}/directory?success=true`,
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

// Admin: get all listings
app.get('/api/admin/listings', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    res.json(await db.all('SELECT * FROM listings ORDER BY created_at DESC'));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

function safeListing(l) {
  return { id:l.id, owner_name:l.owner_name, owner_email:l.owner_email, business_name:l.business_name,
    category:l.category, phone:l.phone||'', website:l.website||'', address:l.address||'',
    description:l.description||'', status:l.status, expires_at:l.expires_at||'', created_at:l.created_at };
}

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

getDb().then(() => app.listen(PORT, () => console.log('NewLex Calendar on port ' + PORT)))
  .catch(err => { console.error('DB init failed:', err); process.exit(1); });
