const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: String,
  developer: String,
  publisher: String,
  releaseDate: Date,
  platforms: [String],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;