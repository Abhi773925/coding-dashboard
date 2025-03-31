require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

// Models
const User = require('./models/User');
const Contest = require("./models/Contest");
const Question = require('./models/Question');
const Course = require('./models/Course');
const Profile = require('./models/User');
const Streak = require('./models/Streak');

// Routes
const contestRoutes = require("./routes/contestRoutes");
const authRoutes = require('./routes/Authroutes');
const questionRoutes = require('./routes/questionRoutes');
const courseRoutes = require('./routes/courseRoutes');
const profileRoutes = require("./routes/profileroutes");
const streakRoutes = require("./routes/streakRoutes");
const userRoutes = require('./routes/userRoutes');

// Controllers
const fetchSolutions = require("./controllers/youtubeScraper");
const fetchContests = require("./controllers/fetchContests");

const app = express();

// Enhanced Database Connection Function
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    // Configure connection options
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of default 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(error);
    return false;
  }
};

// Middleware Configuration - Apply before session setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Initialize session function - only called after successful DB connection
const initializeSession = () => {
  // Session configuration
  const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // Store sessions for 24 hours (in seconds)
      autoRemove: 'native', // Use MongoDB's TTL index
      crypto: {
        secret: process.env.SESSION_SECRET // Encrypt session data
      }
    }),
    cookie: {
      secure: false, // Set to TRUE only if using HTTPS
      httpOnly: true,
      sameSite: 'lax', // Helps with CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };
  
  app.use(session(sessionConfig));
  
  // Initialize Passport after session
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    passReqToCallback: true
  }, async (request, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth callback received');
      
      // First, try to find user by Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      // If no user found by Google ID, check if email exists
      if (!user) {
        const email = profile.emails[0].value;
        const existingUserWithEmail = await User.findOne({ email: email });
        
        if (existingUserWithEmail) {
          // If user exists with this email but no Google ID, update the user
          existingUserWithEmail.googleId = profile.id;
          if (!existingUserWithEmail.avatar && profile.photos && profile.photos[0]) {
            existingUserWithEmail.avatar = profile.photos[0].value;
          }
          user = await existingUserWithEmail.save();
          console.log('Linked Google account to existing user:', user.name, user.email);
        } else {
          // Create new user as no matching account found
          user = new User({
            googleId: profile.id,
            email: email,
            name: profile.displayName,
            avatar: profile.photos[0]?.value || ''
          });
          await user.save();
          
          // Create default profile for new user
          try {
            await Profile.create({
              user: user._id,
              name: user.name,
              email: user.email
            });
          } catch (profileError) {
            console.log('Profile already exists for user, skipping creation');
          }
          
          console.log('New user created:', user.name, user.email);
        }
      } else {
        console.log('Existing user found by Google ID:', user.name, user.email);
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      return done(error, null);
    }
  }));
  
  // Passport Serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

// Contest Fetching Function
const fetchAndStoreContests = async () => {
  try {
    console.log("🔄 Auto-fetching contests...");
    const contests = await fetchContests();
    for (let contest of contests) {
      await Contest.findOneAndUpdate(
        { title: contest.title, platform: contest.platform },
        { $set: contest },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Successfully stored ${contests.length} contests in database`);
  } catch (error) {
    console.error("❌ Error auto-fetching contests:", error.message);
  }
};

// Scheduling Function
const setupDailyFetchSchedule = () => {
  const calculateTimeUntil10PM = () => {
    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      22, 0, 0
    );

    if (now >= target) {
      target.setDate(target.getDate() + 1);
    }

    return target.getTime() - now.getTime();
  };

  const runDailyFetchJob = () => {
    console.log("⏰ Running scheduled 10 PM data fetch");
    fetchAndStoreContests();
    fetchSolutions();
  };

  const msUntil10PM = calculateTimeUntil10PM();
  const minutesUntil10PM = Math.round(msUntil10PM / 1000 / 60);

  console.log(`📅 Scheduling next contest fetch in ${minutesUntil10PM} minutes (at 10 PM)`);

  const initialTimer = setTimeout(() => {
    runDailyFetchJob();
    setInterval(runDailyFetchJob, 24 * 60 * 60 * 1000);
  }, msUntil10PM);

  return initialTimer;
};

// Initial Data Fetch
const initialDataFetch = async () => {
  try {
    const count = await Contest.countDocuments();

    if (count === 0) {
      console.log("🆕 No contests in database, fetching initial data...");
      await fetchAndStoreContests();
      await fetchSolutions();
    } else {
      console.log(`📊 Database already contains ${count} contests, skipping initial fetch`);
    }
  } catch (error) {
    console.error("❌ Error checking database:", error.message);
  }
};

// Basic Routes
app.get('/', (req, res) => {
  res.send('CodingKaro Backend Server');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'CodingKaro Backend is running',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    authProvider: 'Google OAuth 2.0'
  });
});

// API Routes - set up after session initialization
const setupRoutes = () => {
  app.use("/api/codingkaro/contests", contestRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/codingkaro/questions', questionRoutes);
  app.use("/api/codingkaro/users", profileRoutes);
  app.use('/api/codingkaro/courses', courseRoutes);
  app.use('/api', streakRoutes);
  app.use('/api/users', userRoutes);
};

// Enhanced Error Handling Middleware
app.use((err, req, res, next) => {
  // Log the full error in development
  console.error('Error encountered:', err);
  
  // For OAuth errors, provide more helpful messaging
  if (err.name === 'TokenError') {
    return res.status(400).json({
      message: 'Authentication error',
      details: 'There was a problem with the authentication process. Please try again.',
      error: process.env.NODE_ENV === 'production' ? {} : {
        name: err.name,
        message: err.message
      }
    });
  }
  
  // For general errors
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  });
});

// Server Startup Function with sequential initialization
const startServer = async () => {
  // Connect to database first
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.error("Failed to connect to MongoDB. Server will not start.");
    process.exit(1);
  }
  
  // Initialize session handling and authentication
  initializeSession();
  
  // Set up routes after session initialization
  setupRoutes();
  
  // Schedule tasks
  setupDailyFetchSchedule();
  
  // Fetch initial data if needed
  initialDataFetch();

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 CodingKaro Backend running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔐 Authentication: Google OAuth configured`);
  });

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      mongoose.connection.close();
      process.exit(0);
    });
  });

  return server;
};

// Start Server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app; // Export app for testing