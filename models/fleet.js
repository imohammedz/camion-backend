const mongoose = require('mongoose');

// Fleet Schema
const FleetSchema = new mongoose.Schema({
  fleet_name: { type: String, required: true },
  total_trucks: { type: Number, default: 0 },
  fleet_manager: { type: String, required: true },
  fleet_base_location: { type: String },
  total_capacity: { type: Number, default: 0 },
  total_mileage: { type: Number, default: 0 },
  fleet_image_url: { type: String },
  operational_status: { type: String, enum: ['fully operational', 'partially operational', 'under maintenance'], default: 'fully operational' },
  createdAt: { type: Date, default: Date.now },
});

// Virtual for referencing trucks in the fleet
FleetSchema.virtual('trucks', {
  ref: 'Truck',
  localField: '_id',
  foreignField: 'fleet_id',
});

module.exports = mongoose.model('Fleet', FleetSchema);
