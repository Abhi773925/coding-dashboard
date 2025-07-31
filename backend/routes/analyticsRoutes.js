const express = require('express');
const cors = require('cors');
const router = express.Router();
const { getAnalytics, trackPageView } = require('../controllers/analyticsController');

// Dynamic CORS configuration for analytics routes
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://www.prepmate.site',
    'http://localhost:5173',
    'https://coding-dashboard-6lgy.vercel.app'
];

router.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Analytics route - Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Get analytics data
router.get('/', getAnalytics);

// Track page view and user activity
router.post('/track', trackPageView);

module.exports = router;
