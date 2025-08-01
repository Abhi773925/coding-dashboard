require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

// Collaboration imports
const CollaborationServer = require('./socketServer');
const CodeExecutionEngine = require('./codeExecutionEngine');

// Models
const User = require('./models/User');
const Contest = require("./models/Contest");
const Question = require('./models/Question');
const Course = require('./models/Course');
const Profile = require('./models/User');
const Streak = require('./models/Streak');

// Routes
const contestRoutes = require("./routes/contestRoutes");
const questionRoutes = require('./routes/questionRoutes');
const courseRoutes = require('./routes/courseRoutes');
const profileRoutes = require("./routes/profileRoutes");
const streakRoutes = require("./routes/streakRoutes");
const userRoutes = require('./routes/userroutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const codeRoutes = require('./routes/codeRoutes');
const path = require('path');

// Controllers
const fetchSolutions = require("./controllers/youtubeScraper");
const fetchContests = require("./controllers/fetchContests");

const app = express();

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize collaboration features
const codeExecutionEngine = new CodeExecutionEngine();
let collaborationServer;

// Enhanced and corrected MongoDB Connection Function
const connectDB = async () => {
  try {
    console.log("🚀 Attempting to connect to MongoDB...");

    // ✅ Only supported and modern connection options
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Fail if can't connect in 10s
      socketTimeoutMS: 0,              // No socket timeout
      maxPoolSize: 10                  // Maintain up to 10 socket connections
    };

    // Attempt connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);

    // Setup MongoDB disconnect and error events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected! Retrying in 5 seconds...');
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.warn('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    });

    return true;
  } catch (error) {
    console.error(`❌ Initial MongoDB Connection Failed: ${error.message}`);
    console.error(error);
    console.warn('Retrying initial MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
    return false;
  }
};


// Middleware Configuration - Apply before session setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://www.prepmate.site", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Explicitly allow methods
}));


// Implement a health check ping route that DB can use to stay active
app.get('/api/internal/ping', (req, res) => {
  res.status(200).send('pong');
});

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

// Setup keep-alive mechanism to prevent idling
const setupKeepAlive = (server) => {
  // Self-ping every 14 minutes to prevent Heroku/render from idling
  // Most free tier services idle after 15-30 minutes of inactivity
  const interval = 14 * 60 * 1000; // 14 minutes in ms
  
  console.log(`🔄 Setting up keep-alive ping every ${interval/60000} minutes`);
  
  // Setup interval for DB keep-alive ping
  setInterval(() => {
    // Ping the database with a simple query to keep connection alive
    mongoose.connection.db.admin().ping()
      .then(() => console.log('📶 Keep-alive ping sent to MongoDB'))
      .catch(err => console.error('MongoDB ping failed:', err));
      
    // Self-ping HTTP endpoint to keep server active
    http.get(`http://localhost:${process.env.PORT || 5000}/api/internal/ping`, (res) => {
      console.log(`📶 Self-ping status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Self-ping error:', err);
    });
  }, interval);
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
    uptime: process.uptime(), // Add server uptime in seconds
    authProvider: 'Google OAuth 2.0'
  });
});

// setupRoutes function in your server.js or app.js
const setupRoutes = () => {
  // Auth routes
  app.get('/api/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'consent' 
  }));

  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    (req, res) => {
      // Successful authentication, redirect to frontend root
      res.redirect(`${process.env.FRONTEND_URL}/?token=${req.sessionID}`);
    }
  );

  app.get('/api/auth/current-user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      // Check for Authorization header as fallback
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' from header
        // Verify the token (you would need to implement this based on your token mechanism)
        // For session tokens, you'd need to look up the session in your store
        req.sessionStore.get(token, (err, session) => {
          if (err || !session || !session.passport || !session.passport.user) {
            return res.status(401).json({ message: 'Not authenticated' });
          }
          
          // Look up the user
          User.findById(session.passport.user)
            .then(user => {
              if (!user) {
                return res.status(401).json({ message: 'User not found' });
              }
              res.json(user);
            })
            .catch(err => {
              console.error('Error finding user:', err);
              res.status(500).json({ message: 'Server error' });
            });
        });
      } else {
        res.status(401).json({ message: 'Not authenticated' });
      }
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Other API routes
  app.use("/api/codingkaro/contests", contestRoutes);
  app.use('/api/codingkaro/questions', questionRoutes);
  app.use("/api/codingkaro/users", profileRoutes);
  app.use("/api/profile", profileRoutes); // Add direct profile access
  app.use('/api/codingkaro/courses', courseRoutes);
  app.use('/api', streakRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/code', codeRoutes);

  // Collaboration routes
  app.get('/api/collaboration/sessions', (req, res) => {
    if (collaborationServer) {
      res.json({
        success: true,
        sessions: collaborationServer.getActiveSessions(),
        presence: collaborationServer.getUserPresence()
      });
    } else {
      res.status(503).json({ success: false, message: 'Collaboration server not initialized' });
    }
  });

  app.post('/api/code/execute', async (req, res) => {
    try {
      const { code, language, fileName, input, userId } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({
          success: false,
          message: 'Code and language are required'
        });
      }

      const result = await codeExecutionEngine.executeCode(
        code, 
        language, 
        fileName, 
        input, 
        userId || req.user?.id
      );

      res.json({
        success: true,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Execution failed',
        error: error.message
      });
    }
  });

  app.get('/api/code/languages', (req, res) => {
    res.json({
      success: true,
      languages: codeExecutionEngine.getSupportedLanguages()
    });
  });

  app.get('/api/code/stats', (req, res) => {
    res.json({
      success: true,
      stats: codeExecutionEngine.getExecutionStats()
    });
  });
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
  const serverInstance = server.listen(PORT, () => {
    console.log(`🚀 CodingKaro Backend running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔐 Authentication: Google OAuth configured`);
    console.log(`🤝 Collaboration: Socket.IO server initialized`);
  });
  
  // Initialize collaboration server after HTTP server starts
  collaborationServer = new CollaborationServer(server);
  
  // Setup keep-alive mechanism to prevent server and DB from idling
  setupKeepAlive(serverInstance);

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    serverInstance.close(() => {
      console.log('Process terminated');
      mongoose.connection.close();
      process.exit(0);
    });
  });

  return serverInstance;
};

// Start Server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app; // Export app for testing