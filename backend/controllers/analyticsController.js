const User = require('../models/User');

// In-memory storage for active users and page views (this will reset when server restarts)
let activeUsers = new Map(); // Changed to Map to store user's last activity timestamp
let pageViews = 0;
let dailyActiveUsers = new Set();
let componentUsage = {
    compiler: { count: 0, users: new Set() },
    interviewPrep: { count: 0, users: new Set() },
    sqlNotes: { count: 0, users: new Set() },
    javascript: { count: 0, users: new Set() },
    fullstack: { count: 0, users: new Set() },
    contests: { count: 0, users: new Set() },
    challenges: { count: 0, users: new Set() }
};

// Function to clean up inactive users
const cleanupInactiveUsers = () => {
    const now = Date.now();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    for (const [userId, lastActivity] of activeUsers.entries()) {
        if (now - lastActivity > inactiveThreshold) {
            activeUsers.delete(userId);
        }
    }
};

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
        // Clean up inactive users before counting
        cleanupInactiveUsers();
        
        // Get total registered users
        const totalUsers = await User.countDocuments();
        console.log('Total users:', totalUsers);

        // Process component usage data
        const componentStats = {};
        for (const [component, data] of Object.entries(componentUsage)) {
            componentStats[component] = {
                totalVisits: data.count,
                uniqueUsers: data.users.size
            };
        }

        const analyticsData = {
            activeUsers: activeUsers.size,
            pageViews: pageViews,
            dailyActiveUsers: dailyActiveUsers.size,
            totalUsers: totalUsers,
            componentStats: componentStats
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
    const component = req.body.component;
    console.log('User ID:', userId, 'Component:', component);
    
    // Update user's last activity timestamp
    activeUsers.set(userId, Date.now());
    console.log('Active users count:', activeUsers.size);
    
    // Track daily active user
    dailyActiveUsers.add(userId);
    console.log('Daily active users count:', dailyActiveUsers.size);
    
    // Increment page views
    pageViews++;
    
    // Track component usage if specified
    if (component && componentUsage[component]) {
        componentUsage[component].count++;
        componentUsage[component].users.add(userId);
        console.log(`${component} usage:`, componentUsage[component]);
    }
    
    // Clean up inactive users
    cleanupInactiveUsers();
    
    console.log('Total page views:', pageViews);
    
    res.status(200).json({ message: 'Activity tracked' });
};

const trackBatch = (req, res) => {
    console.log('Tracking batch analytics...');
    const userId = req.user ? req.user._id : req.ip;
    const events = req.body.events || [];
    
    console.log('User ID:', userId, 'Events count:', events.length);
    
    // Update user's last activity timestamp
    activeUsers.set(userId, Date.now());
    
    // Track daily active user
    dailyActiveUsers.add(userId);
    
    // Process each event in the batch
    events.forEach(event => {
        // Increment page views for each event
        pageViews++;
        
        // Track component usage if specified
        if (event.component && componentUsage[event.component]) {
            componentUsage[event.component].count++;
            componentUsage[event.component].users.add(userId);
        }
    });
    
    // Clean up inactive users
    cleanupInactiveUsers();
    
    console.log('Batch tracking completed. Total page views:', pageViews);
    
    res.status(200).json({ 
        message: 'Batch analytics tracked successfully',
        eventsProcessed: events.length
    });
};

// Clean up inactive users every minute
setInterval(() => {
    cleanupInactiveUsers();
}, 60000);

module.exports = {
    getAnalytics,
    trackPageView,
    trackBatch
};
