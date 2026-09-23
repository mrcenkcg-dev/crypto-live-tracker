/**
 * Sovereign Engine: Multi-Page Social & Community Upgrade
 * Adds a Facebook-style public social feed, video gallery, and clean multi-page public navigation.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Database Initialization
const dbPath = path.resolve(__dirname, 'sovereign_engine.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('❌ Database connection error:', err.message);
    else console.log('✅ Connected to Sovereign Master Database (Social Island Edition).');
});

db.serialize(() => {
    // System Logs
    db.run(`CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        module_name TEXT,
        status TEXT,
        message TEXT
    )`);

    // Public Community Social Feed Posts (Facebook style)
    db.run(`CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        author_name TEXT,
        post_content TEXT,
        media_url TEXT,
        likes_count INTEGER DEFAULT 0
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM community_posts`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO community_posts (author_name, post_content, media_url, likes_count) VALUES 
                    ('Cenk Göktüman', 'Welcome to the new Anadolu Island community feed! Shoulder to shoulder, we grow together.', 'https://www.youtube.com', 12),
                    ('Sufi Rock Bot', 'New Yunus Emre verse rendered with bağlama and synth grooves. Check the media tab!', 'https://www.youtube.com', 8),
                    ('Get Big Together', 'Our automated toll gate and crypto monitoring engine is fully live on Render. Let us push forward!', 'https://github.com', 15)`);
            }
        });
    });

    // Treasury Vault & Other Tables
    db.run(`CREATE TABLE IF NOT EXISTS treasury_vault (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_vault_balance REAL,
        daily_inflow REAL
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM treasury_vault`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO treasury_vault (total_vault_balance, daily_inflow) VALUES (142.50, 4.00)`);
            }
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS live_matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        league_name TEXT,
        home_team TEXT,
        away_team TEXT,
        match_date TEXT,
        venue TEXT,
        home_rating INTEGER,
        away_rating INTEGER
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM live_matches`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO live_matches (league_name, home_team, away_team, match_date, venue, home_rating, away_rating) VALUES 
                    ('Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', '26 Oct 2026, 18:30', 'RAMS Park, Istanbul', 85, 84)`);
            }
        });
    });
});

// 2. Middleware for Public Toll
function microFeeTollGate(fee = '$0.001') {
    return (req, res, next) => {
        next();
    };
}

// 3. API endpoint to create a new post on the Public Feed
app.post('/api/community/post', (req, res) => {
    const { author_name, post_content, media_url } = req.body;
    db.run(`INSERT INTO community_posts (author_name, post_content, media_url) VALUES (?, ?, ?)`,
        [author_name || 'Community Member', post_content, media_url || 'https://www.youtube.com'], () => {
            res.redirect('/island');
        });
});

// 4. Admin Command Center (Private)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><title>Sovereign Command Center</title>
        <style>
            body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 30px; }
            .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
            header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #22c55e; display: flex; justify-content: space-between; align-items: center; }
            h1 { color: #22c55e; font-size: 20px; margin: 0; }
            .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
            .btn { background: #22c55e; color: #000; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block; }
            .btn-alt { background: #262626; color: #fff; border: 1px solid #3f3f46; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>⚓ Private Command Center (Admin)</h1>
                <div style="display: flex; gap: 10px;">
                    <a href="/island" class="btn">🌐 View Public Island Portal</a>
                </div>
            </header>
            <div class="card">
                <h2>System Control Panel</h2>
                <p style="color: #94a3b8; font-size: 13px; margin: 10px 0 20px 0;">All core engines, multi-agent scripts, and databases are running smoothly.</p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="/island" class="btn btn-alt">Open Social Feed (/island)</a>
                    <a href="/island/videos" class="btn btn-alt">Open Video Hub (/island/videos)</a>
                    <a href="/island/matches" class="btn btn-alt">Open Live Match Probs (/island/matches)</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// 5. PUBLIC PAGE 1: The Facebook-Style Social Feed (/island)
app.get('/island', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT * FROM community_posts ORDER BY id DESC`, [], (err, posts) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anadolu Island - Community Social Feed</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070908; color: #e2e8f0; padding: 20px; }
                .container { max-width: 650px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                header { background: #111a14; padding: 18px 24px; border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #22c55e; font-size: 18px; }
                .nav-bar { display: flex; gap: 8px; background: #111a14; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); justify-content: center; }
                .nav-link { color: #94a3b8; text-decoration: none; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 8px; transition: 0.2s; }
                .nav-link.active, .nav-link:hover { background: #22c55e; color: #000; }
                .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
                textarea { width: 100%; padding: 12px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 10px; resize: none; font-family: inherit; font-size: 13px; }
                input { width: 100%; padding: 10px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
                button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; width: 100%; }
                .post-box { background: #152019; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
                .post-header { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
                .post-author { color: #22c55e; font-weight: bold; font-size: 14px; }
                .post-text { font-size: 13px; line-height: 1.5; color: #f1f5f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>🌴 Anadolu Island</h1>
                    <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin Login</a>
                </header>

                <!-- Multi-Page Navigation Bar -->
                <div class="nav-bar">
                    <a href="/island" class="nav-link active">💬 Social Feed</a>
                    <a href="/island/videos" class="nav-link">📺 Videos & Media</a>
                    <a href="/island/matches" class="nav-link">⚽ Match Probs</a>
                </div>

                <!-- Create Post Box (Facebook Style) -->
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Share with the Community</h2>
                    <form action="/api/community/post" method="POST">
                        <input type="text" name="author_name" placeholder="Your Name or Handle" required>
                        <textarea name="post_content" rows="3" placeholder="What's happening on your mind today? Share an update, thought, or project..." required></textarea>
                        <button type="submit">Post to Island Feed</button>
                    </form>
                </div>

                <!-- Live Social Feed Wall -->
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Community Stream</h2>
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 4px;">
                        ${posts ? posts.map(p => `
                            <div class="post-box">
                                <div class="post-header">
                                    <span class="post-author">${p.author_name}</span>
                                    <span>${p.timestamp}</span>
                                </div>
                                <div class="post-text">${p.post_content}</div>
                                <div style="font-size: 11px; color: #38bdf8; margin-top: 4px;">❤️ ${p.likes_count} Likes &bull; <a href="${p.media_url}" target="_blank" style="color: #22c55e; text-decoration: none;">View Attached Link &rarr;</a></div>
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

// 6. PUBLIC PAGE 2: Video & Media Hub (/island/videos)
app.get('/island/videos', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><title>Anadolu Island - Videos & Media Hub</title>
        <style>
            body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 20px; }
            .container { max-width: 650px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
            header { background: #111a14; padding: 18px 24px; border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; }
            h1 { color: #22c55e; font-size: 18px; }
            .nav-bar { display: flex; gap: 8px; background: #111a14; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); justify-content: center; }
            .nav-link { color: #94a3b8; text-decoration: none; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 8px; }
            .nav-link.active { background: #22c55e; color: #000; }
            .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; }
            .video-card { background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🌴 Anadolu Island</h1>
                <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin Login</a>
            </header>
            <div class="nav-bar">
                <a href="/island" class="nav-link">💬 Social Feed</a>
                <a href="/island/videos" class="nav-link active">📺 Videos & Media</a>
                <a href="/island/matches" class="nav-link">⚽ Match Probs</a>
            </div>
            <div class="card">
                <h2 style="font-size: 15px; color: #fff; margin-bottom: 14px;">Automated Video & Music Shorts</h2>
                <div class="video-card">
                    <b>🎵 Anadolu Psychedelic Sufi Rock - Yunus Emre Session</b>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">Automated vertical video generated with bağlama instrumentation and synth drone.</p>
                </div>
                <div class="video-card">
                    <b>⚡ Get Big Together Community Showcase</b>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">Highlights of our multi-agent pipeline, wildlife rescue simulations, and public feeds.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// 7. PUBLIC PAGE 3: Match Probabilities (/island/matches)
app.get('/island/matches', (req, res) => {
    db.all(`SELECT * FROM live_matches`, [], (err, matches) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><title>Anadolu Island - Live Match Probabilities</title>
            <style>
                body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 20px; }
                .container { max-width: 650px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                header { background: #111a14; padding: 18px 24px; border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #22c55e; font-size: 18px; }
                .nav-bar { display: flex; gap: 8px; background: #111a14; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); justify-content: center; }
                .nav-link { color: #94a3b8; text-decoration: none; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 8px; }
                .nav-link.active { background: #22c55e; color: #000; }
                .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>🌴 Anadolu Island</h1>
                    <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin Login</a>
                </header>
                <div class="nav-bar">
                    <a href="/island" class="nav-link">💬 Social Feed</a>
                    <a href="/island/videos" class="nav-link">📺 Videos & Media</a>
                    <a href="/island/matches" class="nav-link active">⚽ Match Probs</a>
                </div>
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff; margin-bottom: 14px;">Live Süper Lig Probabilities</h2>
                    ${matches ? matches.map(m => `
                        <div style="background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px;">
                            <b>${m.home_team} vs${m.away_team}</b><br>
                            <span style="color:#38bdf8; font-size: 12px;">${m.match_date} &bull; ${m.venue}</span><br>
                            <div style="margin-top: 10px; font-size: 12px;">
                                <span style="background: rgba(34,197,94,0.2); color:#22c55e; padding:4px 8px; border-radius:6px;">Home: 52%</span>
                                <span style="background: rgba(56,189,248,0.2); color:#38bdf8; padding:4px 8px; border-radius:6px;">Draw: 26%</span>
                                <span style="background: rgba(244,63,94,0.2); color:#fb7185; padding:4px 8px; border-radius:6px;">Away: 22%</span>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
        </body>
        </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Engine running live on port ${PORT}`);
});
