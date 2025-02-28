// routes/auth.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const { canChangeRole, RolesList } = require('../utils/roles');
require('dotenv').config();


const router = express.Router();
const prisma = new PrismaClient();

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
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }]
      }
    });

    if (user) {
      return res.status(400).json({ msg: 'User with this email or phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        role: 'DEFAULT_USER' // Automatically assign role
      }
    });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phoneNumber: identifier }]
      }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ Generic API: Allow authorized users to create other users
router.post('/create-user', [
  auth(['SUPER_USER', 'FLEET_OWNER']),
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phoneNumber', 'Please include a valid phone number').isMobilePhone(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('role', 'Invalid role').isIn(RolesList)  // ✅ Validate against dynamic list
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phoneNumber, password, role } = req.body;

  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }]
      }
    });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Prevent unauthorized role assignment
    if (!canChangeRole(req.user.role, role)) {
      return res.status(403).json({ msg: `You cannot assign role ${role}` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        role
      }
    });

    res.json({ msg: 'User created successfully', user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
