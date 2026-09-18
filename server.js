// server.js - Express Server with Core Background Engine & Lego Snap-In System
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup (The Magnetic Core)
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database (Magnetic Core Active).');
    }
});

// Initialize Tables for Users, Engine Logs, and Lego Snap-In Network Bricks
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS platform_engine_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_type TEXT,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // The Lego Brick Table: Stores every snapped-in platform, game, or space
    db.run(`CREATE TABLE IF NOT EXISTS lego_bricks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        url TEXT,
        description TEXT,
        snapped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        // Seed initial magnetic core bricks if empty
        db.get(`SELECT COUNT(*) as count FROM lego_bricks`, (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare(`INSERT INTO lego_bricks (title, category, url, description) VALUES (?, ?, ?, ?)`);
                stmt.run('Forgotten Open Chat Line #404', 'Chat', '#', 'An empty text channel snapped into the magnetic grid.');
                stmt.run('Unplayed Indie Pixel Game', 'Game', '#', 'A lonely browser game powered on by the core engine.');
                stmt.run('Orphaned Photo Gallery', 'Photos', '#', 'A collection of digital memories locked into the wall.');
                stmt.finalize();
                console.log('Initial Lego bricks snapped into the network.');
            }
        });
    });
});

// --- CORE 24/7 BACKGROUND ENGINE PULSE ---
setInterval(() => {
    const activities = ['magnetic_pulse', 'brick_sync', 'core_heartbeat', 'grid_power'];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    db.run(`INSERT INTO platform_engine_logs (activity_type, status) VALUES (?, ?)`, 
        [randomActivity, 'ACTIVE'], 
        (err) => {
            if (err) {
                console.error('Engine log error:', err.message);
            } else {
                console.log(`[Magnetic Core] Pulse recorded: ${randomActivity}`);
            }
        }
    );
}, 30000); // Fires every 30 seconds to keep the power bank alive

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the Network Wall (Second Page)
app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

// API: Get all snapped-in Lego bricks for the wall
app.get('/api/bricks', (req, res) => {
    db.all(`SELECT * FROM lego_bricks ORDER BY snapped_at DESC`, (err, bricks) => {
        if (err) {
            return res.status(500).json({ error: 'Database error loading Lego bricks.' });
        }
        res.json(bricks);
    });
});

// API: The Lego Snap-In Portal (Allows you or any external platform to snap a new brick into the wall instantly)
app.post('/api/snap-in', (req, res) => {
    const { title, category, url, description } = req.body;

    if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required to snap a brick into the network.' });
    }

    db.run(`INSERT INTO lego_bricks (title, category, url, description) VALUES (?, ?, ?, ?)`, 
        [title, category || 'Platform', url, description || 'A new empty platform snapped into the shoulder-to-shoulder grid.'], 
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(`[Lego Snap-In] New brick added successfully with ID: ${this.lastID}`);
            res.json({ success: true, brickId: this.lastID, message: 'New platform successfully snapped into the network wall!' });
        }
    );
});

// Registration Endpoint -> Redirects to the Magnetic Wall
app.post('/register', (req, res) => {
    const { name, email, phone } = req.body;

    db.run(`INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`, [name, email, phone], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log(`New user registered with ID: ${this.lastID} and connected to the grid.`);
        res.redirect('/network');
    });
});

// System Status Endpoint
app.get('/api/status', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM users`, (err, userRow) => {
        db.get(`SELECT COUNT(*) as brick_count FROM lego_bricks`, (err2, brickRow) => {
            res.json({
                status: 'ONLINE (MAGNETIC CORE ACTIVE)',
                registered_users: userRow ? userRow.count : 0,
                connected_lego_bricks: brickRow ? brickRow.brick_count : 0,
                timestamp: new Date().toISOString()
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Shoulder to Shoulder server running live on port ${PORT}`);
});
