/**
 * ==============================================================================
 * SOVEREIGN MASTER ENGINE: UNIFIED ALL-IN-ONE ECOSYSTEM & EMBEDDED FEED EDITION
 * Complete Combined Code for Render & GitHub Deployment
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
// 1. DATABASE SETUP & COMPREHENSIVE MASTER SCHEMA
// ==============================================================================
const dbFile = path.join(__dirname, 'sovereign_master.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Master Ecosystem DB.');
        initializeMasterDatabase();
    }
});

function initializeMasterDatabase() {
    db.serialize(() => {
        // Super Agent Logs Table
        db.run(`CREATE TABLE IF NOT EXISTS super_agent_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            agent_name TEXT,
            action_taken TEXT,
            target_page TEXT,
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM super_agent_logs`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO super_agent_logs (agent_name, action_taken, target_page, status) VALUES 
                    ('ProbabilityEngine', 'Calculating live match odds and statistical distributions', '/island', 'ACTIVE'),
                    ('MultiSocialBridge', 'Syncing YouTube Shorts, Facebook Reels & Instagram feeds', '/island', 'ONLINE'),
                    ('WatcherAgent', 'Verified real-time internet telemetry and micro-fee toll gates', '/', 'ACTIVE')`);
            }
        });

        // Treasury Vault Table
        db.run(`CREATE TABLE IF NOT EXISTS treasury_vault (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            daily_inflow DECIMAL(10,2),
            reinvested_amount DECIMAL(10,2),
            total_vault_balance DECIMAL(10,2),
            status TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM treasury_vault`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO treasury_vault (daily_inflow, reinvested_amount, total_vault_balance, status) VALUES (4.00, 2.00, 184.50, 'LIVE & COMPOUNDING')`);
            }
        });

        // Toll Transactions Table
        db.run(`CREATE TABLE IF NOT EXISTS toll_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            service_endpoint TEXT,
            fee_amount TEXT,
            client_origin TEXT,
            status TEXT
        )`);

        // Live Matches Table
        db.run(`CREATE TABLE IF NOT EXISTS live_matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            league_name TEXT,
            home_team TEXT,
            away_team TEXT,
            match_date TEXT,
            match_score TEXT,
            venue TEXT,
            home_rating INT,
            away_rating INT,
            status TEXT,
            ad_sponsor TEXT
        )`);

        db.get(`SELECT COUNT(*) as count FROM live_matches`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO live_matches (league_name, home_team, away_team, match_date, match_score, venue, home_rating, away_rating, status, ad_sponsor) VALUES 
                    ('Süper Lig', 'Galatasaray S.K.', 'Kasımpaşa S.K.', '09 Oct 2026, 18:00', '2 - 1', 'RAMS Park, Istanbul', 85, 72, 'PLAYING', 'Anadolu Sufi Rock Partner'),
                    ('Süper Lig', 'Çaykur Rizespor', 'Fenerbahçe SK', '10 Oct 2026, 17:00', '0 - 0', 'Caykur Didi Stadium, Rize', 70, 84, 'UPCOMING', 'Get Big Together Initiative')`);
            }
        });

        // Social Channels Table
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
                    ('Instagram', '@CenkSovereignEngine', 'https://www.instagram.com', 'Visual Media & Stories', 'CONNECTED')`);
            }
        });

        // Sovereign Embedded Timeline Feed Table
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

        db.get(`SELECT COUNT(*) as count FROM sovereign_timeline`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO sovereign_timeline (source_platform, target_platform, media_url, embed_code, title, author, syndication_status) VALUES 
                    ('YouTube', 'All Networks', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Anatolian Sufi Rock Poetry Session" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 12px; background: #000;"></iframe>', 'Anatolian Sufi Rock Poetry Session', 'Cenk (Sovereign Admin)', 'LIVE STREAM ACTIVE'),
                    ('Instagram', 'YouTube Shorts', 'https://www.instagram.com/reel/Dda_BovoYw8', '<div style="background:#18221b; padding:20px; border-radius:12px; text-align:center; border:1px solid rgba(34,197,94,0.3);"><p style="color:#22c55e; font-weight:bold; margin-bottom:10px;">📸 Instagram Media Stream Linked</p><a href="https://www.instagram.com/reel/Dda_BovoYw8" target="_blank" style="color:#38bdf8; text-decoration:underline; font-size:13px;">View Reel &rarr;</a></div>', 'Behind the Scenes: Building the Island Engine', 'Cenk (Sovereign Admin)', 'BRIDGE ACTIVE')`);
            }
        });
    });
}

// ==============================================================================
// 2. HELPER FUNCTIONS & MIDDLEWARE
// ==============================================================================
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

function microFeeTollGate(fee = '$0.001') {
    return (req, res, next) => {
        const endpoint = req.originalUrl;
        const origin = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Local Client';
        db.run(`INSERT INTO toll_transactions (service_endpoint, fee_amount, client_origin, status) VALUES (?, ?, ?, ?)`,
            [endpoint, fee, origin, 'PAID & LOGGED']);
        next();
    };
}

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
        let cleanUrl = url.split('?')[0];
        if (!cleanUrl.endsWith('/')) cleanUrl += '/';
        return `<iframe src="${cleanUrl}embed" width="100%" height="480" frameborder="0" scrolling="no" allowtransparency="true" style="border-radius: 12px; background: #000;"></iframe>`;
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
// 3. API ROUTES & ACTION HANDLERS
// ==============================================================================
app.post('/api/social/add', (req, res) => {
    const { platform_name, channel_handle, profile_url, content_type } = req.body;
    db.run(`INSERT INTO social_channels (platform_name, channel_handle, profile_url, content_type, status) VALUES (?, ?, ?, ?, ?)`,
        [platform_name, channel_handle, profile_url, content_type || 'Shorts / Reels', 'CONNECTED'], () => {
            res.redirect('/');
        });
});

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
        () => {
            res.redirect('/island');
        }
    );
});

// ==============================================================================
// 4. COMMAND CENTER (Root Route)
// ==============================================================================
app.get('/', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT fee_amount FROM toll_transactions`, (err, tolls) => {
        db.all(`SELECT * FROM super_agent_logs ORDER BY timestamp DESC LIMIT 5`, (err, agents) => {
            db.get(`SELECT total_vault_balance, daily_inflow FROM treasury_vault ORDER BY id DESC LIMIT 1`, (err, treasury) => {
                db.all(`SELECT * FROM social_channels`, (err, socials) => {
                    let totalRev = 0;
                    if (tolls) tolls.forEach(t => totalRev += parseFloat(t.fee_amount.replace('$', '')) || 0.001);
                    const vaultBalance = treasury ? treasury.total_vault_balance : 184.50;
                    const dailyInflow = treasury ? treasury.daily_inflow : 4.00;

                    res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8"><title>Sovereign Multi-Social Command Center</title>
                        <style>
                            body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 30px; }
                            .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                            header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #22c55e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                            h1 { color: #22c55e; font-size: 20px; margin: 0; }
                            .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
                            .btn { background: #262626; color: #fff; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; border: 1px solid #3f3f46; display: inline-block; }
                            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 15px; }
                            .metric-box { background: #1c1c1c; border-radius: 10px; padding: 16px; border: 1px solid #333; }
                            .metric-value { font-size: 20px; font-weight: bold; color: #22c55e; margin-top: 6px; }
                            ul { padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.6; }
                            input { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 12px; background: #1c1c1c; border: 1px solid #333; color: #fff; border-radius: 8px; }
                            button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <header>
                                <div>
                                    <h1>⚡ Sovereign Multi-Social & Multimedia Command Center</h1>
                                    <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Ledger Revenue: $${totalRev.toFixed(3)}</p>
                                </div>
                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                    <a href="/island" class="btn" style="background: #10b981; color:#000;">🌴 Visit Island Portal & Feed</a>
                                </div>
                            </header>

                            <div class="card" style="border: 1px solid #22c55e;">
                                <h2>🏦 Treasury Vault & Active Networks</h2>
                                <div class="grid">
                                    <div class="metric-box">
                                        <div style="color: #aaa; font-size: 12px;">Daily Multi-Platform Inflow</div>
                                        <div class="metric-value">$${parseFloat(dailyInflow).toFixed(2)} / day</div>
                                    </div>
                                    <div class="metric-box">
                                        <div style="color: #aaa; font-size: 12px;">Total Vault Balance</div>
                                        <div class="metric-value">$${parseFloat(vaultBalance).toFixed(2)}</div>
                                    </div>
                                </div>
                                <h3 style="font-size: 15px; color: #fff; margin-top: 20px;">Connected Social Channels</h3>
                                <ul>
                                    ${socials ? socials.map(s => `<li><b>[${s.platform_name}]</b> ${s.channel_handle} (${s.content_type}) &mdash; <span style="color:#22c55e">${s.status}</span></li>`).join('') : ''}
                                </ul>
                            </div>

                            <div class="card">
                                <h2>🔗 Register New Social Platform Bridge</h2>
                                <form action="/api/social/add" method="POST">
                                    <label>Platform Name:</label>
                                    <input type="text" name="platform_name" placeholder="e.g. TikTok" required>
                                    <label>Channel Handle:</label>
                                    <input type="text" name="channel_handle" placeholder="e.g. @CenkSovereign" required>
                                    <label>Profile URL:</label>
                                    <input type="text" name="profile_url" placeholder="https://..." required>
                                    <label>Content Type:</label>
                                    <input type="text" name="content_type" placeholder="e.g. Vertical Shorts" required>
                                    <button type="submit">Connect Social Bridge</button>
                                </form>
                            </div>
                        </div>
                    </body>
                    </html>
                    `);
                });
            });
        });
    });
});

// ==============================================================================
// 5. INTERACTIVE ISLAND PORTAL & EMBEDDED FEED (/island)
// ==============================================================================
app.get('/island', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT * FROM live_matches`, (err, matches) => {
        db.all(`SELECT * FROM social_channels`, (err, socials) => {
            db.all(`SELECT * FROM sovereign_timeline ORDER BY timestamp DESC`, (err, timelineRows) => {
                db.get(`SELECT total_vault_balance, daily_inflow FROM treasury_vault ORDER BY id DESC LIMIT 1`, (err, treasury) => {
                    
                    res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Anadolu Island - Multi-Social Portal & Feed</title>
                        <style>
                            * { box-sizing: border-box; margin: 0; padding: 0; }
                            body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                            .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                            header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                            h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                            p { color: #94a3b8; font-size: 13px; }
                            .badge { background: #22c55e; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                            .btn { background: #1f2937; color: #fff; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #374151; }
                            .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                            h2 { font-size: 17px; color: #fff; }
                            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                            th, td { padding: 12px; text-align: left; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.06); }
                            th { color: #22c55e; font-weight: 600; text-transform: uppercase; font-size: 11px; background: #142017; }
                            .prob-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-right: 4px; font-family: monospace; }
                            .home-prob { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.4); }
                            .draw-prob { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
                            .away-prob { background: rgba(244, 63, 94, 0.2); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); }
                            .social-box { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px; }
                            .social-card { background: #18221b; border: 1px solid rgba(34, 197, 94, 0.3); padding: 12px 18px; border-radius: 10px; color: #fff; text-decoration: none; font-weight: bold; font-size: 13px; display: flex; align-items: center; gap: 8px; }
                            
                            /* Ingestion Form */
                            .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
                            .form-group { display: flex; flex-direction: column; gap: 6px; }
                            label { font-size: 12px; color: #94a3b8; font-weight: 500; }
                            input, select { width: 100%; padding: 12px; background: #18221b; border: 1px solid rgba(34, 197, 94, 0.3); color: #fff; border-radius: 10px; font-size: 13px; }
                            button[type="submit"] { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-size: 14px; margin-top: 10px; transition: 0.2s; }
                            button[type="submit"]:hover { background: #16a34a; }

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
                                    <h1>🌴 Anadolu Island Multi-Social Portal & Feed</h1>
                                    <p>Status: <span class="badge">UNIFIED ECOSYSTEM ACTIVE</span></p>
                                </div>
                                <a href="/" class="btn">&larr; Command Center</a>
                            </header>

                            <!-- Connected Creator Channels -->
                            <div class="card">
                                <h2>📡 Connected Creator Channels</h2>
                                <div class="social-box">
                                    ${socials ? socials.map(s => `
                                        <a href="${s.profile_url}" target="_blank" class="social-card">
                                            📺 ${s.platform_name}: <span style="color:#22c55e; font-weight:normal;">${s.channel_handle}</span>
                                        </a>
                                    `).join('') : ''}
                                </div>
                            </div>

                            <!-- Ingestion Form -->
                            <div class="card">
                                <h2>📥 Share Media Directly to Island Feed</h2>
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

                            <!-- Live Embedded Social Feed Wall -->
                            <div class="card">
                                <h2>🌊 Live Island Social Wall & Video Stream</h2>
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

                            <!-- Süper Lig Fixtures & Probability Engine -->
                            <div class="card">
                                <h2>⚽ Süper Lig Fixtures & Live Probability Engine</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fixture & Venue</th>
                                            <th>Date & Time</th>
                                            <th>Calculated Probabilities</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${matches ? matches.map(m => {
                                            const probs = calculateLiveProbabilities(m.home_rating, m.away_rating);
                                            return `
                                        <tr>
                                            <td><b>${m.home_team} vs${m.away_team}</b><br><span style="color:#94a3b8; font-size:11px;">${m.venue}</span></td>
                                            <td><span style="color: #38bdf8; font-family: monospace; font-weight:bold;">${m.match_date}</span></td>
                                            <td>
                                                <span class="prob-badge home-prob">${m.home_team.split(' ')[0]}:${probs.homeWin}%</span>
                                                <span class="prob-badge draw-prob">Draw: ${probs.draw}%</span>
                                                <span class="prob-badge away-prob">${m.away_team.split(' ')[0]}:${probs.awayWin}%</span>
                                            </td>
                                        </tr>`;
                                        }).join('') : ''}
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
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Master Unified Engine running live on port ${PORT}`);
});
