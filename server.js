/**
 * Sovereign Engine: Dynamic YouTube Video Sharing Upgrade
 * Allows adding and embedding YouTube videos dynamically into /island/videos.
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
    else console.log('✅ Connected to Sovereign Master Database (Dynamic YouTube Edition).');
});

db.serialize(() => {
    // Community Posts Table
    db.run(`CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        author_name TEXT,
        post_content TEXT,
        media_url TEXT,
        likes_count INTEGER DEFAULT 0
    )`);

    // NEW: Dynamic YouTube & Media Hub Table
    db.run(`CREATE TABLE IF NOT EXISTS island_videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        title TEXT,
        youtube_id TEXT,
        description TEXT,
        category TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM island_videos`, (err, row) => {
            if (row && row.count === 0) {
                // Insert initial default videos with real YouTube IDs (e.g., sample placeholders or your tracks)
                db.run(`INSERT INTO island_videos (title, youtube_id, description, category) VALUES 
                    ('🎵 Anadolu Psychedelic Sufi Rock - Yunus Emre Session', 'dQw4w9WgXcQ', 'Automated vertical video generated with bağlama instrumentation and synth drone.', 'Music'),
                    ('⚡ Get Big Together Community Showcase', 'dQw4w9WgXcQ', 'Highlights of our multi-agent pipeline, wildlife rescue simulations, and public feeds.', 'Project')`);
            }
        });
    });

    // Live Matches Table
    db.run(`CREATE TABLE IF NOT EXISTS live_matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        league_name TEXT,
        home_team TEXT,
        away_team TEXT,
        match_date TEXT,
        venue TEXT,
        home_rating INTEGER,
        away_rating INTEGER
    )`);
});

// Helper function to extract YouTube ID from standard or shortened URLs (e.g., watch?v=ID or youtu.be/ID)
function extractYouTubeId(urlOrId) {
    if (!urlOrId) return 'dQw4w9WgXcQ';
    if (urlOrId.length === 11 && !urlOrId.includes('/') && !urlOrId.includes('.')) {
        return urlOrId; // It's already an ID
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
}

// 2. API endpoint to add a new YouTube video from public/admin input
app.post('/api/videos/add', (req, res) => {
    const { title, youtube_url, description, category } = req.body;
    const cleanVideoId = extractYouTubeId(youtube_url);
    
    db.run(`INSERT INTO island_videos (title, youtube_id, description, category) VALUES (?, ?, ?, ?)`,
        [title || 'Community Shared Video', cleanVideoId, description || 'Shared via Anadolu Island feed.', category || 'General'], () => {
            res.redirect('/island/videos');
        });
});

// 3. Admin Command Center (Private)
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
                <h1>⚓ Private Command Center (Admin)</h1>
                <a href="/island" class="btn">🌐 View Public Island Portal</a>
            </header>
            <div class="card">
                <h2>System Control Panel</h2>
                <div style="display: flex; gap: 12px; margin-top: 15px; flex-wrap: wrap;">
                    <a href="/island" class="btn btn-alt">Open Social Feed (/island)</a>
                    <a href="/island/videos" class="btn btn-alt">Open Video Hub (/island/videos)</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// 4. PUBLIC PAGE 1: Social Feed (/island)
app.get('/island', (req, res) => {
    res.redirect('/island'); // simplified redirect placeholder for brevity
});

// 5. PUBLIC PAGE 2: Dynamic Video & Media Hub with YouTube Embedding (/island/videos)
app.get('/island/videos', (req, res) => {
    db.all(`SELECT * FROM island_videos ORDER BY id DESC`, [], (err, videos) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anadolu Island - Videos & Media Hub</title>
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
                input, textarea { width: 100%; padding: 10px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
                button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; width: 100%; }
                .video-card { background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
                .video-container { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; background: #000; border-radius: 8px; overflow: hidden; }
                .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>🌴 Anadolu Island</h1>
                    <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin Login</a>
                </header>

                <!-- Navigation -->
                <div class="nav-bar">
                    <a href="/island" class="nav-link">💬 Social Feed</a>
                    <a href="/island/videos" class="nav-link active">📺 Videos & Media</a>
                    <a href="/island/matches" class="nav-link">⚽ Match Probs</a>
                </div>

                <!-- Share YouTube Video Form -->
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Share a YouTube Video</h2>
                    <form action="/api/videos/add" method="POST">
                        <input type="text" name="title" placeholder="Video Title (e.g., Sufi Rock Jam)" required>
                        <input type="text" name="youtube_url" placeholder="YouTube Link or ID (e.g., https://youtu.be/...)" required>
                        <textarea name="description" rows="2" placeholder="Brief note about this video..." required></textarea>
                        <button type="submit">Publish Video to Island Hub</button>
                    </form>
                </div>

                <!-- Video Stream Feed -->
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Community Video Gallery</h2>
                    <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 4px;">
                        ${videos ? videos.map(v => `
                            <div class="video-card">
                                <b style="color: #22c55e; font-size: 14px;">${v.title}</b>
                                <div class="video-container">
                                    <iframe src="https://www.youtube.com/embed/${v.youtube_id}" allowfullscreen></iframe>
                                </div>
                                <p style="color: #cbd5e1; font-size: 12px; line-height: 1.4;">${v.description}</p>
                                <span style="font-size: 10px; color: #94a3b8;">Category: ${v.category} &bull; Shared:${v.timestamp}</span>
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

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Engine running live on port ${PORT}`);
});
