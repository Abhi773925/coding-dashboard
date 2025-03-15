require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
require("./config/passport"); // ✅ Ensure Passport config is loaded
const userRoutes = require("./routes/userroutes");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskformroutes");
const loginRoutes = require("./routes/loginroutes");
const authRoutes = require("./routes/authroutes");
const notificationRoutes = require('./routes/notificationroutes');  
const app = express();

// Connect to MongoDB
connectDB();

// Middleware


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In your server.js or app.js
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://zidio-manager.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Update session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" // Important for cross-site requests
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/Zidio/", taskRoutes);
app.use("/api/Zidio", loginRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Zidio/users", userRoutes);
// app.js or routes.js
app.use('/api/Zidio', notificationRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
