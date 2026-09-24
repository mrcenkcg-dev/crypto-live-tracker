/**
 * ==============================================================================
 * SOVEREIGN MASTER ENGINE: UNIFIED MULTI-SOCIAL & MULTIMEDIA ARCHITECTURE
 * Blueprint Integration: Ingestion + Unified Timeline + Cross-Syndication Router
 * ==============================================================================
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================================================================
// 1. THE UNIFIED TIMELINE SCHEMA (Database & Persistence Engine)
// ==============================================================================
const dbFile = path.join(__dirname, 'sovereign_master.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master Timeline DB.');
        initializeMasterSchema();
    }
});

function initializeMasterSchema() {
    db.serialize(() => {
        // Core Unified Timeline Feed
        db.run(`CREATE TABLE IF NOT EXISTS sovereign_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            source_platform TEXT,
            target_platform TEXT,
            media_url TEXT,
            title TEXT,
            author TEXT,
            syndication_status TEXT
        )`);

        // Seed initial blueprint data if empty
        db.get(`SELECT COUNT(*) as count FROM sovereign_timeline`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO sovereign_timeline (source_platform, target_platform, media_url, title, author, syndication_status) VALUES 
                    ('YouTube', 'TikTok & Instagram', 'https://www.youtube.com/watch?v=sample', 'Anatolian Sufi Rock Poetry Session', 'Cenk (Sovereign Admin)', 'SYNCED & ACTIVE'),
                    ('Instagram', 'YouTube Shorts', 'https://www.instagram.com/reel/Dda_BovoYw8', 'Behind the Scenes: Building the Island Engine', 'Cenk (Sovereign Admin)', 'ROUTER LIVE')`);
            }
        });

        // Connected Social Bridges Table
        db.run(`CREATE TABLE IF NOT EXISTS island_bridges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform_name TEXT,
            channel_handle TEXT,
            endpoint_url TEXT,
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM island_bridges`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO island_bridges (platform_name, channel_handle, endpoint_url, status) VALUES 
                    ('YouTube', '@AnadoluSufiRock', 'https://www.youtube.com', 'CONNECTED'),
                    ('TikTok', '@SovereignIsland', 'https://www.tiktok.com', 'CONNECTED'),
                    ('Instagram', '@CenkSovereign', 'https://www.instagram.com', 'CONNECTED'),
                    ('Facebook', 'Get Big Together Community', 'https://www.facebook.com', 'CONNECTED')`);
            }
        });
    });
}

// ==============================================================================
// 2. THE UNIVERSAL INGESTION & NORMALIZER (API Endpoint)
// ==============================================================================
app.post('/api/island/ingest', (req, res) => {
    const { source_platform, target_platform, media_url, title, author } = req.body;
    
    // Normalizing incoming data to ensure clean record insertion
    const cleanSource = source_platform || 'Universal Web';
    const cleanTarget = target_platform || 'All Island Networks';
    const cleanUrl = media_url || '#';
    const cleanTitle = title || 'Untitled Sovereign Media';
    const cleanAuthor = author || 'Island Creator';

    db.run(
        `INSERT INTO sovereign_timeline (source_platform, target_platform, media_url, title, author, syndication_status) VALUES (?, ?, ?, ?, ?, ?)`,
        [cleanSource, cleanTarget, cleanUrl, cleanTitle, cleanAuthor, 'INGESTED & QUEUED'],
        (err) => {
            if (err) {
                console.error('Ingestion error:', err.message);
            }
            res.redirect('/island');
        }
    );
});

// ==============================================================================
// 3. THE CROSS-SYNDICATION ROUTER & CENTRAL INTERFACE (UI Hub)
// ==============================================================================
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM sovereign_timeline ORDER BY timestamp DESC`, (err, timelineRows) => {
        db.all(`SELECT * FROM island_bridges`, (err, bridgeRows) => {
            
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Sovereign Master Island - Unified Multi-Social Engine</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                    .container { max-width: 1050px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                    header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                    h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                    p { color: #94a3b8; font-size: 13px; }
                    .badge { background: #22c55e; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                    .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                    h2 { font-size: 17px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; }
                    
                    /* Form Styles */
                    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
                    .form-group { display: flex; flex-direction: column; gap: 6px; }
                    label { font-size: 12px; color: #94a3b8; font-weight: 500; }
                    input, select { width: 100%; padding: 12px; background: #18221b; border: 1px solid rgba(34, 197, 94, 0.3); color: #fff; border-radius: 10px; font-size: 13px; }
                    button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-size: 14px; margin-top: 10px; transition: 0.2s; }
                    button:hover { background: #16a34a; }

                    /* Bridges Grid */
                    .bridge-box { display: flex; gap: 12px; flex-wrap: wrap; }
                    .bridge-card { background: #18221b; border: 1px solid rgba(34, 197, 94, 0.2); padding: 12px 16px; border-radius: 12px; color: #fff; font-size: 13px; display: flex; align-items: center; gap: 8px; }

                    /* Timeline Feed */
                    .feed-list { display: flex; flex-direction: column; gap: 12px; }
                    .feed-item { background: #18221b; border: 1px solid rgba(255,255,255,0.06); padding: 16px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                    .feed-title { font-size: 15px; color: #fff; text-decoration: none; font-weight: 600; }
                    .feed-title:hover { color: #22c55e; }
                    .meta-tag { background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid rgba(34, 197, 94, 0.3); }
                    .btn-link { background: #1f2937; color: #fff; padding: 8px 14px; border-radius: 8px; font-size: 12px; text-decoration: none; border: 1px solid #374151; font-weight: bold; }
                    .btn-link:hover { background: #374151; }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <div>
                            <h1>🌴 Sovereign Master Island Engine</h1>
                            <p>Unified Multi-Platform Ingestion, Timeline Schema & Cross-Syndication Router</p>
                        </div>
                        <span class="badge">SYSTEM ONLINE</span>
                    </header>

                    <!-- Active Bridges Section -->
                    <div class="card">
                        <h2>⚡ Active Cross-Platform Bridges</h2>
                        <div class="bridge-box">
                            ${bridgeRows ? bridgeRows.map(b => `
                                <div class="bridge-card">
                                    <span>🌐 <b>${b.platform_name}:</b></span>
                                    <span style="color: #38bdf8;">${b.channel_handle}</span>
                                    <span style="color: #22c55e; font-size: 11px; margin-left:6px;">[${b.status}]</span>
                                </div>
                            `).join('') : ''}
                        </div>
                    </div>

                    <!-- Universal Ingestion Form -->
                    <div class="card">
                        <h2>📥 Universal Content Ingestion & Router</h2>
                        <form action="/api/island/ingest" method="POST">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Source Platform:</label>
                                    <select name="source_platform">
                                        <option value="YouTube">YouTube</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Sovereign Island">Sovereign Island Direct</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Target Syndication Router:</label>
                                    <select name="target_platform">
                                        <option value="All Connected Networks">All Connected Networks (YT, TikTok, IG, FB)</option>
                                        <option value="YouTube & TikTok">YouTube & TikTok Only</option>
                                        <option value="Instagram Reels">Instagram Reels Only</option>
                                        <option value="Facebook Community">Facebook Community Only</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Author / Creator Handle:</label>
                                    <input type="text" name="author" placeholder="e.g. Cenk Göktüman" required>
                                </div>
                            </div>
                            <div class="form-grid" style="margin-top: 12px;">
                                <div class="form-group" style="grid-column: span 2;">
                                    <label>Media Link / Video URL:</label>
                                    <input type="text" name="media_url" placeholder="https://www.youtube.com/watch?v=... or Instagram/TikTok link" required>
                                </div>
                                <div class="form-group">
                                    <label>Title / Caption Description:</label>
                                    <input type="text" name="title" placeholder="Enter title or poetic verse description..." required>
                                </div>
                            </div>
                            <button type="submit">Ingest, Normalize & Syndicate Across All Bridges</button>
                        </form>
                    </div>

                    <!-- Unified Timeline Feed -->
                    <div class="card">
                        <h2>🌊 Unified Island Timeline Feed</h2>
                        <div class="feed-list">
                            ${timelineRows ? timelineRows.map(row => `
                                <div class="feed-item">
                                    <div>
                                        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                                            <span class="meta-tag">${row.source_platform} &rarr; ${row.target_platform}</span>
                                            <span style="font-size: 11px; color: #94a3b8;">By: ${row.author}</span>
                                        </div>
                                        <a href="${row.media_url}" target="_blank" class="feed-title">${row.title}</a>
                                        <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Timestamp: ${row.timestamp} | Status: <span style="color:#22c55e;">${row.syndication_status}</span></p>
                                    </div>
                                    <a href="${row.media_url}" target="_blank" class="btn-link">View Media</a>
                                </div>
                            `).join('') : ''}
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `);
        });
    });
});

// Root Redirect to Island Hub
app.get('/', (req, res) => {
    res.redirect('/island');
});

// Start Master Engine
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Engine running live on port ${PORT}`);
});
