import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/api';
import { safeToISOString } from '../../utils/dateUtils';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    activeUsers: 0,
    pageViews: 0,
    dailyActiveUsers: 0,
    totalUsers: 0,
    componentStats: {
      compiler: { totalVisits: 0, uniqueUsers: 0 },
      interviewPrep: { totalVisits: 0, uniqueUsers: 0 },
      sqlNotes: { totalVisits: 0, uniqueUsers: 0 },
      javascript: { totalVisits: 0, uniqueUsers: 0 },
      fullstack: { totalVisits: 0, uniqueUsers: 0 },
      contests: { totalVisits: 0, uniqueUsers: 0 },
      challenges: { totalVisits: 0, uniqueUsers: 0 }
    }
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Use config for API URL
        const response = await axios.get(`${config.API_URL}/analytics`, {
          timeout: 8000 // Longer timeout for data-heavy requests
        });
        setAnalyticsData(response.data);
        
        // Track page view - non-blocking with try-catch
        try {
          await axios.post(`${config.BACKEND_URL}/api/analytics/track`, {
            component: 'Analytics',
            timestamp: safeToISOString(new Date())
          }, { 
            timeout: 10000,
            withCredentials: true 
          });
        } catch (trackError) {
          console.warn('Error tracking analytics page view:', trackError.message);
          // Continue without throwing - this is non-critical
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // If we have cached data, use it as a fallback
        const cachedAnalytics = localStorage.getItem('cachedAnalytics');
        if (cachedAnalytics) {
          try {
            setAnalyticsData(JSON.parse(cachedAnalytics));
          } catch (parseError) {
            console.error('Error parsing cached analytics:', parseError);
          }
        }
      }
    };

    fetchAnalytics();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAnalytics, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-slate-300">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users Card */}
        <div className="bg-blue-50 dark:bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Active Users</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">{analyticsData.activeUsers}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">Currently Online</p>
        </div>

        {/* Page Views Card */}
        <div className="bg-green-50 dark:bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Page Views</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-300">{analyticsData.pageViews}</p>
          <p className="text-sm text-green-600 dark:text-green-400">Total Views Today</p>
        </div>

        {/* Daily Active Users Card */}
        <div className="bg-purple-50 dark:bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Daily Active Users</h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">{analyticsData.dailyActiveUsers}</p>
          <p className="text-sm text-purple-600 dark:text-purple-400">Users Today</p>
        </div>

        {/* Total Users Card */}
        <div className="bg-orange-50 dark:bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">Total Users</h3>
          <p className="text-3xl font-bold text-orange-800 dark:text-orange-300">{analyticsData.totalUsers}</p>
          <p className="text-sm text-orange-600 dark:text-orange-400">Registered Users</p>
        </div>
      </div>

      {/* Component Usage Statistics */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-slate-300">Component Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analyticsData.componentStats || {}).map(([component, stats]) => (
            <div key={component} className="bg-indigo-50 dark:bg-zinc-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                {component.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div className="mt-2">
                <p className="text-indigo-800 dark:text-indigo-300">
                  <span className="font-bold">{stats.totalVisits}</span>
                  <span className="text-sm ml-1">Total Visits</span>
                </p>
                <p className="text-indigo-800 dark:text-indigo-300">
                  <span className="font-bold">{stats.uniqueUsers}</span>
                  <span className="text-sm ml-1">Unique Users</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
