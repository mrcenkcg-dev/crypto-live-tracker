// server.js - Express Server with Core Background Engine & Database
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Initialize Tables for Users, Survey Responses, Background Engine, and Connected Spaces
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS survey_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        question_index INTEGER,
        answer TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS platform_engine_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_type TEXT,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table to store the unforgotten spaces, chat lines, games, and platforms
    db.run(`CREATE TABLE IF NOT EXISTS unforgotten_spaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        url TEXT,
        description TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        // Automatically seed sample spaces if the table is empty so the wall is instantly alive
        db.get(`SELECT COUNT(*) as count FROM unforgotten_spaces`, (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare(`INSERT INTO unforgotten_spaces (title, category, url, description) VALUES (?, ?, ?, ?)`);
                stmt.run('Forgotten Open Chat Line #404', 'Chat', '#', 'An open text channel left behind, ready for live conversation.');
                stmt.run('Unplayed Indie Pixel Game', 'Game', '#', 'A quiet browser game waiting for players to jump in.');
                stmt.run('Orphaned Photo Gallery', 'Photos', '#', 'A collection of digital memories floating in open space.');
                stmt.finalize();
                console.log('Default unforgotten spaces seeded into the network wall.');
            }
        });
    });
});

// --- CORE BACKGROUND ENGINE LOOP ---
// This continuously runs behind the scenes to keep the server active and the engine pulsing 24/7.
setInterval(() => {
    const activities = ['background_heartbeat', 'node_sync', 'client_ping', 'engine_pulse'];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    db.run(`INSERT INTO platform_engine_logs (activity_type, status) VALUES (?, ?)`, 
        [randomActivity, 'ACTIVE'], 
        (err) => {
            if (err) {
                console.error('Engine log error:', err.message);
            } else {
                console.log(`[Engine Pulse] Activity recorded: ${randomActivity}`);
            }
        }
    );
}, 30000); // Fires every 30 seconds to maintain constant server heartbeat

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to serve all connected spaces to the second page
app.get('/api/spaces', (req, res) => {
    db.all(`SELECT * FROM unforgotten_spaces ORDER BY added_at DESC`, (err, spaces) => {
        if (err) {
            return res.status(500).json({ error: 'Database error loading spaces.' });
        }
        res.json(spaces);
    });
});

// Serve the second page (The Network Wall)
app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

// Registration and Survey Endpoint
app.post('/register', (req, res) => {
    const { name, email, phone, ...surveyAnswers } = req.body;

    db.run(`INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`, [name, email, phone], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        const userId = this.lastID;

        // Save survey responses
        const stmt = db.prepare(`INSERT INTO survey_responses (user_id, question_index, answer) VALUES (?, ?, ?)`);
        Object.keys(surveyAnswers).forEach((key, index) => {
            stmt.run(userId, index + 1, surveyAnswers[key]);
        });
        stmt.finalize();

        console.log(`New user registered with ID: ${userId} and redirected to network wall.`);
        
        // Automatically send users straight to the second page network wall after registering
        res.redirect('/network');
    });
});

// Live Engine Status Endpoint
app.get('/api/status', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM users`, (err, userRow) => {
        db.get(`SELECT COUNT(*) as engine_count FROM platform_engine_logs`, (err2, engineRow) => {
            db.get(`SELECT COUNT(*) as space_count FROM unforgotten_spaces`, (err3, spaceRow) => {
                res.json({
                    status: 'ONLINE',
                    registered_users: userRow ? userRow.count : 0,
                    engine_heartbeats: engineRow ? engineRow.engine_count : 0,
                    connected_spaces: spaceRow ? spaceRow.space_count : 0,
                    timestamp: new Date().toISOString()
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});
