const mongoose = require('mongoose');

// Truck Schema
const TruckSchema = new mongoose.Schema({
  truck_name: { type: String, required: true },
  registration_number: { type: String, unique: true, required: true },
  manufacturer: { type: String, required: true },
  year_of_manufacture: { type: Number, required: true },
  capacity: { type: Number, required: true },
  dimensions: { type: String },
  fuel_type: { type: String, enum: ['diesel', 'gasoline', 'electric'], required: true },
  mileage: { type: Number },
  engine_type: { type: String },
  status: { type: String, enum: ['available', 'under maintenance', 'in transit'], default: 'available' },
  image_url: { type: String },
  last_service_date: { type: Date },
  next_service_due_date: { type: Date },
  current_location: { type: String },
  gps_installed: { type: Boolean, default: false }, // Track GPS
  fleet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Fleet', required: true },
});

module.exports = mongoose.model('Truck', TruckSchema);
