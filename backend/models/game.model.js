const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  metadata: { type: Map, of: String },
}, {
  timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;