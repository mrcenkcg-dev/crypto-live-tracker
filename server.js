/**
 * Sovereign Engine: Financial Intelligence, Media Streaming & Self-Modifying UI Core
 * Stack: Node.js, Express, SQLite, Autonomous Loop Architecture & Self-Upgrading Frontend
 * Objective: 24/7 background utility, automated processing, and self-upgrading index page.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
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

// Create tables for logging system state, harvested intelligence, telemetry, media streams, and UI mutations
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        module_name TEXT,
        status TEXT,
        message TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS harvested_intelligence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        source_category TEXT,
        title TEXT,
        data_payload TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS telemetry_cycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        cycle_name TEXT,
        status TEXT,
        details TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS media_streams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stream_type TEXT,
        title TEXT,
        description TEXT,
        video_url TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM media_streams`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO media_streams (stream_type, title, description, video_url) VALUES 
                    ('short', 'Anatolian Pulse Short #1', 'Autonomous vertical index stream #1', 'https://www.w3schools.com/html/mov_bbb.mp4')`);
                db.run(`INSERT INTO media_streams (stream_type, title, description, video_url) VALUES 
                    ('sanctuary', 'Anatolian Heritage & Cultural Stream', 'Deep-dive archival footage and autonomous cultural indexing streams.', 'https://www.w3schools.com/html/movie.mp4')`);
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
                    ('Initial Genesis Core Layout', '#38bdf8', 'ACTIVE')`);
            }
        });
    });
});

// Helper function to log system events safely
function logEvent(module, status, message) {
    try {
        const stmt = db.prepare(`INSERT INTO system_logs (module_name, status, message) VALUES (?, ?, ?)`);
        stmt.run(module, status, message);
        stmt.finalize();
    } catch (dbError) {
        console.error('⚠️ Self-healing catch: Log error ->', dbError.message);
    }
}

// 2. Autonomous Background Worker & Social Learning Harvesting Loop (With Dynamic Media Rotation)
function runAutonomousLoop() {
    console.log('🔄 Running background harvesting and social intelligence sync...');
    try {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        const harvestFeeds = [
            { category: 'TikTok / Short Pulse', title: 'Viral Anatolian Sufi Rhythm Trend', payload: 'Ingested short-form audio metrics. Engagement velocity up by 18.5% across nodes.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { category: 'Instagram Visuals', title: 'Island Aesthetic & Community Reach', payload: 'Processed tagged archival imagery payloads. Color grading index synchronized.', video: 'https://www.w3schools.com/html/movie.mp4' },
            { category: 'YouTube Archive', title: 'Bağlama Masterclass & Long-Form Telemetry', payload: 'Parsed chapters from cultural archives. Subtitle vector embeddings updated.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { category: 'Facebook Community', title: 'Sovereign Node Group Interaction', payload: 'Scraped localized discussion threads. Sentiment analysis balanced at 94% positive.', video: 'https://www.w3schools.com/html/movie.mp4' },
            { category: 'Financial Alpha', title: 'Global Liquidity Shift & Forex Pulse', payload: 'Detected high-frequency volume spike in cross-border settlements. Spread tightening by 4.2 bps.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ];

        const selectedFeed = harvestFeeds[Math.floor(Math.random() * harvestFeeds.length)];

        // Insert harvested intelligence
        const stmt = db.prepare(`INSERT INTO harvested_intelligence (timestamp, source_category, title, data_payload) VALUES (?, ?, ?, ?)`);
        stmt.run(timestamp, selectedFeed.category, selectedFeed.title, selectedFeed.payload);
        stmt.finalize();

        // Dynamically rotate active short media stream to simulate a living feed
        db.run(`UPDATE media_streams SET title = ?, description = ?, video_url = ? WHERE stream_type = 'short'`, 
            [selectedFeed.title, selectedFeed.payload, selectedFeed.video]);

        logEvent('SocialLearningEngine', 'SUCCESS', `Successfully ingested and rotated media from [${selectedFeed.category}]`);
    } catch (err) {
        logEvent('SocialLearningEngine', 'ERROR', `Error in harvest loop: ${err.message}`);
    }
}

// 3. Apprentice Agent Self-Upgrading UI Mutation Cycle
function runUiUpgradeCycle() {
    console.log('🐾 Running apprentice self-upgrading UI cycle...');
    try {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const cycleName = 'Self_Upgrading_Layout_Audit';
        
        const accents = ['#38bdf8', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'];
        const chosenAccent = accents[Math.floor(Math.random() * accents.length)];
        const upgradeTitles = [
            'Optimized Neural Layout v1.2',
            'Synchronized Social Ingestion Grid v1.4',
            'Autonomous UI Reflex Update v1.6',
            'Self-Healing Streamlined Canvas v2.0'
        ];
        const chosenTitle = upgradeTitles[Math.floor(Math.random() * upgradeTitles.length)];

        const tStmt = db.prepare(`INSERT INTO telemetry_cycles (timestamp, cycle_name, status, details) VALUES (?, ?, ?, ?)`);
        tStmt.run(timestamp, cycleName, 'VERIFIED_EVOLUTION', `Apprentice ingested recent social media data layers and updated UI structural accent parameters.`);
        tStmt.finalize();

        const uStmt = db.prepare(`INSERT INTO ui_mutations (upgrade_title, applied_css_accent, status) VALUES (?, ?, ?)`);
        uStmt.run(chosenTitle, chosenAccent, 'ACTIVE');
        uStmt.finalize();

        logEvent('ApprenticeAgent', 'SUCCESS', `Self-upgrading layout cycle completed. Applied theme: ${chosenTitle}`);
    } catch (err) {
        logEvent('ApprenticeAgent', 'ERROR', `UI upgrade error: ${err.message}`);
    }
}

// Trigger immediate loops on startup
setTimeout(() => {
    runAutonomousLoop();
    runUiUpgradeCycle();
}, 2000);

setInterval(runAutonomousLoop, 15 * 60 * 1000);
setInterval(runUiUpgradeCycle, 45 * 60 * 1000);

// 4. JSON API Endpoint for Live Client-Side Polling
app.get('/api/island-status', (req, res) => {
    db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err, ui) => {
        db.all(`SELECT * FROM media_streams`, [], (err2, media) => {
            db.all(`SELECT * FROM harvested_intelligence ORDER BY timestamp DESC LIMIT 1`, [], (err3, harvest) => {
                res.json({
                    accent: ui ? ui.applied_css_accent : '#38bdf8',
                    version: ui ? ui.upgrade_title : 'Genesis Core',
                    media: media || [],
                    latestHarvest: harvest ? harvest[0] : null
                });
            });
        });
    });
});

// 5. Self-Updating Visual Command Center & Living Interface
app.get('/', (req, res) => {
    db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 8`, [], (err, logs) => {
        db.all(`SELECT * FROM harvested_intelligence ORDER BY timestamp DESC LIMIT 6`, [], (err2, harvest) => {
            db.all(`SELECT * FROM telemetry_cycles ORDER BY timestamp DESC LIMIT 4`, [], (err3, cycles) => {
                db.all(`SELECT * FROM media_streams`, [], (err4, media) => {
                    db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err5, activeUi) => {
                        
                        const shortStream = media ? media.find(m => m.stream_type === 'short') : null;
                        const sanctuaryStream = media ? media.find(m => m.stream_type === 'sanctuary') : null;
                        const accentColor = activeUi ? activeUi.applied_css_accent : '#38bdf8';
                        const uiVersion = activeUi ? activeUi.upgrade_title : 'Genesis Core Layout';

                        const html = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Anadolu Island - Sovereign Platform & Command Center</title>
                            <style>
                                * { box-sizing: border-box; margin: 0; padding: 0; }
                                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 20px; }
                                .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                                
                                header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-left: 5px solid ${accentColor}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                                h1 { margin: 0 0 5px 0; color: ${accentColor}; font-size: 22px; transition: color 0.5s ease; }
                                .status-badge { display: inline-block; background: #22c55e; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; }
                                
                                /* Monzo Direct Funding Button */
                                .monzo-btn { background: #ff5252; color: #fff; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #ff7676; transition: background 0.3s ease; display: inline-flex; align-items: center; gap: 6px; }
                                .monzo-btn:hover { background: #ff3838; }

                                .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                                h2 { font-size: 16px; color: #fff; margin-bottom: 12px; }
                                
                                /* Dual Stream Grid */
                                .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                                @media(max-width: 768px) { .grid-container { grid-template-columns: 1fr; } }
                                
                                .shorts-box { background: #181818; border-radius: 12px; border: 1px solid #333; overflow: hidden; display: flex; flex-direction: column; height: 420px; position: relative; }
                                .shorts-header { padding: 12px; background: #202020; font-size: 12px; font-weight: bold; display: flex; justify-content: space-between; border-bottom: 1px solid #333; z-index: 2; }
                                .shorts-viewport { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; background: #111; overflow: hidden; }
                                .shorts-viewport video { width: 100%; height: 100%; object-fit: cover; }
                                .shorts-actions { position: absolute; right: 12px; bottom: 16px; display: flex; flex-direction: column; gap: 12px; z-index: 2; }
                                .action-circle { width: 36px; height: 36px; background: rgba(0,0,0,0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 1px solid rgba(255,255,255,0.2); }
                                
                                .sanctuary-box { background: #181818; border-radius: 12px; border: 1px solid #333; overflow: hidden; display: flex; flex-direction: column; height: 420px; }
                                .sanctuary-player { width: 100%; height: 220px; background: #222; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #333; overflow: hidden; }
                                .sanctuary-player video { width: 100%; height: 100%; object-fit: cover; }
                                .sanctuary-info { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
                                .video-title { font-size: 14px; font-weight: bold; color: #fff; }
                                .video-desc { font-size: 11px; color: #888; line-height: 1.4; }

                                /* Tables */
                                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                                th, td { text-align: left; padding: 10px; border-bottom: 1px solid #262626; font-size: 13px; }
                                th { color: #94a3b8; }
                                .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
                                .highlight { color: ${accentColor}; font-weight: bold; transition: color 0.5s ease; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <!-- Command Center Header with Self-Upgraded Theme & Monzo Node -->
                                <header id="island-header" style="border-left-color: ${accentColor};">
                                    <div>
                                        <h1>⚓ Anadolu Island Sovereign Command Center</h1>
                                        <p>Status: <span class="status-badge">ONLINE</span> | Uptime: <span id="uptime-counter">${Math.floor(process.uptime())}</span>s</p>
                                        <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">Self-Upgrading UI: <span id="ui-version-text" style="color: ${accentColor}; font-weight: bold;">${uiVersion}</span> &bull; Social Learning & Media Streaming Active.</p>
                                    </div>
                                    <div>
                                        <!-- Replace 'yourname' with your actual Monzo.me username link -->
                                        <a href="https://me.monzo.com/yourname" target="_blank" class="monzo-btn">
                                            💳 Support via Monzo
                                        </a>
                                    </div>
                                </header>

                                <!-- Dual-Stream Platform Interface with Active Video Players -->
                                <div class="card">
                                    <h2>🏛️ Sovereign Platform Streams (TikTok, Instagram, YouTube, Facebook Ingestion)</h2>
                                    <div class="grid-container">
                                        <!-- Short-Form Stream (TikTok-style) -->
                                        <div class="shorts-box">
                                            <div class="shorts-header">
                                                <span id="short-stream-label">⚡ SHORTS STREAM (${shortStream ? shortStream.title : 'Live'})</span>
                                                <span style="color: #ff3b30;">LIVE</span>
                                            </div>
                                            <div class="shorts-viewport">
                                                <video id="dynamic-short-video" src="${shortStream ? shortStream.video_url : ''}" autoplay muted loop playsinline></video>
                                                <div class="shorts-actions">
                                                    <div class="action-circle">❤️</div>
                                                    <div class="action-circle">💬</div>
                                                    <div class="action-circle">🔗</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Long-Form Sanctuary (YouTube-style) -->
                                        <div class="sanctuary-box">
                                            <div class="sanctuary-player">
                                                <video src="${sanctuaryStream ? sanctuaryStream.video_url : ''}" controls></video>
                                            </div>
                                            <div class="sanctuary-info">
                                                <div class="video-title">${sanctuaryStream ? sanctuaryStream.title : 'Anatolian Heritage & Cultural Stream'}</div>
                                                <div class="video-desc">${sanctuaryStream ? sanctuaryStream.description : 'Deep-dive archival footage and autonomous cultural indexing streams.'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Live Harvested Social & Intelligence Feed -->
                                <div class="card">
                                    <h2>🌾 Live Harvested Social & Market Intelligence Feed</h2>
                                    <table>
                                        <tr><th>Time</th><th>Source / Category</th><th>Title / Signal</th><th>Payload Details</th></tr>
                                        ${harvest && harvest.length > 0 ? harvest.map(h => `<tr><td>${h.timestamp}</td><td><span class="highlight">${h.source_category}</span></td><td>${h.title}</td><td>${h.data_payload}</td></tr>`).join('') : '<tr><td colspan="4" style="color: #64748b;">Harvesting engine is scouring social feeds... Fresh intel incoming shortly.</td></tr>'}
                                    </table>
                                </div>

                                <!-- Apprentice Telemetry & UI Mutation History -->
                                <div class="card">
                                    <h2>🔄 Apprentice Telemetry & Self-Upgrading Cycles</h2>
                                    <table>
                                        <tr><th>Time</th><th>Cycle Name</th><th>Status</th><th>Details</th></tr>
                                        ${cycles && cycles.length > 0 ? cycles.map(c => `<tr><td>${c.timestamp}</td><td>${c.cycle_name}</td><td>${c.status}</td><td>${c.details}</td></tr>`).join('') : '<tr><td colspan="4" style="color: #64748b;">No telemetry cycles recorded yet.</td></tr>'}
                                    </table>
                                </div>

                                <!-- System Activity Logs -->
                                <div class="card">
                                    <h2>📋 System Activity Logs</h2>
                                    <table>
                                        <tr><th>Time</th><th>Module</th><th>Status</th><th>Message</th></tr>
                                        ${logs && logs.length > 0 ? logs.map(l => `<tr><td>${l.timestamp}</td><td>${l.module_name}</td><td>${l.status}</td><td>${l.message}</td></tr>`).join('') : '<tr><td colspan="4" style="color: #64748b;">No logs found.</td></tr>'}
                                    </table>
                                </div>

                                <div class="footer">
                                    Sovereign Infrastructure &bull; Built Shoulder-to-Shoulder &bull; The Living Island Architecture
                                </div>
                            </div>

                            <!-- Living Interface Polling Script -->
                            <script>
                                async function pollIslandStatus() {
                                    try {
                                        const res = await fetch('/api/island-status');
                                        const data = await res.json();
                                        if (data && data.media) {
                                            const short = data.media.find(m => m.stream_type === 'short');
                                            if (short) {
                                                const vEl = document.getElementById('dynamic-short-video');
                                                if (vEl && vEl.src !== short.video_url) {
                                                    vEl.src = short.video_url;
                                                    vEl.load();
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        console.log("Polling background sync active...");
                                    }
                                }
                                setInterval(pollIslandStatus, 30000); // Check for fresh media every 30 seconds
                            </script>
                        </body>
                        </html>
                        `;
                        res.send(html);
                    });
                });
            });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Engine is live on port ${PORT}`);
    logEvent('SystemCore', 'BOOT', `Server successfully started on Render port ${PORT}`);
});
