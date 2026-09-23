/**
 * Sovereign Engine: Full Multi-Page MySQL Edition
 * Restores all original pages (Social Feed, Video Hub, Match Probs, and Admin Center) with MySQL persistence.
 */

const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
const dbConfig = process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sovereign_engine',
    port: process.env.DB_PORT || 3306
};

const pool = mysql.createPool(dbConfig);

// Initialize Database Tables & Seed Data
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database Successfully.');
        
        // 1. Island Feed / Media Hub Table
        connection.query(`
            CREATE TABLE IF NOT EXISTS island_feed (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                share_type VARCHAR(50),
                title VARCHAR(255),
                target_url TEXT,
                content TEXT
            )
        `, () => {
            connection.query('SELECT COUNT(*) as count FROM island_feed', (err, rows) => {
                if (!err && rows[0].count === 0) {
                    const seedData = [
                        ['image', 'Anadolu Sessions', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'Vibing with the bağlama and synth drone.'],
                        ['youtube', '🎵 Anadolu Psychedelic Sufi Rock - Yunus Emre Session', 'dQw4w9WgXcQ', 'Automated vertical video generated with bağlama instrumentation.']
                    ];
                    connection.query('INSERT INTO island_feed (share_type, title, target_url, content) VALUES ?', [seedData]);
                }
            });
        });

        // 2. Live Matches Table
        connection.query(`
            CREATE TABLE IF NOT EXISTS live_matches (
                id INT AUTO_INCREMENT PRIMARY KEY,
                league_name VARCHAR(100),
                home_team VARCHAR(100),
                away_team VARCHAR(100),
                match_date VARCHAR(100),
                venue VARCHAR(100)
            )
        `, () => {
            connection.query('SELECT COUNT(*) as count FROM live_matches', (err, rows) => {
                if (!err && rows[0].count === 0) {
                    const seedMatches = [
                        ['Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', '26 Oct 2026, 18:30', 'RAMS Park, Istanbul']
                    ];
                    connection.query('INSERT INTO live_matches (league_name, home_team, away_team, match_date, venue) VALUES ?', [seedMatches]);
                }
            });
        });

        connection.release();
    }
});

// Helper to extract YouTube ID
function extractYouTubeId(urlOrId) {
    if (!urlOrId) return 'dQw4w9WgXcQ';
    if (urlOrId.length === 11 && !urlOrId.includes('/') && !urlOrId.includes('.')) return urlOrId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
}

// API Endpoint to Share Content
app.post('/api/island/share', (req, res) => {
    let { share_type, title, target_url, content } = req.body;
    if (share_type === 'youtube') {
        target_url = extractYouTubeId(target_url);
    }
    const query = `INSERT INTO island_feed (share_type, title, target_url, content) VALUES (?, ?, ?, ?)`;
    pool.query(query, [share_type, title || 'Island Share', target_url || '', content || ''], () => {
        res.redirect('/island');
    });
});

// 1. ADMIN COMMAND CENTER (Private Root)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>Sovereign Command Center</title>
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
                <h1>⚓ Private Command Center (MySQL)</h1>
                <a href="/island" class="btn">🌐 View Island Portal</a>
            </header>
            <div class="card">
                <h2>System Control Panel</h2>
                <div style="display: flex; gap: 12px; margin-top: 15px; flex-wrap: wrap;">
                    <a href="/island" class="btn btn-alt">💬 Social Feed</a>
                    <a href="/island/videos" class="btn btn-alt">📺 Videos & Media Hub</a>
                    <a href="/island/matches" class="btn btn-alt">⚽ Match Probabilities</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// 2. PUBLIC PAGE 1: Social Feed & Sharing Hub
