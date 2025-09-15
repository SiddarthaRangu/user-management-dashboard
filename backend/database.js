const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "users.db";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to SQLite database.');
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            company TEXT,
            address TEXT NOT NULL
          )`);
    }
});

module.exports = db;