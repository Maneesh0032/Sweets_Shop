const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './database/sweet_shop.db';
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('📦 Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

/**
 * Initialize database tables
 */
const initialize = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          isAdmin INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Sweets table
      db.run(`
        CREATE TABLE IF NOT EXISTS sweets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price REAL NOT NULL,
          quantity INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Seed initial data
      db.all('SELECT COUNT(*) as count FROM users', (err, rows) => {
        if (rows[0].count === 0) {
          const bcrypt = require('bcryptjs');
          const adminPassword = bcrypt.hashSync('admin', 10);
          const userPassword = bcrypt.hashSync('user123', 10);

          db.run(
            'INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)',
            ['admin@gmail.com', adminPassword, 1],
            (err) => {
              if (err) console.error('Error inserting admin:', err);
            }
          );

          db.run(
            'INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)',
            ['user@gmail.com', userPassword, 0],
            (err) => {
              if (err) console.error('Error inserting user:', err);
            }
          );

          // Seed sweets
          const sweets = [
            ['Gummy Bears', 'Gummies', 2.99, 50,1],
            ['Dark Chocolate', 'Chocolate', 5.99, 30,2],
            ['Lollipops', 'Candy', 1.49, 100,3],
            ['Licorice Strips', 'Licorice', 3.49, 25,4],
            ['Jelly Beans', 'Gummies', 2.49, 60,5],
            ['Mint Candies', 'Candy', 1.99, 80,6],
          ];

          sweets.forEach(sweet => {
            db.run(
              'INSERT INTO sweets (name, category, price, quantity,id) VALUES (?, ?, ?, ?,?)',
              sweet,
              (err) => {
                if (err) console.error('Error inserting sweet:', err);
              }
            );
          });
        }
      });

      db.all('SELECT 1', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

/**
 * Run a query (INSERT, UPDATE, DELETE)
 */
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

/**
 * Get single row
 */
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

/**
 * Get all rows
 */
const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

/**
 * Close database connection
 */
const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
        reject(err);
      } else {
        console.log('📭 Database closed');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  initialize,
  run,
  get,
  all,
  close,
};