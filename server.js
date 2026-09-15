const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./shoulder_to_shoulder.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS monkey_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            channel TEXT,
            ad_count INTEGER
        )`);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Channel configurations
const ARQBAK_CHANNELS = {
    youtube: "https://www.youtube.com/@cenkmahmutgokduman2307",
    tiktok: "https://www.tiktok.com/@mahmut_gokduman7",
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com/@mahmut_gokduman",
    reddit: "https://www.reddit.com"
};

// API Endpoint to log monkey activity
app.post('/api/log', (req, res) => {
    const { channel, ad_count } = req.body;
    if (!channel || ad_count === undefined) {
        return res.status(400).json({ error: 'Missing channel or ad_count' });
    }
    
    const query = `INSERT INTO monkey_logs (channel, ad_count, timestamp) VALUES (?, ?, datetime('now'))`;
    db.run(query, [channel, ad_count], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// API Endpoint to fetch live stats for the top badges
app.get('/api/stats', (req, res) => {
    db.all(`SELECT channel, SUM(ad_count) as total_ads 
            FROM monkey_logs 
            GROUP BY channel`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        let stats = { youtube: 0, tiktok: 0, facebook: 0, instagram: 0, reddit: 0 };
        if (rows) {
            rows.forEach(r => {
                let ch = r.channel.toLowerCase();
                if (stats[ch] !== undefined) {
                    stats[ch] = r.total_ads || 0;
                }
            });
        }
        res.json(stats);
    });
});

// Main Storefront Page with exact top ticker code block included
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Shoulder to Shoulder - Minimalist Engagement Platform</title>
            <meta http-equiv="refresh" content="60">
            <style>
                body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 40px; margin: 0; line-height: 1.6; }
                .container { max-width: 700px; margin: 0 auto; background: #1e1e1e; padding: 30px; border-radius: 8px; border: 1px solid #333; position: relative; }
                h1 { color: #4CAF50; margin-top: 0; }
                h3 { color: #29B6F6; border-bottom: 1px solid #333; padding-bottom: 5px; margin-top: 25px; }
                .btn { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; font-weight: bold; text-decoration: none; border-radius: 4px; margin-top: 25px; text-align: center; width: 100%; box-sizing: border-box; }
                .btn:hover { background: #45a049; }
                ul { padding-left: 20px; }
                li { margin-bottom: 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Top Ticker Code Block -->
                <div id="live-top-tickers" style="position: absolute; top: 15px; right: 20px; display: flex; gap: 10px; font-family: monospace; font-size: 0.85em; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 6px; border: 1px solid #333; z-index: 999;">
                    <div>YT: <span id="ticker-yt" style="color: #00E676;">0</span></div>
                    <div>IG: <span id="ticker-ig" style="color: #00E676;">0</span></div>
                    <div>TT: <span id="ticker-tt" style="color: #00E676;">0</span></div>
                    <div>RD: <span id="ticker-rd" style="color: #00E676;">0</span></div>
                </div>

                <h1>Shoulder to Shoulder</h1>
                <p><strong>Minimalist Engagement & Publishing Platform</strong></p>
                <p>We are happy to accommodate you, and we are proud to have you resident here with us. Your effort, your reward.</p>
                
                <h3>Live Hourly Wages</h3>
                <ul>
                    <li><strong>1 Hour of Work:</strong> £1</li>
                    <li><strong>24 Hours of Work:</strong> £24</li>
                </ul>

                <h3>Milestone Rewards</h3>
                <ul>
                    <li><strong>Bronze Tier (6 Hours Work):</strong> + £2 Bonus</li>
                    <li><strong>Silver Tier (12 Hours Work):</strong> + £5 Bonus</li>
                    <li><strong>Gold Tier (24 Hours Work):</strong> + £12 Bonus</li>
                </ul>

                <h3>Platform Rules & Terms</h3>
                <ul>
                    <li><strong>Real Work, Real Earnings:</strong> Your income depends entirely on your effort. Work hard, browse, and click through automated feeds to earn.</li>
                    <li><strong>Whole-Pound Cash-Out & Reset:</strong> Payouts are in whole-pound increments (fractional remainders stay with the system). Pressing cash-out triggers an immediate account exit and reset, keeping our slots fresh.</li>
                    <li><strong>£5 Threshold:</strong> Cash out anytime you hit £5 via Amazon gift cards, Google gift cards, or Google Pay.</li>
                    <li><strong>Zero Ghosts Policy:</strong> Inactive accounts for 31 days are automatically purged to keep slots open for active participants.</li>
                    <li><strong>Batch Capacity:</strong> Strict 1,000-slot batches ensure a fair and high-speed environment for everyone.</li>
                </ul>

                <a href="${ARQBAK_CHANNELS.youtube}" target="_blank" class="btn">Enter Platform & Join Channels</a>
            </div>

            <script>
                // Optional: Auto-fetch live counts into those small top icons every 30 seconds
                async function updateTopTickers() {
                    try {
                        let res = await fetch('/api/stats');
                        let data = await res.json();
                        if(data.youtube) document.getElementById('ticker-yt').innerText = data.youtube;
                        if(data.instagram) document.getElementById('ticker-ig').innerText = data.instagram;
                        if(data.tiktok) document.getElementById('ticker-tt').innerText = data.tiktok;
                        if(data.reddit) document.getElementById('ticker-rd').innerText = data.reddit;
                    } catch(e) {}
                }
                updateTopTickers();
                setInterval(updateTopTickers, 30000);
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Live ticker server running on port ${PORT}`);
});
