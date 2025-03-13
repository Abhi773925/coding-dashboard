const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google OAuth login flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent", // Forces Google to ask every time
  })
);

// Google OAuth callback router with loginSuccess flag
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://zidio-manager.vercel.app/login",
    failureMessage: true // Enable failure messages
  }),
  (req, res) => {
    // Add loginSuccess flag to help client detect successful login
    res.redirect("https://zidio-manager.vercel.app/?loginSuccess=true");
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Clears session cookie
      res.redirect("https://zidio-manager.vercel.app/login?loggedOut=true");
    });
  });
});

// Get current user session with standardized response
router.get("/user", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    // Format user data consistently
    const userData = {
      id: req.user._id || req.user.id,
      name: req.user.name || req.user.displayName,
      email: req.user.email,
      profilePicture: req.user.profilePicture || req.user.photos?.[0]?.value,
    };
    
    res.json({
      success: true,
      user: userData,
    });
  } else {
    res.status(401).json({ success: false, user: null });
  }
});

module.exports = router;