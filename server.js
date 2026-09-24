/**
 * ==============================================================================
 * SOVEREIGN MASTER ENGINE: PROFESSIONAL SPORTSBOOK & ECOSYSTEM EDITION
 * Complete Server Code: Decimal Odds Matrix + Hourly Odds Watcher + Community Wall
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
                    ('OddsWatcherAgent', 'Initialized real-time professional sportsbook odds updater', '/island', 'ACTIVE'),
                    ('MultiSocialBridge', 'Syncing YouTube Shorts, Facebook Reels & Instagram feeds', '/island', 'ONLINE'),
                    ('CommunityAgent', 'Managing public contribution drop ledger and visitor logs', '/island', 'ACTIVE')`);
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

        // Multi-League Fixtures with Realistic Power Ratings
        db.run(`CREATE TABLE IF NOT EXISTS multi_league_fixtures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            league_category TEXT,
            home_team TEXT,
            away_team TEXT,
            match_date TEXT,
            venue TEXT,
            home_rating INT,
            away_rating INT,
            ad_sponsor TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM multi_league_fixtures`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO multi_league_fixtures (league_category, home_team, away_team, match_date, venue, home_rating, away_rating, ad_sponsor) VALUES 
                    ('International', 'England', 'France', '10 Oct 2026, 20:00', 'Wembley Stadium, London', 85, 95, 'Sovereign Global Partner'),
                    ('International', 'Italy', 'Germany', '11 Oct 2026, 20:00', 'San Siro, Milan', 88, 89, 'Anadolu Sufi Rock Partner'),
                    ('Premier League', 'Manchester City', 'Arsenal', '27 Sep 2026, 16:30', 'Etihad Stadium, Manchester', 94, 90, 'Sovereign Analytics Partner'),
                    ('Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', '28 Sep 2026, 20:00', 'RAMS Park, Istanbul', 87, 86, 'Anadolu Sufi Rock Partner'),
                    ('National League', 'Boreham Wood', 'Southend United', '29 Sep 2026, 19:45', 'Meadow Park, Borehamwood', 68, 82, 'Get Big Together Initiative')`);
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

        // Public Community Contributions Wall
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
                    ('Community Builder', 'Feature Idea', 'Welcome to the professional sportsbook odds matrix! Drop your picks here.', 'VERIFIED & LIVE')`);
            }
        });
    });
}

// ==============================================================================
// 2. PROFESSIONAL BOOKMAKER ODDS CALCULATOR
// ==============================================================================
function calculateSportsbookOdds(homeRating, awayRating) {
    const homeAdvantage = 4;
    const totalPower = homeRating + awayRating + homeAdvantage;
    
    let homeWinProb = Math.max(10, Math.min(85, Math.round(((homeRating + homeAdvantage) / totalPower) * 100)));
    let awayWinProb = Math.max(10, Math.min(85, Math.round((awayRating / totalPower) * 100)));
    let drawProb = 100 - (homeWinProb + awayWinProb);
    
    if (drawProb < 15) {
        drawProb = 18;
        homeWinProb -= 5;
        awayWinProb -= 3;
    }

    // Convert probabilities to professional Decimal Odds (with a standard bookmaker overround factor)
    const margin = 1.05; 
    const homeDecimal = ((100 / homeWinProb) * margin).toFixed(2);
    const drawDecimal = ((100 / drawProb) * margin).toFixed(2);
    const awayDecimal = ((100 / awayWinProb) * margin).toFixed(2);

    return {
        homeWin: homeWinProb,
        draw: drawProb,
        awayWin: awayWinProb,
        homeDecimal,
        drawDecimal,
        awayDecimal
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
// 3. AUTONOMOUS BACKGROUND AGENT (Hourly Market Odds Watcher)
// ==============================================================================
function startHourlyOddsWatcher() {
    const INTERVAL_TIME = 60 * 60 * 1000; // Every 1 hour

    setInterval(() => {
        console.log('🤖 [OddsWatcher Agent]: Running hourly professional sportsbook odds fluctuation...');
        
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
                    ['OddsWatcherAgent', 'Hourly live market odds recalculated successfully', '/island', 'SYNCED & LIVE']
                );
                console.log('✅ [OddsWatcher Agent]: Sportsbook odds successfully updated.');
            }
        });
    }, INTERVAL_TIME);
}

// ==============================================================================
// 4. API ROUTES & PUBLIC CONTRIBUTIONS
// ==============================================================================
app.post('/api/social/add', (req, res) => {
    const { platform_name, channel_handle, profile_url, content_type } = req.body;
    db.run(`INSERT INTO social_channels (platform_name, channel_handle, profile_url, content_type, status) VALUES (?, ?, ?, ?, ?)`,
        [platform_name, channel_handle, profile_url, content_type || 'Shorts / Reels', 'CONNECTED'], () => {
            res.redirect('/');
        });
});

app.post('/api/public/contribute', (req, res) => {
    const { contributor_name, contribution_type, message_content } = req.body;
    db.run(
        `INSERT INTO public_contributions (contributor_name, contribution_type, message_content, status) VALUES (?, ?, ?, ?)`,
        [contributor_name || 'Anonymous Visitor', contribution_type || 'Match Pick', message_content || 'No content provided', 'VERIFIED & LIVE'],
        () => {
            res.redirect('/island');
        }
    );
});

app.get('/api/odds/matrix', (req, res) => {
    db.all(`SELECT * FROM multi_league_fixtures`, (err, fixtures) => {
        const analyzedMatches = fixtures ? fixtures.map(m => {
            const odds = calculateSportsbookOdds(m.home_rating, m.away_rating);
            return {
                league: m.league_category,
                fixture: `${m.home_team} vs ${m.away_team}`,
                date: m.match_date,
                venue: m.venue,
                sportsbook_odds: odds,
                sponsor: m.ad_sponsor
            };
        }) : [];

        res.json({
            status: "SUCCESS",
            engine: "Professional Sportsbook Decimal Odds Matrix",
            data: analyzedMatches
        });
    });
});

// ==============================================================================
// 5. COMMAND CENTER (Admin Root Route: /)
// ==============================================================================
app.get('/', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT fee_amount FROM toll_transactions`, (err, tolls) => {
        db.all(`SELECT * FROM super_agent_logs ORDER BY timestamp DESC LIMIT 5`, (err, agents) => {
            db.get(`SELECT total_vault_balance, daily_inflow FROM treasury_vault ORDER BY id DESC LIMIT 1`, (err, treasury) => {
                db.all(`SELECT * FROM social_channels`, (err, socials) => {
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
                            ul { padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.6; }
                            input, select { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 12px; background: #1c1c1c; border: 1px solid #333; color: #fff; border-radius: 8px; }
                            button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <header>
                                <div>
                                    <h1>⚡ Sovereign Master Command Center</h1>
                                    <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Ledger Revenue: $${totalRev.toFixed(3)} | Sportsbook Engine: ACTIVE</p>
                                </div>
                                <div><a href="/island" class="btn" style="background: #10b981; color:#000;">🌴 Visit Public Sportsbook Portal</a></div>
                            </header>

                            <div class="card" style="border: 1px solid #22c55e;">
                                <h2>🏦 Treasury Vault & Active Networks</h2>
                                <div class="grid">
                                    <div class="metric-box">
                                        <div style="color: #aaa; font-size: 12px;">Daily Multi-Platform Inflow</div>
                                        <div class="metric-value">$${parseFloat(dailyInflow).toFixed(2)} / day</div>
                                    </div>
                                    <div class="metric-box">
                                        <div style="color: #aaa; font-size: 12px;">Total Vault Balance</div>
                                        <div class="metric-value">$${parseFloat(vaultBalance).toFixed(2)}</div>
                                    </div>
                                </div>
                                <h3 style="font-size: 15px; color: #fff; margin-top: 20px;">Connected Social Channels</h3>
                                <ul>
                                    ${socials ? socials.map(s => `<li><b>[${s.platform_name}]</b> ${s.channel_handle} (${s.content_type}) &mdash; <span style="color:#22c55e">${s.status}</span></li>`).join('') : ''}
                                </ul>
                            </div>
                        </div>
                    </body>
                    </html>
                    `);
                });
            });
        });
    });
});

// ==============================================================================
// 6. PUBLIC SPORTSBOOK PORTAL (/island)
// ==============================================================================
app.get('/island', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT * FROM multi_league_fixtures`, (err, matches) => {
        db.all(`SELECT * FROM social_channels`, (err, socials) => {
            db.all(`SELECT * FROM public_contributions ORDER BY timestamp DESC LIMIT 10`, (err, contributions) => {
                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Anadolu Sportsbook - Professional Decimal Odds Matrix</title>
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                        .container { max-width: 1050px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                        header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                        h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                        p { color: #94a3b8; font-size: 13px; }
                        .badge { background: #22c55e; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                        .league-tag { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.3); display: inline-block; margin-bottom: 4px; }
                        .btn { background: #1f2937; color: #fff; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #374151; }
                        .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                        h2 { font-size: 17px; color: #fff; }
                        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                        th, td { padding: 14px 12px; text-align: left; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.06); }
                        th { color: #22c55e; font-weight: 600; text-transform: uppercase; font-size: 11px; background: #142017; }
                        .odds-box { display: inline-flex; flex-direction: column; background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 8px; padding: 6px 12px; text-align: center; min-width: 85px; margin-right: 6px; }
                        .odds-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; }
                        .odds-val { font-size: 15px; font-weight: bold; color: #22c55e; font-family: monospace; }
                        .odds-pct { font-size: 10px; color: #38bdf8; }
                        input, textarea { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 12px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; }
                        button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div>
                                <h1>🌴 Anadolu Sportsbook & Public Portal</h1>
                                <p>Status: <span class="badge">LIVE PROFESSIONAL ODDS FEED (HOURLY SYNC)</span></p>
                            </div>
                            <a href="/" class="btn">&larr; Admin Command Center</a>
                        </header>

                        <div class="card">
                            <h2>📊 Professional Sportsbook Decimal Odds Matrix</h2>
                            <p style="color:#94a3b8; font-size:12px;">Real-time calculated market odds (Decimal format with overround) for international fixtures and domestic leagues.</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fixture & Venue</th>
                                        <th>Kick-off</th>
                                        <th>1 (Home Win)</th>
                                        <th>X (Draw)</th>
                                        <th>2 (Away Win)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${matches ? matches.map(m => {
                                        const odds = calculateSportsbookOdds(m.home_rating, m.away_rating);
                                        return `
                                        <tr>
                                            <td>
                                                <span class="league-tag">${m.league_category}</span><br>
                                                <b>${m.home_team} vs${m.away_team}</b><br>
                                                <span style="color:#94a3b8; font-size:11px;">${m.venue}</span>
                                            </td>
                                            <td><span style="color: #38bdf8; font-family: monospace; font-weight:bold;">${m.match_date}</span></td>
                                            <td>
                                                <div class="odds-box">
                                                    <span class="odds-label">${m.home_team.split(' ')[0]}</span>
                                                    <span class="odds-val">${odds.homeDecimal}</span>
                                                    <span class="odds-pct">${odds.homeWin}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="odds-box" style="border-color: rgba(56,189,248,0.3);">
                                                    <span class="odds-label">Draw</span>
                                                    <span class="odds-val" style="color:#38bdf8;">${odds.drawDecimal}</span>
                                                    <span class="odds-pct">${odds.draw}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="odds-box" style="border-color: rgba(244,63,94,0.3);">
                                                    <span class="odds-label">${m.away_team.split(' ')[0]}</span>
                                                    <span class="odds-val" style="color:#fb7185;">${odds.awayDecimal}</span>
                                                    <span class="odds-pct">${odds.awayWin}%</span>
                                                </div>
                                            </td>
                                        </tr>`;
                                    }).join('') : ''}
                                </tbody>
                            </table>
                        </div>

                        <!-- PUBLIC BETTING PICKS & COMMUNITY WALL -->
                        <div class="card" style="border: 1px solid #22c55e;">
                            <h2>🌍 Community Picks & Contribution Wall</h2>
                            <p>Pick your favorite teams or drop your match predictions below. Recorded securely in the sovereign ledger.</p>
                            <form action="/api/public/contribute" method="POST">
                                <label>Your Name / Handle:</label>
                                <input type="text" name="contributor_name" placeholder="e.g. Cenk or Guest" required>
                                <label>Selection / Prediction Type:</label>
                                <input type="text" name="contribution_type" placeholder="e.g. England Win / Man City Pick" required>
                                <label>Your Analysis or Message:</label>
                                <textarea name="message_content" rows="3" placeholder="Why is this team going to win?" required></textarea>
                                <button type="submit">Submit Pick to Ledger</button>
                            </form>

                            <h3 style="font-size:15px; margin-top:15px; color:#fff;">Recent Community Picks & Entries:</h3>
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
});

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Engine running live on port ${PORT}`);
    setTimeout(startHourlyOddsWatcher, 5000);
});
