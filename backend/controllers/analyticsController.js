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
        console.log('Fetching analytics data...');
        // Get total registered users
        const totalUsers = await User.countDocuments();
        console.log('Total users:', totalUsers);

        const analyticsData = {
            activeUsers: activeUsers.size,
            pageViews: pageViews,
            dailyActiveUsers: dailyActiveUsers.size,
            totalUsers: totalUsers
        };
        console.log('Analytics data:', analyticsData);

        res.json(analyticsData);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
};

const trackPageView = (req, res) => {
    console.log('Tracking page view...');
    const userId = req.user ? req.user._id : req.ip;
    console.log('User ID:', userId);
    
    // Track active user
    activeUsers.add(userId);
    console.log('Active users count:', activeUsers.size);
    
    // Track daily active user
    dailyActiveUsers.add(userId);
    console.log('Daily active users count:', dailyActiveUsers.size);
    
    // Increment page views
    pageViews++;
    console.log('Total page views:', pageViews);
    
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
