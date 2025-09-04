import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Code2, 
  Video, 
  MessageCircle, 
  Share2, 
  Monitor, 
  GitBranch, 
  Zap,
  Clock,
  Star,
  Play,
  Pause,
  Settings,
  Bell,
  ChevronRight,
  Sparkles,
  Rocket,
  Terminal,
  Heart,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ArrowLeft,
  History
} from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';
import RecentSessions from './RecentSessions';
import RoomManager from './RoomManager';

const Collab = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showRoomManager, setShowRoomManager] = useState(true);
  const [showRecentSessions, setShowRecentSessions] = useState(false);
  const [authStateChanged, setAuthStateChanged] = useState(false);

  // Track authentication state changes
  useEffect(() => {
    if (loading) return; // Wait for auth check to complete
    
    const wasLoggedIn = localStorage.getItem('wasLoggedInBefore');
    const currentAuthState = user ? 'true' : 'false';
    
    // If auth state changed from what was stored, show recent sessions
    if (wasLoggedIn && wasLoggedIn !== currentAuthState) {
      setAuthStateChanged(true);
      // Show recent sessions modal after a short delay
      const timer = setTimeout(() => {
        if (user) {
          setShowRecentSessions(true);
        }
        setAuthStateChanged(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    // Store current auth state
    localStorage.setItem('wasLoggedInBefore', currentAuthState);
  }, [user, loading]);

  // Check for room parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const roomParam = urlParams.get('room');
    
    if (roomParam) {
      handleJoinRoom(roomParam);
    }
  }, [location]);

  const handleJoinRoom = (roomId) => {
    setCurrentRoom(roomId);
    setShowRoomManager(false);
    
    // Update URL without triggering a reload
    const newUrl = `/collaborate?room=${roomId}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setShowRoomManager(true);
    
    // Update URL to remove room parameter
    window.history.pushState({}, '', '/collaborate');
  };

  const features = [
    {
      icon: Code2,
      title: "Real-time Code Collaboration",
      description: "Write code together with multiple developers in real-time",
      color: isDarkMode ? "text-blue-400" : "text-blue-600",
      bgColor: isDarkMode ? "from-blue-500/20 to-cyan-500/20" : "from-blue-500/10 to-cyan-500/10",
      details: "Multi-cursor editing, live syntax highlighting, instant synchronization",
      status: "Available"
    },
    {
      icon: Video,
      title: "Integrated Video Chat",
      description: "Face-to-face communication while coding together",
      color: isDarkMode ? "text-purple-400" : "text-purple-600",
      bgColor: isDarkMode ? "from-purple-500/20 to-pink-500/20" : "from-purple-500/10 to-pink-500/10",
      details: "HD video calls, screen sharing, voice-only mode available",
      status: "Soon"
    },
    {
      icon: Terminal,
      title: "Advanced Code Compiler",
      description: "Execute code in 40+ programming languages instantly",
      color: isDarkMode ? "text-green-400" : "text-green-600",
      bgColor: isDarkMode ? "from-green-500/20 to-emerald-500/20" : "from-green-500/10 to-emerald-500/10",
      details: "Real-time compilation, debugging tools, performance metrics",
      status: "Available"
    },
    {
      icon: MessageCircle,
      title: "Smart Chat System",
      description: "Context-aware messaging with code snippets",
      color: isDarkMode ? "text-indigo-400" : "text-indigo-600",
      bgColor: isDarkMode ? "from-indigo-500/20 to-purple-500/20" : "from-indigo-500/10 to-purple-500/10",
      details: "Code highlighting in chat, file sharing, emoji reactions",
      status: "Available"
    },
    {
      icon: Users,
      title: "User Presence & Awareness",
      description: "See who's online and what they're working on",
      color: isDarkMode ? "text-teal-400" : "text-teal-600",
      bgColor: isDarkMode ? "from-teal-500/20 to-blue-500/20" : "from-teal-500/10 to-blue-500/10",
      details: "Live cursors, typing indicators, activity status",
      status: "Available"
    },
    {
      icon: Share2,
      title: "Instant Room Sharing",
      description: "Share coding sessions with a simple link",
      color: isDarkMode ? "text-pink-400" : "text-pink-600",
      bgColor: isDarkMode ? "from-pink-500/20 to-red-500/20" : "from-pink-500/10 to-red-500/10",
      details: "Password protection, time-limited access, guest permissions",
      status: "Available"
    }
  ];

  const stats = [
    { label: "Programming Languages", value: "40+", icon: Code2, color: isDarkMode ? "text-blue-400" : "text-blue-600" },
    { label: "Concurrent Users", value: "50+", icon: Users, color: isDarkMode ? "text-green-400" : "text-green-600" },
    { label: "Response Time", value: "<50ms", icon: Zap, color: isDarkMode ? "text-purple-400" : "text-purple-600" },
    { label: "Uptime", value: "99.9%", icon: Clock, color: isDarkMode ? "text-pink-400" : "text-pink-600" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // If user is in a room, show the collaborative editor
  if (currentRoom && !showRoomManager) {
    return (
      <div className="relative">
        {/* Back to Rooms Button */}
        <div className={`absolute top-4 left-4 z-10`}>
          <button
            onClick={handleLeaveRoom}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm transition-all hover:scale-105 ${
              isDarkMode 
                ? 'bg-zinc-900/50 border border-gray-700 text-gray-300 hover:bg-zinc-800/50' 
                : 'bg-white/50 border border-gray-300 text-gray-700 hover:bg-white/70'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            {/* <span className="text-sm font-medium">Back to Rooms</span> */}
          </button>
        </div>
        
        <CollaborativeEditor roomId={currentRoom} />
      </div>
    );
  }

  return (
    <div className={`relative flex mt-[-10px] flex-col items-center justify-center ${
      isDarkMode ? 'bg-zinc-900' : 'bg-white'
    }`}>
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden px-4 py-10 md:py-20 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              className={`inline-flex items-center gap-2 backdrop-blur-sm border rounded-full px-6 py-2 mb-6 ${
                isDarkMode 
                  ? 'bg-zinc-900/50 border-gray-700' 
                  : 'bg-white/50 border-gray-300'
              }`}
              variants={floatingVariants}
              animate="animate"
            >
              <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                Live Collaboration Platform
              </span>
            </motion.div>

            <h1 className={`relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl mb-6 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {"Code Together"
                .split(" ")
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: "easeInOut",
                    }}
                    className="mr-2 inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className={`relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Real-time collaborative coding with live chat, code execution, and video calls. Code together from anywhere.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1 }}
              className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <motion.button
                className={`w-60 transform rounded-lg px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-zinc-900 text-slate-300 hover:bg-zinc-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoomManager(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Start Collaborating
                </div>
              </motion.button>

              {user && (
                <motion.button
                  className={`w-60 transform rounded-lg border px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                    isDarkMode 
                      ? 'border-blue-500 bg-blue-600 text-white hover:bg-blue-700' 
                      : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRecentSessions(true)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <History className="w-5 h-5" />
                    Recent Sessions
                  </div>
                </motion.button>
              )}

              <motion.button
                className={`w-60 transform rounded-lg border px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-zinc-900 text-slate-300 hover:bg-zinc-800' 
                    : 'border-gray-300 bg-white text-black hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Room Manager */}
      <AnimatePresence>
        {showRoomManager && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full"
          >
            <RoomManager onJoinRoom={handleJoinRoom} />
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* Stats Section */}
      <motion.section 
        className={`px-4 py-20 w-full ${
          isDarkMode 
            ? 'bg-neutral-900/50' 
            : 'bg-neutral-100/50'
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Platform Capabilities
            </h2>
            <p className={`text-xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Built for scale, designed for performance
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    isDarkMode ? 'bg-zinc-900/50' : 'bg-white/50'
                  }`}>
                    <IconComponent className={`w-10 h-10 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="px-4 py-20 w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Ready to Code Together?
            </h2>
            <p className={`text-xl mb-8 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Join thousands of developers already collaborating in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className={`w-60 transform rounded-lg px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-zinc-900 text-slate-300 hover:bg-zinc-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoomManager(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Start Collaborating
                </div>
              </motion.button>
              
              <motion.button
                className={`w-60 transform rounded-lg border px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-zinc-900 text-slate-300 hover:bg-zinc-800' 
                    : 'border-gray-300 bg-white text-black hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/compiler')}
              >
                Try Solo Compiler
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Sessions Modal */}
      <AnimatePresence>
        {showRecentSessions && (
          <RecentSessions
            onJoinRoom={handleJoinRoom}
            onClose={() => setShowRecentSessions(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collab;
