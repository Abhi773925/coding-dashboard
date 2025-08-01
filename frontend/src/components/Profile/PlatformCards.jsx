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

const PlatformCards = ({ user, onConnectPlatform, detailed = false }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const platforms = [
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Code2,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Algorithmic problem solving',
      url: 'https://leetcode.com'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'from-gray-700 to-gray-900',
      bgColor: 'bg-gray-50 dark:bg-gray-800/50',
      description: 'Code repositories & contributions',
      url: 'https://github.com'
    },
    {
      id: 'geeksforgeeks',
      name: 'GeeksforGeeks',
      icon: Brain,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Programming tutorials & practice',
      url: 'https://geeksforgeeks.org'
    },
    {
      id: 'codechef',
      name: 'CodeChef',
      icon: Trophy,
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      description: 'Competitive programming',
      url: 'https://codechef.com'
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Programming contests',
      url: 'https://codeforces.com'
    },
    {
      id: 'hackerrank',
      name: 'HackerRank',
      icon: Zap,
      color: 'from-green-600 to-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Platforms</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
                className={`${platform.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${platform.color}`}>
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platforms</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
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
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md bg-gradient-to-r ${platform.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{platform.name}</p>
                  {connected && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      @{user.platformStats[platform.id].username}
                    </p>
                  )}
                </div>
              </div>
              
              {connected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <button
                  onClick={() => onConnectPlatform(platform.id)}
                  className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
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
        className="w-full mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
      >
        View All Platforms
      </button>
    </div>
  );
};

export default PlatformCards;
