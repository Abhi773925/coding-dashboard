import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  Activity, 
  GitCommit,
  Code2,
  Trophy,
  Target,
  Clock,
  Filter,
  BarChart3
} from 'lucide-react';
import { safeDateString, safeParseDate, safeGetYear, safeFromTimestamp, isValidDate } from '../../utils/dateUtils';

const ActivityHeatmap = ({ user }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Check if platform data is available and loaded
  useEffect(() => {
    const hasValidData = user?.platformStats && Object.keys(user.platformStats).length > 0;
    setIsDataLoaded(hasValidData);
  }, [user]);

  const generateHeatmapData = () => {
    const data = {};
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    // Initialize all dates with 0 activity
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = safeDateString(d);
      if (dateStr) {
        data[dateStr] = 0;
      }
    }

    // Add activity data from connected platforms
    if (user?.platformStats) {
      Object.entries(user.platformStats).forEach(([platform, platformData]) => {
        if (selectedPlatform !== 'all' && platform !== selectedPlatform) return;
        
        const stats = platformData.stats;
        if (!stats) return;

        // Process platform-specific activity data
        switch(platform) {
          case 'leetcode':
            if (stats.calendar?.submissionCalendar) {
              try {
                Object.entries(stats.calendar.submissionCalendar).forEach(([timestamp, count]) => {
                  const date = safeFromTimestamp(parseInt(timestamp));
                  const year = safeGetYear(date);
                  if (date && year === selectedYear) {
                    const dateStr = safeDateString(date);
                    if (dateStr && data[dateStr] !== undefined) {
                      data[dateStr] += count;
                    }
                  }
                });
              } catch (error) {
                console.warn('Error processing LeetCode calendar data:', error);
              }
            }
            break;
          case 'github':
            if (stats.contributionCalendar) {
              try {
                Object.entries(stats.contributionCalendar).forEach(([dateStr, count]) => {
                  const date = safeParseDate(dateStr);
                  const year = safeGetYear(date);
                  if (date && year === selectedYear && data[dateStr] !== undefined) {
                    data[dateStr] += count;
                  }
                });
              } catch (error) {
                console.warn('Error processing GitHub contribution data:', error);
              }
            }
            break;
          case 'geeksforgeeks':
            if (stats.monthlyActivity) {
              try {
                Object.values(stats.monthlyActivity).forEach(days => {
                  if (Array.isArray(days)) {
                    days.forEach(({ date, count }) => {
                      const activityDate = safeParseDate(date);
                      const year = safeGetYear(activityDate);
                      if (activityDate && year === selectedYear) {
                        const dateStr = safeDateString(activityDate);
                        if (dateStr && data[dateStr] !== undefined) {
                          data[dateStr] += count;
                        }
                      }
                    });
                  }
                });
              } catch (error) {
                console.warn('Error processing GeeksforGeeks activity data:', error);
              }
            }
            break;
        }
      });
    }

    return data;
  };

  const heatmapData = useMemo(() => {
    return generateHeatmapData();
  }, [user, selectedYear, selectedPlatform, isDataLoaded]);
  
  const getIntensityLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getIntensityColor = (level) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800', // 0 - no activity
      'bg-green-100 dark:bg-green-900/30', // 1 - low activity
      'bg-green-300 dark:bg-green-700/50', // 2 - medium activity
      'bg-green-500 dark:bg-green-600/70', // 3 - high activity
      'bg-green-700 dark:bg-green-500' // 4 - very high activity
    ];
    return colors[level] || colors[0];
  };

  const renderHeatmapGrid = () => {
    const weeks = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    // Find the first Sunday of the year or the start date
    const firstDay = new Date(startDate);
    while (firstDay.getDay() !== 0) {
      firstDay.setDate(firstDay.getDate() - 1);
    }

    let currentDate = new Date(firstDay);
    let weekIndex = 0;

    while (currentDate <= endDate) {
      const week = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = safeDateString(currentDate);
        const count = dateStr ? (heatmapData[dateStr] || 0) : 0;
        const intensity = getIntensityLevel(count);
        
        week.push({
          date: new Date(currentDate),
          dateStr: dateStr || '',
          count,
          intensity,
          isCurrentYear: currentDate.getFullYear() === selectedYear
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push({ week, weekIndex: weekIndex++ });
    }

    return weeks;
  };

  const weeks = renderHeatmapGrid();
  
  // Calculate statistics with memoization and proper data checking
  const { totalActivity, activeDays, currentStreak, longestStreak } = useMemo(() => {
    if (!isDataLoaded || !heatmapData) {
      return { totalActivity: 0, activeDays: 0, currentStreak: 0, longestStreak: 0 };
    }
    
    const total = Object.values(heatmapData).reduce((sum, count) => sum + count, 0);
    const active = Object.values(heatmapData).filter(count => count > 0).length;
    const current = calculateCurrentStreak();
    const longest = calculateLongestStreak();
    
    return { 
      totalActivity: total, 
      activeDays: active, 
      currentStreak: current, 
      longestStreak: longest 
    };
  }, [heatmapData, isDataLoaded, selectedYear]);

  function calculateCurrentStreak() {
    if (!heatmapData || Object.keys(heatmapData).length === 0) {
      return 0;
    }
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    // Start from today and go backwards
    while (currentDate.getFullYear() === selectedYear) {
      const dateStr = safeDateString(currentDate);
      const activityCount = dateStr ? (heatmapData[dateStr] || 0) : 0;
      
      if (activityCount > 0) {
        streak++;
      } else if (streak > 0) {
        // Break on first gap after activity found
        break;
      }
      // If no activity yet and streak is 0, continue looking backwards
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  function calculateLongestStreak() {
    let maxStreak = 0;
    let currentStreak = 0;
    
    try {
      Object.entries(heatmapData)
        .sort(([a], [b]) => {
          const dateA = safeParseDate(a);
          const dateB = safeParseDate(b);
          if (!dateA || !dateB) return 0;
          return dateA - dateB;
        })
        .forEach(([date, count]) => {
          if (count > 0) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });
    } catch (error) {
      console.warn('Error calculating longest streak:', error);
    }
    
    return maxStreak;
  }

  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'leetcode', name: 'LeetCode' },
    { id: 'github', name: 'GitHub' },
    { id: 'geeksforgeeks', name: 'GeeksforGeeks' }
  ].filter(platform => 
    platform.id === 'all' || user?.platformStats?.[platform.id]
  );

  const availableYears = [selectedYear - 1, selectedYear, selectedYear + 1]
    .filter(year => year <= new Date().getFullYear());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Overview</h2>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Activity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalActivity}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeDays}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStreak}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{longestStreak}</p>
            </div>
            <Trophy className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedYear} Activity Heatmap
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Month labels */}
        <div className="flex justify-between mb-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
            <span key={month} className="text-xs text-gray-600 dark:text-gray-400 w-8 text-center">
              {idx % 2 === 0 ? month : ''}
            </span>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex space-x-1 overflow-x-auto">
          {weeks.map(({ week, weekIndex }) => (
            <div key={weekIndex} className="flex flex-col space-y-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm cursor-pointer ${getIntensityColor(day.intensity)} ${
                    !day.isCurrentYear ? 'opacity-30' : ''
                  }`}
                  title={`${day.dateStr}: ${day.count} activities`}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="flex flex-col space-y-1 mt-2">
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, idx) => (
            <span key={idx} className="text-xs text-gray-600 dark:text-gray-400 h-3 leading-3">
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Trends */}
      {totalActivity > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Average daily activity: {(totalActivity / 365).toFixed(1)} activities
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Activity rate: {((activeDays / 365) * 100).toFixed(1)}% of days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
