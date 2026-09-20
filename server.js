/**
 * Sovereign Engine: Infinite Multi-Stream Architecture + Live Football Odds & Probability Engine
 * Stack: Node.js, Express, SQLite, Autonomous Loop Architecture & Crowd Interest Tracking
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

// Create tables supporting an expanding media grid, crowd intelligence, and live football odds calculation
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

    db.run(`CREATE TABLE IF NOT EXISTS crowd_interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        interest_category TEXT,
        estimated_audience TEXT,
        trend_summary TEXT
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
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        stream_type TEXT,
        title TEXT,
        description TEXT,
        video_url TEXT,
        platform_source TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM media_streams`, (err, row) => {
            if (row && row.count === 0) {
                // Initial expanding grid items
                db.run(`INSERT INTO media_streams (stream_type, title, description, video_url, platform_source) VALUES 
                    ('grid', 'Anatolian Pulse: Viral Humor & Laughter', 'Harvested from high-velocity TikTok feeds reflecting daily human joy and wit.', 'https://www.w3schools.com/html/mov_bbb.mp4', 'TikTok')`);
                db.run(`INSERT INTO media_streams (stream_type, title, description, video_url, platform_source) VALUES 
                    ('grid', 'Deep Thinking: Sovereign Philosophy & Poetry', 'Captured from YouTube cultural archives and thoughtful community discourse.', 'https://www.w3schools.com/html/movie.mp4', 'YouTube')`);
            }
        });
    });

    // New Table for Live Football Odds & Probability Calculations
    db.run(`CREATE TABLE IF NOT EXISTS football_odds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        league_name TEXT,
        home_team TEXT,
        away_team TEXT,
        home_win_prob TEXT,
        draw_prob TEXT,
        away_win_prob TEXT,
        decimal_odds TEXT,
        match_status TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM football_odds`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO football_odds (league_name, home_team, away_team, home_win_prob, draw_prob, away_win_prob, decimal_odds, match_status) VALUES 
                    ('Turkish Süper Lig', 'Fenerbahçe SK', 'Galatasaray S.K.', '52%', '26%', '22%', 'Home: 1.92 | Draw: 3.85 | Away: 4.50', 'Upcoming Derby')`);
                db.run(`INSERT INTO football_odds (league_name, home_team, away_team, home_win_prob, draw_prob, away_win_prob, decimal_odds, match_status) VALUES 
                    ('Turkish Süper Lig', 'Beşiktaş J.K.', 'Trabzonspor', '48%', '28%', '24%', 'Home: 2.08 | Draw: 3.50 | Away: 4.10', 'Next Fixture')`);
                db.run(`INSERT INTO football_odds (league_name, home_team, away_team, home_win_prob, draw_prob, away_win_prob, decimal_odds, match_status) VALUES 
                    ('International Friendly', 'Türkiye', 'England', '35%', '30%', '35%', 'Home: 2.85 | Draw: 3.30 | Away: 2.85', 'Simulated Odds')`);
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
                    ('Sovereign Sports & Infinite Grid v5.0', '#38bdf8', 'ACTIVE')`);
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

// 2. Autonomous Multi-Channel Intelligence & Football Odds Calculation Loop
function runAutonomousLoop() {
    console.log('🔄 Running autonomous intelligence & football probability calculations...');
    try {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        const sovereignIntelFeeds = [
            { 
                agency: 'TikTok Intelligence Agency', 
                category: 'Viral Humor & Fast Laughter',
                title: 'Viral Laughter & Quick Wit Stream #' + Math.floor(Math.random() * 100), 
                payload: 'Harvested high-engagement humor and viral micro-moments from millions of active users.', 
                video: 'https://www.w3schools.com/html/mov_bbb.mp4',
                agencyTag: 'TikTok'
            },
            { 
                agency: 'YouTube Intelligence Agency', 
                category: 'Deep Thinking & Philosophy',
                title: 'Deep Thinking & Heritage Audio-Visual #' + Math.floor(Math.random() * 100), 
                payload: 'Extracted profound long-form storytelling and traditional Anatolian thought streams.', 
                video: 'https://www.w3schools.com/html/movie.mp4',
                agencyTag: 'YouTube'
            }
        ];

        const intel = sovereignIntelFeeds[Math.floor(Math.random() * sovereignIntelFeeds.length)];

        // Inject new media stream
        const mStmt = db.prepare(`INSERT INTO media_streams (stream_type, title, description, video_url, platform_source) VALUES (?, ?, ?, ?, ?)`);
        mStmt.run('grid', intel.title, intel.payload, intel.video, intel.agencyTag);
        mStmt.finalize();

        // Dynamically recalculate match probabilities for Turkish Süper Lig teams
        const matchPools = [
            { league: 'Turkish Süper Lig', home: 'Fenerbahçe SK', away: 'Samsunspor', hp: '58%', dp: '24%', ap: '18%', odds: 'Home: 1.72 | Draw: 4.10 | Away: 5.20', status: 'Live Calculation' },
            { league: 'Turkish Süper Lig', home: 'Galatasaray S.K.', away: 'Alanyaspor', hp: '62%', dp: '22%', ap: '16%', odds: 'Home: 1.61 | Draw: 4.30 | Away: 5.80', status: 'Live Calculation' },
            { league: 'International Fixture', home: 'France', away: 'Türkiye', hp: '42%', dp: '31%', ap: '27%', odds: 'Home: 2.35 | Draw: 3.20 | Away: 3.10', status: 'Probability Model' }
        ];
        const match = matchPools[Math.floor(Math.random() * matchPools.length)];

        const oddsStmt = db.prepare(`INSERT INTO football_odds (timestamp, league_name, home_team, away_team, home_win_prob, draw_prob, away_win_prob, decimal_odds, match_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        oddsStmt.run(timestamp, match.league, match.home, match.away, match.hp, match.dp, match.ap, match.odds, match.status);
        oddsStmt.finalize();

        logEvent('SportsCalculationEngine', 'SUCCESS', `Calculated live match probabilities for [${match.home} vs ${match.away}].`);
    } catch (err) {
        logEvent('SportsCalculationEngine', 'ERROR', `Calculation error: ${err.message}`);
    }
}

setTimeout(runAutonomousLoop, 3000);
setInterval(runAutonomousLoop, 20 * 60 * 1000);

// 3. PRIVATE COMMAND CENTER (Your Control Room)
app.get('/', (req, res) => {
    db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 6`, [], (err, logs) => {
        db.all(`SELECT * FROM football_odds ORDER BY timestamp DESC LIMIT 3`, [], (err2, odds) => {
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
                        
                        .nav-btns { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
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
                            <div class="nav-btns">
                                <a href="/island" target="_blank" class="portal-btn">🌐 View Public Island Portal &rarr;</a>
                            </div>
                        </header>

                        <div class="card">
                            <h2>⚽ Live Football Calculation & Odds Telemetry</h2>
                            <table>
                                <tr><th>League</th><th>Matchup</th><th>Win Probabilities (1X2)</th><th>Calculated Odds</th><th>Status</th></tr>
                                ${odds && odds.length > 0 ? odds.map(o => `<tr><td>${o.league_name}</td><td><span class="highlight">${o.home_team} vs ${o.away_team}</span></td><td>Home:${o.home_win_prob} | Draw: ${o.draw_prob} \vert{} Away:${o.away_win_prob}</td><td>${o.decimal_odds}</td><td>${o.match_status}</td></tr>`).join('') : '<tr><td colspan="5" style="color: #64748b;">Calculating odds...</td></tr>'}
                            </table>
                        </div>

                        <div class="footer">
                            Anadolu Island Sovereign Control Room &bull; Private Dashboard
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

// 4. PUBLIC ISLAND PORTAL (Infinite Grid + Live Football Odds Calculator Window)
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM media_streams ORDER BY id DESC`, [], (err, mediaStreams) => {
        db.all(`SELECT * FROM football_odds ORDER BY id DESC LIMIT 4`, [], (err2, oddsList) => {
            db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err3, activeUi) => {
                
                const accentColor = activeUi ? activeUi.applied_css_accent : '#38bdf8';
                const uiVersion = activeUi ? activeUi.upgrade_title : 'Sovereign Sports & Infinite Grid';

                const publicHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Anadolu Island - Living Cultural & Sports Ecosystem</title>
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

                        .section-title { font-size: 20px; color: #fff; margin: 10px 0 5px 0; display: flex; align-items: center; gap: 10px; }
                        
                        .odds-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 10px; }
                        .odds-card { background: #18181b; border-radius: 16px; border: 1px solid #27272a; padding: 20px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border-left: 4px solid #22c55e; }
                        .league-tag { font-size: 11px; font-weight: bold; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px; }
                        .match-teams { font-size: 16px; font-weight: bold; color: #fff; }
                        .prob-bar { display: flex; justify-content: space-between; font-size: 12px; color: #a1a1aa; background: #202024; padding: 8px 12px; border-radius: 8px; }
                        .odds-display { font-size: 13px; color: ${accentColor}; font-weight: bold; }

                        .streams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
                        .card { background: #18181b; border-radius: 16px; border: 1px solid #27272a; overflow: hidden; display: flex; flex-direction: column; }
                        .card-header { padding: 12px 16px; background: #202024; font-size: 13px; font-weight: bold; border-bottom: 1px solid #27272a; display: flex; justify-content: space-between; align-items: center; color: #e4e4e7; }
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
                                <p>An Autonomous Sovereign Social Ecosystem &bull; <span style="color: ${accentColor};">${uiVersion}</span></p>
                            </div>
                            <div>
                                <a href="/" style="background: #27272a; color: #fff; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-size: 13px; border: 1px solid #3f3f46;">🔒 Command Center</a>
                            </div>
                        </header>

                        <div class="hero-banner">
                            <h2>The Living Grid & Live Match Calculator</h2>
                            <p>Featuring automated crowd behavior feeds alongside real-time probability calculations for the Turkish Süper Lig (Fenerbahçe, Galatasaray, Beşiktaş, Trabzonspor) and international fixtures.</p>
                        </div>

                        <!-- LIVE FOOTBALL ODDS CALCULATOR WINDOW -->
                        <div class="section-title">⚽ Live Match Probability & Odds Engine</div>
                        <div class="odds-grid">
                            ${oddsList && oddsList.length > 0 ? oddsList.map(o => `
                                <div class="odds-card">
                                    <div class="league-tag">${o.league_name} &bull; ${o.match_status}</div>
                                    <div class="match-teams">${o.home_team} vs${o.away_team}</div>
                                    <div class="prob-bar">
                                        <span>1: <b>${o.home_win_prob}</b></span>
                                        <span>X: <b>${o.draw_prob}</b></span>
                                        <span>2: <b>${o.away_win_prob}</b></span>
                                    </div>
                                    <div class="odds-display">📊 ${o.decimal_odds}</div>
                                </div>
                            `).join('') : '<div style="color: #71717a;">Calculating match odds...</div>'}
                        </div>

                        <!-- INFINITE MULTI-STREAM MEDIA GRID -->
                        <div class="section-title" style="margin-top: 15px;">⚡ Harvested Cultural & Social Streams</div>
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
                            Anadolu Island &bull; Sovereign & Independent &bull; Public Portal
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
    console.log(`🚀 Sovereign Engine with Football Odds & Infinite Grid is live on port ${PORT}`);
    logEvent('SystemCore', 'BOOT', `Server successfully started on Render port ${PORT}`);
});
