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

  // ── Phase B: Anonymous (guest) event submission with email verification + magic edit links ──
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
  return _db;
}

module.exports = { getDb };
