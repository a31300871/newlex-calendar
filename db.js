const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'calendar.db');
let _db = null;

async function getDb() {
  if (_db) return _db;
  _db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await _db.exec('PRAGMA journal_mode = WAL;');
  await _db.exec('PRAGMA foreign_keys = ON;');
  await _db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      address TEXT DEFAULT '',
      is_admin INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat TEXT NOT NULL DEFAULT 'other',
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL DEFAULT 'TBD',
      price TEXT NOT NULL DEFAULT 'Free',
      contact TEXT NOT NULL DEFAULT '-',
      added_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sponsors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tagline TEXT,
      url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    CREATE INDEX IF NOT EXISTS idx_events_cat  ON events(cat);
  `);

  // Migration: add address column if upgrading from older DB
  try { await _db.run("ALTER TABLE users ADD COLUMN address TEXT DEFAULT ''"); } catch(_) {}

  const { c } = await _db.get('SELECT COUNT(*) AS c FROM users');
  if (c === 0) {
    const ADMIN_EMAIL = 'admin@newlexington.com';
    const ADMIN_PASS  = process.env.ADMIN_PASSWORD || 'admin2024!';
    const adminHash   = bcrypt.hashSync(ADMIN_PASS, 10);
    const { lastID: adminId } = await _db.run(
      "INSERT INTO users (name, email, password_hash, address, is_admin) VALUES ('NL Admin', ?, ?, 'New Lexington, OH', 1)",
      [ADMIN_EMAIL, adminHash]
    );
    const seedEvents = [
      ['sports','Panthers Varsity Football vs. Caldwell','NL Stadium, 101 Panther Dr','2026-09-04','7:00 PM','Free','(740) 342-4174'],
      ['fair','Perry County Fair','Perry Co. Fairgrounds, New Lexington','2026-08-10','All Day (Mon-Sat)','$8 / day','(740) 342-4011'],
      ['arts','MacGahan Heritage Festival & Memorial','McDougal Park, N. Main St','2026-06-14','10:00 AM - 4:00 PM','Free','village@newlexingtonohio.gov'],
      ['government','Village Council Regular Meeting','Village Hall, 215 S. Main St','2026-05-12','6:00 PM','Free - Public Welcome','(740) 342-1633'],
      ['church','First Baptist Potluck & Fellowship Dinner','First Baptist Church, 400 Lincoln Ave','2026-05-18','5:30 PM','Free - Bring a Dish','(740) 342-2020'],
      ['community','Red Cross Community Blood Drive','Perry Co. District Library, 117 S. Main St','2026-05-15','9:00 AM - 2:00 PM','Free','1-800-RED-CROSS'],
      ['sports','Panthers Girls Track & Field Invitational','NL Track, Panther Dr','2026-05-16','9:00 AM','$3','(740) 342-4174'],
      ['other','Community Memorial: John A. Thomas','New Lexington Cemetery, Swigart St','2026-05-20','11:00 AM','Free','Haning Funeral Home (740) 342-2424'],
      ['food','Perry County Farmers Market','Downtown New Lexington - Main St','2026-05-16','8:00 AM - Noon','Free Entry','perrycountyfarm@gmail.com'],
      ['government','Perry County Commissioner Meeting','Perry Co. Courthouse, 121 W. Brown St','2026-05-13','9:30 AM','Free - Open to Public','(740) 342-1995'],
      ['church',"St. Mary's Annual Church Bazaar","St. Mary's Catholic Church, 218 N. Main St",'2026-07-12','10:00 AM - 5:00 PM','Free Admission','(740) 342-3223'],
      ['community','New Lexington National Night Out','City Park, New Lexington','2026-08-04','6:00 PM - 9:00 PM','Free','(740) 342-1633'],
      ['sports','NL Panthers JV Football Scrimmage','NL Stadium, 101 Panther Dr','2026-08-21','6:00 PM','Free','(740) 342-4174'],
    ];
    for (const e of seedEvents) {
      await _db.run('INSERT INTO events (cat,name,location,date,time,price,contact,added_by) VALUES (?,?,?,?,?,?,?,?)', [...e, adminId]);
    }
    const seedSponsors = [
      ['Your Business Name Here','Reach thousands of New Lexington residents — advertise today!',''],
      ['Perry County Local Business','Supporting our community one event at a time.',''],
      ['Advertise Your Business','Contact (740) 343-3326 to claim this spot.',''],
    ];
    for (const s of seedSponsors) {
      await _db.run('INSERT INTO sponsors (name,tagline,url) VALUES (?,?,?)', s);
    }
    console.log('Database seeded. Admin: ' + ADMIN_EMAIL + ' / ' + ADMIN_PASS);
  }
  return _db;
}

module.exports = { getDb };