app.get('/island', (req, res) => {
    pool.query('SELECT * FROM island_feed ORDER BY id DESC', (err, feedItems) => {
        if (err) feedItems = [];
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anadolu Island - Social Feed</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 20px; }
                .container { max-width: 650px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                header { background: #111a14; padding: 18px 24px; border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #22c55e; font-size: 18px; }
                .nav-bar { display: flex; gap: 8px; background: #111a14; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); justify-content: center; }
                .nav-link { color: #94a3b8; text-decoration: none; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 8px; }
                .nav-link.active { background: #22c55e; color: #000; }
                .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
                input, select, textarea { width: 100%; padding: 10px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
                button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; width: 100%; }
                .feed-item { background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>🌴 Anadolu Island</h1>
                    <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin</a>
                </header>
                <div class="nav-bar">
                    <a href="/island" class="nav-link active">💬 Social Feed</a>
                    <a href="/island/videos" class="nav-link">📺 Videos & Media</a>
                    <a href="/island/matches" class="nav-link">⚽ Match Probs</a>
                </div>
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Share to Island Feed</h2>
                    <form action="/api/island/share" method="POST">
                        <select name="share_type" required>
                            <option value="youtube">📺 YouTube Video Link</option>
                            <option value="image">🖼️ Picture / Photo Link (e.g. from Facebook/Web)</option>
                        </select>
                        <input type="text" name="title" placeholder="Give it a clean title..." required>
                        <input type="text" name="target_url" placeholder="Paste YouTube link OR Direct Image URL..." required>
                        <textarea name="content" rows="2" placeholder="Your brief note or caption..."></textarea>
                        <button type="submit">Publish to Feed</button>
                    </form>
                </div>
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Island Stream</h2>
                    ${feedItems.map(item => `
                        <div class="feed-item">
                            <b style="color: #22c55e; font-size: 14px;">${item.title}</b>${item.share_type === 'youtube' ? `
                                <div style="position:relative; width:100%; padding-bottom:56.25%; background:#000; border-radius:8px; overflow:hidden;">
                                    <iframe src="https://www.youtube.com/embed/${item.target_url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
                                </div>
                            ` : `
                                <img src="${item.target_url}" style="width:100%; border-radius:8px; max-height:400px; object-fit:cover;" alt="Shared Media">
                            `}
                            ${item.content ? `<p style="color: #cbd5e1; font-size: 12px;">${item.content}</p>` : ''}
                            <span style="font-size: 10px; color: #94a3b8;">Shared: ${item.timestamp}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </body>
        </html>
        `);
    });
});

// 3. PUBLIC PAGE 2: Videos & Media Hub
app.get('/island/videos', (req, res) => {
    pool.query("SELECT * FROM island_feed WHERE share_type = 'youtube' ORDER BY id DESC", (err, videos) => {
        if (err) videos = [];
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anadolu Island - Videos Hub</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
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
                    <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin</a>
                </header>
                <div class="nav-bar">
                    <a href="/island" class="nav-link">💬 Social Feed</a>
                    <a href="/island/videos" class="nav-link active">📺 Videos & Media</a>
                    <a href="/island/matches" class="nav-link">⚽ Match Probs</a>
                </div>
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff; margin-bottom: 14px;">Anadolu Video Gallery</h2>
                    ${videos.map(v => `
                        <div style="background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; margin-bottom: 12px;">
                            <b style="color: #22c55e; font-size: 14px;">${v.title}</b>
                            <div style="position:relative; width:100%; padding-bottom:56.25%; background:#000; border-radius:8px; overflow:hidden; margin: 8px 0;">
                                <iframe src="https://www.youtube.com/embed/${v.target_url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
                            </div>
                            <p style="color: #cbd5e1; font-size: 12px;">${v.content}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </body>
        </html>
        `);
    });
});

// 4. PUBLIC PAGE 3: Match Probabilities
app.get('/island/matches', (req, res) => {
    pool.query('SELECT * FROM live_matches', (err, matches) => {
        if (err) matches = [];
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anadolu Island - Match Probabilities</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
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
                    <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin</a>
                </header>
                <div class="nav-bar">
                    <a href="/island" class="nav-link">💬 Social Feed</a>
                    <a href="/island/videos" class="nav-link">📺 Videos & Media</a>
                    <a href="/island/matches" class="nav-link active">⚽ Match Probs</a>
                </div>
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff; margin-bottom: 14px;">Live Süper Lig Probabilities</h2>
                    ${matches.map(m => `
                        <div style="background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px;">
                            <b>${m.home_team} vs${m.away_team}</b><br>
                            <span style="color:#38bdf8; font-size: 12px;">${m.match_date} &bull; ${m.venue}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </body>
        </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Sovereign MySQL Engine running live on port ${PORT}`);
});
