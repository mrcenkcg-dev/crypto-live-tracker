const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Dual-Vacancy Logic & 7-Day Test State
const CONFIG = {
    maxFreeSlots: 1500,
    microFeeEntry: 0.50, // 50p toll starting at 1501
    userSlotLimit: 10,   // Strict cap per participant
    testWindowDays: 7
};

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/config', (req, res) => {
    res.json(CONFIG);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
