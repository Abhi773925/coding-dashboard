const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// Protected routes (require authentication)
router.post('/tickets', supportController.createSupportTicket);
router.get('/tickets', supportController.getUserTickets);
router.get('/tickets/:ticketId', supportController.getTicketById);
router.post('/tickets/:ticketId/messages', supportController.addTicketMessage);

// CV Review routes
router.post('/cv-review', supportController.submitCVForReview);
router.get('/cv-analysis/:analysisId', supportController.getCVAnalysis);
router.get('/cv-analyses', supportController.getUserCVAnalyses);

module.exports = router;
