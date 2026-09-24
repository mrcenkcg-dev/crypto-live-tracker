/**
 * ==============================================================================
 * SOVEREIGN MASTER ENGINE: UNIFIED EMBEDDED SOCIAL FEED & ROUTER EDITION
 * Complete All-in-One Server Code for Render Deployment
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
// 1. DATABASE SETUP & UNIFIED TIMELINE SCHEMA
// ==============================================================================
const dbFile = path.join(__dirname, 'sovereign_master.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master Timeline DB.');
        initializeMasterSchema();
    }
});

function initializeMasterSchema() {
    db.serialize(() => {
        // Core Unified Timeline Feed with Embedded Media Support
        db.run(`CREATE TABLE IF NOT EXISTS sovereign_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            source_platform TEXT,
            target_platform TEXT,
            media_url TEXT,
            embed_code TEXT,
            title TEXT,
            author TEXT,
            syndication_status TEXT
        )`);

        // Seed initial active posts with clean sample embeds
        db.get(`SELECT COUNT(*) as count FROM sovereign_timeline`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO sovereign_timeline (source_platform, target_platform, media_url, embed_code, title, author, syndication_status) VALUES 
                    ('YouTube', 'All Networks', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Anatolian Sufi Rock Poetry Session', 'Cenk (Sovereign Admin)', 'LIVE STREAM ACTIVE'),
                    ('Instagram', 'YouTube Shorts', 'https://www.instagram.com/reel/Dda_BovoYw8', 'https://www.instagram.com/reel/Dda_BovoYw8/embed', 'Behind the Scenes: Building the Island Engine', 'Cenk (Sovereign Admin)', 'BRIDGE ACTIVE')`);
            }
        });

        // Connected Social Bridges Table
        db.run(`CREATE TABLE IF NOT EXISTS island_bridges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform_name TEXT,
            channel_handle TEXT,
            endpoint_url TEXT,
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM island_bridges`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO island_bridges (platform_name, channel_handle, endpoint_url, status) VALUES 
                    ('YouTube', '@AnadoluSufiRock', 'https://www.youtube.com', 'CONNECTED'),
                    ('TikTok', '@SovereignIsland', 'https://www.tiktok.com', 'CONNECTED'),
                    ('Instagram', '@CenkSovereign', 'https://www.instagram.com', 'CONNECTED'),
                    ('Facebook', 'Get Big Together Community', 'https://www.facebook.com', 'CONNECTED')`);
            }
        });
    });
}

// ==============================================================================
// 2. HELPER FUNCTION: CONVERT URLS TO CLEAN EMBEDS
// ==============================================================================
function generateEmbedHtml(url, title) {
    if (!url) return `<div style="padding:20px; color:#94a3b8;">No media attached</div>`;

    // YouTube Handling
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        if (videoId) {
            return `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 12px; background: #000;"></iframe>`;
        }
    }

    // Instagram Handling
    if (url.includes('instagram.com')) {
        let cleanCleanUrl = url.split('?')[0];
        if (!cleanCleanUrl.endsWith('/')) cleanCleanUrl += '/';
        return `<iframe src="${cleanCleanUrl}embed" width="100%" height="480" frameborder="0" scrolling="no" allowtransparency="true" style="border-radius: 12px; background: #000;"></iframe>`;
    }

    // TikTok Handling
    if (url.includes('tiktok.com')) {
        return `<div style="background:#18221b; padding:20px; border-radius:12px; text-align:center; border:1px solid rgba(34,197,94,0.3);">
                    <p style="color:#22c55e; font-weight:bold; margin-bottom:10px;">🎵 TikTok Media Feed Linked</p>
                    <a href="${url}" target="_blank" style="color:#38bdf8; text-decoration:underline; font-size:13px;">View Original TikTok Clip &rarr;</a>
                </div>`;
    }

    // Fallback Generic Link Card
    return `<div style="background:#18221b; padding:20px; border-radius:12px; text-align:center; border:1px solid rgba(34,197,94,0.3);">
                <p style="color:#22c55e; font-weight:bold; margin-bottom:10px;">🔗 Shared Content Link</p>
                <a href="${url}" target="_blank" style="color:#38bdf8; text-decoration:underline; font-size:13px;">Open External Media Stream &rarr;</a>
            </div>`;
}

// ==============================================================================
// 3. UNIVERSAL INGESTION API
// ==============================================================================
app.post('/api/island/ingest', (req, res) => {
    const { source_platform, target_platform, media_url, title, author } = req.body;
    
    const cleanSource = source_platform || 'Universal Web';
    const cleanTarget = target_platform || 'All Island Networks';
    const cleanUrl = media_url || '#';
    const cleanTitle = title || 'Untitled Sovereign Media';
    const cleanAuthor = author || 'Island Creator';
    
    const embedHtml = generateEmbedHtml(cleanUrl, cleanTitle);

    db.run(
        `INSERT INTO sovereign_timeline (source_platform, target_platform, media_url, embed_code, title, author, syndication_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cleanSource, cleanTarget, cleanUrl, embedHtml, cleanTitle, cleanAuthor, 'FEED LIVE & SYNDICATED'],
        (err) => {
            if (err) {
                console.error('Ingestion error:', err.message);
            }
            res.redirect('/island');
        }
    );
});

// ==============================================================================
// 4. CENTRAL ISLAND PORTAL & FEED INTERFACE
// ==============================================================================
app.get('/island', (req, res) => {
    db.all(`SELECT * FROM sovereign_timeline ORDER BY timestamp DESC`, (err, timelineRows) => {
        db.all(`SELECT * FROM island_bridges`, (err, bridgeRows) => {
            
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Sovereign Master Island - Live Social Feed</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                    .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                    header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                    h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                    p { color: #94a3b8; font-size: 13px; }
                    .badge { background: #22c55e; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                    .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                    h2 { font-size: 17px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; }
                    
                    /* Form Styles */
                    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
                    .form-group { display: flex; flex-direction: column; gap: 6px; }
                    label { font-size: 12px; color: #94a3b8; font-weight: 500; }
                    input, select { width: 100%; padding: 12px; background: #18221b; border: 1px solid rgba(34, 197, 94, 0.3); color: #fff; border-radius: 10px; font-size: 13px; }
                    button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-size: 14px; margin-top: 10px; transition: 0.2s; }
                    button:hover { background: #16a34a; }

                    /* Bridges Grid */
                    .bridge-box { display: flex; gap: 10px; flex-wrap: wrap; }
                    .bridge-card { background: #18221b; border: 1px solid rgba(34, 197, 94, 0.2); padding: 10px 14px; border-radius: 10px; color: #fff; font-size: 12px; display: flex; align-items: center; gap: 6px; }

                    /* Feed Stream */
                    .feed-stream { display: flex; flex-direction: column; gap: 20px; }
                    .post-card { background: #18221b; border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 14px; }
                    .post-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
                    .meta-tag { background: rgba(34, 197, 94, 0.2); color: #22c55e; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid rgba(34, 197, 94, 0.4); }
                    .post-title { font-size: 16px; color: #fff; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <div>
                            <h1>🌴 Sovereign Island Social Feed</h1>
                            <p>Direct In-Page Embedded Media Stream & Cross-Platform Bridge</p>
                        </div>
                        <span class="badge">FEED LIVE</span>
                    </header>

                    <!-- Active Bridges -->
                    <div class="card">
                        <h2>⚡ Connected Island Bridges</h2>
                        <div class="bridge-box">
                            ${bridgeRows ? bridgeRows.map(b => `
                                <div class="bridge-card">
                                    <span>🌐 <b>${b.platform_name}:</b></span>
                                    <span style="color: #38bdf8;">${b.channel_handle}</span>
                                </div>
                            `).join('') : ''}
                        </div>
                    </div>

                    <!-- Ingestion Form -->
                    <div class="card">
                        <h2>📥 Share Media to Island Feed</h2>
                        <form action="/api/island/ingest" method="POST">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Source Platform:</label>
                                    <select name="source_platform">
                                        <option value="YouTube">YouTube</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Sovereign Island">Sovereign Island Direct</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Target Syndication:</label>
                                    <select name="target_platform">
                                        <option value="All Networks">All Connected Networks</option>
                                        <option value="YouTube Shorts">YouTube Shorts Only</option>
                                        <option value="Instagram Reels">Instagram Reels Only</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Author / Handle:</label>
                                    <input type="text" name="author" placeholder="e.g. Cenk Göktüman" required>
                                </div>
                            </div>
                            <div class="form-grid" style="margin-top: 12px;">
                                <div class="form-group" style="grid-column: span 2;">
                                    <label>Media Link / URL (YouTube, Instagram, TikTok):</label>
                                    <input type="text" name="media_url" placeholder="Paste link here..." required>
                                </div>
                                <div class="form-group">
                                    <label>Title / Description:</label>
                                    <input type="text" name="title" placeholder="Give this post a title..." required>
                                </div>
                            </div>
                            <button type="submit">Publish Directly to Island Feed</button>
                        </form>
                    </div>

                    <!-- Live Embedded Social Feed -->
                    <div class="card">
                        <h2>🌊 Live Island Social Wall</h2>
                        <div class="feed-stream">
                            ${timelineRows && timelineRows.length > 0 ? timelineRows.map(row => `
                                <div class="post-card">
                                    <div class="post-header">
                                        <div>
                                            <span class="meta-tag">${row.source_platform} &rarr; ${row.target_platform}</span>
                                            <span style="font-size: 12px; color: #94a3b8; margin-left: 8px;">Posted by: <b>${row.author}</b></span>
                                        </div>
                                        <span style="font-size: 11px; color: #64748b;">${row.timestamp}</span>
                                    </div>
                                    <div class="post-title">${row.title}</div>
                                    <div style="width: 100%; margin-top: 4px;">
                                        ${row.embed_code}
                                    </div>
                                </div>
                            `).join('') : '<p style="color:#94a3b8;">No posts in feed yet.</p>'}
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `);
        });
    });
});

// Root Redirect
app.get('/', (req, res) => {
    res.redirect('/island');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Embedded Feed Engine running live on port ${PORT}`);
});
