"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Home, Search, AlertTriangle, Code, BookOpen } from "lucide-react"

const NotFoundPage = () => {
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(10)


  // Countdown Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1)
      } else {
        navigate("/")
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, navigate])

  return (
    <div
      className={`
        relative min-h-screen flex items-center justify-center
        px-4 py-20 transition-colors duration-300
        ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"}
      `}
    >
      {/* Flowing Background */}

      {/* Content Container */}
      <div
        className={`
          relative z-10 max-w-2xl w-full
          rounded-2xl shadow-2xl p-8 sm:p-12 md:p-16
          transform transition-all duration-300 hover:scale-[1.02]
          backdrop-blur-md
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
        `}
        style={{
          boxShadow: isDarkMode ? "0 25px 50px rgba(0, 0, 0, 0.5)" : "0 25px 50px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Error Icon and Message */}
        <div className="flex flex-col items-center space-y-6 text-center">
          <AlertTriangle
            className={`
              text-7xl animate-bounce
              ${isDarkMode ? "text-purple-400" : "text-purple-600"}
            `}
          />
          <h1
            className={`
              text-4xl sm:text-5xl font-bold
              ${isDarkMode ? "text-white" : "text-gray-900"}
            `}
          >
            404 - Page Not Found
          </h1>
          <p
            className={`
              text-lg sm:text-xl max-w-md
              ${isDarkMode ? "text-slate-300" : "text-gray-700"}
            `}
          >
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        {/* Auto Redirect Countdown */}
        <div
          className={`
            mt-8 text-center text-lg font-medium
            ${isDarkMode ? "text-slate-400" : "text-gray-500"}
          `}
        >
          Redirecting to home in <span className="font-bold">{timeLeft}</span> seconds
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate("/")}
            className={`
              flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg
              transition-all duration-300 transform hover:scale-105
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
            <Home className="w-5 h-5" />
            <span>Go to Home</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className={`
              flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg border-2
              backdrop-blur-sm transition-all duration-300 transform hover:scale-105
              ${
                isDarkMode
                  ? "border-slate-600 text-slate-300 hover:border-purple-400 hover:text-purple-300 hover:bg-slate-800/60"
                  : "border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-700 hover:bg-white/80"
              }
            `}
          >
            <Search className="w-5 h-5" />
            <span>Reload Page</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3
            className={`
              text-xl font-semibold mb-6
              ${isDarkMode ? "text-slate-300" : "text-gray-700"}
            `}
          >
            Quick Navigation
          </h3>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/allcourse"
              className={`
                flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-medium text-lg
                transition-all duration-300 transform hover:scale-105 backdrop-blur-sm
                ${
                  isDarkMode
                    ? "bg-slate-800/60 text-purple-300 hover:bg-slate-800/80 border border-slate-700/50"
                    : "bg-purple-50/80 text-purple-600 hover:bg-purple-100/80 border border-purple-200/50"
                }
              `}
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </Link>
            <Link
              to="/projects"
              className={`
                flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-medium text-lg
                transition-all duration-300 transform hover:scale-105 backdrop-blur-sm
                ${
                  isDarkMode
                    ? "bg-slate-800/60 text-emerald-300 hover:bg-slate-800/80 border border-slate-700/50"
                    : "bg-emerald-50/80 text-emerald-600 hover:bg-emerald-100/80 border border-emerald-200/50"
                }
              `}
            >
              <Code size={20} />
              <span>Projects</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          25% {
            transform: translateY(-10px) translateX(5px) scale(1.02);
          }
          50% {
            transform: translateY(-5px) translateX(-5px) scale(0.98);
          }
          75% {
            transform: translateY(-12px) translateX(3px) scale(1.01);
          }
        }
      `}</style>
    </div>
  )
}

export default NotFoundPage
