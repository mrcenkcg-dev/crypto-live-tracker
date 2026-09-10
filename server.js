const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let boards = [
    { type: 'System Provider Offer', name: 'Nazmiye (system)', reach: '100 views', link: 'https://facebook.com', clicks: 2, joined: 0, completed: false }
];

app.get('/api/board', (req, res) => {
    res.json(boards);
});

app.post('/api/submit', (req, res) => {
    const { type, name, reach, link } = req.body;
    if (!type || !name || !link) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newBoard = {
        type,
        name,
        reach: reach || '100 views',
        link,
        clicks: 0,
        joined: 0,
        completed: false
    };
    boards.push(newBoard);
    res.status(201).json({ success: true, board: newBoard });
});

app.post('/api/click', (req, res) => {
    const { name, link } = req.body;
    const board = boards.find(b => b.name === name && b.link === link);
    
    if (board) {
        board.clicks += 1;
        
        // Milestone and automated payout trigger check
        const targetMatch = board.reach ? board.reach.match(/\d+/) : null;
        const target = targetMatch ? parseInt(targetMatch[0]) : 100;

        if (board.clicks >= target && !board.completed) {
            board.completed = true;
            console.log(`🎉 Milestone reached for ${board.name}! Target of ${target} clicks hit. Ready for automated payout processing.`);
        }

        res.json({ success: true, clicks: board.clicks, completed: board.completed });
    } else {
        res.status(404).json({ error: 'Board not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
