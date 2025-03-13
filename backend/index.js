require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Add this dependency
const passport = require("passport");
const mongoose = require("mongoose");
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

// Improved CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173", 
      "https://zidio-manager.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better session configuration with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60 * 60 * 24, // 1 day in seconds
      autoRemove: 'native'
    }),
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      httpOnly: true, 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware to check authentication status
app.use((req, res, next) => {
  console.log(`Request path: ${req.path}, isAuthenticated: ${req.isAuthenticated()}`);
  next();
});

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/Zidio/", taskRoutes);
app.use("/api/Zidio", loginRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Zidio/users", userRoutes);
app.use('/api/Zidio', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));