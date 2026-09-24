/**
 * Sovereign Master Engine: Universal Multi-Social Cross-Sharing Edition
 * Complete, all-in-one server code for Render deployment.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const dbFile = path.join(__dirname, 'sovereign.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master Database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Universal Content Sharing Table
        db.run(`CREATE TABLE IF NOT EXISTS shared_media_stream (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            source_platform TEXT,
            target_platform TEXT,
            media_url TEXT,
            caption_title TEXT,
            contributor TEXT,
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM shared_media_stream`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO shared_media_stream (source_platform, target_platform, media_url, caption_title, contributor, status) VALUES 
                    ('YouTube', 'Facebook & TikTok', 'https://www.youtube.com/watch?v=sample', 'Anatolian Sufi Rock Poetry Session', 'Cenk (Admin)', 'SYNDICATED'),
                    ('Instagram', 'YouTube Shorts', 'https://www.instagram.com/reel/Dda_BovoYw8', 'Behind the scenes at the Sovereign Engine', 'Cenk (Admin)', 'BRIDGE ACTIVE')`);
            }
        });

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
                    ('Instagram', '@CenkSovereignEngine', 'https://www.instagram.com', 'Visual Media & Stories', 'CONNECTED'),
                    ('TikTok', '@SovereignCreator', 'https://www.tiktok.com', 'Short-form Clips', 'CONNECTED')`);
            }
        });
    });
}

// Toll Gate Middleware
function microFeeTollGate(fee = '$0.001') {
    return (req, res, next) => {
        next();
    };
}

// API: Submit a cross-shared media link
app.post('/api/media/share', (req, res) => {
    const { source_platform, target_platform, media_url, caption_title, contributor } = req.body;
    db.run(`INSERT INTO shared_media_stream (source_platform, target_platform, media_url, caption_title, contributor, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [source_platform, target_platform || 'All Platforms', media_url, caption_title || 'Shared Community Content', contributor || 'Community Member', 'QUEUED FOR SYNDICATION'], () => {
            res.redirect('/island');
        });
});

// Admin Command Center
app.get('/', (req, res) => {
    db.all(`SELECT * FROM shared_media_stream ORDER BY timestamp DESC`, (err, streams) => {
        db.all(`SELECT * FROM social_channels`, (err, socials) => {
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8"><title>Sovereign Cross-Social Hub</title>
                <style>
                    body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 30px; }
                    .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                    header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #22c55e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                    h1 { color: #22c55e; font-size: 20px; margin: 0; }
                    .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                    .btn { background: #262626; color: #fff; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #3f3f46; display: inline-block; }
                    input, select { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 12px; background: #1c1c1c; border: 1px solid #333; color: #fff; border-radius: 8px; }
                    button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { padding: 10px; text-align: left; font-size: 13px; border-bottom: 1px solid #222; }
                    th { color: #22c55e; font-size: 11px; text-transform: uppercase; }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <div>
                            <h1>⚡ Universal Cross-Social Hub</h1>
                            <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Share from any platform, broadcast to all.</p>
                        </div>
                        <a href="/island" class="btn" style="background: #10b981; color:#000;">🌴 Go to Community Island</a>
                    </header>

                    <div class="card">
                        <h2>🔄 Active Syndication Streams</h2>
                        <table>
                            <thead>
                               <tr>
                                   <th>Source &rarr; Target</th>
                                   <th>Title / Link</th>
                                   <th>Contributor</th>
                                   <th>Status</th>
                               </tr>
                            </thead>
                            <tbody>
                                ${streams ? streams.map(s => `
                                <tr>
                                    <td><b>${s.source_platform}</b> &rarr; <span style="color:#38bdf8">${s.target_platform}</span></td>
                                    <td><a href="${s.media_url}" target="_blank" style="color:#22c55e; text-decoration:none;">${s.caption_title}</a></td>
                                    <td>${s.contributor}</td>
                                    <td><span style="color: #22c55e; font-size:11px; font-weight:bold;">${s.status}</span></td>
                                </tr>`).join('') : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </body>
            </html>
            `);
        });
    });
});

// Community Island Portal (Where visitors can post and share links)
app.get('/island', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT * FROM shared_media_stream ORDER BY timestamp DESC LIMIT 10`, (err, streams) => {
        db.all(`SELECT * FROM social_channels`, (err, socials) => {
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8"><title>Anadolu Island - Cross-Sharing Portal</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                    .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                    header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                    h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                    p { color: #94a3b8; font-size: 13px; }
                    .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                    h2 { font-size: 17px; color: #fff; }
                    label { font-size: 12px; color: #94a3b8; display: block; margin-top: 8px; }
                    input, select { width: 100%; padding: 12px; margin-top: 4px; background: #18221b; border: 1px solid rgba(34, 197, 94, 0.3); color: #fff; border-radius: 10px; font-size: 13px; }
                    button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; margin-top: 14px; font-size: 14px; }
                    .stream-item { background: #18221b; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <div>
                            <h1>🌴 Anadolu Island Cross-Sharing Portal</h1>
                            <p>Bring content from TikTok, YouTube, Instagram or Facebook and share it across all networks.</p>
                        </div>
                        <a href="/" style="color:#22c55e; text-decoration:none; font-weight:bold; font-size:13px;">&larr; Admin Command Center</a>
                    </header>

                    <div class="card">
                        <h2>🔗 Share Content to All Pages</h2>
                        <p>Paste any link from YouTube, Instagram, TikTok or Facebook below. The bridge will syndicate it across your community pages.</p>
                        <form action="/api/media/share" method="POST">
                            <label>Origin Platform:</label>
                            <select name="source_platform">
                                <option value="YouTube">YouTube</option>
                                <option value="Instagram">Instagram</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Facebook">Facebook</option>
                            </select>

                            <label>Target Syndication:</label>
                            <select name="target_platform">
                                <option value="All Connected Networks">All Connected Networks (TikTok, FB, IG, YouTube)</option>
                                <option value="YouTube Shorts & Feed">YouTube Only</option>
                                <option value="Facebook Community Reel">Facebook Only</option>
                                <option value="Instagram & TikTok">Instagram & TikTok</option>
                            </select>

                            <label>Media Link / URL:</label>
                            <input type="text" name="media_url" placeholder="https://www.instagram.com/reel/... or YouTube link" required>

                            <label>Title / Caption:</label>
                            <input type="text" name="caption_title" placeholder="Give this shared post a title or description..." required>

                            <label>Your Name / Handle (Optional):</label>
                            <input type="text" name="contributor" placeholder="e.g. Cenk or Community Visitor">

                            <button type="submit">Publish & Syndicate Across Pages</button>
                        </form>
                    </div>

                    <div class="card">
                        <h2>📡 Community & Shared Stream Feed</h2>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${streams ? streams.map(s => `
                                <div class="stream-item">
                                    <div>
                                        <span style="background:rgba(34,197,94,0.2); color:#22c55e; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:bold;">${s.source_platform} &rarr; ${s.target_platform}</span>
                                        <h3 style="font-size:14px; margin-top:6px;"><a href="${s.media_url}" target="_blank" style="color:#fff; text-decoration:none;">${s.caption_title}</a></h3>
                                        <p style="font-size:11px; color:#94a3b8; margin-top:2px;">Shared by: ${s.contributor}</p>
                                    </div>
                                    <a href="${s.media_url}" target="_blank" style="background:#262626; color:#fff; padding:8px 12px; border-radius:8px; font-size:12px; text-decoration:none; border:1px solid #3f3f46;">View Media</a>
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
    console.log(`🚀 Sovereign Multi-Social Cross-Sharing Engine running on port ${PORT}`);
});
