const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
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
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, profilePicture: req.user.profilePicture, email: req.user.email },
      process.env.JWT_SECRET || 'fkdjfkdhfkdhfidkhfkdhfdkfhdkfhieuhckbckdjchfodh',
      { expiresIn: "7d" } // Token expires in 7 days
    );
    
    // Set token in secure HTTP-only cookie - UPDATED sameSite to "none" for cross-domain
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true, // Always use secure for cross-domain cookies
      sameSite: "none", // Changed from "strict" to "none" to allow cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.redirect("https://zidio-manager.vercel.app/");
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      // Updated cookie clearing to match the same settings
      res.clearCookie("connect.sid", { 
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });
      res.redirect("https://zidio-manager.vercel.app/");
    });
  });
});

// Get current user session and send user details
router.get("/user", (req, res) => {
  // First, try to get user from JWT token in cookie
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fkdjfkdhfkdhfidkhfkdhfdkfhdkfhieuhckbckdjchfodh');
      return res.json({
        success: true,
        user: {
          id: decoded.id,
          name: decoded.name,
          profilePicture: decoded.profilePicture,
          email: decoded.email
        }
      });
    }
  } catch (err) {
    console.error("JWT verification error:", err);
  }

  // Fall back to passport session if JWT fails
  if (req.user) {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, profilePicture: req.user.profilePicture, email: req.user.email },
      process.env.JWT_SECRET || 'fkdjfkdhfkdhfidkhfkdhfdkfhdkfhieuhckbckdjchfodh',
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      user: req.user,
      token: token
    });
  } else {
    res.status(401).json({ success: false, user: null });
  }
});

module.exports = router;