const express = require('express');
const router = express.Router();
const platformController = require('../controllers/profilecontrollers');

// Validate usernames
router.post('/validate', platformController.validateUsernames);

// Update user's platform profiles
router.post('/update', platformController.updateUserProfile);

// Update basic profile information (name, bio, location, etc.)
router.post('/update-basic', platformController.updateBasicProfile);

// Get user profile with all platform stats
router.get('/user', platformController.getUserProfile);

// Get developer score
router.get('/score', platformController.getDeveloperScore);

// Get public profile by username/email
router.get('/public/:identifier', platformController.getPublicProfile);

// Get profile analytics
router.get('/analytics', platformController.getProfileAnalytics);

module.exports = router;