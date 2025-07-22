import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    activeUsers: 0,
    pageViews: 0,
    dailyActiveUsers: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('https://coding-dashboard-ngwi.onrender.com/api/analytics');
        setAnalyticsData(response.data);
        // Track page view
        await axios.post('https://coding-dashboard-ngwi.onrender.com/api/analytics/track');
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAnalytics, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users Card */}
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Active Users</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">{analyticsData.activeUsers}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">Currently Online</p>
        </div>

        {/* Page Views Card */}
        <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Page Views</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-300">{analyticsData.pageViews}</p>
          <p className="text-sm text-green-600 dark:text-green-400">Total Views Today</p>
        </div>

        {/* Daily Active Users Card */}
        <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Daily Active Users</h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">{analyticsData.dailyActiveUsers}</p>
          <p className="text-sm text-purple-600 dark:text-purple-400">Users Today</p>
        </div>

        {/* Total Users Card */}
        <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">Total Users</h3>
          <p className="text-3xl font-bold text-orange-800 dark:text-orange-300">{analyticsData.totalUsers}</p>
          <p className="text-sm text-orange-600 dark:text-orange-400">Registered Users</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
