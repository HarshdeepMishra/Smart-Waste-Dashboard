const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ecotrack_jwt_secret_2024';
const ALL_STORE_IDS = ['RF001', 'BB002', 'DM003', 'MM004', 'SR005'];

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

// ─── POST /api/auth/signup ──────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'manager',
      assignedStores: ALL_STORE_IDS,
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// ─── POST /api/auth/signin ──────────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ error: 'No account found with this email.' });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });

    user.lastLogin = new Date();
    await user.save();

    return res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ error: 'Sign in failed. Please try again.' });
  }
});

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided.' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
});

module.exports = router;
