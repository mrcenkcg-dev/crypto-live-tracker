const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory cards array
let boardCards = [
    {
        type: 'system',
        name: "Cenk's YouTube & Amazon Hub",
        reach: 'Goal: 1,000 Views / Shares',
        link: 'https://youtube.com',
        meta: 'Sharing automated deal engines and YouTube video links.'
    },
    {
        type: 'reach',
        name: 'Social Reach Promoter',
        reach: 'Reach: 500 Real Friends',
        link: 'https://facebook.com',
        meta: 'Ready to promote video links and offers on WhatsApp and social groups.'
    }
];

// --- CLICK TRACKING LEDGER (Step 2) ---
let clickLedger = [];

app.post('/log_click', (req, res) => {
    const { user_name, task_id } = req.body;

    if (!user_name || !task_id) {
        return res.status(400).json({ error: "Missing data" });
    }

    const newClick = {
        id: clickLedger.length + 1,
        user_name,
        task_id,
        timestamp: new Date()
    };

    clickLedger.push(newClick);

    res.status(200).json({ 
        status: "Success", 
        message: `Click logged securely for ${user_name}!` 
    });
});

app.get('/api/ledger', (req, res) => {
    res.json(clickLedger);
});
// ---------------------------------------

// API endpoint for cards
app.get('/api/cards', (req, res) => {
    res.json(boardCards);
});

// Handle card submissions
app.post('/add-card', (req, res) => {
    const { type, name, reach, link } = req.body;

    if (name && reach && link) {
        boardCards.unshift({
            type: type || 'reach',
            name: name,
            reach: `Reach: ${reach}`,
            link: link,
            meta: type === 'system' ? 'System Provider Offer' : 'Social Reach Partner'
        });
    }
    res.redirect('/');
});

// Explicit root route serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Get Big Together Hub running on port ${PORT}`);
});
