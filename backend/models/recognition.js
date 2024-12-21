const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
  fromUsername: { type: String, required: true },
  toUsername: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recognition', recognitionSchema);
