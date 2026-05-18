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
const STRIPE_PRICE_PREMIUM  = process.env.STRIPE_PRICE_PREMIUM  || '';
const STRIPE_PRICE_FEATURED = process.env.STRIPE_PRICE_FEATURED || '';
const STRIPE_PRICE_LISTING = process.env.STRIPE_PRICE_LISTING || '';
const STRIPE_WEBHOOK       = process.env.STRIPE_WEBHOOK_SECRET || '';
const SITE_URL = process.env.SITE_URL || 'https://www.nearandfarevents.com';

const stripe = STRIPE_SECRET ? require('stripe')(STRIPE_SECRET) : null;

// ============================================================
// RATE LIMITING — in-memory windowed counters (resets on restart, acceptable for spam guard)
// ============================================================
const _rateLimits = new Map(); // key -> { count, resetAt }
function rateLimitCheck(key, limit, windowMs) {
  const now = Date.now();
  const rec = _rateLimits.get(key);
  if (!rec || rec.resetAt < now) {
    _rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (rec.count >= limit) return { ok: false, remaining: 0, resetIn: rec.resetAt - now };
  rec.count++;
  return { ok: true, remaining: limit - rec.count };
}
// Cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _rateLimits) if (v.resetAt < now) _rateLimits.delete(k);
}, 10 * 60 * 1000);

