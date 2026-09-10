const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory boards storage
let boards = [
    { type: 'System Provider Offer', name: 'Nazmiye (system)', reach: '100 views', link: 'https://facebook.com', clicks: 0, joined: 0 }
];

app.get('/api/board', (req, res) => {
    res.json(boards);
});

app.post('/api/submit', (req, res) => {
    const { type, name, reach, link } = req.body;
    if (!name || !link) {
        return res.status(400).json({ error: 'Name and link are required' });
    }
    boards.push({ type, name, reach, link, clicks: 0, joined: 0 });
    res.json({ success: true });
});

app.post('/api/click', (req, res) => {
    const { link } = req.body;
    const board = boards.find(b => b.link === link);
    if (board) {
        board.clicks = (board.clicks || 0) + 1;
        res.json({ success: true, clicks: board.clicks });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
