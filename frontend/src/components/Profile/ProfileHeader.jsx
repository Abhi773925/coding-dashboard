import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  Mail, 
  Calendar,
  Trophy,
  Star,
  TrendingUp,
  Target
} from 'lucide-react';
import { fetchWithWakeUp } from '../../utils/serverWakeUp';
import { getThemeColors } from '../../theme/colorTheme';

const ProfileHeader = ({ user, profileMode, setProfileMode, onUpdate, isDarkMode = false }) => {
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });

  const themeColors = getThemeColors(isDarkMode);

  const handleSave = async () => {
    try {
      const response = await fetchWithWakeUp('https://prepmate-kvol.onrender.com/api/profile/update-basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          ...editData
        }),
      });
      
      if (response.ok) {
        setProfileMode('view');
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const calculateOverallScore = () => {
    if (!user?.platformStats) return 0;
    
    let totalScore = 0;
    const platforms = Object.keys(user.platformStats);
    
    platforms.forEach(platform => {
      const stats = user.platformStats[platform]?.stats;
      if (stats) {
        switch(platform) {
          case 'leetcode':
            totalScore += (stats.problemStats?.totalSolved || 0) * 10;
            totalScore += (stats.contestStats?.rating || 0) / 10;
            break;
          case 'github':
            totalScore += (stats.stats?.publicRepos || 0) * 5;
            totalScore += (stats.stats?.totalStars || 0) * 2;
            break;
          case 'geeksforgeeks':
            // Add GFG specific scoring
            totalScore += 100; // Base score for having GFG
            break;
        }
      }
    });
    
    return Math.round(totalScore);
  };

  const getProfileCompleteness = () => {
    const requiredFields = ['name', 'email'];
    const optionalFields = ['bio', 'location', 'website'];
    const platformFields = ['leetcode', 'github', 'geeksforgeeks'];
    
    let completed = 0;
    let total = requiredFields.length + optionalFields.length + platformFields.length;
    
    // Check required fields
    requiredFields.forEach(field => {
      if (user?.[field]) completed++;
    });
    
    // Check optional fields
    optionalFields.forEach(field => {
      if (user?.[field] || editData[field]) completed++;
    });
    
    // Check platform connections
    platformFields.forEach(platform => {
      if (user?.platformStats?.[platform]) completed++;
    });
    
    return Math.round((completed / total) * 100);
  };

  return (
    <motion.div
      className={`${themeColors.profile.header.bg} ${themeColors.profile.header.border} ${themeColors.profile.header.shadow} rounded-2xl border overflow-hidden backdrop-blur-sm`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Cover Background */}
      <div className={`h-32 ${themeColors.profile.header.coverGradient} relative`}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))',
              'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))',
              'linear-gradient(45deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
          {/* Profile Picture */}
          <div className="relative -mt-16 mb-4 sm:mb-0">
            <div className={`w-32 h-32 rounded-full border-4 ${isDarkMode ? 'border-slate-800' : 'border-white'} bg-gradient-to-br from-purple-100 to-blue-100 dark:from-slate-700 dark:to-slate-600 overflow-hidden shadow-lg`}>
              {user?.avatar || user?.picture ? (
                <img 
                  src={user.avatar || user.picture} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className={`w-16 h-16 ${isDarkMode ? 'text-slate-400' : 'text-purple-400'}`} />
                </div>
              )}
            </div>
            {profileMode === 'edit' && (
              <button className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {profileMode === 'view' ? (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className={`text-2xl font-bold ${themeColors.profile.text.primary} truncate`}>
                    {user?.name || 'Anonymous User'}
                  </h1>
                  <button
                    onClick={() => setProfileMode('edit')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
                
                <div className={`mt-2 flex items-center space-x-4 text-sm ${themeColors.profile.text.secondary}`}>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  {(user?.location || editData.location) && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location || editData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                {(user?.bio || editData.bio) && (
                  <p className={`mt-3 ${themeColors.profile.text.secondary} text-sm`}>
                    {user.bio || editData.bio}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className={`text-2xl font-bold bg-transparent border-b-2 border-purple-500 ${themeColors.profile.text.primary} focus:outline-none focus:border-blue-500 transition-colors duration-200`}
                    placeholder="Your name"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setProfileMode('view')}
                      className={`flex items-center space-x-2 px-4 py-2 ${isDarkMode ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded-lg transition-all duration-200 transform hover:scale-105`}
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({...editData, location: e.target.value})}
                    className={`px-3 py-2 border ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-white'} rounded-lg ${themeColors.profile.text.primary} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                    placeholder="Location"
                  />
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => setEditData({...editData, website: e.target.value})}
                    className={`px-3 py-2 border ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-white'} rounded-lg ${themeColors.profile.text.primary} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                    placeholder="Website"
                  />
                </div>

                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-white'} rounded-lg ${themeColors.profile.text.primary} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div
            className={`${themeColors.profile.stats.primary} rounded-lg p-4 text-white shadow-lg`}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Overall Score</p>
                <p className="text-2xl font-bold">{calculateOverallScore()}</p>
              </div>
              <Trophy className="w-8 h-8 opacity-75" />
            </div>
          </motion.div>

          <motion.div
            className={`${themeColors.profile.stats.success} rounded-lg p-4 text-white shadow-lg`}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Profile Complete</p>
                <p className="text-2xl font-bold">{getProfileCompleteness()}%</p>
              </div>
              <Target className="w-8 h-8 opacity-75" />
            </div>
          </motion.div>

          <motion.div
            className={`${themeColors.profile.stats.accent} rounded-lg p-4 text-white shadow-lg`}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Platforms</p>
                <p className="text-2xl font-bold">{Object.keys(user?.platformStats || {}).length}</p>
              </div>
              <Star className="w-8 h-8 opacity-75" />
            </div>
          </motion.div>

          <motion.div
            className={`${themeColors.profile.stats.secondary} rounded-lg p-4 text-white shadow-lg`}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Rank</p>
                <p className="text-2xl font-bold">#1,234</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-75" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
