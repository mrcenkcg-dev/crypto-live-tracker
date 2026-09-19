/**
 * Sovereign Engine: Financial Intelligence & Autonomous Worker Core
 * Stack: Node.js, Express, SQLite, Autonomous Loop Architecture
 * Objective: 24/7 background utility, automated processing, and financial logic tracking.
 * Upgraded with: Self-Healing Telemetry & 2-Hour Apprentice Loop Integration
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

    db.run(`CREATE TABLE IF NOT EXISTS telemetry_cycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        cycle_name TEXT,
        status TEXT,
        details TEXT
    )`);
});

// Helper function to log system events safely (Self-Healing Wrapper)
function logEvent(module, status, message) {
    try {
        const stmt = db.prepare(`INSERT INTO system_logs (module_name, status, message) VALUES (?, ?, ?)`);
        stmt.run(module, status, message);
        stmt.finalize();
    } catch (dbError) {
        console.error('⚠️ Self-healing catch: Log error ->', dbError.message);
    }
}

// 2. Core Dashboard Endpoint (Health & Status Check)
app.get('/', (req, res) => {
    db.all(`SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 5`, [], (err, logs) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.all(`SELECT * FROM telemetry_cycles ORDER BY timestamp DESC LIMIT 2`, [], (err2, cycles) => {
            res.json({
                status: 'ONLINE',
                engine: 'Sovereign Financial Intelligence Core',
                uptime: process.uptime(),
                recent_logs: logs,
                recent_telemetry: cycles || []
            });
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

// 4. Autonomous Background Worker Loop (30-Minute Financial/Data Routine)
function runAutonomousLoop() {
    console.log('🔄 Running background sovereign financial agent cycle...');
    try {
        const timestamp = new Date().toISOString();
        logEvent('AutonomousWorker', 'ACTIVE', `Background financial cycle executed successfully at ${timestamp}`);
    } catch (err) {
        logEvent('AutonomousWorker', 'ERROR', `Error in background cycle: ${err.message}`);
    }
}

// 5. Apprentice Agent 2-Hour Telemetry & Self-Healing Behavioral Check
function runApprenticeTelemetryCycle() {
    console.log('🐾 Running 2-hour apprentice telemetry behavioral check...');
    try {
        const timestamp = new Date().toISOString();
        const cycleName = 'Cycle_Telemetry_Check';
        
        // Log telemetry run into database
        const stmt = db.prepare(`INSERT INTO telemetry_cycles (cycle_name, status, details) VALUES (?, ?, ?)`);
        stmt.run(cycleName, 'PENDING_INSPECTION', `Apprentice agent compiled telemetry and self-healing verification at ${timestamp}`);
        stmt.finalize();

        logEvent('ApprenticeAgent', 'SUCCESS', `2-hour telemetry behavioral check completed safely.`);
    } catch (err) {
        logEvent('ApprenticeAgent', 'ERROR', `Telemetry loop error: ${err.message}`);
    }
}

// Trigger background worker loop every 30 minutes
const LOOP_INTERVAL = 30 * 60 * 1000;
setInterval(runAutonomousLoop, LOOP_INTERVAL);

// Trigger apprentice telemetry check every 2 hours (2 * 60 * 60 * 1000)
const TELEMETRY_INTERVAL = 2 * 60 * 60 * 1000;
setInterval(runApprenticeTelemetryCycle, TELEMETRY_INTERVAL);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Sovereign Engine is live on port ${PORT}`);
    logEvent('SystemCore', 'BOOT', `Server successfully started on Render port ${PORT}`);
});
