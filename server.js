// ==========================================
// AUTONOMOUS FOOTBALL RESULT ENGINE (WITH DIXON-COLES TIME-DECAY)
// Single Mission: Continuously learn & predict exact match probabilities
// Stack: Node.js / Express / SQLite
// ==========================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent Local Database
const dbFile = path.resolve(__dirname, 'football_brain.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (!err) console.log('🧠 [Brain] Database initialized.');
});

// Setup Core Mathematical Storage
db.serialize(() => {
    // Dynamic Team Performance Parameters (Evolves with every match)
    db.run(`CREATE TABLE IF NOT EXISTS team_ratings (
        team_name TEXT PRIMARY KEY,
        attack_rating REAL DEFAULT 1.0,
        defense_rating REAL DEFAULT 1.0,
        matches_evaluated INTEGER DEFAULT 0
    )`);

    // Complete Prediction & Error History with Match Timestamp
    db.run(`CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        home_team TEXT,
        away_team TEXT,
        exp_home_goals REAL,
        exp_away_goals REAL,
        prob_home_win REAL,
        prob_draw REAL,
        prob_away_win REAL,
        actual_home_goals INTEGER DEFAULT NULL,
        actual_away_goals INTEGER DEFAULT NULL,
        brier_score REAL DEFAULT NULL,
        status TEXT DEFAULT 'PENDING'
    )`);

    // Global Learning Hyperparameters
    db.run(`CREATE TABLE IF NOT EXISTS system_brain (
        id INTEGER PRIMARY KEY,
        home_advantage REAL DEFAULT 1.25,
        league_avg_goals REAL DEFAULT 2.60,
        learning_rate REAL DEFAULT 0.05,
        decay_factor REAL DEFAULT 0.003, -- Xi parameter (~0.3% decay/day)
        total_brier_sum REAL DEFAULT 0.0,
        total_evaluations INTEGER DEFAULT 0
    )`);

    db.get("SELECT COUNT(*) as cnt FROM system_brain", (err, row) => {
        if (row && row.cnt === 0) {
            db.run(`INSERT INTO system_brain (id, home_advantage, learning_rate, decay_factor) VALUES (1, 1.25, 0.05, 0.003)`);
        }
    });
});

// ==========================================
// 1. MATHEMATICAL PREDICTION ENGINE (Bivariate Poisson)
// ==========================================

function poisson(k, lambda) {
    let factorial = 1;
    for (let i = 1; i <= k; i++) factorial *= i;
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial;
}

// Generates Scoreline Probability Matrix (0-0 to 6-6)
function calculateMatchProbabilities(homeAtt, homeDef, awayAtt, awayDef, homeAdv, leagueAvg) {
    const lambda = homeAtt * awayDef * homeAdv * (leagueAvg / 2); // Expected Home Goals
    const mu = awayAtt * homeDef * (leagueAvg / 2);               // Expected Away Goals

    let probHome = 0, probDraw = 0, probAway = 0;

    for (let h = 0; h <= 6; h++) {
        for (let a = 0; a <= 6; a++) {
            const p = poisson(h, lambda) * poisson(a, mu);
            if (h > a) probHome += p;
            else if (h === a) probDraw += p;
            else probAway += p;
        }
    }

    return {
        expHomeGoals: parseFloat(lambda.toFixed(2)),
        expAwayGoals: parseFloat(mu.toFixed(2)),
        probHomeWin: parseFloat((probHome * 100).toFixed(1)),
        probDraw: parseFloat((probDraw * 100).toFixed(1)),
        probAwayWin: parseFloat((probAway * 100).toFixed(1))
    };
}

// Safe database lookup for team rating initialization
function getTeamRating(teamName, callback) {
    db.get(`SELECT * FROM team_ratings WHERE team_name = ?`, [teamName], (err, row) => {
        if (row) {
            callback(row);
        } else {
            // Auto-register new team if unknown
            db.run(`INSERT INTO team_ratings (team_name, attack_rating, defense_rating) VALUES (?, 1.0, 1.0)`, [teamName], () => {
                callback({ team_name: teamName, attack_rating: 1.0, defense_rating: 1.0, matches_evaluated: 0 });
            });
        }
    });
}

// Dixon-Coles Exponential Decay Formula: phi(t) = exp(-xi * t)
function calculateTimeWeight(matchDateString, xiFactor) {
    const matchDate = new Date(matchDateString);
    const currentDate = new Date();
    const daysElapsed = Math.max(0, (currentDate - matchDate) / (1000 * 60 * 60 * 24));
    const weight = Math.exp(-xiFactor * daysElapsed);
    return parseFloat(weight.toFixed(4));
}

// ==========================================
// 2. SELF-LEARNING & ERROR CORRECTION ENGINE
// ==========================================

