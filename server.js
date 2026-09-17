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

        // Recreate platform_tasks table to support Games and My Pet Wildlife Sanctuary
        db.run(`DROP TABLE IF EXISTS platform_tasks`, () => {
            db.run(`CREATE TABLE platform_tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                duration TEXT NOT NULL,
                reward TEXT NOT NULL,
                url TEXT NOT NULL
            )`, (err) => {
                if (!err) {
                    const defaultTasks = [
                        // Games Hub
                        ['Games', 'Arcade Reflex Tester', '1 Hour Session', '£1.00', 'https://orteil.dashnet.org/cookieclicker/'],
                        ['Games', 'Strategy Game QA Test', '1 Hour Session', '£1.00', 'https://tetris.com/play-tetris'],
                        ['Games', 'Color Match Speed Run', '1 Hour Session', '£1.00', 'https://orteil.dashnet.org/cookieclicker/'],
                        
                        // "My Pet" Wildlife Sanctuary Hub
                        ['My Pet', 'Adopt & Feed the Sanctuary Lion', '1 Hour Session', '£1.00', 'https://unsplash.com/s/photos/lion'],
                        ['My Pet', 'Enclosure Care: Majestic Tiger', '1 Hour Session', '£1.00', 'https://unsplash.com/s/photos/tiger'],
                        ['My Pet', 'Canopy Feeding: Gentle Giraffe', '1 Hour Session', '£1.00', 'https://unsplash.com/s/photos/giraffe'],
                        ['My Pet', 'Waterhole Patrol: Baby Elephant', '1 Hour Session', '£1.00', 'https://unsplash.com/s/photos/elephant'],
                        ['My Pet', 'Canopy Play: Cheeky Sanctuary Monkey', '1 Hour Session', '£1.00', 'https://unsplash.com/s/photos/monkey']
                    ];
                    const stmt = db.prepare(`INSERT INTO platform_tasks (category, title, duration, reward, url) VALUES (?, ?, ?, ?, ?)`);
                    defaultTasks.forEach(task => stmt.run(task));
                    stmt.finalize();
                    console.log('Default Games and "My Pet" Wildlife tasks populated successfully.');
                }
            });
        });

        // AUTOMATED BACKGROUND LOOP
        setInterval(() => {
            const channels = ['youtube', 'tiktok', 'instagram', 'facebook'];
            const randomChannel = channels[Math.floor(Math.random() * channels.length)];
            const query = `INSERT INTO monkey_logs (channel, ad_count) VALUES (?, 1)`;
            
            db.run(query, [randomChannel], (err) => {
                if (err) {
                    console.error('Background simulation error:', err.message);
                }
            });
        }, 30000);
    }
});

// API Endpoint: Register Member / Waiting Room Spot
app.post('/register-worker', (req, res) => {
    const { workerName, workerEmail, payoutMethod } = req.body;

    if (!workerName || !workerEmail) {
        return res.status(400).send('Name and Email are required.');
    }

    const query = `INSERT INTO workers (workerName, workerEmail, payoutMethod) VALUES (?, ?, ?)`;
    db.run(query, [workerName, workerEmail, payoutMethod || 'WaitingRoomMember'], function(err) {
        if (err) {
            console.error('Error saving registration', err.message);
            return res.status(500).send('Database error during registration.');
        }
        res.redirect('/?registered=true');
    });
});

// API Endpoint: Get real registration count for the counter
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

// API Endpoint: Get automated tasks and games for the second page hub
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
