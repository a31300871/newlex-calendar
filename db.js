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
  // listings table is created above if not exists

  const { c } = await _db.get('SELECT COUNT(*) AS c FROM users');
  if (c === 0) {
    const ADMIN_EMAIL = 'admin@newlexington.com';
    const ADMIN_PASS  = process.env.ADMIN_PASSWORD || 'admin2024!';
    const adminHash   = bcrypt.hashSync(ADMIN_PASS, 10);
    const { lastID: adminId } = await _db.run(
      "INSERT INTO users (name,email,password_hash,address,is_admin) VALUES ('NL Admin',?,?,'New Lexington, OH',1)",
      [ADMIN_EMAIL, adminHash]
    );
    console.log('DB seeded. Admin: ' + ADMIN_EMAIL + ' / ' + ADMIN_PASS);
  }
  return _db;
}

module.exports = { getDb };
