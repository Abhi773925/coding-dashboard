"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useTheme } from "../context/ThemeContext"
import { Zap, Award, AlertTriangle, Loader2 } from "lucide-react" // Using Lucide React icons
import { motion } from "framer-motion" // Import motion for animations

const Streak = () => {
  const { isDarkMode } = useTheme()
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configure axios base URL for backend
  axios.defaults.baseURL = "https://prepmate-kvol.onrender.com/api"

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail) {
          throw new Error("No user email found. Please log in.")
        }
        const response = await axios.get("/streak", {
          params: { email: userEmail },
        })
        setStreak(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchStreak()
  }, [])

  const handleUpdateStreak = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        throw new Error("No user email found. Please log in.")
      }
      // Optimistic update
      setStreak((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak + 1, // Assume success for immediate feedback
      }))
      const response = await axios.post("/streak/update", {
        email: userEmail,
      })
      setStreak(response.data) // Update with actual data from server
    } catch (err) {
      setError(err.message)
      // Revert optimistic update if error occurs
      setStreak((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak > 0 ? prev.currentStreak - 1 : 0,
      }))
      setError(err.message)
    }
  }

  // Framer Motion Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.3 } },
  }

  if (loading)
    return (
      <div
        className={`w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg flex items-center justify-center h-48
          ${isDarkMode ? "bg-slate-800/70 text-slate-300" : "bg-white/80 text-gray-700"}
          transition-colors duration-500 border ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}
      >
        <Loader2 className="animate-spin mr-3 text-indigo-500" size={24} />
        <span className="font-medium">Loading streak...</span>
      </div>
    )

  if (error)
    return (
      <div
        className={`w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center h-48 text-center
          ${isDarkMode ? "bg-red-900/50 border border-red-700/50 text-red-300" : "bg-red-50/80 border border-red-200/50 text-red-700"}
          transition-colors duration-500`}
      >
        <AlertTriangle className="mb-3 text-red-500" size={32} />
        <p className="font-semibold mb-2">Error loading streak:</p>
        <p className="text-sm">{error}</p>
      </div>
    )

  return (
    <motion.div
      className={`w-full max-w-md mx-auto rounded-2xl shadow-xl overflow-hidden
        ${isDarkMode ? "bg-slate-800/70 border bg-zinc-900" : "bg-white/80 border border-gray-200/50"}
        transition-colors duration-500`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.01,
        boxShadow: isDarkMode ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.15)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className={`px-6 py-4 flex items-center justify-between
          ${isDarkMode ? "bg-zinc-900 border-b border-slate-600/50" : "bg-gray-100/50 border-b border-gray-200/50"}`}
      >
        <h2
          className={`text-2xl font-bold
            bg-clip-text text-transparent
            ${isDarkMode ? "bg-gradient-to-r from-orange-400 to-yellow-400" : "bg-gradient-to-r from-orange-600 to-yellow-600"}`}
        >
          Coding Streak
        </h2>
        <Zap className="text-orange-500" size={28} />
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            variants={itemVariants}
            className={`p-4 rounded-lg text-center
              ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              Current Streak
            </p>
            <div className="flex flex-col items-center">
              <Zap className="text-orange-500 mb-2" size={32} />
              <span className={`text-4xl font-extrabold ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
                {streak.currentStreak}
              </span>
              <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>days</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`p-4 rounded-lg text-center
              ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              Longest Streak
            </p>
            <div className="flex flex-col items-center">
              <Award className="text-yellow-500 mb-2" size={32} />
              <span className={`text-4xl font-extrabold ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
                {streak.longestStreak}
              </span>
              <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>days</span>
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={handleUpdateStreak}
          className={`w-full py-3 rounded-xl text-slate-300 font-semibold text-lg
            transition-all duration-300 transform hover:scale-[1.02]
            ${isDarkMode ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"}
            shadow-lg ${isDarkMode ? "shadow-purple-900/30" : "shadow-purple-600/30"}`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Log Today's Coding
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Streak
