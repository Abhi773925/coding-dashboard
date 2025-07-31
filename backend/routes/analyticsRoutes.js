const express = require('express');
const router = express.Router();
const { getAnalytics, trackPageView } = require('../controllers/analyticsController');

// Get analytics data
router.get('/', getAnalytics);

// Track page view and user activity
router.post('/track', trackPageView);

module.exports = router;
