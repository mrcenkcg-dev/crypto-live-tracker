// server.js - Shoulder to Shoulder Digital Workshop & Patched AI Hunter Engine
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

// SQLite Database Setup (The Island Workbench)
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the Shoulder to Shoulder island workbench.');
    }
});

// Initialize Workshop Tables
db.serialize(() => {
    // Workshop technicians table
    db.run(`CREATE TABLE IF NOT EXISTS residents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        arrived_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Salvage Workbench table: Stores technical projects brought in by the hunter
    db.run(`CREATE TABLE IF NOT EXISTS house_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT,
        room_type TEXT,
        room_url TEXT,
        description TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        // Seed initial technical salvage blueprint if workbench is empty
        db.get(`SELECT COUNT(*) as count FROM house_rooms`, (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`);
                stmt.run('AI Multi-Agent Scaffold #77', 'Python Automation', 'https://github.com/topics/multi-agent', 'Harvested framework skeleton for autonomous agent coordination and pipeline routing.');
                stmt.run('Cloud API Script Blueprint #12', 'Node.js Microservice', 'https://github.com/topics/rest-api', 'Raw server-side automation logic pulled for inspection and commercialization.');
                stmt.finalize();
                console.log('Initial technical salvage blueprints loaded onto the workbench.');
            }
        });
    });
});

// --- THE PATCHED AI & AUTOMATION HUNTER ENGINE ---
// This background loop scouts open developer repositories with correct headers to harvest real code.
function runHunterEngine() {
    const aiHarvestTargets = [
        { name: 'Open-Source AI Agent Repository', url: 'https://api.github.com/search/repositories?q=topic:ai-agents', type: 'AI Architecture' },
        { name: 'Python Automation Tooling Feed', url: 'https://api.github.com/search/repositories?q=topic:automation+language:python', type: 'Python Script' },
        { name: 'Cloud API Blueprint Stream', url: 'https://api.github.com/search/repositories?q=topic:microservice', type: 'Cloud Logic' }
    ];

    const target = aiHarvestTargets[Math.floor(Math.random() * aiHarvestTargets.length)];
    const uniqueTag = Math.floor(Math.random() * 90000) + 10000;
    const projectTitle = `Salvaged AI Project [${uniqueTag}]`;

    // CRITICAL FIX: Pass the required User-Agent header so GitHub permits the request
    const options = {
        hostname: 'api.github.com',
        path: target.url.replace('https://api.github.com', ''),
        headers: {
            'User-Agent': 'Shoulder-To-Shoulder-Workshop-Agent'
        }
    };

    https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            let description = '';
            try {
                const parsed = JSON.parse(data);
                if (parsed.items && parsed.items.length > 0) {
                    const repo = parsed.items[Math.floor(Math.random() * parsed.items.length)];
                    description = `Source Repo: ${repo.full_name} | Desc: ${repo.description || 'No description'} | URL: ${repo.html_url}`;
                } else {
                    description = `Scraped GitHub API Payload successfully | Length: ${data.length} bytes`;
                }
            } catch (e) {
                description = `Raw Payload Insight: ${data.substring(0, 150).replace(/[\r\n]+/g, " ")}`;
            }

            // Drop the actual harvested project data right onto our workshop workbench
            db.run(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`,
                [projectTitle, target.type, target.url, description],
                (err) => {
                    if (!err) {
                        console.log(`[Hunter Engine]: Successfully hauled back project -> "${projectTitle}"`);
                    }
                }
            );
        });
    }).on('error', (err) => {
        console.log('[Hunter Engine]: Scan pulse skipped (network check error).');
    });
}

// Run the hunter engine automatically to continuously bring back fresh technical projects
setInterval(runHunterEngine, 120000);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

// API: Fetch all harvested AI/automation projects currently sitting on the workbench
app.get('/api/rooms', (req, res) => {
    db.all(`SELECT * FROM house_rooms ORDER BY added_at DESC`, (err, rooms) => {
        if (err) {
            return res.status(500).json({ error: 'Database error loading workbench projects.' });
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
                status: 'ISLAND WORKSHOP ONLINE (PATCHED AI HUNTER ACTIVE)',
                total_technicians: residentRow ? residentRow.count : 0,
                workbench_projects: roomRow ? roomRow.room_count : 0,
                timestamp: new Date().toISOString()
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Island Digital Workshop running live on port ${PORT}`);
});
