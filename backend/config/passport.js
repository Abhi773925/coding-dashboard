const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();

// Verify MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Configure Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "https://zidio-kiun.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google authentication successful. Profile ID:', profile.id);
        
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          console.log('Creating new user with email:', profile.emails[0].value);
          
          // Create new user
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          });
          
          await user.save();
          console.log('New user created successfully with ID:', user._id);
        } else {
          console.log('Existing user found:', user._id);
          
          // Update existing user information if needed
          user.name = profile.displayName;
          user.email = profile.emails[0].value;
          user.profilePicture = profile.photos[0].value;
          await user.save();
        }
        
        return done(null, user);
      } catch (err) {
        console.error('Error in Google authentication strategy:', err);
        return done(err, null);
      }
    }
  )
);

// User serialization - store only user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// User deserialization - retrieve user from database using ID
passport.deserializeUser(async (id, done) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return done(new Error('Invalid user ID'), null);
    }
    
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null);
  }
});