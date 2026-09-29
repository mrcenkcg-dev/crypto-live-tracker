// ==========================================
// SOVEREIGN STUDIO CORE - RENDER OPTIMIZED
// ==========================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Persistent Studio Ledger
const dbFile = path.resolve(__dirname, 'studio_core.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Studio DB connection failed:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Studio Core Database.');
    }
});

// Initialize Studio Infrastructure Tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS studio_assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset_title TEXT,
        file_path TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// ==========================================
// ROUTES & HEALTH CHECK ENDPOINTS
// ==========================================

// Render Health Check Route
app.get('/island', (req, res) => {
    res.status(200).send('Sovereign Studio Island Node Online');
});

// Secondary Navigation Routes
app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

app.get('/sandbox', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pet-project.html'));
});

// API: Register New Studio Asset
app.post('/api/assets/register', (req, res) => {
    const { asset_title, file_path, category } = req.body;
    db.run(
        `INSERT INTO studio_assets (asset_title, file_path, category) VALUES (?, ?, ?)`,
        [asset_title || 'Untitled Asset', file_path || '/videos/local.mp4', category || 'General'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, asset_id: this.lastID, message: "Asset registered." });
            }
        }
    );
});

// API: Fetch Assets for Dashboard
app.get('/api/intelligence', (req, res) => {
    db.all(`SELECT * FROM studio_assets ORDER BY id DESC LIMIT 20`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ system: "Sovereign Studio", data: rows });
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sovereign Studio Core running on port ${PORT}`);
});
