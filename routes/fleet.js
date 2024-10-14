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

// Get trucks by fleet ID
router.get('/:fleetId/trucks', async (req, res) => {
  try {
    const fleet = await Fleet.findById(req.params.fleetId).populate('trucks'); // Assuming you have a virtual reference to trucks
    
    // Check if the fleet exists and if it has any trucks
    if (!fleet) {
      return res.status(404).json({ message: 'Fleet not found' });
    }

       // If there are no trucks, return null or an empty array
       if (!fleet.trucks || fleet.trucks.length === 0) {
        return res.json([]);  // Change this to 'null' if you prefer that as the response
      }
    
    res.json(fleet.trucks);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
