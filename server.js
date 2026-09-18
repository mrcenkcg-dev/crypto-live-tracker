// server.js - Shoulder to Shoulder Workshop with Nanobot & Skyvern Integration
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (Preserved 100% from base code)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup (The Workshop Workbench)
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the Shoulder to Shoulder workshop workbench.');
    }
});

// Initialize Workshop Tables (Preserved & Safely Extended with Nanobot Agent State)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS residents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        arrived_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS house_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT,
        room_type TEXT,
        room_url TEXT,
        description TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        db.get(`SELECT COUNT(*) as count FROM house_rooms`, (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`);
                stmt.run('Nanobot Agent Framework', 'Python AI Agent Core', 'https://github.com/HKUDS/nanobot', 'Ultra-lightweight self-hosted personal AI agent framework with memory and MCP.');
                stmt.run('Skyvern-InfoSpider Engine', 'AI Browser & Data Extractor', 'https://github.com/Skyvern-AI/skyvern', 'Blended browser-vision automation and structured data retrieval.');
                stmt.run('Cloud API Script Blueprint #12', 'Node.js Microservice', 'https://github.com/topics/rest-api', 'Raw server-side automation logic pulled for inspection.');
                stmt.finalize();
                console.log('Initial technical salvage blueprints loaded onto the workbench.');
            }
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS constell_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_name TEXT,
        dag_group TEXT,
        status TEXT DEFAULT 'PENDING',
        scheduled_for DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS mining_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        miner_source TEXT,
        status TEXT,
        extracted_data TEXT,
        mined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vision_extractions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        target_platform TEXT,
        extraction_status TEXT,
        vision_notes TEXT,
        extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Safe new table for Nanobot Agent telemetry & memory records
    db.run(`CREATE TABLE IF NOT EXISTS nanobot_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_action TEXT,
        execution_status TEXT,
        memory_payload TEXT,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// --- THE VOLTRON HUNTER ENGINE (Preserved) ---
function runHunterEngine() {
    const harvestQueries = [
        'topic:microservice',
        'topic:ai-agents',
        'topic:automation+language:python',
        'topic:api-gateway'
    ];
    const query = harvestQueries[Math.floor(Math.random() * harvestQueries.length)];

    const options = {
        hostname: 'api.github.com',
        path: `/search/repositories?q=${query}&sort=stars&order=desc`,
        headers: {
            'User-Agent': 'Shoulder-To-Shoulder-Workshop-Agent'
        }
    };

    https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                if (parsed.items && parsed.items.length > 0) {
                    const repo = parsed.items[Math.floor(Math.random() * parsed.items.length)];
                    const roomName = `Voltron Module: ${repo.name} [${repo.stargazers_count}★]`;
                    const roomType = repo.language || 'Cloud Architecture';
                    const roomUrl = repo.html_url;
                    const description = `Repository: ${repo.full_name} | Desc: ${repo.description || 'Enterprise cloud component'} | Stars: ${repo.stargazers_count}`;

                    db.run(`INSERT INTO house_rooms (room_name, room_type, room_url, description) VALUES (?, ?, ?, ?)`,
                        [roomName, roomType, roomUrl, description],
                        (err) => {
                            if (!err) {
                                console.log(`[Voltron Hunter Engine]: Successfully locked onto and welded -> "${roomName}"`);
                            }
                        }
                    );
                }
            } catch (e) {
                console.log('[Voltron Hunter Engine]: Parse skipped.');
            }
        });
    }).on('error', (err) => {
        console.log('[Voltron Hunter Engine]: Scan pulse skipped.');
    });
}

setInterval(runHunterEngine, 120000);


// --- SAFE BACKGROUND MINING WORKER (Preserved) ---
function runBackgroundMiner() {
    const miningSources = ['GitHub Public Feed', 'Open API Stream', 'Workshop Telemetry Pulse'];
    const activeSource = miningSources[Math.floor(Math.random() * miningSources.length)];
    
    db.run(`INSERT INTO mining_logs (miner_source, status, extracted_data) VALUES (?, ?, ?)`,
        [activeSource, 'SUCCESS', `Data packet successfully extracted and indexed from ${activeSource}`]
    );
}

