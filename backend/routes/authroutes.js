// authroutes.js - Express routes for authentication
const express = require("express");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

// Use cookie parser middleware for this router
router.use(cookieParser());

// Environment variables with proper fallbacks
const JWT_SECRET = process.env.JWT_SECRET || 'spokspfk39393fmof3k30irfmlf03fk';
const CLIENT_URL = process.env.CLIENT_URL || 'https://zidio-manager.vercel.app';

// Google OAuth login route
router.get("/google", 
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Force Google account selection
    session: false // Don't use sessions, we'll use JWT
  })
);

// Google OAuth callback handler
router.get("/google/callback",
  passport.authenticate("google", { 
    session: false,
    failureRedirect: `${CLIENT_URL}/login?error=auth_failed` 
  }),
  (req, res) => {
    // Create JWT with user data
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

    // Two options for sending the token:
    
    // Option 1: Use HTTP-only cookies (more secure)
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Option 2: Redirect with token in query param (less secure but works across domains)
    res.redirect(`${CLIENT_URL}/auth-callback?token=${token}`);
  }
);

// Token verification endpoint
router.post("/verify-token", (req, res) => {
  // Check for token in request body, auth header, or cookies
  const token = 
    req.body.token || 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
    req.cookies.auth_token;
    
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

// Current user endpoint
router.get("/user", (req, res) => {
  // Get token from Authorization header or cookie
  const token = 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
    req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ success: false, user: null });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, user: null });
  }
});

// Simple logout endpoint
router.get("/logout", (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

module.exports = router;