import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Code2, 
  Brain, 
  Trophy, 
  Star, 
  GitBranch,
  Users,
  Calendar,
  TrendingUp,
  ExternalLink,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { getThemeColors } from '../../theme/colorTheme';

const PlatformCards = ({ user, onConnectPlatform, detailed = false, isDarkMode = false }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  
  const themeColors = getThemeColors(isDarkMode);

  const platforms = [
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Code2,
      color: 'from-orange-500 to-yellow-500',
      bgColor: isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50',
      description: 'Algorithmic problem solving',
      url: 'https://leetcode.com'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'from-slate-600 to-slate-800',
      bgColor: isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50',
      description: 'Code repositories & contributions',
      url: 'https://github.com'
    },
    {
      id: 'geeksforgeeks',
      name: 'GeeksforGeeks',
      icon: Brain,
      color: 'from-emerald-500 to-green-600',
      bgColor: isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50',
      description: 'Programming tutorials & practice',
      url: 'https://geeksforgeeks.org'
    },
    {
      id: 'codechef',
      name: 'CodeChef',
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
      bgColor: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50',
      description: 'Competitive programming',
      url: 'https://codechef.com'
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      description: 'Programming contests',
      url: 'https://codeforces.com'
    },
    {
      id: 'hackerrank',
      name: 'HackerRank',
      icon: Zap,
      color: 'from-emerald-600 to-teal-600',
      bgColor: isDarkMode ? 'bg-teal-900/20' : 'bg-teal-50',
      description: 'Skills assessment & challenges',
      url: 'https://hackerrank.com'
    }
  ];

  const isConnected = (platformId) => {
    return user?.platformStats?.[platformId];
  };

  const getPlatformStats = (platformId) => {
    return user?.platformStats?.[platformId]?.stats;
  };

  const renderPlatformDetails = (platform) => {
    const stats = getPlatformStats(platform.id);
    const Icon = platform.icon;

    if (!stats) return null;

    switch (platform.id) {
      case 'leetcode':
        return (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.problemStats?.totalSolved || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Problems Solved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.contestStats?.rating || 'N/A'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Contest Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.badges?.length || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Badges</p>
              </div>
            </div>
            
            {stats.problemStats?.difficulty && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty Breakdown:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-green-600">Easy:</span>
                    <span className="font-medium">{stats.problemStats.difficulty.easy || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Medium:</span>
                    <span className="font-medium">{stats.problemStats.difficulty.medium || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Hard:</span>
                    <span className="font-medium">{stats.problemStats.difficulty.hard || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'github':
        return (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.stats?.publicRepos || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Repositories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.stats?.totalStars || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Stars</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.stats?.followers || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.contributions?.total || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Contributions</p>
              </div>
            </div>

            {stats.languages && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {stats.languages.slice(0, 5).map((lang, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'geeksforgeeks':
        return (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.profile?.ranking || 'N/A'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Institute Rank</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Object.values(stats.problemStats || {}).reduce((sum, val) => sum + parseInt(val || 0), 0)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Problems Solved</p>
              </div>
            </div>
            
            {stats.badges && stats.badges.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Badges:</p>
                <div className="flex flex-wrap gap-1">
                  {stats.badges.slice(0, 3).map((badge, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-xs rounded-full text-green-700 dark:text-green-300"
                    >
                      {badge.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connected successfully
            </p>
          </div>
        );
    }
  };

  if (detailed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${themeColors.profile.text.primary}`}>Connected Platforms</h2>
          <p className={`text-sm ${themeColors.profile.text.secondary} px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full`}>
            {Object.keys(user?.platformStats || {}).length} of {platforms.length} connected
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const connected = isConnected(platform.id);
            
            return (
              <motion.div
                key={platform.id}
                className={`${themeColors.profile.card.bg} ${themeColors.profile.card.border} ${themeColors.profile.card.shadow} ${themeColors.profile.card.hover} rounded-xl p-6 border backdrop-blur-sm transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${platform.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{platform.description}</p>
                    </div>
                  </div>
                  
                  {connected ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {connected ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        @{user.platformStats[platform.id].username}
                      </span>
                      <a
                        href={`${platform.url}/${user.platformStats[platform.id].username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    {renderPlatformDetails(platform)}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <button
                      onClick={() => onConnectPlatform(platform.id)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Connect {platform.name}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeColors.profile.card.bg} ${themeColors.profile.card.border} rounded-xl p-6 ${themeColors.profile.card.shadow} border backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${themeColors.profile.text.primary}`}>Platforms</h3>
        <span className={`text-sm ${themeColors.profile.text.secondary}`}>
          {Object.keys(user?.platformStats || {}).length}/{platforms.length}
        </span>
      </div>

      <div className="space-y-3">
        {platforms.slice(0, 3).map((platform) => {
          const Icon = platform.icon;
          const connected = isConnected(platform.id);
          
          return (
            <motion.div
              key={platform.id}
              className={`flex items-center justify-between p-3 rounded-lg ${platform.bgColor} ${themeColors.profile.card.hover} transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-700`}
              whileHover={{ x: 5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md bg-gradient-to-r ${platform.color} shadow-md`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`font-medium ${themeColors.profile.text.primary}`}>{platform.name}</p>
                  {connected && (
                    <p className={`text-xs ${themeColors.profile.text.secondary}`}>
                      @{user.platformStats[platform.id].username}
                    </p>
                  )}
                </div>
              </div>
              
              {connected ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <button
                  onClick={() => onConnectPlatform(platform.id)}
                  className="p-1 text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 transition-colors transform hover:scale-110"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => {/* Navigate to detailed platforms view */}}
        className={`w-full mt-4 px-4 py-2 text-sm ${themeColors.profile.text.accent} hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200 transform hover:scale-105`}
      >
        View All Platforms
      </button>
    </div>
  );
};

export default PlatformCards;
