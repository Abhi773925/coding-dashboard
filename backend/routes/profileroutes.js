const express = require('express');
const router = express.Router();
const platformController = require('../controllers/profilecontrollers');

// Validate usernames
router.post('/validate', platformController.validateUsernames);

// Update user's platform profiles
router.post('/update', platformController.updateUserProfile);

// Update basic profile information (name, bio, location, etc.)
router.post('/update-basic', platformController.updateBasicProfile);

// Connect platform
router.post('/connect-platform', platformController.connectPlatform);

// Disconnect platform
router.post('/disconnect-platform', platformController.disconnectPlatform);

// Get user profile with all platform stats
router.get('/user', platformController.getUserProfile);

// Get developer score
router.get('/score', platformController.getDeveloperScore);

// Get public profile by username/email
router.get('/public/:identifier', platformController.getPublicProfile);

// Get profile analytics
router.get('/analytics', platformController.getProfileAnalytics);

// Force refresh cache for a platform
router.post('/refresh-cache', platformController.refreshPlatformCache);

// Get cache status
router.get('/cache-status', platformController.getCacheStatus);

// Debug endpoint for testing platform validation and stats
router.get('/debug/:platform/:username', platformController.debugPlatform);

module.exports = router;