const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google OAuth login flow

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent", // 🔹 Forces Google to ask every time
  })
);

// In your authroutes.js
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://zidio-manager.vercel.app",
  }),
  (req, res) => {
    // User is authenticated, send user data in the response
    if (req.user) {
      // Set a param to indicate successful login
      res.redirect("https://zidio-manager.vercel.app?login=success");
    } else {
      res.redirect("https://zidio-manager.vercel.app");
    }
  }
);
// Logout route (✅ Fix for Express 4.0+)
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // ✅ Clears session cookie
      res.redirect("https://zidio-manager.vercel.app");
    });
  });
});

// Get current user session
// Get current user session and send user details
// In your authroutes.js, check the user endpoint
router.get("/user", (req, res) => {
  if (req.user) {
    // Send all necessary user data
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        googleId: req.user.googleId,
        profilePicture: req.user.profilePicture,
        // Add any other fields you need
      },
    });
  } else {
    res.status(401).json({ success: false, user: null });
  }
});
module.exports = router;
