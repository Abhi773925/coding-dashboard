"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import prepmateLogo from "../../assets/prepmate-logo.png"
import {
  Globe,
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
  Zap,
  Code2,
  MessageSquare,
  
  Brain,
  Network,
  Cpu,
  Box
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import config from '../../config/api'

// Backend URL Configuration
const BACKEND_URL = config.BACKEND_URL

const navigationSections = [
  {
    name: "Contest",
    icon: BookOpen,
    bgColor: "bg-indigo-100",
    color: "text-indigo-600",
    subSections: [{ name: "Contest Tracker", icon: Terminal, route: "/contest" }],
  },
  {
    name: "Courses",
    icon: BookOpen,
    bgColor: "bg-indigo-100",
    color: "text-indigo-600",
    subSections: [
      { name: "DSA Practice", icon: Terminal, route: "/courses/data-structures" },
      { name: "Full Stack", icon: Code2, route: "/courses/fullstack" },
      { name: "All Courses", icon: BookOpen, route: "/allcourse" },
    ],
  },
  {
    name: "Technical Articles",
    icon: Brain,
    bgColor: "bg-purple-100",
    color: "text-purple-600",
    subSections: [
      { name: "Computer Networks", icon: Network, route: "/articles/computer-networks" },
      { name: "Operating Systems", icon: Cpu, route: "/articles/operating-systems" },
      { name: "OOP Concepts", icon: Box, route: "/articles/oops" },
  
      {name: "SQL Basics", icon: Terminal, route: "/sql-notes" },
       { name: "All Articles", icon: BookOpen, route: "/interview-series" },
    ],
  }
  
]

// Enhanced Streak Component for Navigation
const StreakDisplay = () => {
  const { isDarkMode } = useTheme()
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    const fetchStreak = async (attempt = 0) => {
      try {
        setError(false)
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail) {
          setLoading(false)
          return
        }
        
        // Get cached streak data if available
        const cachedStreak = localStorage.getItem("userStreak")
        if (cachedStreak && attempt === 0) {
          try {
            const parsed = JSON.parse(cachedStreak)
            setStreak(parsed)
          } catch (e) {
            console.warn("Invalid cached streak data, removing...")
            localStorage.removeItem("userStreak")
          }
        }

        const response = await axios.get(`${config.BACKEND_URL}/api/streak`, {
          params: { email: userEmail },
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        })
        
        if (response.data) {
          // Validate the response data
          const validatedData = {
            currentStreak: response.data.currentStreak || 0,
            longestStreak: response.data.longestStreak || 0,
            lastCodedDate: response.data.lastCodedDate || null
          }
          
          setStreak(validatedData)
          setLoading(false)
          setRetryCount(0)
          
          // Cache the streak data
          localStorage.setItem("userStreak", JSON.stringify(validatedData))

          // Update streak on activity - use a try/catch to prevent this from breaking the UI
          try {
            await axios.post(`${config.BACKEND_URL}/api/streak/update`, {
              email: userEmail
            }, { 
              timeout: 10000,
              withCredentials: true 
            })
          } catch (updateErr) {
            console.warn("Failed to update streak activity:", updateErr.message)
            // Continue without throwing - this is non-critical
          }
        }
      } catch (err) {
        console.error("Error fetching streak:", err)
        
        // Retry logic with exponential backoff
        if (attempt < maxRetries) {
          const backoffTime = Math.pow(2, attempt) * 1000 // exponential backoff: 1s, 2s, 4s
          console.log(`Retrying streak fetch in ${backoffTime/1000}s (attempt ${attempt + 1}/${maxRetries})`)
          setTimeout(() => fetchStreak(attempt + 1), backoffTime)
          setRetryCount(attempt + 1)
        } else {
          setError(true)
          setLoading(false)
          
          // Try to use cached data as fallback
          const cachedStreak = localStorage.getItem("userStreak")
          if (cachedStreak) {
            try {
              const parsed = JSON.parse(cachedStreak)
              setStreak(parsed)
              console.log("Using cached streak data as fallback")
            } catch (e) {
              console.warn("Failed to parse cached streak data")
            }
          }
        }
      }
    }

    // Initial fetch
    fetchStreak()

    // Set up automatic refresh every hour, but only if the component is still mounted
    const intervalId = setInterval(() => fetchStreak(), 3600000) // 1 hour in milliseconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Remove loading state

  // Show error state with fallback to cached data
  if (error && streak.currentStreak === 0) {
    return (
      <div
        className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
          isDarkMode
            ? "bg-zinc-900/60 text-gray-400 border border-slate-700/50"
            : "bg-gray-100/80 text-gray-600 border border-gray-200/50"
        }`}
        title="Streak service is temporarily unavailable. Your progress is still being tracked."
      >
        <Zap size={18} className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
        <span className="text-sm font-semibold">Offline</span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${
        isDarkMode
          ? "bg-zinc-900/60 text-orange-400 border border-slate-700/50"
          : "bg-orange-100/80 text-orange-600 border border-orange-200/50"
      }`}
      style={{
        boxShadow: isDarkMode ? "0 4px 15px rgba(251, 146, 60, 0.1)" : "0 4px 15px rgba(251, 146, 60, 0.1)",
      }}
      title={error ? "Using cached data - service temporarily unavailable" : `Current streak: ${streak.currentStreak} days`}
    >
      <Zap size={18} className={error ? "text-amber-500" : "text-orange-500"} />
      <span className="text-sm font-semibold">
        {streak.currentStreak} day{streak.currentStreak !== 1 ? "s" : ""}
      </span>
      {error && (
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Using cached data" />
      )}
    </div>
  )
}

