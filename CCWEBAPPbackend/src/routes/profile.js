const express = require('express');
const router = express.Router();
const ProfileService = require('../services/profileService');
const { authenticateToken, isOwner } = require('../middleware/auth');
const Profile = require('../models/profile');

// Create profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const profileData = {
      userId: req.user.userId,
      ...req.body
    };

    const profile = await ProfileService.createProfile(profileData);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await ProfileService.getProfile(req.user.userId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Handle OPTIONS request for check-completion
router.options('/check-completion', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://corporatecruise.in');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).end();
});

// Check if profile is completed
router.get('/check-completion', authenticateToken, async (req, res) => {
  console.log('Check completion request received for user:', req.user.userId);
  
  try {
    if (!req.user || !req.user.userId) {
      console.log('No user ID found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Looking up profile for user:', req.user.userId);
    const profile = await Profile.findOne({ userId: req.user.userId });
    console.log('Profile lookup result:', profile ? 'found' : 'not found');
    
    if (!profile) {
      console.log('No profile found, returning false');
      return res.status(200).json({ isCompleted: false });
    }

    console.log('Profile found, returning isCompleted status:', profile.isCompleted);
    return res.status(200).json({ isCompleted: profile.isCompleted });
  } catch (error) {
    console.error('Error in check-completion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile by ID (admin only)
router.get('/:userId', authenticateToken, isOwner, async (req, res) => {
  try {
    const profile = await ProfileService.getProfile(req.params.userId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const profile = await ProfileService.updateProfile(req.user.userId, req.body);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add document
router.post('/documents', authenticateToken, async (req, res) => {
  try {
    const profile = await ProfileService.addDocument(req.user.userId, req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update document
router.put('/documents/:documentId', authenticateToken, async (req, res) => {
  try {
    const profile = await ProfileService.updateDocument(
      req.user.userId,
      req.params.documentId,
      req.body
    );
    res.status(200).json(profile);
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
});

// Delete document
router.delete('/documents/:documentId', authenticateToken, async (req, res) => {
  try {
    const profile = await ProfileService.deleteDocument(
      req.user.userId,
      req.params.documentId
    );
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get onboarding status for admin dashboard
router.get('/onboarding-status/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await ProfileService.getProfile(userId);
    
    res.status(200).json({
      success: true,
      data: {
        isCompleted: profile.isCompleted,
        onboardingProgress: profile.onboardingProgress,
        onboardingSteps: profile.onboardingSteps,
        routeReady: profile.routeReady
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;