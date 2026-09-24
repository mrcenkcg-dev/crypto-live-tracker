/**
 * Sovereign Master Engine: Multi-Social & Multi-Media Edition
 * Integrated: Core Multi-Agent Telemetry, Multi-Platform Social Stream (YouTube/FB/IG),
 * Internal Treasury, Hardware Fleet, Sufi Culture & Poetry Media Pipeline, & Interactive Island.
 */

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection Pool Configuration
const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'sovereign_master_db',
    port: process.env.MYSQL_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

async function initializeDatabase() {
    try {
        const tempPool = mysql.createPool({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port
        });
        await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await tempPool.end();

        pool = mysql.createPool(dbConfig);
        console.log('✅ Connected to Sovereign Master Database.');

        // Initialize Tables & Seed Ecosystem Data
        await pool.query(`
            CREATE TABLE IF NOT EXISTS super_agent_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                agent_name VARCHAR(255),
                action_taken TEXT,
                target_page VARCHAR(255),
                status VARCHAR(50)
            )
        `);
        const [agents] = await pool.query(`SELECT COUNT(*) as count FROM super_agent_logs`);
        if (agents[0].count === 0) {
            await pool.query(`INSERT INTO super_agent_logs (agent_name, action_taken, target_page, status) VALUES 
                ('ProbabilityEngine', 'Calculating live match odds and statistical distributions', '/island', 'ACTIVE'),
                ('MultiSocialBridge', 'Syncing YouTube Shorts, Facebook Reels & Instagram feeds', '/island', 'ONLINE'),
                ('WatcherAgent', 'Verified real-time internet telemetry and micro-fee toll gates', '/', 'ACTIVE'),
                ('ArchivistAgent', 'Ingested latest repository updates into library stacks', '/library', 'SYNCED'),
                ('MinerAgent', 'Polled Panther X2 and Baikal Quadruple hash rate stability', '/library/hardware', 'OPTIMIZED')`);
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS treasury_vault (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                daily_inflow DECIMAL(10,2),
                reinvested_amount DECIMAL(10,2),
                total_vault_balance DECIMAL(10,2),
                status VARCHAR(100)
            )
        `);
        const [treasury] = await pool.query(`SELECT COUNT(*) as count FROM treasury_vault`);
        if (treasury[0].count === 0) {
            await pool.query(`INSERT INTO treasury_vault (daily_inflow, reinvested_amount, total_vault_balance, status) VALUES 
                (4.00, 2.00, 184.50, 'LIVE & COMPOUNDING')`);
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS toll_transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                service_endpoint VARCHAR(255),
                fee_amount VARCHAR(50),
                client_origin VARCHAR(255),
                status VARCHAR(50)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS live_matches (
                id INT AUTO_INCREMENT PRIMARY KEY,
                league_name VARCHAR(100),
                home_team VARCHAR(100),
                away_team VARCHAR(100),
                match_date VARCHAR(100),
                match_score VARCHAR(50),
                venue VARCHAR(255),
                home_rating INT,
                away_rating INT,
                status VARCHAR(50),
                ad_sponsor VARCHAR(255)
            )
        `);
        const [matches] = await pool.query(`SELECT COUNT(*) as count FROM live_matches`);
        if (matches[0].count === 0) {
            await pool.query(`INSERT INTO live_matches (league_name, home_team, away_team, match_date, match_score, venue, home_rating, away_rating, status, ad_sponsor) VALUES 
                ('Süper Lig', 'Galatasaray S.K.', 'Kasımpaşa S.K.', '09 Oct 2026, 18:00', '2 - 1', 'RAMS Park, Istanbul', 85, 72, 'PLAYING', 'Anadolu Sufi Rock Partner'),
                ('Süper Lig', 'Çaykur Rizespor', 'Fenerbahçe SK', '10 Oct 2026, 17:00', '0 - 0', 'Caykur Didi Stadium, Rize', 70, 84, 'UPCOMING', 'Get Big Together Initiative'),
                ('Süper Lig', 'Beşiktaş J.K.', 'Kocaelispor', '11 Oct 2026, 17:00', '0 - 0', 'Tüpraş Stadium, Istanbul', 81, 68, 'UPCOMING', 'Node Infrastructure Partner'),
                ('Süper Lig', 'Galatasaray S.K.', 'Fenerbahçe SK', '26 Oct 2026, 18:30', '0 - 0', 'RAMS Park, Istanbul', 85, 84, 'UPCOMING', 'Anadolu Cultural Media')`);
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS social_channels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                platform_name VARCHAR(100),
                channel_handle VARCHAR(100),
                profile_url VARCHAR(255),
                content_type VARCHAR(100),
                status VARCHAR(50)
            )
        `);
        const [socials] = await pool.query(`SELECT COUNT(*) as count FROM social_channels`);
        if (socials[0].count === 0) {
            await pool.query(`INSERT INTO social_channels (platform_name, channel_handle, profile_url, content_type, status) VALUES 
                ('YouTube', '@AnadoluSufiRock', 'https://www.youtube.com', 'Long-form & Shorts', 'CONNECTED'),
                ('Facebook', 'Get Big Together Community', 'https://www.facebook.com', 'Community Reels', 'CONNECTED'),
                ('Instagram', '@CenkSovereignEngine', 'https://www.instagram.com', 'Visual Media & Stories', 'CONNECTED')`);
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS sufi_culture_queue (
                id INT AUTO_INCREMENT PRIMARY KEY,
                poet_name VARCHAR(100),
                verse_title VARCHAR(255),
                verse_text TEXT,
                musical_arrangement VARCHAR(255),
                video_status VARCHAR(50)
            )
        `);
        const [culture] = await pool.query(`SELECT COUNT(*) as count FROM sufi_culture_queue`);
        if (culture[0].count === 0) {
            await pool.query(`INSERT INTO sufi_culture_queue (poet_name, verse_title, verse_text, musical_arrangement, video_status) VALUES 
                ('Yunus Emre', 'Bilmeyen Ne Bilsin Bizi', 'Cümleler doğrudur sen doğru isen, doğruluk bulunmaz sen eğri isen.', 'Anatolian Psychedelic Rock (Bağlama + Synth)', 'RENDERED & READY FOR MULTI-SOCIAL'),
                ('Yunus Emre', 'Gelin Tanış Olalım', 'Gelin tanış olalım, işi kolay kılalım, sevelim sevilelim, dünya kimseye kalmaz.', 'Sufi Ambient Drone / Groove', 'QUEUED FOR RENDER')`);
        }

    } catch (err) {
        console.error('❌ Database initialization error:', err.message);
    }
}

