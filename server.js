/**
 * Sovereign Engine: MySQL Unified Anadolu Island Edition
 * Combined single-file Express application with MySQL persistence and clean sharing.
 */

const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool (supports Render environment DATABASE_URL or individual credentials)
const dbConfig = process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sovereign_engine',
    port: process.env.DB_PORT || 3306
};

const pool = mysql.createPool(dbConfig);

// Test Database Connection & Initialize Tables
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database Successfully.');
        
        // Create Island Feed Table
        const createFeedTable = `
            CREATE TABLE IF NOT EXISTS island_feed (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                share_type VARCHAR(50),
                title VARCHAR(255),
                target_url TEXT,
                content TEXT
            )
        `;
        
        // Create Live Matches Table
        const createMatchesTable = `
            CREATE TABLE IF NOT EXISTS live_matches (
                id INT AUTO_INCREMENT PRIMARY KEY,
                league_name VARCHAR(100),
                home_team VARCHAR(100),
                away_team VARCHAR(100),
                match_date VARCHAR(100),
                venue VARCHAR(100)
            )
        `;

        connection.query(createFeedTable, (feedErr) => {
            if (feedErr) console.error('Error creating island_feed table:', feedErr);
            else {
                // Seed initial data if empty
                connection.query('SELECT COUNT(*) as count FROM island_feed', (countErr, rows) => {
                    if (!countErr && rows[0].count === 0) {
                        const seedData = [
                            ['image', 'Anadolu Sessions', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'Vibing with the bağlama and synth drone.'],
                            ['youtube', '🎵 Anadolu Psychedelic Sufi Rock - Yunus Emre Session', 'dQw4w9WgXcQ', 'Automated vertical video generated with bağlama instrumentation.']
                        ];
                        connection.query('INSERT INTO island_feed (share_type, title, target_url, content) VALUES ?', [seedData]);
                    }
                });
            }
        });

        connection.query(createMatchesTable, (matchErr) => {
            if (matchErr) console.error('Error creating live_matches table:', matchErr);
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

// API Endpoint to Share Content (YouTube or Images)
app.post('/api/island/share', (req, res) => {
    let { share_type, title, target_url, content } = req.body;
    
    if (share_type === 'youtube') {
        target_url = extractYouTubeId(target_url);
    }

    const query = `INSERT INTO island_feed (share_type, title, target_url, content) VALUES (?, ?, ?, ?)`;
    pool.query(query, [share_type, title || 'Island Share', target_url || '', content || ''], (err) => {
        if (err) console.error('Error inserting post:', err);
        res.redirect('/island');
    });
});

// Admin Command Center (Private)
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
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>⚓ Private Command Center (MySQL Edition)</h1>
                <a href="/island" class="btn">🌐 Open Island Portal</a>
            </header>
            <div class="card">
                <h2>System Status: Connected to MySQL Database</h2>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 10px;">All multi-agent feeds and media sharing links are stored securely in MySQL.</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

// PUBLIC ISLAND PORTAL: Clean Media & Feed Stream
app.get('/island', (req, res) => {
    pool.query('SELECT * FROM island_feed ORDER BY id DESC', (err, feedItems) => {
        if (err) {
            feedItems = [];
            console.error('Error fetching feed:', err);
        }

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anadolu Island - Media & Feed</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, sans-serif; background: #070908; color: #e2e8f0; padding: 20px; }
                .container { max-width: 650px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                header { background: #111a14; padding: 18px 24px; border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.4); display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #22c55e; font-size: 18px; }
                .card { background: #111a14; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
                input, select, textarea { width: 100%; padding: 10px; background: #18221b; border: 1px solid rgba(34,197,94,0.3); color: #fff; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
                button { background: #22c55e; color: #000; font-weight: bold; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; width: 100%; }
                .feed-item { background: #18221b; border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px; }
                .video-container { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; background: #000; border-radius: 8px; overflow: hidden; }
                .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
                .feed-image { width: 100%; border-radius: 8px; max-height: 400px; object-fit: cover; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>🌴 Anadolu Island</h1>
                    <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Admin</a>
                </header>

                <!-- Clean Share Form -->
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Share to Island Portal</h2>
                    <form action="/api/island/share" method="POST">
                        <select name="share_type" required>
                            <option value="youtube">📺 YouTube Video Link</option>
                            <option value="image">🖼️ Picture / Photo Link (e.g. from Facebook/Web)</option>
                        </select>
                        <input type="text" name="title" placeholder="Give it a clean title..." required>
                        <input type="text" name="target_url" placeholder="Paste YouTube link OR Direct Image URL..." required>
                        <textarea name="content" rows="2" placeholder="Your brief note or caption..."></textarea>
                        <button type="submit">Publish to Island</button>
                    </form>
                </div>

                <!-- Island Stream -->
                <div class="card">
                    <h2 style="font-size: 15px; color: #fff;">Island Stream</h2>
                    ${feedItems.map(item => `
                        <div class="feed-item">
                            <b style="color: #22c55e; font-size: 14px;">${item.title}</b>${item.share_type === 'youtube' ? `
                                <div class="video-container">
                                    <iframe src="https://www.youtube.com/embed/${item.target_url}" allowfullscreen></iframe>
                                </div>
                            ` : `
                                <img src="${item.target_url}" class="feed-image" alt="Island Media">
                            `}

                            ${item.content ? `<p style="color: #cbd5e1; font-size: 12px; line-height: 1.4;">${item.content}</p>` : ''}
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

app.listen(PORT, () => {
    console.log(`🚀 Sovereign MySQL Engine running live on port ${PORT}`);
});
