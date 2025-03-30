const express = require('express');
const router = express.Router();
const platformController = require('../controllers/profilecontrollers');

// Validate usernames
router.post('/validate-usernames', platformController.validateUsernames);

// Update user's platform profiles
router.put('/update-profile', platformController.updateUserProfile);

// Get user profile with GitHub and LeetCode stats
router.get('/', platformController.getUserProfile);

// Get developer score
router.get('/score', platformController.getDeveloperScore);

module.exports = router;