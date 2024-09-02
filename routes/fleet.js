const express = require('express');
const router = express.Router();
const Fleet = require('../models/fleet');
const Truck = require('../models/truck');
const auth = require('../middleware/auth');

// Create a fleet
router.post('/', auth, async (req, res) => {
  try {
    const newFleet = new Fleet(req.body);
    const fleet = await newFleet.save();
    res.status(201).json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all fleets
router.get('/', auth, async (req, res) => {
  try {
    const fleets = await Fleet.find().populate('trucks');
    res.json(fleets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single fleet
router.get('/:id', auth, async (req, res) => {
  try {
    const fleet = await Fleet.findById(req.params.id).populate('trucks');
    if (!fleet) return res.status(404).json({ message: 'Fleet not found' });
    res.json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a fleet
router.put('/:id', auth, async (req, res) => {
  try {
    const fleet = await Fleet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fleet) return res.status(404).json({ message: 'Fleet not found' });
    res.json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a fleet
router.delete('/:id', auth, async (req, res) => {
  try {
    const fleet = await Fleet.findByIdAndDelete(req.params.id);
    if (!fleet) return res.status(404).json({ message: 'Fleet not found' });
    res.json({ message: 'Fleet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
