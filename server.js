const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data from your frontend
app.use(express.json());

// Serve static files from root or public folder
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// --- IN-MEMORY TASK QUEUE (Temporary store for active slots) ---
let activeTaskQueue = [];

// API Endpoint: Business posts new task slots
app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    newTask.id = Date.now().toString(); // Give it a unique ID
    newTask.createdAt = new Date();
    activeTaskQueue.push(newTask);
    
    console.log(`[Task Created] Slot added by business. Total active: ${activeTaskQueue.length}`);
    res.status(201).json({ success: true, task: newTask });
});

// API Endpoint: Worker fetches available task slots
app.get('/api/tasks', (req, res) => {
    res.json(activeTaskQueue);
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
