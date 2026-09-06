const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Mock/Live price endpoint for the tracker
app.get('/api/prices', (req, res) => {
    const prices = [
        { symbol: 'btc', price: 64250.50, change_24h: 2.45 },
        { symbol: 'eth', price: 3480.10, change_24h: -0.85 },
        { symbol: 'sol', price: 145.75, change_24h: 5.12 },
        { symbol: 'ada', price: 0.42, change_24h: 1.15 }
    ];
    res.json(prices);
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
