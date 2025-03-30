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
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const courseRoutes = require('./routes/courseRoutes');
const profileRoutes = require("./routes/profileroutes");
const streakRoutes = require("./routes/streakRoutes");
const userRoutes = require('./routes/userRoutes');
// Controllers
const fetchSolutions = require("./controllers/youtubeScraper");
const fetchContests = require("./controllers/fetchContests");

const app = express();

// Database Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Call database connection
connectDB();

// Middleware Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0]?.value || ''
      });
      await user.save();

      // Create default profile for new user
      await Profile.create({
        user: user._id,
        name: user.name,
        email: user.email
      });

      console.log('New user created:', user);
    }

    request.session.user = user;
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
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/codingkaro/contests", contestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/codingkaro/questions', questionRoutes);
app.use("/api/codingkaro/users", profileRoutes);
app.use('/api/codingkaro/courses', courseRoutes);
app.use('/api', streakRoutes);
app.use('/api/users', userRoutes);
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Server Startup Function
const startServer = () => {
  setupDailyFetchSchedule();
  initialDataFetch();

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 CodingKaro Backend running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  });

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });

  return server;
};

// Export and Start Server
module.exports = startServer();