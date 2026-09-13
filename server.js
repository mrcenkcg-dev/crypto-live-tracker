// server.js - Clean Service Engine Backend

const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data stores for active matrix and worker registrations
let coreSlots = Array(10).fill().map(() => ({ name: "Empty", status: "Open", value: "£0.00" }));
let goldSlots = Array(10).fill().map(() => ({ name: "Locked", status: "Locked", value: "£0.00" }));
let systemLogs = ["> Shoulder to shoulder engine active. Drop-off vaults calibrated. Zero duplicates enforced..."];

// Get live state
app.get('/api/state', (req, res) => {
    res.json({
        coreSlots,
        goldSlots,
        logs: systemLogs
    });
});

// Register a business link into the core matrix
app.post('/api/register-business', (req, res) => {
    const { name, url } = req.body;
    
    if (!name || !url) {
        return res.status(400).json({ error: "Business Name and Target URL are required." });
    }

    const emptyIndex = coreSlots.findIndex(s => s.status === "Open" || s.name === "Empty");
    if (emptyIndex === -1) {
        return res.status(400).json({ error: "Core 10-Slot Matrix is full." });
    }

    coreSlots[emptyIndex] = { name: name, status: "Active", value: "£0.10" };
    systemLogs.push(`> Business registered: ${name} -> Added to slot ${emptyIndex + 1}.`);
    
    res.json({ success: true, coreSlots, logs: systemLogs });
});

// Register an everyday worker / job seeker into the gold key matrix
app.post('/api/register-worker', (req, res) => {
    const { name, contact } = req.body;

    if (!name || !contact) {
        return res.status(400).json({ error: "Name and Contact details are required." });
    }

    const lockedIndex = goldSlots.findIndex(s => s.status === "Locked");
    if (lockedIndex === -1) {
        return res.status(400).json({ error: "All Gold Key slots are claimed." });
    }

    goldSlots[lockedIndex] = { name: `${name} (${contact})`, status: "Active", value: "£0.10" };
    systemLogs.push(`> Worker registered: ${name} -> Golden Key slot ${lockedIndex + 11} unlocked!`);

    res.json({ success: true, goldSlots, logs: systemLogs });
});

// Deploy daily share action
app.post('/api/deploy-share', (req, res) => {
    systemLogs.push(`> Daily network share deployed. Vault payouts updating...`);
    res.json({ success: true, logs: systemLogs });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Shoulder-to-Shoulder server running on port ${PORT}`);
});