function getClientIp(req) {
  return (req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown').slice(0, 100);
}

function spamGuardEvent(req, res, next) {
  // Signed-in users bypass IP/email rate limits (they're already accountable via account)
  if (req.user) return next();
  const ip = getClientIp(req);
  const emailRaw = (req.body?.guest_email || req.body?.email || '').toLowerCase().trim();

  // 5 submissions per IP per hour
  const ipCheck = rateLimitCheck('evIp:' + ip, 5, 60 * 60 * 1000);
  if (!ipCheck.ok) return res.status(429).json({ error: 'Too many submissions from your network. Please wait an hour or sign in.' });

  // 3 submissions per email per day
  if (emailRaw) {
    const emailCheck = rateLimitCheck('evEmail:' + emailRaw, 3, 24 * 60 * 60 * 1000);
    if (!emailCheck.ok) return res.status(429).json({ error: 'Too many submissions with this email today. Please try again tomorrow or sign in.' });
  }

  // Content checks: too many URLs, all caps, spam keywords
  const body = (req.body?.name || '') + ' ' + (req.body?.description || '');
  const urls = (body.match(/https?:\/\//g) || []).length;
  if (urls > 2) return res.status(400).json({ error: 'Too many links in submission. Please limit to 1-2 URLs in description.' });
  const upperRatio = body.length > 20 ? (body.match(/[A-Z]/g) || []).length / body.length : 0;
  if (upperRatio > 0.7) return res.status(400).json({ error: 'Please use normal capitalization — ALL CAPS submissions are blocked.' });
  if (/\b(viagra|casino|crypto investment|forex|porn|adult dating)\b/i.test(body)) {
    return res.status(400).json({ error: 'Submission contains content that does not match this community calendar.' });
  }
  next();
}

function spamGuardSponsorship(req, res, next) {
  const ip = getClientIp(req);
  const ipCheck = rateLimitCheck('spIp:' + ip, 3, 60 * 60 * 1000); // 3/hr/IP
  if (!ipCheck.ok) return res.status(429).json({ error: 'Too many sponsorship attempts from your network. Please wait an hour.' });
  next();
}

// ============================================================
// STATE ZIPCODE COUNTS — used for state-wide pricing
// ============================================================
const STATE_ZIP_COUNTS = {
  'AL':645,'AK':240,'AZ':565,'AR':590,'CA':1798,'CO':530,'CT':425,'DE':85,'DC':25,
  'FL':1490,'GA':740,'HI':130,'ID':290,'IL':1380,'IN':770,'IA':935,'KS':700,
  'KY':770,'LA':510,'ME':430,'MD':470,'MA':660,'MI':1100,'MN':880,'MS':410,
  'MO':1020,'MT':360,'NE':580,'NV':175,'NH':285,'NJ':600,'NM':405,'NY':1750,
  'NC':815,'ND':380,'OH':1196,'OK':645,'OR':415,'PA':1750,'RI':90,'SC':410,
  'SD':380,'TN':615,'TX':1820,'UT':285,'VT':255,'VA':870,'WA':580,'WV':720,
  'WI':770,'WY':175
};
function calcStateWidePriceCents(state) {
  const count = STATE_ZIP_COUNTS[(state||'').toUpperCase()] || 0;
  return count > 0 ? Math.round(count * 30 * 0.70 * 100) : 0;
}


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

// ============================================================
// STATE-BASED ZIPCODE RESTRICTIONS (admin-controlled rollout)
// ============================================================
// Approximate ZIP3 → state mapping (USPS sectional center boundaries).
// Covers ~99% of US zipcodes correctly for state-level filtering.
const ZIP3_RANGES = [
  [10,27,'MA'],[28,29,'RI'],[30,38,'NH'],[39,49,'ME'],[50,59,'VT'],
  [60,69,'CT'],[70,89,'NJ'],[100,119,'NY'],[120,149,'NY'],[150,196,'PA'],
  [200,205,'DC'],[206,219,'MD'],[220,246,'VA'],[247,268,'WV'],[270,289,'NC'],
  [290,299,'SC'],[300,319,'GA'],[320,349,'FL'],[350,369,'AL'],[370,385,'TN'],
  [386,397,'MS'],[400,427,'KY'],[430,459,'OH'],[460,479,'IN'],[480,499,'MI'],
  [500,528,'IA'],[530,549,'WI'],[550,567,'MN'],[570,577,'SD'],[580,588,'ND'],
  [590,599,'MT'],[600,629,'IL'],[630,658,'MO'],[660,679,'KS'],[680,693,'NE'],
  [700,714,'LA'],[716,729,'AR'],[730,749,'OK'],[750,799,'TX'],[800,816,'CO'],
  [820,831,'WY'],[832,838,'ID'],[840,847,'UT'],[850,865,'AZ'],[870,884,'NM'],
  [889,898,'NV'],[900,961,'CA'],[967,968,'HI'],[970,979,'OR'],[980,994,'WA'],
  [995,999,'AK']
];

function zipToState(zip) {
  const z = parseInt(String(zip||'').substring(0,3), 10);
  if (isNaN(z)) return null;
  for (const [start, end, state] of ZIP3_RANGES) {
    if (z >= start && z <= end) return state;
  }
  return null;
}

let _enabledStatesCache = null;
let _enabledStatesCacheAt = 0;
async function getEnabledStates(db) {
  // Cache for 30 seconds
  if (_enabledStatesCache && Date.now() - _enabledStatesCacheAt < 30000) {
    return _enabledStatesCache;
  }
  try {
    const row = await db.get('SELECT value FROM settings WHERE key=?', ['enabled_states']);
    const raw = row?.value || 'OH';
    const list = raw.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    _enabledStatesCache = list;
    _enabledStatesCacheAt = Date.now();
    return list;
  } catch(_) {
    return ['OH'];
  }
}

async function isZipEnabled(db, zipcode) {
  const state = zipToState(zipcode);
  if (!state) return false; // Unknown zipcode is treated as disabled
  const enabled = await getEnabledStates(db);
  return enabled.includes(state);
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
// ──────────────────────────────────────────────────────────
// EMAIL SERVICE — sends transactional emails via Resend API
// Falls back to console.log if RESEND_API_KEY isn't set (dev/test)
// ──────────────────────────────────────────────────────────
const EMAIL_FROM = process.env.EMAIL_FROM || 'Near and Far Events <hello@nearandfarevents.com>';
const PUBLIC_URL = process.env.SITE_URL || 'https://www.nearandfarevents.com';

async function sendEmail({ to, subject, html, text }) {
  if (!to) throw new Error('No recipient');
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}\n${text || html.replace(/<[^>]+>/g,'')}\n---`);
    return { id: 'mock-' + Date.now(), mock: true };
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: EMAIL_FROM, to: [to], subject, html, text })
    });
    const data = await r.json();
    if (!r.ok) {
      console.error('Resend error:', data);
      throw new Error('Email send failed: ' + (data.message || r.status));
    }
    return data;
  } catch (e) {
    console.error('Email send error:', e.message);
    throw e;
  }
}

// Shared email layout — frosted-glass card with gradient header
function emailLayout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFBFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F172A;line-height:1.55">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="text-align:center;padding:18px 0 22px">
      <div style="display:inline-block;padding:10px 18px;border-radius:100px;background:linear-gradient(135deg,#6366F1,#EC4899,#F59E0B);color:#fff;font-size:18px;font-weight:800;letter-spacing:-.01em">✦ Near and Far Events</div>
    </div>
    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:30px 28px;box-shadow:0 4px 20px rgba(99,102,241,.08)">
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0F172A;letter-spacing:-.01em">${title}</h1>
      ${bodyHtml}
    </div>
    <div style="text-align:center;font-size:12px;color:#94A3B8;padding:18px 12px 12px;line-height:1.7">
      Near and Far Events · <a href="${PUBLIC_URL}" style="color:#6366F1;text-decoration:none">nearandfarevents.com</a><br>
      Questions? Reply to this email or write us at <a href="mailto:hello@nearandfarevents.com" style="color:#6366F1;text-decoration:none">hello@nearandfarevents.com</a>
    </div>
  </div>
</body></html>`;
}

function emailButton(href, label) {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:18px auto"><tr><td style="border-radius:100px;background:linear-gradient(135deg,#6366F1,#EC4899,#F59E0B)">
    <a href="${href}" style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;border-radius:100px">${label}</a>
  </td></tr></table>`;
}

// Cryptographically random token + hash helpers
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}


// ── Audit log helper: record an admin-removed item (24-month retention per spec §6) ──
async function logRemovedItem(db, params) {
  try {
    await db.run(
      `INSERT INTO removed_items
        (item_type, original_id, item_name, item_date, item_zipcode,
         owner_user_id, owner_name, owner_email,
         removed_by, removed_by_name, reason, snapshot)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        params.item_type, params.original_id, params.item_name || '',
        params.item_date || '', params.item_zipcode || '',
        params.owner_user_id || null, params.owner_name || '', params.owner_email || '',
        params.removed_by, params.removed_by_name || '',
        params.reason || '', JSON.stringify(params.snapshot || {})
      ]
    );
  } catch(e) { console.error('Audit log failed:', e.message); }
}


// ── Time + display helpers for events ──
function computeEffectiveEndAt(date, start_time, end_time, all_day) {
  // Returns ISO datetime string for "when this event is no longer visible" (end + 4hr grace)
  if (!date) return '';
  let endStr;
  if (all_day) {
    endStr = `${date}T23:59:00`;
  } else if (end_time) {
    endStr = `${date}T${end_time}:00`;
  } else if (start_time) {
    // No end time given; assume 2-hour duration
    const [h, m] = start_time.split(':').map(n => parseInt(n, 10));
    const dt = new Date(`${date}T${start_time}:00`);
    dt.setHours(dt.getHours() + 2);
    endStr = dt.toISOString().slice(0, 19);
  } else {
    // No times at all; treat as end-of-day
    endStr = `${date}T23:59:00`;
  }
  const dt = new Date(endStr);
  dt.setHours(dt.getHours() + 4); // 4-hour grace period
  return dt.toISOString().slice(0, 19).replace('T', ' ');
}
function formatTime12(t24) {
  if (!t24 || !/^\d{1,2}:\d{2}$/.test(t24)) return '';
  const [h, m] = t24.split(':').map(n => parseInt(n, 10));
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}
function buildTimeDisplay(start_time, end_time, all_day) {
  if (all_day) return 'All Day';
  if (start_time && end_time) return `${formatTime12(start_time)} – ${formatTime12(end_time)}`;
  if (start_time) return formatTime12(start_time);
  return 'TBD';
}

// Sanitize event description: strip HTML tags, normalize newlines, cap length
function cleanDescription(s) {
  if (!s) return '';
  let v = String(s).replace(/<[^>]*>/g, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return v.slice(0, 2000).trim();
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body || {};
    if (!name?.trim() || !password) return res.status(400).json({ error: 'Name and password are required.' });
    // Stronger password rules (spec §12)
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return res.status(400).json({ error: 'Password must include both letters and numbers.' });
    if (!address?.trim()) return res.status(400).json({ error: 'Address is required.' });
    const emailClean = (email || '').toLowerCase().trim();
    const phoneClean = normalizePhone(phone);
    if (!emailClean && !phoneClean) return res.status(400).json({ error: 'Please provide either an email or a phone number.' });
    if (phone && !phoneClean) return res.status(400).json({ error: 'Phone number must be 10 digits (US format).' });
    if (emailClean && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailClean)) return res.status(400).json({ error: 'Please enter a valid email address.' });
    const db = await getDb();
    if (emailClean && await db.get('SELECT id FROM users WHERE email=?', [emailClean])) return res.status(409).json({ error: 'Email already registered.' });
    if (phoneClean && await db.get('SELECT id FROM users WHERE phone=?', [phoneClean])) return res.status(409).json({ error: 'Phone number already registered.' });
    const hash = bcrypt.hashSync(password, 10);

    if (emailClean) {
      // Email registration → must verify
      const emailForDb = emailClean;
      const token = generateToken();
      const tokenHash = hashToken(token);
      const expires = new Date(Date.now() + 24*60*60*1000).toISOString();
      const r = await db.run(
        'INSERT INTO users (name,email,phone,password_hash,address,email_verified,verify_token_hash,verify_expires,last_verify_sent_at) VALUES (?,?,?,?,?,0,?,?,?)',
        [name.trim(), emailForDb, phoneClean || null, hash, address.trim(), tokenHash, expires, new Date().toISOString()]
      );
      // Send verification email (non-fatal if it fails — user can request resend)
      try {
        const verifyUrl = `${PUBLIC_URL}/verify?token=${token}&email=${encodeURIComponent(emailClean)}`;
        await sendEmail({
          to: emailClean,
          subject: 'Verify your Near and Far Events account',
          html: emailLayout('Welcome — verify your email', `
            <p style="margin:0 0 14px">Hi ${escapeHtml(name.trim())},</p>
            <p style="margin:0 0 14px">Thanks for joining Near and Far Events! Click the button below to verify your email and activate your account.</p>
            ${emailButton(verifyUrl, 'Verify My Email')}
            <p style="margin:18px 0 8px;font-size:13px;color:#475569">Or paste this link in your browser:<br><a href="${verifyUrl}" style="color:#6366F1;word-break:break-all">${verifyUrl}</a></p>
            <p style="margin:18px 0 0;font-size:13px;color:#94A3B8">This link expires in 24 hours. If you didn't sign up, you can safely ignore this email.</p>`),
          text: `Welcome to Near and Far Events!\n\nVerify your email by visiting:\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't sign up, ignore this email.`
        });
      } catch (e) { console.error('Verify email failed:', e.message); }
      return res.status(201).json({ success: true, requiresVerification: true, email: emailClean });
    } else {
      // Phone-only registration → auto-verified (no email to verify)
      const emailForDb = (`phone-${phoneClean}-${Date.now()}@nearandfarevents.local`);
      const r = await db.run(
        'INSERT INTO users (name,email,phone,password_hash,address,email_verified) VALUES (?,?,?,?,?,1)',
        [name.trim(), emailForDb, phoneClean, hash, address.trim()]
      );
      const user = { id: r.lastID, name: name.trim(), email: '', phone: phoneClean, is_admin: 0, is_town_crier: 0 };
      return res.status(201).json({ token: jwt.sign(user, SECRET, { expiresIn: '30d' }), user });
    }
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Verify email
app.get('/api/auth/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: 'Verification token missing.' });
    const db = await getDb();
    const tokenHash = hashToken(token);
    const row = await db.get('SELECT * FROM users WHERE verify_token_hash=?', [tokenHash]);
    if (!row) return res.status(400).json({ error: 'Invalid or expired verification link. You can request a new one from the sign-in screen.' });
    if (row.verify_expires && new Date(row.verify_expires) < new Date()) {
      return res.status(400).json({ error: 'This verification link has expired. Sign in to request a new one.' });
    }
    await db.run("UPDATE users SET email_verified=1, verify_token_hash='', verify_expires='' WHERE id=?", [row.id]);
    const emailForUser = (row.email && row.email.endsWith('@nearandfarevents.local')) ? '' : row.email;
    const user = { id: row.id, name: row.name, email: emailForUser, phone: row.phone || '', is_admin: row.is_admin, is_town_crier: row.is_town_crier };
    res.json({ success: true, token: jwt.sign(user, SECRET, { expiresIn: '30d' }), user });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Resend verification email (rate-limited to 1 per minute)
app.post('/api/auth/resend-verify', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    const emailClean = String(email).toLowerCase().trim();
    const db = await getDb();
    const row = await db.get('SELECT * FROM users WHERE email=?', [emailClean]);
    // Always return success to avoid leaking which emails are registered
    if (!row || row.email_verified) return res.json({ success: true });
    // Rate-limit: don't resend if one was sent in the last 60 seconds
    if (row.last_verify_sent_at) {
      const since = Date.now() - new Date(row.last_verify_sent_at).getTime();
      if (since < 60_000) return res.json({ success: true, wait: Math.ceil((60000 - since)/1000) });
    }
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 24*60*60*1000).toISOString();
    await db.run('UPDATE users SET verify_token_hash=?, verify_expires=?, last_verify_sent_at=? WHERE id=?', [tokenHash, expires, new Date().toISOString(), row.id]);
    try {
      const verifyUrl = `${PUBLIC_URL}/verify?token=${token}&email=${encodeURIComponent(emailClean)}`;
      await sendEmail({
        to: emailClean, subject: 'Verify your Near and Far Events account',
        html: emailLayout('Verify your email', `
          <p style="margin:0 0 14px">Here's a fresh verification link for your account:</p>
          ${emailButton(verifyUrl, 'Verify My Email')}
          <p style="margin:18px 0 0;font-size:13px;color:#94A3B8">This link expires in 24 hours. If you didn't request this, ignore this email.</p>`),
        text: `Verify your Near and Far Events account:\n${verifyUrl}\n\nExpires in 24 hours.`
      });
    } catch(e) { console.error('Resend verify email failed:', e.message); }
    res.json({ success: true });
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
    // Enforce email verification
    if (!row.email_verified) {
      return res.status(403).json({ error: 'Please verify your email before signing in. Check your inbox for the verification link.', needsVerification: true, email: row.email && !row.email.endsWith('@nearandfarevents.local') ? row.email : null });
    }
    const emailForUser = (row.email && row.email.endsWith('@nearandfarevents.local')) ? '' : row.email;
    const user = { id: row.id, name: row.name, email: emailForUser, phone: row.phone || '', is_admin: row.is_admin, is_town_crier: row.is_town_crier };
    res.json({ token: jwt.sign(user, SECRET, { expiresIn: '30d' }), user });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Forgot password — request reset link
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    const emailClean = String(email).toLowerCase().trim();
    const db = await getDb();
    const row = await db.get('SELECT * FROM users WHERE email=?', [emailClean]);
    // Always return success even if the email isn't found (don't leak which emails are registered)
    if (row) {
      const token = generateToken();
      const tokenHash = hashToken(token);
      const expires = new Date(Date.now() + 60*60*1000).toISOString(); // 1 hour
      await db.run('UPDATE users SET reset_token_hash=?, reset_expires=? WHERE id=?', [tokenHash, expires, row.id]);
      try {
        const resetUrl = `${PUBLIC_URL}/reset-password?token=${token}&email=${encodeURIComponent(emailClean)}`;
        await sendEmail({
          to: emailClean, subject: 'Reset your Near and Far Events password',
          html: emailLayout('Reset your password', `
            <p style="margin:0 0 14px">We received a request to reset your password. Click below to set a new one.</p>
            ${emailButton(resetUrl, 'Reset My Password')}
            <p style="margin:18px 0 8px;font-size:13px;color:#475569">Or paste this link in your browser:<br><a href="${resetUrl}" style="color:#6366F1;word-break:break-all">${resetUrl}</a></p>
            <p style="margin:18px 0 0;font-size:13px;color:#94A3B8"><strong style="color:#475569">This link expires in 1 hour.</strong> If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>`),
          text: `Reset your Near and Far Events password:\n${resetUrl}\n\nExpires in 1 hour. If you didn't request this, ignore this email.`
        });
      } catch(e) { console.error('Reset email failed:', e.message); }
    }
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Reset password — submit new password with token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, new_password } = req.body || {};
    if (!token || !new_password) return res.status(400).json({ error: 'Token and new password are required.' });
    if (new_password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (!/[A-Za-z]/.test(new_password) || !/[0-9]/.test(new_password)) return res.status(400).json({ error: 'Password must include both letters and numbers.' });
    const db = await getDb();
    const tokenHash = hashToken(token);
    const row = await db.get('SELECT * FROM users WHERE reset_token_hash=?', [tokenHash]);
    if (!row) return res.status(400).json({ error: 'This reset link is invalid or has been used. Request a new one if needed.' });
    if (row.reset_expires && new Date(row.reset_expires) < new Date()) {
      return res.status(400).json({ error: 'This reset link has expired. Request a new one.' });
    }
    const newHash = bcrypt.hashSync(new_password, 10);
    // Clear reset tokens AND mark email_verified (since they could click the email link, they own the inbox)
    await db.run("UPDATE users SET password_hash=?, reset_token_hash='', reset_expires='', email_verified=1 WHERE id=?", [newHash, row.id]);
    // Notify the user that their password was changed
    if (row.email && !row.email.endsWith('@nearandfarevents.local')) {
      try {
        await sendEmail({
          to: row.email, subject: 'Your Near and Far Events password was changed',
          html: emailLayout('Password updated', `
            <p style="margin:0 0 14px">Your password was just changed.</p>
            <p style="margin:0 0 14px;font-size:14px;color:#475569">If this was you — great, no further action needed. <a href="${PUBLIC_URL}" style="color:#6366F1">Sign in here</a>.</p>
            <p style="margin:0;font-size:13px;color:#94A3B8"><strong style="color:#DC2626">If this wasn't you</strong>, contact us immediately at <a href="mailto:hello@nearandfarevents.com" style="color:#6366F1">hello@nearandfarevents.com</a>.</p>`),
          text: `Your Near and Far Events password was just changed. If this wasn't you, contact hello@nearandfarevents.com immediately.`
        });
      } catch(_) {}
    }
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// CCPA: Data export — download all personal data we have
app.get('/api/auth/export', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT id,name,email,phone,address,home_zipcode,is_admin,is_town_crier,email_verified,notify_zipcodes,created_at FROM users WHERE id=?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    const events = await db.all('SELECT * FROM events WHERE added_by=?', [req.user.id]);
    const listings = await db.all('SELECT * FROM listings WHERE user_id=?', [req.user.id]);
    const exported = {
      exported_at: new Date().toISOString(),
      user: user,
      events_submitted: events,
      listings_submitted: listings,
      note: 'This is all personal data we hold about your account. Payment data is stored by Stripe (not us). For Stripe data, contact Stripe directly.'
    };
    res.setHeader('Content-Disposition', `attachment; filename="nearandfar-data-${user.id}-${Date.now()}.json"`);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(exported, null, 2));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// HTML escape helper for email templates (defensive)
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

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
    const zipState = zipToState(zipcode);
    const statewide = (req.query.statewide||'') === 'true';
    // Zip filter logic:
    // - If statewide=true AND we have a state: include events from any zip in that state
    // - Otherwise: zip match OR state-wide event matching this zip's state
    let zipFilter = '';
    let zipParam = [];
    if (statewide && zipState) {
      // Show all events in this state — match either by event's zip prefix-to-state OR statewide_state
      zipFilter = " AND ((SELECT substr(e.zipcode,1,5)) IN (SELECT zipcode FROM listings WHERE statewide_state=? OR zipcode LIKE ?) OR e.statewide_state=?)";
      zipParam = [zipState, '%', zipState];
      // Simpler reliable approach: just filter by state-prefix match using JS-side filter after query
      zipFilter = '';  // we will filter in JS instead
      zipParam = [];
    } else if (zipcode) {
      zipFilter = ' AND (e.zipcode=? OR (e.statewide_state != \'\' AND e.statewide_state = ?))';
      zipParam = [zipcode, zipState || ''];
    }
    let sql;
    let params;
    if (isAdmin) {
      sql = 'SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE 1=1' + zipFilter + ' ORDER BY e.date ASC,e.start_time ASC,e.time ASC';
      params = zipParam;
    } else if (userId) {
      sql = "SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE (e.status='approved' OR (e.status='pending' AND e.added_by=?)) AND e.date >= date('now', 'localtime')" + zipFilter + " ORDER BY e.date ASC,e.start_time ASC,e.time ASC";
      params = [userId, ...zipParam];
    } else {
      sql = "SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE e.status='approved' AND e.date >= date('now', 'localtime')" + zipFilter + " ORDER BY e.date ASC,e.start_time ASC,e.time ASC";
      params = zipParam;
    }
    let rows = await db.all(sql, params);
    // Filter out events in non-enabled states for non-admin users
    if (!isAdmin) {
      const enabled = await getEnabledStates(db);
      const filtered = rows.filter(r => {
        const st = zipToState(r.zipcode);
        return st && enabled.includes(st);
      });
      return res.json(filtered);
    }
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const { cat, name, location, date, time, start_time, end_time, all_day, price, contact, zipcode, affiliate_url, description, statewide_state } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Name, location, and date are required.' });
    const db = await getDb();
    // Validate zipcode is in an enabled state (skip for admin)
    if (!req.user.is_admin) {
      const zipState = zipToState(zipcode);
      const enabled = await getEnabledStates(db);
      if (!zipState || !enabled.includes(zipState)) {
        return res.status(403).json({ error: `Near and Far Events isn't live in your area yet. We're rolling out state by state — currently live in: ${enabled.join(', ')}.` });
      }
    }
    const dup = await db.get(
      "SELECT id FROM events WHERE LOWER(TRIM(name))=LOWER(TRIM(?)) AND date=? AND status!='pending'",
      [name.trim(), date]
    );
    if (dup) return res.status(409).json({ error: "An event with that name already exists on that date. Check the calendar to avoid duplicates." });
    const userRow = await db.get('SELECT is_admin, is_town_crier FROM users WHERE id=?', [req.user.id]);
    const status = (userRow && (userRow.is_admin || userRow.is_town_crier)) ? 'approved' : 'pending';
    const zip = (zipcode || '').toString().trim() || '43764';
    const st = (start_time||'').toString().trim();
    const et = (end_time||'').toString().trim();
    const ad = all_day ? 1 : 0;
    const eff = computeEffectiveEndAt(date, st, et, ad);
    const timeDisplay = (time?.trim()) || buildTimeDisplay(st, et, ad);
    const r = await db.run(
      'INSERT INTO events (cat,name,location,date,time,start_time,end_time,all_day,effective_end_at,price,contact,added_by,status,zipcode,affiliate_url,description,statewide_state) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [cat||'other', name.trim(), location.trim(), date, timeDisplay, st, et, ad, eff, price?.trim()||'Free', contact?.trim()||'-', req.user.id, status, zip, (affiliate_url||'').trim(), cleanDescription(description)]
    );
    const ev = await db.get('SELECT e.*,u.name AS author_name FROM events e JOIN users u ON u.id=e.added_by WHERE e.id=?', [r.lastID]);
    res.status(201).json({ ...ev, pending_approval: status === 'pending' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ──────────────────────────────────────────────────────────
// GUEST (anonymous) EVENT SUBMISSION — no account required
// User submits with name + email; receives verification email;
// clicking the link activates the event into the moderation queue.
// Also receives a magic edit/delete link for that event.
// ──────────────────────────────────────────────────────────
app.post('/api/events/guest', spamGuardEvent, async (req, res) => {
  try {
    const { cat, name, location, date, time, start_time, end_time, all_day, price, contact, zipcode, affiliate_url, description, submitter_name, submitter_email, submitter_phone } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Event name, location, and date are required.' });
    if (!submitter_name?.trim()) return res.status(400).json({ error: 'Please tell us your name so we can contact you about this event.' });
    if (!submitter_email?.trim()) return res.status(400).json({ error: 'Email is required so we can verify your submission and send you the edit link.' });
    const emailClean = String(submitter_email).toLowerCase().trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailClean)) return res.status(400).json({ error: 'Please enter a valid email address.' });
    const phoneClean = normalizePhone(submitter_phone);
    if (submitter_phone && !phoneClean) return res.status(400).json({ error: 'Phone number must be 10 digits (US format).' });

    const db = await getDb();
    // Validate zipcode is in an enabled state
    const zipState = zipToState(zipcode);
    const enabled = await getEnabledStates(db);
    if (!zipState || !enabled.includes(zipState)) {
      return res.status(403).json({ error: `Near and Far Events isn't live in your area yet. We're rolling out state by state — currently live in: ${enabled.join(', ')}.` });
    }
    // Duplicate check (same name + date already approved)
    const dup = await db.get(
      "SELECT id FROM events WHERE LOWER(TRIM(name))=LOWER(TRIM(?)) AND date=? AND status='approved'",
      [name.trim(), date]
    );
    if (dup) return res.status(409).json({ error: "An event with that name already exists on that date. Check the calendar to avoid duplicates." });

    // Find the sentinel guest user for foreign key
    const guestUser = await db.get("SELECT id FROM users WHERE email='guest@nearandfarevents.system'");
    if (!guestUser) return res.status(500).json({ error: 'Guest submission temporarily unavailable. Please try again or create an account.' });

    const verifyToken = generateToken();
    const manageToken = generateToken();
    const verifyHash = hashToken(verifyToken);
    const manageHash = hashToken(manageToken);
    const expires = new Date(Date.now() + 7*24*60*60*1000).toISOString(); // 7 days to verify
    const zip = (zipcode || '').toString().trim() || '43764';

    const st = (start_time||'').toString().trim();
    const et = (end_time||'').toString().trim();
    const ad = all_day ? 1 : 0;
    const eff = computeEffectiveEndAt(date, st, et, ad);
    const timeDisplay = (time?.trim()) || buildTimeDisplay(st, et, ad);
    await db.run(
      `INSERT INTO events
        (cat, name, location, date, time, start_time, end_time, all_day, effective_end_at, price, contact, added_by, status, zipcode, affiliate_url, description,
         is_anonymous, submitter_name, submitter_email, submitter_phone,
         submitter_verify_token_hash, submitter_manage_token_hash, submitter_verify_expires)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'pending_verify',?,?,?, 1, ?,?,?, ?,?,?)`,
      [
        cat||'other', name.trim(), location.trim(), date,
        timeDisplay, st, et, ad, eff,
        price?.trim()||'Free', contact?.trim()||'-',
        guestUser.id, zip, (affiliate_url||'').trim(), cleanDescription(description),
        submitter_name.trim(), emailClean, phoneClean || '',
        verifyHash, manageHash, expires
      ]
    );

    // Send verification email with BOTH links: verify + manage
    const verifyUrl = `${PUBLIC_URL}/verify-event?token=${verifyToken}`;
    const manageUrl = `${PUBLIC_URL}/manage-event?token=${manageToken}`;
    try {
      await sendEmail({
        to: emailClean,
        subject: 'Confirm your event on Near and Far Events',
        html: emailLayout('Confirm your event submission', `
          <p style="margin:0 0 14px">Hi ${escapeHtml(submitter_name.trim())},</p>
          <p style="margin:0 0 14px">Thanks for submitting your event! Click the button below to confirm your email and send it to our review team:</p>
          <table cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 6px"><tr><td style="font-size:13px;font-weight:700;color:#0F172A;padding:2px 0">Your event:</td></tr><tr><td style="font-size:15px;color:#0F172A;padding:2px 0">${escapeHtml(name.trim())}</td></tr><tr><td style="font-size:13px;color:#475569;padding:1px 0">📍 ${escapeHtml(location.trim())}</td></tr><tr><td style="font-size:13px;color:#475569;padding:1px 0 8px">📅 ${escapeHtml(date)}${time?.trim() ? ' at ' + escapeHtml(time.trim()) : ''}</td></tr></table>
          ${emailButton(verifyUrl, '✓ Confirm This Event')}
          <p style="margin:24px 0 6px;font-size:13px;color:#475569"><strong>Need to edit or delete this event later?</strong> Bookmark this link — it's how you'll manage your event without an account:</p>
          <p style="margin:0 0 4px;font-size:12px"><a href="${manageUrl}" style="color:#6366F1;word-break:break-all">${manageUrl}</a></p>
          <p style="margin:18px 0 0;font-size:12px;color:#94A3B8">Confirmation link expires in 7 days. The manage link works as long as your event is published.<br>If you didn't submit this, you can safely ignore this email.</p>`),
        text: `Thanks for submitting "${name.trim()}" on Near and Far Events!\n\nConfirm your event:\n${verifyUrl}\n\nManage your event (edit/delete) — save this link:\n${manageUrl}\n\nThe confirmation link expires in 7 days.`
      });
    } catch (e) { console.error('Guest verify email failed:', e.message); }

    res.status(201).json({ success: true, email: emailClean });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Verify a guest-submitted event (clicked email link) — moves it from pending_verify → pending (moderation)
app.get('/api/events/guest-verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: 'Verification token missing.' });
    const db = await getDb();
    const verifyHash = hashToken(token);
    const ev = await db.get("SELECT * FROM events WHERE submitter_verify_token_hash=? AND status='pending_verify'", [verifyHash]);
    if (!ev) {
      // Idempotent: maybe already verified — check if a token-match exists for an already-pending or approved event
      const already = await db.get("SELECT id, status FROM events WHERE submitter_verify_token_hash=?", [verifyHash]);
      if (already) return res.json({ success: true, alreadyVerified: true, eventId: already.id });
      return res.status(400).json({ error: 'This verification link is invalid or has already been used. Check your email for a newer link or contact hello@nearandfarevents.com.' });
    }
    if (ev.submitter_verify_expires && new Date(ev.submitter_verify_expires) < new Date()) {
      return res.status(400).json({ error: 'This verification link has expired. Please re-submit your event.' });
    }
    // Move to moderation queue + record verification time
    await db.run("UPDATE events SET status='pending', submitter_verified_at=?, submitter_verify_token_hash='', submitter_verify_expires='' WHERE id=?", [new Date().toISOString(), ev.id]);
    res.json({ success: true, eventName: ev.name });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Fetch event details for editing via magic manage link (guest)
app.get('/api/events/manage/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: 'Manage token missing.' });
    const db = await getDb();
    const manageHash = hashToken(token);
    const ev = await db.get("SELECT * FROM events WHERE submitter_manage_token_hash=?", [manageHash]);
    if (!ev) return res.status(400).json({ error: 'This manage link is invalid. If your event was deleted, this link no longer works.' });
    res.json({
      id: ev.id, cat: ev.cat, name: ev.name, location: ev.location, date: ev.date,
      time: ev.time, start_time: ev.start_time || '', end_time: ev.end_time || '', all_day: ev.all_day || 0,
      price: ev.price, contact: ev.contact, zipcode: ev.zipcode,
      affiliate_url: ev.affiliate_url, description: ev.description || '', status: ev.status,
      submitter_name: ev.submitter_name, submitter_email: ev.submitter_email, submitter_phone: ev.submitter_phone
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update event via magic manage link
app.put('/api/events/manage/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { cat, name, location, date, time, start_time, end_time, all_day, price, contact, zipcode, affiliate_url, description, statewide_state } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Name, location, and date are required.' });
    const db = await getDb();
    const manageHash = hashToken(token);
    const ev = await db.get("SELECT id, status FROM events WHERE submitter_manage_token_hash=?", [manageHash]);
    if (!ev) return res.status(400).json({ error: 'Manage link is invalid.' });
    const st = (start_time||'').toString().trim();
    const et = (end_time||'').toString().trim();
    const ad = all_day ? 1 : 0;
    const eff = computeEffectiveEndAt(date, st, et, ad);
    const timeDisplay = (time?.trim()) || buildTimeDisplay(st, et, ad);
    // After editing, send back through moderation for safety
    const newStatus = ev.status === 'approved' ? 'pending' : ev.status;
    await db.run(
      `UPDATE events SET cat=?, name=?, location=?, date=?, time=?, start_time=?, end_time=?, all_day=?, effective_end_at=?, price=?, contact=?, zipcode=?, affiliate_url=?, description=?, status=? WHERE id=?`,
      [cat||'other', name.trim(), location.trim(), date, timeDisplay, st, et, ad, eff, price?.trim()||'Free', contact?.trim()||'-', (zipcode||'').toString().trim()||'43764', (affiliate_url||'').trim(), cleanDescription(description), newStatus, ev.id]
    );
    res.json({ success: true, requeued: newStatus === 'pending' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete event via magic manage link
app.delete('/api/events/manage/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const db = await getDb();
    const manageHash = hashToken(token);
    const ev = await db.get("SELECT id FROM events WHERE submitter_manage_token_hash=?", [manageHash]);
    if (!ev) return res.status(400).json({ error: 'Manage link is invalid.' });
    await db.run('DELETE FROM events WHERE id=?', [ev.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/events/bulk', requireAuth, async (req, res) => {
  try {
    const events = Array.isArray(req.body?.events) ? req.body.events : [];
    if (!events.length) return res.status(400).json({ error: 'No events provided.' });
    const db = await getDb();
    const enabled = await getEnabledStates(db);
    const skipState = !req.user.is_admin;
    const userRow = await db.get('SELECT is_admin, is_town_crier FROM users WHERE id=?', [req.user.id]);
    const status = (userRow && (userRow.is_admin || userRow.is_town_crier)) ? 'approved' : 'pending';
    let inserted = 0, skipped = 0;
    for (const ev of events) {
      if (!ev.name?.trim() || !ev.location?.trim() || !ev.date) { skipped++; continue; }
      // State restriction (non-admin)
      if (skipState) {
        const st = zipToState(ev.zipcode || '');
        if (!st || !enabled.includes(st)) { skipped++; continue; }
      }
      const dup = await db.get("SELECT id FROM events WHERE LOWER(TRIM(name))=LOWER(TRIM(?)) AND date=? AND status!='pending'",
        [ev.name.trim(), ev.date]);
      if (dup) { skipped++; continue; }
      const zip = (ev.zipcode || '').toString().trim() || '43764';
      const _eff = computeEffectiveEndAt(ev.date, '', '', 0); // CSV bulk uses display-only time, default 4hr after end of day
      await db.run(
        'INSERT INTO events (cat,name,location,date,time,effective_end_at,price,contact,added_by,status,zipcode,affiliate_url,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [ev.cat||'other', ev.name.trim(), ev.location.trim(), ev.date, ev.time?.trim()||'TBD', _eff, ev.price?.trim()||'Free', ev.contact?.trim()||'-', req.user.id, status, zip, (ev.affiliate_url||'').trim(), cleanDescription(ev.description)]
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
    const { cat, name, location, date, time, start_time, end_time, all_day, price, contact, zipcode, affiliate_url, description, statewide_state } = req.body || {};
    if (!name?.trim() || !location?.trim() || !date) return res.status(400).json({ error: 'Name, location, and date are required.' });
    const st = (start_time||'').toString().trim();
    const et = (end_time||'').toString().trim();
    const ad = all_day ? 1 : 0;
    const eff = computeEffectiveEndAt(date, st, et, ad);
    const timeDisplay = (time?.trim()) || buildTimeDisplay(st, et, ad);
    await db.run(
      'UPDATE events SET cat=?,name=?,location=?,date=?,time=?,start_time=?,end_time=?,all_day=?,effective_end_at=?,price=?,contact=?,zipcode=?,affiliate_url=?,description=? WHERE id=?',
      [cat||'other', name.trim(), location.trim(), date, timeDisplay, st, et, ad, eff, price?.trim()||'Free', contact?.trim()||'-', (zipcode||ev.zipcode||'43764').toString().trim(), (affiliate_url||'').trim(), cleanDescription(description), req.params.id]
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
    // Audit log: only when an admin removes someone else's content (not self-deletions)
    if (req.user.is_admin && ev.added_by !== req.user.id) {
      const owner = await db.get('SELECT name, email FROM users WHERE id=?', [ev.added_by]);
      await logRemovedItem(db, {
        item_type: 'event', original_id: ev.id, item_name: ev.name,
        item_date: ev.date, item_zipcode: ev.zipcode,
        owner_user_id: ev.added_by, owner_name: owner?.name || ev.submitter_name || '', owner_email: owner?.email || ev.submitter_email || '',
        removed_by: req.user.id, removed_by_name: req.user.name,
        reason: req.body?.reason || '',
        snapshot: { cat: ev.cat, name: ev.name, location: ev.location, date: ev.date, time: ev.time, price: ev.price, contact: ev.contact, zipcode: ev.zipcode, description: ev.description }
      });
    }
    await db.run('DELETE FROM events WHERE id=?', [req.params.id]);
    res.json({ success: true, id: Number(req.params.id) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});



// ── ADMIN: Delete an advertiser (cancels their Stripe subscription if they have one) ──
app.delete('/api/admin/advertisers/:id', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [req.params.id]);
    if (!adv) return res.status(404).json({ error: 'Advertiser not found.' });
    let stripeStatus = 'no_subscription';
    if (adv.stripe_subscription_id && stripe) {
      try {
        await stripe.subscriptions.cancel(adv.stripe_subscription_id);
        stripeStatus = 'cancelled';
      } catch (e) {
        // Subscription may already be cancelled or invalid; log + continue
        console.error('Stripe cancel failed for adv ' + adv.id + ':', e.message);
        stripeStatus = 'stripe_error_but_continued';
      }
    }
    // Audit log
    await logRemovedItem(db, {
      item_type: 'advertiser', original_id: adv.id, item_name: adv.business_name || adv.name || '',
      owner_user_id: null, owner_name: adv.name || '', owner_email: adv.email || '',
      removed_by: req.user.id, removed_by_name: req.user.name,
      reason: (req.body?.reason || '') + ' [stripe: ' + stripeStatus + ']',
      snapshot: {
        business_name: adv.business_name, tagline: adv.tagline, url: adv.url, phone: adv.phone,
        tier: adv.tier, status: adv.status, stripe_subscription_id: adv.stripe_subscription_id,
        stripe_customer_id: adv.stripe_customer_id
      }
    });
    await db.run('DELETE FROM advertisers WHERE id=?', [adv.id]);
    res.json({ success: true, stripeStatus });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Manually add an advertisement (no Stripe required) ──
app.post('/api/admin/advertisers/manual', requireAdmin, async (req, res) => {
  try {
    const { business_name, tagline, url, phone, tier, zipcode, statewide_state, address } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const validTier = (tier === 'premium' || tier === 'featured') ? tier : 'basic';
    const zipClean = (zipcode || '').toString().trim();
    const stateClean = (statewide_state || '').toString().trim().toUpperCase();
    if (!zipClean && !stateClean) return res.status(400).json({ error: 'Provide a target zipcode or a statewide state code — advertisers must target a specific area.' });
    if (stateClean && stateClean.length !== 2) return res.status(400).json({ error: 'State code must be 2 letters (e.g., OH).' });
    const db = await getDb();
    // Create a placeholder email + unusable password so the advertisers row is valid
    const fakeEmail = `manual-${Date.now()}-${Math.random().toString(36).slice(2,8)}@nearandfarevents.local`;
    const unusableHash = bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 10);
    const r = await db.run(
      `INSERT INTO advertisers (name, email, password_hash, business_name, tagline, url, status, tier, phone, email_verified, zipcode, statewide_state, address)
       VALUES (?,?,?,?,?,?,'active',?,?,1,?,?,?)`,
      [(business_name||'').trim() + ' (manual)', fakeEmail, unusableHash, business_name.trim(),
       (tagline||'').trim(), (url||'').trim(), validTier, (phone||'').trim(), zipClean, stateClean, (address||'').trim()]
    );
    res.status(201).json({ success: true, id: r.lastID });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Bulk remove all content by a specific user ──
app.delete('/api/admin/users/:userId/all-content', requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (!userId) return res.status(400).json({ error: 'Invalid user ID.' });
    const reason = (req.body?.reason || '').toString().slice(0, 500);
    const db = await getDb();
    const owner = await db.get('SELECT name, email FROM users WHERE id=?', [userId]);
    if (!owner) return res.status(404).json({ error: 'User not found.' });

    // Fetch + log all their events
    const events = await db.all('SELECT * FROM events WHERE added_by=?', [userId]);
    for (const ev of events) {
      await logRemovedItem(db, {
        item_type: 'event', original_id: ev.id, item_name: ev.name,
        item_date: ev.date, item_zipcode: ev.zipcode,
        owner_user_id: userId, owner_name: owner.name, owner_email: owner.email,
        removed_by: req.user.id, removed_by_name: req.user.name,
        reason: 'Bulk removal: ' + reason,
        snapshot: { cat: ev.cat, name: ev.name, location: ev.location, date: ev.date, time: ev.time, price: ev.price, contact: ev.contact, zipcode: ev.zipcode, description: ev.description }
      });
    }

    // Fetch + log all their listings (if listings table exists)
    let listings = [];
    try { listings = await db.all('SELECT * FROM listings WHERE user_id=?', [userId]); } catch(_) {}
    for (const ls of listings) {
      await logRemovedItem(db, {
        item_type: 'listing', original_id: ls.id, item_name: ls.business_name || ls.name || '',
        item_zipcode: ls.zipcode || '',
        owner_user_id: userId, owner_name: owner.name, owner_email: owner.email,
        removed_by: req.user.id, removed_by_name: req.user.name,
        reason: 'Bulk removal: ' + reason,
        snapshot: { ...ls }
      });
    }

    // Now delete
    await db.run('DELETE FROM events WHERE added_by=?', [userId]);
    try { await db.run('DELETE FROM listings WHERE user_id=?', [userId]); } catch(_) {}

    res.json({ success: true, events_removed: events.length, listings_removed: listings.length });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Search users by name/email (for picker in bulk-remove flow) ──
app.get('/api/admin/users/search', requireAdmin, async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    if (q.length < 2) return res.json([]);
    const db = await getDb();
    const like = '%' + q + '%';
    const rows = await db.all(
      "SELECT id, name, email, phone, is_admin, is_town_crier, created_at, (SELECT COUNT(*) FROM events WHERE added_by=users.id) AS event_count FROM users WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ?) AND email != 'guest@nearandfarevents.system' ORDER BY name LIMIT 15",
      [like, like, like]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});



// ── ADMIN: Mark a calendar event as state-wide (appears in every zip of that state) ──
app.put('/api/admin/events/:id/statewide', requireAdmin, async (req, res) => {
  try {
    const { state } = req.body || {};
    const stateCode = (state || '').toString().trim().toUpperCase();
    if (stateCode && stateCode.length !== 2) return res.status(400).json({ error: 'State must be a 2-letter code (e.g., OH), or empty to clear.' });
    const db = await getDb();
    const ev = await db.get('SELECT id, name FROM events WHERE id=?', [req.params.id]);
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    await db.run('UPDATE events SET statewide_state=? WHERE id=?', [stateCode, req.params.id]);
    res.json({ success: true, statewide_state: stateCode, event_name: ev.name });
  } catch(e) { res.status(500).json({ error: e.message }); }
});


// ── ADMIN: Edit any advertiser's business info / tier / zip / state-wide ──
app.put('/api/admin/advertisers/:id', requireAdmin, async (req, res) => {
  try {
    const { business_name, tagline, url, phone, tier, zipcode, statewide_state, address } = req.body || {};
    const db = await getDb();
    const adv = await db.get('SELECT id, tier, status FROM advertisers WHERE id=?', [req.params.id]);
    if (!adv) return res.status(404).json({ error: 'Advertiser not found.' });
    // Validation
    if (business_name !== undefined && !String(business_name).trim()) return res.status(400).json({ error: 'Business name cannot be empty.' });
    const validTier = ['basic','featured','premium'].includes(tier) ? tier : adv.tier;
    const zipClean = (zipcode || '').toString().trim();
    const stateClean = (statewide_state || '').toString().trim().toUpperCase();
    if (zipClean && (zipClean.length !== 5 || !/^\d{5}$/.test(zipClean))) return res.status(400).json({ error: 'Zipcode must be 5 digits.' });
    if (stateClean && stateClean.length !== 2) return res.status(400).json({ error: 'State must be 2 letters.' });
    if (!zipClean && !stateClean) return res.status(400).json({ error: 'Target zipcode OR state-wide code is required.' });
    await db.run(
      `UPDATE advertisers SET
        business_name = COALESCE(?, business_name),
        tagline = COALESCE(?, tagline),
        url = COALESCE(?, url),
        phone = COALESCE(?, phone),
        tier = ?,
        zipcode = ?,
        statewide_state = ?,
        address = COALESCE(?, address)
       WHERE id=?`,
      [business_name, tagline, url, phone, validTier, zipClean, stateClean, address, req.params.id]
    );
    const updated = await db.get('SELECT id,business_name,tagline,url,phone,tier,status,zipcode,statewide_state,email FROM advertisers WHERE id=?', [req.params.id]);
    res.json(updated);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: List events for the state-wide picker (search by name) ──
app.get('/api/admin/events/search', requireAdmin, async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    if (q.length < 2) return res.json([]);
    const db = await getDb();
    const like = '%' + q + '%';
    const rows = await db.all(
      "SELECT id, name, date, zipcode, statewide_state, status FROM events WHERE name LIKE ? AND status IN ('approved','pending') ORDER BY date DESC LIMIT 15",
      [like]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});


// ── ADMIN: Export removed-items log to CSV ──
app.get('/api/admin/removed-items/export.csv', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT id, item_type, item_name, item_date, item_zipcode, owner_name, owner_email, removed_by_name, reason, removed_at FROM removed_items ORDER BY removed_at DESC');
    const esc = v => '"' + String(v||'').replace(/"/g,'""') + '"';
    const header = ['id','type','item_name','item_date','zipcode','owner_name','owner_email','removed_by','reason','removed_at'].map(esc).join(',');
    const lines = rows.map(r => [r.id, r.item_type, r.item_name, r.item_date, r.item_zipcode, r.owner_name, r.owner_email, r.removed_by_name, r.reason, r.removed_at].map(esc).join(','));
    const csv = '\ufeff' + header + '\n' + lines.join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="removed-items-' + new Date().toISOString().slice(0,10) + '.csv"');
    res.send(csv);
  } catch(e) { res.status(500).json({ error: e.message }); }
});



// ============================================================
// Item 25: CALENDAR SPONSORSHIPS (paid 2-week thank-you, NOT charitable)
// Framed as a sponsorship (commerce) to avoid state charitable solicitation laws.
// Built-in disclosures: not tax-deductible, 18+, non-refundable.
// ============================================================

// Display: active sponsorships for this zipcode (renders as cards in event list)
app.get('/api/display/sponsorships', async (req, res) => {
  try {
    const zip = (req.query.zipcode || '').toString().trim();
    if (!zip) return res.json([]);
    const db = await getDb();
    const rows = await db.all(
      `SELECT id, display_type, display_name, contact_url, contact_phone, tribute_text, created_at, expires_at
       FROM calendar_sponsorships
       WHERE zipcode = ? AND status = 'active' AND datetime(expires_at) > datetime('now')
       ORDER BY created_at DESC`,
      [zip]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Create Stripe checkout for a calendar sponsorship
app.post('/api/sponsorship/checkout', spamGuardSponsorship, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payment system not configured.' });
  try {
    const { zipcode, display_type, display_name, contact_url, contact_phone, tribute_text, amount_dollars, email, age_confirmed, terms_accepted } = req.body || {};
    // Validation
    if (!zipcode || !/^\d{5}$/.test(String(zipcode))) return res.status(400).json({ error: 'Valid 5-digit zipcode required.' });
    const validTypes = ['anonymous','first_name','full_name','business','tribute'];
    if (!validTypes.includes(display_type)) return res.status(400).json({ error: 'Invalid display type.' });
    const amt = parseFloat(amount_dollars);
    if (!amt || amt < 1) return res.status(400).json({ error: 'Sponsorship amount must be at least $1.' });
    if (amt > 10000) return res.status(400).json({ error: 'Maximum sponsorship is $10,000. For larger amounts, contact us directly.' });
    if (!age_confirmed || !terms_accepted) return res.status(400).json({ error: 'You must confirm you are 18+ and accept the sponsorship terms.' });
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required for receipt.' });

    // Type-specific validation
    if (display_type === 'first_name' && !display_name?.trim()) return res.status(400).json({ error: 'First name required for this display type.' });
    if (display_type === 'full_name' && !display_name?.trim()) return res.status(400).json({ error: 'Name required for this display type.' });
    if (display_type === 'business' && !display_name?.trim()) return res.status(400).json({ error: 'Business name required.' });
    if (display_type === 'business' && !contact_url?.trim() && !contact_phone?.trim()) return res.status(400).json({ error: 'For business sponsorships, please include a website OR phone number.' });
    if (display_type === 'tribute' && !tribute_text?.trim()) return res.status(400).json({ error: 'Tribute text required (e.g., "In memory of Jane Smith").' });

    const db = await getDb();
    // Insert pending row first
    const insertResult = await db.run(
      `INSERT INTO calendar_sponsorships (zipcode, display_type, display_name, contact_url, contact_phone, tribute_text, amount_cents, email, status)
       VALUES (?,?,?,?,?,?,?,?,'pending')`,
      [
        String(zipcode), display_type,
        (display_name||'').trim(),
        (contact_url||'').trim(),
        (contact_phone||'').trim(),
        (tribute_text||'').trim(),
        Math.round(amt * 100),
        email.toLowerCase().trim()
      ]
    );
    const sponsorshipId = insertResult.lastID;

    // Create Stripe Checkout session (one-time payment)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Calendar Sponsorship — Near and Far Events',
            description: `2-week public thank-you placement on calendar (zipcode ${zipcode})`
          },
          unit_amount: Math.round(amt * 100),
        },
        quantity: 1,
      }],
      success_url: `${SITE_URL}/?sponsorship_success=true`,
      cancel_url: `${SITE_URL}/?sponsorship_cancelled=true`,
      metadata: { sponsorship_id: String(sponsorshipId), zipcode: String(zipcode) },
      payment_intent_data: {
        description: `Calendar sponsorship #${sponsorshipId} — 2-week placement in zip ${zipcode}`,
      },
    });

    // Save session id on the pending row
    await db.run('UPDATE calendar_sponsorships SET stripe_session_id=? WHERE id=?', [session.id, sponsorshipId]);
    res.json({ url: session.url });
  } catch(e) { res.status(500).json({ error: e.message }); }
});




// ─── Combined pending feed for the admin approvals modal ───
app.get('/api/admin/pending', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const events   = await db.all("SELECT id, name, location, date, cat, zipcode, statewide_state, added_by FROM events WHERE status='pending' ORDER BY id DESC LIMIT 200");
    const listings = await db.all("SELECT id, name, category, zipcode, statewide_state, phone, url FROM listings WHERE status='pending' ORDER BY id DESC LIMIT 200");
    const insiders = await db.all("SELECT id, name, email, zipcode, town_crier_reason FROM users WHERE town_crier_status='pending' ORDER BY id DESC LIMIT 200");
    res.json({ events, listings, insiders });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── Get single advertiser (for edit modal) ───
app.get('/api/admin/advertisers/:id', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const ad = await db.get("SELECT * FROM advertisers WHERE id=?", [req.params.id]);
    if (!ad) return res.status(404).json({ error: 'Not found' });
    res.json(ad);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── Local Insider approve/reject ───
app.post('/api/admin/insiders/:id/approve', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run("UPDATE users SET town_crier_status='approved', is_town_crier=1 WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/admin/insiders/:id/reject', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.run("UPDATE users SET town_crier_status='rejected', is_town_crier=0 WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── Find a user's posts (for bulk remove) ───
app.get('/api/admin/user-items', requireAdmin, async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase().trim();
    if (!email) return res.json({ user:null, events:[], listings:[] });
    const db = await getDb();
    const user = await db.get("SELECT id, name, email FROM users WHERE LOWER(email)=?", [email]);
    if (!user) {
      // Still check for guest events with this email
      const events = await db.all("SELECT id, name, date FROM events WHERE LOWER(guest_email)=? OR LOWER(contact)=?", [email, email]);
      return res.json({ user:null, events, listings:[] });
    }
    const events   = await db.all("SELECT id, name, date FROM events WHERE added_by=? OR LOWER(guest_email)=?", [user.id, email]);
    const listings = await db.all("SELECT id, name FROM listings WHERE added_by=?", [user.id]);
    res.json({ user, events, listings });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── Bulk remove all of a user's posts ───
app.post('/api/admin/bulk-remove-by-user', requireAdmin, async (req, res) => {
  try {
    const { email, reason } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required' });
    const emailLower = email.toLowerCase().trim();
    const db = await getDb();
    const user = await db.get("SELECT id, name, email FROM users WHERE LOWER(email)=?", [emailLower]);
    // Get all events to remove (account events + guest events with that email)
    let events = [];
    if (user) {
      events = await db.all("SELECT id, name, date, zipcode FROM events WHERE added_by=? OR LOWER(guest_email)=?", [user.id, emailLower]);
    } else {
      events = await db.all("SELECT id, name, date, zipcode FROM events WHERE LOWER(guest_email)=? OR LOWER(contact)=?", [emailLower, emailLower]);
    }
    // Log + delete each event
    let eventsRemoved = 0;
    for (const e of events) {
      try {
        await db.run("INSERT INTO removed_items (item_type, original_id, item_name, item_date, item_zipcode, owner_user_id, owner_name, owner_email, removed_by, removed_by_name, reason) VALUES ('event',?,?,?,?,?,?,?,?,?,?)",
          [e.id, e.name, e.date, e.zipcode, user?.id||null, user?.name||'', email, req.user.id, req.user.name, (reason||'Bulk-removed by user').slice(0,500)]);
        await db.run("DELETE FROM events WHERE id=?", [e.id]);
        eventsRemoved++;
      } catch(_){}
    }
    // Same for listings
    let listingsRemoved = 0;
    if (user) {
      const listings = await db.all("SELECT id, name, zipcode FROM listings WHERE added_by=?", [user.id]);
      for (const l of listings) {
        try {
          await db.run("INSERT INTO removed_items (item_type, original_id, item_name, item_zipcode, owner_user_id, owner_name, owner_email, removed_by, removed_by_name, reason) VALUES ('listing',?,?,?,?,?,?,?,?,?)",
            [l.id, l.name, l.zipcode, user.id, user.name, email, req.user.id, req.user.name, (reason||'Bulk-removed by user').slice(0,500)]);
          await db.run("DELETE FROM listings WHERE id=?", [l.id]);
          listingsRemoved++;
        } catch(_){}
      }
    }
    res.json({ events_removed: eventsRemoved, listings_removed: listingsRemoved });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ============================================================
// ADMIN DASHBOARD — checklist tasks + live counts
// ============================================================
app.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
  // Each query wrapped — missing tables (calendar_sponsorships, admin_tasks) won't fail the whole endpoint
  async function safeCount(db, sql) { try { return (await db.get(sql)).c; } catch(_) { return 0; } }
  try {
    const db = await getDb();
    const pendingEvents      = await safeCount(db, "SELECT COUNT(*) AS c FROM events WHERE status='pending'");
    const pendingInsiders    = await safeCount(db, "SELECT COUNT(*) AS c FROM users WHERE town_crier_status='pending'");
    const pendingListings    = await safeCount(db, "SELECT COUNT(*) AS c FROM listings WHERE status='pending'");
    const activeBasic        = await safeCount(db, "SELECT COUNT(*) AS c FROM advertisers WHERE status='active' AND tier='basic'");
    const activeFeatured     = await safeCount(db, "SELECT COUNT(*) AS c FROM advertisers WHERE status='active' AND tier='featured'");
    const activePremium      = await safeCount(db, "SELECT COUNT(*) AS c FROM advertisers WHERE status='active' AND tier='premium'");
    const activeSponsorships = await safeCount(db, "SELECT COUNT(*) AS c FROM calendar_sponsorships WHERE status='active' AND datetime(expires_at)>datetime('now')");
    const recentRemovals     = await safeCount(db, "SELECT COUNT(*) AS c FROM removed_items WHERE datetime(removed_at)>datetime('now','-30 days')");
    const totalEvents        = await safeCount(db, "SELECT COUNT(*) AS c FROM events WHERE status='approved' AND date>=date('now')");
    const totalListings      = await safeCount(db, "SELECT COUNT(*) AS c FROM listings WHERE status='active'");
    const totalUsers         = await safeCount(db, "SELECT COUNT(*) AS c FROM users");

    let tasks = [];
    try { tasks = await db.all("SELECT id, category, task_key, title, instructions, priority, completed, completed_at, notes FROM admin_tasks ORDER BY category, priority, id"); }
    catch(_) { tasks = []; } // admin_tasks table may not exist yet on first deploy

    res.json({
      counts: {
        pendingEvents, pendingInsiders, pendingListings,
        activeBasic, activeFeatured, activePremium,
        activeSponsorships, recentRemovals,
        totalEvents, totalListings, totalUsers,
      },
      tasks
    });
  } catch(e) {
    console.error('Admin dashboard error:', e);
    res.status(500).json({ error: 'Dashboard error: ' + e.message });
  }
});

// Toggle a checklist task's completed state
app.post('/api/admin/tasks/:key/toggle', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const task = await db.get("SELECT id, completed FROM admin_tasks WHERE task_key=?", [req.params.key]);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    const newCompleted = task.completed ? 0 : 1;
    await db.run("UPDATE admin_tasks SET completed=?, completed_at=? WHERE id=?", [newCompleted, newCompleted ? new Date().toISOString() : '', task.id]);
    res.json({ completed: newCompleted });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update task notes
app.put('/api/admin/tasks/:key/notes', requireAdmin, async (req, res) => {
  try {
    const { notes } = req.body || {};
    const db = await getDb();
    await db.run("UPDATE admin_tasks SET notes=? WHERE task_key=?", [(notes||'').toString().slice(0,1000), req.params.key]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Bulk moderation: approve/reject multiple events at once
app.post('/api/admin/events/bulk-moderate', requireAdmin, async (req, res) => {
  try {
    const { event_ids, action, reason } = req.body || {};
    if (!Array.isArray(event_ids) || !event_ids.length) return res.status(400).json({ error: 'No event IDs provided.' });
    if (!['approve','reject'].includes(action)) return res.status(400).json({ error: 'Invalid action.' });
    const db = await getDb();
    let count = 0;
    for (const id of event_ids) {
      try {
        if (action === 'approve') {
          await db.run("UPDATE events SET status='approved' WHERE id=? AND status='pending'", [id]);
        } else {
          // Reject: log to removed_items + delete
          const ev = await db.get("SELECT id, name, date, zipcode, added_by FROM events WHERE id=? AND status='pending'", [id]);
          if (ev) {
            const owner = await db.get("SELECT name, email FROM users WHERE id=?", [ev.added_by]);
            await db.run("INSERT INTO removed_items (item_type, original_id, item_name, item_date, item_zipcode, owner_user_id, owner_name, owner_email, removed_by, removed_by_name, reason) VALUES ('event',?,?,?,?,?,?,?,?,?,?)",
              [ev.id, ev.name, ev.date, ev.zipcode, ev.added_by, owner?.name||'', owner?.email||'', req.user.id, req.user.name, (reason||'Bulk-rejected by admin').slice(0,500)]);
            await db.run("DELETE FROM events WHERE id=?", [id]);
          }
        }
        count++;
      } catch(_) {}
    }
    res.json({ count, action });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Item 17: ADMIN bulk-add free directory listings (CSV) ──
app.post('/api/admin/listings/bulk', requireAdmin, async (req, res) => {
  try {
    const { listings } = req.body || {};
    if (!Array.isArray(listings) || !listings.length) return res.status(400).json({ error: 'No listings supplied.' });
    const db = await getDb();
    let inserted = 0, errors = [];
    for (let i = 0; i < listings.length; i++) {
      const r = listings[i];
      try {
        if (!r.business_name || !r.zipcode) { errors.push(`Row ${i+1}: missing business_name or zipcode`); continue; }
        const zip = String(r.zipcode).trim();
        if (zip.length !== 5 || !/^\d{5}$/.test(zip)) { errors.push(`Row ${i+1}: invalid zipcode ${zip}`); continue; }
        await db.run(
          "INSERT INTO listings (business_name,category,phone,website,address,description,zipcode,status) VALUES (?,?,?,?,?,?,?,'active')",
          [String(r.business_name).trim(), String(r.category||'').trim(), String(r.phone||'').trim(), String(r.website||'').trim(), String(r.address||'').trim(), String(r.description||'').trim(), zip]
        );
        inserted++;
      } catch(e) { errors.push(`Row ${i+1}: ${e.message}`); }
    }
    res.json({ inserted, errors });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Set/clear statewide visibility for a listing ──
app.put('/api/admin/listings/:id/statewide', requireAdmin, async (req, res) => {
  try {
    const { state } = req.body || {};
    const stateCode = (state || '').toString().trim().toUpperCase();
    if (stateCode && stateCode.length !== 2) return res.status(400).json({ error: 'State must be a 2-letter US state code, or empty to clear.' });
    const db = await getDb();
    await db.run('UPDATE listings SET statewide_state=? WHERE id=?', [stateCode, req.params.id]);
    res.json({ success: true, statewide_state: stateCode });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: View removed items log ──
app.get('/api/admin/removed-items', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const rows = await db.all('SELECT id, item_type, original_id, item_name, item_date, item_zipcode, owner_user_id, owner_name, owner_email, removed_by, removed_by_name, reason, removed_at FROM removed_items ORDER BY removed_at DESC LIMIT ?', [limit]);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Aggregate pending counts (events + listings) for top-bar pill ──
app.get('/api/admin/pending-count', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const evs = await db.get("SELECT COUNT(*) AS n FROM events WHERE status='pending'");
    let lst = { n: 0 };
    try { lst = await db.get("SELECT COUNT(*) AS n FROM listings WHERE status='pending'"); } catch(_) {}
    res.json({ events: evs.n || 0, listings: lst.n || 0, total: (evs.n || 0) + (lst.n || 0) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── MANUAL SPONSORS (admin) ──
app.get('/api/sponsors', async (req, res) => {
  try { const db = await getDb(); res.json(await db.all('SELECT * FROM sponsors ORDER BY id')); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/sponsors', requireAdmin, async (req, res) => {
  try {
    const { name, tagline, url, zipcode, statewide_state } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: 'Name required.' });
    const zipClean = (zipcode || '').toString().trim();
    const stateClean = (statewide_state || '').toString().trim().toUpperCase();
    if (!zipClean && !stateClean) return res.status(400).json({ error: 'Target zipcode OR state-wide code (e.g., OH) is required so the sponsor shows in the right area.' });
    if (stateClean && stateClean.length !== 2) return res.status(400).json({ error: 'State code must be exactly 2 letters (e.g., OH).' });
    if (zipClean && (zipClean.length !== 5 || !/^\d{5}$/.test(zipClean))) return res.status(400).json({ error: 'Zipcode must be 5 digits.' });
    const db = await getDb();
    const r = await db.run('INSERT INTO sponsors (name,tagline,url,zipcode,statewide_state) VALUES (?,?,?,?,?)', [name.trim(), tagline||'', url||'', zipClean, stateClean]);
    res.status(201).json(await db.get('SELECT * FROM sponsors WHERE id=?', [r.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/sponsors/:id', requireAdmin, async (req, res) => {
  try {
    const { name, tagline, url, zipcode, statewide_state } = req.body || {};
    const zipClean = (zipcode || '').toString().trim();
    const stateClean = (statewide_state || '').toString().trim().toUpperCase();
    if (zipClean && (zipClean.length !== 5 || !/^\d{5}$/.test(zipClean))) return res.status(400).json({ error: 'Zipcode must be 5 digits.' });
    if (stateClean && stateClean.length !== 2) return res.status(400).json({ error: 'State code must be 2 letters.' });
    const db = await getDb();
    await db.run('UPDATE sponsors SET name=?,tagline=?,url=?,zipcode=?,statewide_state=? WHERE id=?', [name||'', tagline||'', url||'', zipClean, stateClean, req.params.id]);
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
// ── BANNER ADS (sponsor bar): basic-tier advertisers + manual sponsors, zip-filtered. ──
app.get('/api/display/sponsors', async (req, res) => {
  try {
    const zip = (req.query.zipcode || '').toString().trim();
    const state = zipToState(zip);
    const db = await getDb();
    // Manual sponsors: now zip-bound (matches advertiser behavior)
    let manual = [];
    if (zip) {
      manual = await db.all(
        'SELECT id, name, tagline, url, "manual" AS source FROM sponsors WHERE zipcode=? OR (statewide_state!=\'\' AND statewide_state=?) ORDER BY id LIMIT 2',
        [zip, state || '']
      );
    } else {
      manual = await db.all('SELECT id, name, tagline, url, "manual" AS source FROM sponsors WHERE zipcode=\'\' ORDER BY id LIMIT 2');
    }
    // Banner advertisers: must match this zip OR cover the state-wide
    let banner = [];
    if (zip) {
      banner = await db.all(
        "SELECT id, business_name AS name, tagline, url, phone, tier, 'advertiser' AS source FROM advertisers WHERE status IN ('active','approved') AND tier='basic' AND (zipcode=? OR (statewide_state!='' AND statewide_state=?)) ORDER BY id LIMIT 2",
        [zip, state || '']
      );
    } else {
      // No zip provided — only show advertisers that haven't set a zip yet (legacy) or admin manual ads
      banner = await db.all(
        "SELECT id, business_name AS name, tagline, url, phone, tier, 'advertiser' AS source FROM advertisers WHERE status IN ('active','approved') AND tier='basic' AND zipcode='' ORDER BY id LIMIT 2"
      );
    }
    res.json([...manual, ...banner]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── FEATURED DIRECTORY ADS: featured-tier advertisers, zip-filtered. ──
app.get('/api/display/featured', async (req, res) => {
  try {
    const zip = (req.query.zipcode || '').toString().trim();
    const state = zipToState(zip);
    const db = await getDb();
    let rows = [];
    if (zip) {
      rows = await db.all(
        "SELECT id, business_name AS name, tagline, url, phone, tier, 'advertiser' AS source FROM advertisers WHERE status IN ('active','approved') AND tier='featured' AND (zipcode=? OR (statewide_state!='' AND statewide_state=?)) ORDER BY id",
        [zip, state || '']
      );
    } else {
      rows = await db.all(
        "SELECT id, business_name AS name, tagline, url, phone, tier, 'advertiser' AS source FROM advertisers WHERE status IN ('active','approved') AND tier='featured' AND zipcode='' ORDER BY id"
      );
    }
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── POPUP ADS (in-event sponsored card): premium-tier advertisers, zip-filtered. ──
app.get('/api/display/popup-ads', async (req, res) => {
  try {
    const zip = (req.query.zipcode || '').toString().trim();
    const state = zipToState(zip);
    const db = await getDb();
    let popup = [];
    if (zip) {
      popup = await db.all(
        "SELECT id, business_name AS name, tagline, url, phone, tier, 'advertiser' AS source FROM advertisers WHERE status IN ('active','approved') AND tier='premium' AND (zipcode=? OR (statewide_state!='' AND statewide_state=?)) ORDER BY id",
        [zip, state || '']
      );
    } else {
      popup = await db.all(
        "SELECT id, business_name AS name, tagline, url, phone, tier, 'advertiser' AS source FROM advertisers WHERE status IN ('active','approved') AND tier='premium' AND zipcode='' ORDER BY id"
      );
    }
    res.json(popup);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADVERTISER AUTH ──
app.post('/api/advertiser/register', async (req, res) => {
  try {
    const { name, email, password, business_name, tagline, url, phone, zipcode } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password || !business_name?.trim())
      return res.status(400).json({ error: 'Name, email, password, and business name are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    const zipClean = (zipcode || '').toString().trim();
    if (!zipClean || zipClean.length !== 5) return res.status(400).json({ error: 'A 5-digit target zipcode is required so we know where to show your ad.' });
    const db = await getDb();
    if (await db.get('SELECT id FROM advertisers WHERE email=?', [email.toLowerCase()]))
      return res.status(409).json({ error: 'That email is already registered.' });
    // Enforce 5-spot limit for event popup ads
    const activeCount = (await db.get("SELECT COUNT(*) AS c FROM advertisers WHERE status='active'")).c;
    const hash = bcrypt.hashSync(password, 10);
    const r = await db.run(
      'INSERT INTO advertisers (name,email,password_hash,business_name,tagline,url,phone,zipcode) VALUES (?,?,?,?,?,?,?,?)',
      [name.trim(), email.toLowerCase(), hash, business_name.trim(), tagline?.trim()||'', url?.trim()||'', phone?.trim()||'', zipClean]
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
    const isPremium  = tier === 'premium';
    const isFeatured = tier === 'featured';
    const priceId    = isPremium ? STRIPE_PRICE_PREMIUM
                     : isFeatured ? STRIPE_PRICE_FEATURED
                     : STRIPE_PRICE_BASIC;
    if (!priceId) return res.status(503).json({ error: 'Pricing for that tier is not configured yet. Contact hello@nearandfarevents.com' });
    if (!priceId) return res.status(503).json({ error: `Price not configured for ${tier} tier.` });

    const db = await getDb();

    // Premium tier: enforce 5-spot limit
    if (isPremium) {
      const premCount = (await db.get("SELECT COUNT(*) AS c FROM advertisers WHERE status='active' AND tier='premium'")).c;
      if (premCount >= 5) return res.status(409).json({ error: 'All 5 premium ad spots are taken. Please join the waitlist.' });
    }

    // Update advertiser tier before checkout
    const finalTier = isPremium ? 'premium' : isFeatured ? 'featured' : 'basic';
    await db.run('UPDATE advertisers SET tier=? WHERE id=?', [finalTier, req.advertiser.id]);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { advertiser_id: String(req.advertiser.id), tier: finalTier },
      success_url: `${SITE_URL}/advertise?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL}/advertise?cancelled=true`,
    });
    res.json({ url: session.url });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Cancel subscription
app.post('/api/advertiser/cancel', requireAdvertiser, async (req, res) => {
  try {
    const db  = await getDb();
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [req.advertiser.id]);
    if (!adv) return res.status(404).json({ error: 'Account not found.' });
    if (adv.status === 'cancelled') return res.json({ success: true, message: 'Already cancelled.' });

    // If there's a Stripe subscription, try to cancel it (non-fatal if already gone)
    if (adv.stripe_subscription_id && stripe) {
      try {
        await stripe.subscriptions.cancel(adv.stripe_subscription_id);
      } catch (stripeErr) {
        // Subscription may already be cancelled or never finalized — log and continue
        console.warn('Stripe cancel non-fatal:', stripeErr.message);
      }
    }

    await db.run("UPDATE advertisers SET status='cancelled', stripe_subscription_id='' WHERE id=?", [req.advertiser.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Re-check Stripe to confirm if a pending payment actually completed.
// Useful if user got back from Stripe but verify-session never fired
// (e.g., expired token, closed tab, network blip).
app.post('/api/advertiser/refresh-status', requireAdvertiser, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payment system not configured.' });
  try {
    const db  = await getDb();
    const adv = await db.get('SELECT * FROM advertisers WHERE id=?', [req.advertiser.id]);
    if (!adv) return res.status(404).json({ error: 'Account not found.' });

    // If we know the customer, look for an active subscription on Stripe
    if (adv.stripe_customer_id) {
      const subs = await stripe.subscriptions.list({ customer: adv.stripe_customer_id, status: 'all', limit: 10 });
      const live = subs.data.find(s => s.status === 'active' || s.status === 'trialing');
      if (live) {
        await db.run("UPDATE advertisers SET status='active', stripe_subscription_id=? WHERE id=?", [live.id, req.advertiser.id]);
        const fresh = await db.get('SELECT * FROM advertisers WHERE id=?', [req.advertiser.id]);
        return res.json({ success: true, changed: true, advertiser: safeAdv(fresh) });
      }
    }

    // No completed payment found
    res.json({ success: true, changed: false, advertiser: safeAdv(adv) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: ADVERTISER MANAGEMENT ──
// Returns all advertisers (with stripe info so admin UI can show sub status)
app.get('/api/admin/advertisers', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT id,name,email,business_name,tagline,url,phone,tier,status,zipcode,statewide_state,address,stripe_customer_id,stripe_subscription_id,created_at FROM advertisers ORDER BY created_at DESC');
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
app.get('/help',       (_req, res) => res.sendFile(path.join(__dirname, 'public', 'help.html')));
app.get('/admin',      (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ── Footer links: shorthand routes that serve the /legal/*.html files ──
app.get('/terms',                  (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'terms.html')));
app.get('/privacy',                (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'privacy.html')));
app.get('/cookies',                (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'cookies.html')));
app.get('/dmca',                   (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'dmca.html')));
app.get('/contact',                (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'contact.html')));
app.get('/accessibility',          (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'accessibility.html')));
app.get('/community-guidelines',   (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'community-guidelines.html')));
app.get('/affiliate-disclosure',   (_req, res) => res.sendFile(path.join(__dirname, 'public', 'legal', 'affiliate-disclosure.html')));
// Email verification + password reset landing pages — served by index.html which handles the URL params client-side
app.get('/verify',         (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/reset-password', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
// Guest event verification + management landing pages
app.get('/verify-event',   (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/manage-event',   (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── LEGAL PAGES (clean URLs + the .html versions both work via static middleware) ──
const _legal = (file) => (_req, res) => {
  const fpath = path.join(__dirname, 'public', 'legal', file);
  res.sendFile(fpath, (err) => {
    if (err) {
      console.error(`Legal page not found: ${file}`, err.message);
      res.status(404).type('html').send(`
        <!DOCTYPE html><html><head><title>Legal Page Missing</title></head>
        <body style="font-family:system-ui;max-width:560px;margin:60px auto;padding:0 20px;line-height:1.5">
          <h1>Legal Page Not Found</h1>
          <p>The file <code>public/legal/${file}</code> hasn't been uploaded to the server yet.</p>
          <p>If you're the site owner: make sure the <code>public/legal/</code> folder and all 8 .html files are in your GitHub repo, then redeploy.</p>
          <p><a href="/">← Back to home</a></p>
        </body></html>
      `);
    }
  });
};
app.get('/privacy',                 _legal('privacy.html'));
app.get('/terms',                   _legal('terms.html'));
app.get('/affiliate-disclosure',    _legal('affiliate-disclosure.html'));
app.get('/cookies',                 _legal('cookies.html'));
app.get('/community-guidelines',    _legal('community-guidelines.html'));
app.get('/dmca',                    _legal('dmca.html'));
app.get('/accessibility',           _legal('accessibility.html'));
app.get('/contact',                 _legal('contact.html'));

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
  const _zipcodeParam = (req.query.zipcode || '').toString().trim();
  const _zipState = zipToState(_zipcodeParam);
  try {
    const db = await getDb();
    let isAdmin = false;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      try { const payload = jwt.verify(auth.slice(7), SECRET); isAdmin = !!payload.is_admin; } catch(_) {}
    }
    // Base query: zip-matched listings (or all if no zip provided)
    let rows = _zipcodeParam
      ? await db.all("SELECT id,business_name,category,phone,website,address,description,zipcode,statewide_state,created_at FROM listings WHERE status='active' AND zipcode=? ORDER BY business_name ASC", [_zipcodeParam])
      : await db.all("SELECT id,business_name,category,phone,website,address,description,zipcode,statewide_state,created_at FROM listings WHERE status='active' ORDER BY business_name ASC");
    // Merge in statewide listings for this zip's state (BEFORE auth filter so non-admins see them too)
    if (_zipcodeParam && _zipState) {
      try {
        const stateRows = await db.all(
          "SELECT id,business_name,category,phone,website,address,description,zipcode,statewide_state,created_at FROM listings WHERE statewide_state=? AND status='active' AND zipcode != ?",
          [_zipState, _zipcodeParam]
        );
        if (stateRows && stateRows.length) {
          // De-dupe by id (in case any overlap)
          const ids = new Set(rows.map(r => r.id));
          for (const sr of stateRows) if (!ids.has(sr.id)) rows.push(sr);
        }
      } catch(_) {}
    }
    // If statewide search active, filter to only events whose zipcode is in the searched state OR statewide_state matches
    if (statewide && zipState) {
      const rowsFiltered = rows.filter(r => {
        const eventState = zipToState(r.zipcode);
        return eventState === zipState || r.statewide_state === zipState;
      });
      rows = rowsFiltered;
    }
    if (!isAdmin) {
      const enabled = await getEnabledStates(db);
      rows = rows.filter(r => {
        const st = zipToState(r.zipcode);
        return st && enabled.includes(st);
      });
    }
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
// (statewide_state is admin-only; ignored on public submission)
app.post('/api/listings/create-free', requireAuth, async (req, res) => {
  try {
    const { business_name, category, phone, website, address, description, zipcode } = req.body || {};
    if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' });
    const db = await getDb();
    // Validate zipcode state (skip for admin)
    if (!req.user.is_admin) {
      const zipState = zipToState(zipcode);
      const enabled = await getEnabledStates(db);
      if (!zipState || !enabled.includes(zipState)) {
        return res.status(403).json({ error: `Near and Far Events isn't live in your area yet. We're rolling out state by state — currently live in: ${enabled.join(', ')}.` });
      }
    }
    const placeholderEmail = `user-${req.user.id}-${Date.now()}@nearandfarevents.local`;
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
    const placeholderEmail = `user-${req.user.id}-${Date.now()}@nearandfarevents.local`;
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
      success_url: `${process.env.SITE_URL || 'https://www.nearandfarevents.com'}/directory?listing_paid=1&session_id={CHECKOUT_SESSION_ID}&listing_id=${listing.id}`,
      cancel_url: `${process.env.SITE_URL || 'https://www.nearandfarevents.com'}/directory?listing_canceled=1`,
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
  if (!stripe || !STRIPE_PRICE_LISTING) return res.status(503).json({ error: 'Payment not configured. Contact hello@nearandfarevents.com' });
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

// Admin: get enabled states + per-state counts
app.get('/api/admin/states', requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const enabled = await getEnabledStates(db);
    // Get all distinct zipcodes that have content to compute per-state counts
    const evRows = await db.all("SELECT DISTINCT zipcode FROM events WHERE zipcode IS NOT NULL AND zipcode != ''");
    const lsRows = await db.all("SELECT DISTINCT zipcode FROM listings WHERE zipcode IS NOT NULL AND zipcode != ''");
    const userRows = await db.all("SELECT DISTINCT home_zipcode FROM users WHERE home_zipcode IS NOT NULL AND home_zipcode != ''");
    const stateStats = {};
    for (const r of evRows) {
      const st = zipToState(r.zipcode);
      if (st) { stateStats[st] = stateStats[st] || { events: 0, listings: 0, users: 0 }; stateStats[st].events++; }
    }
    for (const r of lsRows) {
      const st = zipToState(r.zipcode);
      if (st) { stateStats[st] = stateStats[st] || { events: 0, listings: 0, users: 0 }; stateStats[st].listings++; }
    }
    for (const r of userRows) {
      const st = zipToState(r.home_zipcode);
      if (st) { stateStats[st] = stateStats[st] || { events: 0, listings: 0, users: 0 }; stateStats[st].users++; }
    }
    res.json({ enabled, stateStats });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/states', requireAdmin, async (req, res) => {
  try {
    const { states } = req.body || {};
    if (!Array.isArray(states)) return res.status(400).json({ error: 'states must be an array' });
    const cleaned = states.map(s => String(s).trim().toUpperCase()).filter(s => /^[A-Z]{2}$/.test(s));
    const db = await getDb();
    const value = cleaned.join(',');
    await db.run(
      'INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
      ['enabled_states', value]
    );
    _enabledStatesCache = null; // invalidate cache
    res.json({ success: true, enabled: cleaned });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Public endpoint: which states are currently live (for user-facing error messages)
app.get('/api/enabled-states', async (req, res) => {
  try {
    const db = await getDb();
    const enabled = await getEnabledStates(db);
    res.json({ enabled });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Notifications for current user (admins: pending counts; users: new events in their zipcodes)
app.get('/api/notifications', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const u = await db.get('SELECT id,is_admin,home_zipcode,notify_zipcodes,last_seen_events FROM users WHERE id=?', [req.user.id]);
    if (!u) return res.status(404).json({ error: 'User not found.' });
    const result = { admin: !!u.is_admin, items: [], count: 0 };
    if (u.is_admin) {
      // Admin: pending events + listings + bulk submissions
      const pendingEvents = await db.all("SELECT e.id, e.name, e.date, e.zipcode, u.name AS submitter FROM events e LEFT JOIN users u ON u.id=e.added_by WHERE e.status='pending' ORDER BY e.created_at DESC LIMIT 20");
      const pendingListings = await db.all("SELECT l.id, l.business_name, l.zipcode, u.name AS submitter FROM listings l LEFT JOIN users u ON u.id=l.user_id WHERE l.status IN ('pending','pending_review') ORDER BY l.created_at DESC LIMIT 20");
      pendingEvents.forEach(e => result.items.push({ type: 'pending_event', id: e.id, title: `New event: ${e.name}`, sub: `${e.zipcode} · submitted by ${e.submitter || 'someone'}`, action: 'approvals' }));
      pendingListings.forEach(l => result.items.push({ type: 'pending_listing', id: l.id, title: `New business: ${l.business_name}`, sub: `${l.zipcode || ''} · submitted by ${l.submitter || 'someone'}`, action: 'approvals' }));
      result.count = result.items.length;
    } else {
      // Regular user: new events in subscribed zipcodes since last_seen_events
      const zips = new Set([u.home_zipcode || '43764']);
      (u.notify_zipcodes || '').split(',').map(z => z.trim()).filter(Boolean).forEach(z => zips.add(z));
      const since = u.last_seen_events || new Date(Date.now() - 7*24*60*60*1000).toISOString(); // default: last 7 days
      const placeholders = [...zips].map(() => '?').join(',');
      const newEvents = await db.all(
        `SELECT e.id, e.name, e.date, e.location, e.zipcode FROM events e WHERE e.status='approved' AND e.zipcode IN (${placeholders}) AND e.created_at > ? ORDER BY e.created_at DESC LIMIT 30`,
        [...zips, since]
      );
      newEvents.forEach(e => result.items.push({ type: 'new_event', id: e.id, title: e.name, sub: `${e.location} · ${new Date(e.date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})} · ${e.zipcode}`, action: 'event' }));
      result.count = result.items.length;
      result.zipcodes = [...zips];
    }
    res.json(result);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Mark notifications as seen (updates last_seen_events timestamp)
app.put('/api/notifications/mark-seen', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    await db.run('UPDATE users SET last_seen_events=? WHERE id=?', [new Date().toISOString(), req.user.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update notify_zipcodes (comma-separated list)
app.put('/api/notifications/zipcodes', requireAuth, async (req, res) => {
  try {
    const { zipcodes } = req.body || {};
    const cleaned = (Array.isArray(zipcodes) ? zipcodes : (zipcodes||'').split(','))
      .map(z => String(z).trim()).filter(z => /^\d{5}$/.test(z))
      .filter((z, i, arr) => arr.indexOf(z) === i)
      .join(',');
    const db = await getDb();
    await db.run('UPDATE users SET notify_zipcodes=? WHERE id=?', [cleaned, req.user.id]);
    res.json({ success: true, notify_zipcodes: cleaned });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get all distinct zipcodes with their event counts (for zipcode picker)
app.get('/api/zipcodes', async (req, res) => {
  try {
    const db = await getDb();
    let isAdmin = false;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      try { const payload = jwt.verify(auth.slice(7), SECRET); isAdmin = !!payload.is_admin; } catch(_) {}
    }
    const evRows = await db.all("SELECT zipcode, COUNT(*) as count FROM events WHERE status='approved' AND date >= date('now') GROUP BY zipcode ORDER BY count DESC");
    const lsRows = await db.all("SELECT zipcode, COUNT(*) as count FROM listings WHERE status='active' GROUP BY zipcode");
    const combined = {};
    evRows.forEach(r => { combined[r.zipcode] = { zipcode: r.zipcode, events: r.count, listings: 0 }; });
    lsRows.forEach(r => {
      if (combined[r.zipcode]) combined[r.zipcode].listings = r.count;
      else combined[r.zipcode] = { zipcode: r.zipcode, events: 0, listings: r.count };
    });
    let list = Object.values(combined);
    // Filter to only enabled states (non-admin)
    if (!isAdmin) {
      const enabled = await getEnabledStates(db);
      list = list.filter(o => {
        const st = zipToState(o.zipcode);
        return st && enabled.includes(st);
      });
    }
    res.json(list.sort((a, b) => (b.events + b.listings) - (a.events + a.listings)));
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
      email = `admin-${Date.now()}-${crypto.randomBytes(3).toString('hex')}@nearandfarevents.local`;
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
    desc += '\nFull details at https://www.nearandfarevents.com\n';
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
    ics += 'PRODID:-//NearAndFarEvents//EN\r\n';
    ics += 'CALSCALE:GREGORIAN\r\n';
    ics += 'METHOD:PUBLISH\r\n';
    ics += 'BEGIN:VEVENT\r\n';
    ics += `UID:event-${event.id}-${Date.now()}@nearandfarevents.com\r\n`;
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
    ics += `URL:https://www.nearandfarevents.com\r\n`;
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
