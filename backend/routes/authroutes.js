const express = require("express");
const passport = require("passport");
const router = express.Router();

// Frontend and backend URLs
const FRONTEND_URL = "https://zidio-manager.vercel.app";
const BACKEND_URL = "https://zidio-kiun.onrender.com";

// Start Google OAuth login flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent", // 🔹 Forces Google to ask every time
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`,
  }),
  (req, res) => {
    // Set default role if this is a new user registration
    if (req.user && req.user.isNew) {
      req.user.role = "viewer"; // Default role
      req.user.save();
    }
    res.redirect(FRONTEND_URL); // ✅ Redirects to production frontend
  }
);

// Logout route (✅ Fix for Express 4.0+)
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // ✅ Clears session cookie
      res.redirect(`${FRONTEND_URL}/`);
    });
  });
});

// Get current user session and send user details
// Get current user session and send user details
router.get("/user", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        role: req.user.role || "viewer",
        // Add any other fields you need
      },
    });
  } else {
    res.json({ success: false, user: null });
  }
});
module.exports = router;