const ProfileDropdown = ({ onLogin, onLogout, isMobile = false }) => {
  const { isDarkMode } = useTheme()
  const { user, login, logout, isLoggedIn } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const profileMenuItems = [
    {
      name: "My Profile",
      icon: UserCircle,
      color: "text-indigo-400",
      route: "/profile",
    }
  ]

  // Determine the position of the dropdown based on whether it's mobile or desktop
  const dropdownPosition = isMobile ? "bottom-0 left-0 right-0" : "top-24 right-4"

  return (
    <div className="relative">
      {isLoggedIn ? (
        <>
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`
              flex items-center ${isMobile ? 'space-x-2 p-2' : 'space-x-3 p-3'} rounded-xl cursor-pointer
              transition-all duration-300 group backdrop-blur-sm
              ${
                isDarkMode
                  ? "hover:bg-zinc-900/60 border border-slate-700/50"
                  : "hover:bg-white/80 border border-gray-200/50"
              }
            `}
            style={{
              boxShadow: isDarkMode ? "0 4px 15px rgba(139, 92, 246, 0.1)" : "0 4px 15px rgba(139, 92, 246, 0.1)",
            }}
          >
            <div className="relative">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="User Avatar"
                className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border-2 transition-all duration-300 group-hover:scale-105 border-indigo-500`}
              />
              <div className={`absolute bottom-0 right-0 ${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-emerald-500 rounded-full border-2 border-white`} />
            </div>
            {!isMobile && (
              <div className="flex flex-col">
                <span className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {user?.name}
                </span>
              </div>
            )}
            <ChevronDown
              size={isMobile ? 12 : 16}
              className={`transition-transform ${isProfileMenuOpen ? "rotate-180" : ""} ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            />
          </div>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: isMobile ? 20 : -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: isMobile ? 20 : -20, scale: 0.95 }}
                className={`
                  fixed ${dropdownPosition} w-full sm:w-80
                  ${isDarkMode ? "bg-zinc-900/60 border-none" : "bg-white/95 border-gray-200/50"}
                  border rounded-2xl shadow-2xl backdrop-blur-md
                  overflow-hidden z-50
                `}
                style={{
                  boxShadow: isDarkMode ? "0 25px 50px rgba(0, 0, 0, 0.5)" : "0 25px 50px rgba(0, 0, 0, 0.15)",
                }}
              >
                {/* User Profile Header */}
                {!isMobile && (
                  <div
                    className={`
                    p-6 flex items-center space-x-4
                    ${isDarkMode ? "bg-zinc-900/60" : "bg-gray-50/50"}
                  `}
                  >
                    <img
                      src={user?.avatar || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-16 h-16 rounded-full border-2 border-purple-500"
                    />
                    <div>
                      <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {user?.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>{user?.email}</p>
                    </div>
                  </div>
                )}

                {/* User Details */}
                {!isMobile && (
                  <div className="p-6">
                    <div className={`grid grid-cols-3 gap-4 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-400" size={20} />
                        <span className="text-sm font-medium">Beginner</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="text-blue-400" size={20} />
                        <span className="text-sm font-medium">2024</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Map className="text-green-400" size={20} />
                        <span className="text-sm font-medium">Global</span>
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
                      flex items-center space-x-4 p-4 cursor-pointer
                      transition-all duration-300 group no-underline
                      border-t ${isDarkMode ? "border-slate-700/50" : "border-gray-200/50"}
                      ${isDarkMode ? "hover:bg-zinc-900/60 text-slate-300" : "hover:bg-gray-50/50 text-gray-800"}
                    `}
                  >
                    <item.icon className={`${item.color} group-hover:scale-110 transition-transform`} size={22} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}

                {/* Logout */}
                <div
                  onClick={logout}
                  className={`
                    flex items-center space-x-4 p-4 cursor-pointer
                    border-t ${isDarkMode ? "border-slate-700/50" : "border-gray-200/50"}
                    transition-all duration-300 group
                    ${isDarkMode ? "hover:bg-red-900/30 text-red-300" : "hover:bg-red-50/50 text-red-600"}
                  `}
                >
                  <LogOut
                    className={`
                      ${isDarkMode ? "text-red-400" : "text-red-500"}
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
            flex items-center space-x-2 h-1 px-4 py-2  rounded-xl  ${isMobile ? 'text-sm' : 'text-sm'}
            transition-all duration-300 transform hover:scale-105 backdrop-blur-sm
            ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            }
          `}
          style={{
            boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
          }}
        >
          <LogIn size={isMobile ? 16 : 12} />
          <span >Login</span>
        </button>
      )}
    </div>
  )
}

const MobileMenu = ({ isOpen, onClose, navigationSections }) => {
  const { isDarkMode } = useTheme()
  const { user, login, logout, isLoggedIn } = useAuth()
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName)
  }

  // Get section-specific styling
  const getSectionStyling = (sectionName) => {
    const styles = {
      "Contest": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      },
      "Courses": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      },
      "Technical Articles": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      },
      "Collaboration": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      }
    }
    return styles[sectionName] || {
      bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
      bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
      text: isDarkMode ? "text-slate-300" : "text-slate-700",
      accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className={`
            fixed inset-0 z-50 overflow-y-auto
            ${isDarkMode ? "bg-zinc-900/95" : "bg-white/95"}
            backdrop-blur-md
          `}
        >
          {/* Mobile Menu Header */}
          <div
            className={`
            flex justify-between items-center p-6
            ${isDarkMode ? "bg-zinc-900 text-slate-300" : "bg-white text-slate-700"}
          `}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`rounded-xl flex items-center justify-center
               `}
              >
              <Link to="/" className="text-xl font-bold tracking-tight pl-4">
              <img src={prepmateLogo} alt="Prepmate Logo" className="h-[50px] w-[50px] sm:h-15" />
            </Link>
              </div>
             
            </div>
            <button
              onClick={onClose}
              className={`
                p-3 rounded-xl transition-all duration-300 hover:scale-105
                ${isDarkMode ? "hover:bg-zinc-800/50 text-slate-400" : "hover:bg-gray-100/50 text-slate-600"}
              `}
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6">
            <ProfileDropdown onLogin={login} onLogout={logout} isMobile={true} />
          </div>

          {/* Streak Info (Mobile) */}
          {isLoggedIn && (
            <div className="px-6 pb-6">
              <StreakDisplay />
            </div>
          )}

          {/* Navigation Sections */}
          {navigationSections.map((section) => (
            <div key={section.name} className="px-6 py-2">
              <div
                className={`
                  flex items-center justify-between p-4 rounded-xl cursor-pointer
                  transition-all duration-300 backdrop-blur-sm
                  ${getSectionStyling(section.name).bg}
                  ${getSectionStyling(section.name).text}
                `}
                style={{
                  background: `linear-gradient(135deg, ${getSectionStyling(section.name).accent.replace('from-', '').replace(' to-', ', ')})`
                }}
                onClick={() => toggleSection(section.name)}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className={section.color} size={24} />
                  <span className="text-lg font-semibold">{section.name}</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`
                    transition-transform
                    ${openSection === section.name ? "rotate-180" : ""}
                  `}
                />
              </div>

              <AnimatePresence>
                {openSection === section.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 ml-4 space-y-2"
                  >
                    {section.subSections.map((subSection) => (
                      <Link
                        key={subSection.name}
                        to={subSection.route}
                        onClick={onClose}
                        className={`
                          flex items-center justify-between p-3 rounded-lg
                          cursor-pointer transition-all duration-300 group no-underline
                          ${isDarkMode 
                            ? "text-slate-300 hover:bg-zinc-800/50 hover:text-slate-300" 
                            : "text-slate-700 hover:bg-gray-100/50 hover:text-slate-700"}
                          border ${isDarkMode ? "border-zinc-700/50" : "border-gray-200/50"}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <subSection.icon
                            className={`
                              ${isDarkMode ? "text-slate-400" : "text-slate-600"}
                              group-hover:scale-110 transition-transform
                            `}
                            size={20}
                          />
                          <span className="font-medium">{subSection.name}</span>
                        </div>
                        <ChevronRight
                          className={`
                            ${isDarkMode ? "text-slate-500" : "text-slate-400"}
                            group-hover:translate-x-1 transition-transform
                          `}
                          size={18}
                        />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Navigation = () => {
  const { isDarkMode, toggleTheme, colors, schemes } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [openSection, setOpenSection] = useState(null)
  const { user, isLoggedIn, login } = useAuth()

  // Screen Size Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName)
  }

  // Get section-specific styling
  const getSectionStyling = (sectionName) => {
    const styles = {
      "Contest": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      },
      "Courses": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      },
      "Technical Articles": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      },
      "Collaboration": {
        bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
        bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
        text: isDarkMode ? "text-slate-300" : "text-slate-700",
        accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
      }
    }
    return styles[sectionName] || {
      bgHover: isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-gray-100/50",
      bg: isDarkMode ? "bg-zinc-800/30" : "bg-gray-100/30",
      text: isDarkMode ? "text-slate-300" : "text-slate-700",
      accent: isDarkMode ? "from-transparent to-transparent" : "from-gray-500/10 to-slate-500/10"
    }
  }

  useEffect(() => {
    // Check for session token in URL
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    if (token) {
      localStorage.setItem("sessionToken", token)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  // Desktop Navigation Render
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const resourceLinks = [
    { name: "Contest Tracker", route: "/contest" },
    { name: "DSA Practice", route: "/courses/data-structures" },
    { name: "Full Stack", route: "/courses/fullstack" },
    { name: "All Courses", route: "/allcourse" },
    { name: "Computer Networks", route: "/articles/computer-networks" },
    { name: "Operating Systems", route: "/articles/operating-systems" },
    { name: "OOP Concepts", route: "/articles/oops" },
    { name: "SQL Basics", route: "/sql-notes" },
    { name: "All Articles", route: "/interview-series" }
  ];
  const handleLogoClick = () => {
    window.location.href = "/";
  }
  const renderDesktopNavigation = () => (
    <nav
      className={`hidden lg:flex fixed top-0 left-0 right-0  z-40 items-center justify-between px-8 py-2 transition-all duration-300 ${isDarkMode ? 'bg-zinc-900/95' : 'bg-white/95'}`}
      style={{ backdropFilter: 'blur(10px) saturate(180%)' }}
    >
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-4" onClick={handleLogoClick}>
        <img src={prepmateLogo} alt="Logo" className="h-12 w-12 rounded-lg" />
      </div>

      {/* Right: Terminal, Resources Dropdown, Theme Toggle, Profile/Login */}
      <div className="flex items-center gap-6 relative">
        {/* Terminal Icon and Label */}
        <Link to="/terminal" className="flex items-center gap-2 text-lg font-medium select-none transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-orange-100 dark:hover:bg-zinc-800/50">
          <Terminal size={20} className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} />
          <span className={isDarkMode ? 'text-orange-400' : 'text-orange-600'}>Terminal</span>
        </Link>
        {/* Resources Dropdown */}
        <div
          className={`relative text-lg font-medium cursor-pointer select-none ${isDarkMode ? 'text-slate-200 hover:text-orange-400' : 'text-zinc-800 hover:text-orange-600'} transition-colors flex items-center`}
          onMouseEnter={() => setResourcesOpen(true)}
          onClick={() => setResourcesOpen(!resourcesOpen)}
        >
          <span>Resources</span>
          <ChevronDown size={18} className="inline ml-1 align-middle" />
          {resourcesOpen && (
            <div className={`absolute right-0 mt-120  max-h-[70vh] overflow-y-auto w-56 rounded-xl shadow-xl z-50 ${isDarkMode ? 'bg-zinc-900/95 border border-zinc-700/50' : 'bg-white/95 border border-gray-200/50'}`}>
              {resourceLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.route}
                  className={`block px-5 py-3 text-base no-underline transition-colors duration-200 ${isDarkMode ? 'text-slate-200 hover:bg-zinc-800/50 hover:text-orange-400' : 'text-zinc-800 hover:bg-gray-100/50 hover:text-orange-600'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${isDarkMode ? 'text-slate-400 hover:bg-zinc-800/50 hover:text-slate-300' : 'text-slate-600 hover:bg-gray-100/50 hover:text-slate-700'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        {/* Profile Section or Login Button */}
        {isLoggedIn ? (
          <div className="relative">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="h-10 w-10 rounded-full border-2 border-orange-400 cursor-pointer"
              onClick={() => setProfileOpen((open) => !open)}
            />
            {profileOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-50 ${isDarkMode ? 'bg-zinc-900/95 border border-zinc-700/50' : 'bg-white/95 border border-gray-200/50'}`}>
                <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-700">
                  <div className="font-semibold text-lg mb-1">{user?.name || 'User'}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">{user?.email || ''}</div>
                </div>
                <Link
                  to="/profile"
                  className={`block px-5 py-3 text-base no-underline transition-colors duration-200 ${isDarkMode ? 'text-slate-200 hover:bg-zinc-800/50 hover:text-orange-400' : 'text-zinc-800 hover:bg-gray-100/50 hover:text-orange-600'}`}
                  onClick={() => setProfileOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  className={`w-full text-left px-5 py-3 text-base transition-colors duration-200 ${isDarkMode ? 'text-red-300 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50/50'}`}
                  onClick={() => { setProfileOpen(false); if (typeof logout === 'function') logout(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={login}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'}`}
            style={{ boxShadow: isDarkMode ? '0 8px 25px rgba(139, 92, 246, 0.3)' : '0 8px 25px rgba(139, 92, 246, 0.2)' }}
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  )

  // Enhanced Mobile Navigation Render
  const renderMobileNavigation = () => (
    <>
      <nav
        className={`
          lg:hidden fixed top-0 left-0 right-0 z-40
          px-6 py-4
          ${isDarkMode ? 'bg-zinc-900/95' : 'bg-white/95'}
        `}
        style={{
          backdropFilter: 'blur(10px) saturate(180%)',
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div
              className={`rounded-xl flex items-center justify-center
            `}
             
            >
            <Link to="/" className={`text-xl font-bold tracking-tight pl-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <img src={prepmateLogo} alt="Prepmate Logo" className="h-[50px] w-[50px] sm:h-15" />
            </Link>
            </div>
            
          </div>

          <div className="flex items-center space-x-4">
            {/* Terminal/Compiler Button for Mobile */}
            <Link
              to="/terminal"
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-gradient-to-r from-purple-500 to-blue-500
                text-white font-medium text-xs
                transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                hover:from-purple-600 hover:to-blue-600
                active:scale-95
              `}
              title="Open Code Compiler"
            >
              <Terminal size={14} />
              <span>Terminal</span>
            </Link>

            {/* Mobile Streak Display */}
            {!!user && <StreakDisplay />}

            {/* Profile Section for Mobile */}
            {/* <ProfileDropdown onLogin={() => {}} onLogout={() => {}} isMobile={true} /> */}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isDarkMode ? "text-slate-300 hover:bg-zinc-800/50" : "text-slate-700 hover:bg-gray-100/50"}
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
  )

  return (
    <div className={`${isDarkMode ? "dark bg-zinc-900 text-slate-300" : "bg-white text-slate-700"}`}>
      {isMobile ? renderMobileNavigation() : renderDesktopNavigation()}
    </div>
  )
}

export default Navigation;    