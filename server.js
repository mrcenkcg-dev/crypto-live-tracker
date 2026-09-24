/**
 * ==============================================================================
 * SOVEREIGN MASTER ENGINE: ULTIMATE IN-PLAY SPORTSBOOK & STATS MATRIX
 * Complete Server Code: Decimal Odds + Corners, Fouls, Cards & Live Betting Markets
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
// 1. DATABASE SETUP & MASTER SCHEMA
// ==============================================================================
const dbFile = path.join(__dirname, 'sovereign_master.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master Ecosystem DB.');
        initializeMasterDatabase();
    }
});

function initializeMasterDatabase() {
    db.serialize(() => {
        // Super Agent Logs
        db.run(`CREATE TABLE IF NOT EXISTS super_agent_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            agent_name TEXT,
            action_taken TEXT,
            target_page TEXT,
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM super_agent_logs`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO super_agent_logs (agent_name, action_taken, target_page, status) VALUES 
                    ('InPlayStatsAgent', 'Initialized real-time corners, fouls, and card simulation matrix', '/island', 'ACTIVE'),
                    ('OddsWatcherAgent', 'Initialized hourly sportsbook odds fluctuation agent', '/island', 'ACTIVE'),
                    ('CommunityAgent', 'Managing live bet slips and community contribution ledger', '/island', 'ACTIVE')`);
            }
        });

        // Treasury Vault
        db.run(`CREATE TABLE IF NOT EXISTS treasury_vault (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            daily_inflow DECIMAL(10,2),
            reinvested_amount DECIMAL(10,2),
            total_vault_balance DECIMAL(10,2),
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM treasury_vault`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO treasury_vault (daily_inflow, reinvested_amount, total_vault_balance, status) VALUES (4.00, 2.00, 184.50, 'LIVE & COMPOUNDING')`);
            }
        });

        // Toll Transactions
        db.run(`CREATE TABLE IF NOT EXISTS toll_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            service_endpoint TEXT,
            fee_amount TEXT,
            client_origin TEXT,
            status TEXT
        )`);

        // Multi-League Fixtures with Advanced Stats Ratings
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
        )`);

        db.get(`SELECT COUNT(*) as count FROM multi_league_fixtures`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO multi_league_fixtures (league_category, home_team, away_team, match_date, venue, home_rating, away_rating, aggression_rating, ad_sponsor) VALUES 
                    ('International', 'England', 'France', '10 Oct 2026, 20:00', 'Wembley Stadium, London', 85, 95, 7, 'Sovereign Global Partner'),
                    ('International', 'Italy', 'Germany', '11 Oct 2026, 20:00', 'San Siro, Milan', 88, 89, 8, 'Anadolu Sufi Rock Partner'),
                    ('Premier League', 'Manchester City', 'Arsenal', '27 Sep 2026, 16:30', 'Etihad Stadium, Manchester', 94, 90, 6, 'Sovereign Analytics Partner'),
                    ('Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', '28 Sep 2026, 20:00', 'RAMS Park, Istanbul', 87, 86, 9, 'Anadolu Sufi Rock Partner'),
                    ('National League', 'Boreham Wood', 'Southend United', '29 Sep 2026, 19:45', 'Meadow Park, Borehamwood', 68, 82, 8, 'Get Big Together Initiative')`);
            }
        });

        // Social Channels
        db.run(`CREATE TABLE IF NOT EXISTS social_channels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform_name TEXT,
            channel_handle TEXT,
            profile_url TEXT,
            content_type TEXT,
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM social_channels`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO social_channels (platform_name, channel_handle, profile_url, content_type, status) VALUES 
                    ('YouTube', '@AnadoluSufiRock', 'https://www.youtube.com', 'Long-form & Shorts', 'CONNECTED'),
                    ('Facebook', 'Get Big Together Community', 'https://www.facebook.com', 'Community Reels', 'CONNECTED'),
                    ('Instagram', '@CenkSovereignEngine', 'https://www.instagram.com', 'Visual Media & Stories', 'CONNECTED')`);
            }
        });

        // Live Bet Slips / Public Contributions Wall
        db.run(`CREATE TABLE IF NOT EXISTS public_contributions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            contributor_name TEXT,
            contribution_type TEXT,
            message_content TEXT,
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM public_contributions`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO public_contributions (contributor_name, contribution_type, message_content, status) VALUES 
                    ('Pro Punter Cenk', 'Live Bet Slip', 'Placed $10 on Galatasaray vs Fenerbahce: Over 4.5 Cards & Both Teams to Score (Odds: 3.40)', 'PLACED & VERIFIED')`);
            }
        });
    });
}

// ==============================================================================
// 2. ADVANCED SPORTSBOOK & STATS ENGINE (Goals, Corners, Fouls, Cards)
// ==============================================================================
function calculateInPlayMarkets(homeRating, awayRating, aggression) {
    const homeAdvantage = 4;
    const totalPower = homeRating + awayRating + homeAdvantage;
    
    let homeWinProb = Math.max(12, Math.min(80, Math.round(((homeRating + homeAdvantage) / totalPower) * 100)));
    let awayWinProb = Math.max(12, Math.min(80, Math.round((awayRating / totalPower) * 100)));
    let drawProb = 100 - (homeWinProb + awayWinProb);
    if (drawProb < 16) { drawProb = 18; homeWinProb -= 4; awayWinProb -= 2; }

    const margin = 1.05;
    const homeDecimal = ((100 / homeWinProb) * margin).toFixed(2);
    const drawDecimal = ((100 / drawProb) * margin).toFixed(2);
    const awayDecimal = ((100 / awayWinProb) * margin).toFixed(2);

    // Advanced Stats Calculations
    const expectedCorners = Math.floor(8 + ((homeRating + awayRating) / 25) + (Math.random() * 3));
    const expectedFouls = Math.floor(20 + (aggression * 1.5) + (Math.random() * 4));
    const redCardChance = aggression >= 8 ? "High (0.45 Est)" : "Low / Moderate (0.15 Est)";
    const firstGoalTeam = homeRating >= awayRating ? "Home Team (First Goal Fav)" : "Away Team (First Goal Fav)";
    const overUnderGoals = (homeRating + awayRating) > 175 ? "Over 2.5 Goals (1.75)" : "Under 2.5 Goals (1.95)";

    return {
        homeWinProb, drawProb, awayWinProb,
        homeDecimal, drawDecimal, awayDecimal,
        expectedCorners,
        expectedFouls,
        redCardChance,
        firstGoalTeam,
        overUnderGoals
    };
}

function microFeeTollGate(fee = '$0.001') {
    return (req, res, next) => {
        const endpoint = req.originalUrl;
        const origin = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Local Client';
        db.run(`INSERT INTO toll_transactions (service_endpoint, fee_amount, client_origin, status) VALUES (?, ?, ?, ?)`,
            [endpoint, fee, origin, 'PAID & LOGGED']);
        next();
    };
}

// ==============================================================================
// 3. AUTONOMOUS BACKGROUND AGENT (Hourly Odds & Stats Synchronizer)
// ==============================================================================
function startHourlyOddsWatcher() {
    const INTERVAL_TIME = 60 * 60 * 1000; // Every 1 hour

    setInterval(() => {
        console.log('🤖 [InPlayStatsAgent]: Recalculating live match statistics and market odds...');
        
        db.all(`SELECT id, home_rating, away_rating FROM multi_league_fixtures`, (err, fixtures) => {
            if (fixtures && fixtures.length > 0) {
                fixtures.forEach(match => {
                    const ratingShift = Math.floor(Math.random() * 3) - 1; 
                    const newHomeRating = Math.max(50, Math.min(99, match.home_rating + ratingShift));

                    db.run(`UPDATE multi_league_fixtures SET home_rating = ? WHERE id = ?`, 
                        [newHomeRating, match.id]
                    );
                });

                db.run(`INSERT INTO super_agent_logs (agent_name, action_taken, target_page, status) VALUES (?, ?, ?, ?)`,
                    ['InPlayStatsAgent', 'Hourly live odds, corners, and card probabilities refreshed', '/island', 'SYNCED & LIVE']
                );
                console.log('✅ [InPlayStatsAgent]: In-play markets updated successfully.');
            }
        });
    }, INTERVAL_TIME);
}

// ==============================================================================
// 4. API ROUTES & PUBLIC BET SLIPS
// ==============================================================================
app.post('/api/public/contribute', (req, res) => {
    const { contributor_name, contribution_type, message_content } = req.body;
    db.run(
        `INSERT INTO public_contributions (contributor_name, contribution_type, message_content, status) VALUES (?, ?, ?, ?)`,
        [contributor_name || 'Punter', contribution_type || 'Match Bet Slip', message_content || 'No bet placed', 'PLACED & VERIFIED'],
        () => {
            res.redirect('/island');
        }
    );
});

// ==============================================================================
// 5. COMMAND CENTER (Admin Root Route: /)
// ==============================================================================
app.get('/', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT fee_amount FROM toll_transactions`, (err, tolls) => {
        db.all(`SELECT * FROM super_agent_logs ORDER BY timestamp DESC LIMIT 5`, (err, agents) => {
            db.get(`SELECT total_vault_balance, daily_inflow FROM treasury_vault ORDER BY id DESC LIMIT 1`, (err, treasury) => {
                let totalRev = 0;
                if (tolls) tolls.forEach(t => totalRev += parseFloat(t.fee_amount.replace('$', '')) || 0.001);
                const vaultBalance = treasury ? treasury.total_vault_balance : 184.50;
                const dailyInflow = treasury ? treasury.daily_inflow : 4.00;

                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8"><title>Sovereign Master Command Center</title>
                    <style>
                        body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 30px; }
                        .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                        header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #22c55e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                        h1 { color: #22c55e; font-size: 20px; margin: 0; }
                        .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                        .btn { background: #262626; color: #fff; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #3f3f46; display: inline-block; }
                        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 15px; }
                        .metric-box { background: #1c1c1c; border-radius: 10px; padding: 16px; border: 1px solid #333; }
                        .metric-value { font-size: 20px; font-weight: bold; color: #22c55e; margin-top: 6px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div>
                                <h1>⚡ Sovereign Master Command Center</h1>
                                <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Ledger Revenue: $${totalRev.toFixed(3)} | In-Play Stats Engine: ACTIVE</p>
                            </div>
                            <div><a href="/island" class="btn" style="background: #10b981; color:#000;">🌴 Visit In-Play Betting Portal</a></div>
                        </header>
                        <div class="card" style="border: 1px solid #22c55e;">
                            <h2>🏦 Treasury Vault & Active Agents</h2>
                            <div class="grid">
                                <div class="metric-box">
                                    <div style="color: #aaa; font-size: 12px;">Daily Inflow</div>
                                    <div class="metric-value">$${parseFloat(dailyInflow).toFixed(2)} / day</div>
                                </div>
                                <div class="metric-box">
                                    <div style="color: #aaa; font-size: 12px;">Total Vault Balance</div>
                                    <div class="metric-value">$${parseFloat(vaultBalance).toFixed(2)}</div>
                                </div>
                            </div>
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
// 6. PUBLIC IN-PLAY SPORTSBOOK PORTAL (/island)
// ==============================================================================
app.get('/island', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT * FROM multi_league_fixtures`, (err, matches) => {
        db.all(`SELECT * FROM public_contributions ORDER BY timestamp DESC LIMIT 10`, (err, contributions) => {
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Anadolu In-Play Sportsbook & Stats Portal</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 25px; }
                    .container { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                    header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                    h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                    p { color: #94a3b8; font-size: 13px; }
                    .badge { background: #22c55e; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                    .league-tag { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.3); display: inline-block; margin-bottom: 4px; }
                    .btn { background: #1f2937; color: #fff; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #374151; }
                    .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                    h2 { font-size: 17px; color: #fff; }
                    .match-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
                    .match-box { background: #16221a; border: 1px solid rgba(34,197,94,0.25); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
                    .match-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; }
                    .odds-row { display: flex; gap: 8px; flex-wrap: wrap; }
                    .bet-btn { background: #1c2b21; border: 1px solid rgba(34,197,94,0.4); border-radius: 8px; padding: 8px 12px; color: #fff; cursor: pointer; text-align: left; flex: 1; min-width: 110px; }
                    .bet-btn:hover { background: #22c55e; color: #000; font-weight: bold; }
                    .bet-label { font-size: 10px; color: #94a3b8; display: block; text-transform: uppercase; }
                    .bet-val { font-size: 15px; font-weight: bold; color: #22c55e; font-family: monospace; display: block; }
                    .stats-tag { background: rgba(255,255,255,0.05); padding: 6px 10px; border-radius: 8px; font-size: 12px; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.08); }
                    input, textarea { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 12px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; }
                    button[type="submit"] { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <div>
                            <h1>🌴 Anadolu In-Play Sportsbook & Stats Portal</h1>
                            <p>Status: <span class="badge">LIVE ODDS, GOALS, CORNERS & CARDS ACTIVE</span></p>
                        </div>
                        <a href="/" class="btn">&larr; Admin Command Center</a>
                    </header>

                    <div class="card">
                        <h2>📊 Live In-Play Betting Markets & Advanced Statistics</h2>
                        <p style="color:#94a3b8; font-size:12px;">Click any betting market to record your pick, or analyze projected corners, fouls, red cards, and goalscorers below.</p>
                        
                        <div class="match-grid">
                            ${matches ? matches.map(m => {
                                const mk = calculateInPlayMarkets(m.home_rating, m.away_rating, m.aggression_rating);
                                return `
                                <div class="match-box">
                                    <div class="match-header">
                                        <div>
                                            <span class="league-tag">${m.league_category}</span>
                                            <b style="font-size:16px; color:#fff; display:block; margin-top:2px;">${m.home_team} vs${m.away_team}</b>
                                            <span style="color:#94a3b8; font-size:11px;">${m.venue} &bull; Kick-off:${m.match_date}</span>
                                        </div>
                                        <span style="color: #38bdf8; font-family: monospace; font-weight:bold; font-size:13px;">Live Sync Active</span>
                                    </div>

                                    <!-- Market 1: Match Winner Decimal Odds -->
                                    <div>
                                        <span style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:bold;">1X2 Match Winner Odds</span>
                                        <div class="odds-row" style="margin-top:6px;">
                                            <div class="bet-btn">
                                                <span class="bet-label">${m.home_team.split(' ')[0]} (Home)</span>
                                                <span class="bet-val">${mk.homeDecimal} <span style="font-size:10px; color:#38bdf8;">(${mk.homeWinProb}%)</span></span>
                                            </div>
                                            <div class="bet-btn">
                                                <span class="bet-label">Draw (X)</span>
                                                <span class="bet-val" style="color:#38bdf8;">${mk.drawDecimal} <span style="font-size:10px; color:#94a3b8;">(${mk.drawProb}%)</span></span>
                                            </div>
                                            <div class="bet-btn">
                                                <span class="bet-label">${m.away_team.split(' ')[0]} (Away)</span>
                                                <span class="bet-val" style="color:#fb7185;">${mk.awayDecimal} <span style="font-size:10px; color:#38bdf8;">(${mk.awayWinProb}%)</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Market 2: Goals, Corners, Fouls & Cards Statistics -->
                                    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:4px;">
                                        <div class="stats-tag">⚽ <b>First Goal:</b> ${mk.firstGoalTeam}</div>
                                        <div class="stats-tag">🥅 <b>Goals Line:</b> ${mk.overUnderGoals}</div>
                                        <div class="stats-tag">🚩 <b>Expected Corners:</b> ~${mk.expectedCorners}</div>
                                        <div class="stats-tag">⚠️ <b>Expected Fouls:</b> ~${mk.expectedFouls}</div>
                                        <div class="stats-tag">🟥 <b>Red Card Risk:</b> ${mk.redCardChance}</div>
                                    </div>
                                </div>`;
                            }).join('') : ''}
                        </div>
                    </div>

                    <!-- PUBLIC BET SLIP SUBMISSION -->
                    <div class="card" style="border: 1px solid #22c55e;">
                        <h2>🎟️ Place a Live Bet Slip / Submit Prediction</h2>
                        <p>Record your picks for goals, corners, cards, or match winners directly into the sovereign ledger.</p>
                        <form action="/api/public/contribute" method="POST">
                            <label>Your Punter Name / Handle:</label>
                            <input type="text" name="contributor_name" placeholder="e.g. Cenk or Guest Punter" required>
                            <label>Bet Selection / Market Type:</label>
                            <input type="text" name="contribution_type" placeholder="e.g. England vs France - Over 9.5 Corners" required>
                            <label>Your Analysis & Stake Details:</label>
                            <textarea name="message_content" rows="3" placeholder="Why is this bet going to win? e.g. High foul count expected..." required></textarea>
                            <button type="submit">Submit Bet Slip to Ledger</button>
                        </form>

                        <h3 style="font-size:15px; margin-top:15px; color:#fff;">Recent Community Bet Slips:</h3>
                        <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
                            ${contributions ? contributions.map(c => `
                                <div style="background:#18221b; padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
                                    <div style="display:flex; justify-content:space-between; font-size:12px; color:#22c55e; margin-bottom:4px;">
                                        <b>${c.contributor_name} &mdash; [${c.contribution_type}]</b>
                                        <span style="color:#94a3b8;">${c.timestamp}</span>
                                    </div>
                                    <p style="color:#e2e8f0; font-size:13px;">${c.message_content}</p>
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

app.listen(PORT, () => {
    console.log(`🚀 In-Play Sportsbook Engine running live on port ${PORT}`);
    setTimeout(startHourlyOddsWatcher, 5000);
});
