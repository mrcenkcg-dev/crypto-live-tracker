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

// Channel configurations including YouTube, TikTok, Facebook, Instagram, Reddit
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

// Root URL (/) now opens your Live Ad Counter Board directly with ONE CLICK!
app.get('/', (req, res) => {
    db.all(`SELECT channel, SUM(ad_count) as total_ads, 
            SUM(CASE WHEN timestamp >= datetime('now', '-1 hour') THEN ad_count ELSE 0 END) as ads_last_hour,
            MAX(timestamp) as last_run 
            FROM monkey_logs 
            GROUP BY channel`, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Database error loading tracker data.");
        }

        let totalAllChannels = 0;
        let totalLastHourAllChannels = 0;
        if (rows) {
            rows.forEach(r => {
                totalAllChannels += (r.total_ads || 0);
                totalLastHourAllChannels += (r.ads_last_hour || 0);
            });
        }

        let html = `
            <html>
            <head>
                <title>Three Monkeys Live Tracker - Cenk's Dashboard</title>
                <meta http-equiv="refresh" content="30">
                <style>
                    body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 30px; }
                    h1 { color: #4CAF50; }
                    .status { color: #00E676; font-weight: bold; }
                    .metrics-container { display: flex; gap: 20px; margin: 20px 0; }
                    .metric-box { background: #1e1e1e; border: 1px solid #333; padding: 20px; border-radius: 8px; flex: 1; text-align: center; }
                    .metric-number { font-size: 2.5em; color: #00E676; font-weight: bold; font-family: monospace; margin-top: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #333; padding: 12px; text-align: left; }
                    th { background: #1e1e1e; }
                    ul { line-height: 1.6; }
                    a { color: #29B6F6; text-decoration: none; }
                    .ticker { font-size: 1.2em; color: #00E676; font-family: monospace; }
                </style>
            </head>
            <body>
                <h1>Live Advert & Traffic Dashboard</h1>
                <p>Status: <span class="status">ONLINE & TICKING LIVE</span></p>

                <div class="metrics-container">
                    <div class="metric-box">
                        <div>Adverts Received (Last Hour)</div>
                        <div class="metric-number">${totalLastHourAllChannels}</div>
                    </div>
                    <div class="metric-box">
                        <div>Total Adverts Recorded</div>
                        <div class="metric-number">${totalAllChannels}</div>
                    </div>
                    <div class="metric-box">
                        <div>Estimated 24-Hour Total</div>
                        <div class="metric-number">~${totalLastHourAllChannels * 24}</div>
                    </div>
                </div>

                <h3>Platform Channels:</h3>
                <ul>
                    <li>YouTube: <a href="${ARQBAK_CHANNELS.youtube}" target="_blank">${ARQBAK_CHANNELS.youtube}</a></li>
                    <li>TikTok: <a href="${ARQBAK_CHANNELS.tiktok}" target="_blank">${ARQBAK_CHANNELS.tiktok}</a></li>
                    <li>Facebook: <a href="${ARQBAK_CHANNELS.facebook}" target="_blank">${ARQBAK_CHANNELS.facebook}</a></li>
                    <li>Instagram: <a href="${ARQBAK_CHANNELS.instagram}" target="_blank">${ARQBAK_CHANNELS.instagram}</a></li>
                    <li>Reddit: <a href="${ARQBAK_CHANNELS.reddit}" target="_blank">${ARQBAK_CHANNELS.reddit}</a></li>
                </ul>

                <h2>Breakdown by Platform</h2>
                <table>
                    <tr>
                        <th>Platform / Channel</th>
                        <th>Adverts in Last Hour</th>
                        <th>Total Adverts Logged</th>
                        <th>Last Ticker Timestamp</th>
                    </tr>
        `;

        if (rows && rows.length > 0) {
            rows.forEach(row => {
                html += `<tr>
                    <td>${row.channel}</td>
                    <td class="ticker">${row.ads_last_hour || 0} ads</td>
                    <td class="ticker">${row.total_ads || 0} ads</td>
                    <td>${row.last_run || 'N/A'}</td>
                </tr>`;
            });
        } else {
            html += `<tr><td colspan="4">Waiting for the first 20-minute ticker report to log adverts...</td></tr>`;
        }

        html += `</table></body></html>`;
        res.send(html);
    });
});

app.listen(PORT, () => {
    console.log(`Live ticker server running on port ${PORT}`);
});
