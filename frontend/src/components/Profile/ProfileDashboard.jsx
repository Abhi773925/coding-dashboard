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
  Zap
} from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import PlatformCards from './PlatformCards';
import SkillsOverview from './SkillsOverview';
import ActivityHeatmap from './ActivityHeatmap';
import PlatformModal from './PlatformModal';
import ProfileStats from './ProfileStats';
import RecentActivity from './RecentActivity';
import AchievementShowcase from './AchievementShowcase';

const ProfileDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [profileMode, setProfileMode] = useState('view'); // 'view' or 'edit'

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'platforms', label: 'Platforms', icon: GitBranch },
    { id: 'skills', label: 'Skills', icon: Brain },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail') || 'demo@example.com'; // Default for demo
      const response = await fetch(`/api/profile/user?email=${email}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set demo data for development
      setUser({
        email: 'demo@example.com',
        name: 'Demo User',
        bio: 'This is a demo profile to showcase the multi-platform profile feature.',
        location: 'Demo City, Demo Country',
        missingPlatforms: ['leetcode', 'github', 'geeksforgeeks'],
        platformStats: {}
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
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader 
          user={user}
          profileMode={profileMode}
          setProfileMode={setProfileMode}
          onUpdate={fetchUserProfile}
        />

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
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
                    <ProfileStats user={user} />
                    <RecentActivity user={user} />
                  </div>
                  <div className="space-y-6">
                    <PlatformCards 
                      user={user}
                      onConnectPlatform={handleConnectPlatform}
                    />
                    <AchievementShowcase user={user} />
                  </div>
                </div>
              )}

              {selectedTab === 'platforms' && (
                <PlatformCards 
                  user={user}
                  onConnectPlatform={handleConnectPlatform}
                  detailed={true}
                />
              )}

              {selectedTab === 'skills' && (
                <SkillsOverview user={user} />
              )}

              {selectedTab === 'activity' && (
                <ActivityHeatmap user={user} />
              )}

              {selectedTab === 'achievements' && (
                <AchievementShowcase user={user} detailed={true} />
              )}

              {selectedTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ProfileStats user={user} detailed={true} />
                  <ActivityHeatmap user={user} />
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
          existingUsername={user?.platformStats?.[selectedPlatform]?.username}
        />
      </div>
    </div>
  );
};

export default ProfileDashboard;
