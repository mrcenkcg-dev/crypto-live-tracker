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

// Authorized Admin Email
const ADMIN_EMAIL = "mrcenk.cg@googlemail.com";

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

// Login Page for Admin Access
app.get('/login', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Cenk Login - Live Tracker</title>
            <style>
                body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 40px; display: flex; justify-content: center; align-items: center; height: 80vh; }
                .login-box { background: #1e1e1e; padding: 30px; border-radius: 8px; border: 1px solid #333; width: 350px; }
                input { width: 100%; padding: 10px; margin: 10px 0 20px 0; background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 4px; }
                button { width: 100%; padding: 10px; background: #4CAF50; border: none; color: white; font-weight: bold; border-radius: 4px; cursor: pointer; }
                button:hover { background: #45a049; }
                h2 { color: #4CAF50; margin-top: 0; }
            </style>
        </head>
        <body>
            <div class="login-box">
                <h2>Cenk's Admin Login</h2>
                <p>Enter your email to access your live tracker:</p>
                <form action="/auth" method="POST">
                    <label>Email Address:</label>
                    <input type="email" name="email" required placeholder="mrcenk.cg@googlemail.com">
                    <button type="submit">Access Live Dashboard</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// Handle Login Authentication
app.post('/auth', (req, res) => {
    const userEmail = req.body.email ? req.body.email.trim().toLowerCase() : '';
    if (userEmail === ADMIN_EMAIL.toLowerCase()) {
        res.redirect('/tracker?email=' + encodeURIComponent(userEmail));
    } else {
        res.send(`<html><body style="background:#121212;color:#ff5255;padding:40px;font-family:Arial;"><h2>Access Denied</h2><p>The email address you entered is not recognized as the admin account.</p><a href="/login" style="color:#29B6F6;">Try Again</a></body></html>`);
    }
});

// Private Live 20-Minute Tracker Dashboard Endpoint
app.get('/tracker', (req, res) => {
    const userEmail = req.query.email;
    if (userEmail !== ADMIN_EMAIL) {
        return res.redirect('/login');
    }

    db.all(`SELECT channel, SUM(ad_count) as total_ads, MAX(timestamp) as last_run 
            FROM monkey_logs 
            GROUP BY channel`, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Database error loading tracker data.");
        }

        let html = `
            <html>
            <head>
                <title>Three Monkeys Live Tracker - Cenk's Dashboard</title>
                <meta http-equiv="refresh" content="30">
                <style>
                    body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 20px; }
                    h1 { color: #4CAF50; }
                    .status { color: #00E676; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #333; padding: 12px; text-align: left; }
                    th { background: #1e1e1e; }
                    ul { line-height: 1.6; }
                    a { color: #29B6F6; text-decoration: none; }
                    .logout { float: right; background: #d32f2f; color: white; padding: 8px 15px; border-radius: 4px; }
                    .ticker { font-size: 1.2em; color: #00E676; font-family: monospace; }
                </style>
            </head>
            <body>
                <a href="/login" class="logout">Logout</a>
                <h1>Three Monkeys Live 20-Minute Ticker Dashboard</h1>
                <p>Logged in as: <strong>${ADMIN_EMAIL}</strong></p>
                <p>Status: <span class="status">ONLINE & TICKING (Real Life)</span></p>
                
                <h3>Platform Channels:</h3>
                <ul>
                    <li>YouTube: <a href="${ARQBAK_CHANNELS.youtube}" target="_blank">${ARQBAK_CHANNELS.youtube}</a></li>
                    <li>TikTok: <a href="${ARQBAK_CHANNELS.tiktok}" target="_blank">${ARQBAK_CHANNELS.tiktok}</a></li>
                    <li>Facebook: <a href="${ARQBAK_CHANNELS.facebook}" target="_blank">${ARQBAK_CHANNELS.facebook}</a></li>
                    <li>Instagram: <a href="${ARQBAK_CHANNELS.instagram}" target="_blank">${ARQBAK_CHANNELS.instagram}</a></li>
                    <li>Reddit: <a href="${ARQBAK_CHANNELS.reddit}" target="_blank">${ARQBAK_CHANNELS.reddit}</a></li>
                </ul>

                <h2>Live 20-Minute Ad & Activity Ticker</h2>
                <table>
                    <tr>
                        <th>Platform / Channel</th>
                        <th>Ads Brought (Last 20 Mins Window)</th>
                        <th>Estimated 24-Hour Total</th>
                        <th>Last Ticker Timestamp</th>
                    </tr>
        `;

        if (rows && rows.length > 0) {
            rows.forEach(row => {
                let estimatedDaily = (row.total_ads || 0) * 72; // 72 windows of 20 minutes in 24 hours
                html += `<tr>
                    <td>${row.channel}</td>
                    <td class="ticker">${row.total_ads || 0} ads tick</td>
                    <td>~${estimatedDaily} ads</td>
                    <td>${row.last_run || 'N/A'}</td>
                </tr>`;
            });
        } else {
            html += `<tr><td colspan="4">Waiting for the first 20-minute monkey ticker report to drop (1, 2, 3... 100+)...</td></tr>`;
        }

        html += `</table></body></html>`;
        res.send(html);
    });
});

app.listen(PORT, () => {
    console.log(`Live ticker server running on port ${PORT}`);
});
