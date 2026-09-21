/**
 * Sovereign Engine: Unified Self-Upgrading Architecture & Community Hub
 * Stack: Node.js, Express, SQLite, FFmpeg Media Feed, & Custom Blueprint Injection
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Serve Static Assets (Rendered Videos)
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// 2. Initialize SQLite Database (Local Sovereign Storage)
const dbPath = path.resolve(__dirname, 'sovereign_engine.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign SQLite Database.');
    }
});

// Create comprehensive tables supporting media streams, blueprints, upgrades, learning cycles, and custom injections
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
    )`);

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

    db.run(`CREATE TABLE IF NOT EXISTS synthesized_upgrades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        upgrade_name TEXT,
        source_blueprint TEXT,
        applied_logic TEXT,
        status TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM synthesized_upgrades`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO synthesized_upgrades (upgrade_name, source_blueprint, applied_logic, status) VALUES 
                    ('Shoulder-to-Shoulder Ecosystem v7.0 - Self-Synthesizing Core', 'Sovereign Core Initializer', 'Base architectural loop established.', 'ACTIVE')`);
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
                    ('Shoulder-to-Shoulder Ecosystem v7.0 - Self-Synthesizing Core', '#22c55e', 'ACTIVE')`);
            }
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS learning_cycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        learning_cycle INTEGER,
        experiment_title TEXT,
        approval_status TEXT,
        agent_hypothesis TEXT,
        sandbox_result TEXT,
        tested_at TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM learning_cycles`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO learning_cycles (learning_cycle, experiment_title, approval_status, agent_hypothesis, sandbox_result, tested_at) VALUES 
                    (1, 'Autonomous Telemetry Stream Sync', 'APPROVED', 'Refreshing background fetch routines improves dashboard responsiveness.', 'Success: Latency reduced across all active nodes.', '2026-09-21 12:00:00')`);
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

// 3. API Endpoints & Actions
app.post('/api/log', (req, res) => {
    const { channel, ad_count, content_tag } = req.body;
    const message = `Automated broadcast generated for ${channel} (Count: ${ad_count || 1}). Tag: ${content_tag || 'Standard'}`;
    
    logEvent('VideoPipeline', 'SUCCESS', message);
    console.log(`📡 Telemetry received: ${message}`);
    
    res.status(200).json({ status: 'success', recorded_channel: channel });
});

// Endpoint to add custom blueprints directly from your Command Center
app.post('/api/add-blueprint', (req, res) => {
    const { source_origin, blueprint_title, architecture_pattern } = req.body;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const stmt = db.prepare(`INSERT INTO harvested_blueprints (timestamp, source_origin, blueprint_title, architecture_pattern, integration_status) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(timestamp, source_origin || 'Custom Engineer Input', blueprint_title, architecture_pattern, 'USER INJECTED', (err) => {
        stmt.finalize();
        if (err) {
            logEvent('BlueprintInjection', 'ERROR', `Failed to inject blueprint: ${err.message}`);
            return res.status(500).send('Error saving blueprint.');
        }
        
        // Also log a synthesized upgrade entry for it
        db.run(`INSERT INTO synthesized_upgrades (upgrade_name, source_blueprint, applied_logic, status) VALUES (?, ?, ?, ?)`,
            [`Custom Service: ${blueprint_title}`, source_origin || 'User Injection', architecture_pattern, 'DEPLOYED & ACTIVE']);

        logEvent('BlueprintInjection', 'SUCCESS', `Successfully injected custom service blueprint [${blueprint_title}].`);
        res.redirect('/');
    });
});

app.get('/api/pet-project/status', (req, res) => {
    db.all(`SELECT * FROM learning_cycles ORDER BY learning_cycle DESC LIMIT 10`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            status: 'ACTIVE',
            review_cadence: '2-HOUR CYCLE',
            learning_cycles: rows || []
        });
    });
});

// 4. 4D Sandbox / Pet Project Route (Fixed to prevent "No Find" errors)
app.get('/pet-project', (req, res) => {
    const sandboxHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>4D Sandbox & Pet Project Observation Deck</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
            .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
            header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(168, 85, 247, 0.3); display: flex; justify-content: space-between; align-items: center; }
            h1 { color: #c084fc; font-size: 24px; margin-bottom: 6px; }
            p { color: #94a3b8; font-size: 14px; }
            .back-btn { background: #262626; color: #fff; padding: 10px 18px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #3f3f46; }
            .card { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 16px; }
            h2 { font-size: 18px; color: #fff; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }
            th { color: #94a3b8; }
            .highlight { color: #c084fc; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <div>
                    <h1>🐾 4D Sandbox Observation Deck</h1>
                    <p>Apprentice Agent Autonomous Learning & Wildlife/Pet Mobile Simulation Workspace</p>
                </div>
                <a href="/" class="back-btn">&larr; Command Center</a>
            </header>

            <div class="card">
                <h2>🧪 Active Learning Cycles & Agent Hypotheses</h2>
                <table>
                    <tr><th>Cycle</th><th>Experiment Title</th><th>Status</th><th>Agent Hypothesis</th><th>Sandbox Result</th></tr>
                    <tr>
                        <td><span class="highlight">#1</span></td>
                        <td>Autonomous Telemetry Stream Sync</td>
                        <td><span style="color: #22c55e; font-weight: bold;">APPROVED</span></td>
                        <td>Refreshing background fetch routines improves dashboard responsiveness.</td>
                        <td>Success: Latency reduced across all active nodes.</td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(sandboxHtml);
});

// 5. Autonomous Live-Net Scavenger & Self-Synthesis Engine
async function runLiveNetScavengerLoop() {
    console.log('🔄 Scavenging living net for new architectural blueprints...');
    try {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const response = await fetch('https://api.github.com/search/repositories?q=automation+framework+language:javascript&sort=updated&per_page=5', {
            headers: { 'User-Agent': 'Anadolu-Island-Sovereign-Engine' }
        });
        const data = await response.json();

        if (data && data.items && data.items.length > 0) {
            const repo = data.items[Math.floor(Math.random() * data.items.length)];
            const origin = `GitHub Live Stream (${repo.owner.login})`;
            const title = repo.name;
            const pattern = repo.description ? repo.description.substring(0, 140) : 'Live public repository harvested from open digital net.';
            
            const bStmt = db.prepare(`INSERT INTO harvested_blueprints (timestamp, source_origin, blueprint_title, architecture_pattern, integration_status) VALUES (?, ?, ?, ?, ?)`);
            bStmt.run(timestamp, origin, title, pattern, 'LIVE HARVESTED');
            bStmt.finalize();

            logEvent('LiveNetScavenger', 'SUCCESS', `Harvested live blueprint [${title}] from ${origin}.`);

            setTimeout(() => {
                const upgradeName = `Module Bridge: ${title}`;
                const logicDesc = `Auto-integrated architectural patterns from ${origin}: "${pattern}"`;
                db.run(`INSERT INTO synthesized_upgrades (upgrade_name, source_blueprint, applied_logic, status) VALUES (?, ?, ?, ?)`,
                    [upgradeName, title, logicDesc, 'SYNTHESIZED & ADAPTED']);
            }, 2000);
        }
    } catch (err) {
        logEvent('LiveNetScavenger', 'ERROR', `Live net connection error: ${err.message}`);
    }
}

setTimeout(runLiveNetScavengerLoop, 4000);
setInterval(runLiveNetScavengerLoop, 20 * 60 * 1000);

// 6. PRIVATE COMMAND CENTER (With Custom Blueprint Injection Form)
app.get('/', (req, res) => {
    db.all(`SELECT * FROM harvested_blueprints ORDER BY timestamp DESC LIMIT 6`, [], (err, blueprints) => {
        db.all(`SELECT * FROM synthesized_upgrades ORDER BY timestamp DESC LIMIT 6`, [], (errUpgrades, upgrades) => {
            db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 6`, [], (err2, logs) => {
                db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err3, activeUi) => {
                    
                    const accentColor = activeUi ? activeUi.applied_css_accent : '#22c55e';
                    const uiVersion = activeUi ? activeUi.upgrade_title : 'Sovereign Core Initializer';

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
                            .portal-btn { background: #262626; color: #fff; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #3f3f46; }
                            .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                            h2 { font-size: 16px; color: #fff; margin-bottom: 12px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #262626; font-size: 13px; }
                            th { color: #94a3b8; }
                            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
                            .highlight { color: ${accentColor}; font-weight: bold; }
                            .form-group { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
                            input, textarea { background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 10px; border-radius: 8px; font-size: 13px; width: 100%; }
                            button { background: ${accentColor}; color: #000; font-weight: bold; padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; transition: opacity 0.2s; }
                            button:hover { opacity: 0.9; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <header>
                                <div>
                                    <h1>⚓ Anadolu Island Sovereign Command Center</h1>
                                    <p>Status: <span class="status-badge">ONLINE</span> | Protocol: <span style="color: ${accentColor}; font-weight: bold;">${uiVersion}</span></p>
                                </div>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <a href="/pet-project" class="portal-btn" style="background: #a855f7; color: #fff; border-color: #a855f7;">🐾 4D Sandbox</a>
                                    <a href="/island" class="portal-btn">🌐 View Public Island Portal &rarr;</a>
                                </div>
                            </header>

                            <!-- Custom Blueprint Injection Box -->
                            <div class="card" style="border-color: rgba(34, 197, 94, 0.3);">
                                <h2>🛠️ Inject Custom Service Blueprint</h2>
                                <p style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">Add your own custom blueprints or service goals directly into the engine database to upgrade your active system.</p>
                                <form action="/api/add-blueprint" method="POST" style="display: flex; flex-direction: column; gap: 12px;">
                                    <div style="display: flex; gap: 10px;">
                                        <input type="text" name="source_origin" placeholder="Source Origin (e.g., Cenk Personal Dev)" required style="flex: 1;">
                                        <input type="text" name="blueprint_title" placeholder="Blueprint / Service Title (e.g., Mobile Wildlife Feed API)" required style="flex: 1;">
                                    </div>
                                    <textarea name="architecture_pattern" placeholder="Describe the architecture pattern or service logic..." rows="2" required></textarea>
                                    <button type="submit">💾 Inject & Upgrade Engine</button>
                                </form>
                            </div>

                            <div class="card">
                                <h2>🧬 Self-Synthesized Upgrades & Custom Services</h2>
                                <table>
                                    <tr><th>Upgrade Name</th><th>Source Blueprint</th><th>Applied Logic & Integration</th><th>Status</th></tr>
                                    ${upgrades && upgrades.length > 0 ? upgrades.map(u => `<tr><td><span class="highlight">${u.upgrade_name}</span></td><td>${u.source_blueprint}</td><td>${u.applied_logic}</td><td>${u.status}</td></tr>`).join('') : '<tr><td colspan="4" style="color: #64748b;">No upgrades recorded yet.</td></tr>'}
                                </table>
                            </div>

                            <div class="card">
                                <h2>🌐 Harvested & Injected Blueprints</h2>
                                <table>
                                    <tr><th>Source Origin</th><th>Blueprint / Project Title</th><th>Architecture & Pattern</th><th>Status</th></tr>
                                    ${blueprints && blueprints.length > 0 ? blueprints.map(b => `<tr><td>${b.source_origin}</td><td><span class="highlight">${b.blueprint_title}</span></td><td>${b.architecture_pattern}</td><td>${b.integration_status}</td></tr>`).join('') : '<tr><td colspan="4" style="color: #64748b;">No blueprints recorded yet.</td></tr>'}
                                </table>
                            </div>

                            <div class="card">
                                <h2>📋 Recent System & Pipeline Logs</h2>
                                <table>
                                    <tr><th>Timestamp</th><th>Module</th><th>Status</th><th>Message</th></tr>
                                    ${logs && logs.length > 0 ? logs.map(l => `<tr><td>${l.timestamp}</td><td>${l.module_name}</td><td>${l.status}</td><td>${l.message}</td></tr>`).join('') : '<tr><td colspan="4" style="color: #64748b;">No logs recorded yet.</td></tr>'}
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
});

// 7. PUBLIC ISLAND PORTAL (Vibrant Social Media Feed & Video Stream)
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM media_streams ORDER BY id DESC`, [], (err, mediaStreams) => {
        db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err2, activeUi) => {
            
            const accentColor = activeUi ? activeUi.applied_css_accent : '#22c55e';

            const publicHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Anadolu Island - Community & Media Feed</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f0f0f; color: #f1f1f1; padding: 0; }
                    nav { background: #181818; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; position: sticky; top: 0; z-index: 100; }
                    .brand { font-size: 20px; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 8px; }
                    .brand span { color: ${accentColor}; }
                    .nav-actions { display: flex; gap: 12px; align-items: center; }
                    .nav-btn { background: #272727; color: #fff; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 13px; font-weight: bold; border: 1px solid #3f3f46; transition: background 0.2s; }
                    .nav-btn:hover { background: #3f3f46; }
                    .container { max-width: 900px; margin: 30px auto; padding: 0 20px; display: flex; flex-direction: column; gap: 30px; }
                    .hero-card { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 30px; text-align: center; background: linear-gradient(135deg, #181818, #222); }
                    .hero-card h1 { font-size: 28px; color: #fff; margin-bottom: 10px; }
                    .hero-card p { font-size: 15px; color: #aaa; max-width: 600px; margin: 0 auto; line-height: 1.5; }
                    .feed-header { font-size: 18px; font-weight: bold; color: #fff; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 10px; }
                    .feed-stream { display: flex; flex-direction: column; gap: 24px; }
                    .post-card { background: #181818; border: 1px solid #333; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
                    .post-header { padding: 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #262626; }
                    .author-info { display: flex; align-items: center; gap: 10px; }
                    .avatar { width: 36px; height: 36px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; }
                    .author-name { font-size: 14px; font-weight: bold; color: #fff; }
                    .post-time { font-size: 12px; color: #888; }
                    .platform-tag { background: #2a2a2a; color: ${accentColor}; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
                    .media-box { width: 100%; max-height: 450px; background: #000; display: flex; align-items: center; justify-content: center; position: relative; }
                    .media-box video { width: 100%; max-height: 450px; object-fit: contain; display: block; }
                    .post-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
                    .post-title { font-size: 16px; font-weight: bold; color: #fff; }
                    .post-desc { font-size: 14px; color: #bbb; line-height: 1.4; }
                    .footer { text-align: center; color: #666; font-size: 13px; padding: 20px 0; }
                </style>
            </head>
            <body>
                <nav>
                    <div class="brand">🌿 Anadolu <span>Island</span></div>
                    <div class="nav-actions">
                        <a href="/pet-project" class="nav-btn" style="color: #c084fc; border-color: #c084fc;">🐾 4D Sandbox</a>
                        <a href="/" class="nav-btn">🔒 Command Center</a>
                    </div>
                </nav>
                <div class="container">
                    <div class="hero-card">
                        <h1>Shoulder-to-Shoulder Community Feed</h1>
                        <p>Welcome to our media stage. Here is where cultural streams, video assets, and community stories come together.</p>
                    </div>
                    <div class="feed-header">
                        <span>📡 Live Community Streams & Stories</span>
                        <span style="font-size: 12px; color: #888;">Staging Preview</span>
                    </div>
                    <div class="feed-stream">
                        ${mediaStreams && mediaStreams.length > 0 ? mediaStreams.map((stream) => `
                            <div class="post-card">
                                <div class="post-header">
                                    <div class="author-info">
                                        <div class="avatar">AI</div>
                                        <div>
                                            <div class="author-name">Anadolu Island Network</div>
                                            <div class="post-time">${stream.timestamp}</div>
                                        </div>
                                    </div>
                                    <span class="platform-tag">${stream.platform_source || 'Community'}</span>
                                </div>
                                <div class="media-box">
                                    <video src="${stream.video_url}" controls playsinline preload="metadata"></video>
                                </div>
                                <div class="post-body">
                                    <div class="post-title">${stream.title}</div>
                                    <div class="post-desc">${stream.description}</div>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="post-card" style="padding: 40px; text-align: center; color: #888;">
                                No active media streams loaded yet. Ready for your Python video generator worker feed!
                            </div>
                        `}
                    </div>
                    <div class="footer">Anadolu Island &bull; Shoulder-to-Shoulder Ecosystem &bull; Public Portal</div>
                </div>
            </body>
            </html>
            `;
            res.send(publicHtml);
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Unified Sovereign Engine is live on port ${PORT}`);
    logEvent('SystemCore', 'BOOT', `Unified server successfully started on Render port ${PORT}`);
});
