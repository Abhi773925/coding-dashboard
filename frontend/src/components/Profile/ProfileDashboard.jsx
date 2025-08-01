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
import { getThemeColors } from '../../theme/colorTheme';
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get theme colors
  const themeColors = getThemeColors(isDarkMode);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark') || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkMode);
    };

    checkDarkMode();
    
    // Listen for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <motion.div
          className="max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please log in to view and manage your multi-platform coding profile.
            </p>
            <button
              onClick={login}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300 rounded-full animate-pulse"></div>
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <motion.div
          className="max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={fetchUserProfile}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? 'from-slate-900 via-slate-800 to-indigo-900' : 'from-gray-50 via-purple-50 to-blue-50'}`}
      style={{
        background: isDarkMode 
          ? 'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)'
          : 'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), linear-gradient(135deg, #f9fafb 0%, #f3e8ff 50%, #dbeafe 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Profile Header */}
        <ProfileHeader 
          user={profileData} 
          profileMode={profileMode}
          setProfileMode={setProfileMode}
          onUpdate={fetchUserProfile}
          isDarkMode={isDarkMode}
        />

        {/* Show welcome message for new users */}
        {profileData?.isNewUser && (
          <motion.div
            className={`mt-6 bg-gradient-to-r ${isDarkMode ? 'from-purple-900/20 to-blue-900/20 border-purple-700/50' : 'from-purple-50 to-blue-50 border-purple-200'} border rounded-xl p-6 backdrop-blur-sm`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${themeColors.profile.text.primary} mb-2`}>
                  Welcome to your coding profile! 🎉
                </h3>
                <p className={`${themeColors.profile.text.secondary} mb-4`}>
                  Connect your coding platforms to see comprehensive stats, track your progress, and showcase your achievements.
                </p>
                <button
                  onClick={() => setSelectedTab('platforms')}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
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
          <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-purple-200'}`}>
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                      selectedTab === tab.id
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400 shadow-lg'
                        : `border-transparent ${themeColors.profile.text.secondary} hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300`
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
                    <ProfileStats user={profileData} isDarkMode={isDarkMode} />
                    <RecentActivity user={profileData} isDarkMode={isDarkMode} />
                  </div>
                  <div className="space-y-6">
                    <PlatformCards 
                      user={profileData}
                      onConnectPlatform={handleConnectPlatform}
                      isDarkMode={isDarkMode}
                    />
                    <AchievementShowcase user={profileData} isDarkMode={isDarkMode} />
                  </div>
                </div>
              )}

              {selectedTab === 'platforms' && (
                <PlatformCards 
                  user={profileData}
                  onConnectPlatform={handleConnectPlatform}
                  detailed={true}
                  isDarkMode={isDarkMode}
                />
              )}

              {selectedTab === 'skills' && (
                <SkillsOverview user={profileData} isDarkMode={isDarkMode} />
              )}

              {selectedTab === 'activity' && (
                <ActivityHeatmap user={profileData} isDarkMode={isDarkMode} />
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
