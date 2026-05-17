const sqlite3  = require('sqlite3');
const { open } = require('sqlite');
const bcrypt   = require('bcryptjs');
const path     = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'calendar.db');
let _db = null;

async function getDb() {
  if (_db) return _db;
  _db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await _db.exec('PRAGMA journal_mode = WAL;');
  await _db.exec('PRAGMA foreign_keys = ON;');

  await _db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      address       TEXT DEFAULT '',
      is_admin      INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS events (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      cat        TEXT NOT NULL DEFAULT 'other',
      name       TEXT NOT NULL,
      location   TEXT NOT NULL,
      date       TEXT NOT NULL,
      time       TEXT NOT NULL DEFAULT 'TBD',
      price      TEXT NOT NULL DEFAULT 'Free',
      contact    TEXT NOT NULL DEFAULT '-',
      added_by   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sponsors (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      tagline    TEXT DEFAULT '',
      url        TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS advertisers (
      id                     INTEGER PRIMARY KEY AUTOINCREMENT,
      name                   TEXT NOT NULL,
      email                  TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash          TEXT NOT NULL,
      business_name          TEXT NOT NULL,
      tagline                TEXT DEFAULT '',
      url                    TEXT DEFAULT '',
      status                 TEXT NOT NULL DEFAULT 'pending',
      tier                   TEXT NOT NULL DEFAULT 'basic',
      phone                  TEXT DEFAULT '',
      stripe_customer_id     TEXT DEFAULT '',
      stripe_subscription_id TEXT DEFAULT '',
      created_at             TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS removed_items (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      item_type    TEXT NOT NULL,
      original_id  INTEGER NOT NULL,
      item_name    TEXT NOT NULL,
      item_date    TEXT DEFAULT '',
      item_zipcode TEXT DEFAULT '',
      owner_user_id INTEGER,
      owner_name   TEXT DEFAULT '',
      owner_email  TEXT DEFAULT '',
      removed_by   INTEGER NOT NULL,
      removed_by_name TEXT DEFAULT '',
      reason       TEXT DEFAULT '',
      snapshot     TEXT NOT NULL DEFAULT '{}',
      removed_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_removed_at ON removed_items(removed_at);
    CREATE INDEX IF NOT EXISTS idx_removed_owner ON removed_items(owner_user_id);
    CREATE INDEX IF NOT EXISTS idx_events_date    ON events(date);
    CREATE INDEX IF NOT EXISTS idx_events_cat     ON events(cat);
    CREATE INDEX IF NOT EXISTS idx_adv_status     ON advertisers(status);

    CREATE TABLE IF NOT EXISTS listings (
      id                     INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_name             TEXT NOT NULL,
      owner_email            TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash          TEXT NOT NULL,
      business_name          TEXT NOT NULL,
      category               TEXT NOT NULL DEFAULT 'other',
      phone                  TEXT DEFAULT '',
      website                TEXT DEFAULT '',
      address                TEXT DEFAULT '',
      description            TEXT DEFAULT '',
      status                 TEXT NOT NULL DEFAULT 'pending',
      stripe_customer_id     TEXT DEFAULT '',
      stripe_subscription_id TEXT DEFAULT '',
      expires_at             TEXT DEFAULT '',
      created_at             TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_listings_status   ON listings(status);
    CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
  `);

  // Migrations for existing DBs
  try { await _db.run("ALTER TABLE users ADD COLUMN address TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN phone TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN tier TEXT NOT NULL DEFAULT 'basic'"); } catch(_) {}
  // listings: link to community user (unified auth)
  try { await _db.run("ALTER TABLE listings ADD COLUMN user_id INTEGER REFERENCES users(id)"); } catch(_) {}
  try { await _db.run("CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id)"); } catch(_) {}
  // approval workflow + Town Crier (trusted submitter) status
  try { await _db.run("ALTER TABLE users ADD COLUMN is_town_crier INTEGER NOT NULL DEFAULT 0"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN status TEXT NOT NULL DEFAULT 'approved'"); } catch(_) {}
  try { await _db.run("CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)"); } catch(_) {}
  // Zipcode-based scoping + affiliate links
  try { await _db.run("ALTER TABLE events ADD COLUMN zipcode TEXT NOT NULL DEFAULT '43764'"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN affiliate_url TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE listings ADD COLUMN zipcode TEXT NOT NULL DEFAULT '43764'"); } catch(_) {}
  try { await _db.run("ALTER TABLE users ADD COLUMN home_zipcode TEXT DEFAULT '43764'"); } catch(_) {}

  // ── Phase A: Email verification + password reset + account deletion (CCPA/legal compliance) ──
  try { await _db.run("ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0"); } catch(_) {}
  try { await _db.run("ALTER TABLE users ADD COLUMN verify_token_hash TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE users ADD COLUMN verify_expires TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE users ADD COLUMN reset_token_hash TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE users ADD COLUMN reset_expires TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE users ADD COLUMN last_verify_sent_at TEXT DEFAULT ''"); } catch(_) {}
  // Mark all existing users as verified (so they don't get locked out by this migration)
  try { await _db.run("UPDATE users SET email_verified=1 WHERE email_verified=0 AND created_at < datetime('now')"); } catch(_) {}

  // Same for advertisers
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0"); } catch(_) {}
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN reset_token_hash TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN reset_expires TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("UPDATE advertisers SET email_verified=1 WHERE email_verified=0 AND created_at < datetime('now')"); } catch(_) {}

  // 24-month auto-purge of removed_items log (spec §6 retention)
  try { await _db.run("DELETE FROM removed_items WHERE removed_at < datetime('now', '-24 months')"); } catch(_) {}

  // ── Phase B: Anonymous (guest) event submission with email verification + magic edit links ──
  try { await _db.run("ALTER TABLE events ADD COLUMN description TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN start_time TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN end_time TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN all_day INTEGER NOT NULL DEFAULT 0"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN effective_end_at TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN statewide_state TEXT DEFAULT ''"); } catch(_) {}
  // Backfill: legacy events without effective_end_at — assume end of day + 4 hours
  try { await _db.run("UPDATE events SET effective_end_at = datetime(date || ' 23:59:00', '+4 hours') WHERE effective_end_at = '' OR effective_end_at IS NULL"); } catch(_) {}
  try { await _db.run("ALTER TABLE listings ADD COLUMN statewide_state TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN zipcode TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN statewide_state TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE advertisers ADD COLUMN address TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE sponsors ADD COLUMN zipcode TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE sponsors ADD COLUMN statewide_state TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN is_anonymous INTEGER NOT NULL DEFAULT 0"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN submitter_name TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN submitter_email TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN submitter_phone TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN submitter_verify_token_hash TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN submitter_manage_token_hash TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN submitter_verified_at TEXT DEFAULT ''"); } catch(_) {}
  try { await _db.run("ALTER TABLE events ADD COLUMN submitter_verify_expires TEXT DEFAULT ''"); } catch(_) {}

  // Create a sentinel "guest" user that anonymous events reference (foreign key requirement)
  // Password is unusable (random bytes); this account can't be logged into
  try {
    const guestExists = await _db.get("SELECT id FROM users WHERE email='guest@nearandfarevents.system'");
    if (!guestExists) {
      const bcrypt = require('bcryptjs');
      const unusableHash = bcrypt.hashSync(require('crypto').randomBytes(32).toString('hex'), 10);
      await _db.run(
        "INSERT INTO users (name,email,password_hash,address,email_verified,is_admin,is_town_crier) VALUES ('[Guest Submissions]','guest@nearandfarevents.system',?,'-',1,0,0)",
        [unusableHash]
      );
    }
  } catch(e) { console.error('Guest user create:', e.message); }
  try { await _db.run("CREATE INDEX IF NOT EXISTS idx_events_zipcode ON events(zipcode)"); } catch(_) {}
  try { await _db.run("CREATE INDEX IF NOT EXISTS idx_listings_zipcode ON listings(zipcode)"); } catch(_) {}
  // Site settings (admin-controlled key/value pairs)
  await _db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
  // Default: only Ohio enabled at launch (controlled rollout for legal compliance)
  try {
    const existing = await _db.get('SELECT value FROM settings WHERE key=?', ['enabled_states']);
    if (!existing) await _db.run('INSERT INTO settings (key,value) VALUES (?,?)', ['enabled_states', 'OH']);
  } catch(_) {}

  // Phone as alternate login method (email OR phone required)  try { await _db.run("ALTER TABLE users ADD COLUMN phone TEXT"); } catch(_) {}
  try { await _db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL AND phone != ''"); } catch(_) {}
  // Notifications: track when user last checked their notification feed
  try { await _db.run("ALTER TABLE users ADD COLUMN last_seen_events TEXT"); } catch(_) {}
  // Notify zipcodes: comma-separated list of zipcodes the user wants alerts for (in addition to home_zipcode)
  try { await _db.run("ALTER TABLE users ADD COLUMN notify_zipcodes TEXT DEFAULT ''"); } catch(_) {}

  const { c } = await _db.get('SELECT COUNT(*) AS c FROM users');
  if (c === 0) {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nearandfarevents.com';
    const ADMIN_PASS  = process.env.ADMIN_PASSWORD || 'admin2024!';
    const adminHash   = bcrypt.hashSync(ADMIN_PASS, 10);
    const { lastID: adminId } = await _db.run(
      "INSERT INTO users (name,email,password_hash,address,is_admin) VALUES ('Near and Far Events Admin',?,?,'',1)",
      [ADMIN_EMAIL, adminHash]
    );
    console.log('DB seeded. Admin: ' + ADMIN_EMAIL + ' / ' + ADMIN_PASS);
  }

  // Item 25: Calendar Sponsorships (paid 2-week thank-you placements, NOT charitable donations)
  await _db.run(`CREATE TABLE IF NOT EXISTS calendar_sponsorships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zipcode TEXT NOT NULL,
    display_type TEXT NOT NULL CHECK(display_type IN ('anonymous','first_name','full_name','business','tribute')),
    display_name TEXT DEFAULT '',
    contact_url TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '',
    tribute_text TEXT DEFAULT '',
    amount_cents INTEGER NOT NULL DEFAULT 0,
    stripe_payment_intent_id TEXT DEFAULT '',
    stripe_session_id TEXT DEFAULT '',
    email TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL DEFAULT (datetime('now', '+14 days'))
  )`);
  try { await _db.run("CREATE INDEX IF NOT EXISTS idx_sponsorships_zip_status_exp ON calendar_sponsorships(zipcode, status, expires_at)"); } catch(_) {}


  // Admin Dashboard — checklist tasks (legal, business, marketing, technical)
  await _db.run(`CREATE TABLE IF NOT EXISTS admin_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    task_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT DEFAULT '',
    priority INTEGER DEFAULT 5,
    completed INTEGER DEFAULT 0,
    completed_at TEXT DEFAULT '',
    notes TEXT DEFAULT ''
  )`);

  // Seed checklist tasks (idempotent — INSERT OR IGNORE so re-deploys don't duplicate)
  const _seedTasks = [
    // BUSINESS/LEGAL (priority 1 = do soon)
    ['business','ohio_llc','Form Ohio LLC (Form 610)',1,'Go to Ohio Secretary of State business filing portal. File Form 610 ($99 fee). Choose name carefully — must be available. Takes 3-7 business days. After approval, you officially exist as a legal entity.\n\nLink: https://www.sos.state.oh.us/businesses/business-filing-services/'],
    ['business','ein','Get EIN from IRS',1,'After LLC is formed, get a free EIN (federal tax ID) from IRS.gov. Takes 5 minutes online. Required for opening a business bank account.\n\nLink: https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online'],
    ['business','bank','Open business bank account',2,'Bring LLC formation docs + EIN. Most local credit unions or banks offer free business checking. Required so business income is separate from personal — protects LLC liability shield.'],
    ['business','stripe_update','Update Stripe business name after LLC',2,'In Stripe Dashboard → Settings → Account details, update legal business name from your personal name to "Near and Far Events LLC". Update bank account to business account.'],
    ['business','attorney','Hire Ohio attorney for ToS/Privacy review',3,'Even with template legal pages, have an Ohio business attorney review before serious traffic. Cost: $1500-3000 one-time. Worth it for liability protection.\n\nSearch: Ohio business attorney specializing in tech/website law.'],
    ['business','dmca','Register DMCA agent ($6 at copyright.gov)',3,'Required if you allow user-generated content (you do — events, listings). Protects you from copyright lawsuits.\n\nLink: https://dmca.copyright.gov/osp/login.html — $6 fee, valid 3 years.'],
    ['business','trademark','USPTO trademark search for "Near and Far Events"',4,'Free search at uspto.gov to ensure no conflicts. If clear, consider filing trademark ($350) once you have traction.\n\nLink: https://tmsearch.uspto.gov/search/search-information'],
    ['business','insurance','Get business insurance quote',4,'Try Hiscox, Next, or Thimble for tech/online business insurance. ~$30-50/mo for basic GL + cyber. Required by most landlords if you ever rent office space.'],

    // TECHNICAL (priority 1-2)
    ['technical','jwt_secret','Set JWT_SECRET env var in Render',1,'In Render Dashboard → Environment, set JWT_SECRET to a strong random string. Generate with: openssl rand -hex 32 (or use any secure password generator, 32+ chars). Without this, default value is vulnerable.'],
    ['technical','resend','Set up Resend API for email',1,'Sign up at resend.com (free tier). Add domain nearandfarevents.com, verify via DNS records, copy API key, add as RESEND_API_KEY env var in Render. Unlocks: confirmation emails, magic links, password resets, and the email approve/reject admin feature.'],
    ['technical','stripe_featured','Create Stripe price for Featured tier ($30/mo)',2,'In Stripe → Products → Add product: "Featured Directory — Near and Far Events", $30/mo recurring. Copy the price ID, add as STRIPE_PRICE_FEATURED env var in Render. Until done, customers see friendly error if they try to buy Featured.'],
    ['technical','backups','Set up automatic database backups',3,'Render Disks include daily snapshots. Verify they are enabled at Render Dashboard → your service → Disks. For extra safety, consider weekly sqlite3 .dump export to S3 or Backblaze B2.'],
    ['technical','analytics_id','Set real Google Analytics Measurement ID',4,'Replace G-XXXXXXXXXX placeholder in index.html with real measurement ID, or switch to Plausible ($9/mo, more privacy-friendly).'],

    // MARKETING (priority 2-3)
    ['marketing','launch_content','Write launch announcement',2,'Draft a 200-word post announcing the calendar. Post on personal Facebook, local Facebook groups (Near and Far Events for [town]), Nextdoor. Goal: 50 people see it day 1.'],
    ['marketing','first_businesses','Onboard first 10 business listings',2,'Personally reach out to 10 local businesses you know (or visit in person). Show them the directory page, offer to add them yourself in 2 minutes. Goal: directory feels populated when first visitors arrive.'],
    ['marketing','first_events','Seed first 20 events',2,'Use the CSV bulk import to add upcoming local events from sources like Eventbrite, library calendars, church bulletins, school district sites. Goal: visitors see at least 20 events on day 1.'],
    ['marketing','social','Create Facebook page',3,'Create a Facebook business page for Near and Far Events. Cross-post local events you add. Cheap and effective for community calendars.'],
    ['marketing','press','Reach out to local press',4,'Email local newspaper / radio about "free new community calendar for [town]". Local press loves community-good stories. 1-line pitch: "Free new community calendar made by [name] launches today, focused on bringing back what made small-town newspapers work."'],

    // EXPANSION (priority 4-5)
    ['expansion','enable_pa','Enable Pennsylvania (after first 100 users in OH)',5,'Once OH has steady traffic, expand. Update enabled_states in settings table to include PA. Add PA zip ranges to backend zipToState() function. Update Help page state list.'],
    ['expansion','more_zips','Expand popular zip code lists in US Map picker',5,'Edit ENABLED_STATES_INFO in index.html — add more popular zips per state based on real usage data (admin dashboard analytics will show which zips are most active).'],
  ];

  for (const [category, key, title, priority, instructions] of _seedTasks) {
    try {
      await _db.run("INSERT OR IGNORE INTO admin_tasks (category, task_key, title, priority, instructions) VALUES (?,?,?,?,?)", [category, key, title, priority, instructions]);
    } catch(_) {}
  }

  return _db;
}

module.exports = { getDb };