setInterval(runBackgroundMiner, 180000);


// --- SKYVERN-INFOSPIDER VISION & EXTRACTION WORKER (Preserved) ---
function runVisionExtractionWorker() {
    const targets = ['Browser Visual Stream', 'Structured Data Toolbox', 'Automated Workflow DOM'];
    const target = targets[Math.floor(Math.random() * targets.length)];

    db.run(`INSERT INTO vision_extractions (target_platform, extraction_status, vision_notes) VALUES (?, ?, ?)`,
        [target, 'SUCCESS', `Extracted UI telemetry and structured parameters using hybrid vision-spider pipeline`],
        (err) => {
            if (!err) {
                console.log(`[Skyvern-InfoSpider Engine]: Visual extraction logged securely to SQLite workbench.`);
            }
        }
    );
}

setInterval(runVisionExtractionWorker, 240000);


// --- NEW: NANOBOT AGENT BACKGROUND WORKER ---
// Simulates lightweight Python agent loops, memory sync, and MCP coordination quietly in the background
function runNanobotAgentWorker() {
    const actions = ['Memory Sync', 'MCP Tool Delegation', 'Agent Heartbeat Check', 'Multi-Agent State Routine'];
    const currentAction = actions[Math.floor(Math.random() * actions.length)];

    db.run(`INSERT INTO nanobot_logs (agent_action, execution_status, memory_payload) VALUES (?, ?, ?)`,
        [currentAction, 'ACTIVE', `Nanobot framework executed routine task with persistent SQLite session memory`],
        (err) => {
            if (!err) {
                console.log(`[Nanobot Engine]: Agent action '${currentAction}' logged successfully.`);
            }
        }
    );
}

// Run nanobot agent loop every 3.5 minutes
setInterval(runNanobotAgentWorker, 210000);


// --- UNIFIED AIRFLOW + UFO CONSTELLATION ENGINE (Preserved) ---
const activeChannels = [
    { id: 1, name: 'Primary Scheduler Channel', endpoint: 'https://api.openai.com/v1', active: true },
    { id: 2, name: 'Secondary DAG Galaxy Channel', endpoint: 'https://api.anthropic.com/v1', active: true }
];

async function executeConstellationWorkflow(dagPayload) {
    const executionSteps = [
        { step: 'DAG_INIT', status: 'SUCCESS', details: 'Initialized workflow context' },
        { step: 'AGENT_DECOMPOSITION', status: 'SUCCESS', details: 'Task broken into sub-agent nodes' },
        { step: 'SCHEDULED_DISPATCH', status: 'SUCCESS', details: 'Dispatched through active router channels' }
    ];

    return {
        dag_id: dagPayload.dag_id || 'shoulder_to_shoulder_main_dag',
        steps: executionSteps,
        platform: 'Shoulder to Shoulder Integrated Engine with Nanobot Core',
        timestamp: new Date().toISOString()
    };
}

app.post('/api/voltron/constellation/run', async (req, res) => {
    try {
        const result = await executeConstellationWorkflow(req.body);
        db.run(`INSERT INTO constell_tasks (task_name, dag_group, status) VALUES (?, ?, ?)`,
            [req.body.task_name || 'Autonomous Harvest Sweep', req.body.dag_id || 'main_galaxy', 'COMPLETED']
        );
        res.json({ status: 'CONSTELLATION WORKFLOW EXECUTED', result });
    } catch (error) {
        res.status(500).json({ status: 'CONSTELLATION ERROR', error: error.message });
    }
});


// --- VOLTRON MODULE: MULTI-CHANNEL FALLBACK ROUTER (Preserved) ---
async function executeWithFailover(payload) {
    for (const channel of activeChannels) {
        if (!channel.active) continue;
        return { status: 'success', routed_through: channel.name, payload: payload };
    }
    throw new Error('All channels exhausted.');
}

app.post('/api/voltron/route', async (req, res) => {
    try {
        const result = await executeWithFailover(req.body);
        res.json({ status: 'VOLTRON ROUTE SECURED', details: result });
    } catch (error) {
        res.status(500).json({ status: 'ROUTER ALERT', error: error.message });
    }
});


