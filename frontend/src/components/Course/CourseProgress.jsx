"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { 
  Edit, Trash2, FileText, PlayCircle, Star, LinkIcon, Filter, BookOpen, CheckSquare, X,
  TrendingUp, Calendar, Clock, Target, Award, Zap, BarChart3, PieChart, 
  CheckCircle, Circle, RotateCcw, Brain, Timer, Trophy, Flame, Activity, Users
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../navigation/Navigation"
import { motion, AnimatePresence } from "framer-motion"
import FilterForm from "./FilterForm" // Import the new FilterForm

// Backend URL Configuration
const BACKEND_URL = "https://prepmate-kvol.onrender.com/api"



// Advanced Statistics Component
const StatsCard = ({ title, value, subtitle, icon: Icon, color, trend, isDarkMode }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    className={`
      p-6 rounded-2xl border backdrop-blur-md
      ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-white/80 border-gray-200/50"}
      shadow-xl transition-all duration-300
    `}
    style={{
      boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={16} className="mr-1" />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      {value}
    </h3>
    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
      {title}
    </p>
    {subtitle && (
      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
)

// Progress Ring Component
const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = "#8B5CF6", isDarkMode }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

// Enhanced Day Card Component
const DayCard = ({ day, isSelected, onClick, isDarkMode, progress }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`
      relative p-4 rounded-2xl min-w-[180px] border transition-all duration-300
      ${
        isSelected
          ? isDarkMode
            ? "bg-gradient-to-br from-purple-600 to-blue-600 border-purple-500 shadow-lg shadow-purple-900/30"
            : "bg-gradient-to-br from-purple-600 to-blue-600 border-purple-500 shadow-lg shadow-purple-600/30"
          : isDarkMode
            ? "bg-slate-800/70 border-slate-700/50 hover:bg-slate-700/70"
            : "bg-white/80 border-gray-200/50 hover:bg-gray-100/80"
      }
    `}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className={`font-bold text-lg ${isSelected ? "text-white" : isDarkMode ? "text-white" : "text-gray-900"}`}>
        Day {day.dayNumber}
      </h3>
      <div className="relative">
        <ProgressRing 
          progress={progress} 
          size={40} 
          strokeWidth={4} 
          color={isSelected ? "#FFFFFF" : "#8B5CF6"}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
    <p className={`text-sm ${isSelected ? "text-blue-100" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
      {day.dayTitle}
    </p>
    <div className={`mt-2 text-xs ${isSelected ? "text-blue-200" : isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
      {day.questions.filter(q => q.status).length}/{day.questions.length} completed
    </div>
  </motion.button>
)

// Enhanced Question Card Component
const QuestionCard = ({ question, courseId, dayNumber, updateQuestionStatus, isDarkMode }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState(question.notes || "")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSaveNotes = () => {
    updateQuestionStatus(courseId, dayNumber, question.id, { notes: tempNotes })
    setIsEditingNotes(false)
  }

  const handleCancelNotes = () => {
    setTempNotes(question.notes || "")
    setIsEditingNotes(false)
  }

  const difficultyColors = {
    Easy: isDarkMode 
      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-emerald-100" 
      : "bg-gradient-to-r from-green-600 to-green-500 text-green-100",
    Medium: isDarkMode 
      ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-100" 
      : "bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-100",
    Hard: isDarkMode 
      ? "bg-gradient-to-r from-red-600 to-red-500 text-red-100" 
      : "bg-gradient-to-r from-red-600 to-red-500 text-red-100"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative border rounded-2xl p-6 shadow-xl transition-all duration-300 group
        ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-white/80 border-gray-200/50"}
        hover:shadow-2xl hover:scale-[1.02] backdrop-blur-md
      `}
      style={{
        boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        {question.status ? (
          <CheckCircle className="text-green-500" size={24} />
        ) : (
          <Circle className={`${isDarkMode ? "text-gray-600" : "text-gray-400"}`} size={24} />
        )}
      </div>

      {/* Question Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`text-lg font-bold leading-tight pr-8 ${isDarkMode ? "text-zinc-100" : "text-gray-900"}`}>
            {question.title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
          
          {question.forRevision && (
            <Star className="text-yellow-500 fill-current" size={18} />
          )}
        </div>
      </div>

      {/* Action Links */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-3">
          {question.links.article && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={question.links.article}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                p-2 rounded-xl transition-all duration-200
                ${isDarkMode ? "bg-indigo-800 text-indigo-300 hover:bg-indigo-700" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}
              `}
              title="Article"
            >
              <FileText size={18} />
            </motion.a>
          )}
          {question.links.youtube && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={question.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                p-2 rounded-xl transition-all duration-200
                ${isDarkMode ? "bg-red-800 text-red-300 hover:bg-red-700" : "bg-red-100 text-red-600 hover:bg-red-200"}
              `}
              title="YouTube Tutorial"
            >
              <PlayCircle size={18} />
            </motion.a>
          )}
          {question.links.practice && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={question.links.practice}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                p-2 rounded-xl transition-all duration-200
                ${isDarkMode ? "bg-green-800 text-green-300 hover:bg-green-700" : "bg-green-100 text-green-600 hover:bg-green-200"}
              `}
              title="Problem Link"
            >
              <LinkIcon size={18} />
            </motion.a>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              updateQuestionStatus(courseId, dayNumber, question.id, {
                forRevision: !question.forRevision,
              })
            }
            className={`
              p-2 rounded-xl transition-all duration-200
              ${
                question.forRevision
                  ? isDarkMode
                    ? "bg-yellow-800 text-yellow-300"
                    : "bg-yellow-100 text-yellow-600"
                  : isDarkMode
                    ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }
            `}
            title="Mark for Revision"
          >
            <Star size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => updateQuestionStatus(courseId, dayNumber, question.id, { status: !question.status })}
            className={`
              p-2 rounded-xl transition-all duration-200
              ${
                question.status
                  ? isDarkMode
                    ? "bg-green-800 text-green-300"
                    : "bg-green-100 text-green-600"
                  : isDarkMode
                    ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }
            `}
            title="Mark as Complete"
          >
            <CheckSquare size={18} />
          </motion.button>
        </div>
      </div>

      {/* Notes Section */}
      <div className={`
        p-4 rounded-xl border
        ${isDarkMode ? "bg-slate-700/50 border-slate-600/50" : "bg-gray-50/70 border-gray-200/50"}
      `}>
        <div className="flex justify-between items-center mb-3">
          <h4 className={`text-sm font-semibold ${isDarkMode ? "text-zinc-200" : "text-gray-700"}`}>
            Notes
          </h4>
          <div className="flex space-x-2">
            {!isEditingNotes ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditingNotes(true)}
                  className={`
                    p-1 rounded-lg transition-all duration-200
                    ${isDarkMode ? "text-indigo-400 hover:bg-indigo-900/30" : "text-blue-600 hover:bg-blue-100"}
                  `}
                  title="Edit Notes"
                >
                  <Edit size={14} />
                </motion.button>
                {question.notes && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateQuestionStatus(courseId, dayNumber, question.id, { notes: "" })}
                    className={`
                      p-1 rounded-lg transition-all duration-200
                      ${isDarkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-100"}
                    `}
                    title="Clear Notes"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                )}
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSaveNotes}
                  className={`
                    p-1 rounded-lg transition-all duration-200
                    ${isDarkMode ? "text-emerald-400 hover:bg-emerald-900/30" : "text-green-600 hover:bg-green-100"}
                  `}
                  title="Save Notes"
                >
                  <CheckSquare size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancelNotes}
                  className={`
                    p-1 rounded-lg transition-all duration-200
                    ${isDarkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-100"}
                  `}
                  title="Cancel Editing"
                >
                  <X size={14} />
                </motion.button>
              </>
            )}
          </div>
        </div>
        {isEditingNotes ? (
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            className={`
              w-full p-3 rounded-lg text-sm resize-none
              ${isDarkMode ? "bg-slate-600 text-zinc-100 border-slate-500" : "bg-white text-gray-800 border-gray-300"}
              border focus:outline-none focus:ring-2 focus:ring-purple-500
            `}
            rows={3}
            placeholder="Add your notes here..."
          />
        ) : (
          <p className={`text-sm ${isDarkMode ? "text-zinc-300" : "text-gray-600"}`}>
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
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showStats, setShowStats] = useState(true)

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (!course) return {}
    
    const totalQuestions = course.totalQuestions || 0
    const completedQuestions = course.completedQuestions || 0
    const completionRate = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0
    
    const questionsForRevision = course.days?.reduce((acc, day) => 
      acc + day.questions.filter(q => q.forRevision).length, 0) || 0
    
    const questionsWithNotes = course.days?.reduce((acc, day) => 
      acc + day.questions.filter(q => q.notes && q.notes.trim() !== "").length, 0) || 0
    
    const difficultyStats = course.days?.reduce((acc, day) => {
      day.questions.forEach(q => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
        if (q.status) {
          acc[`${q.difficulty}Completed`] = (acc[`${q.difficulty}Completed`] || 0) + 1
        }
      })
      return acc
    }, {}) || {}
    
    const currentStreak = calculateStreak(course.days || [])
    const avgDailyProgress = course.days?.length > 0 ? completedQuestions / course.days.length : 0
    
    return {
      totalQuestions,
      completedQuestions,
      completionRate,
      questionsForRevision,
      questionsWithNotes,
      difficultyStats,
      currentStreak,
      avgDailyProgress: Math.round(avgDailyProgress * 100) / 100
    }
  }, [course])

  // Calculate study streak
  const calculateStreak = (days) => {
    let streak = 0
    const today = new Date()
    
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i]
      const hasProgress = day.questions.some(q => q.status)
      
      if (hasProgress) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

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

  // Calculate day progress for navigation
  const getDayProgress = (day) => {
    const completed = day.questions.filter(q => q.status).length
    return (completed / day.questions.length) * 100
  }

  // Render Loading State
  if (loading) {
    return (
      <div
        className={`
          min-h-screen flex items-center justify-center
          transition-colors duration-300 p-4 pt-24
          ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}
        `}
      >
        <div
          className={`
            animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-t-4
            ${isDarkMode ? "border-indigo-400" : "border-blue-500"}
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
          min-h-screen flex flex-col items-center justify-center
          transition-colors duration-300 p-4 pt-24
          ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}
        `}
      >
        <div
          className={`
            text-center p-8 rounded-2xl shadow-2xl w-full max-w-md
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
          min-h-screen flex items-center justify-center
          transition-colors duration-300 p-4 pt-24
          ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}
        `}
      >
        <div
          className={`
            text-center max-w-md w-full p-8 rounded-2xl shadow-2xl
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
        min-h-screen pt-20 flex flex-col
        ${isDarkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-zinc-100" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"}
        transition-all duration-300
      `}
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-3xl" />
        <div className="relative z-10 text-center py-12 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-4
              bg-clip-text text-transparent
              ${isDarkMode ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"}
            `}
          >
            {course?.courseTitle || "Course Progress"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto`}
          >
            Track your coding journey with advanced analytics and personalized insights
          </motion.p>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`mt-4 inline-flex items-center px-6 py-3 rounded-full backdrop-blur-md
                ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/70 border border-gray-200/50"}
              `}
            >
              <Users size={20} className="mr-2 text-purple-500" />
              <span className="font-medium">Welcome back, {user.name || user.email}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Statistics Dashboard */}
        {showStats && stats.totalQuestions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
            <div className="lg:col-span-2 xl:col-span-2">
              <StatsCard
                title="Overall Progress"
                value={`${stats.completedQuestions}/${stats.totalQuestions}`}
                subtitle={`${Math.round(stats.completionRate)}% Complete`}
                icon={Target}
                color="bg-gradient-to-r from-purple-600 to-purple-500"
                trend={stats.completionRate > 50 ? 12 : -5}
                isDarkMode={isDarkMode}
              />
            </div>
            
            <StatsCard
              title="Study Streak"
              value={`${stats.currentStreak} days`}
              subtitle="Keep it up!"
              icon={Flame}
              color="bg-gradient-to-r from-orange-600 to-red-500"
              trend={stats.currentStreak > 3 ? 15 : 0}
              isDarkMode={isDarkMode}
            />
            
            <StatsCard
              title="For Revision"
              value={stats.questionsForRevision}
              subtitle="Questions marked"
              icon={RotateCcw}
              color="bg-gradient-to-r from-yellow-600 to-yellow-500"
              isDarkMode={isDarkMode}
            />
            
            <StatsCard
              title="Notes Added"
              value={stats.questionsWithNotes}
              subtitle="Questions documented"
              icon={Brain}
              color="bg-gradient-to-r from-green-600 to-emerald-500"
              isDarkMode={isDarkMode}
            />
            
            <StatsCard
              title="Daily Average"
              value={stats.avgDailyProgress}
              subtitle="Questions per day"
              icon={Activity}
              color="bg-gradient-to-r from-blue-600 to-indigo-500"
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}

        {/* Progress Ring and Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`
            p-8 rounded-3xl border backdrop-blur-md
            ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-white/80 border-gray-200/50"}
            shadow-2xl
          `}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <ProgressRing 
                  progress={stats.completionRate || 0} 
                  size={160} 
                  strokeWidth={12} 
                  color="#8B5CF6"
                  isDarkMode={isDarkMode}
                />
                <p className={`mt-4 text-lg font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Overall Progress
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Easy: {stats.difficultyStats?.EasyCompleted || 0}/{stats.difficultyStats?.Easy || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Medium: {stats.difficultyStats?.MediumCompleted || 0}/{stats.difficultyStats?.Medium || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Hard: {stats.difficultyStats?.HardCompleted || 0}/{stats.difficultyStats?.Hard || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className={`
                    px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300
                    ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}
                  `}
                >
                  <BarChart3 size={20} />
                  <span>{showStats ? 'Hide' : 'Show'} Stats</span>
                </button>
                
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center space-x-2 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <Filter size={20} />
                  <span>Filters</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-all duration-200
                    ${viewMode === 'grid' 
                      ? 'bg-purple-600 text-white' 
                      : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-all duration-200
                    ${viewMode === 'list' 
                      ? 'bg-purple-600 text-white' 
                      : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Day Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`
            p-6 rounded-2xl border backdrop-blur-md
            ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-white/80 border-gray-200/50"}
            shadow-xl
          `}
        >
          <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Calendar className="mr-3 text-purple-500" size={28} />
            Course Timeline
          </h2>
          
          <div className="flex overflow-x-auto pb-4 space-x-4">
            {course?.days.map((day) => (
              <DayCard
                key={day.dayNumber}
                day={day}
                isSelected={selectedDay === day.dayNumber}
                onClick={() => setSelectedDay(day.dayNumber)}
                isDarkMode={isDarkMode}
                progress={getDayProgress(day)}
              />
            ))}
          </div>
        </motion.div>

        {/* Questions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`
            p-8 rounded-3xl border backdrop-blur-md
            ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-white/80 border-gray-200/50"}
            shadow-2xl
          `}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <h2 className={`text-3xl font-bold flex items-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <BookOpen className="mr-3 text-purple-500" size={32} />
              Day {selectedDay}: {course?.days.find((d) => d.dayNumber === selectedDay)?.dayTitle || "Loading..."}
            </h2>
            
            <div className={`mt-4 sm:mt-0 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Showing {filteredQuestionsForSelectedDay.length} of {course?.days.find((d) => d.dayNumber === selectedDay)?.questions.length || 0} questions
            </div>
          </div>

          {filteredQuestionsForSelectedDay.length > 0 ? (
            <motion.div 
              layout 
              className={`
                ${viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }
              `}
            >
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`
                text-center p-12 rounded-2xl border-2 border-dashed
                ${isDarkMode ? "border-slate-700 text-slate-500 bg-slate-800/30" : "border-gray-200 text-gray-400 bg-gray-50/30"}
              `}
            >
              <div className="space-y-4">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                  <BookOpen size={40} className={isDarkMode ? "text-slate-500" : "text-gray-400"} />
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  No questions found
                </h3>
                <p className={`${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>
                  Try adjusting your filters or select a different day
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
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
