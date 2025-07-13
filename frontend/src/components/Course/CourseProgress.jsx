"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ChevronDown, ChevronUp, Edit, Trash2, FileText, PlayCircle, Star, LinkIcon, Filter } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../navigation/Navigation" // Assuming this path is correct

// Backend URL Configuration
const BACKEND_URL = "https://coding-dashboard-ngwi.onrender.com/api"

// Updated Grid Background Component (no internal dots)
const GridBackground = ({ isDarkMode }) => {
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Removed smallGrid pattern with dots */}
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Only draw grid lines, no fill from smallGrid */}
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke={gridColor} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

const CourseProgress = () => {
  // Theme and Authentication Hooks
  const { isDarkMode } = useTheme()
  const { isLoggedIn, login, user } = useAuth()

  // State Management
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDays, setOpenDays] = useState({})
  const [editingNotes, setEditingNotes] = useState({})
  const [filter, setFilter] = useState({
    difficulty: "All",
    status: "All",
    revision: false,
    showNotes: false,
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch Course Data
  useEffect(() => {
    const fetchCourse = async () => {
      // Reset loading and error states
      setLoading(true)
      setError(null)

      // Check login status
      if (!isLoggedIn || !user || !user.email) {
        toast.error("Please login to view course progress", {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        })
        setLoading(false)
        return
      }

      try {
        // Include userEmail as a query parameter
        const response = await axios.get(
          `${BACKEND_URL}/codingkaro/courses/DSA Placement Preparation?userEmail=${encodeURIComponent(user.email)}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        )

        // Validate response
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch course")
        }
        const courseData = response.data.data
        // Validate course structure
        if (!courseData || !courseData.days) {
          throw new Error("Invalid course data structure")
        }
        // Set course data and initialize day collapse state
        setCourse(courseData)
        const initialOpenDays = courseData.days.reduce((acc, day) => {
          acc[day.dayNumber] = false
          return acc
        }, {})
        setOpenDays(initialOpenDays)
        setLoading(false)
      } catch (error) {
        console.error("Course Fetch Error:", error)
        setError(error.response?.data?.message || error.message || "An unexpected error occurred")
        setLoading(false)
        // Show error toast
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        })
      }
    }
    fetchCourse()
  }, [isLoggedIn, isDarkMode, user])

  // Update Question Status/Notes
  const updateQuestionStatus = async (courseId, dayNumber, questionId, updates) => {
    // Login Check
    if (!isLoggedIn || !user || !user.email) {
      toast.error("Please login to update progress", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      })

      // Prompt Login
      const confirmLogin = window.confirm("You need to login to update progress. Login now?")
      if (confirmLogin) {
        login()
      }
      return
    }
    try {
      // Include userEmail in the request body
      const updateData = {
        ...updates,
        userEmail: user.email,
      }
      const response = await axios.put(
        `${BACKEND_URL}/codingkaro/courses/${courseId}/days/${dayNumber}/questions/${questionId}`,
        updateData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      // Validate Response
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update question")
      }
      // Update Course State
      setCourse(response.data.data)

      // Reset Note Editing State
      if (updates.notes !== undefined) {
        setEditingNotes((prev) => ({
          ...prev,
          [`${dayNumber}-${questionId}`]: false,
        }))
      }
      // Success Notification
      toast.success("Progress updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: isDarkMode ? "dark" : "light",
      })
    } catch (error) {
      console.error("Update Question Error:", error)
      toast.error(error.response?.data?.message || "Failed to update question status", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      })
    }
  }

  // Toggle Day Collapse
  const toggleDayCollapse = (dayNumber) => {
    setOpenDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }))
  }

  // Filter Questions
  const filterQuestions = () => {
    if (!course) return []
    return course.days
      .map((day) => ({
        ...day,
        questions: day.questions.filter((question) => {
          const difficultyMatch = filter.difficulty === "All" || question.difficulty === filter.difficulty

          const statusMatch =
            filter.status === "All" ||
            (filter.status === "Completed" && question.status) ||
            (filter.status === "Pending" && !question.status)

          const revisionMatch = !filter.revision || question.forRevision
          const notesMatch = !filter.showNotes || (question.notes && question.notes.trim() !== "")
          return difficultyMatch && statusMatch && revisionMatch && notesMatch
        }),
      }))
      .filter((day) => day.questions.length > 0)
  }

  // Filter Toolbar Component
  const FilterToolbar = () => {
    return (
      <div
        className={`
          sticky top-0 z-20 p-4 backdrop-blur-md
          ${
            isDarkMode
              ? "bg-slate-900/80 text-zinc-100 border-b border-slate-700/50"
              : "bg-white/80 text-gray-900 border-b border-gray-200/50"
          }
          shadow-lg
        `}
      >
        {/* Mobile Filter Toggle */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <span
            className={`
              text-sm font-medium
              ${isDarkMode ? "text-zinc-400" : "text-gray-600"}
            `}
          >
            Progress:
            <span
              className={`
                ml-2 font-bold
                ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}
              `}
            >
              {course ? `${course.completedQuestions || 0}/${course.totalQuestions || 0}` : "0/0"}
            </span>
          </span>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              px-4 py-2 rounded-xl text-sm flex items-center
              ${
                isDarkMode
                  ? "bg-slate-800/70 text-zinc-100 hover:bg-slate-700/70 border border-slate-700/50"
                  : "bg-gray-100/70 text-gray-900 hover:bg-gray-200/70 border border-gray-200/50"
              }
              transition-all duration-300 transform hover:scale-105
            `}
          >
            <Filter size={16} className="mr-2" />
            {isFilterOpen ? "Close Filters" : "Open Filters"}
          </button>
        </div>
        {/* User Information */}
        {user && (
          <div className={`mb-4 ${isFilterOpen || "hidden md:flex"}`}>
            <span className={`text-sm font-medium ${isDarkMode ? "text-zinc-300" : "text-gray-700"}`}>
              Tracking progress for: <span className="font-bold">{user.name || user.email}</span>
            </span>
          </div>
        )}
        {/* Filters Container - Responsive Layout */}
        <div
          className={`
            flex flex-col md:flex-row justify-between items-start md:items-center
            ${isFilterOpen || "hidden md:flex"}
            space-y-4 md:space-y-0
          `}
        >
          {/* Filter Dropdowns and Checkboxes */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
            {/* Difficulty Dropdown - Responsive */}
            <div className="w-full md:w-auto">
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter((prev) => ({ ...prev, difficulty: e.target.value }))}
                className={`
                  w-full md:w-auto px-4 py-2 rounded-xl border text-sm
                  ${
                    isDarkMode
                      ? "bg-slate-800/70 border-slate-700 text-zinc-100"
                      : "bg-white/70 border-gray-300 text-gray-900"
                  }
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none
                `}
              >
                <option value="All">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            {/* Status Dropdown - Responsive */}
            <div className="w-full md:w-auto">
              <select
                value={filter.status}
                onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
                className={`
                  w-full md:w-auto px-4 py-2 rounded-xl border text-sm
                  ${
                    isDarkMode
                      ? "bg-slate-800/70 border-slate-700 text-zinc-100"
                      : "bg-white/70 border-gray-300 text-gray-900"
                  }
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none
                `}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            {/* Checkboxes - Responsive Vertical/Horizontal Layout */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
              <label
                className={`
                  flex items-center space-x-2 w-full md:w-auto cursor-pointer
                  ${isDarkMode ? "text-zinc-300" : "text-gray-700"}
                `}
              >
                <input
                  type="checkbox"
                  checked={filter.revision}
                  onChange={() => setFilter((prev) => ({ ...prev, revision: !prev.revision }))}
                  className={`
                    form-checkbox h-5 w-5 rounded
                    ${isDarkMode ? "text-indigo-400 bg-slate-700 border-slate-600" : "text-blue-600 bg-gray-200 border-gray-300"}
                    focus:ring-2 focus:ring-purple-500
                  `}
                />
                <span className="text-sm">Revision</span>
              </label>
              <label
                className={`
                  flex items-center space-x-2 w-full md:w-auto cursor-pointer
                  ${isDarkMode ? "text-zinc-300" : "text-gray-700"}
                `}
              >
                <input
                  type="checkbox"
                  checked={filter.showNotes}
                  onChange={() => setFilter((prev) => ({ ...prev, showNotes: !prev.showNotes }))}
                  className={`
                    form-checkbox h-5 w-5 rounded
                    ${isDarkMode ? "text-indigo-400 bg-slate-700 border-slate-600" : "text-blue-600 bg-gray-200 border-gray-300"}
                    focus:ring-2 focus:ring-purple-500
                  `}
                />
                <span className="text-sm">With Notes</span>
              </label>
            </div>
          </div>
          {/* Progress - Hide on Mobile, Show on Larger Screens */}
          <div className="hidden md:flex items-center space-x-2">
            <span
              className={`
                text-sm font-medium
                ${isDarkMode ? "text-zinc-400" : "text-gray-600"}
              `}
            >
              Progress:
            </span>
            <span
              className={`
                font-bold
                ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}
              `}
            >
              {course ? `${course.completedQuestions || 0}/${course.totalQuestions || 0}` : "0/0"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Render Loading State
  if (loading) {
    return (
      <div
        className={`
          relative min-h-screen flex items-center justify-center
          transition-colors duration-300 p-4 pt-24
          ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}
        `}
      >
        <GridBackground isDarkMode={isDarkMode} />
        <div
          className={`
            animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-t-4
            ${isDarkMode ? "border-indigo-400" : "border-blue-500"}
            relative z-10
          `}
        ></div>
      </div>
    )
  }

  // Render Login Prompt
  if (!isLoggedIn || !user || !user.email) {
    return (
      <div
        className={`
          relative min-h-screen flex flex-col items-center justify-center
          transition-colors duration-300 p-4 pt-24
          ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}
        `}
      >
        <GridBackground isDarkMode={isDarkMode} />
        <div
          className={`
            text-center p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10
            ${
              isDarkMode
                ? "bg-slate-800/70 text-zinc-100 border border-slate-700/50"
                : "bg-white/80 text-gray-900 border border-gray-200/50"
            }
            transform transition-all duration-300 hover:scale-[1.02]
          `}
          style={{
            boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            className={`
              text-2xl font-bold mb-4
              ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}
            `}
          >
            Login Required
          </h2>
          <p
            className={`
              mb-6
              ${isDarkMode ? "text-zinc-300" : "text-gray-600"}
            `}
          >
            Please login to view and track your course progress.
          </p>
          <button
            onClick={login}
            className={`
              px-6 py-3 rounded-xl text-white font-semibold w-full
              transition-all duration-300 transform hover:scale-105
              ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              }
              shadow-lg
            `}
            style={{
              boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
            }}
          >
            Login Now
          </button>
        </div>
      </div>
    )
  }

  // Render Error State
  if (error) {
    return (
      <div
        className={`
          relative min-h-screen flex items-center justify-center
          transition-colors duration-300 p-4 pt-24
          ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}
        `}
      >
        <GridBackground isDarkMode={isDarkMode} />
        <div
          className={`
            text-center max-w-md w-full p-8 rounded-2xl shadow-2xl relative z-10
            ${
              isDarkMode
                ? "bg-red-900/50 border border-red-700/50 text-red-300"
                : "bg-red-50/80 border border-red-200/50 text-red-700"
            }
            transform transition-all duration-300 hover:scale-[1.02]
          `}
          style={{
            boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            className={`
              text-xl md:text-2xl font-bold mb-4
              ${isDarkMode ? "text-red-400" : "text-red-600"}
            `}
          >
            Error
          </h2>
          <p
            className={`
              mb-4 text-sm md:text-base
              ${isDarkMode ? "text-red-300" : "text-red-500"}
            `}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`
              px-6 py-3 rounded-xl text-white font-semibold w-full
              transition-all duration-300 transform hover:scale-105
              ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              }
              shadow-lg
            `}
            style={{
              boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Main Render
  return (
    <div
      className={`
        relative min-h-screen pt-24 flex flex-col
        ${isDarkMode ? "bg-slate-900 text-zinc-100" : "bg-gray-50 text-gray-900"}
        transition-colors duration-300
      `}
    >
      <GridBackground isDarkMode={isDarkMode} />
      {/* Filter Toolbar */}
      <FilterToolbar />
      {/* Questions View */}
      <div
        className={`
          relative z-10 flex-grow p-4 max-w-7xl mx-auto w-full
        `}
      >
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center
            bg-clip-text text-transparent
            ${isDarkMode ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"}
          `}
        >
          {course?.courseTitle || "Course Progress"}
        </h1>

        {filterQuestions().map((day) => (
          <div
            key={day.dayNumber}
            className={`
              relative mb-6 p-2 rounded-2xl border
              ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-white/80 border-gray-200/50"}
              shadow-xl backdrop-blur-md
              transform transition-all duration-300 hover:scale-[1.005]
            `}
            style={{
              boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => toggleDayCollapse(day.dayNumber)}
              className={`
                w-full text-left px-4 py-3 rounded-xl flex justify-between items-center
                ${
                  isDarkMode
                    ? "bg-slate-700/50 text-zinc-100 hover:bg-slate-700/80"
                    : "bg-gray-100/50 text-gray-900 hover:bg-gray-100/80"
                }
                font-semibold text-lg transition-all duration-300
              `}
            >
              <span>
                Day {day.dayNumber}: {day.dayTitle}
              </span>
              {openDays[day.dayNumber] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openDays[day.dayNumber] && (
              <div
                className={`
                  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 p-2
                  ${isDarkMode ? "bg-slate-900/50" : "bg-gray-50/50"}
                  rounded-xl
                `}
              >
                {day.questions.map((question) => (
                  <div
                    key={question.id}
                    className={`
                      border rounded-xl p-4 shadow-lg transition-all duration-300
                      ${
                        isDarkMode
                          ? "bg-slate-800/70 border-slate-700/50 hover:shadow-xl hover:scale-[1.02]"
                          : "bg-white/80 border-gray-200/50 hover:shadow-xl hover:scale-[1.02]"
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`
                          text-base font-semibold flex-grow
                          ${isDarkMode ? "text-zinc-100" : "text-gray-900"}
                        `}
                      >
                        {question.title}
                      </h3>
                      <span
                        className={`
                          px-2 py-1 rounded-full text-xs font-bold ml-2
                          ${
                            question.difficulty === "Easy"
                              ? isDarkMode
                                ? "bg-emerald-800 text-emerald-200"
                                : "bg-green-600 text-green-100"
                              : question.difficulty === "Medium"
                                ? isDarkMode
                                  ? "bg-yellow-800 text-yellow-200"
                                  : "bg-yellow-600 text-yellow-100"
                                : isDarkMode
                                  ? "bg-red-800 text-red-200"
                                  : "bg-red-600 text-red-100"
                          }
                        `}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex space-x-2">
                        {question.links.article && (
                          <a
                            href={question.links.article}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                              ${isDarkMode ? "text-indigo-300 hover:text-indigo-200" : "text-blue-500 hover:text-blue-700"}
                              transition-colors duration-200
                            `}
                            title="Article"
                          >
                            <FileText size={18} />
                          </a>
                        )}
                        {question.links.youtube && (
                          <a
                            href={question.links.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                              ${isDarkMode ? "text-red-300 hover:text-red-200" : "text-red-500 hover:text-red-700"}
                              transition-colors duration-200
                            `}
                            title="YouTube Tutorial"
                          >
                            <PlayCircle size={18} />
                          </a>
                        )}
                        {question.links.practice && (
                          <a
                            href={question.links.practice}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                              ${isDarkMode ? "text-green-300 hover:text-green-200" : "text-green-500 hover:text-green-700"}
                              transition-colors duration-200
                            `}
                            title="Problem Link"
                          >
                            <LinkIcon size={18} />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuestionStatus(course._id, day.dayNumber, question.id, {
                              forRevision: !question.forRevision,
                            })
                          }
                          className={`
                            ${
                              question.forRevision
                                ? isDarkMode
                                  ? "text-yellow-400"
                                  : "text-yellow-600"
                                : isDarkMode
                                  ? "text-zinc-500 hover:text-zinc-400"
                                  : "text-gray-400 hover:text-gray-600"
                            }
                            transition-colors duration-200
                          `}
                          title="Mark for Revision"
                        >
                          <Star size={18} />
                        </button>
                        <input
                          type="checkbox"
                          checked={question.status}
                          onChange={() =>
                            updateQuestionStatus(course._id, day.dayNumber, question.id, { status: !question.status })
                          }
                          className={`
                            form-checkbox h-5 w-5 rounded
                            ${isDarkMode ? "text-indigo-400 bg-slate-700 border-slate-600" : "text-blue-600 bg-gray-200 border-gray-300"}
                            focus:ring-2 focus:ring-purple-500
                          `}
                        />
                      </div>
                    </div>
                    {/* Notes Section */}
                    <div
                      className={`
                        mt-4 p-3 rounded-lg
                        ${isDarkMode ? "bg-slate-700/50" : "bg-gray-100/70"}
                      `}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4
                          className={`
                            text-sm font-semibold
                            ${isDarkMode ? "text-zinc-200" : "text-gray-700"}
                          `}
                        >
                          Notes
                        </h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const newNotes = prompt("Enter your notes:", question.notes || "")
                              if (newNotes !== null) {
                                updateQuestionStatus(course._id, day.dayNumber, question.id, { notes: newNotes })
                              }
                            }}
                            className={`
                              ${isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-blue-600 hover:text-blue-700"}
                              transition-colors duration-200
                            `}
                            title="Edit Notes"
                          >
                            <Edit size={16} />
                          </button>
                          {question.notes && (
                            <button
                              onClick={() =>
                                updateQuestionStatus(course._id, day.dayNumber, question.id, { notes: "" })
                              }
                              className={`
                                ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}
                                transition-colors duration-200
                              `}
                              title="Clear Notes"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p
                        className={`
                          text-sm
                          ${isDarkMode ? "text-zinc-300" : "text-gray-600"}
                        `}
                      >
                        {question.notes || "No notes added"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  )
}

export default CourseProgress
