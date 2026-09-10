const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let boardCards = [
    { type: 'system', name: 'Nazmiye', reach: '100 views', link: 'https://facebook.com', meta: 'Initial feed' }
];

let clickLedger = {};

app.get('/api/board', (req, res) => {
    res.json(boardCards);
});

app.post('/api/submit', (req, res) => {
    const { name, reach, link, meta } = req.body;
    if (!name || !link) {
        return res.status(400).json({ error: 'Name and link are required' });
    }
    boardCards.unshift({ type: 'user', name, reach: reach || '0 views', link, meta: meta || 'Community share' });
    res.status(200).json({ status: 'Success', message: 'Resource added successfully' });
});

app.post('/api/click', (req, res) => {
    const { name, link } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name required for click tracking' });
    }
    clickLedger[name] = (clickLedger[name] || 0) + 1;
    res.status(200).json({ status: 'Click logged', total_clicks: clickLedger[name] });
});

app.post('/api/auto-post', (req, res) => {
    const { secret_key, name, reach, link, meta } = req.body;

    if (secret_key !== "get_big_automation_secret") {
        return res.status(403).json({ error: "Unauthorized automated access" });
    }

    if (!name || !link) {
        return res.status(400).json({ error: "Missing required content fields" });
    }

    boardCards.unshift({
        type: 'system',
        name: name,
        reach: reach || 'Goal: Automated Traffic Burst',
        link: link,
        meta: meta || 'Auto-generated feed'
    });

    res.status(200).json({
        status: "Success",
        message: `Card '${name}' successfully published!`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
