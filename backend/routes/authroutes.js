const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth Routes 
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'consent' }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // Successful authentication, redirect to frontend root
    res.redirect(`${process.env.FRONTEND_URL}/?token=${req.sessionID}`);
  }
);

router.get('/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;