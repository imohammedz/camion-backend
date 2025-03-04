const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');  // Import Prisma Client
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient(); // Initialize Prisma client

// Create a fleet
router.post('/', auth(['DEFAULT_USER']), async (req, res) => {
  try {
    // Create a new fleet without using transactions
    const newFleet = await prisma.fleet.create({
      data: req.body,
    });

    // Assuming you have a 'userId' in the request (provided via middleware or token)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      throw new Error('User not found');
    }

    // If the user is not already a FLEET_OWNER, update their role
    if (user.role !== 'FLEET_OWNER') {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { role: 'FLEET_OWNER' },
      });
    }

     // Generate a new JWT token with the updated role
     const newToken = jwt.sign(
      { user: { id: req.user.id, role: 'FLEET_OWNER' } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the new token along with the fleet creation response
    res.status(201).json({ fleet: newFleet, token: newToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Read all fleets
router.get('/', auth(['DEFAULT_USER', 'FLEET_OWNER']), async (req, res) => {
  try {
    const fleets = await prisma.fleet.findMany({
      include: {
        trucks: true,  // Include related trucks in the fleet
      },
    });
    res.json(fleets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single fleet
router.get('/:id', auth(['DEFAULT_USER', 'FLEET_OWNER']), async (req, res) => {
  try {
    const fleet = await prisma.fleet.findUnique({
      where: { id: req.params.id },  // Prisma requires the ID to be a number
      include: { trucks: true },  // Include related trucks in the fleet
    });
    if (!fleet) return res.status(404).json({ message: 'Fleet not found' });
    res.json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a fleet
router.put('/:id', auth(['DEFAULT_USER', 'FLEET_OWNER']), async (req, res) => {
  try {
    const fleet = await prisma.fleet.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a fleet
router.delete('/:id', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    await prisma.fleet.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Fleet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trucks by fleet ID
router.get('/:fleetId/trucks', auth(['FLEET_OWNER']), async (req, res) => {
  try {
    const fleet = await prisma.fleet.findUnique({
      where: { id: Number(req.params.fleetId) },
      include: { trucks: true },
    });

    if (!fleet) {
      return res.status(404).json({ message: 'Fleet not found' });
    }

    // If there are no trucks, return an empty array
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
