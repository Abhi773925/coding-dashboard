import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // Import ThemeContext

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    leetcode: '',
    github: '',
    geeksforgeeks: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const { isDarkMode } = useTheme(); // Use the ThemeContext instead of local state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await axios.get(`http://localhost:5000/api/users/${userEmail}`);
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
      const response = await axios.put(`http://localhost:5000/api/users/${userEmail}`, {
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

  // Icons for different fields
  const Icons = {
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    name: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    leetcode: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-4.535.81a1.382 1.382 0 0 0-.845 2.34L5.484 12 .193 16.646a1.384 1.384 0 0 0 .414 2.231l4.815 2.247 2.231 4.815a1.382 1.382 0 0 0 2.231.414L12 17.485l4.354 5.291a1.383 1.383 0 0 0 2.34-.845l.81-4.535 5.788-5.406a1.374 1.374 0 0 0 .438-.961 1.392 1.392 0 0 0-.438-.961L13.483 0z"/>
      </svg>
    ),
    github: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    geeksforgeeks: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.445 21.832a1.034 1.034 0 0 1-.765-.352L.411 10.101a1.035 1.035 0 0 1 0-1.414l9.85-9.85a1.04 1.04 0 0 1 1.414 0l9.85 9.85a1.035 1.035 0 0 1 0 1.414l-9.85 9.85a1.034 1.034 0 0 1-.765.352l-1.465-.001z"/>
      </svg>
    )
  };

  // Platform logos and colors
  const platforms = [
    { name: 'LeetCode', icon: Icons.leetcode, fieldName: 'leetcode', color: 'from-yellow-400 to-orange-500' },
    { name: 'GitHub', icon: Icons.github, fieldName: 'github', color: 'from-indigo-400 to-indigo-600' },
    { name: 'GeeksforGeeks', icon: Icons.geeksforgeeks, fieldName: 'geeksforgeeks', color: 'from-emerald-400 to-emerald-600' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Reusable input field component
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
      className={`mb-4 ${isImportant ? 'col-span-2' : ''}`}
      variants={itemVariants}
    >
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
            w-full pl-10 pr-3 py-3 rounded-lg transition-all duration-300
            focus:ring-2 focus:outline-none
            ${isDarkMode 
              ? 'bg-zinc-800 text-gray-100 border-zinc-700 focus:ring-indigo-400' 
              : 'bg-white text-gray-900 border border-gray-300 focus:ring-indigo-600'}
            ${disabled 
              ? 'cursor-not-allowed opacity-70' 
              : 'cursor-text'}
          `}
        />
      </div>
    </motion.div>
  );

  // Platform link card component
  const PlatformCard = ({ platform, profileValue, isEditing, onChange }) => (
    <motion.div 
      variants={itemVariants}
      className="col-span-1"
    >
      <div className={`
        relative rounded-xl overflow-hidden shadow-lg h-32
        ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}
      `}>
        <div className={`
          absolute top-0 left-0 w-full h-full opacity-40 bg-gradient-to-br ${platform.color}
        `}></div>
        
        <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-100'}
            `}>
              {platform.icon}
            </div>
            <h3 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {platform.name}
            </h3>
          </div>
          
          {isEditing ? (
            <input
              type="text"
              name={platform.fieldName}
              value={profileValue || ''}
              onChange={onChange}
              placeholder={`${platform.name} username`}
              className={`
                w-full py-2 px-3 rounded-lg
                ${isDarkMode 
                  ? 'bg-zinc-800 text-gray-100 border-zinc-700' 
                  : 'bg-white text-gray-900 border-gray-300'}
                border transition-colors duration-300
              `}
            />
          ) : (
            <div className={`
              ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}
              truncate
            `}>
              {profileValue ? (
                <span>{profileValue}</span>
              ) : (
                <span className="text-gray-400 italic">Not set</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div 
      className={`pt-32
        min-h-screen flex items-center justify-center p-4 transition-colors duration-300
        ${isDarkMode 
          ? 'bg-black text-gray-100' 
          : 'bg-white text-gray-900'}
      `}
    >
      <motion.div 
        className={`
          w-full max-w-4xl rounded-2xl shadow-2xl p-6 relative overflow-hidden
          ${isDarkMode 
            ? 'bg-zinc-900' 
            : 'bg-white'}
        `}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Background gradient effect */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'} opacity-20 blur-3xl`}></div>
        <div className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'} opacity-10 blur-3xl`}></div>
        
        {/* Theme Toggle Button removed as it's now managed by ThemeContext */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Profile Header */}
          <motion.div 
            className="md:col-span-3 text-center mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Developer Profile
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
              Manage your personal information and connected platforms
            </p>
          </motion.div>

          <motion.div 
            className="md:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* User Info Card */}
            <motion.div 
              className={`
                rounded-xl overflow-hidden mb-6 shadow-lg
                ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}
              `}
              variants={itemVariants}
            >
              <div className={`
                h-24 bg-gradient-to-r from-indigo-400 to-indigo-600 relative
              `}>
                <div className="absolute -bottom-10 left-6">
                  <div className={`
                    w-20 h-20 rounded-full border-4 shadow-lg flex items-center justify-center text-2xl
                    ${isDarkMode 
                      ? 'bg-zinc-800 border-zinc-800' 
                      : 'bg-white border-white'}
                  `}>
                    {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    label="Email (Cannot be changed)"
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

            {/* Connected Platforms Section */}
            <motion.div variants={itemVariants}>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Connected Platforms
              </h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-end mt-8"
              variants={itemVariants}
            >
              {!isEditing ? (
                <motion.button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${isDarkMode 
                      ? 'bg-zinc-800/50 text-indigo-300 hover:bg-zinc-800' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                    shadow-lg
                  `}
                >
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex space-x-3">
                  <motion.button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      px-6 py-3 rounded-full font-medium transition-all duration-300
                      ${isDarkMode 
                        ? 'bg-zinc-800/30 text-zinc-300 border border-zinc-700 hover:bg-zinc-800' 
                        : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-gray-50'}
                      shadow-md
                    `}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="button"
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      px-6 py-3 rounded-full font-medium transition-all duration-300
                      ${isDarkMode 
                        ? 'bg-zinc-800/50 text-emerald-300 hover:bg-zinc-800' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                      shadow-lg
                    `}
                  >
                    Save Changes
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;