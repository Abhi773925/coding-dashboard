import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  GitCommit, 
  Code2, 
  Trophy, 
  Star,
  TrendingUp,
  Activity,
  Target,
  Zap
} from 'lucide-react';

const RecentActivity = ({ user }) => {
  const generateRecentActivity = () => {
    const activities = [];
    
    if (!user?.platformStats) return activities;

    // Get current date for recent activity simulation
    const now = new Date();
    
    Object.entries(user.platformStats).forEach(([platform, data]) => {
      const stats = data.stats;
      if (!stats) return;

      switch(platform) {
        case 'leetcode':
          // Recent contest participation
          if (stats.contestHistory && stats.contestHistory.length > 0) {
            const recentContests = stats.contestHistory
              .slice(0, 3)
              .map(contest => ({
                id: `leetcode-contest-${contest.title}`,
                type: 'contest',
                platform: 'leetcode',
                title: `Participated in ${contest.title}`,
                description: `Ranked #${contest.ranking} with rating ${contest.rating}`,
                icon: Trophy,
                time: contest.date,
                color: 'text-orange-500'
              }));
            activities.push(...recentContests);
          }

          // Recent problem solving
          const totalSolved = stats.problemStats?.totalSolved || 0;
          if (totalSolved > 0) {
            activities.push({
              id: 'leetcode-problems',
              type: 'achievement',
              platform: 'leetcode',
              title: `Solved ${totalSolved} LeetCode problems`,
              description: 'Keep up the great problem-solving streak!',
              icon: Code2,
              time: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'text-blue-500'
            });
          }

          // Badge achievements
          if (stats.badges && stats.badges.length > 0) {
            const recentBadge = stats.badges[0];
            activities.push({
              id: `leetcode-badge-${recentBadge.id}`,
              type: 'badge',
              platform: 'leetcode',
              title: `Earned "${recentBadge.displayName}" badge`,
              description: 'New achievement unlocked on LeetCode!',
              icon: Star,
              time: recentBadge.creationDate ? 
                new Date(recentBadge.creationDate * 1000).toISOString().split('T')[0] : 
                new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'text-yellow-500'
            });
          }
          break;

        case 'github':
          // Recent contributions
          const totalContributions = stats.contributions?.total || 0;
          if (totalContributions > 0) {
            activities.push({
              id: 'github-contributions',
              type: 'contribution',
              platform: 'github',
              title: `Made ${totalContributions} contributions this year`,
              description: 'Active contributor to open source projects',
              icon: GitCommit,
              time: new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'text-green-500'
            });
          }

          // Repository milestones
          const repos = stats.stats?.publicRepos || 0;
          if (repos > 0) {
            activities.push({
              id: 'github-repos',
              type: 'milestone',
              platform: 'github',
              title: `Published ${repos} public repositories`,
              description: 'Building an impressive portfolio of projects',
              icon: Target,
              time: new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'text-purple-500'
            });
          }

          // Star achievements
          const stars = stats.stats?.totalStars || 0;
          if (stars > 0) {
            activities.push({
              id: 'github-stars',
              type: 'recognition',
              platform: 'github',
              title: `Received ${stars} stars across repositories`,
              description: 'Community recognition for quality code',
              icon: Star,
              time: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'text-yellow-500'
            });
          }
          break;

        case 'geeksforgeeks':
          // Problem solving activities
          const gfgProblems = Object.values(stats.problemStats || {})
            .reduce((sum, val) => sum + parseInt(val || 0), 0);
          
          if (gfgProblems > 0) {
            activities.push({
              id: 'gfg-problems',
              type: 'practice',
              platform: 'geeksforgeeks',
              title: `Solved ${gfgProblems} problems on GeeksforGeeks`,
              description: 'Strengthening DSA fundamentals',
              icon: Code2,
              time: new Date(now.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              color: 'text-green-500'
            });
          }

          // Badge achievements
          if (stats.badges && stats.badges.length > 0) {
            stats.badges.slice(0, 2).forEach((badge, index) => {
              activities.push({
                id: `gfg-badge-${index}`,
                type: 'badge',
                platform: 'geeksforgeeks',
                title: `Earned "${badge.name}" badge`,
                description: badge.description || 'Achievement unlocked on GeeksforGeeks',
                icon: Trophy,
                time: new Date(now.getTime() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                color: 'text-emerald-500'
              });
            });
          }
          break;
      }
    });

    // Add platform connection activities
    const platformCount = Object.keys(user.platformStats).length;
    if (platformCount >= 3) {
      activities.push({
        id: 'platform-connections',
        type: 'milestone',
        platform: 'overall',
        title: `Connected ${platformCount} coding platforms`,
        description: 'Building a comprehensive coding profile',
        icon: Zap,
        time: new Date(now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        color: 'text-indigo-500'
      });
    }

    // Sort by date (most recent first)
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8);
  };

  const activities = generateRecentActivity();

  const getActivityTypeIcon = (type) => {
    const icons = {
      contest: Trophy,
      achievement: Star,
      badge: Star,
      contribution: GitCommit,
      milestone: Target,
      recognition: Star,
      practice: Code2
    };
    return icons[type] || Activity;
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      leetcode: Code2,
      github: GitCommit,
      geeksforgeeks: Target,
      overall: Zap
    };
    return icons[platform] || Activity;
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Start coding to see your recent activity here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const PlatformIcon = getPlatformIcon(activity.platform);
          
          return (
            <motion.div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${
                activity.platform === 'leetcode' ? 'from-orange-500 to-yellow-500' :
                activity.platform === 'github' ? 'from-gray-600 to-gray-800' :
                activity.platform === 'geeksforgeeks' ? 'from-green-500 to-emerald-600' :
                'from-purple-500 to-indigo-600'
              } flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <PlatformIcon className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {activity.platform}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    activity.type === 'contest' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                    activity.type === 'badge' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    activity.type === 'contribution' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    activity.type === 'milestone' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {activity.type}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{getRelativeTime(activity.time)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Stay Active!
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {activities.length} recent activities tracked
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {Object.keys(user?.platformStats || {}).length}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Platforms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
