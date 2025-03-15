require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Add this import
const passport = require("passport");
const cookieParser = require("cookie-parser"); // Add this import
require("./config/passport"); // Ensure Passport config is loaded
const userRoutes = require("./routes/userroutes");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskformroutes");
const loginRoutes = require("./routes/loginroutes");
const authRoutes = require("./routes/authroutes");
const notificationRoutes = require('./routes/notificationroutes');

const app = express();

// Trust proxy is important for secure cookies behind services like Render
app.set("trust proxy", 1);

// Connect to MongoDB
connectDB();

// Handle preflight requests
app.options("*", cors());

app.use(cors({
  origin: true, // This allows all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));

// Create MongoDB session store
const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  ttl: 24 * 60 * 60, // Session TTL (1 day)
  autoRemove: 'native',
  touchAfter: 24 * 3600 // Only update the session once per day unless data changes
});


// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Add session debugging middleware in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Is Authenticated:', req.isAuthenticated());
    next();
  });
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'none', // This is important for cross-origin requests
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/Zidio/", taskRoutes);
app.use("/api/Zidio", loginRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Zidio/users", userRoutes);
app.use('/api/Zidio', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Server error", 
    error: process.env.NODE_ENV === "development" ? err.message : null 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));