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
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../../theme/colorTheme';

const ProfileStats = ({ user, detailed = false }) => {
  const { isDarkMode } = useTheme();
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
          // Add contest data from new structure
          if (stats.contest?.rating) {
            totalContest += 1;
          }
          break;
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
      color: isDarkMode ? 'from-blue-400 to-cyan-500' : 'from-blue-500 to-cyan-600',
      bgColor: isDarkMode 
        ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20' 
        : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200',
      textColor: isDarkMode ? 'text-blue-300' : 'text-blue-700'
    },
    {
      label: 'Repositories',
      value: stats.totalRepositories,
      icon: GitBranch,
      color: isDarkMode ? 'from-purple-400 to-violet-500' : 'from-purple-500 to-violet-600',
      bgColor: isDarkMode 
        ? 'bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-400/20' 
        : 'bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200',
      textColor: isDarkMode ? 'text-purple-300' : 'text-purple-700'
    },
    {
      label: 'Total Stars',
      value: stats.totalStars,
      icon: Star,
      color: isDarkMode ? 'from-amber-400 to-orange-500' : 'from-amber-500 to-orange-600',
      bgColor: isDarkMode 
        ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/20' 
        : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200',
      textColor: isDarkMode ? 'text-amber-300' : 'text-amber-700'
    },
    {
      label: 'Contributions',
      value: stats.totalContributions,
      icon: Activity,
      color: isDarkMode ? 'from-emerald-400 to-green-500' : 'from-emerald-500 to-green-600',
      bgColor: isDarkMode 
        ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-400/20' 
        : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200',
      textColor: isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
    },
    {
      label: 'Contests',
      value: stats.totalContest,
      icon: Trophy,
      color: isDarkMode ? 'from-pink-400 to-rose-500' : 'from-pink-500 to-rose-600',
      bgColor: isDarkMode 
        ? 'bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-400/20' 
        : 'bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200',
      textColor: isDarkMode ? 'text-pink-300' : 'text-pink-700'
    },
    {
      label: 'Platforms',
      value: stats.platforms,
      icon: Users,
      color: isDarkMode ? 'from-indigo-400 to-purple-500' : 'from-indigo-500 to-purple-600',
      bgColor: isDarkMode 
        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/20' 
        : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200',
      textColor: isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
    }
  ];

  if (detailed) {
    return (
      <div className={`space-y-8 p-6 rounded-xl ${
        isDarkMode 
          ? 'bg-slate-900/50 border border-slate-700/50' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-r from-blue-100 to-purple-100'
          }`}>
            <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
            Performance Analytics
          </h2>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className={`${item.bgColor} rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.textColor || (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                      {item.label}
                    </p>
                    <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg bg-gradient-to-r ${item.color} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Platform Breakdown */}
        <div className={`rounded-xl p-6 ${
          isDarkMode 
            ? 'bg-slate-800/50 border border-slate-700/50' 
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
            Platform Breakdown
          </h3>
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
    <div className={`p-4 rounded-xl backdrop-blur-sm ${
      isDarkMode 
        ? 'bg-slate-900/50 border border-slate-700/50' 
        : 'bg-white/80 border border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg ${
          isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20' : 'bg-gradient-to-r from-emerald-100 to-green-100'
        }`}>
          <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
        </div>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
          Quick Stats
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.slice(0, 4).map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className={`text-center p-3 rounded-lg ${item.bgColor} hover:shadow-md transition-all duration-200`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -1 }}
            >
              <div className={`inline-flex p-1.5 rounded-lg bg-gradient-to-r ${item.color} mb-2 shadow-sm`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.value.toLocaleString()}
              </p>
              <p className={`text-xs ${item.textColor || (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Indicators */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Overall Progress
          </span>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
            {Math.min(100, Math.round((stats.totalProblems + stats.totalRepositories) / 10))}%
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 shadow-sm"
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
