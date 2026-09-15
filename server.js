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
        // Initialize table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS monkey_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            channel TEXT,
            ad_count INTEGER
        )`);
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Channel configurations
const ARQBAK_CHANNELS = {
    youtube: "https://www.youtube.com/@cenkmahmutgokduman2307",
    tiktok: "https://www.tiktok.com/@mahmut_gokduman7",
    instagram: "https://www.instagram.com/@mahmut_gokduman",
    threads: "https://www.threads.net/@mahmut_gokduman"
};

// API Endpoint to log monkey activity (used by backend workers)
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

// Live Tracker Dashboard Endpoint
app.get('/', (req, res) => {
    db.all(`SELECT channel, SUM(ad_count) as total_ads, MAX(timestamp) as last_run 
            FROM monkey_logs 
            GROUP BY channel`, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Database error loading tracker data.");
        }

        let html = `
            <html>
            <head>
                <title>Three Monkeys Live Tracker</title>
                <meta http-equiv="refresh" content="60">
                <style>
                    body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 20px; }
                    h1 { color: #4CAF50; }
                    .status { color: #00E676; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #333; padding: 12px; text-align: left; }
                    th { background: #1e1e1e; }
                    ul { line-height: 1.6; }
                    a { color: #29B6F6; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>Three Monkeys Live 20-Minute Tracker</h1>
                <p>Status: <span class="status">ONLINE & RUNNING (Real Life)</span></p>
                
                <h3>Linked Channels:</h3>
                <ul>
                    <li>YouTube: <a href="${ARQBAK_CHANNELS.youtube}" target="_blank">${ARQBAK_CHANNELS.youtube}</a></li>
                    <li>TikTok: <a href="${ARQBAK_CHANNELS.tiktok}" target="_blank">${ARQBAK_CHANNELS.tiktok}</a></li>
                    <li>Instagram: <a href="${ARQBAK_CHANNELS.instagram}" target="_blank">${ARQBAK_CHANNELS.instagram}</a></li>
                    <li>Threads: <a href="${ARQBAK_CHANNELS.threads}" target="_blank">${ARQBAK_CHANNELS.threads}</a></li>
                </ul>

                <h2>Live 20-Minute Ad & Activity Counts</h2>
                <table>
                    <tr>
                        <th>Channel</th>
                        <th>Ads Brought (Last Window)</th>
                        <th>Estimated 24-Hour Total</th>
                        <th>Last Activity Time</th>
                    </tr>
        `;

        if (rows && rows.length > 0) {
            rows.forEach(row => {
                let estimatedDaily = (row.total_ads || 0) * 72; // 72 windows of 20 minutes in 24 hours
                html += `<tr>
                    <td>${row.channel}</td>
                    <td>${row.total_ads || 0} ads</td>
                    <td>~${estimatedDaily} ads</td>
                    <td>${row.last_run || 'N/A'}</td>
                </tr>`;
            });
        } else {
            html += `<tr><td colspan="4">Waiting for the first 20-minute monkey report to drop...</td></tr>`;
        }

        html += `</table></body></html>`;
        res.send(html);
    });
});

app.listen(PORT, () => {
    console.log(`Live tracker server running on port ${PORT}`);
});
