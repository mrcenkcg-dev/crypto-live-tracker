/**
 * ==============================================================================
 * SOVEREIGN MUSIC HUB: LIGHTWEIGHT WEB SPOTIFY MVP
 * ==============================================================================
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==============================================================================
// DATABASE SETUP (Users, Tracks, Mix Categories)
// ==============================================================================
const dbFile = path.join(__dirname, 'sovereign_music.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('❌ Database error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign Music Database.');
        initializeMusicDatabase();
    }
});

function initializeMusicDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            email TEXT UNIQUE
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS music_tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            track_title TEXT,
            artist TEXT,
            category TEXT,
            duration TEXT,
            audio_url TEXT
        )`, () => {
            db.get(`SELECT COUNT(*) as count FROM music_tracks`, (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO music_tracks (track_title, artist, category, duration, audio_url) VALUES 
                        ('Anatolian Psychedelic Jam', 'Barış Manço & Friends', 'Anatolian Psychedelic & Folk', '3:45', 'https://commondatastorage.googleapis.com/codesign-bucket-test/sample-music-1.mp3'),
                        ('Yunus Emre Sufi Meditation', 'Traditional Baglama', 'Anatolian Psychedelic & Folk', '4:12', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'),
                        ('Billie Jean Classic Groove', 'Michael Jackson', 'Pop Hits & Timeless Anthems', '4:54', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
                        ('Hey Jude Anthem', 'The Beatles', 'Classic & 1950s Gold', '4:31', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
                        ('Old School 90s Beat', 'Classic Hip Hop Crew', 'Classic Hip Hop', '3:15', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'),
                        ('Future 2026 Synth Vibe', 'Modern Cloud Artist', 'Modern 2026 Mixes', '3:30', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3')`);
                }
            });
        });
    });
}

// ==============================================================================
// API & AUTH ENDPOINTS
// ==============================================================================
app.post('/api/join', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email required.' });
    }
    db.run(`INSERT OR IGNORE INTO users (email) VALUES (?)`, [email], (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.redirect('/');
    });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// ==============================================================================
// MAIN SPOTIFY-STYLE WEB UI
// ==============================================================================
app.get('/', (req, res) => {
    const searchQuery = req.query.q || '';
    const categoryQuery = req.query.category || '';

    let queryStr = `SELECT * FROM music_tracks WHERE 1=1`;
    let params = [];

    if (searchQuery) {
        queryStr += ` AND (track_title LIKE ? OR artist LIKE ?)`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    if (categoryQuery) {
        queryStr += ` AND category = ?`;
        params.push(categoryQuery);
    }

    queryStr += ` ORDER BY timestamp DESC`;

    db.all(queryStr, params, (err, tracks) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Sovereign Music - Free Streaming Hub</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #121212; color: #fff; display: flex; height: 100vh; overflow: hidden; }
                
                /* Sidebar */
                aside { width: 240px; background: #000; padding: 24px; display: flex; flex-direction: column; gap: 24px; border-right: 1px solid #282828; }
                aside h2 { color: #1db954; font-size: 20px; letter-spacing: 0.5px; }
                .nav-links { display: flex; flex-direction: column; gap: 12px; }
                .nav-links a { color: #b3b3b3; text-decoration: none; font-size: 14px; font-weight: bold; transition: color 0.2s; }
                .nav-links a:hover { color: #fff; }

                /* Main Content Area */
                main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; background: #121212; }
                topbar { background: #101010; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #282828; position: sticky; top: 0; z-index: 10; }
                
                .search-bar { display: flex; background: #282828; border-radius: 500px; padding: 10px 16px; width: 350px; align-items: center; gap: 10px; }
                .search-bar input { background: none; border: none; color: #fff; font-size: 14px; outline: none; width: 100%; }
                
                .signup-box { display: flex; gap: 10px; align-items: center; }
                .signup-box input { background: #282828; border: 1px solid #3e3e3e; color: #fff; padding: 8px 14px; border-radius: 500px; font-size: 13px; outline: none; }
                .btn-green { background: #1db954; color: #000; font-weight: bold; border: none; padding: 8px 18px; border-radius: 500px; cursor: pointer; font-size: 13px; text-decoration: none; }
                .btn-green:hover { transform: scale(1.02); background: #1ed760; }

                .content-body { padding: 32px; display: flex; flex-direction: column; gap: 32px; }
                
                /* Categories / Mix Lists */
                .category-row { display: flex; gap: 12px; flex-wrap: wrap; }
                .cat-pill { background: #282828; color: #fff; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 13px; font-weight: 500; border: 1px solid transparent; }
                .cat-pill:hover, .cat-pill.active { background: #fff; color: #000; }

                /* Track Grid / List */
                h3 { font-size: 22px; margin-bottom: 16px; letter-spacing: -0.5px; }
                .track-table { width: 100%; border-collapse: collapse; }
                .track-table th { text-align: left; color: #b3b3b3; font-size: 12px; font-weight: 500; border-bottom: 1px solid #282828; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
                .track-table td { padding: 14px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
                .track-table tr:hover { background: rgba(255,255,255,0.05); }
                audio { height: 36px; width: 220px; }
            </style>
        </head>
        <body>
            <!-- Sidebar -->
            <aside>
                <h2>🎧 Sovereign Music</h2>
                <div class="nav-links">
                    <a href="/">🏠 Home Feed</a>
                    <a href="/?category=Anatolian+Psychedelic+%26+Folk">🎸 Anatolian Psychedelic</a>
                    <a href="/?category=Pop+Hits+%26+Timeless+Anthems">⭐ Pop & Classics</a>
                    <a href="/?category=Classic+Hip+Hop">🎤 Classic Hip Hop</a>
                    <a href="/?category=Modern+2026+Mixes">🚀 2026 Modern Mixes</a>
                </div>
            </aside>

            <!-- Main Stream -->
            <main>
                <div style="background: #101010; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #282828; position: sticky; top: 0; z-index: 10;">
                    <form action="/" method="GET" class="search-bar">
                        <span>🔍</span>
                        <input type="text" name="q" value="${searchQuery}" placeholder="Search artists, songs, Barış Manço, Beatles...">
                    </form>
                    
                    <form action="/api/join" method="POST" class="signup-box">
                        <input type="email" name="email" placeholder="Enter email to join free" required>
                        <button type="submit" class="btn-green">Join Free</button>
                    </form>
                </div>

                <div class="content-body">
                    <!-- Mix List Categories -->
                    <div>
                        <h3 style="font-size: 16px; color: #b3b3b3; margin-bottom: 12px;">Browse Mix Categories</h3>
                        <div class="category-row">
                            <a href="/" class="cat-pill ${!categoryQuery ? 'active' : ''}">All Music</a>
                            <a href="/?category=Anatolian+Psychedelic+%26+Folk" class="cat-pill ${categoryQuery.includes('Anatolian') ? 'active' : ''}">Anatolian & Folk</a>
                            <a href="/?category=Classic+%26+1950s+Gold" class="cat-pill ${categoryQuery.includes('1950s') ? 'active' : ''}">1950s - Classics</a>
                            <a href="/?category=Classic+Hip+Hop" class="cat-pill ${categoryQuery.includes('Hip Hop') ? 'active' : ''}">Classic Hip Hop</a>
                            <a href="/?category=Pop+Hits+%26+Timeless+Anthems" class="cat-pill ${categoryQuery.includes('Pop') ? 'active' : ''}">Pop Hits</a>
                            <a href="/?category=Modern+2026+Mixes" class="cat-pill ${categoryQuery.includes('2026') ? 'active' : ''}">2026 Mixes</a>
                        </div>
                    </div>

                    <!-- Track Listing -->
                    <div>
                        <h3>Library & Audio Streams</h3>
                        <table class="track-table">
                            <tr>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Category Mix</th>
                                <th>Duration</th>
                                <th>Listen</th>
                            </tr>
                            ${tracks && tracks.length > 0 ? tracks.map(t => `
                                <tr>
                                    <td><b>${t.track_title}</b></td>
                                    <td style="color:#b3b3b3;">${t.artist}</td>
                                    <td><span style="color:#1db954; font-weight:500;">${t.category}</span></td>
                                    <td><code>${t.duration}</code></td>
                                    <td>
                                        <audio controls preload="none">
                                            <source src="${t.audio_url}" type="audio/mpeg">
                                            Your browser does not support audio.
                                        </audio>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="5" style="color:#b3b3b3; padding: 20px;">No tracks found matching your search.</td></tr>'}
                        </table>
                    </div>
                </div>
            </main>
        </body>
        </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`Goodbye`); // Updated print statement as requested!
    console.log(`🎧 Sovereign Free Music Hub running on port ${PORT}`);
});
