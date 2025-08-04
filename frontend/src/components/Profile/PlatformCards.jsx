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
import { useTheme } from '../context/ThemeContext';

const PlatformCards = ({ user, onConnectPlatform, detailed = false }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const { isDarkMode, colors, schemes } = useTheme();

  const platforms = [
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Code2,
      color: isDarkMode ? 'from-orange-400 to-yellow-400' : 'from-orange-500 to-yellow-500',
      bgGradient: isDarkMode ? 'bg-gradient-to-br from-orange-500/10 to-yellow-500/10' : 'bg-gradient-to-br from-orange-50 to-yellow-50',
      description: 'Algorithmic problem solving',
      url: 'https://leetcode.com',
      accentColor: isDarkMode ? 'text-orange-400' : 'text-orange-600'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: isDarkMode ? 'from-slate-400 to-slate-600' : 'from-slate-600 to-slate-800',
      bgGradient: isDarkMode ? 'bg-gradient-to-br from-slate-500/10 to-slate-700/10' : 'bg-gradient-to-br from-slate-50 to-slate-100',
      description: 'Code repositories & contributions',
      url: 'https://github.com',
      accentColor: isDarkMode ? 'text-slate-400' : 'text-slate-700'
    },
    {
      id: 'geeksforgeeks',
      name: 'GeeksforGeeks',
      icon: Brain,
      color: isDarkMode ? 'from-emerald-400 to-green-500' : 'from-emerald-500 to-green-600',
      bgGradient: isDarkMode ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10' : 'bg-gradient-to-br from-emerald-50 to-green-50',
      description: 'Programming tutorials & practice',
      url: 'https://geeksforgeeks.org',
      accentColor: isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
    },
    {
      id: 'codechef',
      name: 'CodeChef',
      icon: Trophy,
      color: isDarkMode ? 'from-amber-400 to-orange-500' : 'from-amber-500 to-orange-600',
      bgGradient: isDarkMode ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10' : 'bg-gradient-to-br from-amber-50 to-orange-50',
      description: 'Competitive programming',
      url: 'https://codechef.com',
      accentColor: isDarkMode ? 'text-amber-400' : 'text-amber-600'
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      icon: Target,
      color: isDarkMode ? 'from-blue-400 to-indigo-500' : 'from-blue-500 to-indigo-600',
      bgGradient: isDarkMode ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10' : 'bg-gradient-to-br from-blue-50 to-indigo-50',
      description: 'Programming contests',
      url: 'https://codeforces.com',
      accentColor: isDarkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      id: 'hackerrank',
      name: 'HackerRank',
      icon: Zap,
      color: isDarkMode ? 'from-emerald-400 to-teal-500' : 'from-emerald-600 to-teal-600',
      bgGradient: isDarkMode ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10' : 'bg-gradient-to-br from-emerald-50 to-teal-50',
      description: 'Skills assessment & challenges',
      url: 'https://hackerrank.com',
      accentColor: isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
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
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {stats.problemStats?.totalSolved || 0}
                </p>
                <p className={`text-xs ${colors.text.secondary}`}>Problems Solved</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stats.contestStats?.rating || 'N/A'}
                </p>
                <p className={`text-xs ${colors.text.secondary}`}>Contest Rating</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {stats.badges?.length || 0}
                </p>
                <p className={`text-xs ${colors.text.secondary}`}>Badges</p>
              </div>
            </div>
            
            {stats.problemStats?.difficulty && (
              <div className="space-y-2">
                <p className={`text-sm font-medium ${colors.text.primary}`}>Difficulty Breakdown:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>Easy:</span>
                    <span className={`font-medium ${colors.text.primary}`}>{stats.problemStats.difficulty.easy || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}>Medium:</span>
                    <span className={`font-medium ${colors.text.primary}`}>{stats.problemStats.difficulty.medium || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>Hard:</span>
                    <span className={`font-medium ${colors.text.primary}`}>{stats.problemStats.difficulty.hard || 0}</span>
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
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stats.stats?.publicRepos || 0}
                </p>
                <p className={`text-xs ${colors.text.secondary}`}>Repositories</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {stats.stats?.totalStars || 0}
                </p>
                <p className={`text-xs ${colors.text.secondary}`}>Total Stars</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {stats.stats?.followers || 0}
                </p>
                <p className={`text-xs ${colors.text.secondary}`}>Followers</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {stats.contributions?.total || 0}
                </p>
                <p className={`text-xs ${colors.text.secondary}`}>Contributions</p>
              </div>
            </div>

            {stats.languages && (
              <div className="space-y-2">
                <p className={`text-sm font-medium ${colors.text.primary}`}>Top Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {stats.languages.slice(0, 5).map((lang, idx) => (
                    <span 
                      key={idx}
                      className={`px-2 py-1 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'} text-xs rounded-full ${colors.text.secondary}`}
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
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
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
      <div className={`${schemes.pageBackground(isDarkMode)} min-h-screen py-8 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl font-bold ${colors.text.primary}`}>
              <span className={`${schemes.brandGradient(isDarkMode)} bg-clip-text text-transparent`}>
                Platform Connections
              </span>
            </h2>
            <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-slate-800/60' : 'bg-white/80'} ${colors.effects.backdrop} border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
              <span className={`text-sm font-medium ${colors.text.secondary}`}>
                {Object.keys(user?.platformStats || {}).length} of {platforms.length} connected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const connected = isConnected(platform.id);
              
              return (
                <motion.div
                  key={platform.id}
                  className={`${schemes.cardBackground(isDarkMode)} rounded-xl p-6 ${colors.effects.backdrop} border transition-all duration-300 hover:scale-[1.02] shadow-lg ${
                    isDarkMode 
                      ? 'hover:shadow-xl hover:shadow-purple-500/10 border-slate-700/50' 
                      : 'hover:shadow-xl hover:shadow-purple-500/10 border-slate-200/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${platform.color} shadow-lg transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${colors.text.primary}`}>{platform.name}</h3>
                        <p className={`text-xs ${colors.text.secondary}`}>{platform.description}</p>
                      </div>
                    </div>
                    
                    {connected ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Connected</span>
                      </div>
                    ) : (
                      <AlertCircle className={`w-5 h-5 ${colors.text.secondary}`} />
                    )}
                  </div>

                  {connected ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm font-medium ${platform.accentColor}`}>
                          @{user.platformStats[platform.id].username}
                        </span>
                        <a
                          href={`${platform.url}/${user.platformStats[platform.id].username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors duration-300`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      {renderPlatformDetails(platform)}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <button
                        onClick={() => onConnectPlatform(platform.id)}
                        className={`group flex items-center justify-center space-x-2 w-full px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${schemes.primaryButton(isDarkMode)}`}
                        style={{
                          boxShadow: isDarkMode 
                            ? "0 8px 25px rgba(139, 92, 246, 0.3)" 
                            : "0 8px 25px rgba(139, 92, 246, 0.2)",
                        }}
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Connect {platform.name}</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${schemes.cardBackground(isDarkMode)} rounded-xl p-6 ${colors.effects.backdrop} border shadow-lg transition-all duration-700`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${colors.text.primary}`}>Platform Connections</h3>
        <span className={`text-sm ${colors.text.secondary} px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
          {Object.keys(user?.platformStats || {}).length}/{platforms.length} Connected
        </span>
      </div>

      <div className="space-y-4">
        {platforms.slice(0, 3).map((platform) => {
          const Icon = platform.icon;
          const connected = isConnected(platform.id);
          
          return (
            <motion.div
              key={platform.id}
              className={`group flex items-center justify-between p-4 rounded-lg ${platform.bgGradient} border transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode 
                  ? 'border-slate-700/50 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10' 
                  : 'border-slate-200/50 hover:border-indigo-300/50 hover:shadow-lg hover:shadow-indigo-500/10'
              }`}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${platform.color} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`font-semibold ${colors.text.primary} transition-colors duration-300`}>{platform.name}</p>
                  {connected ? (
                    <p className={`text-sm ${colors.text.secondary}`}>
                      @{user.platformStats[platform.id].username}
                    </p>
                  ) : (
                    <p className={`text-xs ${colors.text.secondary}`}>
                      {platform.description}
                    </p>
                  )}
                </div>
              </div>
              
              {connected ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Connected</span>
                </div>
              ) : (
                <button
                  onClick={() => onConnectPlatform(platform.id)}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${schemes.primaryButton(isDarkMode)}`}
                  style={{
                    boxShadow: isDarkMode 
                      ? "0 4px 15px rgba(139, 92, 246, 0.3)" 
                      : "0 4px 15px rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Connect</span>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => {/* Navigate to detailed platforms view */}}
        className={`w-full mt-6 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
          isDarkMode 
            ? 'text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/30 hover:border-indigo-400/50' 
            : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200/50 hover:border-indigo-300/50'
        } ${colors.effects.backdrop}`}
      >
        <div className="flex items-center justify-center space-x-2">
          <span>View All Platforms</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};

export default PlatformCards;
