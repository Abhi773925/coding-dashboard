"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Filter, Search, Calendar, Clock, LinkIcon, Youtube, Loader2 } from "lucide-react" // Using Lucide React icons
import { useTheme } from "../context/ThemeContext"

// New Grid Background Component with subtle animations and gradient
const GridBackground = ({ isDarkMode }) => {
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
  const gradientStart = isDarkMode ? "rgba(139, 92, 246, 0.05)" : "rgba(99, 102, 241, 0.05)" // Purple/Indigo
  const gradientEnd = isDarkMode ? "rgba(59, 130, 246, 0.03)" : "rgba(59, 130, 246, 0.03)" // Blue

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke={gridColor} strokeWidth="1" />
          </pattern>
          <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Subtle radial gradient overlay */}
        <rect width="100%" height="100%" fill="url(#radialGradient)" opacity="0.5" />
      </svg>
      {/* Optional: Add a subtle animation to the grid itself via CSS */}
      <style jsx>{`
        @keyframes grid-pan {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        .animated-grid {
          animation: grid-pan 60s linear infinite; /* Slower animation */
        }
      `}</style>
      <div
        className="absolute inset-0 animated-grid"
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="${encodeURIComponent(gridColor)}" strokeWidth="1"/></svg>')`,
        }}
      ></div>
    </div>
  )
}

