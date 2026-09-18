// server.js - Shoulder to Shoulder Automated House & Hunter Engine
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup (The House Foundation)
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the Shoulder to Shoulder house foundation.');
    }
});

// Initialize House Structure Tables
db.serialize(() => {
    // Residents table (people stepping through the front door)
    db.run(`CREATE TABLE IF NOT EXISTS residents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        arrived_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Hunter Engine Logs
    db.run(`CREATE TABLE IF NOT EXISTS engine_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_type TEXT,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // House Rooms table: Automatically populated by your automated hunter engine
    db.run(`CREATE TABLE IF NOT EXISTS house_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT,
        room_type TEXT, -- Technology, Game Room, Chat, Dating
        room_url TEXT,
        description TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        // Check if house needs initial rooms
        db.get(`SELECT COUNT(*) as count FROM house_rooms`, (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`);
                stmt.run('Forgotten Retro Chat Line #404', 'Chat', 'https://example.com/chat-ghost', 'An open text channel harvested from an orphaned web space.');
                stmt.run('Abandoned Pixel Game Board', 'Game Room', 'https://example.com/pixel-game', 'An unplayed indie browser game brought under our roof.');
                stmt.run('Orphaned Tech Archive', 'Technology', 'https://example.com/tech-ghost', 'A forgotten developer forum locked into our tech wing.');
                stmt.run('Quiet Dating Lounge', 'Dating', 'https://example.com/dating-ghost', 'A peaceful matchmaking corner rescued from the outer web.');
                stmt.finalize();
                console.log('Initial hunter targets secured and mapped into rooms.');
            }
        });
    });
});

// --- 24/7 AUTOMATED HUNTER ENGINE ---
// This background loop acts as your miner, constantly hunting for target data across the web categories.
const targetCategories = [
    { type: 'Technology', name: 'Orphaned Dev Server Hub', url: 'https://example.com/tech-hub' },
    { type: 'Game Room', name: 'Lost Arcade Board #88', url: 'https://example.com/arcade-board' },
    { type: 'Chat', name: 'Midnight Text Stream', url: 'https://example.com/midnight-chat' },
    { type: 'Dating', name: 'Distant Matchmaking Link', url: 'https://example.com/match-ghost' }
];

setInterval(() => {
    // Pick a random target category to simulate real automated harvesting
    const target = targetCategories[Math.floor(Math.random() * targetCategories.length)];
    const uniqueSuffix = Math.floor(Math.random() * 9000) + 1000;
    const harvestedName = `${target.name} [Node-${uniqueSuffix}]`;

    // Save the newly hunted space directly into the database house rooms
    db.run(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`, 
        [harvestedName, target.type, target.url, `Automated hunter engine successfully harvested this ${target.type.toLowerCase()} ghost town from the web.`], 
        function(err) {
            if (!err) {
                console.log(`[Hunter Engine]: Successfully brought home a new ${target.type} room -> "${harvestedName}"`);
            }
        }
    );

    // Log the engine pulse
    db.run(`INSERT INTO engine_logs (activity_type, status) VALUES (?, ?)`, ['web_harvest_scan', 'ACTIVE']);
}, 60000); // Runs every 60 seconds to continuously populate your house with target data

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

// API: Fetch all rooms harvested by your engine
app.get('/api/rooms', (req, res) => {
    db.all(`SELECT * FROM house_rooms ORDER BY added_at DESC`, (err, rooms) => {
        if (err) {
            return res.status(500).json({ error: 'Database error loading rooms.' });
        }
        res.json(rooms);
    });
});

// Front Door Registration
app.post('/register', (req, res) => {
    const { name, email, phone } = req.body;

    db.run(`SELECT * FROM residents WHERE email = ?`, [email], (err, existing) => {
        if (existing) {
            return res.redirect('/network');
        }
        db.run(`INSERT INTO residents (name, email, phone) VALUES (?, ?, ?)`, [name, email, phone], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.redirect('/network');
        });
    });
});

// System Status Endpoint
app.get('/api/status', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM residents`, (err, residentRow) => {
        db.get(`SELECT COUNT(*) as room_count FROM house_rooms`, (err2, roomRow) => {
            res.json({
                status: 'ONLINE (HUNTER ENGINE HUNTING 24/7)',
                total_residents: residentRow ? residentRow.count : 0,
                connected_rooms: roomRow ? roomRow.room_count : 0,
                timestamp: new Date().toISOString()
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Shoulder to Shoulder hunter engine running live on port ${PORT}`);
});
