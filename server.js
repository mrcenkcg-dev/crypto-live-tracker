const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory cards storage
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

// API endpoint to return active cards
app.get('/api/cards', (req, res) => {
    res.json(boardCards);
});

// Post card endpoint
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

// Explicitly serve index.html for root route
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
