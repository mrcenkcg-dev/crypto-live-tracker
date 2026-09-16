const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const dbFile = path.join(__dirname, 'shoulder_to_shoulder.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create logs table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS monkey_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel TEXT NOT NULL,
            ad_count INTEGER DEFAULT 1,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Endpoint: Log new activity from automation
app.post('/api/log', (req, res) => {
    const { channel, ad_count } = req.body;
    
    if (!channel) {
        return res.status(400).json({ error: 'Channel is required' });
    }

    const count = ad_count || 1;
    const query = `INSERT INTO monkey_logs (channel, ad_count) VALUES (?, ?)`;
    
    db.run(query, [channel, count], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: this.lastID, channel, ad_count: count });
    });
});

// API Endpoint: Get aggregated stats for the counters
app.get('/api/stats', (req, res) => {
    const query = `SELECT channel, SUM(ad_count) as total FROM monkey_logs GROUP BY channel`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Default stats object
        const stats = {
            youtube: 0,
            tiktok: 0,
            facebook: 0,
            instagram: 0,
            reddit: 0
        };

        // Populate with database totals
        rows.forEach(row => {
            if (stats.hasOwnProperty(row.channel)) {
                stats[row.channel] = row.total;
            }
        });

        res.json(stats);
    });
});

// Root route serves the main platform interface from the public folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
