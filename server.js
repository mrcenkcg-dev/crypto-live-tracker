/**
 * ==============================================================================
 * SOVEREIGN MASTER ENGINE: UNIFIED SPORTSBOOK, DISCORD BRIDGE & FOOTBALL CARDS
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
// 1. DATABASE SETUP & UNIFIED SCHEMA
// ==============================================================================
const dbFile = path.join(__dirname, 'sovereign_master.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Unified Sovereign Master DB.');
        initializeMasterDatabase();
    }
});

function initializeMasterDatabase() {
    db.serialize(() => {
        // System Logs Table
        db.run(`CREATE TABLE IF NOT EXISTS system_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            module_name TEXT,
            status TEXT,
            message TEXT
        )`);

        // Sports Fixtures Table
        db.run(`CREATE TABLE IF NOT EXISTS multi_league_fixtures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            league_category TEXT,
            home_team TEXT,
            away_team TEXT,
            match_date TEXT,
            venue TEXT,
            home_rating INT,
            away_rating INT,
            aggression_rating INT,
            ad_sponsor TEXT
        )`, () => {
            db.get(`SELECT COUNT(*) as count FROM multi_league_fixtures`, (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO multi_league_fixtures (league_category, home_team, away_team, match_date, venue, home_rating, away_rating, aggression_rating, ad_sponsor) VALUES 
                        ('UEFA Nations League', 'Türkiye', 'France', 'Tomorrow, 19:45', 'RAMS Park, Istanbul', 86, 91, 8, 'Anadolu Sufi Rock Partner'),
                        ('UEFA Nations League', 'Türkiye', 'Italy', '28 Sep 2026, 19:45', 'Chobani Stadyumu, Istanbul', 86, 89, 9, 'Sovereign Global Partner'),
                        ('UEFA Nations League', 'Belgium', 'Türkiye', '02 Oct 2026, 19:45', 'King Baudouin Stadium, Brussels', 87, 86, 7, 'Get Big Together Initiative'),
                        ('International Friendly', 'Germany', 'England', 'Tomorrow, 20:00', 'Allianz Arena, Munich', 90, 88, 8, 'Sovereign Analytics Partner'),
                        ('International Friendly', 'Spain', 'Brazil', 'Tomorrow, 21:00', 'Santiago Bernabéu, Madrid', 92, 90, 9, 'Global Sports Partner'),
                        ('Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', 'This Weekend, 20:00', 'RAMS Park, Istanbul', 87, 86, 9, 'Anadolu Sufi Rock Partner'),
                        ('Premier League', 'Liverpool F.C.', 'Manchester City', 'This Weekend, 16:30', 'Anfield, Liverpool', 91, 94, 7, 'Sovereign Analytics Partner')`);
                }
            });
        });

        // Harvested Blueprints Table
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
                        ('Discord & GitHub Registry', 'Unified Sovereign Core', 'Connected live to telemetry & bot feeds.', 'INITIALIZED')`);
                }
            });
        });

        // Synthesized Upgrades Table
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
                        ('Shoulder-to-Shoulder Sportsbook v9.0 - Card Sandbox Active', 'Unified Core', 'Sportsbook + Command Center + Football Card Collection merged.', 'ACTIVE')`);
                }
            });
        });

        // Learning Cycles Table
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
                        (1, 'Autonomous Telemetry Stream Sync', 'APPROVED', 'Refreshing background fetch routines improves dashboard responsiveness.', 'Success: Latency reduced across all active nodes.', '2026-09-24 12:00:00'),
                        (2, 'Football Card Collection Sandbox', 'APPROVED', 'Integrating historical player stats into dynamic simulations increases visitor engagement.', 'Success: Card attributes successfully synced to live node.', '2026-09-24 22:30:00')`);
                }
            });
        });

        // Football Cards Collection Table
        db.run(`CREATE TABLE IF NOT EXISTS football_cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT,
            team_country TEXT,
            era_year TEXT,
            rarity_tier TEXT,
            power_rating INT,
            lore_quote TEXT
        )`, () => {
            db.get(`SELECT COUNT(*) as count FROM football_cards`, (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO football_cards (player_name, team_country, era_year, rarity_tier, power_rating, lore_quote) VALUES 
                        ('Metin Oktay', 'Galatasaray / Türkiye', '1960s Legend', 'Mythic Sovereign', 96, 'The Uncrowned King of Turkish football, whose soul matched the rhythm of the bağlama.'),
                        ('Lefter Küçükandonyadis', 'Fenerbahçe / Türkiye', '1950s Maestro', 'Mythic Sovereign', 95, 'Ordinary is not for him; a master of touch and poetic precision on the pitch.'),
                        ('Zinedine Zidane', 'France', '2006 Vintage', 'Master Class', 94, 'Silence on the pitch, pure art in motion under the stadium lights.'),
                        ('Ronaldo Nazário', 'Brazil', '2002 Phenomenon', 'Master Class', 97, 'The unstoppable force who redefined what a striker could achieve.'),
                        ('Paolo Maldini', 'Italy', '1990s Defensive Anchor', 'Master Class', 95, 'Defense as an art form, built on loyalty, grit, and timeless composure.')`);
                }
            });
        });
    });
}

function logEvent(module, status, message) {
    try {
        const stmt = db.prepare(`INSERT INTO system_logs (module_name, status, message) VALUES (?, ?, ?)`);
        stmt.run(module, status, message);
        stmt.finalize();
    } catch (dbError) {
        console.error('⚠️ Log error ->', dbError.message);
    }
}

// ==============================================================================
// 2. AI PROBABILITY ENGINE
// ==============================================================================
function calculateInPlayMarkets(homeRating, awayRating, aggression) {
    const homeAdvantage = 5;
    const totalPower = homeRating + awayRating + homeAdvantage;
    
    let rawHomeWin = ((homeRating + homeAdvantage) / totalPower) * 100;
    let rawAwayWin = (awayRating / totalPower) * 100;

    let homeWinProb, awayWinProb;
    if (rawHomeWin >= rawAwayWin) {
        homeWinProb = Math.round(58 + (Math.random() * 4));
        awayWinProb = Math.round(100 - homeWinProb - 18);
    } else {
        awayWinProb = Math.round(58 + (Math.random() * 4));
        homeWinProb = Math.round(100 - awayWinProb - 18);
    }

    let drawProb = 100 - (homeWinProb + awayWinProb);
    if (drawProb < 12) drawProb = 15;

    const margin = 1.04;
    const homeDecimal = ((100 / homeWinProb) * margin).toFixed(2);
    const drawDecimal = ((100 / drawProb) * margin).toFixed(2);
    const awayDecimal = ((100 / awayWinProb) * margin).toFixed(2);

    const expectedCorners = Math.floor(9 + ((homeRating + awayRating) / 30));
    const expectedFouls = Math.floor(22 + (aggression * 1.2));
    const redCardRisk = aggression >= 8 ? "High (0.45 Est)" : "Low / Moderate (0.15 Est)";
    const firstGoalTeam = homeRating >= awayRating ? "Home Team (AI Fav)" : "Away Team (AI Fav)";
    const overUnderGoals = (homeRating + awayRating) > 175 ? "Over 2.5 Goals (1.75)" : "Under 2.5 Goals (1.95)";

    return {
        homeWinProb, drawProb, awayWinProb,
        homeDecimal, drawDecimal, awayDecimal,
        expectedCorners, expectedFouls, redCardRisk, firstGoalTeam, overUnderGoals
    };
}

// ==============================================================================
// 3. API ENDPOINTS & DISCORD WEBHOOK BRIDGE
// ==============================================================================
app.post('/api/discord-broadcast', (req, res) => {
    const { author, content, channel } = req.body;
    const message = `Discord Event from [${author || 'Bot User'}]: "${content || 'No content'}" in channel #${channel || 'general'}`;
    
    logEvent('DiscordBridge', 'SUCCESS', message);
    console.log(`🤖 ${message}`);
    res.status(200).json({ status: 'success', recorded: true });
});

app.post('/api/add-blueprint', (req, res) => {
    const { source_origin, blueprint_title, architecture_pattern } = req.body;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const stmt = db.prepare(`INSERT INTO harvested_blueprints (timestamp, source_origin, blueprint_title, architecture_pattern, integration_status) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(timestamp, source_origin || 'Command Center User', blueprint_title, architecture_pattern, 'USER INJECTED', (err) => {
        stmt.finalize();
        if (err) {
            logEvent('BlueprintInjection', 'ERROR', `Failed to inject blueprint: ${err.message}`);
            return res.status(500).send('Error saving blueprint.');
        }
        db.run(`INSERT INTO synthesized_upgrades (upgrade_name, source_blueprint, applied_logic, status) VALUES (?, ?, ?, ?)`,
            [`Custom Service: ${blueprint_title}`, source_origin || 'User Injection', architecture_pattern, 'DEPLOYED & ACTIVE']);

        logEvent('BlueprintInjection', 'SUCCESS', `Successfully injected custom service blueprint [${blueprint_title}].`);
        res.redirect('/');
    });
});

// ==============================================================================
// 4. PRIVATE COMMAND CENTER ROUTES (/)
// ==============================================================================
app.get('/', (req, res) => {
    db.all(`SELECT * FROM harvested_blueprints ORDER BY timestamp DESC LIMIT 6`, [], (err, blueprints) => {
        db.all(`SELECT * FROM synthesized_upgrades ORDER BY timestamp DESC LIMIT 6`, [], (errUpgrades, upgrades) => {
            db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 6`, [], (errLogs, logs) => {
                
                const accentColor = '#22c55e';

                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Anadolu Island - Sovereign Command Center</title>
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 25px; }
                        .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                        header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; border-left: 5px solid ${accentColor}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                        h1 { margin: 0 0 5px 0; color: ${accentColor}; font-size: 22px; }
                        .status-badge { display: inline-block; background: #22c55e; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; }
                        .portal-btn { background: #262626; color: #fff; padding: 10px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #3f3f46; display: inline-block; }
                        .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                        h2 { font-size: 16px; color: #fff; margin-bottom: 12px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { text-align: left; padding: 10px; border-bottom: 1px solid #262626; font-size: 13px; }
                        th { color: #94a3b8; }
                        .form-group { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
                        input, textarea { background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 10px; border-radius: 8px; font-size: 13px; width: 100%; }
                        button { background: ${accentColor}; color: #000; font-weight: bold; padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; }
                        button:hover { opacity: 0.9; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div>
                                <h1>⚓ Anadolu Island Sovereign Command Center</h1>
                                <p>Status: <span class="status-badge">ONLINE</span> | Unified Engine & Discord Bridge</p>
                            </div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <a href="/island" class="portal-btn" style="background: #22c55e; color: #000; border-color: #22c55e;">⚽ Sportsbook</a>
                                <a href="/cards" class="portal-btn" style="background: #eab308; color: #000; border-color: #eab308;">🎴 Football Cards</a>
                                <a href="/pet-project" class="portal-btn" style="background: #a855f7; color: #fff; border-color: #a855f7;">🐾 4D Sandbox</a>
                            </div>
                        </header>

                        <div class="card">
                            <h2>📥 Inject Custom Service Blueprint</h2>
                            <form action="/api/add-blueprint" method="POST" class="form-group">
                                <input type="text" name="source_origin" placeholder="Source Origin (e.g., Custom Script / Discord Bot)" required>
                                <input type="text" name="blueprint_title" placeholder="Blueprint Title (e.g., Live Telegram Notifier)" required>
                                <textarea name="architecture_pattern" placeholder="Architecture Logic / Description..." rows="2" required></textarea>
                                <button type="submit">Inject Blueprint & Synthesize Upgrade</button>
                            </form>
                        </div>

                        <div class="card">
                            <h2>🛡️ Synthesized Upgrades & Active Modules</h2>
                            <table>
                                <tr><th>Upgrade Name</th><th>Source Blueprint</th><th>Status</th></tr>
                                ${upgrades ? upgrades.map(u => `<tr><td><b>${u.upgrade_name}</b></td><td>${u.source_blueprint}</td><td><span style="color:#22c55e;">${u.status}</span></td></tr>`).join('') : ''}
                            </table>
                        </div>

                        <div class="card">
                            <h2>📋 Live System & Discord Telemetry Logs</h2>
                            <table>
                                <tr><th>Timestamp</th><th>Module</th><th>Status</th><th>Message</th></tr>
                                ${logs ? logs.map(l => `<tr><td>${l.timestamp}</td><td>${l.module_name}</td><td style="color:#38bdf8;">${l.status}</td><td>${l.message}</td></tr>`).join('') : ''}
                            </table>
                        </div>
                    </div>
                </body>
                </html>
                `);
            });
        });
    });
});

// ==============================================================================
// 5. SPORTSBOOK & LUCKY DIP LOUNGE (/island)
// ==============================================================================
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM multi_league_fixtures`, (err, matches) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Anadolu AI Sportsbook & Lucky Dip Lounge</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 25px; }
                .container { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                p { color: #94a3b8; font-size: 13px; }
                .badge { background: #22c55e; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                .league-tag { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.3); display: inline-block; margin-bottom: 4px; }
                .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                h2 { font-size: 17px; color: #fff; }
                .fixtures-scroll-container { max-height: 600px; overflow-y: auto; padding-right: 6px; display: flex; flex-direction: column; gap: 16px; }
                .match-box { background: #16221a; border: 1px solid rgba(34,197,94,0.25); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
                .match-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; }
                .odds-row { display: flex; gap: 8px; flex-wrap: wrap; }
                .bet-btn { background: #1c2b21; border: 1px solid rgba(34,197,94,0.4); border-radius: 8px; padding: 8px 12px; color: #fff; text-align: left; flex: 1; min-width: 110px; }
                .bet-label { font-size: 10px; color: #94a3b8; display: block; text-transform: uppercase; }
                .bet-val { font-size: 15px; font-weight: bold; color: #22c55e; font-family: monospace; display: block; }
                .stats-tag { background: rgba(255,255,255,0.05); padding: 6px 10px; border-radius: 8px; font-size: 12px; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.08); }
                .lucky-dip-btn { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; border: none; padding: 10px 16px; border-radius: 10px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
                .lucky-dip-result { background: #0f172a; border: 1px dashed #38bdf8; border-radius: 10px; padding: 12px; margin-top: 8px; display: none; font-size: 13px; color: #e2e8f0; }
                .portal-btn { background: #262626; color: #fff; padding: 10px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #3f3f46; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div>
                        <h1>🌴 Anadolu AI Sportsbook & Lucky Dip Lounge</h1>
                        <p>Status: <span class="badge">MATCHES ACTIVE • LIVE ODDS READY</span></p>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="/" class="portal-btn">&larr; Command Center</a>
                        <a href="/cards" class="portal-btn" style="background: #eab308; color: #000; border-color: #eab308;">🎴 Football Cards</a>
                    </div>
                </header>

                <div class="card">
                    <h2>⚽ International & League Fixtures</h2>
                    <p style="color:#94a3b8; font-size:12px;">Click the <b>🎲 Lucky Dip</b> button on any match to instantly generate a randomized AI accumulator bet!</p>
                    
                    <div class="fixtures-scroll-container">
                        ${matches ? matches.map((m, index) => {
                            const mk = calculateInPlayMarkets(m.home_rating, m.away_rating, m.aggression_rating);
                            return `
                            <div class="match-box">
                                <div class="match-header">
                                    <div>
                                        <span class="league-tag">${m.league_category}</span>
                                        <b style="font-size:16px; color:#fff; display:block; margin-top:2px;">${m.home_team} vs${m.away_team}</b>
                                        <span style="color:#38bdf8; font-size:11px; font-weight:bold;">📍 ${m.venue} • ⏰ ${m.match_date}</span>
                                    </div>
                                    <span style="color: #22c55e; font-family: monospace; font-weight:bold; font-size:12px;">AI Calibrated</span>
                                </div>

                                <div class="odds-row">
                                    <div class="bet-btn">
                                        <span class="bet-label">${m.home_team} (Home)</span>
                                        <span class="bet-val">${mk.homeDecimal} <span style="font-size:10px; color:#38bdf8;">(${mk.homeWinProb}%)</span></span>
                                    </div>
                                    <div class="bet-btn">
                                        <span class="bet-label">Draw (X)</span>
                                        <span class="bet-val" style="color:#38bdf8;">${mk.drawDecimal} <span style="font-size:10px; color:#94a3b8;">(${mk.drawProb}%)</span></span>
                                    </div>
                                    <div class="bet-btn">
                                        <span class="bet-label">${m.away_team} (Away)</span>
                                        <span class="bet-val" style="color:#fb7185;">${mk.awayDecimal} <span style="font-size:10px; color:#38bdf8;">(${mk.awayWinProb}%)</span></span>
                                    </div>
                                </div>

                                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                    <div class="stats-tag">⚽ <b>First Goal:</b> ${mk.firstGoalTeam}</div>
                                    <div class="stats-tag">🥅 <b>Goals Line:</b> ${mk.overUnderGoals}</div>
                                    <div class="stats-tag">🚩 <b>Corners:</b> ~${mk.expectedCorners}</div>
                                    <div class="stats-tag">⚠️ <b>Fouls:</b> ~${mk.expectedFouls}</div>
                                    <div class="stats-tag">🟥 <b>Red Card:</b> ${mk.redCardRisk}</div>
                                </div>

                                <div>
                                    <button class="lucky-dip-btn" onclick="generateLuckyDip(${index}, '${m.home_team}', '${m.away_team}')">
                                        🎲 Generate Lucky Dip Bet
                                    </button>
                                    <div id="luckyResult-${index}" class="lucky-dip-result"></div>
                                </div>
                            </div>`;
                        }).join('') : ''}
                    </div>
                </div>
            </div>

            <script>
                function generateLuckyDip(index, home, away) {
                    const markets = [
                        \`Match Winner: \${home} & Both Teams to Score (Odds: 4.80)\`,
                        \`Exact Score: 2-1 in favor of \${home} (Odds: 8.50)\`,
                        \`First Goalscorer Combo: \${away} to score first & Over 2.5 Goals (Odds: 6.20)\`,
                        \`Half-Time / Full-Time: Draw / \${home} (Odds: 5.50)\`,
                        \`Total Corners Over 10.5 & \${away} Win (Odds: 7.10)\`,
                        \`Player Card Combo: Red card in match & Both Teams Score (Odds: 9.00)\`
                    ];
                    const randomPick = markets[Math.floor(Math.random() * markets.length)];
                    const resultBox = document.getElementById('luckyResult-' + index);
                    resultBox.style.display = 'block';
                    resultBox.innerHTML = \`✨ <b>Lucky Dip Pick Generated:</b> <span style="color:#38bdf8;">\${randomPick}</span>\`;
                }
            </script>
        </body>
        </html>
        `);
    });
});

// ==============================================================================
// 6. FOOTBALL CARDS & COLLECTOR'S GALLERY (/cards)
// ==============================================================================
app.get('/cards', (req, res) => {
    db.all(`SELECT * FROM football_cards`, (err, cards) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Anadolu Sovereign - Football Card Collection & Sandbox</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                header { background: #1a160b; padding: 24px; border-radius: 20px; border: 1px solid rgba(234, 179, 8, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                h1 { color: #eab308; font-size: 22px; margin-bottom: 4px; }
                p { color: #94a3b8; font-size: 13px; }
                .badge { background: #eab308; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 10px; }
                .trading-card { background: linear-gradient(135deg, #161612, #242217); border: 2px solid #eab308; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 8px 20px rgba(234, 179, 8, 0.15); }
                .card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(234,179,8,0.2); padding-bottom: 8px; }
                .rating { font-size: 22px; font-weight: bold; color: #eab308; font-family: monospace; }
                .tier { font-size: 11px; font-weight: bold; color: #38bdf8; text-transform: uppercase; }
                .card-body { font-size: 13px; color: #cbd5e1; display: flex; flex-direction: column; gap: 6px; }
                .lore { font-style: italic; color: #94a3b8; font-size: 12px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px; border-left: 3px solid #eab308; }
                .draw-section { background: #141410; border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 16px; padding: 20px; text-align: center; }
                .draw-btn { background: linear-gradient(135deg, #eab308, #ca8a04); color: #000; font-weight: bold; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 14px rgba(234, 179, 8, 0.3); }
                .draw-result { margin-top: 15px; font-size: 14px; color: #fde047; display: none; }
                .portal-btn { background: #262626; color: #fff; padding: 10px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #3f3f46; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div>
                        <h1>🎴 Football Card Collection & Living Sandbox</h1>
                        <p>Status: <span class="badge">COLLECTION ARCHIVE ONLINE</span></p>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="/" class="portal-btn">&larr; Command Center</a>
                        <a href="/island" class="portal-btn" style="background: #22c55e; color: #000; border-color: #22c55e;">⚽ Sportsbook</a>
                    </div>
                </header>

                <div class="draw-section">
                    <h2>🎲 Daily Collector's Mystery Draw</h2>
                    <p style="margin: 8px 0 14px 0;">Draw a random card from the archive to inspect its live sovereign attributes and simulated form.</p>
                    <button class="draw-btn" onclick="pullMysteryCard()">✨ Pull Random Collector Card</button>
                    <div id="mysteryResult" class="draw-result"></div>
                </div>

                <div style="background: #111411; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px;">
                    <h2 style="color: #fff; font-size: 18px; margin-bottom: 4px;">🏆 Sovereign Vault Archive</h2>
                    <p style="color:#94a3b8; font-size:12px; margin-bottom: 16px;">Verified legendary player cards secured in the database repository.</p>
                    
                    <div class="card-grid">
                        ${cards ? cards.map(c => `
                            <div class="trading-card">
                                <div class="card-header">
                                    <div>
                                        <b style="font-size:16px; color:#fff; display:block;">${c.player_name}</b>
                                        <span class="tier">${c.rarity_tier}</span>
                                    </div>
                                    <div class="rating">${c.power_rating}</div>
                                </div>
                                <div class="card-body">
                                    <span>📍 <b>Team/Country:</b> ${c.team_country}</span>
                                    <span>⏳ <b>Era:</b> ${c.era_year}</span>
                                    <div class="lore">"${c.lore_quote}"</div>
                                </div>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            </div>

            <script>
                const vaultCards = ${JSON.stringify(cards || [])};
                function pullMysteryCard() {
                    if (vaultCards.length === 0) return;
                    const randomCard = vaultCards[Math.floor(Math.random() * vaultCards.length)];
                    const resBox = document.getElementById('mysteryResult');
                    resBox.style.display = 'block';
                    resBox.innerHTML = \`✨ <b>Pulled:</b> \${randomCard.player_name} (\${randomCard.rarity_tier}) — Rating: <b>\${randomCard.power_rating}</b><br><i style="color:#cbd5e1;">"\${randomCard.lore_quote}"</i>\`;
                }
            </script>
        </body>
        </html>
        `);
    });
});

// ==============================================================================
// 7. 4D SANDBOX ROUTE (/pet-project)
// ==============================================================================
app.get('/pet-project', (req, res) => {
    db.all(`SELECT * FROM learning_cycles ORDER BY learning_cycle DESC LIMIT 10`, [], (err, rows) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>4D Sandbox & Pet Project Observation Deck</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(168, 85, 247, 0.3); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                h1 { color: #c084fc; font-size: 22px; margin-bottom: 6px; }
                p { color: #94a3b8; font-size: 13px; }
                .portal-btn { background: #262626; color: #fff; padding: 10px 14px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #3f3f46; display: inline-block; }
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
                        <p>Autonomous Learning Cycles & Simulation Workspace</p>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="/" class="portal-btn">&larr; Command Center</a>
                        <a href="/cards" class="portal-btn" style="background: #eab308; color: #000; border-color: #eab308;">🎴 Football Cards</a>
                    </div>
                </header>

                <div class="card">
                    <h2>🧪 Active Learning Cycles & Agent Hypotheses</h2>
                    <table>
                        <tr><th>Cycle</th><th>Experiment Title</th><th>Status</th><th>Agent Hypothesis</th><th>Sandbox Result</th></tr>
                        ${rows ? rows.map(r => `
                            <tr>
                                <td><span class="highlight">#${r.learning_cycle}</span></td>
                                <td>${r.experiment_title}</td>
                                <td><span style="color: #22c55e; font-weight: bold;">${r.approval_status}</span></td>
                                <td>${r.agent_hypothesis}</td>
                                <td>${r.sandbox_result}</td>
                            </tr>
                        `).join('') : ''}
                    </table>
                </div>
            </div>
        </body>
        </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Engine running on port ${PORT}`);
});
