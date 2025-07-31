const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');

// Public routes
router.get('/', mentorController.getAllMentors);
router.get('/search', mentorController.searchMentors);
router.get('/:id', mentorController.getMentorById);

// Protected routes (require authentication)
// These would need authentication middleware
router.post('/profile', mentorController.createMentorProfile);
router.put('/profile', mentorController.updateMentorProfile);
router.get('/dashboard/data', mentorController.getMentorDashboard);

module.exports = router;
