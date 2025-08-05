"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Search, Calendar, Clock, LinkIcon, Youtube, Loader2, ChevronLeft, ChevronRight, Filter, Menu, X, CalendarDays, List } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import './ContestCalendar.css'

const ContestTracker = () => {
  const { isDarkMode } = useTheme()
  
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mobileView, setMobileView] = useState('list') // 'list' or 'calendar'
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

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
      const response = await axios.get("https://prepmate-kvol.onrender.com/api/codingkaro/contests")
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
    .filter(contest => !contest.past)
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 10) // Show only next 10 contests

  const platformColors = {
    'LeetCode': 'bg-orange-500',
    'Codeforces': 'bg-blue-500',
    'CodeChef': 'bg-yellow-500',
    'AtCoder': 'bg-red-500'
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

  if (contestData.loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <Loader2 className={`animate-spin text-4xl ${isDarkMode ? "text-indigo-400" : "text-indigo-600"} mb-4`} />
          <p className={isDarkMode ? "text-slate-300" : "text-gray-700"}>Loading contests...</p>
        </div>
      </div>
    )
  }

  return ( 
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
         style={{ marginTop: '60px' }}>
      {/* Enhanced Mobile Header with better navigation - positioned directly below navbar */}
      <div className={`lg:hidden px-4 py-3 border-b bg-white dark:bg-gray-800 shadow-sm ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contest Tracker
          </h1>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setMobileView('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mobileView === 'list' 
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm transform scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setMobileView('calendar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mobileView === 'calendar' 
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm transform scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              <CalendarDays size={16} />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container with improved responsive layout */}
      <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 70px)' }}>
        
        {/* Enhanced Sidebar with better scrolling and responsive design */}
        <div className={`${
          isMobile 
            ? (mobileView === 'list' ? 'w-full' : 'hidden')
            : isTablet 
              ? 'w-96' 
              : 'w-80 lg:w-96'
        } border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col shadow-lg`}>
          
          {/* Search and Filters Section with navbar integration */}
          <div className={`p-4 lg:p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {/* Search Bar with improved styling */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search contests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                } shadow-sm hover:shadow-md focus:shadow-lg`}
              />
            </div>
            
            {/* Enhanced Platform Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Platform</p>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {selectedPlatforms.length === 0 ? 'All' : selectedPlatforms.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['LeetCode', 'Codeforces', 'CodeChef'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      selectedPlatforms.length === 0 || selectedPlatforms.includes(platform)
                        ? `${platformColors[platform]} text-white shadow-md hover:shadow-lg`
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Upcoming Contests List with better scrolling */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Upcoming Contests
                  </h2>
                  <div className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-800 dark:text-green-200 font-medium">
                    {upcomingContests.length} contests
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Stay updated with upcoming programming contests from all major platforms
                </p>
                
                <div className="space-y-4">
                  {upcomingContests.length > 0 ? upcomingContests.map((contest, index) => (
                    <div
                      key={contest._id}
                      className={`group p-4 lg:p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 animate-fadeInUp ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-650' 
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Contest Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base lg:text-lg leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {contest.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${platformColors[contest.platform]} shadow-sm animate-pulse`}></div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{contest.platform}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contest Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(contest.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-green-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{formatTime(contest.start_time)}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <a
                          href={contest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium py-3 px-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Join Contest
                        </a>
                        <button
                          onClick={() => {
                            // Add to calendar functionality can be implemented here
                            navigator.clipboard.writeText(contest.url)
                          }}
                          className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <Calendar size={16} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 animate-fadeIn">
                      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No upcoming contests found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Check back later for new contests</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Calendar Area */}
        <div className={`${
          isMobile 
            ? (mobileView === 'calendar' ? 'flex w-full' : 'hidden')
            : 'flex flex-1'
        } flex-col overflow-hidden bg-white dark:bg-gray-800`}>
          
          {/* Calendar Header with improved design */}
          <div className={`p-4 lg:p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700`}>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {getMonthName(currentDate)}
              </h1>
              
              <div className="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow-md p-1">
                <button
                  onClick={() => navigateMonth(-1)}
                  className={`p-2 lg:p-3 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft size={isMobile ? 18 : 20} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 lg:px-6 py-2 lg:py-3 mx-2 rounded-lg text-sm lg:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className={`p-2 lg:p-3 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={isMobile ? 18 : 20} />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Calendar Grid */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
            {/* Days of week header with better styling */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                <div
                  key={day}
                  className="p-3 lg:p-4 text-center font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-sm"
                >
                  <span className="block lg:hidden text-sm">{day.slice(0, 3)}</span>
                  <span className="hidden lg:block text-sm">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar days with enhanced design */}
            <div className="grid grid-cols-7 gap-2 auto-rows-fr">
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayContests = date ? getContestsForDate(date) : []
                const isToday = date && date.toDateString() === new Date().toDateString()
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 lg:min-h-32 p-2 lg:p-3 border-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-650' 
                        : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50'
                    } ${isToday ? (isDarkMode ? 'bg-blue-900/30 border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-blue-100 border-blue-400 shadow-lg shadow-blue-500/20') : ''}`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm lg:text-base font-bold mb-2 ${
                          isToday 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayContests.slice(0, isMobile ? 2 : isTablet ? 3 : 4).map(contest => (
                            <div
                              key={contest._id}
                              className={`text-xs lg:text-sm p-1 lg:p-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm ${
                                platformColors[contest.platform] || 'bg-gray-500'
                              }`}
                              title={contest.title}
                            >
                              <div className="truncate">
                                {isMobile ? contest.title.slice(0, 12) + (contest.title.length > 12 ? '...' : '') : contest.title}
                              </div>
                            </div>
                          ))}
                          {dayContests.length > (isMobile ? 2 : isTablet ? 3 : 4) && (
                            <div className="text-xs text-center py-1 px-2 bg-gray-400 dark:bg-gray-600 text-white rounded-lg font-medium">
                              +{dayContests.length - (isMobile ? 2 : isTablet ? 3 : 4)} more
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


export default ContestTracker;