/* eslint-disable no-undef */
const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  originalPath: String,
  processedPath: String,
  voiceOption: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audio', AudioSchema);
