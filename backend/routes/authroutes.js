const express = require("express");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const router = express.Router();

// Start Google OAuth login flow

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent", // 🔹 Forces Google to ask every time
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Create a JWT token with user data
    const token = jwt.sign(
      { 
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture 
      }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Redirect with token in query parameter
    res.redirect(`https://zidio-manager.vercel.app/auth-callback?token=${token}`);
  }
);

router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});
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
