const User = require('../models/User');

// In-memory storage for active users and page views (this will reset when server restarts)
let activeUsers = new Set();
let pageViews = 0;
let dailyActiveUsers = new Set();

// Reset daily stats at midnight
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        pageViews = 0;
        dailyActiveUsers.clear();
    }
}, 60000); // Check every minute

const getAnalytics = async (req, res) => {
    try {
        // Get total registered users
        const totalUsers = await User.countDocuments();

        const analyticsData = {
            activeUsers: activeUsers.size,
            pageViews: pageViews,
            dailyActiveUsers: dailyActiveUsers.size,
            totalUsers: totalUsers
        };

        res.json(analyticsData);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
};

const trackPageView = (req, res) => {
    const userId = req.user ? req.user._id : req.ip;
    
    // Track active user
    activeUsers.add(userId);
    
    // Track daily active user
    dailyActiveUsers.add(userId);
    
    // Increment page views
    pageViews++;
    
    res.status(200).json({ message: 'Activity tracked' });
};

// Clean up inactive users after 15 minutes
setInterval(() => {
    activeUsers.clear();
}, 900000);

module.exports = {
    getAnalytics,
    trackPageView
};