function learnFromResult(predictionId, actualHome, actualAway) {
    db.get(`SELECT * FROM predictions WHERE id = ?`, [predictionId], (err, pred) => {
        if (err || !pred || pred.status === 'EVALUATED') return;

        // Convert actual outcome to binary vector
        const oHome = actualHome > actualAway ? 1 : 0;
        const oDraw = actualHome === actualAway ? 1 : 0;
        const oAway = actualAway > actualHome ? 1 : 0;

        const pHome = pred.prob_home_win / 100;
        const pDraw = pred.prob_draw / 100;
        const pAway = pred.prob_away_win / 100;

        // Brier Score calculation: Loss function where 0.0 is perfect accuracy
        const brierScore = Math.pow(pHome - oHome, 2) + Math.pow(pDraw - oDraw, 2) + Math.pow(pAway - oAway, 2);

        // Update match record with true result and loss metric
        db.run(`UPDATE predictions SET actual_home_goals = ?, actual_away_goals = ?, brier_score = ?, status = 'EVALUATED' WHERE id = ?`,
            [actualHome, actualAway, brierScore.toFixed(4), predictionId]);

        // Gradient Step with Dixon-Coles Time-Decay Weighting
        db.get(`SELECT * FROM system_brain WHERE id = 1`, (err, brain) => {
            const baseLr = brain.learning_rate;
            const xi = brain.decay_factor || 0.003;
            
            // Calculate time weight (recent matches get closer to 1.0; older matches decay)
            const timeWeight = calculateTimeWeight(pred.match_date, xi);
            const effectiveLr = baseLr * timeWeight;

            const homeGoalError = actualHome - pred.exp_home_goals; // Positive = Home overperformed
            const awayGoalError = actualAway - pred.exp_away_goals; // Positive = Away overperformed

            // Recalibrate Home Team Attack & Away Team Defense
            db.run(`UPDATE team_ratings SET attack_rating = attack_rating + (? * ?), matches_evaluated = matches_evaluated + 1 WHERE team_name = ?`, 
                [effectiveLr, homeGoalError, pred.home_team]);
            db.run(`UPDATE team_ratings SET defense_rating = defense_rating - (? * ?) WHERE team_name = ?`, 
                [effectiveLr, homeGoalError, pred.away_team]);

            // Recalibrate Away Team Attack & Home Team Defense
            db.run(`UPDATE team_ratings SET attack_rating = attack_rating + (? * ?), matches_evaluated = matches_evaluated + 1 WHERE team_name = ?`, 
                [effectiveLr, awayGoalError, pred.away_team]);
            db.run(`UPDATE team_ratings SET defense_rating = defense_rating - (? * ?) WHERE team_name = ?`, 
                [effectiveLr, awayGoalError, pred.home_team]);

            // Update System-Wide Running Performance
            db.run(`UPDATE system_brain SET total_brier_sum = total_brier_sum + ?, total_evaluations = total_evaluations + 1 WHERE id = 1`, [brierScore]);

            console.log(`⚡ [Self-Learning Step] Match #${predictionId} evaluated. Time Weight: ${timeWeight} (Effective LR: ${effectiveLr.toFixed(5)}). Brier Loss: ${brierScore.toFixed(4)}.`);
        });
    });
}

// ==========================================
// 3. API ENDPOINTS & AUTONOMOUS LOOP
// ==========================================

// Predict Fixture (Infers parameters, calculates Poisson distribution, saves prediction)
app.post('/api/predict', (req, res) => {
    const { homeTeam, awayTeam, matchDate } = req.body;
    const dateToStore = matchDate || new Date().toISOString();

    getTeamRating(homeTeam, (home) => {
        getTeamRating(awayTeam, (away) => {
            db.get(`SELECT * FROM system_brain WHERE id = 1`, (err, brain) => {
                const probs = calculateMatchProbabilities(
                    home.attack_rating, home.defense_rating,
                    away.attack_rating, away.defense_rating,
                    brain.home_advantage, brain.league_avg_goals
                );

                db.run(`INSERT INTO predictions 
                    (match_date, home_team, away_team, exp_home_goals, exp_away_goals, prob_home_win, prob_draw, prob_away_win)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [dateToStore, homeTeam, awayTeam, probs.expHomeGoals, probs.expAwayGoals, probs.probHomeWin, probs.probDraw, probs.probAwayWin],
                    function(err) {
                        res.json({
                            predictionId: this.lastID,
                            matchDate: dateToStore,
                            homeTeam, awayTeam,
                            expectedScore: `${probs.expHomeGoals} - ${probs.expAwayGoals}`,
                            probabilities: { homeWin: `${probs.probHomeWin}%`, draw: `${probs.probDraw}%`, awayWin: `${probs.probAwayWin}%` }
                        });
                    }
                );
            });
        });
    });
});

// Submit Actual Result (Triggers immediate gradient update step)
app.post('/api/feed-result', (req, res) => {
    const { predictionId, actualHomeGoals, actualAwayGoals } = req.body;
    learnFromResult(predictionId, parseInt(actualHomeGoals), parseInt(actualAwayGoals));
    res.json({ message: `Result ingested. Learning cycle completed for ID #${predictionId}.` });
});

// View Brain State (Inspect learned ratings & total accuracy loss)
app.get('/api/brain-state', (req, res) => {
    db.get(`SELECT * FROM system_brain WHERE id = 1`, (err, brain) => {
        db.all(`SELECT * FROM team_ratings ORDER BY attack_rating DESC`, (err, teams) => {
            const avgBrier = brain.total_evaluations > 0 ? (brain.total_brier_sum / brain.total_evaluations).toFixed(4) : "N/A";
            res.json({
                systemAccuracy: {
                    totalEvaluations: brain.total_evaluations,
                    averageBrierScore: avgBrier, // Lower is better (0.0 = perfect model)
                    baseLearningRate: brain.learning_rate,
                    decayFactor: brain.decay_factor
                },
                learnedTeamRatings: teams
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Dedicated Football Result Learning Server active on port ${PORT}`);
});
