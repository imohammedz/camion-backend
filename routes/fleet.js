const express = require('express');
const router = express.Router();
const Fleet = require('../models/fleet');
const Truck = require('../models/truck');
const auth = require('../middleware/auth');
const User = require('../models/user');
const mongoose = require('mongoose');

// Create a fleet
router.post('/', auth(['DEFAULT_USER']), async (req, res) => {
  try {
    // Create a new fleet without using transactions
    const newFleet = new Fleet(req.body);
    const fleet = await newFleet.save();

    // Fetch the user
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }

    // If the user is not already a FLEET_OWNER, update their role
    if (user.role !== 'FLEET_OWNER') {
      user.role = 'FLEET_OWNER';
      await user.save();
    }

    // Send response after successful creation
    res.status(201).json(fleet);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Read all fleets
router.get('/', auth(['DEFAULT_USER', 'FLEET_OWNER']), async (req, res) => {
  try {

    const token = req.header('Authorization');

    if (!token) {
      console.log('❌ No token provided!');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const fleets = await Fleet.find().populate('trucks');
    res.json(fleets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single fleet
router.get('/:id', auth(['DEFAULT_USER', 'FLEET_OWNER']), async (req, res) => {
  try {
    const fleet = await Fleet.findById(req.params.id).populate('trucks');
    if (!fleet) return res.status(404).json({ message: 'Fleet not found' });
    res.json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a fleet
router.put('/:id', auth(['DEFAULT_USER', 'FLEET_OWNER']), async (req, res) => {
  try {
    const fleet = await Fleet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fleet) return res.status(404).json({ message: 'Fleet not found' });
    res.json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a fleet
router.delete('/:id', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    const fleet = await Fleet.findByIdAndDelete(req.params.id);
    if (!fleet) return res.status(404).json({ message: 'Fleet not found' });
    res.json({ message: 'Fleet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trucks by fleet ID
router.get('/:fleetId/trucks', auth(['FLEET_OWNER']), async (req, res) => {
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
