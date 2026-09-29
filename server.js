const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Core Gateway / Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'online', system: 'Sovereign Studio Core' });
});

// 2. Main Studio Interface
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sovereign Studio</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                background: #0a0c0b; 
                color: #e2e8f0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
            }
            .studio-container { 
                background: #121814; 
                padding: 40px; 
                border-radius: 16px; 
                border: 1px solid rgba(34, 197, 94, 0.2); 
                width: 100%; 
                max-width: 480px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            h1 { color: #22c55e; font-size: 22px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
            p { color: #8a9991; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
            .status-badge { 
                display: inline-block; 
                padding: 6px 12px; 
                background: rgba(34, 197, 94, 0.1); 
                color: #22c55e; 
                border-radius: 20px; 
                font-size: 12px; 
                font-weight: 600;
                letter-spacing: 0.5px;
            }
        </style>
    </head>
    <body>
        <div class="studio-container">
            <h1>🟢 Sovereign Studio</h1>
            <p>Clean slate initialized. Ready for module integration.</p>
            <div class="status-badge">SYSTEM SECURE & READY</div>
        </div>
    </body>
    </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Sovereign Studio active on port ${PORT}`);
});
