require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require('cookie-parser'); // Add this import
require("./config/passport");
const userRoutes = require("./routes/userroutes");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskformroutes");
const loginRoutes = require("./routes/loginroutes");
const authRoutes = require("./routes/authroutes");
const notificationRoutes = require('./routes/notificationroutes');  
const app = express();

// Connect to MongoDB
connectDB();

// CORS setup - make sure this comes before routes
app.use(cors({
  origin: "https://zidio-manager.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Explicitly allow methods
}));

// Cookie parser middleware - add this before session
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none", // For cross-origin requests
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/Zidio/", taskRoutes);
app.use("/api/Zidio", loginRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Zidio/users", userRoutes);
app.use('/api/Zidio', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));