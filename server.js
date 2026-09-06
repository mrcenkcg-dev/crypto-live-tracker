require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 1. Initialize SQLite Database Memory
const db = new sqlite3.Database('./tracker.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Level 1: Connected to local SQLite database (tracker.db).');
  }
});

// 2. Ensure Database Table Schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS prices (
      coin_id TEXT PRIMARY KEY,
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      price_usd REAL NOT NULL,
      change_24h REAL NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// -------------------------------------------------------------
// LEVEL 2: AUTOMATED BACKGROUND ENGINE & COINGECKO API
// -------------------------------------------------------------

const TARGET_COINS = ['bitcoin', 'ethereum', 'dogecoin', 'solana', 'cardano', 'ripple'];

async function fetchCryptoPrices() {
  try {
    const coinIds = TARGET_COINS.join(',');
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc`
    );

    const stmt = db.prepare(`
      INSERT INTO prices (coin_id, symbol, name, price_usd, change_24h, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(coin_id) DO UPDATE SET
        price_usd = excluded.price_usd,
        change_24h = excluded.change_24h,
        updated_at = CURRENT_TIMESTAMP
    `);

    response.data.forEach((coin) => {
      stmt.run(coin.id, coin.symbol.toUpperCase(), coin.name, coin.current_price, coin.price_change_percentage_24h || 0);
    });

    stmt.finalize();
    console.log(`[${new Date().toLocaleTimeString()}] Level 2 Loop: Updated live crypto prices in database.`);
  } catch (error) {
    console.error('Error fetching prices from CoinGecko:', error.message);
  }
}

// Execute immediately on boot, then run every 3 minutes
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 3 * 60 * 1000);

// Public API Endpoint for Frontend UI
app.get('/api/prices', (req, res) => {
  db.all('SELECT * FROM prices ORDER BY price_usd DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows, last_updated: new Date() });
  });
});

// Dynamic Port Assignment (Works on Local PC and Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
