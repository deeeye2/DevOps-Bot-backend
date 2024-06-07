const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Database setup
const db = new sqlite3.Database('./problems_solutions.db', (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  }
});

db.serialize(() => {
  db.run(`
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
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY,
      issue TEXT,
      category TEXT,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS solutions (
      id INTEGER PRIMARY KEY,
      problem TEXT,
      solution TEXT,
      category TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY,
      email TEXT,
      code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Helper function to send verification email
const sendVerificationEmail = (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Account Verification Code',
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Register route
app.post('/api/register', (req, res) => {
  const { username, password, name, surname, email } = req.body;
  if (password.length < 6 || !/\d/.test(password) || !/[A-Za-z]/.test(password)) {
    return res.status(400).send('Password must be at least 6 characters long and contain both letters and numbers.');
  }

  const code = crypto.randomBytes(3).toString('hex');
  db.run(
    `INSERT INTO users (username, password, name, surname, email) VALUES (?, ?, ?, ?, ?)`,
    [username, password, name, surname, email],
    function(err) {
      if (err) {
        return res.status(500).send('Error during registration. Please try again.');
      }

      db.run(
        `INSERT INTO verification_codes (email, code) VALUES (?, ?)`,
        [email, code],
        function(err) {
          if (err) {
            return res.status(500).send('Error saving verification code. Please try again.');
          }

          sendVerificationEmail(email, code);
          res.send('Registration successful! Please check your email for verification code.');
        }
      );
    }
  );
});

// Verification route
app.post('/api/verify', (req, res) => {
  const { email, code } = req.body;

  db.get(
    `SELECT * FROM verification_codes WHERE email = ? AND code = ?`,
    [email, code],
    (err, row) => {
      if (err) {
        return res.status(500).send('Error verifying code. Please try again.');
      }

      if (row) {
        db.run(
          `UPDATE users SET verified = 1 WHERE email = ?`,
          [email],
          function(err) {
            if (err) {
              return res.status(500).send('Error updating user verification status. Please try again.');
            }

            res.send('Verification successful! You can now login.');
          }
        );
      } else {
        res.status(400).send('Invalid verification code. Please try again.');
      }
    }
  );
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ? AND verified = 1`,
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).send('Error during login. Please try again.');
      }

      if (row) {
        res.send('Login successful!');
      } else {
        res.status(400).send('Invalid email or password.');
      }
    }
  );
});

// Get user data
app.get('/api/user', (req, res) => {
  const { email } = req.query;

  db.get(
    `SELECT username, name, surname, email, address, telephone, homeAddress, profilePhoto FROM users WHERE email = ?`,
    [email],
    (err, row) => {
      if (err) {
        return res.status(500).send('Error fetching user data. Please try again.');
      }

      if (row) {
        res.json(row);
      } else {
        res.status(404).send('User not found.');
      }
    }
  );
});

// Update user data
app.post('/api/user/update', upload.single('profilePhoto'), (req, res) => {
  const { address, telephone, homeAddress, email } = req.body;
  const profilePhoto = req.file ? req.file.path : null;

  db.run(
    `UPDATE users SET address = ?, telephone = ?, homeAddress = ?, profilePhoto = ? WHERE email = ?`,
    [address, telephone, homeAddress, profilePhoto, email],
    function(err) {
      if (err) {
        return res.status(500).send('Error updating user settings. Please try again.');
      }

      res.send('Settings updated successfully!');
    }
  );
});

// Submit an issue
app.post('/api/submit-issue', (req, res) => {
  const { issue, category } = req.body;

  db.run(
    `INSERT INTO issues (issue, category, user_id) VALUES (?, ?, ?)`,
    [issue, category, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).send('Error submitting issue. Please try again.');
      }

      res.send('Issue submitted successfully!');
    }
  );
});

// Get solutions
app.get('/api/solutions', (req, res) => {
  db.all(
    `SELECT * FROM solutions`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching solutions. Please try again.');
      }

      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