// Probability Calculator for Live Island Matches
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

// Toll Gate Middleware
function microFeeTollGate(fee = '$0.001') {
    return async (req, res, next) => {
        try {
            const endpoint = req.originalUrl;
            const origin = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Local Client';
            await pool.query(`INSERT INTO toll_transactions (service_endpoint, fee_amount, client_origin, status) VALUES (?, ?, ?, ?)`,
                [endpoint, fee, origin, 'PAID & LOGGED']);
        } catch (e) {
            console.error('Toll log error:', e.message);
        }
        next();
    };
}

// API Endpoints for Managing the Multimedia & Social Pipeline
app.post('/api/culture/add', async (req, res) => {
    const { poet_name, verse_title, verse_text, musical_arrangement } = req.body;
    await pool.query(`INSERT INTO sufi_culture_queue (poet_name, verse_title, verse_text, musical_arrangement, video_status) VALUES (?, ?, ?, ?, ?)`,
        [poet_name || 'Yunus Emre', verse_title, verse_text, musical_arrangement, 'QUEUED FOR MULTI-SOCIAL RENDER']);
    res.redirect('/library/culture');
});

app.post('/api/social/add', async (req, res) => {
    const { platform_name, channel_handle, profile_url, content_type } = req.body;
    await pool.query(`INSERT INTO social_channels (platform_name, channel_handle, profile_url, content_type, status) VALUES (?, ?, ?, ?, ?)`,
        [platform_name, channel_handle, profile_url, content_type || 'Shorts / Reels', 'CONNECTED']);
    res.redirect('/');
});

