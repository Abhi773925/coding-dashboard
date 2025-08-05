import React, { useState, useEffect } from 'react';
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
  Target,
  Award,
  ExternalLink,
  Shield,
  Github,
  Code2,
  Activity,
  Linkedin,
  Instagram
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchWithWakeUp } from '../../utils/serverWakeUp';

const ProfileCard = ({ user, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    instagram: '',
    github: ''
  });

  // Update editData when user data changes
  useEffect(() => {
    if (user) {
      setEditData({
        name: user?.name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        linkedin: user?.linkedin || '',
        instagram: user?.instagram || '',
        github: user?.github || ''
      });
    }
  }, [user]);

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
        setIsEditing(false);
        onUpdate && onUpdate();
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
            totalScore += 100; // Base score for having GFG
            break;
        }
      }
    });
    
    return Math.round(totalScore);
  };

  const getProfileCompleteness = () => {
    const requiredFields = ['name', 'email'];
    const optionalFields = ['bio', 'location', 'website', 'linkedin', 'instagram', 'github'];
    const platformFields = ['leetcode', 'geeksforgeeks'];
    
    let completed = 0;
    let total = requiredFields.length + optionalFields.length + platformFields.length;
    
    // Check required fields
    requiredFields.forEach(field => {
      if (user?.[field]) completed++;
    });
    
    // Check optional fields
    optionalFields.forEach(field => {
      if (user?.[field]) completed++;
    });
    
    // Check platform connections
    platformFields.forEach(platform => {
      if (user?.platformStats?.[platform]) completed++;
    });
    
    return Math.round((completed / total) * 100);
  };

  const getPlatformRanks = () => {
    const ranks = [];
    if (user?.platformStats) {
      Object.entries(user.platformStats).forEach(([platform, data]) => {
        const stats = data.stats;
        if (stats) {
          switch(platform) {
            case 'leetcode':
              if (stats.contestStats?.ranking) {
                ranks.push({
                  platform: 'LeetCode',
                  rank: stats.contestStats.ranking,
                  icon: Code2,
                  color: 'from-orange-400 to-yellow-500'
                });
              }
              break;
            case 'github':
              if (stats.stats?.followers) {
                ranks.push({
                  platform: 'GitHub',
                  rank: `${stats.stats.followers} followers`,
                  icon: Github,
                  color: 'from-gray-400 to-gray-600'
                });
              }
              break;
            case 'geeksforgeeks':
              if (stats.profile?.ranking) {
                ranks.push({
                  platform: 'GeeksforGeeks',
                  rank: stats.profile.ranking,
                  icon: Trophy,
                  color: 'from-green-400 to-emerald-500'
                });
              }
              break;
          }
        }
      });
    }
    return ranks;
  };

  const connectedPlatforms = user?.platformStats ? Object.keys(user.platformStats).length : 0;
  const overallScore = calculateOverallScore();
  const completeness = getProfileCompleteness();
  const platformRanks = getPlatformRanks();

  return (
    <motion.div
      className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto h-fit ${
        isDarkMode 
          ? 'bg-slate-900/70 border-slate-700/50 shadow-xl' 
          : 'bg-white/90 border-gray-200/50 shadow-lg'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, shadow: isDarkMode ? '0 25px 50px rgba(0,0,0,0.3)' : '0 25px 50px rgba(0,0,0,0.1)' }}
    >
      {/* Cover Background */}
      <div className="h-20 sm:h-24 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative">
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

      <div className="px-3 sm:px-4 pb-3 h-fit sm:pb-4">
        {/* Profile Picture and Basic Info */}
        <div className="relative -mt-10 sm:-mt-12 mb-3 sm:mb-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2 sm:mb-3">
              {user?.avatar || user?.picture ? (
                <img
                  src={user.avatar || user.picture}
                  alt={user?.name || 'Profile'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl border-3 sm:border-4 border-white shadow-lg ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'
                } ${(user?.avatar || user?.picture) ? 'hidden' : 'flex'}`}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {isEditing && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                  <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              )}
            </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } break-words`}
                placeholder="Your Name"
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Bio
              </label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } break-words`}
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Location Input */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Location
              </label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData({...editData, location: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } break-words`}
                placeholder="Your Location"
              />
            </div>

            {/* Website Input */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Website
              </label>
              <input
                type="url"
                value={editData.website}
                onChange={(e) => setEditData({...editData, website: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } break-words`}
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Social Media Inputs */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <Github className="w-3 h-3 inline mr-1" />
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={editData.github}
                  onChange={(e) => setEditData({...editData, github: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } break-words`}
                  placeholder="github-username"
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <Linkedin className="w-3 h-3 inline mr-1" />
                  LinkedIn Username
                </label>
                <input
                  type="text"
                  value={editData.linkedin}
                  onChange={(e) => setEditData({...editData, linkedin: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } break-words`}
                  placeholder="linkedin-username"
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <Instagram className="w-3 h-3 inline mr-1" />
                  Instagram Username
                </label>
                <input
                  type="text"
                  value={editData.instagram}
                  onChange={(e) => setEditData({...editData, instagram: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } break-words`}
                  placeholder="instagram-username"
                />
              </div>
            </div>

            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="group">
            <h2 className={`text-lg sm:text-xl font-bold mb-1 break-words ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {user?.name || 'Your Name'}
            </h2>
            <p className={`text-xs sm:text-sm mb-2 sm:mb-3 break-words ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              @{user?.email?.split('@')[0] || 'username'}
            </p>
            
            {/* Bio Section - Moved here below name */}
            {user?.bio && (
              <div className="mb-3 sm:mb-4">
                <p className={`text-xs sm:text-sm leading-relaxed break-words ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {user.bio}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setIsEditing(true)}
              className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Get PrepMate Card Button */}
        <motion.button
          className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 hover:from-orange-600 hover:to-orange-700 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Get your PrepMate Card
        </motion.button>
      </div>

      {/* Contact Information */}
      <div className="px-3 sm:px-4 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        {user?.email && (
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Mail className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <span className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {user.email}
            </span>
          </div>
        )}
        
        {user?.location && (
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <span className={`text-xs sm:text-sm break-words ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {user.location}
            </span>
          </div>
        )}

        {user?.website && !isEditing && (
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <ExternalLink className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <a 
              href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-xs sm:text-sm hover:underline truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              {user.website}
            </a>
          </div>
        )}
      </div>

      {/* Social Media Links Section */}
      {(user?.github || user?.linkedin || user?.instagram) && !isEditing && (
        <div className="px-3 sm:px-4 mb-4 sm:mb-6">
          <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Social Links
          </h3>
          <div className="flex items-center space-x-3 sm:space-x-4 justify-center">
            {user?.github && (
              <motion.a
                href={`https://github.com/${user.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={`@${user.github} on GitHub`}
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            )}

            {user?.linkedin && (
              <motion.a
                href={`https://linkedin.com/in/${user.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400' 
                    : 'bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={`@${user.linkedin} on LinkedIn`}
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            )}

            {user?.instagram && (
              <motion.a
                href={`https://instagram.com/${user.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 hover:bg-pink-600/20 text-slate-300 hover:text-pink-400' 
                    : 'bg-gray-100 hover:bg-pink-50 text-gray-600 hover:text-pink-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={`@${user.instagram} on Instagram`}
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            )}
          </div>
        </div>
      )}

      
      {/* Platform Ranks */}
      {platformRanks.length > 0 && (
        <div className="px-3 sm:px-4 mb-3 sm:mb-4">
          <h3 className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Platform Rankings
          </h3>
          <div className="space-y-1 sm:space-y-1.5">
            {platformRanks.map((rank, index) => {
              const Icon = rank.icon;
              return (
                <div key={index} className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg min-w-0 ${
                  isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50/50'
                }`}>
                  <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                    <div className={`p-1 sm:p-1.5 rounded-lg bg-gradient-to-r flex-shrink-0 ${rank.color}`}>
                      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className={`text-xs font-medium truncate ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {rank.platform}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ml-1.5 sm:ml-2 flex-shrink-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {rank.rank}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

     
    </div>
    </motion.div>
  );
};

export default ProfileCard;
