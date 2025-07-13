import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Github, Code, BookOpen, Edit2, Save, X, Check } from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    leetcode: '',
    github: '',
    geeksforgeeks: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await axios.get(`https://coding-dashboard-ngwi.onrender.com/api/users/${userEmail}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await axios.put(`https://coding-dashboard-ngwi.onrender.com/api/users/${userEmail}`, {
        name: profile.name,
        leetcode: profile.leetcode,
        github: profile.github,
        geeksforgeeks: profile.geeksforgeeks
      });

      alert(response.data.message);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  // Floating Element Component
  const FloatingElement = ({ delay, duration, children, className }) => (
    <div
      className={`absolute opacity-60 ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        animation: `float ${duration}s ease-in-out infinite`,
      }}
    >
      {children}
    </div>
  );

  // Enhanced Icons with better styling
  const Icons = {
    email: <Mail className="w-5 h-5 text-gray-400" />,
    name: <User className="w-5 h-5 text-gray-400" />,
    leetcode: <Code className="w-5 h-5 text-gray-400" />,
    github: <Github className="w-5 h-5 text-gray-400" />,
    geeksforgeeks: <BookOpen className="w-5 h-5 text-gray-400" />
  };

  // Enhanced platform configurations
  const platforms = [
    { 
      name: 'LeetCode', 
      icon: Icons.leetcode, 
      fieldName: 'leetcode', 
      gradient: 'from-yellow-400 via-orange-400 to-red-500',
      hoverGradient: 'from-yellow-300 via-orange-300 to-red-400'
    },
    { 
      name: 'GitHub', 
      icon: Icons.github, 
      fieldName: 'github', 
      gradient: 'from-gray-700 via-gray-600 to-gray-800',
      hoverGradient: 'from-gray-600 via-gray-500 to-gray-700'
    },
    { 
      name: 'GeeksforGeeks', 
      icon: Icons.geeksforgeeks, 
      fieldName: 'geeksforgeeks', 
      gradient: 'from-green-400 via-emerald-400 to-teal-500',
      hoverGradient: 'from-green-300 via-emerald-300 to-teal-400'
    }
  ];

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Enhanced Profile Field Component
  const ProfileField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    disabled, 
    placeholder,
    icon,
    isImportant = false
  }) => (
    <motion.div 
      className={`mb-6 ${isImportant ? 'col-span-2' : ''}`}
      variants={itemVariants}
      whileHover={{ y: -2 }}
    >
      <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          {icon}
        </div>
        <input 
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-4 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm
            focus:ring-2 focus:outline-none border-2 font-medium
            ${isDarkMode 
              ? 'bg-slate-800/60 text-slate-100 border-slate-700/60 focus:ring-purple-400/50 focus:border-purple-400/50' 
              : 'bg-white/80 text-gray-900 border-gray-200/60 focus:ring-purple-500/50 focus:border-purple-500/50'}
            ${disabled 
              ? 'cursor-not-allowed opacity-70' 
              : 'cursor-text hover:border-purple-400/40 group-hover:shadow-lg'}
          `}
        />
      </div>
    </motion.div>
  );

  // Enhanced Platform Card Component
  const PlatformCard = ({ platform, profileValue, isEditing, onChange }) => (
    <motion.div 
      variants={itemVariants}
      className="col-span-1"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`
        relative rounded-3xl overflow-hidden shadow-xl h-40 group cursor-pointer
        transition-all duration-500 backdrop-blur-sm border-2
        ${isDarkMode 
          ? 'bg-slate-800/60 border-slate-700/60 hover:border-purple-400/50' 
          : 'bg-white/80 border-gray-200/60 hover:border-purple-500/50'}
      `}>
        {/* Enhanced gradient overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-10
          group-hover:opacity-20 transition-opacity duration-500
        `} />
        
        {/* Floating dots inside card */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${platform.gradient} opacity-30
                animate-pulse`}
              style={{
                top: `${20 + i * 25}%`,
                right: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex items-center space-x-3">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
              group-hover:scale-110 bg-gradient-to-br ${platform.gradient}
            `}>
              <div className="text-white">
                {platform.icon}
              </div>
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                {platform.name}
              </h3>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Connect your profile
              </div>
            </div>
          </div>
          
          {isEditing ? (
            <input
              type="text"
              name={platform.fieldName}
              value={profileValue || ''}
              onChange={onChange}
              placeholder={`${platform.name} username`}
              className={`
                w-full py-3 px-4 rounded-xl transition-all duration-300 border-2
                ${isDarkMode 
                  ? 'bg-slate-800/80 text-slate-100 border-slate-600/60 focus:border-purple-400/50' 
                  : 'bg-white/90 text-gray-900 border-gray-300/60 focus:border-purple-500/50'}
                focus:outline-none focus:ring-2 focus:ring-purple-400/30
              `}
            />
          ) : (
            <div className={`
              text-sm font-medium truncate px-3 py-2 rounded-xl
              ${isDarkMode ? 'text-slate-300 bg-slate-700/40' : 'text-gray-600 bg-gray-100/60'}
            `}>
              {profileValue ? (
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  {profileValue}
                </span>
              ) : (
                <span className="text-gray-400 italic flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  Not connected
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div 
      className={`
        min-h-screen flex items-center justify-center p-4 pt-24 pb-12 
        transition-all duration-700 ease-in-out overflow-hidden
        ${isDarkMode 
          ? 'bg-slate-900' 
          : 'bg-gray-50'}
      `}
    >
      {/* Enhanced Flowing Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="profileGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(139, 92, 246, 0.08)"} />
              <stop offset="100%" stopColor={isDarkMode ? "rgba(139, 92, 246, 0.05)" : "rgba(99, 102, 241, 0.05)"} />
            </linearGradient>
            <linearGradient id="profileGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? "rgba(139, 92, 246, 0.08)" : "rgba(59, 130, 246, 0.06)"} />
              <stop offset="100%" stopColor={isDarkMode ? "rgba(59, 130, 246, 0.04)" : "rgba(139, 92, 246, 0.04)"} />
            </linearGradient>
          </defs>

          <path
            d="M0,450 Q360,250 720,400 T1440,350 L1440,900 L0,900 Z"
            fill="url(#profileGradient1)"
            className="animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <path
            d="M0,550 Q360,350 720,500 T1440,450 L1440,900 L0,900 Z"
            fill="url(#profileGradient2)"
            className="animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "2s" }}
          />
        </svg>

        {/* Enhanced floating elements */}
        <FloatingElement delay={0} duration={6} className="top-24 left-20">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400`}
            style={{
              boxShadow: isDarkMode ? "0 0 25px rgba(139, 92, 246, 0.6)" : "0 0 20px rgba(139, 92, 246, 0.4)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={2} duration={8} className="top-32 right-24">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400`}
            style={{
              boxShadow: isDarkMode ? "0 0 20px rgba(59, 130, 246, 0.7)" : "0 0 15px rgba(59, 130, 246, 0.5)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={4} duration={10} className="bottom-40 left-32">
          <div className={`w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400`}
            style={{
              boxShadow: isDarkMode ? "0 0 30px rgba(52, 211, 153, 0.5)" : "0 0 25px rgba(52, 211, 153, 0.3)",
            }}
          />
        </FloatingElement>

        {/* Additional floating elements */}
        {[...Array(8)].map((_, i) => (
          <FloatingElement
            key={i}
            delay={i * 0.8}
            duration={6 + i * 0.5}
            className={`opacity-40`}
            style={{
              top: `${15 + i * 8}%`,
              left: `${8 + i * 10}%`,
            }}
          >
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400`}
              style={{
                boxShadow: isDarkMode ? "0 0 15px rgba(139, 92, 246, 0.4)" : "0 0 10px rgba(139, 92, 246, 0.3)",
              }}
            />
          </FloatingElement>
        ))}
      </div>

      <motion.div 
        className={`
          w-full max-w-6xl rounded-3xl shadow-2xl p-8 relative overflow-hidden backdrop-blur-sm border-2
          ${isDarkMode 
            ? 'bg-slate-800/60 border-slate-700/60' 
            : 'bg-white/80 border-gray-200/60'}
        `}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      >
        {/* Enhanced background effects */}
        <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-5 blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 blur-3xl`} />
        
        <div className="relative z-10">
          {/* Enhanced Profile Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium mb-6 
              backdrop-blur-sm border transition-all duration-300
              ${isDarkMode
                ? "bg-slate-800/70 border-slate-700/60 text-purple-300"
                : "bg-white/90 border-purple-200/60 text-purple-700"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mr-3 ${isDarkMode ? "bg-purple-400" : "bg-purple-500"}`} />
              <span className="font-semibold">Profile Settings</span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Developer
              <span className={`
                ml-3 bg-gradient-to-r bg-clip-text text-transparent
                ${isDarkMode ? "from-purple-400 via-blue-400 to-cyan-400" : "from-purple-600 via-blue-600 to-indigo-600"}
              `}>
                Profile
              </span>
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Manage your personal information and connected platforms
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced User Info Card */}
            <motion.div 
              className={`
                rounded-3xl overflow-hidden mb-8 shadow-xl backdrop-blur-sm border-2
                ${isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white/80 border-gray-200/60'}
              `}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className={`
                h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden
              `}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 rounded-full bg-white animate-pulse"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${10 + i * 15}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${2 + i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="absolute -bottom-12 left-8">
                  <motion.div 
                    className={`
                      w-24 h-24 rounded-3xl border-4 shadow-2xl flex items-center justify-center text-3xl font-bold
                      ${isDarkMode 
                        ? 'bg-slate-800 border-slate-800' 
                        : 'bg-white border-white'}
                    `}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                  </motion.div>
                </div>
              </div>
              
              <div className="p-8 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField 
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    icon={Icons.name}
                    isImportant={true}
                  />
                  
                  <ProfileField 
                    label="Email Address (Cannot be changed)"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={true}
                    icon={Icons.email}
                    isImportant={true}
                  />
                </div>
              </div>
            </motion.div>

            {/* Enhanced Connected Platforms Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Connected Platforms
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {platforms.map((platform) => (
                <PlatformCard
                  key={platform.fieldName}
                  platform={platform}
                  profileValue={profile[platform.fieldName]}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <motion.div 
              className="flex justify-center gap-4"
              variants={itemVariants}
            >
              {!isEditing ? (
                <motion.button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center px-8 py-4 rounded-2xl font-semibold text-lg
                    transition-all duration-300 shadow-xl backdrop-blur-sm
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'}
                  `}
                  style={{
                    boxShadow: isDarkMode ? "0 10px 40px rgba(139, 92, 246, 0.3)" : "0 10px 40px rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <Edit2 className="w-5 h-5 mr-3" />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex gap-4">
                  <motion.button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center px-8 py-4 rounded-2xl font-semibold text-lg
                      transition-all duration-300 shadow-lg backdrop-blur-sm border-2
                      ${isDarkMode 
                        ? 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800' 
                        : 'bg-white/80 text-gray-600 border-gray-300/60 hover:bg-gray-50'}
                    `}
                  >
                    <X className="w-5 h-5 mr-3" />
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="button"
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center px-8 py-4 rounded-2xl font-semibold text-lg
                      transition-all duration-300 shadow-xl backdrop-blur-sm
                      ${isDarkMode 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'}
                    `}
                    style={{
                      boxShadow: isDarkMode ? "0 10px 40px rgba(52, 211, 153, 0.3)" : "0 10px 40px rgba(52, 211, 153, 0.2)",
                    }}
                  >
                    <Save className="w-5 h-5 mr-3" />
                    Save Changes
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          25% {
            transform: translateY(-15px) translateX(8px) scale(1.05);
          }
          50% {
            transform: translateY(-8px) translateX(-8px) scale(0.95);
          }
          75% {
            transform: translateY(-20px) translateX(5px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;