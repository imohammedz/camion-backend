const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Create a truck
router.post('/', auth, async (req, res) => {
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

// Read all trucks
router.get('/', auth, async (req, res) => {
  try {
    const trucks = await prisma.truck.findMany({
      include: { fleet: true }, // Populate fleet details
    });

    res.json(trucks);
  } catch (err) {
    console.error('Error fetching trucks:', err);
    res.status(500).json({ error: err.message });
  }
});

// Read a single truck
router.get('/:id', auth, async (req, res) => {
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
router.put('/:id', auth, async (req, res) => {
  try {
    const truck = await prisma.truck.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(truck);
  } catch (err) {
    console.error('Error updating truck:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a truck
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.truck.delete({ where: { id: req.params.id } });

    res.json({ message: 'Truck deleted' });
  } catch (err) {
    console.error('Error deleting truck:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
