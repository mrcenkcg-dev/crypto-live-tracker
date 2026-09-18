// server.js - Shoulder to Shoulder Digital Workshop & Open Hunter Engine
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup (The Workshop Workbench)
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the Shoulder to Shoulder workshop workbench.');
    }
});

// Initialize Open Workshop Tables
db.serialize(() => {
    // Workshop visitors/technicians table
    db.run(`CREATE TABLE IF NOT EXISTS residents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        arrived_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Raw Salvage Workbench table: Stores unfiltered artifacts brought in by the hunter
    db.run(`CREATE TABLE IF NOT EXISTS house_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT,
        room_type TEXT,
        room_url TEXT,
        description TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        // Seed initial raw artifact if workbench is completely empty
        db.get(`SELECT COUNT(*) as count FROM house_rooms`, (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`);
                stmt.run('Raw Script Artifact #101', 'Unfiltered Code', 'https://raw.githubusercontent.com/octocat/Hello-World/master/README', 'Raw text-based script artifact pulled for initial workbench inspection.');
                stmt.run('Open Source Snippet #404', 'Script Harvest', 'https://api.github.com/zen', 'Dynamic code snippet retrieved for logic analysis and repurposing.');
                stmt.finalize();
                console.log('Initial raw artifacts loaded onto the workshop workbench.');
            }
        });
    });
});

// --- THE REAL HUNTER ENGINE ---
// This background loop goes out, fetches real raw data feeds/endpoints from the wild web, 
// and brings them right onto your workbench as raw artifacts.
function runHunterEngine() {
    // We target open public developer feeds, raw repositories, and text endpoints to harvest real code artifacts
    const harvestTargets = [
        { name: 'GitHub Zen Philosophy Feed', url: 'https://api.github.com/zen', type: 'API Logic' },
        { name: 'Public Octocat README', url: 'https://raw.githubusercontent.com/octocat/Hello-World/master/README', type: 'Raw Document' },
        { name: 'Public Status Manifest', url: 'https://httpbin.org/json', type: 'JSON Structure' }
    ];

    const target = harvestTargets[Math.floor(Math.random() * harvestTargets.length)];
    const uniqueTag = Math.floor(Math.random() * 90000) + 10000;
    const artifactName = `Harvested Artifact [${uniqueTag}]`;

    // Fetch the raw data from the wild internet
    const client = target.url.startsWith('https') ? https : http;
    
    client.get(target.url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            // Clean up snippet preview for the workbench
            const snippet = data.length > 120 ? data.substring(0, 120) + '...' : data;
            const description = `Source: ${target.url} | Raw Payload: ${snippet.replace(/[\r\n]+/g, " ")}`;

            // Drop the raw artifact onto the workshop workbench
            db.run(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`,
                [artifactName, target.type, target.url, description],
                (err) => {
                    if (!err) {
                        console.log(`[Hunter Engine]: Successfully harvested raw artifact -> "${artifactName}"`);
                    }
                }
            );
        });
    }).on('error', (err) => {
        console.log('[Hunter Engine]: Scan pulse skipped (network check).');
    });
}

// Run the hunter engine automatically every 2 minutes to bring fresh raw artifacts to the workshop
setInterval(runHunterEngine, 120000);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

// API: Fetch all raw artifacts currently sitting on the workbench
app.get('/api/rooms', (req, res) => {
    db.all(`SELECT * FROM house_rooms ORDER BY added_at DESC`, (err, rooms) => {
        if (err) {
            return res.status(500).json({ error: 'Database error loading workbench items.' });
        }
        res.json(rooms);
    });
});

// Front Door Entry
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
                status: 'WORKSHOP ONLINE (OPEN HUNTER ENGINE ACTIVE)',
                total_technicians: residentRow ? residentRow.count : 0,
                workbench_artifacts: roomRow ? roomRow.room_count : 0,
                timestamp: new Date().toISOString()
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Digital Workshop running live on port ${PORT}`);
});
