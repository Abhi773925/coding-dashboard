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

const ProfileCard = ({ user, onUpdate, profileMode, setProfileMode }) => {
  const { isDarkMode } = useTheme();
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    instagram: user?.instagram || '',
    github: user?.github || ''
  });

  // Use profileMode if provided, otherwise fall back to internal state
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isEditing = profileMode ? profileMode === 'edit' : internalIsEditing;
  const setIsEditing = setProfileMode ? 
    (editing) => setProfileMode(editing ? 'edit' : 'view') : 
    setInternalIsEditing;

  // Update editData when user data changes
  useEffect(() => {
    setEditData({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      linkedin: user?.linkedin || '',
      instagram: user?.instagram || '',
      github: user?.github || ''
    });
  }, [user]);

  // Sync with profileMode prop
  useEffect(() => {
    setIsEditing(profileMode === 'edit');
  }, [profileMode]);

  const handleEditToggle = () => {
    const newMode = isEditing ? 'view' : 'edit';
    setIsEditing(!isEditing);
    if (setProfileMode) {
      setProfileMode(newMode);
    }
  };

  const handleSave = async () => {
    try {
      // Only send fields that have changed
      const updatedFields = {};
      
      if (editData.name !== (user?.name || '')) updatedFields.name = editData.name;
      if (editData.bio !== (user?.bio || '')) updatedFields.bio = editData.bio;
      if (editData.location !== (user?.location || '')) updatedFields.location = editData.location;
      if (editData.website !== (user?.website || '')) updatedFields.website = editData.website;
      if (editData.linkedin !== (user?.linkedin || '')) updatedFields.linkedin = editData.linkedin;
      if (editData.instagram !== (user?.instagram || '')) updatedFields.instagram = editData.instagram;
      if (editData.github !== (user?.github || '')) updatedFields.github = editData.github;

      // If no fields changed, just exit edit mode
      if (Object.keys(updatedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      const response = await fetchWithWakeUp('https://prepmate-kvol.onrender.com/api/profile/update-basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          ...updatedFields
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated successfully:', result);
        setIsEditing(false);
        onUpdate && onUpdate();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Error updating profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Network error. Please try again.');
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
      if (user?.[field] || editData[field]) completed++;
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
      className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/70 border-slate-700/50 shadow-xl' 
          : 'bg-white/90 border-gray-200/50 shadow-lg'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, shadow: isDarkMode ? '0 25px 50px rgba(0,0,0,0.3)' : '0 25px 50px rgba(0,0,0,0.1)' }}
    >
      {/* Profile Picture and Basic Info */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {user?.avatar || user?.picture ? (
            <img
              src={user.avatar || user.picture}
              alt={user?.name || 'Profile'}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg ${
              isDarkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'
            } ${(user?.avatar || user?.picture) ? 'hidden' : 'flex'}`}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
            isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
          }`}>
            <Camera className="w-4 h-4" />
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
                }`}
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
                }`}
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
                }`}
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
                }`}
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
                  }`}
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
                  }`}
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
                  }`}
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
            <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {user?.name || 'Your Name'}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              @{user?.email?.split('@')[0] || 'username'}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className={`mt-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Get Codolio Card Button */}
        <motion.button
          className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:from-orange-600 hover:to-orange-700 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Get your Codolio Card
        </motion.button>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 mb-6">
        {user?.email && (
          <div className="flex items-center space-x-3">
            <Mail className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {user.email}
            </span>
          </div>
        )}
        
        {(user?.location || editData.location) && (
          <div className="flex items-center space-x-3">
            <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {user?.location || editData.location}
            </span>
          </div>
        )}

        {(user?.website || editData.website) && (
          <div className="flex items-center space-x-3">
            <ExternalLink className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <a 
              href={user?.website || editData.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              {user?.website || editData.website}
            </a>
          </div>
        )}

        {/* Social Media Links */}
        {user?.github && !isEditing && (
          <div className="flex items-center space-x-3">
            <Github className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <a 
              href={`https://github.com/${user.github}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              @{user.github}
            </a>
          </div>
        )}

        {user?.linkedin && !isEditing && (
          <div className="flex items-center space-x-3">
            <Linkedin className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <a 
              href={`https://linkedin.com/in/${user.linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              @{user.linkedin}
            </a>
          </div>
        )}

        {user?.instagram && !isEditing && (
          <div className="flex items-center space-x-3">
            <Instagram className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <a 
              href={`https://instagram.com/${user.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              @{user.instagram}
            </a>
          </div>
        )}
      </div>

      {/* About Section */}
      {user?.bio && !isEditing && (
        <div className="mb-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            About
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            {user?.bio}
          </p>
        </div>
      )}

    </motion.div>
  );
};

export default ProfileCard;