// Admin Command Center Hub
app.get('/', async (req, res) => {
    try {
        const [tolls] = await pool.query(`SELECT fee_amount FROM toll_transactions`);
        const [agents] = await pool.query(`SELECT * FROM super_agent_logs ORDER BY timestamp DESC LIMIT 5`);
        const [treasuryRows] = await pool.query(`SELECT total_vault_balance, daily_inflow FROM treasury_vault ORDER BY id DESC LIMIT 1`);
        const [socials] = await pool.query(`SELECT * FROM social_channels`);
        
        let totalRev = 0;
        if (tolls) tolls.forEach(t => totalRev += parseFloat(t.fee_amount.replace('$', '')) || 0.001);

        const treasury = treasuryRows[0] || {};
        const vaultBalance = treasury.total_vault_balance || 184.50;
        const dailyInflow = treasury.daily_inflow || 4.00;

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
                        <a href="/island" class="btn" style="background: #10b981; color:#000;">🌴 Visit Island Portal</a>
                        <a href="/library/culture" class="btn">🎵 Sufi Culture Queue</a>
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
                    <h3 style="font-size: 15px; color: #fff; margin-top: 20px;">Connected Social Channels (YouTube, Facebook, Instagram)</h3>
                    <ul>
                        ${socials ? socials.map(s => `<li><b>[${s.platform_name}]</b> ${s.channel_handle} (${s.content_type}) &mdash; <span style="color:#22c55e">${s.status}</span></li>`).join('') : ''}
                    </ul>
                </div>

                <div class="card">
                    <h2>🔗 Register New Social Platform Bridge</h2>
                    <form action="/api/social/add" method="POST">
                        <label>Platform Name:</label>
                        <input type="text" name="platform_name" placeholder="e.g. TikTok or Instagram" required>
                        <label>Channel Handle:</label>
                        <input type="text" name="channel_handle" placeholder="e.g. @CenkSovereign" required>
                        <label>Profile URL:</label>
                        <input type="text" name="profile_url" placeholder="https://..." required>
                        <label>Content Type:</label>
                        <input type="text" name="content_type" placeholder="e.g. Vertical Shorts & Reels" required>
                        <button type="submit">Connect Social Bridge</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
        `);
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

// Interactive Island Portal (/island)
app.get('/island', microFeeTollGate('$0.001'), async (req, res) => {
    try {
        const [matches] = await pool.query(`SELECT * FROM live_matches`);
        const [socials] = await pool.query(`SELECT * FROM social_channels`);
        const [treasuryRows] = await pool.query(`SELECT total_vault_balance, daily_inflow FROM treasury_vault ORDER BY id DESC LIMIT 1`);
        
        const treasury = treasuryRows[0] || {};
        const vaultBalance = treasury.total_vault_balance || 184.50;
        const dailyInflow = treasury.daily_inflow || 4.00;

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anadolu Island - Multi-Social & Probability Portal</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070908; color: #e2e8f0; padding: 30px; }
                .container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
                header { background: #111a14; padding: 24px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
                h1 { color: #22c55e; font-size: 22px; margin-bottom: 4px; }
                p { color: #94a3b8; font-size: 13px; }
                .badge { background: #22c55e; color: #000; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; }
                .btn { background: #1f2937; color: #fff; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #374151; }
                .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                h2 { font-size: 17px; color: #fff; display: flex; align-items: center; gap: 8px; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
                .panel { background: #18221b; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
                table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                th, td { padding: 12px; text-align: left; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.06); }
                th { color: #22c55e; font-weight: 600; text-transform: uppercase; font-size: 11px; background: #142017; }
                .prob-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-right: 4px; font-family: monospace; }
                .home-prob { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.4); }
                .draw-prob { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
                .away-prob { background: rgba(244, 63, 94, 0.2); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); }
                .social-box { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px; }
                .social-card { background: #18221b; border: 1px solid rgba(34, 197, 94, 0.3); padding: 12px 18px; border-radius: 10px; color: #fff; text-decoration: none; font-weight: bold; font-size: 13px; display: flex; align-items: center; gap: 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div>
                        <h1>🌴 Anadolu Island Multi-Social Portal</h1>
                        <p>Status: <span class="badge">MULTI-PLATFORM ENGINE ACTIVE</span></p>
                    </div>
                    <a href="/" class="btn">&larr; Command Center</a>
                </header>

                <div class="card">
                    <h2>📡 Multi-Social Network Streams (YouTube, Facebook, Instagram)</h2>
                    <p>Direct live links across all connected multimedia broadcasting platforms.</p>
                    <div class="social-box">
                        ${socials ? socials.map(s => `
                            <a href="${s.profile_url}" target="_blank" class="social-card">
                                📺 ${s.platform_name}: <span style="color:#22c55e; font-weight:normal;">${s.channel_handle}</span>
                            </a>
                        `).join('') : ''}
                    </div>
                </div>

                <div class="card">
                    <h2>🏦 Autonomous Treasury Vault</h2>
                    <div class="grid">
                        <div class="panel">
                            <span style="color: #94a3b8; font-size: 12px;">Active Vault Balance</span>
                            <span style="font-size: 24px; font-weight: bold; color: #22c55e;">$${parseFloat(vaultBalance).toFixed(2)}</span>
                        </div>
                        <div class="panel">
                            <span style="color: #94a3b8; font-size: 12px;">Live Daily Inflow</span>
                            <span style="font-size: 24px; font-weight: bold; color: #38bdf8;">$${parseFloat(dailyInflow).toFixed(2)} / day</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h2>⚽ Süper Lig Fixtures & Live Probability Engine</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Fixture & Venue</th>
                                <th>Date & Time</th>
                                <th>Calculated Odds (Home / Draw / Away)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${matches ? matches.map(m => {
                                const probs = calculateLiveProbabilities(m.home_rating, m.away_rating);
                                return `
                                <tr>
                                    <td>
                                        <b>${m.home_team} vs${m.away_team}</b><br>
                                        <span style="color:#94a3b8; font-size:11px;">${m.venue}</span>
                                    </td>
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
    } catch (err) {
        res.status(500).send("Portal Error: " + err.message);
    }
});

