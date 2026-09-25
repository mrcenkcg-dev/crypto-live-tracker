/**
 * ==============================================================================
 * SOVEREIGN MASTER ENGINE: AUTONOMOUS EXPANSION SERVER (WITH BETTING SLIP)
 * ==============================================================================
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Parser = require('rss-parser');

const app = express();
const rssParser = new Parser();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================================================================
// 1. DATABASE SETUP & SCHEMAS
// ==============================================================================
const dbFile = path.join(__dirname, 'sovereign_master.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master DB.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS system_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            module_name TEXT,
            status TEXT,
            message TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS placed_bets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            match_title TEXT,
            selection TEXT,
            odds TEXT,
            stake REAL,
            potential_payout REAL,
            status TEXT DEFAULT 'PLACED'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS harvested_deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            title TEXT,
            link TEXT,
            source_feed TEXT,
            price_extracted TEXT,
            status TEXT DEFAULT 'PENDING'
        )`);

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
                        ('Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', 'This Weekend, 20:00', 'RAMS Park, Istanbul', 87, 86, 9, 'Anadolu Sufi Rock Partner'),
                        ('Premier League', 'Liverpool F.C.', 'Manchester City', 'This Weekend, 16:30', 'Anfield, Liverpool', 91, 94, 7, 'Sovereign Analytics Partner')`);
                }
            });
        });

        db.run(`CREATE TABLE IF NOT EXISTS affiliate_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            associates_id TEXT,
            item_clicked TEXT,
            referral_source TEXT,
            status TEXT
        )`, () => {
            db.get(`SELECT COUNT(*) as count FROM affiliate_tracking`, (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO affiliate_tracking (associates_id, item_clicked, referral_source, status) VALUES 
                        ('mrcenk20-21', 'Anadolu Sufi Rock Gear & Deals', 'Command Center Portal', 'TRACKING ACTIVE')`);
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
// 2. BACKGROUND AUTONOMOUS WORKER
// ==============================================================================
async function runAutonomousHarvestWorker() {
    const feedUrl = 'https://news.google.com/rss/search?q=technology+deals&hl=en-US&gl=US&ceid=US:en';
    try {
        const feed = await rssParser.parseURL(feedUrl);
        let count = 0;
        for (let item of feed.items.slice(0, 3)) {
            db.run(`INSERT INTO harvested_deals (title, link, source_feed, price_extracted, status) VALUES (?, ?, ?, ?, ?)`,
                [item.title, item.link, feed.title || 'Autonomous RSS Stream', '$0.00', 'AUTO-HARVESTED']);
            count++;
        }
        logEvent('AutonomousWorker', 'SUCCESS', `Background poll harvested ${count} items.`);
    } catch (err) {
        logEvent('AutonomousWorker', 'ERROR', `Background poll failed: ${err.message}`);
    }
}

setInterval(runAutonomousHarvestWorker, 60 * 60 * 1000);

// ==============================================================================
// 3. AI PROBABILITY & MARKET ENGINE
// ==============================================================================
function calculateInPlayMarkets(homeRating, awayRating) {
    const homeAdvantage = 5;
    const totalPower = homeRating + awayRating + homeAdvantage;
    let homeWinProb = Math.round(((homeRating + homeAdvantage) / totalPower) * 100);
    let awayWinProb = Math.round((awayRating / totalPower) * 100);
    let drawProb = 100 - (homeWinProb + awayWinProb);
    if (drawProb < 12) drawProb = 15;

    const margin = 1.04;
    return {
        homeWinProb, drawProb, awayWinProb,
        homeDecimal: ((100 / homeWinProb) * margin).toFixed(2),
        drawDecimal: ((100 / drawProb) * margin).toFixed(2),
        awayDecimal: ((100 / awayWinProb) * margin).toFixed(2)
    };
}

// ==============================================================================
// 4. API ENDPOINTS
// ==============================================================================
app.post('/api/place-bet', (req, res) => {
    const { match_title, selection, odds, stake } = req.body;
    const numericStake = parseFloat(stake) || 10.0;
    const potentialPayout = (numericStake * parseFloat(odds)).toFixed(2);

    const stmt = db.prepare(`INSERT INTO placed_bets (match_title, selection, odds, stake, potential_payout) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(match_title, selection, odds, numericStake, potentialPayout, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        logEvent('Sportsbook', 'SUCCESS', `Bet placed on ${match_title} (${selection}) @ ${odds}`);
        res.status(200).json({ 
            status: 'success', 
            message: `Bet successfully locked in! Potential payout: $${potentialPayout}` 
        });
    });
});

// ==============================================================================
// 5. PORTAL ROUTES (Command Center & Lounge)
// ==============================================================================
app.get('/', (req, res) => {
    db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 6`, [], (err, logs) => {
        db.all(`SELECT * FROM placed_bets ORDER BY timestamp DESC LIMIT 5`, [], (errBets, bets) => {
            db.all(`SELECT * FROM harvested_deals ORDER BY timestamp DESC LIMIT 5`, [], (errDeals, deals) => {
                
                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Welcome to Anatolia - Sovereign Command Center</title>
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 25px; }
                        .container { max-width: 1050px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                        header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; border-left: 5px solid #22c55e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                        h1 { color: #22c55e; font-size: 22px; margin-bottom: 5px; }
                        .status-badge { background: #22c55e; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; }
                        .portal-btn { background: #262626; color: #fff; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #3f3f46; display: inline-block; }
                        .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                        h2 { font-size: 16px; color: #fff; margin-bottom: 12px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { text-align: left; padding: 10px; border-bottom: 1px solid #262626; font-size: 13px; }
                        th { color: #94a3b8; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div>
                                <h1>🏛️ Welcome to Anatolia — Command Center</h1>
                                <p>Status: <span class="status-badge">AI HOST ONLINE</span> | Associate ID: <code>mrcenk20-21</code></p>
                            </div>
                            <div>
                                <a href="/island" class="portal-btn" style="background: #22c55e; color: #000;">⚽ Enter Sportsbook Lounge</a>
                            </div>
                        </header>

                        <div class="card">
                            <h2>🎯 Active Placed Bets Telemetry</h2>
                            <table>
                                <tr><th>Timestamp</th><th>Match</th><th>Selection</th><th>Odds</th><th>Stake</th><th>Payout</th><th>Status</th></tr>
                                ${bets && bets.length > 0 ? bets.map(b => `<tr><td>${b.timestamp}</td><td><b>${b.match_title}</b></td><td>${b.selection}</td><td>${b.odds}</td><td>$${b.stake}</td><td style="color:#38bdf8;">$${b.potential_payout}</td><td style="color:#22c55e;">${b.status}</td></tr>`).join('') : '<tr><td colspan="7" style="color:#94a3b8;">No bets placed yet. Visit the lounge to test!</td></tr>'}
                            </table>
                        </div>

                        <div class="card">
                            <h2>📰 Autonomous Knowledge & Deal Stream</h2>
                            <table>
                                <tr><th>Timestamp</th><th>Title</th><th>Source</th><th>Status</th></tr>
                                ${deals ? deals.map(d => `<tr><td>${d.timestamp}</td><td><a href="${d.link}" target="_blank" style="color:#38bdf8; text-decoration:none;">${d.title}</a></td><td>${d.source_feed}</td><td style="color:#22c55e;">${d.status}</td></tr>`).join('') : ''}
                            </table>
                        </div>

                        <div class="card">
                            <h2>📋 System Telemetry Logs</h2>
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

app.get('/island', (req, res) => {
    db.all(`SELECT * FROM multi_league_fixtures`, (err, matches) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Welcome to Anatolia - Sportsbook & Lucky Dip Lounge</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 25px; }
                .container { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                .portal-btn { background: #262626; color: #fff; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #3f3f46; }
                .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; }
                .match-box { background: #16221a; border: 1px solid rgba(34,197,94,0.25); border-radius: 14px; padding: 18px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                .odds-btn { background: #1f3325; border: 1px solid #22c55e; color: #22c55e; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .odds-btn:hover { background: #22c55e; color: #000; }
                .slip-box { background: #16221a; border: 1px solid #38bdf8; border-radius: 14px; padding: 18px; margin-top: 15px; }
                input, select { background: #0b0b0b; border: 1px solid #3f3f46; color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 13px; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div>
                        <h1>🌴 Welcome to Anatolia — Sportsbook Lounge</h1>
                        <p style="color:#94a3b8; font-size:13px;">AI Calibrated Live Markets & Betting Engine</p>
                    </div>
                    <a href="/" class="portal-btn">&larr; Command Center</a>
                </header>

                <div class="card">
                    <h2>⚽ Live Fixtures & Odds (Click to Select Bet)</h2>
                    ${matches ? matches.map(m => {
                        const mk = calculateInPlayMarkets(m.home_rating, m.away_rating);
                        const matchTitle = `${m.home_team} vs${m.away_team}`;
                        return `
                        <div class="match-box">
                            <div>
                                <b>${matchTitle}</b> <span style="color:#38bdf8; font-size:12px;">(${m.league_category})</span>
                                <div style="font-size:12px; color:#94a3b8; margin-top:3px;">📍 ${m.venue} \vert{} Sponsor:${m.ad_sponsor}</div>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="odds-btn" onclick="selectBet('${matchTitle}', '${m.home_team} Win', '${mk.homeDecimal}')">1 (${mk.homeDecimal})</button>
                                <button class="odds-btn" onclick="selectBet('${matchTitle}', 'Draw', '${mk.drawDecimal}')">X (${mk.drawDecimal})</button>
                                <button class="odds-btn" onclick="selectBet('${matchTitle}', '${m.away_team} Win', '${mk.awayDecimal}')">2 (${mk.awayDecimal})</button>
                            </div>
                        </div>`;
                    }).join('') : ''}
                </div>

                <div class="card slip-box">
                    <h2>🎟️ Active Betting Slip</h2>
                    <div id="slip-content" style="margin-top: 10px; font-size: 13px; color: #94a3b8;">
                        Select an odd above to populate your betting slip.
                    </div>
                </div>
            </div>

            <script>
                let currentBet = null;

                function selectBet(match, selection, odds) {
                    currentBet = { match, selection, odds };
                    document.getElementById('slip-content.innerHTML').innerHTML = '';
                    document.getElementById('slip-content').innerHTML = \`
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div>Match: <b>\${match}</b></div>
                            <div>Selection: <b style="color:#22c55e;">\${selection}</b> @ \${odds}</div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <label>Stake ($):</label>
                                <input type="number" id="stake-input" value="10" min="1" style="width: 100px;" oninput="updatePayout(\${odds})">
                                <span>Estimated Payout: <b id="payout-display" style="color:#38bdf8;">$\${(10 * parseFloat(odds)).toFixed(2)}</b></span>
                            </div>
                            <button onclick="placeBet()" style="background:#22c55e; color:#000; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Lock In Bet</button>
                        </div>
                    \`;
                }

                function updatePayout(odds) {
                    const stake = document.getElementById('stake-input').value || 0;
                    document.getElementById('payout-display').innerText = '$' + (stake * odds).toFixed(2);
                }

                function placeBet() {
                    if (!currentBet) return;
                    const stake = document.getElementById('stake-input').value;
                    
                    fetch('/api/place-bet', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            match_title: currentBet.match,
                            selection: currentBet.selection,
                            odds: currentBet.odds,
                            stake: stake
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        window.location.reload();
                    })
                    .catch(err => alert('Error placing bet'));
                }
            </script>
        </body>
        </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Autonomous Sovereign Master Engine running on port ${PORT}`);
    runAutonomousHarvestWorker();
});
