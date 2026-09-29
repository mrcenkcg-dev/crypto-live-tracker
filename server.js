const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Setup & Connection
const dbFile = path.join(__dirname, 'sovereign_master.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master DB (Unified Server).');
        initializeDatabase();
        startAutonomousWorker(db);
    }
});

// Database Table Initialization
function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS system_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            module_name TEXT,
            status TEXT,
            message TEXT
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

        db.run(`CREATE TABLE IF NOT EXISTS music_tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            track_title TEXT,
            artist TEXT,
            genre TEXT,
            duration TEXT,
            audio_url TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS multi_league_fixtures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            league_category TEXT,
            home_team TEXT,
            away_team TEXT,
            match_minute TEXT,
            home_goals INT,
            away_goals INT,
            venue TEXT,
            home_rating INT,
            away_rating INT,
            ad_sponsor TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS user_bets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            match_title TEXT,
            selection TEXT,
            odds TEXT,
            stake TEXT,
            payout TEXT,
            status TEXT DEFAULT 'PENDING'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS learning_cycles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            learning_cycle INTEGER,
            experiment_title TEXT,
            approval_status TEXT,
            agent_hypothesis TEXT,
            sandbox_result TEXT,
            tested_at TEXT
        )`);
    });
}

// System Logging Helper
function logEvent(module, status, message) {
    try {
        const stmt = db.prepare(`INSERT INTO system_logs (module_name, status, message) VALUES (?, ?, ?)`);
        stmt.run(module, status, message);
        stmt.finalize();
    } catch (dbError) {
        console.error('⚠️ Log error ->', dbError.message);
    }
}

// Autonomous Worker Process
function startAutonomousWorker(database) {
    setInterval(() => {
        database.run(`UPDATE multi_league_fixtures SET home_goals = home_goals + 1 WHERE match_minute LIKE 'Live%' AND id % 2 = 0`);
        database.run(`UPDATE multi_league_fixtures SET away_goals = away_goals + 1 WHERE match_minute LIKE 'Live%' AND id % 2 != 0`);
    }, 45000);
}

// In-Play Odds Calculator
function calculateInPlayMarkets(homeRating, awayRating) {
    const homeAdvantage = 5;
    const totalPower = homeRating + awayRating + homeAdvantage;
    
    let rawHomeWin = ((homeRating + homeAdvantage) / totalPower) * 100;
    let rawAwayWin = (awayRating / totalPower) * 100;

    let homeWinProb, awayWinProb;
    if (rawHomeWin >= rawAwayWin) {
        homeWinProb = Math.round(55 + (Math.random() * 6));
        awayWinProb = Math.round(100 - homeWinProb - 20);
    } else {
        awayWinProb = Math.round(55 + (Math.random() * 6));
        homeWinProb = Math.round(100 - awayWinProb - 20);
    }

    let drawProb = 100 - (homeWinProb + awayWinProb);
    if (drawProb < 12) drawProb = 15;

    const margin = 1.04;
    const homeDecimal = ((100 / homeWinProb) * margin).toFixed(2);
    const drawDecimal = ((100 / drawProb) * margin).toFixed(2);
    const awayDecimal = ((100 / awayWinProb) * margin).toFixed(2);

    return { homeDecimal, drawDecimal, awayDecimal };
}

// Routes
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM multi_league_fixtures`, (err, matches) => {
        if (err) return res.status(500).send("Database error loading fixtures.");
        db.all(`SELECT * FROM user_bets ORDER BY timestamp DESC LIMIT 3`, [], (err2, bets) => {
            if (err2) return res.status(500).send("Database error loading bets.");
            
            // Render basic template response combining fixtures and bets data
            res.send(`
                <html>
                    <head><title>Sovereign Master Island</title></head>
                    body { font-family: sans-serif; padding: 20px; background: #111; color: #eee; }
                    <h1>🏝️ Sovereign Master - Island Dashboard</h1>
                    <h2>Active Fixtures</h2>
                    <pre>${JSON.stringify(matches, null, 2)}</pre>
                    <h2>Recent User Bets</h2>
                    <pre>${JSON.stringify(bets, null, 2)}</pre>
                </html>
            `);
        });
    });
});

app.post('/api/place-bet', (req, res) => {
    const { match_title, selection, odds, stake } = req.body;
    if (!match_title || !selection || !odds || !stake) {
        return res.status(400).json({ status: 'error', message: 'Missing required bet parameters.' });
    }
    const payout = (parseFloat(stake) * parseFloat(odds)).toFixed(2);
    db.run(`INSERT INTO user_bets (match_title, selection, odds, stake, payout, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [match_title, selection, odds, stake, payout, 'CONFIRMED'], (err) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message });
            logEvent('SportsbookEngine', 'SUCCESS', `Locked bet on ${match_title} (${selection}) for $${stake}`);
            res.status(200).json({ status: 'success', message: `Bet locked in successfully! Estimated Payout: $${payout}` });
        });
});

// Server Listener
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master unified server is running on port ${PORT}`);
});
