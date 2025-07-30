"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Edit, Trash2, FileText, PlayCircle, Star, LinkIcon, Filter, BookOpen, CheckSquare, X } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../navigation/Navigation"
import { motion, AnimatePresence } from "framer-motion"
import FilterForm from "./FilterForm" // Import the new FilterForm

// Backend URL Configuration
const BACKEND_URL = "http://localhost:5000/api"

// Grid Background Component (retained from previous update)
const GridBackground = ({ isDarkMode }) => {
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
  const gradientStart = isDarkMode ? "rgba(139, 92, 246, 0.05)" : "rgba(99, 102, 241, 0.05)"
  const gradientEnd = isDarkMode ? "rgba(59, 130, 246, 0.03)" : "rgba(59, 130, 246, 0.03)"

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
        <rect width="100%" height="100%" fill="url(#radialGradient)" opacity="0.5" />
      </svg>
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
          animation: grid-pan 60s linear infinite;
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

// New QuestionCard Component
const QuestionCard = ({ question, courseId, dayNumber, updateQuestionStatus, isDarkMode }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState(question.notes || "")

  const handleSaveNotes = () => {
    updateQuestionStatus(courseId, dayNumber, question.id, { notes: tempNotes })
    setIsEditingNotes(false)
  }

  const handleCancelNotes = () => {
    setTempNotes(question.notes || "")
    setIsEditingNotes(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        border rounded-xl p-4 shadow-lg transition-all duration-300
        ${isDarkMode ? "bg-slate-800/70 border-slate-700/50 hover:shadow-xl hover:scale-[1.02]" : "bg-white/80 border-gray-200/50 hover:shadow-xl hover:scale-[1.02]"}
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
              updateQuestionStatus(courseId, dayNumber, question.id, {
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
            onChange={() => updateQuestionStatus(courseId, dayNumber, question.id, { status: !question.status })}
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
            {!isEditingNotes ? (
              <>
                <button
                  onClick={() => setIsEditingNotes(true)}
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
                    onClick={() => updateQuestionStatus(courseId, dayNumber, question.id, { notes: "" })}
                    className={`
                      ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}
                      transition-colors duration-200
                    `}
                    title="Clear Notes"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveNotes}
                  className={`
                    ${isDarkMode ? "text-emerald-400 hover:text-emerald-300" : "text-green-600 hover:text-green-700"}
                    transition-colors duration-200
                  `}
                  title="Save Notes"
                >
                  <CheckSquare size={16} />
                </button>
                <button
                  onClick={handleCancelNotes}
                  className={`
                    ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}
                    transition-colors duration-200
                  `}
                  title="Cancel Editing"
                >
                  <X size={16} />
                </button>
              </>
            )}
          </div>
        </div>
        {isEditingNotes ? (
          <textarea
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            className={`
              w-full p-2 rounded-md text-sm
              ${isDarkMode ? "bg-slate-600 text-zinc-100" : "bg-gray-200 text-gray-800"}
              border ${isDarkMode ? "border-slate-500" : "border-gray-300"}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            rows={3}
          />
        ) : (
          <p
            className={`
              text-sm
              ${isDarkMode ? "text-zinc-300" : "text-gray-600"}
            `}
          >
            {question.notes || "No notes added"}
          </p>
        )}
      </div>
    </motion.div>
  )
}

const CourseProgress = () => {
  // Theme and Authentication Hooks
  const { isDarkMode, colors, schemes } = useTheme()
  const { isLoggedIn, login, user } = useAuth()

  // State Management
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDay, setSelectedDay] = useState(1) // New: Track selected day
  const [filter, setFilter] = useState({
    difficulty: "All",
    status: "All",
    revision: false,
    showNotes: false,
  })
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false) // New: Control filter modal visibility

  // Fetch Course Data
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      setError(null)

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

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch course")
        }
        const courseData = response.data.data
        if (!courseData || !courseData.days) {
          throw new Error("Invalid course data structure")
        }
        setCourse(courseData)
        // Set initial selected day to the first day if available
        if (courseData.days.length > 0) {
          setSelectedDay(courseData.days[0].dayNumber)
        }
        setLoading(false)
      } catch (error) {
        console.error("Course Fetch Error:", error)
        setError(error.response?.data?.message || error.message || "An unexpected error occurred")
        setLoading(false)
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
    if (!isLoggedIn || !user || !user.email) {
      toast.error("Please login to update progress", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      })
      const confirmLogin = window.confirm("You need to login to update progress. Login now?")
      if (confirmLogin) {
        login()
      }
      return
    }
    try {
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

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update question")
      }
      setCourse(response.data.data)
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

  // Filter Questions for the selected day
  const filteredQuestionsForSelectedDay = useMemo(() => {
    if (!course) return []
    const currentDay = course.days.find((day) => day.dayNumber === selectedDay)
    if (!currentDay) return []

    return currentDay.questions.filter((question) => {
      const difficultyMatch = filter.difficulty === "All" || question.difficulty === filter.difficulty
      const statusMatch =
        filter.status === "All" ||
        (filter.status === "Completed" && question.status) ||
        (filter.status === "Pending" && !question.status)
      const revisionMatch = !filter.revision || question.forRevision
      const notesMatch = !filter.showNotes || (question.notes && question.notes.trim() !== "")
      return difficultyMatch && statusMatch && revisionMatch && notesMatch
    })
  }, [course, selectedDay, filter])

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

      {/* Main Content Area */}
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

        {/* Progress and Filter Toolbar */}
        <div
          className={`
            sticky top-0 z-20 p-4 backdrop-blur-md rounded-xl mb-6
            ${isDarkMode ? "bg-slate-900/80 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
            shadow-lg flex flex-col md:flex-row justify-between items-center gap-4
          `}
        >
          {user && (
            <span className={`text-sm font-medium ${isDarkMode ? "text-zinc-300" : "text-gray-700"}`}>
              Tracking progress for: <span className="font-bold">{user.name || user.email}</span>
            </span>
          )}
          <div className="flex items-center space-x-4">
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
              onClick={() => setIsFilterModalOpen(true)}
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
              Filters
            </button>
          </div>
        </div>

        {/* Day Navigation */}
        <div
          className={`
            flex overflow-x-auto pb-4 mb-8
            ${isDarkMode ? "bg-slate-900/50" : "bg-gray-50/50"}
            rounded-xl p-2 shadow-inner
            border ${isDarkMode ? "border-slate-700/50" : "border-gray-200/50"}
          `}
        >
          {course?.days.map((day) => (
            <motion.button
              key={day.dayNumber}
              onClick={() => setSelectedDay(day.dayNumber)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex-shrink-0 px-6 py-3 rounded-full font-semibold text-lg mx-2
                transition-all duration-300
                ${
                  selectedDay === day.dayNumber
                    ? isDarkMode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/30"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30"
                    : isDarkMode
                      ? "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70 border border-slate-700/50"
                      : "bg-white/80 text-gray-700 hover:bg-gray-100/80 border border-gray-200/50"
                }
              `}
            >
              Day {day.dayNumber}
            </motion.button>
          ))}
        </div>

        {/* Questions View for Selected Day */}
        <div
          className={`
            p-6 rounded-2xl border
            ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-white/80 border-gray-200/50"}
            shadow-xl backdrop-blur-md
          `}
          style={{
            boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            className={`text-2xl font-bold mb-6 flex items-center
              ${isDarkMode ? "text-white" : "text-gray-900"}
            `}
          >
            <BookOpen className="mr-3 text-purple-500" size={28} />
            Day {selectedDay}: {course?.days.find((d) => d.dayNumber === selectedDay)?.dayTitle || "Loading..."}
          </h2>

          {filteredQuestionsForSelectedDay.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredQuestionsForSelectedDay.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    courseId={course._id}
                    dayNumber={selectedDay}
                    updateQuestionStatus={updateQuestionStatus}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div
              className={`text-center p-6 rounded-xl border-2 border-dashed
                ${isDarkMode ? "border-slate-700 text-slate-500" : "border-gray-200 text-gray-400"}
              `}
            >
              No questions found for this day matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <FilterForm filter={filter} setFilter={setFilter} onClose={() => setIsFilterModalOpen(false)} />
        )}
      </AnimatePresence>

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
