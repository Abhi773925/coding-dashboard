import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { 
  Code, 
  Moon, 
  Sun, 
  Menu,
  BookOpen, 
  Rocket, 
  Users, 
  Terminal, 
  Compass, 
  Search, 
  ChevronRight,
  Book,
  CloudLightning,
  Cpu,
  UserCircle,
  Settings,
  Award,
  CreditCard,
  LogIn,
  LogOut,
  Map,
  Clock,
  Star,
  X,
  ChevronDown,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Backend URL Configuration
const BACKEND_URL = 'https://coding-dashboard-ngwi.onrender.com';

const navigationSections = [
  {
    name: 'Contest',
    icon: BookOpen,
    bgColor: 'bg-blue-100',
    color: 'text-blue-600',
    subSections: [
      { name: 'Contest Tracker', icon: Terminal, route: '/contest' },
      
    ]
  },
  {
    name: 'Courses',
    icon: BookOpen,
    bgColor: 'bg-blue-100',
    color: 'text-blue-600',
    subSections: [
      { name: 'DSA Practice', icon: Terminal, route: '/courses/data-structures' },
      
    ]
  },
  {
    name: 'Community',
    icon: Users,
    bgColor: 'bg-green-100',
    color: 'text-green-600',
    subSections: [
      { name: 'Forums', icon: Compass, route: '/community/forums' },
      { name: 'Mentorship', icon: Book, route: '/community/mentorship' }
    ]
  },
  {
    name: 'Explore',
    icon: Rocket,
    bgColor: 'bg-purple-100',
    color: 'text-purple-600',
    subSections: [
      { name: 'Challenges', icon: Search, route: '/explore/challenges' },
      { name: 'Learning Paths', icon: Map, route: '/explore/learning-paths' }
    ]
  }
];




// Create an AuthContext to manage authentication state
const AuthContext = React.createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
          // Send token as both cookie and Authorization header
          const response = await axios.get(`${BACKEND_URL}/api/auth/current-user`, { 
            withCredentials: true,  // Important for sending cookies
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            }
          });
          
          if (response.data) {
            setIsLoggedIn(true);
            setUser(response.data);
          }
          if (response.data.email) {
            localStorage.setItem('userEmail', response.data.email);
          }

        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        setUser(null);
        // Clear token if invalid
        localStorage.removeItem('sessionToken');
      }
    };
    checkAuthStatus();
  }, []);

  const login = () => {
    // Redirect to Google OAuth login
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { 
        withCredentials: true 
      });
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('sessionToken');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// New Streak Component for Navigation
const StreakDisplay = () => {
  const { isDarkMode } = useTheme();
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/api/streak`, {
          params: { email: userEmail }
        });

        setStreak(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching streak:', err);
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
        isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
      }`}>
        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
        <span className="text-sm font-medium">...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 ${
      isDarkMode ? 'bg-zinc-800 text-orange-400' : 'bg-orange-100 text-orange-600'
    }`}>
      <Zap size={16} className="text-orange-500" />
      <span className="text-sm font-medium">{streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}</span>
    </div>
  );
};

const ProfileDropdown = ({ 
  onLogin, 
  onLogout,
  isMobile = false
}) => {
  const { isDarkMode } = useTheme();
  const { isLoggedIn, user, login, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuItems = [
    { 
      name: 'My Profile', 
      icon: UserCircle,
      color: 'text-indigo-400',
      route: '/profile'
    },
    { 
      name: 'My Learning', 
      icon: Award,
      color: 'text-emerald-400',
      route: '/learning'
    },
    { 
      name: 'Billing', 
      icon: CreditCard,
      color: 'text-rose-400',
      route: '/billing'
    },
    { 
      name: 'Settings', 
      icon: Settings,
      color: 'text-sky-400',
      route: '/settings'
    }
  ];

  // Determine the position of the dropdown based on whether it's mobile or desktop
  const dropdownPosition = isMobile ? 'bottom-0 left-0 right-0' : 'top-20 right-4';

  return (
    <div className="relative">
      {isLoggedIn ? (
        <>
          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`
              flex items-center space-x-3 p-3 
              ${isDarkMode 
                ? 'hover:bg-zinc-800/50' 
                : 'hover:bg-gray-100'}
              rounded-xl
              cursor-pointer
              transition-all duration-300 
              group
            `}
          >
            <div className="relative">
              <img 
                src={user?.avatar || '/default-avatar.png'}
                alt="User Avatar"
                className="w-6 h-6 rounded-full border-2 
                transition-all duration-300 
                group-hover:scale-100
                border-indigo-500"
              />
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 
                bg-emerald-500 rounded-full border-2 border-white"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name}</span>
              {isMobile && (
                <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                  {user?.email}
                </span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: isMobile ? 20 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isMobile ? 20 : -20 }}
                className={`
                  fixed ${dropdownPosition} w-full sm:w-80 
                  ${isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800' 
                    : 'bg-white border-gray-200'}
                  border rounded-xl shadow-2xl
                  overflow-hidden z-50
                  ring-2 ring-opacity-5
                  ${isDarkMode 
                    ? 'ring-zinc-700' 
                    : 'ring-gray-200'}
                `}
              >
                {/* User Profile Header */}
                {!isMobile && (
                  <div 
                    className={`
                      p-4 flex items-center space-x-4 
                      ${isDarkMode ? 'bg-zinc-800/50' : 'bg-gray-100'}
                      border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}
                    `}
                  >
                    <img 
                      src={user?.avatar || '/default-avatar.png'}
                      alt="User Avatar"
                      className="w-16 h-16 rounded-full border-2 border-indigo-500"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{user?.name}</h3>
                      <p 
                        className={`
                          text-sm 
                          ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}
                        `}
                      >
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* User Details */}
                {!isMobile && (
                  <div className="p-4">
                    <div 
                      className={`
                        grid grid-cols-3 gap-4 
                        ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-400" size={20} />
                        <span className="text-sm">Beginner</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="text-blue-400" size={20} />
                        <span className="text-sm">2024</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Map className="text-green-400" size={20} />
                        <span className="text-sm">Global</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Menu Items */}
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.route}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 
                      p-3.5 
                      ${isDarkMode 
                        ? 'hover:bg-zinc-800/50' 
                        : 'hover:bg-gray-100'}
                      cursor-pointer
                      transition-all duration-300
                      group
                      border-t
                      ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}
                      no-underline
                      ${isDarkMode ? 'text-zinc-300' : 'text-gray-800'}
                    `}
                  >
                    <item.icon 
                      className={`${item.color} group-hover:scale-110 transition-transform`} 
                      size={22} 
                    />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}

                {/* Logout */}
                <div 
                  onClick={logout}
                  className={`
                    flex items-center space-x-3 
                    p-3.5 
                    ${isDarkMode 
                      ? 'hover:bg-red-900/30 text-red-300' 
                      : 'hover:bg-red-50 text-red-600'}
                    cursor-pointer
                    border-t
                    ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}
                    transition-all duration-300
                    group
                  `}
                >
                  <LogOut 
                    className={`
                      ${isDarkMode 
                        ? 'text-red-400' 
                        : 'text-red-500'}
                      group-hover:scale-110 transition-transform
                    `} 
                    size={22} 
                  />
                  <span className="font-medium">Logout</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <button 
          onClick={login}
          className={`
            flex items-center space-x-2 
            px-5 py-2.5 rounded-full 
            ${isDarkMode 
              ? 'bg-zinc-800/50 text-indigo-300 hover:bg-zinc-800' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'}
            transition-all duration-300
            transform hover:scale-105
            shadow-md hover:shadow-lg
          `}
        >
          <LogIn size={20} />
          <span className="font-medium">Login</span>
        </button>
      )}
    </div>
  );
};

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  navigationSections 
}) => {
  const { isDarkMode } = useTheme();
  const { isLoggedIn, user, login, logout } = useAuth();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween' }}
          className={`
            fixed inset-0 z-50 
            ${isDarkMode ? 'bg-zinc-950/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}
            overflow-y-auto
          `}
        >
          {/* Mobile Menu Header */}
          <div 
            className={`
              flex justify-between items-center 
              p-4 
              ${isDarkMode 
                ? 'bg-zinc-950 text-white' 
                : 'bg-white text-black'}
            `}
          >
            <div className="flex items-center space-x-3">
              
              <Link to="/" className="text-lg font-bold"><Code 
                className={`
                  ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
                `} 
                size={28} 
              />
              </Link>
            </div>
            <button 
              onClick={onClose}
              className={`
                p-2 rounded-full
                ${isDarkMode 
                  ? 'hover:bg-zinc-800 text-zinc-300' 
                  : 'hover:bg-gray-200 text-gray-600'}
              `}
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4">
            <ProfileDropdown 
              onLogin={login}
              onLogout={logout}
              isMobile={true}
            />
          </div>

          {/* Streak Info (Mobile) */}
          {isLoggedIn && (
            <div className="px-4 pb-4">
              <div className={`
                flex items-center p-3 rounded-lg space-x-3
                ${isDarkMode 
                  ? 'bg-zinc-800/50 text-orange-400' 
                  : 'bg-orange-100 text-orange-700'}
              `}>
                <Zap size={20} className="text-orange-500" />
                <StreakDisplay />
              </div>
            </div>
          )}

          {/* Navigation Sections */}
          {navigationSections.map((section) => (
            <div key={section.name} className="p-4">
              <div 
                className={`
                  flex items-center space-x-3 
                  p-3 rounded-lg
                  ${isDarkMode 
                    ? 'bg-zinc-800 text-zinc-200' 
                    : 'bg-gray-100 text-gray-800'}
                `}
                onClick={() => toggleSection(section.name)}
              >
                <section.icon 
                  className={section.color} 
                  size={24} 
                />
                <span className="text-lg font-semibold">{section.name}</span>
                <ChevronDown 
                  size={16} 
                  className={`
                    transition-transform 
                    ${openSection === section.name ? 'rotate-180' : ''}
                  `} 
                />
              </div>
              {openSection === section.name && section.subSections.map((subSection) => (
                <Link
                  key={subSection.name}
                  to={subSection.route}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between
                    p-3 ml-4 
                    ${isDarkMode 
                      ? 'hover:bg-zinc-800 text-zinc-300' 
                      : 'hover:bg-gray-100 text-gray-700'}
                    cursor-pointer
                    transition-all duration-300
                    group
                    no-underline
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <subSection.icon 
                      className={`
                        ${isDarkMode 
                          ? 'text-zinc-300' 
                          : 'text-gray-600'}
                        group-hover:scale-110 transition-transform
                      `} 
                      size={20} 
                    />
                    <span className="font-medium">{subSection.name}</span>
                  </div>
                  <ChevronRight 
                    className={`
                      ${isDarkMode 
                        ? 'text-zinc-500' 
                        : 'text-gray-400'}
                      group-hover:translate-x-1 transition-transform
                    `} 
                    size={18} 
                  />
                </Link>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navigation = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const { isLoggedIn } = useAuth();

  // Screen Size Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  useEffect(() => {
    // Check for session token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('sessionToken', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Desktop Navigation Render
  const renderDesktopNavigation = () => (
    <nav 
      className={`
        hidden lg:flex fixed top-0 left-0 right-0 z-40
        ${isDarkMode 
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 text-gray-100' 
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200 text-gray-900'}
        items-center justify-between px-6 py-4
        shadow-lg
        rounded-b-2xl
      `}
    >
      {/* Logo */}
      <div className="flex items-center space-x-3">
       
        <Link to="/" className="text-2xl font-bold tracking-tight">
        <Code 
          className={`
            ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
          `} 
          size={36} 
        /></Link>
      </div>

      {/* Navigation Sections with Dropdowns */}
      <div className="flex items-center space-x-6 relative">
        {navigationSections.map((section) => (
          <div 
            key={section.name} 
            className="relative"
            onMouseEnter={() => toggleSection(section.name)}
            onMouseLeave={() => toggleSection(section.name)}
          >
            <div 
              className={`
                flex items-center space-x-2 
                cursor-pointer 
                px-4 py-2 rounded-full
                ${isDarkMode 
                  ? 'hover:bg-zinc-800 text-zinc-300' 
                  : 'hover:bg-gray-100 text-gray-700'}
                transition-all duration-300
                transform hover:scale-105
                shadow-sm hover:shadow-md
              `}
            >
              <section.icon 
                className={section.color} 
                size={20} 
              />
              <span className="font-medium">{section.name}</span>
              <ChevronDown 
                size={16} 
                className={`
                  transition-transform 
                  ${openSection === section.name ? 'rotate-180' : ''}
                `} 
              />
            </div>

            {/* Dropdown Menu */}
            {openSection === section.name && (
              <div 
                className={`
                  absolute top-full left-0 mt-2 w-64 
                  ${isDarkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-white text-gray-800'}
                  rounded-xl shadow-2xl
                  border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}
                  overflow-hidden
                  z-50
                `}
              >
                {section.subSections.map((subSection) => (
                  <Link
                    key={subSection.name}
                    to={subSection.route}
                    className={`
                      flex items-center justify-between
                      p-3 
                      ${isDarkMode 
                        ? 'hover:bg-zinc-700 text-zinc-300' 
                        : 'hover:bg-gray-100 text-gray-700'}
                      cursor-pointer
                      transition-all duration-300
                      group
                      no-underline
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <subSection.icon 
                        className={`
                          ${isDarkMode 
                            ? 'text-zinc-400' 
                            : 'text-gray-600'}
                          group-hover:scale-110 transition-transform
                        `} 
                        size={20} 
                      />
                      <span className="font-medium">{subSection.name}</span>
                    </div>
                    <ChevronRight 
                      className={`
                        ${isDarkMode 
                          ? 'text-zinc-500' 
                          : 'text-gray-400'}
                        group-hover:translate-x-1 transition-transform
                      `} 
                      size={18} 
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Streak Display - Only show when user is logged in */}
        {isLoggedIn && <StreakDisplay />}
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`
            p-2.5 rounded-full 
            ${isDarkMode 
              ? 'text-yellow-400 hover:bg-zinc-800' 
              : 'text-gray-600 hover:bg-gray-200'}
            transition-all duration-300
            transform hover:scale-110
            shadow-sm hover:shadow-md
          `}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Profile Section */}
        <ProfileDropdown 
          onLogin={() => {}}
          onLogout={() => {}}
        />
      </div>
    </nav>
  );

  // Mobile Navigation Render
  const renderMobileNavigation = () => (
    <>
      <nav 
        className={`
          lg:hidden fixed top-0 left-0 right-0 z-40
          ${isDarkMode 
            ? 'bg-zinc-950/80 backdrop-blur-md text-gray-100' 
            : 'bg-white/80 backdrop-blur-md text-gray-900'}
          px-4 py-3
          rounded-b-2xl shadow-lg
        `}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            
            <Link to="/" className="text-2xl font-bold tracking-tight"><Code 
              className={`
                ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
              `} 
              size={28} 
            /></Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Mobile Streak Display */}
            {isLoggedIn && <StreakDisplay />}
            
            <button 
              onClick={toggleTheme}
              className={`
                p-2 rounded-full 
                ${isDarkMode 
                  ? 'text-yellow-400 hover:bg-zinc-800' 
                  : 'text-gray-600 hover:bg-gray-200'}
                transition-colors
              `}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`
                ${isDarkMode 
                  ? 'text-zinc-300 hover:bg-zinc-800' 
                  : 'text-gray-600 hover:bg-gray-200'}
                p-2 rounded-full
                transition-colors
              `}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationSections={navigationSections}
      />
    </>
  );

  return (
    <div 
      className={`
        ${isDarkMode ? 'dark bg-zinc-950 text-gray-100' : 'bg-white text-gray-900'}
      `}
    >
      {isMobile ? renderMobileNavigation() : renderDesktopNavigation()}
    </div>
  );
};

export default Navigation;