const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { scanSteamGames } = require('./steamScanner');
const Game = require('./models/game.model');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gameman', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Import routes
const gamesRouter = require('./routes/games');

// Use routes
app.use('/games', gamesRouter);

// Endpoint to scan for Steam games
app.post('/scan-steam-games', async (req, res) => {
  const { steamApiKey, steamUserId } = req.body;

  if (!steamApiKey || !steamUserId) {
    return res.status(400).json({ error: 'Steam API key and Steam user ID are required' });
  }

  try {
    await scanSteamGames(steamApiKey, steamUserId);
    res.json({ message: 'Steam games scanned and added to the database' });
  } catch (error) {
    console.error('Error during scan:', error); // Log any errors during the scan
    res.status(500).json({ error: 'Failed to scan Steam games' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});