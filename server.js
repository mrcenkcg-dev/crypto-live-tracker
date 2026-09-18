const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const dbFile = path.join(__dirname, 'shoulder_to_shoulder.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create monkey_logs table for automated background simulation
        db.run(`CREATE TABLE IF NOT EXISTS monkey_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel TEXT NOT NULL,
            ad_count INTEGER DEFAULT 1,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create workers table for registrations with survey answers
        db.run(`CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workerName TEXT NOT NULL,
            workerEmail TEXT NOT NULL,
            workerPhone TEXT,
            surveyAnswers TEXT,
            payoutMethod TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create community chat messages table
        db.run(`CREATE TABLE IF NOT EXISTS community_chat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Endpoint: Register Member, Save 10-Question Survey, & Opt-in for Text Notification
app.post('/register-worker', (req, res) => {
    const { workerName, workerEmail, workerPhone, surveyAnswers } = req.body;

    if (!workerName || !workerEmail) {
        return res.status(400).send('Name and Email are required.');
    }

    const query = `INSERT INTO workers (workerName, workerEmail, workerPhone, surveyAnswers, payoutMethod) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [workerName, workerEmail, workerPhone || '', JSON.stringify(surveyAnswers || {}), 'WildlifeTester'], function(err) {
        if (err) {
            console.error('Error saving registration', err.message);
            return res.status(500).send('Database error during registration.');
        }
        res.json({ success: true, memberId: this.lastID });
    });
});

// API Endpoint: Get real registration count for the global counter
app.get('/api/stats', (req, res) => {
    const query = `SELECT COUNT(*) as totalRegistrations FROM workers`;
    db.get(query, [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            totalRegistrations: row ? row.totalRegistrations : 0
        });
    });
});

// API Endpoint: Get community chat messages
app.get('/api/chat', (req, res) => {
    const query = `SELECT * FROM community_chat ORDER BY timestamp DESC LIMIT 50`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// API Endpoint: Post a new community chat message
app.post('/api/chat', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).send('Username and message required.');
    }
    const query = `INSERT INTO community_chat (username, message) VALUES (?, ?)`;
    db.run(query, [username, message], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// Root route serves the main platform interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
