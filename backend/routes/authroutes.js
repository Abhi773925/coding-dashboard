const express = require("express");
const passport = require("passport");
const router = express.Router();

// Frontend and backend URLs
const FRONTEND_URL = process.env.CLIENT_URL || "https://zidio-manager.vercel.app";
const BACKEND_URL = process.env.BACKEND_URL || "https://zidio-kiun.onrender.com";

// Start Google OAuth login flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent", // Forces Google to ask every time
  })
);

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
// Google OAuth callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: `${FRONTEND_URL}/login`,
//   }),
//   (req, res) => {
//     // Set default role if this is a new user registration
//     if (req.user && req.user.isNew) {
//       req.user.role = "viewer"; // Default role
//       req.user.save();
//     }
    
//     // Redirect with fall-back
//     try {
//       const redirectUrl = req.session.returnTo || FRONTEND_URL;
//       delete req.session.returnTo;
//       res.redirect(redirectUrl);
//     } catch (err) {
//       console.error("Redirect error:", err);
//       res.redirect(FRONTEND_URL);
//     }
//   }
// );
// In your Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`,
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Redirect with token in URL parameter
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  }
);
// Improved logout route
router.get("/logout", (req, res, next) => {
  try {
    req.logout(function (err) {
      if (err) {
        console.error("Logout error:", err);
        return next(err);
      }
      
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("Session destruction error:", sessionErr);
        }
        
        res.clearCookie("connect.sid", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/"
        });
        
        res.redirect(`${FRONTEND_URL}/`);
      });
    });
  } catch (err) {
    console.error("Major logout error:", err);
    res.redirect(`${FRONTEND_URL}/`);
  }
});

// Get current user session with enhanced logging
router.get("/user", (req, res) => {
  console.log("User session check:", req.isAuthenticated());
  console.log("Session data:", req.session);
  
  if (req.isAuthenticated() && req.user) {
    console.log("User authenticated:", req.user._id);
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        role: req.user.role || "viewer",
      },
    });
  } else {
    console.log("No authenticated user found");
    res.json({ success: false, user: null });
  }
});

module.exports = router;