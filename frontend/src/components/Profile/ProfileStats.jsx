import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Star, 
  GitBranch,
  Clock,
  Trophy,
  Zap,
  Users,
  Code2,
  Award,
  Activity
} from 'lucide-react';
import { getThemeColors } from '../../theme/colorTheme';

const ProfileStats = ({ user, detailed = false, isDarkMode = false }) => {
  const themeColors = getThemeColors(isDarkMode);
  const calculateStats = () => {
    if (!user?.platformStats) return null;

    let totalProblems = 0;
    let totalContributions = 0;
    let totalRepositories = 0;
    let totalStars = 0;
    let totalContest = 0;
    let platforms = Object.keys(user.platformStats).length;

    Object.entries(user.platformStats).forEach(([platform, data]) => {
      const stats = data.stats;
      if (!stats) return;

      switch(platform) {
        case 'leetcode':
          totalProblems += stats.problemStats?.totalSolved || 0;
          totalContest += stats.contestStats?.attended || 0;
          break;
        case 'github':
          totalContributions += stats.contributions?.total || 0;
          totalRepositories += stats.stats?.publicRepos || 0;
          totalStars += stats.stats?.totalStars || 0;
          break;
        case 'geeksforgeeks':
          if (stats.problemStats) {
            const gfgProblems = Object.values(stats.problemStats)
              .reduce((sum, val) => sum + parseInt(val || 0), 0);
            totalProblems += gfgProblems;
          }
          break;
      }
    });

    return {
      totalProblems,
      totalContributions,
      totalRepositories,
      totalStars,
      totalContest,
      platforms,
      averageRating: user.platformStats.leetcode?.stats?.contestStats?.rating || 0
    };
  };

  const stats = calculateStats();

  if (!stats) {
    return (
      <div className={`${themeColors.profile.card.bg} ${themeColors.profile.card.border} rounded-xl p-6 ${themeColors.profile.card.shadow} border backdrop-blur-sm`}>
        <h3 className={`text-lg font-semibold ${themeColors.profile.text.primary} mb-4`}>Statistics</h3>
        <div className="text-center py-8">
          <Target className={`w-12 h-12 ${themeColors.profile.text.secondary} mx-auto mb-4`} />
          <p className={`${themeColors.profile.text.secondary}`}>
            Connect platforms to see your statistics
          </p>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Problems Solved',
      value: stats.totalProblems,
      icon: Code2,
      color: 'from-emerald-500 to-green-600',
      bgColor: isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'
    },
    {
      label: 'Repositories',
      value: stats.totalRepositories,
      icon: GitBranch,
      color: 'from-blue-500 to-indigo-600',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
    },
    {
      label: 'Total Stars',
      value: stats.totalStars,
      icon: Star,
      color: 'from-amber-500 to-yellow-600',
      bgColor: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'
    },
    {
      label: 'Contributions',
      value: stats.totalContributions,
      icon: Activity,
      color: 'from-purple-500 to-violet-600',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
    },
    {
      label: 'Contests',
      value: stats.totalContest,
      icon: Trophy,
      color: 'from-orange-500 to-red-600',
      bgColor: isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'
    },
    {
      label: 'Platforms',
      value: stats.platforms,
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      bgColor: isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'
    }
  ];

  if (detailed) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className={`${item.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Platform Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(user.platformStats).map(([platform, data]) => {
              const stats = data.stats;
              if (!stats) return null;

              let platformScore = 0;
              let metrics = [];

              switch(platform) {
                case 'leetcode':
                  platformScore = (stats.problemStats?.totalSolved || 0) * 10;
                  metrics = [
                    { label: 'Problems', value: stats.problemStats?.totalSolved || 0 },
                    { label: 'Rating', value: stats.contestStats?.rating || 'N/A' },
                    { label: 'Badges', value: stats.badges?.length || 0 }
                  ];
                  break;
                case 'github':
                  platformScore = (stats.stats?.publicRepos || 0) * 5 + (stats.stats?.totalStars || 0);
                  metrics = [
                    { label: 'Repos', value: stats.stats?.publicRepos || 0 },
                    { label: 'Stars', value: stats.stats?.totalStars || 0 },
                    { label: 'Followers', value: stats.stats?.followers || 0 }
                  ];
                  break;
                case 'geeksforgeeks':
                  const gfgProblems = Object.values(stats.problemStats || {})
                    .reduce((sum, val) => sum + parseInt(val || 0), 0);
                  platformScore = gfgProblems * 5;
                  metrics = [
                    { label: 'Problems', value: gfgProblems },
                    { label: 'Rank', value: stats.profile?.ranking || 'N/A' },
                    { label: 'Badges', value: stats.badges?.length || 0 }
                  ];
                  break;
              }

              return (
                <div key={platform} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                      {platform}
                    </h4>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                      <p className="font-bold text-lg">{platformScore.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {metrics.map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeColors.profile.card.bg} ${themeColors.profile.card.border} rounded-xl p-6 ${themeColors.profile.card.shadow} border backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${themeColors.profile.text.primary}`}>Quick Stats</h3>
        <TrendingUp className="w-5 h-5 text-emerald-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statItems.slice(0, 4).map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className={`text-center p-4 rounded-lg ${item.bgColor} ${themeColors.profile.card.hover} transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-700`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${item.color} mb-2 shadow-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className={`text-2xl font-bold ${themeColors.profile.text.primary}`}>
                {item.value.toLocaleString()}
              </p>
              <p className={`text-xs ${themeColors.profile.text.secondary}`}>{item.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${themeColors.profile.text.secondary}`}>Overall Progress</span>
          <span className={`text-sm font-medium ${themeColors.profile.text.primary}`}>
            {Math.min(100, Math.round((stats.totalProblems + stats.totalRepositories) / 10))}%
          </span>
        </div>
        <div className={`w-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 shadow-lg"
            style={{ 
              width: `${Math.min(100, Math.round((stats.totalProblems + stats.totalRepositories) / 10))}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
