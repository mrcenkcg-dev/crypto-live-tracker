const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database for Hunter Agency
const dbPath = path.resolve(__dirname, 'hunter_agency.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the Hunter Agency database.');
        db.run(`CREATE TABLE IF NOT EXISTS blueprints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT DEFAULT 'Unclaimed',
            raw_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Root route to serve main interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Get all agency blueprints
app.get('/api/blueprints', (req, res) => {
    db.all('SELECT * FROM blueprints', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ blueprints: rows });
    });
});

// API: Intake a new blueprint
app.post('/api/blueprints', (req, res) => {
    const { title, raw_notes, status } = req.body;
    const query = `INSERT INTO blueprints (title, raw_notes, status) VALUES (?, ?, ?)`;
    
    db.run(query, [title, raw_notes, status || 'Unclaimed'], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, title, status: status || 'Unclaimed' });
    });
});

app.listen(PORT, () => {
    console.log(`Hunter Agency HQ service running on port ${PORT}`);
});