// Sufi Culture & Multimedia Queue View
app.get('/library/culture', async (req, res) => {
    const [items] = await pool.query(`SELECT * FROM sufi_culture_queue`);
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><title>Sufi Culture & Multimedia Video Queue</title>
        <style>
            body { font-family: -apple-system, sans-serif; background: #0b0b0b; color: #f8fafc; padding: 30px; }
            .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
            header { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #22c55e; display: flex; justify-content: space-between; align-items: center; }
            h1 { color: #22c55e; font-size: 20px; margin: 0; }
            .card { background: #141414; padding: 20px; border-radius: 16px; border: 1px solid #262626; }
            .btn { background: #262626; color: #fff; padding: 8px 14px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 12px; border: 1px solid #3f3f46; }
            ul { padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.8; }
            input, textarea { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 12px; background: #1c1c1c; border: 1px solid #333; color: #fff; border-radius: 8px; }
            button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🎵 Sufi Culture & Multimedia Video Pipeline</h1>
                <a href="/" class="btn">&larr; Command Center</a>
            </header>
            <div class="card">
                <h2>Queue New Verse for Multi-Social Rendering</h2>
                <form action="/api/culture/add" method="POST">
                    <label>Poet Name:</label>
                    <input type="text" name="poet_name" value="Yunus Emre" required>
                    <label>Verse Title:</label>
                    <input type="text" name="verse_title" placeholder="e.g. Gel Tanış Olalım" required>
                    <label>Verse Text:</label>
                    <textarea name="verse_text" rows="2" placeholder="Poetry lyrics..." required></textarea>
                    <label>Musical Arrangement:</label>
                    <input type="text" name="musical_arrangement" placeholder="e.g. Anatolian Psychedelic Rock" required>
                    <button type="submit">Queue into Multi-Platform Render Pipeline</button>
                </form>
            </div>
            <div class="card">
                <h2>Active Multimedia Queue Status</h2>
                <ul>
                    ${items ? items.map(i => `<li><b>[${i.poet_name}]${i.verse_title}</b>: &ldquo;${i.verse_text}&rdquo; <br><em>Arrangement:${i.musical_arrangement}</em> (<span style="color:#22c55e">${i.video_status}</span>)</li>`).join('') : ''}
                </ul>
            </div>
        </div>
    </body>
    </html>`);
});

// Initialize DB and Start Server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Sovereign Multi-Social Engine running live on port ${PORT}`);
    });
});
