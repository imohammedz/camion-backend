// routes/auth.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// User registration route
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('phoneNumber', 'Please include a valid phone number').isMobilePhone()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phoneNumber, password } = req.body;

  try {
    // Check if email or phone number already exists
    let user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (user) {
      return res.status(400).json({ msg: 'User with this email or phone number already exists' });
    }

    // Create a new user
    user = new User({
      name,
      email,
      phoneNumber,
      password
    });

    await user.save();

    // Create a JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User login route
router.post('/login', [
    check('identifier', 'Please include a valid email or phone number').notEmpty(),
    check('password', 'Password is required').exists()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { identifier, password } = req.body;
  
    try {
      // Find user by email or phone number
      let user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Create JWT token
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

  module.exports = router;