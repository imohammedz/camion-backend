// routes/users.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const { canChangeRole } = require('../utils/roles');

const router = express.Router();

// Protected route to get user profile
router.get('/profile', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ Generic API to update user role 
//TODO : when something is deleted the users role should also be updated accordingly
router.put('/update-role', auth(), async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    let targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let requester = await User.findById(req.user.id);
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

    targetUser.role = newRole;
    await targetUser.save();

    res.json({ msg: 'Role updated successfully', user: targetUser });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
