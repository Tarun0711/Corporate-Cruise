const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const userRoutes = require('./user');
const routingRoutes = require('./routing');
const profileRoutes = require('./profile');
const packageRoutes = require('./package');
const contactRoutes = require('./contactUs');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Use routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/routing', routingRoutes);
router.use('/profile', profileRoutes);
router.use('/packages', packageRoutes);
router.use('/contact', contactRoutes);

module.exports = router;  