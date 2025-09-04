import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';
import Compiler from './Compiler';

const Collab = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showCompiler, setShowCompiler] = useState(false);

  const features = [
    {
      icon: Code2,
      title: "Real-time Code Collaboration",
      description: "Write code together with multiple developers in real-time",
      color: isDarkMode ? "text-blue-400" : "text-blue-600",
      bgColor: isDarkMode ? "from-blue-500/20 to-cyan-500/20" : "from-blue-500/10 to-cyan-500/10",
      details: "Multi-cursor editing, live syntax highlighting, instant synchronization"
    },
    {
      icon: Video,
      title: "Integrated Video Chat",
      description: "Face-to-face communication while coding together",
      color: isDarkMode ? "text-purple-400" : "text-purple-600",
      bgColor: isDarkMode ? "from-purple-500/20 to-pink-500/20" : "from-purple-500/10 to-pink-500/10",
      details: "HD video calls, screen sharing, voice-only mode available"
    },
    {
      icon: Terminal,
      title: "Advanced Code Compiler",
      description: "Execute code in 40+ programming languages instantly",
      color: isDarkMode ? "text-green-400" : "text-green-600",
      bgColor: isDarkMode ? "from-green-500/20 to-emerald-500/20" : "from-green-500/10 to-emerald-500/10",
      details: "Real-time compilation, debugging tools, performance metrics"
    },
    {
      icon: GitBranch,
      title: "Version Control Integration",
      description: "Built-in Git support for seamless collaboration",
      color: isDarkMode ? "text-orange-400" : "text-orange-600",
      bgColor: isDarkMode ? "from-orange-500/20 to-red-500/20" : "from-orange-500/10 to-red-500/10",
      details: "Branch management, merge conflicts resolution, commit history"
    },
    {
      icon: MessageCircle,
      title: "Smart Chat System",
      description: "Context-aware messaging with code snippets",
      color: isDarkMode ? "text-indigo-400" : "text-indigo-600",
      bgColor: isDarkMode ? "from-indigo-500/20 to-purple-500/20" : "from-indigo-500/10 to-purple-500/10",
      details: "Code highlighting in chat, file sharing, emoji reactions"
    },
    {
      icon: Share2,
      title: "Instant Room Sharing",
      description: "Share coding sessions with a simple link",
      color: isDarkMode ? "text-teal-400" : "text-teal-600",
      bgColor: isDarkMode ? "from-teal-500/20 to-blue-500/20" : "from-teal-500/10 to-blue-500/10",
      details: "Password protection, time-limited access, guest permissions"
    }
  ];

  const stats = [
    { label: "Programming Languages", value: "40+", icon: Code2, color: isDarkMode ? "text-blue-400" : "text-blue-600" },
    { label: "Concurrent Users", value: "50+", icon: Users, color: isDarkMode ? "text-green-400" : "text-green-600" },
    { label: "Response Time", value: "<50ms", icon: Zap, color: isDarkMode ? "text-purple-400" : "text-purple-600" },
    { label: "Uptime", value: "99.9%", icon: Clock, color: isDarkMode ? "text-pink-400" : "text-pink-600" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

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

  return (
    <div className={`relative flex mt-[-10px] flex-col items-center justify-center ${
      isDarkMode ? 'bg-zinc-900' : 'bg-white'
    }`}>
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden px-4 py-10 md:py-35 w-full"
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
                Revolutionary Collaboration Platform
              </span>
            </motion.div>

            <h1 className={`relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl mb-6 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {"Collaboration & Compiler"
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
              Real-time collaboration and advanced compiler features coming soon.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1 }}
              className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <motion.button
                className={`w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-zinc-900 text-slate-300 hover:bg-zinc-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCompiler(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Try Compiler
                </div>
              </motion.button>

              <motion.button
                className={`w-60 transform rounded-lg border px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-zinc-900 text-slate-300 hover:bg-zinc-900' 
                    : 'border-gray-300 bg-white text-black hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

       
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="px-4 py-20 w-full"
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
              Powerful Features
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Everything you need for seamless collaborative coding experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={`group relative backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border ${
                    isDarkMode 
                      ? 'bg-zinc-900/50 border-gray-700' 
                      : 'bg-white/70 border-gray-300'
                  } ${
                    activeFeature === index ? 'ring-2 ring-indigo-500/50 scale-105' : ''
                  }`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`mb-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {feature.description}
                  </p>
                  
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {feature.details}
                  </p>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      feature.title === "Advanced Code Compiler"
                        ? (isDarkMode ? 'bg-green-500 text-white' : 'bg-green-600 text-white')
                        : (isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white')
                    }`}>
                      {feature.title === "Advanced Code Compiler" ? "Available" : "Soon"}
                    </span>
                  </div>

                  {/* Try Now Button for Compiler */}
                  {feature.title === "Advanced Code Compiler" && (
                    <motion.button
                      onClick={() => setShowCompiler(true)}
                      className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-4 h-4" />
                      Try Now
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

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
              Stay Updated
            </h2>
            <p className={`text-xl mb-8 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Be the first to know when collaboration and compiler features launch.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className={`w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-zinc-900 text-slate-300 hover:bg-zinc-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCompiler(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Try Compiler
                </div>
              </motion.button>
              
              <motion.button
                className={`w-60 transform rounded-lg border px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-zinc-900 text-slate-300 hover:bg-zinc-900' 
                    : 'border-gray-300 bg-white text-black hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Compiler Modal/Overlay */}
      <AnimatePresence>
        {showCompiler && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowCompiler(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-7xl h-[90vh] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-green-400">
                  PrepMate Compiler
                </h2>
                <button
                  onClick={() => setShowCompiler(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(90vh-80px)]">
                <Compiler />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collab;
