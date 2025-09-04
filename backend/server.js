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

const CodeExecutionEngine = require('./codeExecutionEngine');
const CollaborationService = require('./services/collaborationService');

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
const profileroutes = require("./routes/profileroutes");
const streakroutes = require("./routes/streakroutes");
const userRoutes = require('./routes/userroutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const codeRoutes = require('./routes/codeRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const path = require('path');

// Controllers
const fetchSolutions = require("./controllers/youtubeScraper");
const fetchContests = require("./controllers/fetchContests");

const app = express();

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize code execution engine
const codeExecutionEngine = new CodeExecutionEngine();

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

// Enhanced CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://www.prepmate.site", 
      "http://172.20.10.3:5173",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // Allow for development, change to false in production if needed
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: true
}));

// Implement a health check ping route that DB can use to stay active
app.get('/api/internal/ping', (req, res) => {
  res.status(200).send('pong');
});

// Initialize session function - only called after successful DB connection
const initializeSession = () => {
  // Session configuration with better settings for development
  const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'local-dev-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // Store sessions for 24 hours (in seconds)
      autoRemove: 'native',
      crypto: {
        secret: process.env.SESSION_SECRET || 'local-dev-secret'
      }
    }),
    cookie: {
      // Important for local development: only set secure:true if HTTPS
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      // For local development, allow cookies to be sent with cross-origin requests
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: process.env.NODE_ENV === 'production' ? '.prepmate.site' : undefined,
      path: '/'
    },
    name: 'prepmate.sid' // Custom name to avoid using the default connect.sid
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
      console.log('Google OAuth callback received for:', profile.displayName);
      
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
    console.log('Serializing user:', user._id);
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user:', id);
      const user = await User.findById(id);
      console.log('User found:', user ? user.name : 'not found');
      done(null, user);
    } catch (error) {
      console.error('Deserialize error:', error);
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

app.get('/api/health', async (req, res) => {
  try {
    const CollaborationSession = require('./models/CollaborationSession');
    const SessionAnalytics = require('./models/SessionAnalytics');
    
    // Get session statistics
    const activeSessions = await CollaborationSession.countDocuments({ isActive: true });
    const totalSessions = await CollaborationSession.countDocuments();
    const totalAnalytics = await SessionAnalytics.countDocuments();
    
    res.status(200).json({ 
      status: 'ok', 
      message: 'CodingKaro Backend is running',
      timestamp: new Date().toISOString(),
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      authProvider: 'Google OAuth 2.0',
      sessions: {
        active: activeSessions,
        total: totalSessions,
        analyticsRecords: totalAnalytics
      }
    });
  } catch (error) {
    res.status(200).json({ 
      status: 'ok', 
      message: 'CodingKaro Backend is running',
      timestamp: new Date().toISOString(),
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      authProvider: 'Google OAuth 2.0',
      sessions: {
        error: 'Could not fetch session stats'
      }
    });
  }
});

// setupRoutes function with enhanced authentication
const setupRoutes = () => {
  // Auth routes with better logging
  app.get('/api/auth/google', (req, res, next) => {
    console.log('Google auth initiated');
    passport.authenticate('google', { 
      scope: ['profile', 'email'], 
      prompt: 'consent' 
    })(req, res, next);
  });

  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
      failureMessage: true 
    }),
    (req, res) => {
      console.log('OAuth callback successful, user:', req.user?.name);
      console.log('Session ID:', req.sessionID);
      console.log('Is authenticated:', req.isAuthenticated());
      
      // Force session save before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_error`);
        }
        
        // Add session token as query parameter to help client-side detection
        const token = req.sessionID;
        res.redirect(`${process.env.FRONTEND_URL}/?auth=success&token=${token}`);
      });
    }
  );

  app.get('/api/auth/current-user', (req, res) => {
    console.log('Current user check:');
    console.log('Session ID:', req.sessionID);
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('Session passport:', req.session?.passport);
    console.log('User:', req.user?.name);
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);
    
    // First check normal authentication
    if (req.isAuthenticated() && req.user) {
      console.log('User authenticated via session:', req.user.name);
      return res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        googleId: req.user.googleId
      });
    } 
    
    // Fallback: Check if session token is provided in header
    const sessionToken = req.headers['x-session-token'];
    if (sessionToken) {
      console.log('Session token provided in header:', sessionToken);
      
      // Use the callback pattern correctly for sessionStore.get
      req.sessionStore.get(sessionToken, (err, session) => {
        if (err) {
          console.error('Error retrieving session by token:', err);
          return res.status(401).json({ message: 'Not authenticated' });
        }
        
        if (session && session.passport && session.passport.user) {
          const userId = session.passport.user;
          console.log('Found user ID in session:', userId);
          
          // Find user by ID
          const User = require('./models/User');
          User.findById(userId)
            .then(user => {
              if (user) {
                console.log('User authenticated via token header:', user.name);
                // Restore the session
                req.session.passport = { user: userId };
                req.session.save((err) => {
                  if (err) {
                    console.error('Error saving session:', err);
                  }
                  
                  return res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    googleId: user.googleId
                  });
                });
              } else {
                console.log('User not found with ID from session');
                return res.status(401).json({ message: 'User not found' });
              }
            })
            .catch(err => {
              console.error('Error finding user:', err);
              return res.status(500).json({ message: 'Server error' });
            });
        } else {
          console.log('No valid session found for token');
          return res.status(401).json({ message: 'Not authenticated' });
        }
      });
    } else {
      console.log('User not authenticated, no token provided');
      return res.status(401).json({ message: 'Not authenticated' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    console.log('Logout requested for user:', req.user?.name);
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: 'Session destroy failed' });
        }
        
        res.clearCookie('connect.sid');
        console.log('Logout successful');
        res.json({ message: 'Logged out successfully' });
      });
    });
  });

  // Enhanced debug route to check session
  app.get('/api/auth/debug', (req, res) => {
    // Get all sessions for debugging
    const getSessionData = () => {
      if (!req.sessionStore.all) {
        return handleSessionData({});
      }
      
      req.sessionStore.all((err, sessions) => {
        if (err) {
          console.error('Error getting all sessions:', err);
          handleSessionData({});
        } else {
          handleSessionData(sessions || {});
        }
      });
    };
    
    // Handle session data and check token
    const handleSessionData = (allSessions) => {
      const sessionCount = Object.keys(allSessions).length;
      const sessionIds = Object.keys(allSessions);
      
      // Check if the token header would work
      const tokenHeader = req.headers['x-session-token'];
      if (tokenHeader && req.sessionStore.get) {
        req.sessionStore.get(tokenHeader, (err, tokenSession) => {
          if (err) {
            console.error('Error checking token session:', err);
            sendResponse(allSessions, sessionCount, sessionIds, tokenHeader, false);
          } else {
            sendResponse(allSessions, sessionCount, sessionIds, tokenHeader, !!tokenSession);
          }
        });
      } else {
        sendResponse(allSessions, sessionCount, sessionIds, tokenHeader, false);
      }
    };
    
    // Send the final response
    const sendResponse = (allSessions, sessionCount, sessionIds, tokenHeader, tokenValid) => {
      try {
        res.json({
          serverTime: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          cors: {
            origin: req.headers.origin,
            allowedOrigins: ["https://www.prepmate.site", "http://172.20.10.3:5173", "http://localhost:5173", "http://localhost:3000"]
          },
          session: {
            id: req.sessionID,
            name: req.session?.name || 'prepmate.sid',
            isAuthenticated: req.isAuthenticated(),
            active: req.session ? true : false,
            user: req.user ? {
              id: req.user._id,
              name: req.user.name,
              email: req.user.email
            } : null,
            passport: req.session?.passport,
            count: sessionCount,
            ids: sessionIds.slice(0, 5), // Show only first 5 for security
            hasToken: tokenHeader ? true : false,
            tokenValid: tokenValid
          },
          cookies: {
            names: Object.keys(req.cookies || {}),
            values: req.cookies
          },
          headers: {
            cookie: req.headers.cookie,
            'user-agent': req.headers['user-agent'],
            origin: req.headers.origin,
            referer: req.headers.referer,
            'x-session-token': tokenHeader ? 'present' : 'not present'
          }
        });
      } catch (error) {
        console.error('Error sending debug response:', error);
        res.status(500).json({
          error: 'Debug route failed',
          message: error.message
        });
      }
    };
    
    // Start the process
    getSessionData();
  });

  // Add a test route to manually set a session (for debugging)
  app.get('/api/auth/test-session', async (req, res) => {
    try {
      // Find a test user or create one
      let testUser = await User.findOne({ email: 'test@example.com' });
      if (!testUser) {
        testUser = new User({
          email: 'test@example.com',
          name: 'Test User',
          googleId: 'test-google-id'
        });
        await testUser.save();
      }
      
      // Manually log in the user
      req.login(testUser, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Login failed', details: err.message });
        }
        
        res.json({
          message: 'Test session created',
          user: testUser,
          sessionID: req.sessionID,
          isAuthenticated: req.isAuthenticated()
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Test session failed', details: error.message });
    }
  });

  // Other API routes
  app.use("/api/codingkaro/contests", contestRoutes);
  app.use('/api/codingkaro/questions', questionRoutes);
  app.use("/api/codingkaro/users", profileroutes);
  app.use("/api/profile", profileroutes);
  app.use('/api/codingkaro/courses', courseRoutes);
  app.use('/api', streakroutes);
  app.use('/api/users', userRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/code', codeRoutes);
  app.use('/api/collaboration', collaborationRoutes);
  app.use('/api/sessions', sessionRoutes);

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

  // Initialize collaboration service with Socket.IO
  const collaborationService = new CollaborationService(server);
  
  // Setup periodic cleanup for inactive rooms and database sessions
  setInterval(async () => {
    try {
      await collaborationService.cleanupInactiveRooms();
      console.log('Completed periodic collaboration cleanup');
    } catch (error) {
      console.error('Error in periodic cleanup:', error);
    }
  }, 30 * 60 * 1000); // Every 30 minutes

  // Setup daily cleanup for old session data (runs at midnight)
  const scheduleSessionCleanup = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Next midnight
    
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
      // Run cleanup and then set daily interval
      cleanupOldSessions();
      setInterval(cleanupOldSessions, 24 * 60 * 60 * 1000); // Every 24 hours
    }, msUntilMidnight);
  };

  const cleanupOldSessions = async () => {
    try {
      console.log('Running daily session cleanup...');
      
      // The TTL index will automatically remove sessions after 7 days
      // This is just for logging and additional cleanup if needed
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const CollaborationSession = require('./models/CollaborationSession');
      const SessionAnalytics = require('./models/SessionAnalytics');
      
      // Count sessions that would be deleted
      const oldSessionCount = await CollaborationSession.countDocuments({
        lastActivity: { $lt: sevenDaysAgo }
      });
      
      if (oldSessionCount > 0) {
        console.log(`TTL index will clean up ${oldSessionCount} old sessions`);
      }
      
      // Manual cleanup of very old analytics (older than 1 year)
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const oldAnalyticsResult = await SessionAnalytics.deleteMany({
        date: { $lt: oneYearAgo }
      });
      
      if (oldAnalyticsResult.deletedCount > 0) {
        console.log(`Cleaned up ${oldAnalyticsResult.deletedCount} old analytics records`);
      }
      
    } catch (error) {
      console.error('Error in daily session cleanup:', error);
    }
  };

  scheduleSessionCleanup();
  
  // Schedule tasks
  setupDailyFetchSchedule();
  
  // Fetch initial data if needed
  initialDataFetch();

  const PORT = process.env.PORT || 5000;
  const serverInstance = server.listen(PORT, () => {
    console.log(`🚀 CodingKaro Backend running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔐 Authentication: Google OAuth configured`);
    console.log(`🤝 Collaboration: Socket.IO initialized`);
    console.log(`📍 Backend URL: ${process.env.BACKEND_URL}`);
    console.log(`🎨 Frontend URL: ${process.env.FRONTEND_URL}`);
  });
  
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