import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Trophy, 
  GitBranch, 
  Code2, 
  Brain, 
  Calendar,
  Star,
  Target,
  TrendingUp,
  Github,
  ExternalLink,
  Plus,
  Eye,
  Edit,
  ChevronRight,
  Activity,
  Award,
  BarChart3,
  Zap,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useAuth } from '../navigation/Navigation';
import { fetchWithWakeUp } from '../../utils/serverWakeUp';
import { useTheme } from '../context/ThemeContext';
import ProfileHeader from './ProfileHeader';
import PlatformCards from './PlatformCards';
import SkillsOverview from './SkillsOverview';
import ActivityHeatmap from './ActivityHeatmap';
import PlatformModal from './PlatformModal';
import ProfileStats from './ProfileStats';
import RecentActivity from './RecentActivity';
import AchievementShowcase from './AchievementShowcase';

const ProfileDashboard = () => {
  const { user: authUser, isLoggedIn, login } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [profileMode, setProfileMode] = useState('view'); // 'view' or 'edit'
  const { isDarkMode, colors, schemes } = useTheme();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'platforms', label: 'Platforms', icon: GitBranch },
    { id: 'skills', label: 'Skills', icon: Brain },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  useEffect(() => {
    if (isLoggedIn && authUser?.email) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, authUser]);

  const fetchUserProfile = async () => {
    if (!authUser?.email) {
      setError('No user email found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithWakeUp(`https://prepmate-kvol.onrender.com/api/profile/user?email=${authUser.email}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // User not found in profile system, create basic profile
          setProfileData({
            email: authUser.email,
            name: authUser.name || 'User',
            bio: '',
            location: '',
            website: '',
            missingPlatforms: ['leetcode', 'github', 'geeksforgeeks'],
            platformStats: {},
            isNewUser: true
          });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setProfileData({
          ...data,
          // Ensure we have basic user info from auth
          name: data.name || authUser.name || 'User',
          email: data.email || authUser.email,
          isNewUser: false
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
      // Set basic profile data from auth user
      setProfileData({
        email: authUser.email,
        name: authUser.name || 'User',
        bio: '',
        location: '',
        website: '',
        missingPlatforms: ['leetcode', 'github', 'geeksforgeeks'],
        platformStats: {},
        isNewUser: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatformModal(true);
  };

  const handlePlatformUpdate = async (platformData) => {
    if (!authUser?.email) return;
    
    try {
      const response = await fetchWithWakeUp('https://prepmate-kvol.onrender.com/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: authUser.email,
          ...platformData
        }),
      });
      
      if (response.ok) {
        await fetchUserProfile(); // Refresh profile data
        setShowPlatformModal(false);
      }
    } catch (error) {
      console.error('Error updating platform:', error);
    }
  };

  // Show login prompt if user is not logged in
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${schemes.pageBackground(isDarkMode)} flex items-center justify-center relative overflow-hidden`}>
        {/* Subtle background effect without animations */}
        <div className="absolute inset-0">
          <div 
            className={`absolute inset-0 opacity-30`}
            style={{
              background: isDarkMode 
                ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 35%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(ellipse at top, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.03) 35%, rgba(255,255,255,0) 70%)'
            }}
          />
        </div>
        
        <motion.div
          className="max-w-md w-full mx-4 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`${schemes.cardBackground(isDarkMode)} rounded-2xl shadow-xl p-8 text-center ${colors.effects.backdrop} border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${isDarkMode ? 'from-indigo-500 to-purple-600' : 'from-indigo-600 to-purple-700'}`}>
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className={`text-2xl font-bold ${colors.text.primary} mb-4`}>
              Access Your Profile
            </h2>
            <p className={`${colors.text.secondary} mb-6`}>
              Please log in to view and manage your multi-platform coding profile.
            </p>
            <button
              onClick={login}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${schemes.primaryButton(isDarkMode)}`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 8px 25px rgba(139, 92, 246, 0.3)" 
                  : "0 8px 25px rgba(139, 92, 246, 0.2)",
              }}
            >
              Log In with Google
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${schemes.pageBackground(isDarkMode)} flex items-center justify-center relative overflow-hidden`}>
        {/* Subtle background effect without animations */}
        <div className="absolute inset-0">
          <div 
            className={`absolute inset-0 opacity-20`}
            style={{
              background: isDarkMode 
                ? 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 50%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(ellipse at center, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.02) 50%, rgba(255,255,255,0) 70%)'
            }}
          />
        </div>
        
        <motion.div
          className="flex flex-col items-center space-y-4 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className={`w-16 h-16 border-4 border-dashed rounded-full animate-spin ${isDarkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
            <div className={`absolute inset-0 w-16 h-16 border-4 rounded-full animate-pulse ${isDarkMode ? 'border-indigo-300/50' : 'border-indigo-300/50'}`}></div>
          </div>
          <p className={`text-lg font-medium ${colors.text.primary}`}>Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div className={`min-h-screen ${schemes.pageBackground(isDarkMode)} flex items-center justify-center relative overflow-hidden`}>
        {/* Subtle background effect without animations */}
        <div className="absolute inset-0">
          <div 
            className={`absolute inset-0 opacity-20`}
            style={{
              background: isDarkMode 
                ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, rgba(185,28,28,0.04) 50%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(ellipse at center, rgba(239,68,68,0.04) 0%, rgba(185,28,28,0.02) 50%, rgba(255,255,255,0) 70%)'
            }}
          />
        </div>
        
        <motion.div
          className="max-w-md w-full mx-4 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`${schemes.cardBackground(isDarkMode)} rounded-2xl shadow-xl p-8 text-center ${colors.effects.backdrop} border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
              <AlertCircle className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <h2 className={`text-2xl font-bold ${colors.text.primary} mb-4`}>
              Error Loading Profile
            </h2>
            <p className={`${colors.text.secondary} mb-6`}>
              {error}
            </p>
            <button
              onClick={fetchUserProfile}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${schemes.primaryButton(isDarkMode)}`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 8px 25px rgba(139, 92, 246, 0.3)" 
                  : "0 8px 25px rgba(139, 92, 246, 0.2)",
              }}
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${schemes.pageBackground(isDarkMode)} relative overflow-hidden`}>
      {/* Subtle background effect matching hero section - no animations */}
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 opacity-30`}
          style={{
            background: isDarkMode 
              ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 35%, rgba(0,0,0,0) 70%), radial-gradient(ellipse at bottom right, rgba(34,211,238,0.08) 0%, rgba(99,102,241,0.04) 50%, rgba(0,0,0,0) 70%)'
              : 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 35%, rgba(255,255,255,0) 70%), radial-gradient(ellipse at bottom right, rgba(34,211,238,0.04) 0%, rgba(99,102,241,0.02) 50%, rgba(255,255,255,0) 70%)'
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader 
          user={profileData} 
          profileMode={profileMode}
          setProfileMode={setProfileMode}
          onUpdate={fetchUserProfile}
        />

        {/* Show welcome message for new users */}
        {profileData?.isNewUser && (
          <motion.div
            className={`mt-6 rounded-xl p-6 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-800/60 border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                : 'bg-white/80 border-indigo-200/50 shadow-lg shadow-indigo-500/10'
            } ${colors.effects.backdrop}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-r ${isDarkMode ? 'from-purple-600 to-blue-600' : 'from-purple-600 to-blue-600'}`}>
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${colors.text.primary} mb-2`}>
                  Welcome to your coding profile! 🎉
                </h3>
                <p className={`${colors.text.secondary} mb-4`}>
                  Connect your coding platforms to see comprehensive stats, track your progress, and showcase your achievements.
                </p>
                <button
                  onClick={() => setSelectedTab('platforms')}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${schemes.primaryButton(isDarkMode)}`}
                  style={{
                    boxShadow: isDarkMode 
                      ? "0 4px 15px rgba(139, 92, 246, 0.3)" 
                      : "0 4px 15px rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Connect Platforms</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className={`border-b ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                      selectedTab === tab.id
                        ? `border-indigo-500 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} shadow-md`
                        : `border-transparent ${colors.text.secondary} ${isDarkMode ? 'hover:text-indigo-400 hover:border-indigo-400/50' : 'hover:text-indigo-600 hover:border-indigo-300/50'}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <ProfileStats user={profileData} />
                    <RecentActivity user={profileData} />
                  </div>
                  <div className="space-y-6">
                    <PlatformCards 
                      user={profileData}
                      onConnectPlatform={handleConnectPlatform}
                    />
                    <AchievementShowcase user={profileData} />
                  </div>
                </div>
              )}

              {selectedTab === 'platforms' && (
                <PlatformCards 
                  user={profileData}
                  onConnectPlatform={handleConnectPlatform}
                  detailed={true}
                />
              )}

              {selectedTab === 'skills' && (
                <SkillsOverview user={profileData} />
              )}

              {selectedTab === 'activity' && (
                <ActivityHeatmap user={profileData} />
              )}

              {selectedTab === 'achievements' && (
                <AchievementShowcase user={profileData} detailed={true} />
              )}

              {selectedTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ProfileStats user={profileData} detailed={true} />
                  <ActivityHeatmap user={profileData} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Platform Connection Modal */}
        <PlatformModal
          isOpen={showPlatformModal}
          onClose={() => setShowPlatformModal(false)}
          platform={selectedPlatform}
          onSubmit={handlePlatformUpdate}
          existingUsername={profileData?.platformStats?.[selectedPlatform]?.username}
        />
      </div>
    </div>
  );
};

export default ProfileDashboard;
