const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data from your frontend forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root or public folder
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// --- IN-MEMORY DATA STORES (Ready for DB connection later) ---
let activeTasks = [];
let workerProfiles = [];

// --- 1. BUSINESS TASK ENDPOINTS ---
// Get all tasks for workers to see
app.get('/api/tasks', (req, res) => {
    res.json(activeTasks);
});

// Business posts a new task slot
app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
    };
    activeTasks.push(newTask);
    console.log(`[Task Posted] Total active tasks: ${activeTasks.length}`);
    res.status(201).json({ success: true, task: newTask });
});

// --- 2. WORKER PROFILE & BANK DETAILS ENDPOINTS ---
// Save or update worker bank/payout details
app.post('/api/worker/profile', (req, res) => {
    const workerData = req.body;
    // Check if worker already exists, update or push new
    const existingIndex = workerProfiles.findIndex(w => w.email === workerData.email);
    
    if (existingIndex >= 0) {
        workerProfiles[existingIndex] = { ...workerProfiles[existingIndex], ...workerData };
    } else {
        workerProfiles.push({ id: Date.now().toString(), ...workerData });
    }
    
    console.log(`[Worker Profile Saved] Total profiles: ${workerProfiles.length}`);
    res.status(200).json({ success: true, message: "Bank details and profile saved successfully." });
});

// Fetch worker profile details if needed
app.get('/api/worker/profile/:email', (req, res) => {
    const profile = workerProfiles.find(w => w.email === req.params.email);
    if (profile) {
        res.json(profile);
    } else {
        res.status(404).json({ error: "Profile not found" });
    }
});

// Root route handler
app.get('/', (req, res) => {
    const rootPath = path.join(__dirname, 'index.html');
    const publicPath = path.join(__dirname, 'public', 'index.html');
    
    res.sendFile(rootPath, (err) => {
        if (err) {
            res.sendFile(publicPath, (err2) => {
                if (err2) {
                    res.status(404).send("Index.html not found in root or public folder.");
                }
            });
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