const ContestTracker = () => {
  const { isDarkMode } = useTheme()
  // State Management
  const [contestData, setContestData] = useState({
    contests: [],
    totalContests: 0,
    upcomingContests: 0,
    pastContests: 0,
    loading: true,
    error: null,
  })
  // Filters State
  const [filters, setFilters] = useState({
    platform: "",
    type: "all",
    search: "",
  })
  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    contestsPerPage: 10,
  })
  // Fetch Contests
  const fetchContests = async () => {
    setContestData((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await axios.get("http://localhost:5000/api/codingkaro/contests")
      setContestData({
        contests: response.data,
        totalContests: response.data.length,
        upcomingContests: response.data.filter((contest) => !contest.past).length,
        pastContests: response.data.filter((contest) => contest.past).length,
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
  // Fetch contests on component mount
  useEffect(() => {
    fetchContests()
  }, [])
  // Processed Contests with Memoization
  const processedContests = useMemo(() => {
    return contestData.contests
      .filter((contest) => {
        if (filters.platform && contest.platform !== filters.platform) return false
        if (filters.type === "upcoming" && contest.past) return false
        if (filters.type === "past" && !contest.past) return false
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          return contest.title.toLowerCase().includes(searchTerm) || contest.platform.toLowerCase().includes(searchTerm)
        }
        return true
      })
      .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
  }, [contestData.contests, filters])

  // Loading State Render Method
  const renderLoadingState = () => (
    <div className={`flex justify-center items-center h-64 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
      <div className="flex flex-col items-center">
        <Loader2 className={`animate-spin text-4xl ${isDarkMode ? "text-indigo-400" : "text-indigo-600"} mb-4`} />
        <p className={isDarkMode ? "text-slate-300" : "text-gray-700"}>Loading contests...</p>
      </div>
    </div>
  )
  // Error State Render Method
  const renderErrorState = () => (
    <div
      className={`rounded-xl p-6 shadow-xl backdrop-blur-md
        ${isDarkMode ? "bg-red-900/50 border border-red-700/50 text-red-300" : "bg-red-50/80 border border-red-200/50 text-red-700"}
      `}
      style={{
        boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <strong className="font-bold block mb-2">Oops! Something went wrong</strong>
          <span className="text-sm">{contestData.error}</span>
        </div>
        <button
          onClick={fetchContests}
          className={`
            px-6 py-3 rounded-xl font-semibold text-lg text-white
            bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-500 hover:to-blue-500
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
          `}
          style={{
            boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
          }}
        >
          Retry
        </button>
      </div>
    </div>
  )
  // Render Contest Card
  const renderContestCard = (contest) => (
    <div
      key={contest._id}
      className={`
        p-6 mb-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.01]
        shadow-xl backdrop-blur-md
        ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
        ${
          contest.past
            ? isDarkMode
              ? "border-l-4 border-slate-600"
              : "border-l-4 border-gray-400"
            : isDarkMode
              ? "border-l-4 border-indigo-400"
              : "border-l-4 border-indigo-600"
        }
      `}
      style={{
        boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{contest.title}</h3>
        <span
          className={`
            px-3 py-1 rounded-full text-sm font-semibold
            ${
              contest.past
                ? isDarkMode
                  ? "bg-slate-700 text-slate-300"
                  : "bg-gray-200 text-gray-700"
                : isDarkMode
                  ? "bg-indigo-400 text-slate-900"
                  : "bg-indigo-600 text-white"
            }
          `}
        >
          {contest.past ? "Past" : "Upcoming"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <div className="flex items-center">
          <Calendar className={`mr-2 ${isDarkMode ? "text-purple-400" : "text-blue-500"}`} size={18} />
          <span className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
            {new Date(contest.start_time).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className={`mr-2 ${isDarkMode ? "text-emerald-400" : "text-purple-500"}`} size={18} />
          <span className={isDarkMode ? "text-slate-300" : "text-gray-700"}>{contest.duration} minutes</span>
        </div>
        <div className="flex items-center">
          <LinkIcon className={`mr-2 ${isDarkMode ? "text-purple-400" : "text-indigo-500"}`} size={18} />
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:underline ${isDarkMode ? "text-purple-300 hover:text-purple-200" : "text-indigo-600 hover:text-indigo-700"}`}
          >
            Contest Link
          </a>
        </div>
        {contest.past && contest.solution_link && (
          <div className="flex items-center">
            <Youtube className={`mr-2 ${isDarkMode ? "text-red-400" : "text-red-500"}`} size={18} />
            <a
              href={contest.solution_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline ${isDarkMode ? "text-red-300 hover:text-red-200" : "text-red-600 hover:text-red-700"}`}
            >
              Solution Video
            </a>
          </div>
        )}
      </div>
    </div>
  )
  // Filters Render Method
  const renderFilters = () => (
    <div
      className={`rounded-2xl p-6 mb-6 shadow-xl backdrop-blur-md
        ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
      `}
      style={{
        boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 flex-grow">
          <Filter className={`text-gray-500 ${isDarkMode ? "text-slate-400" : ""}`} size={18} />
          <select
            value={filters.platform}
            onChange={(e) => setFilters((prev) => ({ ...prev, platform: e.target.value }))}
            className={`p-2 border rounded-lg flex-grow outline-none
              ${isDarkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-gray-100 text-gray-800 border-gray-300"}
            `}
          >
            <option value="">All Platforms</option>
            <option value="LeetCode">LeetCode</option>
            <option value="Codeforces">Codeforces</option>
            <option value="CodeChef">CodeChef</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 flex-grow">
          <select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            className={`p-2 border rounded-lg flex-grow outline-none
              ${isDarkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-gray-100 text-gray-800 border-gray-300"}
            `}
          >
            <option value="all">All Contests</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 flex-grow">
          <Search className={`text-gray-500 ${isDarkMode ? "text-slate-400" : ""}`} size={18} />
          <input
            type="text"
            placeholder="Search contests..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className={`p-2 border rounded-lg flex-grow outline-none
              ${isDarkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-gray-100 text-gray-800 border-gray-300"}
            `}
          />
        </div>
      </div>
    </div>
  )
  // Pagination Render Method
  const renderPagination = () => {
    const paginatedContests = processedContests.slice(
      (pagination.currentPage - 1) * pagination.contestsPerPage,
      pagination.currentPage * pagination.contestsPerPage,
    )
    const totalPages = Math.ceil(processedContests.length / pagination.contestsPerPage)
    return (
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: Math.max(1, prev.currentPage - 1),
            }))
          }
          disabled={pagination.currentPage === 1}
          className={`
            px-6 py-3 rounded-xl font-semibold text-lg text-white
            bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-500 hover:to-blue-500
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{
            boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
          }}
        >
          Previous
        </button>

        <span className={`text-lg font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
          Page {pagination.currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: prev.currentPage + 1,
            }))
          }
          disabled={pagination.currentPage === totalPages || paginatedContests.length < pagination.contestsPerPage}
          className={`
            px-6 py-3 rounded-xl font-semibold text-lg text-white
            bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-500 hover:to-blue-500
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{
            boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
          }}
        >
          Next
        </button>
      </div>
    )
  }
  // Statistics Render Method
  const renderStatistics = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        className={`p-6 rounded-2xl text-center shadow-xl backdrop-blur-md
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className={`text-xl font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Total Contests</h2>
        <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {contestData.totalContests}
        </p>
      </div>
      <div
        className={`p-6 rounded-2xl text-center shadow-xl backdrop-blur-md
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className={`text-xl font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
          Upcoming Contests
        </h2>
        <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {contestData.upcomingContests}
        </p>
      </div>
      <div
        className={`p-6 rounded-2xl text-center shadow-xl backdrop-blur-md
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className={`text-xl font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Past Contests</h2>
        <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {contestData.pastContests}
        </p>
      </div>
    </div>
  )
  // Paginated Contests
  const paginatedContests = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.contestsPerPage
    const endIndex = startIndex + pagination.contestsPerPage
    return processedContests.slice(startIndex, endIndex)
  }, [processedContests, pagination])
  return (
    <div
      className={`relative min-h-screen w-full pt-12 transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <GridBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center
            bg-clip-text text-transparent
            ${isDarkMode ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"}
          `}
        >
          Coding Contest Tracker
        </h1>
        {/* Statistics */}
        {renderStatistics()}
        {/* Filters */}
        {renderFilters()}
        {/* Contest List */}
        <div>
          {contestData.loading ? (
            renderLoadingState()
          ) : contestData.error ? (
            renderErrorState()
          ) : paginatedContests.length > 0 ? (
            paginatedContests.map(renderContestCard)
          ) : (
            <div
              className={`text-center p-6 rounded-xl shadow-xl backdrop-blur-md
                ${isDarkMode ? "bg-slate-800/70 text-slate-300 border border-slate-700/50" : "bg-white/80 text-gray-700 border border-gray-200/50"}
              `}
              style={{
                boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
              }}
            >
              No contests found matching your criteria
            </div>
          )}
        </div>
        {/* Pagination */}
        {!contestData.loading && !contestData.error && processedContests.length > 0 && renderPagination()}
      </div>
    </div>
  )
}
export default ContestTracker
