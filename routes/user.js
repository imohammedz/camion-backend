// routes/users.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();

// Protected route to get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
