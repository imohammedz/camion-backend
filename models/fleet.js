const mongoose = require('mongoose');

// Fleet Schema
const FleetSchema = new mongoose.Schema({
  fleet_name: { type: String, required: true },
  fleet_base_location: { type: String },
  //ON_HOLD is something created newly and no trucks added TODO : try to come up with a better name
  operational_status: { type: String, enum: ['fully operational', 'partially operational', 'under maintenance', 'ON_HOLD'], default: 'fully operational' },
  createdAt: { type: Date, default: Date.now }
});

// Virtual for referencing trucks in the fleet
FleetSchema.virtual('trucks', {
  ref: 'Truck',
  localField: '_id',
  foreignField: 'fleet_id',
});

module.exports = mongoose.model('Fleet', FleetSchema);
