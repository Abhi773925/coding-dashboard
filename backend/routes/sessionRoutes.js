const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/sessionController');

// Middleware to check if user is authenticated (optional for some routes)
const optionalAuth = (req, res, next) => {
  // Allow both authenticated and guest users
  next();
};

// Create a new collaboration session
router.post('/', optionalAuth, SessionController.createSession);

// Get session by room ID
router.get('/:roomId', optionalAuth, SessionController.getSession);

// Join a session
router.post('/:roomId/join', optionalAuth, SessionController.joinSession);

// Leave a session
router.post('/:roomId/leave', optionalAuth, SessionController.leaveSession);

// Get user's session history
router.get('/', optionalAuth, SessionController.getUserSessions);

// Get user analytics
router.get('/analytics', optionalAuth, SessionController.getUserAnalytics);

// Search public sessions
router.get('/search', SessionController.searchSessions);

// Get global collaboration statistics
router.get('/stats', SessionController.getGlobalStats);

// Admin routes (require authentication)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

// Cleanup inactive sessions (admin only)
router.post('/admin/cleanup', requireAuth, SessionController.cleanupSessions);

module.exports = router;
