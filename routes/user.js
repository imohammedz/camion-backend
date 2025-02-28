// routes/users.js
const express = require('express');
const auth = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const { canChangeRole, RolesList } = require('../utils/roles');

const router = express.Router();
const prisma = new PrismaClient();

// Protected route to get user profile
router.get('/profile', auth(), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phoneNumber: true, role: true }, // Exclude password
    });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ Generic API to update user role
router.put('/update-role', auth(), async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const requester = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!requester) {
      return res.status(404).json({ msg: 'Requester not found' });
    }

    if (!canChangeRole(requester.role, newRole)) {
      return res.status(403).json({ msg: `You cannot change role to ${newRole}` });
    }

    // ✅ Ensure newRole is in the allowed roles list
    if (!RolesList.includes(newRole)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    res.json({ msg: 'Role updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
