"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { ChevronLeft, ChevronRight, Code, Zap, Sparkles, ArrowRight, Star, Layers, Server, Users, Rocket, Lightbulb, LineChart, Cpu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Features data - preserved exactly as original
const features = [
  {
    id: 1,
    name: "Interactive Coding Environment",
    description: "Write, run, and debug code in 40+ programming languages with our powerful online compiler.",
    icon: <Code className="h-6 w-6" />,
    details: "Real-time execution and error feedback",
    category: "Development Tools",
    techStack: ["JavaScript", "Python", "Java", "C++", "Ruby"],
    image: "/placeholder.svg?height=150&width=150",
    color: "blue",
  },
  {
    id: 2,
    name: "Live Collaboration",
    description: "Collaborate on code in real-time with peers, mentors, or instructors using our shared workspace.",
    icon: <Users className="h-6 w-6" />,
    details: "Multiple users can edit simultaneously",
    category: "Collaboration",
    techStack: ["WebSockets", "Real-time Sync", "Video Chat", "Text Chat"],
    image: "/placeholder.svg?height=150&width=150",
    color: "green",
  },
  {
    id: 3,
    name: "Algorithm Visualization",
    description: "Visualize complex algorithms and data structures to understand their inner workings.",
    icon: <Layers className="h-6 w-6" />,
    details: "Step-by-step execution with visual feedback",
    category: "Learning Tools",
    techStack: ["Arrays", "Linked Lists", "Trees", "Graphs", "Sorting Algorithms"],
    image: "/placeholder.svg?height=150&width=150",
    color: "indigo",
  },
  {
    id: 4,
    name: "Competitive Programming",
    description: "Practice and compete with coding challenges from popular platforms like LeetCode, CodeChef, and Codeforces.",
    icon: <Rocket className="h-6 w-6" />,
    details: "Contest tracking and performance analytics",
    category: "Practice",
    techStack: ["Problem Solving", "Algorithms", "Data Structures", "Contest Strategy"],
    image: "/placeholder.svg?height=150&width=150",
    color: "purple",
  },
  {
    id: 5,
    name: "Interview Preparation",
    description: "Get ready for technical interviews with specialized courses and mock interview sessions.",
    icon: <Star className="h-6 w-6" />,
    details: "Industry-standard interview questions",
    category: "Career Development",
    techStack: ["System Design", "Behavioral Questions", "Coding Challenges", "Resume Review"],
    image: "/placeholder.svg?height=150&width=150",
    color: "amber",
  },
  {
    id: 6,
    name: "Performance Analytics",
    description: "Track your learning progress, identify strengths and weaknesses, and optimize your study plan.",
    icon: <LineChart className="h-6 w-6" />,
    details: "Personalized recommendations based on your performance",
    category: "Progress Tracking",
    techStack: ["Learning Analytics", "Progress Visualization", "Skill Mapping", "Performance Metrics"],
    image: "/placeholder.svg?height=150&width=150",
    color: "cyan",
  },
  {
    id: 7,
    name: "Comprehensive Courses",
    description: "Learn from structured courses covering everything from programming basics to advanced topics.",
    icon: <Cpu className="h-6 w-6" />,
    details: "Industry-relevant curriculum updated regularly",
    category: "Education",
    techStack: ["Full Stack Development", "Data Structures", "Machine Learning", "Cloud Computing"],
    image: "/placeholder.svg?height=150&width=150",
    color: "emerald",
  },
  {
    id: 8,
    name: "Backend Integration",
    description: "Connect your frontend to powerful backend services with seamless API integration.",
    icon: <Server className="h-6 w-6" />,
    details: "Supports RESTful and GraphQL APIs",
    category: "Infrastructure",
    techStack: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase"],
    image: "/placeholder.svg?height=150&width=150",
    color: "rose",
  }
]

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { isDarkMode } = useTheme()

  const getColorClasses = (color, type) => {
    const colors = {
      blue: {
        bg: isDarkMode ? "bg-blue-900/40" : "bg-blue-100",
        text: isDarkMode ? "text-blue-300" : "text-blue-700",
        border: isDarkMode ? "border-blue-800" : "border-blue-200",
        gradient: "from-blue-600 to-cyan-600",
        avatar: "from-blue-500 to-cyan-500",
      },
      green: {
        bg: isDarkMode ? "bg-green-900/40" : "bg-green-100",
        text: isDarkMode ? "text-green-300" : "text-green-700",
        border: isDarkMode ? "border-green-800" : "border-green-200",
        gradient: "from-green-600 to-emerald-600",
        avatar: "from-green-500 to-emerald-500",
      },
      indigo: {
        bg: isDarkMode ? "bg-indigo-900/40" : "bg-indigo-100",
        text: isDarkMode ? "text-indigo-300" : "text-indigo-700",
        border: isDarkMode ? "border-indigo-800" : "border-indigo-200",
        gradient: "from-indigo-600 to-blue-600",
        avatar: "from-indigo-500 to-blue-500",
      },
      purple: {
        bg: isDarkMode ? "bg-purple-900/40" : "bg-purple-100",
        text: isDarkMode ? "text-purple-300" : "text-purple-700",
        border: isDarkMode ? "border-purple-800" : "border-purple-200",
        gradient: "from-purple-600 to-indigo-600",
        avatar: "from-purple-500 to-indigo-500",
      },
      amber: {
        bg: isDarkMode ? "bg-amber-900/40" : "bg-amber-100",
        text: isDarkMode ? "text-amber-300" : "text-amber-700",
        border: isDarkMode ? "border-amber-800" : "border-amber-200",
        gradient: "from-amber-600 to-orange-600",
        avatar: "from-amber-500 to-orange-500",
      },
      cyan: {
        bg: isDarkMode ? "bg-cyan-900/40" : "bg-cyan-100",
        text: isDarkMode ? "text-cyan-300" : "text-cyan-700",
        border: isDarkMode ? "border-cyan-800" : "border-cyan-200",
        gradient: "from-cyan-600 to-blue-600",
        avatar: "from-cyan-500 to-blue-500",
      },
      emerald: {
        bg: isDarkMode ? "bg-emerald-900/40" : "bg-emerald-100",
        text: isDarkMode ? "text-emerald-300" : "text-emerald-700",
        border: isDarkMode ? "border-emerald-800" : "border-emerald-200",
        gradient: "from-emerald-600 to-green-600",
        avatar: "from-emerald-500 to-green-500",
      },
      rose: {
        bg: isDarkMode ? "bg-rose-900/40" : "bg-rose-100",
        text: isDarkMode ? "text-rose-300" : "text-rose-700",
        border: isDarkMode ? "border-rose-800" : "border-rose-200",
        gradient: "from-rose-600 to-pink-600",
        avatar: "from-rose-500 to-pink-500",
      }
    }
    return colors[color]?.[type] || ""
  }

  // Get visible features (4 at a time like testimonials)
  const getVisibleFeatures = () => {
    const visible = []
    for (let i = 0; i < 4; i++) {
      visible.push(features[(currentIndex + i) % features.length])
    }
    return visible
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1))
  }

  return (
    <motion.div
      className={`
        relative min-h-screen flex flex-col items-center justify-center
        px-4 py-16 transition-colors duration-300 overflow-hidden
        ${isDarkMode ? "bg-zinc-900 text-slate-300" : "bg-white text-slate-700"}
      `}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
     

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent ${
            isDarkMode ? "bg-gradient-to-r from-indigo-400 to-indigo-600" : "bg-gradient-to-r from-indigo-600 to-indigo-400"
          }`}>
            Powerful Features
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}>
            Explore the tools and capabilities that empower your coding journey
          </p>
        </motion.div>

        {/* Features Grid - Testimonial Style Layout */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {getVisibleFeatures().map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
                  ${isDarkMode 
                    ? "bg-zinc-900 border border-neutral-800" 
                    : "bg-white border border-neutral-200"
                  }
                  transform hover:scale-105
                `}
              >
                {/* Feature Header with Icon and Title */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    bg-gradient-to-r from-indigo-500 to-indigo-700
                    shadow-lg
                  `}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-lg mb-1 ${
                      isDarkMode ? "text-slate-200" : "text-slate-700"
                    }`}>
                      {feature.name}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-gray-500"
                    }`}>
                      {feature.category}
                    </p>
                  </div>
                </div>

                {/* Feature Description */}
                <blockquote className={`text-sm mb-4 leading-relaxed ${
                  isDarkMode ? "text-slate-300" : "text-gray-600"
                }`}>
                  "{feature.description}"
                </blockquote>

                {/* Feature Details */}
                <div className={`text-xs mb-4 px-3 py-2 rounded-lg ${
                  getColorClasses(feature.color, "bg")
                } ${getColorClasses(feature.color, "text")}`}>
                  <div className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-2" />
                    {feature.details}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <div className={`text-xs font-medium ${
                    isDarkMode ? "text-slate-400" : "text-gray-500"
                  }`}>
                    Tech Stack:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {feature.techStack.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`
                          px-2 py-1 text-xs rounded-full
                          ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}
                        `}
                      >
                        {tech}
                      </span>
                    ))}
                    {feature.techStack.length > 3 && (
                      <span className={`
                        px-2 py-1 text-xs rounded-full
                        ${isDarkMode ? "bg-slate-600 text-slate-400" : "bg-gray-200 text-gray-500"}
                      `}>
                        +{feature.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -left-6 -right-6 flex justify-between items-center pointer-events-none">
            <motion.button
              onClick={prevSlide}
              className={`
                pointer-events-auto p-3 rounded-full shadow-lg transition-all duration-300
                ${isDarkMode 
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className={`
                pointer-events-auto p-3 rounded-full shadow-lg transition-all duration-300
                ${isDarkMode 
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mb-12">
          {Array.from({ length: Math.ceil(features.length / 4) }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index * 4)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${Math.floor(currentIndex / 4) === index 
                  ? "w-8 bg-gradient-to-r from-blue-500 to-cyan-500" 
                  : isDarkMode ? "bg-slate-600 hover:bg-slate-500" : "bg-gray-300 hover:bg-gray-400"
                }
              `}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>

      </div>
    </motion.div>
  )
}

export default FeaturesSection