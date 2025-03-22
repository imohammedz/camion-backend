const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

//Post a driverShift    
router.post('/',auth(['FLEET_OWNER']), async (req, res) => {
    try {
        const driverShift = await prisma.driverShift.create({
            data: req.body, // Directly using req.body instead of DTO
        });     
        res.status(201).json(driverShift);
    } catch (err) {
        console.error('Error creating driverShift:', err);
        res.status(500).json({ error: err.message });
    }
});

//update a driverShift by Id    
router.put('/:id',auth(['FLEET_OWNER']), async (req, res) => {
    try {
        const driverShift = await prisma.driverShift.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(driverShift);
    } catch (err) {
        console.error('Error updating driverShift:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
