// config/passport.js - Passport strategy configuration
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "https://zidio-kiun.onrender.com/api/auth/google/callback",
      proxy: true // Important for handling secure callbacks in production
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          });
        } else {
          // Update user information on login
          user.name = profile.displayName;
          user.email = profile.emails[0].value;
          user.profilePicture = profile.photos[0].value;
          await user.save();
        }
        
        return done(null, user);
      } catch (err) {
        console.error("Google auth error:", err);
        return done(err, null);
      }
    }
  )
);

// No need for serialize/deserialize since we're using JWT