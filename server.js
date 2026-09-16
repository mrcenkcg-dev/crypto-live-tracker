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
        
        // Create logs table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS monkey_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel TEXT NOT NULL,
            ad_count INTEGER DEFAULT 1,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create workers table for registrations
        db.run(`CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workerName TEXT NOT NULL,
            workerEmail TEXT NOT NULL,
            payoutMethod TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create tasks/games table for automated content feed on the second page
        db.run(`CREATE TABLE IF NOT EXISTS platform_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            reward TEXT NOT NULL,
            duration TEXT NOT NULL
        )`, (err) => {
            if (!err) {
                // Insert initial default tasks if table is empty
                db.get(`SELECT COUNT(*) as count FROM platform_tasks`, (err, row) => {
                    if (row && row.count === 0) {
                        const defaultTasks = [
                            ['Games', 'Test Web Game: Cyber Runner', '1 Hour Session', '£1.00'],
                            ['Games', 'Strategy Game QA Test', '1 Hour Session', '£1.00'],
                            ['Technology', 'Browser Extension Debugging', '1 Hour Session', '£1.00'],
                            ['Technology', 'Cloud Server Ping Test', '1 Hour Session', '£1.00'],
                            ['Art', 'Digital Asset Tagging & Review', '1 Hour Session', '£1.00'],
                            ['Art', 'UI Color Contrast Verification', '1 Hour Session', '£1.00']
                        ];
                        const stmt = db.prepare(`INSERT INTO platform_tasks (category, title, duration, reward) VALUES (?, ?, ?, ?)`);
                        defaultTasks.forEach(task => stmt.run(task));
                        stmt.finalize();
                        console.log('Default automated tasks populated in database.');
                    }
                });
            }
        });

        // AUTOMATED BACKGROUND LOOP: Automatically logs activity for all platforms 
        // so your live counters tick up across the entire network on their own.
        setInterval(() => {
            const channels = ['youtube', 'tiktok', 'instagram', 'facebook'];
            const randomChannel = channels[Math.floor(Math.random() * channels.length)];
            const query = `INSERT INTO monkey_logs (channel, ad_count) VALUES (?, 1)`;
            
            db.run(query, [randomChannel], (err) => {
                if (err) {
                    console.error('Background simulation error:', err.message);
                } else {
                    console.log(`Background automated traffic: Logged 1 view for ${randomChannel}`);
                }
            });
        }, 30000); // Runs every 30 seconds automatically
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

// API Endpoint: Register Worker from the form
app.post('/register-worker', (req, res) => {
    const { workerName, workerEmail, payoutMethod } = req.body;

    if (!workerName || !workerEmail) {
        return res.status(400).send('Name and Email are required.');
    }

    const query = `INSERT INTO workers (workerName, workerEmail, payoutMethod) VALUES (?, ?, ?)`;
    db.run(query, [workerName, workerEmail, payoutMethod || 'AmazonGiftCard'], function(err) {
        if (err) {
            console.error('Error saving worker', err.message);
            return res.status(500).send('Database error during registration.');
        }
        res.redirect('/?registered=true');
    });
});

// API Endpoint: Get aggregated stats for the counters
app.get('/api/stats', (req, res) => {
    const query = `SELECT channel, SUM(ad_count) as total FROM monkey_logs GROUP BY channel`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        const stats = {
            youtube: 0,
            tiktok: 0,
            facebook: 0,
            instagram: 0,
            reddit: 0
        };

        rows.forEach(row => {
            if (stats.hasOwnProperty(row.channel)) {
                stats[row.channel] = row.total;
            }
        });

        res.json(stats);
    });
});

// API Endpoint: Get automated tasks/games for the second page hub
app.get('/api/tasks', (req, res) => {
    const query = `SELECT * FROM platform_tasks`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
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
