"use client"

import React, { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom"
import { Code, Server, Briefcase, ArrowRight, FileCode } from "lucide-react"
import { motion } from "framer-motion" // Import motion for animations

const courseData = [
  {
    title: "JavaScript Mastery",
    description: "Learn JavaScript from basics to advanced concepts with hands-on practice",
    level: "All Levels",
    icon: <FileCode />,
    color: "blue", // Using blue for variety
    skills: ["ES6+", "DOM", "Async/Await", "Projects"],
    route: "/learning/javascript",
  },
  {
    title: "Data Structures Fundamentals",
    description: "Master the core building blocks of efficient programming",
    level: "Beginner",
    icon: <Code />,
    color: "indigo", // Used for accent colors
    skills: ["Arrays", "Linked Lists", "Stacks"],
    route: "/courses/data-structures",
  },
  {
    title: "Full Stack Web Development",
    description: "Comprehensive journey through modern web technologies",
    level: "Intermediate",
    icon: <Server />,
    color: "indigo", // Used for accent colors
    skills: ["React", "Node.js", "MongoDB", "Express"],
    route: "/courses/fullstack",
  },
  {
    title: "Technical Interview Preparation",
    description: "Strategies and practice for acing technical interviews",
    level: "Advanced",
    icon: <Briefcase />,
    color: "indigo", // Used for accent colors
    skills: ["Problem Solving", "Algorithmic Thinking", "Mock Interviews"],
    route: "/courses/interview-prep",
  },
]

const DsaCard = () => {
  const { isDarkMode } = useTheme()
  const [hoveredCard, setHoveredCard] = useState(null)
  const navigate = useNavigate()

  const handleExplore = (route) => {
    navigate(route)
  }

  // Helper function to get accent colors based on theme and course color
  const getAccentColor = (baseColor, type) => {
    const colors = {
      indigo: {
        text: isDarkMode ? "text-indigo-300" : "text-indigo-600",
        "bg-light": "bg-indigo-100",
        "bg-dark": "bg-indigo-900/30",
        "gradient-from-light": "from-indigo-600",
        "gradient-to-light": "to-blue-600",
        "gradient-from-dark": "from-indigo-400",
        "gradient-to-dark": "to-blue-400",
        "orb-dark": "rgba(99, 102, 241, 0.4)", // indigo-400
        "orb-light": "rgba(99, 102, 241, 0.2)", // indigo-600
      },
      blue: {
        text: isDarkMode ? "text-blue-300" : "text-blue-600",
        "bg-light": "bg-blue-100",
        "bg-dark": "bg-blue-900/30",
        "gradient-from-light": "from-blue-600",
        "gradient-to-light": "to-indigo-600",
        "gradient-from-dark": "from-blue-400",
        "gradient-to-dark": "to-indigo-400",
        "orb-dark": "rgba(59, 130, 246, 0.4)", // blue-400
        "orb-light": "rgba(37, 99, 235, 0.2)", // blue-600
      },
    }
    const colorMap = colors[baseColor]
    if (!colorMap) return ""

    switch (type) {
      case "text":
        return colorMap.text
      case "bg-light":
        return colorMap["bg-light"]
      case "bg-dark":
        return colorMap["bg-dark"]
      case "gradient-from":
        return isDarkMode ? colorMap["gradient-from-dark"] : colorMap["gradient-from-light"]
      case "gradient-to":
        return isDarkMode ? colorMap["gradient-to-dark"] : colorMap["gradient-to-light"]
      case "orb-dark":
        return colorMap["orb-dark"]
      case "orb-light":
        return colorMap["orb-light"]
      default:
        return ""
    }
  }

  return (
    <div
      className={`
        min-h-screen py-24 px-4 sm:px-6 lg:px-8
        ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"}
        transition-colors duration-300
      `}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`
            text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16
            bg-clip-text text-transparent
            ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
                : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
            }
          `}
        >
          Explore Our Courses
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map((course, index) => (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-2xl
                transform transition-all duration-500 ease-in-out
                border group cursor-pointer
                ${hoveredCard === index ? "scale-[1.02] shadow-2xl" : "scale-100 shadow-lg"}
                ${
                  isDarkMode
                    ? `bg-slate-800/70 border-slate-700/50 hover:border-purple-400/50`
                    : `bg-white/80 border-gray-200/50 hover:border-purple-500/50`
                }
              `}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                boxShadow:
                  hoveredCard === index
                    ? isDarkMode
                      ? "0 15px 40px rgba(0,0,0,0.4)"
                      : "0 15px 40px rgba(0,0,0,0.1)"
                    : isDarkMode
                      ? "0 8px 20px rgba(0,0,0,0.2)"
                      : "0 5px 15px rgba(0,0,0,0.08)",
              }}
            >
              {/* Animated Orb Background on Hover */}
              <motion.div
                className={`absolute inset-0 rounded-full pointer-events-none`}
                initial={{ opacity: 0, scale: 0 }}
                animate={hoveredCard === index ? { opacity: 0.2, scale: 1.5 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  background: isDarkMode
                    ? `radial-gradient(circle at center, ${getAccentColor(course.color, "orb-dark")} 0%, transparent 70%)`
                    : `radial-gradient(circle at center, ${getAccentColor(course.color, "orb-light")} 0%, transparent 70%)`,
                }}
              />

              <div className="relative p-6 sm:p-8 z-10">
                {/* Icon Container */}
                <div
                  className={`
                    mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
                    ${isDarkMode ? getAccentColor(course.color, "bg-dark") : getAccentColor(course.color, "bg-light")}
                    ${isDarkMode ? getAccentColor(course.color, "text") : getAccentColor(course.color, "text")}
                    transition-transform duration-500
                    transform
                    ${hoveredCard === index ? "rotate-12 scale-110 shadow-lg" : "rotate-0 scale-100"}
                  `}
                  style={{
                    boxShadow: isDarkMode ? "0 0 25px rgba(0,0,0,0.3)" : "0 0 15px rgba(0,0,0,0.1)",
                  }}
                >
                  {React.cloneElement(course.icon, {
                    size: 32, // Adjusted icon size for better fit
                    strokeWidth: hoveredCard === index ? 1.5 : 1,
                  })}
                </div>

                {/* Course Title */}
                <h3
                  className={`
                    text-xl sm:text-2xl font-bold mb-3
                    transition-colors duration-300
                    ${isDarkMode ? "text-white group-hover:text-opacity-90" : "text-gray-900 group-hover:text-opacity-90"}
                  `}
                >
                  {course.title}
                </h3>

                {/* Course Description */}
                <p
                  className={`
                    mb-6 text-sm sm:text-base
                    ${isDarkMode ? "text-slate-300" : "text-gray-600"}
                    transition-all duration-300
                    group-hover:text-opacity-80
                  `}
                >
                  {course.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${isDarkMode ? getAccentColor(course.color, "bg-dark") : getAccentColor(course.color, "bg-light")}
                        ${isDarkMode ? getAccentColor(course.color, "text") : getAccentColor(course.color, "text")}
                      `}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div
                  className={`
                    flex items-center justify-between mt-4
                    ${isDarkMode ? "text-slate-400" : "text-gray-500"}
                  `}
                >
                  <span
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${isDarkMode ? getAccentColor(course.color, "bg-dark") : getAccentColor(course.color, "bg-light")}
                      ${isDarkMode ? getAccentColor(course.color, "text") : getAccentColor(course.color, "text")}
                    `}
                  >
                    {course.level}
                  </span>
                  <button
                    onClick={() => handleExplore(course.route)}
                    className={`
                      flex items-center group px-4 py-2 rounded-lg font-semibold text-sm
                      transition-all duration-300 transform hover:scale-105
                      ${
                        isDarkMode
                          ? `bg-gradient-to-r ${getAccentColor(course.color, "gradient-from")} ${getAccentColor(course.color, "gradient-to")} text-white hover:${getAccentColor(course.color, "gradient-from")}/90 hover:${getAccentColor(course.color, "gradient-to")}/90`
                          : `bg-gradient-to-r ${getAccentColor(course.color, "gradient-from")} ${getAccentColor(course.color, "gradient-to")} text-white hover:${getAccentColor(course.color, "gradient-from")}/90 hover:${getAccentColor(course.color, "gradient-to")}/90`
                      }
                    `}
                    style={{
                      boxShadow: isDarkMode ? "0 4px 15px rgba(0,0,0,0.2)" : "0 4px 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span className="mr-2 group-hover:mr-3 transition-all">Explore Course</span>
                    <ArrowRight
                      className="transform transition-transform group-hover:translate-x-1"
                      size={18} // Adjusted icon size
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DsaCard
