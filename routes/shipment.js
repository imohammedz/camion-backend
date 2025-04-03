const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// ✅ Create Shipment
router.post('/', auth(['FLEET_OWNER', 'SHIPMENT_OWNER']), async (req, res) => {
  try {
    const {
      customerName,
      contactInfo,
      billingAddress,
      shippingAddress,
      pickupLocation,
      destination,
      shipmentDate,
      deliveryDate,
      packageType,
      quantity,
      dimensions,
      weight,
      serviceType,
      insurance,
      orderId,
    } = req.body;

    const shipment = await prisma.shipment.create({
      data: {
        ownerId: req.user.id,
        customerName,
        contactInfo,
        billingAddress,
        shippingAddress,
        pickupLocation,
        destination,
        shipmentDate: new Date(shipmentDate),
        deliveryDate: new Date(deliveryDate),
        packageType,
        quantity: parseInt(quantity),
        dimensions,
        weight: parseFloat(weight),
        serviceType,
        insurance: insurance === 'true',  // Convert to boolean
        orderId,
      },
    });

    res.status(201).json(shipment);
  } catch (err) {
    console.error('Error creating shipment:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Shipments
router.get('/', auth(['FLEET_OWNER', 'SHIPMENT_OWNER']), async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Single Shipment by ID
router.get('/:id', auth(['FLEET_OWNER', 'SHIPMENT_OWNER']), async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: req.params.id, ownerId: req.user.id },
    });

    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Shipment
router.put('/:id', auth(['FLEET_OWNER', 'SHIPMENT_OWNER']), async (req, res) => {
  try {
    const {
      customerName,
      contactInfo,
      billingAddress,
      shippingAddress,
      pickupLocation,
      destination,
      shipmentDate,
      deliveryDate,
      packageType,
      quantity,
      dimensions,
      weight,
      serviceType,
      insurance,
    } = req.body;

    const shipment = await prisma.shipment.update({
      where: { id: req.params.id, ownerId: req.user.id },
      data: {
        customerName,
        contactInfo,
        billingAddress,
        shippingAddress,
        pickupLocation,
        destination,
        shipmentDate: new Date(shipmentDate),
        deliveryDate: new Date(deliveryDate),
        packageType,
        quantity: parseInt(quantity),
        dimensions,
        weight: parseFloat(weight),
        serviceType,
        insurance: insurance === 'true',
      },
    });

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Shipment
router.delete('/:id', auth(['FLEET_OWNER', 'SHIPMENT_OWNER']), async (req, res) => {
  try {
    await prisma.shipment.delete({
      where: { id: req.params.id, ownerId: req.user.id },
    });

    res.json({ message: 'Shipment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create or Update Profile
router.post('/profile', auth(['SHIPMENT_OWNER']), async (req, res) => {
  try {
    const { name, phoneNumber, baseLocation, role, companyName } = req.body;

    const existingProfile = await prisma.shipmentProfile.findUnique({
      where: { ownerId: req.user.id },
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.shipmentProfile.update({
        where: { ownerId: req.user.id },
        data: { name, phoneNumber, baseLocation, role, companyName },
      });
    } else {
      profile = await prisma.shipmentProfile.create({
        data: {
          ownerId: req.user.id,
          name,
          phoneNumber,
          baseLocation,
          role,
          companyName,
          createdBy: req.user.id, // ✅ Assign creator
        },
      });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Profile by CreatedBy
router.get('/profiles/:createdBy', auth(['SHIPMENT_OWNER', 'FLEET_OWNER']), async (req, res) => {
  try {
    const { createdBy } = req.params;

    const profiles = await prisma.shipmentProfile.findMany({
      where: { createdBy },
      orderBy: { createdAt: 'desc' },
    });

    if (!profiles.length) return res.status(404).json({ message: 'No profiles found' });

    res.json(profiles);
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
