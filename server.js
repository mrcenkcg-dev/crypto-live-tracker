// 8. PUBLIC ISLAND PORTAL (Protected by Micro-Fee Toll Gate Middleware)
app.get('/island', microFeeTollGate('$0.001'), (req, res) => {
    db.all(`SELECT * FROM media_streams ORDER BY id DESC`, [], (err, mediaStreams) => {
        db.get(`SELECT * FROM ui_mutations ORDER BY id DESC LIMIT 1`, [], (err2, activeUi) => {
            
            const accentColor = activeUi ? activeUi.applied_css_accent : '#22c55e';

            const publicHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Anadolu Island - Community & Media Feed</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f0f0f; color: #f1f1f1; padding: 0; }
                    nav { background: #181818; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; position: sticky; top: 0; z-index: 100; }
                    .brand { font-size: 20px; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 8px; }
                    .brand span { color: ${accentColor}; }
                    .nav-actions { display: flex; gap: 12px; align-items: center; }
                    .nav-btn { background: #272727; color: #fff; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 13px; font-weight: bold; border: 1px solid #3f3f46; transition: background 0.2s; }
                    .nav-btn:hover { background: #3f3f46; }
                    .container { max-width: 900px; margin: 30px auto; padding: 0 20px; display: flex; flex-direction: column; gap: 30px; }
                    .hero-card { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 30px; text-align: center; background: linear-gradient(135deg, #181818, #222); }
                    .hero-card h1 { font-size: 28px; color: #fff; margin-bottom: 10px; }
                    .hero-card p { font-size: 15px; color: #aaa; max-width: 600px; margin: 0 auto; line-height: 1.5; }
                    .feed-header { font-size: 18px; font-weight: bold; color: #fff; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
                    .stream-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
                    .stream-card { background: #181818; border: 1px solid #333; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
                    .stream-thumb { background: #222; height: 140px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 13px; font-weight: bold; }
                    .stream-info { padding: 15px; display: flex; flex-direction: column; gap: 8px; }
                    .stream-title { font-size: 14px; font-weight: bold; color: #fff; }
                    .stream-desc { font-size: 12px; color: #aaa; line-height: 1.4; }
                    .toll-badge { background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e; color: #22c55e; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-flex; align-items: center; gap: 6px; }
                </style>
            </head>
            <body>
                <nav>
                    <div class="brand">⚓ Anadolu <span>Island</span></div>
                    <div class="nav-actions">
                        <a href="/" class="nav-btn">🛡️ Command Center</a>
                    </div>
                </nav>
                <div class="container">
                    <div class="hero-card">
                        <h1>Sovereign Public Media Feed</h1>
                        <p>Welcome to the public broadcast portal. Access to this stream is metered through an autonomous micro-fee toll gate ($0.001 per request), logged directly to local persistence.</p>
                        <div style="margin-top: 20px;">
                            <span class="toll-badge">🪙 Toll Verified &bull; Micro-Fee Cleared</span>
                        </div>
                    </div>
                    <div>
                        <div class="feed-header">
                            <span>Active Media Streams</span>
                            <span style="font-size: 13px; color: #888;">Live Telemetry Feed</span>
                        </div>
                        <div class="stream-grid">
                            ${mediaStreams && mediaStreams.length > 0 ? mediaStreams.map(s => `
                                <div class="stream-card">
                                    <div class="stream-thumb">FEED SOURCE: ${s.platform_source || 'Internal'}</div>
                                    <div class="stream-info">
                                        <div class="stream-title">${s.title}</div>
                                        <div class="stream-desc">${s.description || 'No additional details provided.'}</div>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="stream-card">
                                    <div class="stream-thumb">DEFAULT FEED</div>
                                    <div class="stream-info">
                                        <div class="stream-title">Sovereign Genesis Stream</div>
                                        <div class="stream-desc">All systems nominal. Ready for active video stream inputs and FFmpeg pipelines.</div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `;
            res.send(publicHtml);
        });
    });
});

// 9. Boot Application
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Engine successfully running on port ${PORT}`);
    logEvent('SystemBoot', 'SUCCESS', `Sovereign Engine online and listening on port ${PORT}.`);
});
