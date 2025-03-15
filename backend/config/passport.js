const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const session = require('express-session');

require("dotenv").config();

// Ensure these variables exist
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "https://zidio-kiun.onrender.com/api/auth/google/callback";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Missing Google OAuth credentials! Authentication will fail.");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URI,
      proxy: true // Important for hosted environments
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google auth attempt for:", profile.id);
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          console.log("Creating new user for Google ID:", profile.id);
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            isNew: true // Flag for new user
          });
        } else {
          console.log("Existing user found:", user._id);
          // Update profile info on login
          user.name = profile.displayName;
          user.email = profile.emails[0].value;
          user.profilePicture = profile.photos[0].value;
          await user.save();
        }
        
        return done(null, user);
      } catch (err) {
        console.error("Error in Google strategy:", err);
        return done(err, null);
      }
    }
  )
);

// Serialize with error handling
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    console.error("Error serializing user:", err);
    done(err, null);
  }
});

// Deserialize with error handling
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("No user found for ID during deserialization:", id);
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});