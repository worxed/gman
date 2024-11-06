const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { scanSteamGames, updateSteamGames, clearDatabase } = require('./steamScanner');
const Game = require('./models/game.model');
const Config = require('./models/config.model'); // Import the Config model

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gameman', { // Update the database name here
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

// Endpoint to save Steam configuration
app.post('/save-config', async (req, res) => {
  const { steamApiKey, steamUserId } = req.body;

  if (!steamApiKey || !steamUserId) {
    return res.status(400).json({ error: 'Steam API key and Steam user ID are required' });
  }

  try {
    const config = new Config({ steamApiKey, steamUserId });
    await config.save();
    res.json({ message: 'Configuration saved successfully' });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// Endpoint to get Steam configuration
app.get('/get-config', async (req, res) => {
  try {
    const config = await Config.findOne().sort({ createdAt: -1 }); // Get the latest configuration
    res.json(config);
  } catch (error) {
    console.error('Error retrieving configuration:', error);
    res.status(500).json({ error: 'Failed to retrieve configuration' });
  }
});

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

// Endpoint to update existing Steam games
app.post('/update-steam-games', async (req, res) => {
  const { steamApiKey, steamUserId } = req.body;

  if (!steamApiKey || !steamUserId) {
    return res.status(400).json({ error: 'Steam API key and Steam user ID are required' });
  }

  try {
    await updateSteamGames(steamApiKey, steamUserId);
    res.json({ message: 'Steam games updated in the database' });
  } catch (error) {
    console.error('Error during update:', error); // Log any errors during the update
    res.status(500).json({ error: 'Failed to update Steam games' });
  }
});

// Endpoint to clear the database
app.post('/clear-database', async (req, res) => {
  try {
    await clearDatabase();
    res.json({ message: 'Database cleared' });
  } catch (error) {
    console.error('Error clearing database:', error); // Log any errors during the clear
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});