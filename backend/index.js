// server.js - Main application file
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("dotenv").config();

// Import routes and DB connection
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const taskRoutes = require("./routes/taskformroutes");
const loginRoutes = require("./routes/loginroutes");
const userRoutes = require("./routes/userroutes");
const notificationRoutes = require('./routes/notificationroutes');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - critical for cookies to work cross-domain
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://zidio-manager.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());
require("./config/passport"); // Import passport config

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/Zidio/", taskRoutes);
app.use("/api/Zidio", loginRoutes);
app.use("/api/Zidio/users", userRoutes);
app.use('/api/Zidio', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));