const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();


//Post a shift
router.post('/',auth(['FlEET_OWNER']), async (req, res) => {
    try {
        const shift = await prisma.shift.create({
            data: req.body, // Directly using req.body instead of DTO
        });     

        res.status(201).json(shift);
    } catch (err) {
        console.error('Error creating shift:', err);
        res.status(500).json({ error: err.message });
    }
});

//update a shift by Id
router.put('/:id',auth(['FlEET_OWNER']), async (req, res) => {
    try {
        const shift = await prisma.shift.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.json(shift);    
    } catch (err) { 
        console.error('Error updating shift:', err);
        res.status(500).json({ error: err.message });
    }    
});

//delete a shift by Id
router.delete('/:id',auth(['FlEET_OWNER']), async (req, res) => {
    try {
        const shift = await prisma.shift.delete({
            where: { id: req.params.id },
        });     

        res.json(shift);
    } catch (err) {
        console.error('Error deleting shift:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;