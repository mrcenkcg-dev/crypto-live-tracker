const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite Database
const dbFile = path.join(__dirname, 'shoulder_to_shoulder.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS mined_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_url TEXT UNIQUE,
            title TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT
        )`);
    }
});

// Basic status route
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        platform: 'Shoulder to Shoulder',
        message: 'Backend automation engine running 24/7' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
