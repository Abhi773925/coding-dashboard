"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Search, Calendar, Clock, LinkIcon, Youtube, Loader2, ChevronLeft, ChevronRight, Filter, CalendarDays, List } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import './ContestCalendar.css'

const ContestCalendar = () => {
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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [activeView, setActiveView] = useState('upcoming') // 'upcoming' or 'past'

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

  const pastContests = filteredContests
    .filter(contest => contest.past || new Date(contest.start_time) < new Date())
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
    .slice(0, 15) // Show last 15 past contests

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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Main Content Container - positioned directly below navbar */}
      <div className="flex overflow-hidden"
           style={{ 
             height: 'calc(100vh - 70px)',
             marginTop: '70px'
           }}>
        
        {/* Left Sidebar - Contest List */}
        <div className={`${isMobile ? 'w-full' : 'w-80 lg:w-96'} border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col`}>
          
          {/* Header Section */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeView === 'upcoming' ? 'Upcoming Contests' : 'Past Contests'}
              </h2>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('upcoming')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                    activeView === 'upcoming'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveView('past')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                    activeView === 'past'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  Past
                </button>
              </div>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {activeView === 'upcoming' 
                ? "Don't miss scheduled events"
                : 'Review completed contests and solutions'
              }
            </p>
            
            {/* Search Bar */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search Contests"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            {/* Platform Filter Dropdown */}
            <div className="mt-4">
              <select 
                multiple={false}
                className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                defaultValue=""
              >
                <option value="">All Platforms Selected</option>
                <option value="leetcode">LeetCode</option>
                <option value="codeforces">Codeforces</option>
                <option value="codechef">CodeChef</option>
              </select>
            </div>
          </div>

          {/* Contest List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {(activeView === 'upcoming' ? upcomingContests : pastContests).length > 0 
                ? (activeView === 'upcoming' ? upcomingContests : pastContests).map(contest => {
                  const contestDate = new Date(contest.start_time)
                  const isPast = contest.past || contestDate < new Date()
                  
                  return (
                    <div
                      key={contest._id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {/* Date Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(contest.start_time)}
                        </div>
                        {isPast && (
                          <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                            Completed
                          </span>
                        )}
                      </div>
                      
                      {/* Contest Info */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${platformColors[contest.platform]}`}></div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm leading-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {contest.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs mb-3">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatTime(contest.start_time)} - {formatTime(new Date(new Date(contest.start_time).getTime() + 2*60*60*1000).toISOString())}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                <span>{platformIcons[contest.platform] || '📝'}</span>
                                Starters {Math.floor(Math.random() * 200) + 1}
                              </span>
                            </div>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {contest.platform}
                            </span>
                          </div>
                          <div className="text-xs mb-3">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Starts in {isPast ? 'Completed' : '1 Day 6 Hrs 44 Mins 28 Secs'}
                            </span>
                          </div>
                          <div className="text-xs mb-3">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              📍 {contest.url.includes('codechef') ? 'https://www.codechef.com/START198' : contest.url}
                            </span>
                          </div>
                          <div className="text-xs mb-4">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              🏢 {contest.platform}
                            </span>
                          </div>
                          
                          {/* Action Button */}
                          <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs px-3 py-1.5 rounded text-blue-600 underline hover:text-blue-700 transition-colors"
                          >
                            Add to Calendar
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {activeView === 'upcoming' ? 'No upcoming contests found' : 'No past contests found'}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Side - Calendar */}
        <div className={`${isMobile ? 'hidden' : 'flex-1'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col`}>
          
          {/* Calendar Header */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {getMonthName(currentDate)}
              </h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div
                  key={day}
                  className={`p-3 text-center text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
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
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${isToday ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayContests.slice(0, 3).map(contest => {
                            const isPast = contest.past || new Date(contest.start_time) < new Date()
                            const platformIcon = platformIcons[contest.platform] || '📝'
                            return (
                              <div
                                key={contest._id}
                                className={`text-xs p-1 rounded text-white truncate cursor-pointer transition-opacity hover:opacity-80 ${
                                  platformColors[contest.platform] || 'bg-gray-500'
                                } ${isPast ? 'opacity-60' : ''}`}
                                title={`${contest.title} ${isPast ? '(Completed)' : ''}`}
                              >
                                <div className="flex items-center gap-1">
                                  <span>{platformIcon}</span>
                                  <span className="truncate">{contest.title.slice(0, 12)}...</span>
                                </div>
                              </div>
                            )
                          })}
                          {dayContests.length > 3 && (
                            <div className={`text-xs p-1 rounded text-center cursor-pointer hover:opacity-80 ${
                              isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
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

export default ContestCalendar
