const express = require('express');
const router = express.Router();
const { getAnalytics, trackPageView, trackBatch } = require('../controllers/analyticsController');

// Get analytics data
router.get('/', getAnalytics);

// Track page view and user activity
router.post('/track', trackPageView);

// Track batch analytics (for multiple events)
router.post('/track/batch', trackBatch);

module.exports = router;
