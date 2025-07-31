const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Protected routes (require authentication)
router.post('/', subscriptionController.createSubscription);
router.get('/user', subscriptionController.getUserSubscriptions);
router.get('/mentor', subscriptionController.getMentorSubscriptions);
router.put('/:subscriptionId/status', subscriptionController.updateSubscriptionStatus);
router.delete('/:subscriptionId', subscriptionController.cancelSubscription);
router.post('/:subscriptionId/renew', subscriptionController.renewSubscription);
router.get('/analytics', subscriptionController.getSubscriptionAnalytics);

module.exports = router;
