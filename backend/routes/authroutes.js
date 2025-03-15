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

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://zidio-manager.vercel.app/login",
  }),
  (req, res) => {
    res.redirect("https://zidio-manager.vercel.app"); // ✅ Ensure frontend matches this
  }
);

// Logout route (✅ Fix for Express 4.0+)
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // ✅ Clears session cookie
      res.redirect("https://zidio-manager.vercel.app/");
    });
  });
});

// Get current user session
// Get current user session and send user details
router.get("/user", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: req.user, // ✅ Send user details
    });
  } else {
    res.json({ success: false, user: null });
  }
});

module.exports = router;
