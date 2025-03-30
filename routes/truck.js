const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();
// Create a truck
router.post('/', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    const truck = await prisma.truck.create({
      data: req.body, // Directly using req.body instead of DTO
    });

    res.status(201).json(truck);
  } catch (err) {
    console.error('Error creating truck:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get trucks by fleet ID
router.get('/:fleetId/trucks', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    const { fleetId } = req.params;

    if (!fleetId) {
      return res.status(400).json({ error: "Fleet ID is required" });
    }

    const fleet = await prisma.fleet.findUnique({
      where: { id: fleetId }, // Ensure fleetId is a valid string
      include: { trucks: true },
    });

    if (!fleet) {
      return res.status(404).json({ error: "Fleet not found" });
    }

    res.json(fleet.trucks);
  } catch (err) {
    console.error("Error fetching trucks:", err);
    res.status(500).json({ error: err.message });
  }
});

// Read a single truck
router.get('/:id', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    const truck = await prisma.truck.findUnique({
      where: { id: req.params.id },
      include: { fleet: true }, // Populate fleet details
    });

    if (!truck) return res.status(404).json({ message: 'Truck not found' });
    res.json(truck);
  } catch (err) {
    console.error('Error fetching truck:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a truck
router.put('/:id', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    const { driver_id, fleet_id, ...truckData } = req.body; // Extract fleet_id

    const updateData = { ...truckData };

    // Handle driver update
    if (driver_id !== undefined) {
      updateData.driver = driver_id ? { connect: { id: driver_id } } : { disconnect: true };
    }

    // Handle fleet update
    if (fleet_id) {
      updateData.fleet = { connect: { id: fleet_id } };
    }

    const truck = await prisma.truck.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(truck);
  } catch (err) {
    console.error('Error updating truck:', err);
    res.status(500).json({ error: err.message });
  }
});



// Delete a truck
router.delete('/:id', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    await prisma.truck.delete({ where: { id: req.params.id } });

    res.json({ message: 'Truck deleted' });
  } catch (err) {
    console.error('Error deleting truck:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
