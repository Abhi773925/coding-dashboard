import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Crown,
  Medal,
  Shield,
  Flame,
  TrendingUp,
  Calendar,
  Code2,
  GitBranch,
  Brain
} from 'lucide-react';

const AchievementShowcase = ({ user, detailed = false }) => {
  const extractAchievements = () => {
    const achievements = [];
    
    if (!user?.platformStats) return achievements;

    Object.entries(user.platformStats).forEach(([platform, data]) => {
      const stats = data.stats;
      if (!stats) return;

      switch(platform) {
        case 'leetcode':
          // LeetCode badges
          if (stats.badges && stats.badges.length > 0) {
            stats.badges.forEach(badge => {
              achievements.push({
                id: `leetcode-${badge.id}`,
                platform: 'leetcode',
                type: 'badge',
                title: badge.displayName,
                description: `Earned on LeetCode`,
                icon: Trophy,
                color: 'from-orange-500 to-yellow-500',
                rarity: 'rare',
                date: badge.creationDate ? new Date(badge.creationDate * 1000).toLocaleDateString() : null,
                image: badge.icon
              });
            });
          }

          // LeetCode milestones
          const totalSolved = stats.problemStats?.totalSolved || 0;
          if (totalSolved >= 1000) {
            achievements.push({
              id: 'leetcode-1000',
              platform: 'leetcode',
              type: 'milestone',
              title: '1000+ Problems',
              description: `Solved ${totalSolved} problems on LeetCode`,
              icon: Crown,
              color: 'from-purple-500 to-pink-500',
              rarity: 'legendary',
              progress: totalSolved
            });
          } else if (totalSolved >= 500) {
            achievements.push({
              id: 'leetcode-500',
              platform: 'leetcode',
              type: 'milestone',
              title: '500+ Problems',
              description: `Solved ${totalSolved} problems on LeetCode`,
              icon: Medal,
              color: 'from-blue-500 to-purple-500',
              rarity: 'epic',
              progress: totalSolved
            });
          } else if (totalSolved >= 100) {
            achievements.push({
              id: 'leetcode-100',
              platform: 'leetcode',
              type: 'milestone',
              title: '100+ Problems',
              description: `Solved ${totalSolved} problems on LeetCode`,
              icon: Trophy,
              color: 'from-green-500 to-blue-500',
              rarity: 'rare',
              progress: totalSolved
            });
          }

          // Contest achievements
          if (stats.contestStats?.rating && stats.contestStats.rating >= 2000) {
            achievements.push({
              id: 'leetcode-expert',
              platform: 'leetcode',
              type: 'rating',
              title: 'Contest Expert',
              description: `Rating: ${stats.contestStats.rating}`,
              icon: Crown,
              color: 'from-red-500 to-orange-500',
              rarity: 'legendary'
            });
          } else if (stats.contestStats?.rating && stats.contestStats.rating >= 1600) {
            achievements.push({
              id: 'leetcode-advanced',
              platform: 'leetcode',
              type: 'rating',
              title: 'Advanced Contestant',
              description: `Rating: ${stats.contestStats.rating}`,
              icon: Shield,
              color: 'from-purple-500 to-red-500',
              rarity: 'epic'
            });
          }
          break;

        case 'github':
          const repos = stats.stats?.publicRepos || 0;
          const stars = stats.stats?.totalStars || 0;
          const followers = stats.stats?.followers || 0;

          // Repository milestones
          if (repos >= 100) {
            achievements.push({
              id: 'github-repos-100',
              platform: 'github',
              type: 'milestone',
              title: '100+ Repositories',
              description: `Created ${repos} public repositories`,
              icon: GitBranch,
              color: 'from-gray-600 to-gray-800',
              rarity: 'epic',
              progress: repos
            });
          } else if (repos >= 50) {
            achievements.push({
              id: 'github-repos-50',
              platform: 'github',
              type: 'milestone',
              title: '50+ Repositories',
              description: `Created ${repos} public repositories`,
              icon: GitBranch,
              color: 'from-gray-500 to-gray-700',
              rarity: 'rare',
              progress: repos
            });
          }

          // Star milestones
          if (stars >= 1000) {
            achievements.push({
              id: 'github-stars-1000',
              platform: 'github',
              type: 'milestone',
              title: '1000+ Stars',
              description: `Earned ${stars} stars across repositories`,
              icon: Star,
              color: 'from-yellow-400 to-orange-500',
              rarity: 'legendary',
              progress: stars
            });
          } else if (stars >= 100) {
            achievements.push({
              id: 'github-stars-100',
              platform: 'github',
              type: 'milestone',
              title: '100+ Stars',
              description: `Earned ${stars} stars across repositories`,
              icon: Star,
              color: 'from-yellow-300 to-yellow-500',
              rarity: 'epic',
              progress: stars
            });
          }

          // Follower milestones
          if (followers >= 1000) {
            achievements.push({
              id: 'github-followers-1000',
              platform: 'github',
              type: 'social',
              title: 'Influencer',
              description: `${followers} followers on GitHub`,
              icon: Crown,
              color: 'from-pink-500 to-purple-500',
              rarity: 'legendary',
              progress: followers
            });
          } else if (followers >= 100) {
            achievements.push({
              id: 'github-followers-100',
              platform: 'github',
              type: 'social',
              title: 'Community Builder',
              description: `${followers} followers on GitHub`,
              icon: Award,
              color: 'from-blue-500 to-purple-500',
              rarity: 'epic',
              progress: followers
            });
          }

          // Contribution streaks
          if (stats.calendar?.streak >= 365) {
            achievements.push({
              id: 'github-year-streak',
              platform: 'github',
              type: 'streak',
              title: 'Year-long Contributor',
              description: `${stats.calendar.streak} day contribution streak`,
              icon: Flame,
              color: 'from-red-500 to-orange-500',
              rarity: 'legendary'
            });
          } else if (stats.calendar?.streak >= 100) {
            achievements.push({
              id: 'github-100-streak',
              platform: 'github',
              type: 'streak',
              title: 'Consistent Contributor',
              description: `${stats.calendar.streak} day contribution streak`,
              icon: Flame,
              color: 'from-orange-500 to-red-500',
              rarity: 'epic'
            });
          }
          break;

        case 'geeksforgeeks':
          // GFG specific achievements
          if (stats.badges && stats.badges.length > 0) {
            stats.badges.forEach((badge, index) => {
              achievements.push({
                id: `gfg-badge-${index}`,
                platform: 'geeksforgeeks',
                type: 'badge',
                title: badge.name,
                description: badge.description || 'Earned on GeeksforGeeks',
                icon: Award,
                color: 'from-green-500 to-emerald-600',
                rarity: 'rare'
              });
            });
          }

          // Problem solving milestones
          const gfgProblems = Object.values(stats.problemStats || {})
            .reduce((sum, val) => sum + parseInt(val || 0), 0);
          
          if (gfgProblems >= 500) {
            achievements.push({
              id: 'gfg-problems-500',
              platform: 'geeksforgeeks',
              type: 'milestone',
              title: 'GFG Problem Master',
              description: `Solved ${gfgProblems} problems`,
              icon: Brain,
              color: 'from-green-600 to-teal-600',
              rarity: 'epic',
              progress: gfgProblems
            });
          }
          break;
      }
    });

    // Add custom achievements based on overall profile
    const totalPlatforms = Object.keys(user.platformStats).length;
    if (totalPlatforms >= 5) {
      achievements.push({
        id: 'multi-platform-master',
        platform: 'overall',
        type: 'special',
        title: 'Multi-Platform Master',
        description: `Connected ${totalPlatforms} coding platforms`,
        icon: Zap,
        color: 'from-purple-600 to-pink-600',
        rarity: 'legendary'
      });
    } else if (totalPlatforms >= 3) {
      achievements.push({
        id: 'platform-explorer',
        platform: 'overall',
        type: 'special',
        title: 'Platform Explorer',
        description: `Connected ${totalPlatforms} coding platforms`,
        icon: Target,
        color: 'from-blue-600 to-purple-600',
        rarity: 'epic'
      });
    }

    return achievements.sort((a, b) => {
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
      return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
    });
  };

  const achievements = extractAchievements();

  const getRarityColor = (rarity) => {
    const colors = {
      legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      epic: 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      rare: 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      common: 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBadge = (rarity) => {
    const badges = {
      legendary: { text: 'Legendary', color: 'bg-yellow-500 text-slate-300' },
      epic: { text: 'Epic', color: 'bg-purple-500 text-slate-300' },
      rare: { text: 'Rare', color: 'bg-blue-500 text-slate-300' },
      common: { text: 'Common', color: 'bg-gray-500 text-slate-300' }
    };
    return badges[rarity] || badges.common;
  };

  if (achievements.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4">Achievements</h3>
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Start solving problems and contributing code to unlock achievements!
          </p>
        </div>
      </div>
    );
  }

  if (detailed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-300">Achievements & Badges</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const rarityStyle = getRarityColor(achievement.rarity);
            const rarityBadge = getRarityBadge(achievement.rarity);

            return (
              <motion.div
                key={achievement.id}
                className={`p-6 rounded-xl border-2 ${rarityStyle} shadow-lg`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${achievement.color}`}>
                    <Icon className="w-6 h-6 text-slate-300" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${rarityBadge.color}`}>
                    {rarityBadge.text}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-500 capitalize">
                    {achievement.platform}
                  </span>
                  {achievement.date && (
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {achievement.date}
                    </span>
                  )}
                </div>

                {achievement.progress && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-900 rounded-full h-1.5">
                      <div 
                        className={`bg-gradient-to-r ${achievement.color} h-1.5 rounded-full`}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {['legendary', 'epic', 'rare', 'common'].map(rarity => {
            const count = achievements.filter(a => a.rarity === rarity).length;
            const rarityBadge = getRarityBadge(rarity);
            
            return (
              <motion.div
                key={rarity}
                className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-lg text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-slate-300 mb-1">
                  {count}
                </div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${rarityBadge.color}`}>
                  {rarityBadge.text}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300">Recent Achievements</h3>
        <Trophy className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {achievements.slice(0, 3).map((achievement, index) => {
          const Icon = achievement.icon;
          const rarityBadge = getRarityBadge(achievement.rarity);

          return (
            <motion.div
              key={achievement.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${achievement.color} flex-shrink-0`}>
                <Icon className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-slate-300 text-sm truncate">
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {achievement.description}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${rarityBadge.color} flex-shrink-0`}>
                {rarityBadge.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => {/* Navigate to detailed achievements view */}}
        className="w-full mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
      >
        View All Achievements ({achievements.length})
      </button>
    </div>
  );
};

export default AchievementShowcase;