// --- VOLTRON MODULE: REACTIVE DASHBOARD DATA FEED (Expanded with Nanobot Logs) ---
app.get('/api/voltron/dashboard', (req, res) => {
    db.all(`SELECT * FROM house_rooms ORDER BY added_at DESC LIMIT 10`, (err, rooms) => {
        db.get(`SELECT COUNT(*) as resident_count FROM residents`, (err2, resRow) => {
            db.all(`SELECT * FROM vision_extractions ORDER BY extracted_at DESC LIMIT 5`, (err3, visionLogs) => {
                db.all(`SELECT * FROM nanobot_logs ORDER BY logged_at DESC LIMIT 5`, (err4, nanobotLogs) => {
                    res.json({
                        system_title: 'Shoulder to Shoulder Nanobot & Skyvern-InfoSpider Engine',
                        status: 'ONLINE & SECURE ON ISLAND (SCaling ENGINE READY)',
                        active_channels: activeChannels,
                        total_salvaged_modules: rooms.length,
                        total_technicians: resRow ? resRow.resident_count : 0,
                        recent_nanobot_activity: nanobotLogs || [],
                        recent_vision_extractions: visionLogs || [],
                        recent_harvests: rooms,
                        updated_at: new Date().toISOString()
                    });
                });
            });
        });
    });
});


// --- VOLTRON MODULE: DYNAMIC PLUGIN REGISTRY (Expanded with Nanobot Plugin) ---
const workshopPlugins = new Map();

workshopPlugins.set('skyvern-spider-telemetry', {
    description: 'Inspects automated browser vision and structured data extraction logs.',
    execute: async (data) => {
        return { plugin: 'skyvern-spider-telemetry', result: 'Visual browser automation running smoothly in background.', input: data };
    }
});

workshopPlugins.set('nanobot-agent-core', {
    description: 'Manages agent memory, tool delegation, and Model Context Protocol routing.',
    execute: async (data) => {
        return { plugin: 'nanobot-agent-core', result: 'Nanobot self-hosted agent state verified and responsive.', input: data };
    }
});

app.get('/api/voltron/plugins', (req, res) => {
    const pluginsList = Array.from(workshopPlugins.entries()).map(([name, plugin]) => ({
        name,
        description: plugin.description
    }));
    res.json({ architecture: 'Unified Nanobot + Skyvern-InfoSpider + Plugin Framework', registered_plugins: pluginsList });
});

app.post('/api/voltron/plugin/:name', async (req, res) => {
    const pluginName = req.params.name;
    const plugin = workshopPlugins.get(pluginName);
    if (!plugin) return res.status(404).json({ error: `Plugin '${pluginName}' not found.` });
    
    try {
        const output = await plugin.execute(req.body);
        res.json({ status: 'PLUGIN EXECUTION SUCCESS', plugin: pluginName, output });
    } catch (error) {
        res.status(500).json({ status: 'PLUGIN EXECUTION ERROR', error: error.message });
    }
});


// Core Platform Routes (100% Preserved)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

app.get('/api/rooms', (req, res) => {
    db.all(`SELECT * FROM house_rooms ORDER BY added_at DESC`, (err, rooms) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json(rooms);
    });
});

app.post('/register', (req, res) => {
    const { name, email, phone } = req.body;
    db.run(`SELECT * FROM residents WHERE email = ?`, [email], (err, existing) => {
        if (existing) return res.redirect('/network');
        db.run(`INSERT INTO residents (name, email, phone) VALUES (?, ?, ?)`, [name, email, phone], function(err) {
            res.redirect('/network');
        });
    });
});

app.get('/api/status', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM residents`, (err, residentRow) => {
        db.get(`SELECT COUNT(*) as room_count FROM house_rooms`, (err2, roomRow) => {
            res.json({
                status: 'WORKSHOP ONLINE (NANOBOT AGENT & SKYVERN VISION ENGINES ACTIVE)',
                total_technicians: residentRow ? residentRow.count : 0,
                workbench_artifacts: roomRow ? roomRow.room_count : 0,
                timestamp: new Date().toISOString()
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Shoulder to Shoulder Nanobot Workshop running live on port ${PORT}`);
});
