/**
 * Sovereign Engine: Zero-Dependency Native Storage Edition
 * Bypasses npm build hangs on Render by using native Node.js data handling.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple JSON File-Based Database for Render Cloud Storage
const dbFile = path.resolve(__dirname, 'sovereign_data.json');

function loadDB() {
    if (!fs.existsSync(dbFile)) {
        const initialData = {
            community_posts: [
                { id: 1, timestamp: '2026-09-26 12:00:00', author_name: 'Cenk Göktüman', post_content: 'Welcome to the new Anadolu Island community feed! Shoulder to shoulder, we grow together.', media_url: 'https://www.youtube.com', likes_count: 12 },
                { id: 2, timestamp: '2026-09-26 12:05:00', author_name: 'Sufi Rock Bot', post_content: 'New Yunus Emre verse rendered with bağlama and synth grooves. Check the media tab!', media_url: 'https://www.youtube.com', likes_count: 8 }
            ],
            island_videos: [
                { id: 1, timestamp: '2026-09-26 12:00:00', title: '🎵 Anadolu Psychedelic Sufi Rock - Yunus Emre Session', youtube_id: 'dQw4w9WgXcQ', description: 'Automated vertical video generated with bağlama instrumentation and synth drone.', category: 'Music' },
                { id: 2, timestamp: '2026-09-26 12:05:00', title: '⚡ Get Big Together Community Showcase', youtube_id: 'dQw4w9WgXcQ', description: 'Highlights of our multi-agent pipeline, wildlife rescue simulations, and public feeds.', category: 'Project' }
            ],
            live_matches: [
                { id: 1, league_name: 'Süper Lig', home_team: 'Galatasaray S.K.', away_team: 'Fenerbahçe SK', match_date: '26 Oct 2026, 18:30', venue: 'RAMS Park, Istanbul' }
            ]
        };
        fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
    }
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function saveDB(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Helper function to extract YouTube ID
function extractYouTubeId(urlOrId) {
    if (!urlOrId) return 'dQw4w9WgXcQ';
    if (urlOrId.length === 11 && !urlOrId.includes('/') && !urlOrId.includes('.')) return urlOrId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
}

// Routes for Posts & Videos
app.post('/api/community/post', (req, res) => {
    const { author_name, post_content, media_url } = req.body;
    const dbData = loadDB();
    dbData.community_posts.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        author_name: author_name || 'Community Member',
        post_content,
        media_url: media_url || 'https://www.youtube.com',
        likes_count: 0
    });
    saveDB(dbData);
    res.redirect('/island');
});

app.post('/api/videos/add', (req, res) => {
    const { title, youtube_url, description, category } = req.body;
    const dbData = loadDB();
    dbData.island_videos.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        title: title || 'Community Video',
        youtube_id: extractYouTubeId(youtube_url),
        description: description || 'Shared via Anadolu Island feed.',
        category: category || 'General'
    });
    saveDB(dbData);
    res.redirect('/island/videos');
});

// Admin Control Center
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
                <h2>System Control Panel (Zero-Dependency Engine)</h2>
                <div style="display: flex; gap: 12px; margin-top: 15px; flex-wrap: wrap;">
                    <a href="/island" class="btn btn-alt">Open Social Feed (/island)</a>
                    <a href="/island/videos" class="btn btn-alt">Open Video Hub (/island/videos)</a>
                    <a href="/island/matches" class="btn btn-alt">Open Match Probs (/island/matches)</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Public Page 1: Social Feed
app.get('/island', (req, res) => {
    const dbData = loadDB();
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anadolu Island - Community Social Feed</title>
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
            textarea, input { width: 100%; padding: 10px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
            button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; width: 100%; }
            .post-box { background: #152019; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🌴 Anadolu Island</h1>
                <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin Login</a>
            </header>
            <div class="nav-bar">
                <a href="/island" class="nav-link active">💬 Social Feed</a>
                <a href="/island/videos" class="nav-link">📺 Videos & Media</a>
                <a href="/island/matches" class="nav-link">⚽ Match Probs</a>
            </div>
            <div class="card">
                <h2 style="font-size: 15px; color: #fff;">Share with the Community</h2>
                <form action="/api/community/post" method="POST">
                    <input type="text" name="author_name" placeholder="Your Name or Handle" required>
                    <textarea name="post_content" rows="3" placeholder="What's happening on your mind today?" required></textarea>
                    <button type="submit">Post to Island Feed</button>
                </form>
            </div>
            <div class="card">
                <h2 style="font-size: 15px; color: #fff;">Community Stream</h2>
                ${dbData.community_posts.map(p => `
                    <div class="post-box">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8;">
                            <span style="color: #22c55e; font-weight: bold;">${p.author_name}</span>
                            <span>${p.timestamp}</span>
                        </div>
                        <div style="font-size: 13px; color: #f1f5f9;">${p.post_content}</div>
                        <div style="font-size: 11px; color: #38bdf8;">❤️ ${p.likes_count} Likes</div>
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
    `);
});

// Public Page 2: Video & Media Hub with YouTube Sharing
app.get('/island/videos', (req, res) => {
    const dbData = loadDB();
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anadolu Island - Videos & Media Hub</title>
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
            input, textarea { width: 100%; padding: 10px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
            button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; width: 100%; }
            .video-card { background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
            .video-container { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; background: #000; border-radius: 8px; overflow: hidden; margin: 8px 0; }
            .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
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
                <h2 style="font-size: 15px; color: #fff;">Share a YouTube Video</h2>
                <form action="/api/videos/add" method="POST">
                    <input type="text" name="title" placeholder="Video Title" required>
                    <input type="text" name="youtube_url" placeholder="YouTube Link or ID (e.g., https://youtu.be/...)" required>
                    <textarea name="description" rows="2" placeholder="Brief note about this video..." required></textarea>
                    <button type="submit">Publish Video to Island Hub</button>
                </form>
            </div>
            <div class="card">
                <h2 style="font-size: 15px; color: #fff;">Community Video Gallery</h2>
                ${dbData.island_videos.map(v => `
                    <div class="video-card">
                        <b style="color: #22c55e; font-size: 14px;">${v.title}</b>
                        <div class="video-container">
                            <iframe src="https://www.youtube.com/embed/${v.youtube_id}" allowfullscreen></iframe>
                        </div>
                        <p style="color: #cbd5e1; font-size: 12px;">${v.description}</p>
                        <span style="font-size: 10px; color: #94a3b8;">Shared: ${v.timestamp}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
    `);
});

// Public Page 3: Match Probabilities
app.get('/island/matches', (req, res) => {
    const dbData = loadDB();
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anadolu Island - Live Match Probabilities</title>
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
                <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin Login</a>
            </header>
            <div class="nav-bar">
                <a href="/island" class="nav-link">💬 Social Feed</a>
                <a href="/island/videos" class="nav-link">📺 Videos & Media</a>
                <a href="/island/matches" class="nav-link active">⚽ Match Probs</a>
            </div>
            <div class="card">
                <h2 style="font-size: 15px; color: #fff; margin-bottom: 14px;">Live Süper Lig Probabilities</h2>
                ${dbData.live_matches.map(m => `
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

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Engine running live on port ${PORT}`);
});
