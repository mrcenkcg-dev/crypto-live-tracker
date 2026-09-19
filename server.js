/**
 * Sovereign Engine: Financial Intelligence & Autonomous Worker Core
 * Stack: Node.js, Express, SQLite, Autonomous Loop Architecture
 * Objective: 24/7 background utility, automated processing, and financial logic tracking.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// 1. Initialize SQLite Database (Local Sovereign Storage)
const dbPath = path.resolve(__dirname, 'sovereign_engine.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to Sovereign SQLite Database.');
    }
});

// Create tables for logging system state, agent actions, and financial metrics
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        module_name TEXT,
        status TEXT,
        message TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS financial_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        metric_key TEXT,
        metric_value REAL,
        notes TEXT
    )`);
});

// Helper function to log system events
function logEvent(module, status, message) {
    const stmt = db.prepare(`INSERT INTO system_logs (module_name, status, message) VALUES (?, ?, ?)`);
    stmt.run(module, status, message);
    stmt.finalize();
}

// 2. Core Dashboard Endpoint (Health & Status Check)
app.get('/', (req, res) => {
    db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 5`, [], (err, logs) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            status: 'ONLINE',
            engine: 'Sovereign Financial Intelligence Core',
            uptime: process.uptime(),
            recent_logs: logs
        });
    });
});

// 3. Financial Intelligence & Quant Tracking Endpoint
app.post('/api/quant-eval', (req, res) => {
    const { metric_key, metric_value, notes } = req.body;
    
    if (!metric_key || metric_value === undefined) {
        return res.status(400).json({ error: 'Missing metric_key or metric_value' });
    }

    const stmt = db.prepare(`INSERT INTO financial_metrics (metric_key, metric_value, notes) VALUES (?, ?, ?)`);
    stmt.run(metric_key, metric_value, notes || 'Automated Alpha-Pilot / Long-Capital hook', function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        logEvent('QuantEngine', 'SUCCESS', `Recorded metric: ${metric_key} = ${metric_value}`);
        res.json({ success: true, inserted_id: this.lastID });
    });
});

// 4. Autonomous Background Worker Loop (Simulating Upsonic / Agent Execution)
function runAutonomousLoop() {
    console.log('🔄 Running background sovereign agent cycle...');
    
    // Perform routine maintenance, data check, or simulated quant model validation
    const timestamp = new Date().toISOString();
    logEvent('AutonomousWorker', 'ACTIVE', `Background cycle executed successfully at ${timestamp}`);
}

// Trigger background worker loop every 30 minutes (24/7 sovereign operation)
const LOOP_INTERVAL = 30 * 60 * 1000;
setInterval(runAutonomousLoop, LOOP_INTERVAL);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Engine is live on port ${PORT}`);
    logEvent('SystemCore', 'BOOT', `Server successfully started on Render port ${PORT}`);
});
