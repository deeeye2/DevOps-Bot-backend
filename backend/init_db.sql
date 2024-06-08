CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
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
);

CREATE TABLE IF NOT EXISTS issues (
  id INTEGER PRIMARY KEY,
  issue TEXT,
  category TEXT,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS solutions (
  id INTEGER PRIMARY KEY,
  problem TEXT,
  solution TEXT,
  category TEXT
);

CREATE TABLE IF NOT EXISTS verification_codes (
  id INTEGER PRIMARY KEY,
  email TEXT,
  code TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
