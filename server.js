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

// Initialize Tables for Users, Survey Responses, and Background Activity Engine
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

        console.log(`New user registered with ID: ${userId} and background loop linked.`);
        res.redirect('/?success=true');
    });
});

// Live Engine Status Endpoint
app.get('/api/status', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM users`, (err, userRow) => {
        db.get(`SELECT COUNT(*) as engine_count FROM platform_engine_logs`, (err2, engineRow) => {
            res.json({
                status: 'ONLINE',
                registered_users: userRow ? userRow.count : 0,
                engine_heartbeats: engineRow ? engineRow.engine_count : 0,
                timestamp: new Date().toISOString()
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});
