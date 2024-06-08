const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database setup
const db = new sqlite3.Database(path.resolve(__dirname, 'problems_solutions.db'), (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      name TEXT,
      surname TEXT,
      email TEXT UNIQUE,
      verified INTEGER DEFAULT 0,
      address TEXT,
      telephone TEXT,
      homeAddress TEXT,
      profilePhoto TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue TEXT,
      category TEXT,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS solutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problem TEXT,
      solution TEXT,
      category TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
