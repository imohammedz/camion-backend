const mongoose = require('mongoose');

const FleetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  numberOfTrucks: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Fleet', FleetSchema);
