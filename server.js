// ==========================================
// SOVEREIGN STUDIO CORE - PLATFORM FRAMEWORK
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
    // Tracks active studio modules and workers
    db.run(`CREATE TABLE IF NOT EXISTS studio_modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_name TEXT UNIQUE,
        status TEXT,
        last_ping DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Logs assets/videos created and managed by the studio
    db.run(`CREATE TABLE IF NOT EXISTS studio_assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset_title TEXT,
        file_path TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// ==========================================
// STUDIO CONTROL PANEL UI
// ==========================================

app.get('/', (req, res) => {
    db.all(`SELECT * FROM studio_assets ORDER BY id DESC LIMIT 20`, (err, assets) => {
        let assetRows = '';
        if (!err && assets) {
            assets.forEach(a => {
                assetRows += `
                    <tr>
                        <td><b>${a.asset_title}</b></td>
                        <td style="color: #38bdf8;">${a.file_path}</td>
                        <td><span class="badge">${a.category}</span></td>
                        <td>${a.created_at}</td>
                    </tr>
                `;
            });
        }

        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Sovereign Studio Core // Control Center</title>
                    <style>
                        body { background: #0f172a; color: #f8fafc; font-family: monospace; margin: 0; padding: 30px; }
                        .header { border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 30px; }
                        h1 { color: #38bdf8; margin: 0 0 10px 0; font-size: 24px; }
                        .card { background: #1e293b; border: 1px solid #334155; padding: 25px; border-radius: 8px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #334155; font-size: 13px; }
                        th { color: #94a3b8; text-transform: uppercase; }
                        .badge { background: #0369a1; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🎬 Sovereign Studio: Control Center</h1>
                        <div>Platform Infrastructure: Online | Local SQLite Ledger Active</div>
                    </div>
                    <div class="card">
                        <h3>📁 Managed Studio Assets & Outputs</h3>
                        <table>
                            <thead>
                               <tr>
                                   <th>Asset Title</th>
                                   <th>File Path / Endpoint</th>
                                   <th>Category</th>
                                   <th>Timestamp</th>
                               </tr>
                            </thead>
                            <tbody>
                                ${assetRows || '<tr><td colspan="4">No studio assets registered yet. Plug in your worker scripts.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        `);
    });
});

// ==========================================
// API ENDPOINTS FOR EXTERNAL WORKERS & SCRIPTS
// ==========================================

// Register or log a newly built asset (your custom scripts can POST here)
app.post('/api/assets/register', (req, res) => {
    const { asset_title, file_path, category } = req.body;
    
    db.run(
        `INSERT INTO studio_assets (asset_title, file_path, category) VALUES (?, ?, ?)`,
        [asset_title || 'Untitled Asset', file_path || '/videos/local.mp4', category || 'General'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, asset_id: this.lastID, message: "Asset registered to studio core." });
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Studio Core running on port ${PORT}`);
});
