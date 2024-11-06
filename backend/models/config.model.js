const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const configSchema = new Schema({
  steamApiKey: { type: String, required: true },
  steamUserId: { type: String, required: true },
}, {
  timestamps: true,
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;