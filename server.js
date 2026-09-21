/**
 * Sovereign Engine: Infinite Multi-Stream Architecture + Live GitHub Blueprint Scavenger
 * Stack: Node.js, Express, SQLite, Autonomous Live-Net Intelligence & Crowd Interest Tracking
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Initialize SQLite Database (Local Sovereign Storage)
const dbPath = path.resolve(__dirname, 'sovereign_engine.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign SQLite Database.');
    }
});

// Create tables supporting an expanding media grid and live harvested blueprints from the net
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        module_name TEXT,
        status TEXT,
        message TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS media_streams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        stream_type TEXT,
        title TEXT,
        description TEXT,
        video_url TEXT,
        platform_source TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM media_streams`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO media_streams (stream_type, title, description, video_url, platform_source) VALUES 
                    ('grid', 'Anatolian Pulse: Urban & Street Beats', 'Harvested vibrant street culture and modern lifestyle highlights from active feeds.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'TikTok')`);
                db.run(`INSERT INTO media_streams (stream_type, title, description, video_url, platform_source) VALUES 
                    ('grid', 'Deep Thinking: Sovereign Philosophy & Poetry', 'Captured from YouTube cultural archives and thoughtful community discourse.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'YouTube')`);
            }
        });
    });

    // Harvested Live Blueprints from the Living Internet
    db.run(`CREATE TABLE IF NOT EXISTS harvested_blueprints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        source_origin TEXT,
        blueprint_title TEXT,
        architecture_pattern TEXT,
        integration_status TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM harvested_blueprints`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO harvested_blueprints (source_origin, blueprint_title, architecture_pattern, integration_status) VALUES 
                    ('GitHub Living Registry', 'Sovereign Core Initializer', 'Connected live to public net telemetry channels.', 'INITIALIZED')`);
            }
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS ui_mutations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        upgrade_title TEXT,
        applied_css_accent TEXT,
        status TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM ui_mutations`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO ui_mutations (upgrade_title, applied_css_accent, status) VALUES 
                    ('Shoulder-to-Shoulder Ecosystem v6.0 - Live Net Scavenger', '#38bdf8', 'ACTIVE')`);
            }
        });
    });
});

function logEvent(module, status, message) {
    try {
        const stmt = db.prepare(`INSERT INTO system_logs (module_name, status, message) VALUES (?, ?, ?)`);
        stmt.run(module, status, message);
        stmt.finalize();
    } catch (dbError) {
        console.error('⚠️ Self-healing catch: Log error ->', dbError.message);
    }
}

// 2. Autonomous Live-Net Intelligence & Real Blueprint Scavenging Loop
async function runLiveNetScavengerLoop() {
    console.log('🔄 Connecting to the living net to harvest real blueprints...');
    try {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        // Fetch real-world open source architecture repositories directly from GitHub's public API (Live Net)
        const response = await fetch('https://api.github.com/search/repositories?q=automation+architecture+language:javascript&sort=updated&per_page=5', {
            headers: { 'User-Agent': 'Anadolu-Island-Sovereign-Engine' }
        });
        
        const data = await response.json();

        if (data && data.items && data.items.length > 0) {
            // Pick a live repository found in the wild
            const repo = data.items[Math.floor(Math.random() * data.items.length)];
            
            const origin = `GitHub Live Stream (${repo.owner.login})`;
            const title = repo.name;
            const pattern = repo.description ? repo.description.substring(0, 140) : 'Live public repository harvested from open digital net.';
            
            const bStmt = db.prepare(`INSERT INTO harvested_blueprints (timestamp, source_origin, blueprint_title, architecture_pattern, integration_status) VALUES (?, ?, ?, ?, ?)`);
            bStmt.run(timestamp, origin, title, pattern, 'LIVE HARVESTED & ADAPTED');
            bStmt.finalize();

            logEvent('LiveNetScavenger', 'SUCCESS', `Successfully harvested live blueprint [${title}] from the open net.`);
        } else {
            logEvent('LiveNetScavenger', 'WARNING', 'Live net response received, but no items matched criteria.');
        }

    } catch (err) {
        logEvent('LiveNetScavenger', 'ERROR', `Live net connection error: ${err.message}`);
    }
}

// Run once on startup after 4 seconds, then every 20 minutes
setTimeout(runLiveNetScavengerLoop, 4000);
setInterval(runLiveNetScavengerLoop, 20 * 60 * 1000);

// 3. PRIVATE COMMAND CENTER
app.get('/', (req, res) => {
    db.all(`SELECT * FROM harvested_blueprints ORDER BY timestamp DESC LIMIT 5`, [], (err, blueprints) => {
        db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 5`, [], (err2, logs) => {
            db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err3, activeUi) => {
                
                const accentColor = activeUi ? activeUi.applied_css_accent : '#38bdf8';
                const uiVersion = activeUi ? activeUi.upgrade_title : 'Genesis Core Layout';

                const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Anadolu Island - Sovereign Command Center</title>
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 20px; }
                        .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                        header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; border-left: 5px solid ${accentColor}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                        h1 { margin: 0 0 5px 0; color: ${accentColor}; font-size: 22px; }
                        .status-badge { display: inline-block; background: #22c55e; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; }
                        .portal-btn { background: #38bdf8; color: #000; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; }
                        .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                        h2 { font-size: 16px; color: #fff; margin-bottom: 12px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { text-align: left; padding: 10px; border-bottom: 1px solid #262626; font-size: 13px; }
                        th { color: #94a3b8; }
                        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
                        .highlight { color: ${accentColor}; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div>
                                <h1>⚓ Anadolu Island Sovereign Command Center</h1>
                                <p>Status: <span class="status-badge">ONLINE</span> | Protocol: <span style="color: ${accentColor}; font-weight: bold;">${uiVersion}</span></p>
                            </div>
                            <div>
                                <a href="/island" target="_blank" class="portal-btn">🌐 View Public Island Portal &rarr;</a>
                            </div>
                        </header>

                        <div class="card">
                            <h2>🌐 Live Net Harvested Blueprints (Real Open-World Intelligence)</h2>
                            <table>
                                <tr><th>Source Origin</th><th>Blueprint / Project Title</th><th>Architecture & Pattern</th><th>Status</th></tr>
                                ${blueprints && blueprints.length > 0 ? blueprints.map(b => `<tr><td>${b.source_origin}</td><td><span class="highlight">${b.blueprint_title}</span></td><td>${b.architecture_pattern}</td><td>${b.integration_status}</td></tr>`).join('') : '<tr><td colspan="4" style="color: #64748b;">Connecting to living net for blueprints...</td></tr>'}
                            </table>
                        </div>

                        <div class="footer">
                            Shoulder-to-Shoulder Network &bull; Sovereign Control Room &bull; Private Dashboard
                        </div>
                    </div>
                </body>
                </html>
                `;
                res.send(html);
            });
        });
    });
});

// 4. PUBLIC ISLAND PORTAL
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM media_streams ORDER BY id DESC`, [], (err, mediaStreams) => {
        db.all(`SELECT * FROM harvested_blueprints ORDER BY id DESC LIMIT 4`, [], (err2, blueprintsList) => {
            db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err3, activeUi) => {
                
                const accentColor = activeUi ? activeUi.applied_css_accent : '#38bdf8';
                const uiVersion = activeUi ? activeUi.upgrade_title : 'Shoulder-to-Shoulder Ecosystem';

                const publicHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Anadolu Island - Living Cultural & Network Ecosystem</title>
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #09090b; color: #f4f4f5; padding: 20px; }
                        .container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                        header { background: #18181b; padding: 25px; border-radius: 20px; border: 1px solid #27272a; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border-top: 4px solid ${accentColor}; }
                        .logo-area h1 { font-size: 24px; color: #fff; margin-bottom: 4px; }
                        .logo-area p { font-size: 13px; color: #a1a1aa; }
                        .hero-banner { background: linear-gradient(135deg, #18181b, #27272a); padding: 35px; border-radius: 20px; border: 1px solid #3f3f46; text-align: center; }
                        .hero-banner h2 { font-size: 26px; color: ${accentColor}; margin-bottom: 10px; }
                        .hero-banner p { font-size: 14px; color: #d4d4d8; max-width: 750px; margin: 0 auto; line-height: 1.5; }
                        .section-title { font-size: 20px; color: #fff; margin: 10px 0 5px 0; }
                        .streams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
                        .card { background: #18181b; border-radius: 16px; border: 1px solid #27272a; overflow: hidden; display: flex; flex-direction: column; }
                        .card-header { padding: 12px 16px; background: #202024; font-size: 13px; font-weight: bold; border-bottom: 1px solid #27272a; display: flex; justify-content: space-between; color: #e4e4e7; }
                        .source-badge { background: ${accentColor}; color: #000; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; }
                        .player-box { width: 100%; height: 200px; background: #000; display: flex; align-items: center; justify-content: center; }
                        .player-box video { width: 100%; height: 100%; object-fit: cover; }
                        .card-body { padding: 18px; display: flex; flex-direction: column; gap: 8px; }
                        .title { font-size: 15px; font-weight: bold; color: #fff; }
                        .desc { font-size: 12px; color: #a1a1aa; line-height: 1.4; }
                        .footer { text-align: center; color: #71717a; font-size: 13px; padding: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div class="logo-area">
                                <h1>🌿 Anadolu Island</h1>
                                <p>Shoulder-to-Shoulder Ecosystem &bull; <span style="color: ${accentColor};">${uiVersion}</span></p>
                            </div>
                            <div>
                                <a href="/" style="background: #27272a; color: #fff; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-size: 13px; border: 1px solid #3f3f46;">🔒 Command Center</a>
                            </div>
                        </header>

                        <div class="hero-banner">
                            <h2>The Living Net & Live Blueprint Harvester</h2>
                            <p>An autonomous learning platform connected directly to the living internet, harvesting real-world architectural blueprints and open-source intelligence as it grows.</p>
                        </div>

                        <div class="section-title">⚡ Harvested Cultural & Social Streams ("That Life" Edition)</div>
                        <div class="streams-grid">
                            ${mediaStreams && mediaStreams.length > 0 ? mediaStreams.map(stream => `
                                <div class="card">
                                    <div class="card-header">
                                        <span>Live Feed</span>
                                        <span class="source-badge">${stream.platform_source || 'Sovereign'}</span>
                                    </div>
                                    <div class="player-box">
                                        <video src="${stream.video_url}" autoplay muted loop playsinline controls></video>
                                    </div>
                                    <div class="card-body">
                                        <div class="title">${stream.title}</div>
                                        <div class="desc">${stream.description}</div>
                                    </div>
                                </div>
                            `).join('') : '<div style="color: #71717a;">Agents are harvesting incoming streams...</div>'}
                        </div>

                        <div class="footer">
                            Anadolu Island &bull; Shoulder-to-Shoulder Network &bull; Public Portal
                        </div>
                    </div>
                </body>
                </html>
                `;
                res.send(publicHtml);
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Engine with Live Net Scavenger is live on port ${PORT}`);
    logEvent('SystemCore', 'BOOT', `Server successfully started on Render port ${PORT}`);
});
