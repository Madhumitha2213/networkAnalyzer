const mongoose = require('mongoose');

const networkDataSchema = new mongoose.Schema({
  time: { type: String, required: true },
  srcIP: { type: String, required: true },
  destIP: { type: String, required: true },
  protocol: { type: String, required: true },
  length: { type: Number, required: true },
  info: { type: String, required: true },
});

const NetworkData = mongoose.model('NetworkData', networkDataSchema);

module.exports = NetworkData;