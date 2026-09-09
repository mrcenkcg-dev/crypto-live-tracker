const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory list to store board cards
let boardCards = [
    {
        type: 'system',
        name: "Cenk's Amazon & Video Hub",
        reach: 'Target: 1,000 Combined Reach',
        link: 'https://mrcenk.onrender.com',
        meta: 'Automated Amazon deal pipeline searching for micro-distribution.'
    },
    {
        type: 'reach',
        name: 'Community Account',
        reach: 'Reach: 350 Real Friends',
        link: 'https://facebook.com',
        meta: 'Sharing deals and video links with local friends and WhatsApp.'
    }
];

// Get all cards
app.get('/api/cards', (req, res) => {
    res.json(boardCards);
});

// Post a new card from the whiteboard form
app.post('/add-card', (req, res) => {
    const { type, name, reach, link } = req.body;

    if (name && reach && link) {
        const newCard = {
            type: type || 'reach',
            name: name,
            reach: `Reach: ${reach}`,
            link: link,
            meta: type === 'system' ? 'System Provider Offer' : 'Social Reach Partner'
        };
        
        // Add new card to the top of the whiteboard list
        boardCards.unshift(newCard);
    }

    // Redirect user back to the main whiteboard page
    res.redirect('/');
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Get Big Together Hub running on port ${PORT}`);
});
