// passport-setup.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            role: "viewer", // Default role for new users
          });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// auth-routes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Start Google OAuth login flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent", // Forces Google to ask permission every time
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://zidio-manager.vercel.app/login",
  }),
  (req, res) => {
    try {
      // Generate JWT token with minimal security info for HTTP-only cookie
      const secureToken = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET || 'fkdjfkdhfkdhfidkhfkdhfdkfhdkfhieuhckbckdjchfodh',
        { expiresIn: "7d" }
      );
      
      // Set secure HTTP-only cookie for authentication
      res.cookie("auth_token", secureToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Generate separate token with user data for localStorage
      const userDataToken = jwt.sign(
        {
          userData: {
            _id: req.user._id.toString(),
            googleId: req.user.googleId,
            name: req.user.name,
            email: req.user.email,
            profilePicture: req.user.profilePicture,
            role: req.user.role,
            createdAt: req.user.createdAt,
            __v: req.user.__v
          }
        },
        process.env.JWT_SECRET || 'fkdjfkdhfkdhfidkhfkdhfdkfhdkfhieuhckbckdjchfodh',
        { expiresIn: "7d" }
      );
      
      // Redirect to frontend with user data token as a parameter
      res.redirect(`https://zidio-manager.vercel.app/auth-success?token=${userDataToken}`);
    } catch (error) {
      console.error("Authentication error:", error);
      res.redirect("https://zidio-manager.vercel.app/login?error=authentication_failed");
    }
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      // Clear both cookies with matching settings
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
      res.redirect("https://zidio-manager.vercel.app/login?logout=success");
    });
  });
});

// Get current user session and send user details
router.get("/user", (req, res) => {
  // Try to get user from JWT token in cookie
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fkdjfkdhfkdhfidkhfkdhfdkfhdkfhieuhckbckdjchfodh');
      
      // Get full user details from database
      User.findById(decoded.id)
        .then(user => {
          if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
          
          // Generate user data token for localStorage renewal if needed
          const userDataToken = jwt.sign(
            {
              userData: {
                _id: user._id.toString(),
                googleId: user.googleId,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role,
                createdAt: user.createdAt,
                __v: user.__v
              }
            },
            process.env.JWT_SECRET || 'fkdjfkdhfkdhfidkhfkdhfdkfhdkfhieuhckbckdjchfodh',
            { expiresIn: "7d" }
          );
          
          return res.json({
            success: true,
            userDataToken
          });
        })
        .catch(err => {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, message: "Server error" });
        });
    } else {
      res.status(401).json({ success: false, message: "No authentication token" });
    }
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ success: false, message: "Invalid authentication token" });
  }
});

module.exports = router;