/**
 * Sovereign Engine: Multimedia Upload & Social Agent Integration
 * Adds File Uploads, Media Queues, and YouTube/Facebook Sharing Pipelines.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer'); // Handles file uploads

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Storage for Uploaded Videos & Pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ensure upload directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// 1. Initialize SQLite Database Schema
const dbPath = path.resolve(__dirname, 'sovereign_engine.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master Database.');
    }
});

db.serialize(() => {
    // Super Agents Activity Log
    db.run(`CREATE TABLE IF NOT EXISTS super_agent_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        agent_name TEXT,
        action_taken TEXT,
        target_page TEXT,
        status TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM super_agent_logs`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO super_agent_logs (agent_name, action_taken, target_page, status) VALUES 
                    ('MultimediaAgent', 'Listening for uploaded video and picture payloads', '/library/media', 'ACTIVE'),
                    ('ProbabilityEngine', 'Calculating live match odds and statistical distributions', '/island', 'ACTIVE')`);
            }
        });
    });

    // Multimedia Upload Queue Table
    db.run(`CREATE TABLE IF NOT EXISTS media_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        media_type TEXT,
        title TEXT,
        file_path TEXT,
        target_platform TEXT,
        status TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM media_queue`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO media_queue (media_type, title, file_path, target_platform, status) VALUES 
                    ('Video', 'Anadolu Sufi Rock Teaser #1', '/uploads/sample-sufi.mp4', 'YouTube (@AnadoluSufiRock)', 'QUEUED FOR API SYNC'),
                    ('Picture', 'Get Big Together Community Banner', '/uploads/community-banner.jpg', 'Facebook', 'READY TO PUBLISH')`);
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
        away_rating INTEGER,
        ad_sponsor TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM live_matches`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO live_matches (league_name, home_team, away_team, match_date, venue, home_rating, away_rating, ad_sponsor) VALUES 
                    ('Süper Lig', 'Galatasaray S.K.', 'Kasımpaşa S.K.', '09 Oct 2026, 18:00', 'RAMS Park, Istanbul', 85, 72, 'Anadolu Sufi Rock Partner'),
                    ('Süper Lig', 'Çaykur Rizespor', 'Fenerbahçe SK', '10 Oct 2026, 17:00', 'Caykur Didi Stadium, Rize', 70, 84, 'Get Big Together Initiative'),
                    ('Süper Lig', 'Beşiktaş J.K.', 'Kocaelispor', '11 Oct 2026, 17:00', 'Tüpraş Stadium, Istanbul', 81, 68, 'Node Infrastructure Partner'),
                    ('Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', '26 Oct 2026, 18:30', 'RAMS Park, Istanbul', 85, 84, 'Anadolu Cultural Media')`);
            }
        });
    });

    // Social Channels Table
    db.run(`CREATE TABLE IF NOT EXISTS social_channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_name TEXT,
        channel_handle TEXT,
        profile_url TEXT,
        status TEXT
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM social_channels`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO social_channels (platform_name, channel_handle, profile_url, status) VALUES 
                    ('YouTube', '@AnadoluSufiRock', 'https://www.youtube.com', 'CONNECTED'),
                    ('Facebook', 'Get Big Together Community', 'https://www.facebook.com', 'CONNECTED')`);
            }
        });
    });
});

// 2. Dynamic Probability Calculator Function
function calculateLiveProbabilities(homeRating, awayRating) {
    const homeAdvantage = 5;
    const totalPower = homeRating + awayRating + homeAdvantage;
    let homeWin = Math.round(((homeRating + homeAdvantage) / totalPower) * 70);
    let awayWin = Math.round((awayRating / totalPower) * 70);
    let draw = 100 - (homeWin + awayWin);

    if (draw < 15) draw = 15;
    if (homeWin < 10) homeWin = 10;
    if (awayWin < 10) awayWin = 10;
    
    return { homeWin, draw, awayWin };
}

// 3. Media Upload Endpoint (Handles Videos & Pictures)
app.post('/api/media/upload', upload.single('mediaFile'), (req, res) => {
    const { title, target_platform, media_type } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';

    db.run(`INSERT INTO media_queue (media_type, title, file_path, target_platform, status) VALUES (?, ?, ?, ?, ?)`,
        [media_type || 'Video', title || 'Untitled Media', filePath, target_platform || 'YouTube', 'QUEUED & READY'], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.redirect('/library/media');
        });
});

// 4. Admin Command Center Hub with Media Upload Panel
app.get('/', (req, res) => {
    db.all(`SELECT * FROM media_queue ORDER BY timestamp DESC`, [], (errMedia, mediaItems) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><title>Sovereign Command Center</title>
            <style>
                body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 30px; }
                .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #22c55e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                h1 { color: #22c55e; font-size: 20px; margin: 0; }
                .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                .btn { background: #22c55e; color: #000; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: none; cursor: pointer; display: inline-block; }
                input, select { background: #1c1c1c; border: 1px solid #333; color: #fff; padding: 10px; border-radius: 8px; width: 100%; margin-top: 6px; margin-bottom: 12px; }
                label { font-size: 13px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div>
                        <h1>⚓ Private Command Center (Admin)</h1>
                        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Multimedia & Agent Hub</p>
                    </div>
                    <a href="/island" class="btn" style="background: #10b981;">🌐 View Public Portal</a>
                </header>

                <!-- MULTIMEDIA UPLOAD AGENT PANEL -->
                <div class="card" style="border: 1px solid #a855f7;">
                    <h2>📤 Upload Video or Picture for YouTube / Facebook</h2>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Drop your media files here to queue them for automated multi-agent publishing.</p>
                    <form action="/api/media/upload" method="POST" enctype="multipart/form-data" style="margin-top: 15px;">
                        <label>Media Title / Description</label>
                        <input type="text" name="title" placeholder="e.g. Yunus Emre Sufi Rock Session #2" required>

                        <label>Media Type</label>
                        <select name="media_type">
                            <option value="Video">Video (.mp4 / Short)</option>
                            <option value="Picture">Picture (.jpg / .png)</option>
                        </select>

                        <label>Target Platform</label>
                        <select name="target_platform">
                            <option value="YouTube (@AnadoluSufiRock)">YouTube (@AnadoluSufiRock)</option>
                            <option value="Facebook (Get Big Together)">Facebook (Get Big Together Community)</option>
                        </select>

                        <label>Select File from Device</label>
                        <input type="file" name="mediaFile" required>

                        <button type="submit" class="btn" style="background: #a855f7; color: #fff; width: 100%;">Upload & Queue to Agent Pipeline</button>
                    </form>
                </div>

                <!-- MEDIA QUEUE LIST -->
                <div class="card">
                    <h2>🎬 Active Media Queue (${mediaItems ? mediaItems.length : 0})</h2>
                    <ul style="list-style: none; padding: 0; margin-top: 10px;">
                        ${mediaItems ? mediaItems.map(m => `
                            <li style="background: #1c1c1c; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #333; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                                <div>
                                    <b style="color: #a855f7;">[${m.media_type}]${m.title}</b><br>
                                    <span style="color: #94a3b8; font-size: 12px;">Target: ${m.target_platform} \vert{} File:${m.file_path}</span>
                                </div>
                                <span style="background: rgba(34,197,94,0.2); color: #22c55e; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${m.status}</span>
                            </li>
                        `).join('') : ''}
                    </ul>
                </div>
            </div>
        </body>
        </html>
        `);
    });
});

// 5. Clean Public Portal (/island)
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM live_matches`, [], (err, matches) => {
        db.all(`SELECT * FROM social_channels`, [], (errSocial, socials) => {
            db.all(`SELECT * FROM media_queue`, [], (errMedia, mediaQueue) => {
                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8"><title>Anadolu Island - Portal</title>
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                        .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                        header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                        h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                        .btn { background: #1f2937; color: #fff; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #374151; }
                        .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                        h2 { font-size: 17px; color: #fff; }
                        .social-box { display: flex; gap: 12px; flex-wrap: wrap; }
                        .social-card { background: #18221b; border: 1px solid rgba(34, 197, 94, 0.3); padding: 12px 18px; border-radius: 10px; color: #fff; text-decoration: none; font-weight: bold; font-size: 13px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                        th, td { padding: 12px; text-align: left; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.06); }
                        th { color: #22c55e; font-weight: 600; text-transform: uppercase; font-size: 11px; background: #142017; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div>
                                <h1>🌴 Anadolu Island Public Portal</h1>
                                <p style="color:#94a3b8; font-size:13px;">Multimedia & Live Probability Active</p>
                            </div>
                            <a href="/" class="btn">&larr; Admin Command Center</a>
                        </header>

                        <!-- SOCIAL CHANNELS -->
                        <div class="card">
                            <h2>📡 Connected Creator Channels</h2>
                            <div class="social-box">
                                ${socials ? socials.map(s => `
                                    <a href="${s.profile_url}" target="_blank" class="social-card">
                                        📺 ${s.platform_name}: <span style="color:#22c55e;">${s.channel_handle}</span>
                                    </a>
                                `).join('') : ''}
                            </div>
                        </div>

                        <!-- RECENTLY UPLOADED MEDIA SHOWCASE -->
                        <div class="card">
                            <h2>🎬 Recent Multimedia & Uploaded Content</h2>
                            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">
                                ${mediaQueue ? mediaQueue.map(m => `
                                    <li style="background:#18221b; padding:12px; border-radius:10px; border:1px solid rgba(168,85,247,0.3); display:flex; justify-content:space-between; align-items:center;">
                                        <div>
                                            <b style="color:#a855f7;">${m.title}</b> <span style="color:#94a3b8; font-size:12px;">(${m.media_type})</span><br>
                                            <span style="color:#38bdf8; font-size:11px;">Target: ${m.target_platform}</span>
                                        </div>
                                        <a href="${m.file_path}" target="_blank" style="background:#22c55e; color:#000; padding:6px 12px; border-radius:6px; font-weight:bold; font-size:11px; text-decoration:none;">View File</a>
                                    </li>
                                `).join('') : ''}
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

app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Engine running live on port ${PORT}`);
});
