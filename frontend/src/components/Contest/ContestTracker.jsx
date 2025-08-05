"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Search, Calendar, Clock, LinkIcon, Youtube, Loader2, ChevronLeft, ChevronRight, Filter, CalendarDays, List } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { config } from "../../config/config"
import { 
  getButtonClasses, 
  getCardClasses, 
  getTextClasses, 
  getBrandGradient, 
  getPageBackground,
  getPlatformColors,
  getShadowClasses
} from "../../theme/themeUtils"
import './ContestCalendar.css'

const ContestTracker = () => {
  const { isDarkMode, colors } = useTheme()
  
  // State Management
  const [contestData, setContestData] = useState({
    contests: [],
    loading: true,
    error: null,
  })
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [activeView, setActiveView] = useState('upcoming') // 'upcoming' or 'past'
  const [showMobileFilters, setShowMobileFilters] = useState(false) // Toggle for mobile filters

  // Check if mobile/tablet on mount and resize
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  
  // Fetch Contests
  const fetchContests = async () => {
    setContestData((prev) => ({ ...prev, loading: true, error: null }))
    try {
      // First, fetch fresh contests from external APIs
      await axios.get(`${config.API_BASE_URL}/api/codingkaro/contests/fetch`)
      
      // Then get the stored contests
      const response = await axios.get(`${config.API_BASE_URL}/api/codingkaro/contests`)
      setContestData({
        contests: response.data,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error("Fetch Error:", error)
      const errorMessage = error.response
        ? `Server Error: ${error.response.status}`
        : error.message || "Unknown error occurred"
      setContestData((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }

  // Refresh Solution Videos
  const refreshSolutionVideos = async () => {
    try {
      console.log('Triggering solution video refresh...')
      await axios.post(`${config.API_BASE_URL}/api/codingkaro/contests/refresh-solutions`)
      
      // Refetch contests to get updated solution links
      setTimeout(() => {
        fetchContests()
      }, 2000) // Wait 2 seconds for YouTube scraper to process
      
    } catch (error) {
      console.error("Error refreshing solution videos:", error)
    }
  }

  useEffect(() => {
    fetchContests()
  }, [])

  // Calendar utilities
  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getContestsForDate = (date) => {
    if (!date) return []
    
    return contestData.contests.filter(contest => {
      const contestDate = new Date(contest.start_time)
      return contestDate.toDateString() === date.toDateString()
    })
  }

  const filteredContests = useMemo(() => {
    return contestData.contests.filter(contest => {
      // Platform filter
      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(contest.platform)) {
        return false
      }
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return contest.title.toLowerCase().includes(searchLower) || 
               contest.platform.toLowerCase().includes(searchLower)
      }
      
      return true
    })
  }, [contestData.contests, selectedPlatforms, searchTerm])

  const upcomingContests = filteredContests
    .filter(contest => {
      const contestDate = new Date(contest.start_time)
      const now = new Date()
      // Use the backend's past flag primarily, but also check date as fallback
      return contest.past === false && contestDate > now
    })
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 15) // Show next 15 contests

  const pastContests = filteredContests
    .filter(contest => {
      const contestDate = new Date(contest.start_time)
      const now = new Date()
      // Use the backend's past flag primarily, but also check date as fallback
      return contest.past === true || contestDate < now
    })
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
    .slice(0, 20) // Show last 20 past contests

  // Debug logging to help understand contest categorization - moved after variable definitions
  useEffect(() => {
    if (contestData.contests.length > 0) {
      console.log('=== Contest Debug Info ===')
      console.log('Total contests:', contestData.contests.length)
      console.log('Upcoming contests:', upcomingContests.length)
      console.log('Past contests:', pastContests.length)
      
      // Log first few contests with their status
      contestData.contests.slice(0, 10).forEach(contest => {
        const contestDate = new Date(contest.start_time)
        const now = new Date()
        const isPast = contest.past === true || contestDate < now
        console.log(`${contest.title}: ${isPast ? 'PAST' : 'UPCOMING'} (${contestDate.toLocaleDateString()}) - Backend past flag: ${contest.past}`)
      })
      
      // Log solution links for past contests
      const pastWithSolutions = pastContests.filter(contest => contest.solution_link)
      console.log(`Past contests with solution videos: ${pastWithSolutions.length}`)
      pastWithSolutions.slice(0, 3).forEach(contest => {
        console.log(`- ${contest.title}: ${contest.solution_link}`)
      })
    }
  }, [contestData.contests, upcomingContests.length, pastContests.length])

  const platformColors = {
    'LeetCode': 'bg-orange-500',
    'Codeforces': 'bg-blue-500', 
    'CodeChef': 'bg-yellow-500',
    'AtCoder': 'bg-red-500'
  }

  const platformIcons = {
    'LeetCode': '🔶',
    'Codeforces': '🔹', 
    'CodeChef': '🔸',
    'AtCoder': '🔺'
  }

  // Get consistent theme-based platform colors
  const getPlatformThemeColors = (platform) => {
    const platformMap = {
      'LeetCode': 'leetcode',
      'Codeforces': 'codeforces', 
      'CodeChef': 'geeksforgeeks', // Using green theme for CodeChef
      'AtCoder': 'github' // Using gray theme for AtCoder
    }
    return getPlatformColors(platformMap[platform] || 'github', isDarkMode)
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const getTimeRemaining = (startTime) => {
    const now = new Date()
    const contestTime = new Date(startTime)
    const diff = contestTime - now

    if (diff <= 0) {
      return 'Completed'
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  if (contestData.loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors?.primary?.bg?.primary || (isDarkMode ? 'bg-slate-900' : 'bg-gray-50')}`}>
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`animate-spin w-12 h-12 ${getTextClasses(isDarkMode, 'accent')}`} />
          <p className={`${getTextClasses(isDarkMode, 'secondary')} text-lg font-medium`}>Loading contests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${colors?.primary?.bg?.primary || getPageBackground(isDarkMode)}`}>
      {/* Main Content Container - positioned directly below navbar */}
      <div className="flex overflow-hidden"
           style={{ 
             height: 'calc(100vh - 70px)',
             marginTop: '70px'
           }}>
        
        {/* Left Sidebar - Contest List */}
        <div className={`${isMobile ? 'w-full' : 'w-80 lg:w-96'} border-r ${colors?.navigation?.bg || (isDarkMode ? 'bg-slate-800/90' : 'bg-white/90')} ${colors?.navigation?.border || (isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50')} ${colors?.effects?.backdrop || 'backdrop-blur-sm'} flex flex-col ${getShadowClasses(isDarkMode, 'heavy')}`}>
          
          {/* Header Section */}
          <div className={`p-6 border-b ${colors?.navigation?.border || (isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50')} ${colors?.navigation?.bg || (isDarkMode ? 'bg-slate-800/90' : 'bg-white/90')} ${colors?.effects?.backdrop || 'backdrop-blur-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${getTextClasses(isDarkMode, 'primary')}`}>
                {activeView === 'upcoming' ? 'Upcoming Contests' : 'Past Contests'}
              </h2>
              <div className="flex items-center gap-2">
                {/* Refresh Button */}
                <button
                  onClick={activeView === 'past' ? refreshSolutionVideos : fetchContests}
                  className={`p-2 rounded-lg transition-all duration-200 ${getButtonClasses(isDarkMode, 'secondary')} hover:scale-105`}
                  title={activeView === 'past' ? 'Refresh Solution Videos' : 'Refresh Contests'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                
                {/* Mobile Filter Toggle Button */}
                {isMobile && (
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      showMobileFilters
                        ? getButtonClasses(isDarkMode, 'primary')
                        : getButtonClasses(isDarkMode, 'secondary')
                    } hover:scale-105`}
                    title="Toggle Search & Filters"
                  >
                    <Filter size={16} />
                  </button>
                )}
                {/* View Toggle */}
                <div className={`flex items-center rounded-lg p-1 ${colors?.card?.bg || getCardClasses(isDarkMode)}`}>
                  <button
                    onClick={() => setActiveView('upcoming')}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                      activeView === 'upcoming'
                        ? `${getButtonClasses(isDarkMode, 'primary')} ${getShadowClasses(isDarkMode, 'light')}`
                        : `${getTextClasses(isDarkMode, 'secondary')} hover:${getTextClasses(isDarkMode, 'primary')}`
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveView('past')}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                      activeView === 'past'
                        ? `${getButtonClasses(isDarkMode, 'primary')} ${getShadowClasses(isDarkMode, 'light')}`
                        : `${getTextClasses(isDarkMode, 'secondary')} hover:${getTextClasses(isDarkMode, 'primary')}`
                    }`}
                  >
                    Past
                  </button>
                </div>
              </div>
            </div>
            <p className={`text-sm ${getTextClasses(isDarkMode, 'muted')}`}>
              {activeView === 'upcoming' 
                ? "Don't miss scheduled events"
                : 'Review completed contests and solutions'
              }
            </p>
            
            {/* Collapsible Search and Filter Section for Mobile */}
            <div className={`transition-all duration-300 ease-in-out ${
              isMobile ? (showMobileFilters ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden') : 'mt-4'
            }`}>
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getTextClasses(isDarkMode, 'muted')}`} size={16} />
                <input
                  type="text"
                  placeholder="Search Contests"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    colors?.card?.bg || getCardClasses(isDarkMode)
                  } ${colors?.card?.border || (isDarkMode ? 'border-slate-600/50' : 'border-gray-300/50')} ${getTextClasses(isDarkMode, 'primary')} placeholder:${getTextClasses(isDarkMode, 'muted')} ${colors?.effects?.backdrop || 'backdrop-blur-sm'}`}
                />
              </div>
              
              {/* Platform Filter Dropdown */}
              <div>
                <select 
                  value={selectedPlatforms.length === 0 ? "" : selectedPlatforms[0]}
                  onChange={(e) => {
                    const platform = e.target.value
                    if (platform === "") {
                      setSelectedPlatforms([])
                    } else {
                      setSelectedPlatforms([platform])
                    }
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    colors?.card?.bg || getCardClasses(isDarkMode)
                  } ${colors?.card?.border || (isDarkMode ? 'border-slate-600/50' : 'border-gray-300/50')} ${getTextClasses(isDarkMode, 'primary')} ${colors?.effects?.backdrop || 'backdrop-blur-sm'}`}
                >
                  <option value="">All Platforms Selected</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="AtCoder">AtCoder</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contest List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-4">
              {(activeView === 'upcoming' ? upcomingContests : pastContests).length > 0 
                ? (activeView === 'upcoming' ? upcomingContests : pastContests).map(contest => {
                  const contestDate = new Date(contest.start_time)
                  const now = new Date()
                  const isPast = contest.past === true || contestDate < now
                  const platformTheme = getPlatformThemeColors(contest.platform)
                  
                  return (
                    <div
                      key={contest._id}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                        colors?.card?.bg || getCardClasses(isDarkMode)
                      } ${colors?.card?.border || (isDarkMode ? 'border-slate-600/50' : 'border-gray-200/50')} ${colors?.card?.hover || (isDarkMode ? 'hover:bg-slate-700/70' : 'hover:bg-white')} ${colors?.effects?.backdrop || 'backdrop-blur-sm'} ${getShadowClasses(isDarkMode, 'normal')}`}
                    >
                      {/* Date Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`text-xs font-medium ${getTextClasses(isDarkMode, 'muted')}`}>
                          {formatDate(contest.start_time)}
                        </div>
                        {isPast && (
                          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-red-900/30 text-red-300 border border-red-700/50' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                            Completed
                          </span>
                        )}
                      </div>
                      
                      {/* Contest Info */}
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${platformTheme?.iconBg || platformColors[contest.platform]}`}></div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm leading-tight mb-2 ${getTextClasses(isDarkMode, 'primary')}`}>
                            {contest.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs mb-3">
                            <span className={getTextClasses(isDarkMode, 'secondary')}>
                              {formatTime(contest.start_time)} - {formatTime(new Date(new Date(contest.start_time).getTime() + 2*60*60*1000).toISOString())}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
                                colors?.card?.bg || (isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100')
                              } ${platformTheme?.iconText || getTextClasses(isDarkMode, 'secondary')}`}>
                                <span>{platformIcons[contest.platform] || '📝'}</span>
                                {contest.platform}
                              </span>
                            </div>
                            <span className={`text-xs ${getTextClasses(isDarkMode, 'muted')}`}>
                              {contest.platform}
                            </span>
                          </div>
                          <div className="text-xs mb-3">
                            <span className={getTextClasses(isDarkMode, 'secondary')}>
                              ⏰ {getTimeRemaining(contest.start_time)}
                            </span>
                          </div>
                          <div className="text-xs mb-3">
                            <span className={`${getTextClasses(isDarkMode, 'secondary')} truncate block`}>
                              📍 {contest.url.includes('codechef') ? 'https://www.codechef.com/START198' : contest.url}
                            </span>
                          </div>
                          <div className="text-xs mb-4">
                            <span className={getTextClasses(isDarkMode, 'secondary')}>
                              🏢 {contest.platform}
                            </span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={contest.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                getButtonClasses(isDarkMode, 'outline')
                              } hover:scale-105`}
                            >
                              {isPast ? 'View Contest' : 'Join Contest'}
                            </a>
                            
                            {isPast && (
                              <>
                                {/* Solution Video Button - if available */}
                                {contest.solution_link ? (
                                  <a
                                    href={contest.solution_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 hover:scale-105 ${
                                      isDarkMode 
                                        ? 'bg-red-600 text-white hover:bg-red-500' 
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                    title="Watch Solution Video"
                                  >
                                    <Youtube size={12} />
                                    Video
                                  </a>
                                ) : (
                                  <span className={`text-xs px-3 py-1.5 rounded-lg cursor-not-allowed ${
                                    isDarkMode 
                                      ? 'bg-slate-600 text-slate-400' 
                                      : 'bg-gray-400 text-white'
                                  }`}>
                                    Video Soon
                                  </span>
                                )}
                                
                                {/* Editorial/Solutions Button */}
                                <button
                                  onClick={() => {
                                    // Open solutions/editorial based on platform
                                    let solutionUrl = contest.url;
                                    
                                    if (contest.platform === 'LeetCode') {
                                      const contestName = contest.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                      solutionUrl = `https://leetcode.com/contest/${contestName}/`;
                                    } else if (contest.platform === 'Codeforces') {
                                      // Extract contest ID from URL for editorial
                                      const contestId = contest.url.split('/contest/')[1];
                                      solutionUrl = `https://codeforces.com/blog/entry/editorial-${contestId}`;
                                    } else if (contest.platform === 'CodeChef') {
                                      solutionUrl = `https://discuss.codechef.com/search?q=${encodeURIComponent(contest.title)}`;
                                    }
                                    
                                    window.open(solutionUrl, '_blank');
                                  }}
                                  className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                                    isDarkMode 
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                  title="View Solutions & Editorial"
                                >
                                  Editorial
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(contest.url);
                                // You can add a toast notification here
                              }}
                              className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${getButtonClasses(isDarkMode, 'secondary')}`}
                              title="Copy Contest Link"
                            >
                              Copy Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-center py-12">
                    <Calendar size={48} className={`mx-auto ${getTextClasses(isDarkMode, 'muted')} mb-4`} />
                    <p className={getTextClasses(isDarkMode, 'secondary')}>
                      {activeView === 'upcoming' ? 'No upcoming contests found' : 'No past contests found'}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Side - Calendar */}
        <div className={`${isMobile ? 'hidden' : 'flex-1'} ${colors?.navigation?.bg || (isDarkMode ? 'bg-slate-800/90' : 'bg-white/90')} ${colors?.effects?.backdrop || 'backdrop-blur-sm'} flex flex-col ${getShadowClasses(isDarkMode, 'heavy')}`}>
          
          {/* Calendar Header */}
          <div className={`p-6 border-b ${colors?.navigation?.border || (isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50')}`}>
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-bold ${getTextClasses(isDarkMode, 'primary')}`}>
                {getMonthName(currentDate)}
              </h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${getButtonClasses(isDarkMode, 'secondary')}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${getButtonClasses(isDarkMode, 'primary')} ${getShadowClasses(isDarkMode, 'normal')}`}
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${getButtonClasses(isDarkMode, 'secondary')}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div
                  key={day}
                  className={`p-3 text-center text-sm font-medium ${getTextClasses(isDarkMode, 'muted')}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2 auto-rows-fr">
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayContests = date ? getContestsForDate(date) : []
                const isToday = date && date.toDateString() === new Date().toDateString()
                const hasContests = dayContests.length > 0
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer ${
                      colors?.card?.bg || getCardClasses(isDarkMode)
                    } ${colors?.card?.border || (isDarkMode ? 'border-slate-600/50' : 'border-gray-200/50')} ${
                      colors?.card?.hover || (isDarkMode ? 'hover:border-slate-500/50' : 'hover:border-gray-300/50')
                    } ${isToday ? `ring-2 ring-purple-500 ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}` : ''}`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday 
                            ? getTextClasses(isDarkMode, 'accent') 
                            : getTextClasses(isDarkMode, 'primary')
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayContests.slice(0, 3).map(contest => {
                            const contestDate = new Date(contest.start_time)
                            const now = new Date()
                            const isPast = contest.past === true || contestDate < now
                            const platformIcon = platformIcons[contest.platform] || '📝'
                            const platformTheme = getPlatformThemeColors(contest.platform)
                            return (
                              <a
                                key={contest._id}
                                href={contest.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block text-xs p-1 rounded-lg text-white truncate cursor-pointer transition-all duration-200 hover:opacity-80 hover:scale-105 ${
                                  platformTheme?.progress || platformColors[contest.platform] || 'bg-gray-500'
                                } ${isPast ? 'opacity-60' : ''}`}
                                title={`${contest.title} ${isPast ? '(Completed)' : ''} - Click to view contest`}
                              >
                                <div className="flex items-center gap-1">
                                  <span>{platformIcon}</span>
                                  <span className="truncate">{contest.title.slice(0, 12)}...</span>
                                </div>
                              </a>
                            )
                          })}
                          {dayContests.length > 3 && (
                            <div className={`text-xs p-1 rounded-lg text-center cursor-pointer hover:opacity-80 transition-all duration-200 ${
                              colors?.card?.bg || (isDarkMode ? 'bg-slate-600/50' : 'bg-gray-200')
                            } ${getTextClasses(isDarkMode, 'secondary')}`}>
                              +{dayContests.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContestTracker