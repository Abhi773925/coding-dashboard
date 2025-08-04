"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Search, Calendar, Clock, LinkIcon, Youtube, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

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
    <div className={`min-h-screen max-h-screen pt-[70px] overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex h-[calc(100vh-70px)] overflow-hidden">
        {/* Sidebar */}
        <div className={`w-80 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col overflow-hidden`}>
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search Contests"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            {/* Platform Filter */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">All Platforms Selected</p>
              <div className="flex flex-wrap gap-2">
                {['LeetCode', 'Codeforces', 'CodeChef'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedPlatforms.length === 0 || selectedPlatforms.includes(platform)
                        ? `${platformColors[platform]} text-white`
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Contests */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Upcoming Contests
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Don't miss scheduled events
              </p>
              
              <div className="space-y-3">
                {upcomingContests.map(contest => (
                  <div
                    key={contest._id}
                    className={`p-3 rounded-lg border transition-colors hover:shadow-md ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                          {contest.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className={`w-2 h-2 rounded-full ${platformColors[contest.platform]}`}></div>
                          <span>{contest.platform}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(contest.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formatTime(contest.start_time)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex gap-2">
                      <a
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Add to Calendar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Calendar Header */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">
                {getMonthName(currentDate)}
              </h1>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1 h-full">
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayContests = date ? getContestsForDate(date) : []
                const isToday = date && date.toDateString() === new Date().toDateString()
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-1 border transition-colors ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-800' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${isToday ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayContests.slice(0, 3).map(contest => (
                            <div
                              key={contest._id}
                              className={`text-xs p-1 rounded text-white truncate cursor-pointer ${
                                platformColors[contest.platform] || 'bg-gray-500'
                              }`}
                              title={contest.title}
                            >
                              {contest.title}
                            </div>
                          ))}
                          {dayContests.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
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
