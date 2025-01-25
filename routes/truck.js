const express = require('express');
const router = express.Router();
const Truck = require('../models/truck');
const auth = require('../middleware/auth');

router.use(express.json()); // says that we have to accept json format data.

// Create a truck
router.post('/', auth, async (req, res) => {
  try {
    const newTruck = new Truck(req.body);
    const truck = await newTruck.save();
    res.status(201).json(truck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all trucks
router.get('/', auth, async (req, res) => {
  try {
    const trucks = await Truck.find().populate('fleet_id');
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single truck
router.get('/:id', auth, async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id).populate('fleet_id');
    if (!truck) return res.status(404).json({ message: 'Truck not found' });
    res.json(truck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a truck
router.put('/:id', auth, async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!truck) return res.status(404).json({ message: 'Truck not found' });
    res.json(truck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a truck
router.delete('/:id', auth, async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) return res.status(404).json({ message: 'Truck not found' });
    res.json({ message: 'Truck deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
