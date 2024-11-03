const express = require('express');
const app = express();
const port = 3001; // Use a different port than the React app

app.use(express.json());

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/game-manager', { useNewUrlParser: true, useUnifiedTopology: true });

// Define API routes
app.get('/api/games', (req, res) => {
  // Retrieve games from MongoDB
  const games = mongoose.model('Game').find();
  res.json(games);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/api/games', async (req, res) => {
  // Retrieve games from the game finder plugin
  const games = await steamPlugin.getGames();
  // Store games in the database
  const gameModels = games.map((game) => new Game({
    title: game.title,
    developer: game.developer,
    publisher: game.publisher,
    releaseDate: game.releaseDate,
    platforms: game.platforms,
  }));
  await Game.create(gameModels);
  res.json(games);
});