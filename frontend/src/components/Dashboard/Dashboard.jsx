"use client"

import { useState, useEffect } from "react"
import { Code, Terminal, BookOpen, Zap, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import Analytics from "./Analytics"

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme() // Use theme from context
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Code />,
      title: "Project Tracking",
      description: "Seamlessly monitor your project progress with intuitive visualizations and real-time insights.",
    },
    {
      icon: <Terminal />,
      title: "Code Insights",
      description: "Deep dive into your coding patterns, performance metrics, and optimization opportunities.",
    },
    {
      icon: <BookOpen />,
      title: "Learning Path",
      description: "Personalized skill development roadmap tailored to your coding journey and career goals.",
    },
  ]

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [features.length])

  // Variants for Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8
        ${isDarkMode ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-900"}
        transition-colors duration-500`}
    >
      <div className="w-full max-w-7xl mb-8">
        <Analytics />
      </div>
      {/* Animated Background Blobs with Enhanced Glow */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none
          ${isDarkMode ? "opacity-30" : "opacity-10"}`}
      >
        <div
          className={`absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob
            ${isDarkMode ? "bg-indigo-900" : "bg-indigo-400"}`}
          style={{ boxShadow: isDarkMode ? "0 0 80px rgba(168,85,247,0.6)" : "0 0 60px rgba(168,85,247,0.4)" }}
        ></div>
        <div
          className={`absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000
            ${isDarkMode ? "bg-blue-900" : "bg-blue-400"}`}
          style={{ boxShadow: isDarkMode ? "0 0 80px rgba(59,130,246,0.6)" : "0 0 60px rgba(59,130,246,0.4)" }}
        ></div>
        <div
          className={`absolute top-1/4 left-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000
            ${isDarkMode ? "bg-emerald-900" : "bg-emerald-400"}`}
          style={{ boxShadow: isDarkMode ? "0 0 80px rgba(52,211,153,0.6)" : "0 0 60px rgba(52,211,153,0.4)" }}
        ></div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text and Feature Section */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10 lg:pr-12">
          <motion.div variants={itemVariants}>
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight tracking-tight
                bg-clip-text text-transparent
                ${isDarkMode ? "bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400" : "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600"}`}
            >
              Your Ultimate Coding <span className="block">Companion</span>
            </h1>
            <p
              className={`text-lg sm:text-xl leading-relaxed
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Elevate your development workflow with intelligent insights, real-time progress tracking, and personalized
              learning paths designed for modern developers.
            </p>
          </motion.div>

          {/* Interactive Feature Showcase */}
          <motion.div variants={containerVariants} className="space-y-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onClick={() => setActiveFeature(index)}
                whileHover={{
                  scale: 1.02,
                  boxShadow: isDarkMode ? "0 15px 30px rgba(0,0,0,0.4)" : "0 15px 30px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer p-5 rounded-xl transition-all duration-300 group border
                  ${
                    activeFeature === index
                      ? isDarkMode
                        ? "bg-slate-800/70 border-purple-600 shadow-lg shadow-purple-900/40"
                        : "bg-white/90 border-purple-500 shadow-xl shadow-purple-300/40"
                      : isDarkMode
                        ? "bg-slate-800/40 bg-zinc-900 hover:border-purple-700/50"
                        : "bg-gray-100/70 border-gray-200/50 hover:border-purple-200/50"
                  }`}
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    className={`p-3 rounded-full transition-colors duration-300
                      ${
                        activeFeature === index
                          ? isDarkMode
                            ? "bg-purple-700 text-slate-300 shadow-lg shadow-purple-900/50"
                            : "bg-purple-500 text-slate-300 shadow-lg shadow-purple-300/50"
                          : isDarkMode
                            ? "bg-slate-700 text-purple-400"
                            : "bg-gray-200 text-purple-600"
                      }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-xl transition-colors duration-300
                        ${
                          activeFeature === index
                            ? isDarkMode
                              ? "text-slate-300"
                              : "text-gray-900"
                            : isDarkMode
                              ? "text-gray-200"
                              : "text-gray-800"
                        }`}
                    >
                      {feature.title}
                    </h3>
                    <AnimatePresence mode="wait">
                      {activeFeature === index && (
                        <motion.p
                          key={feature.title}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {feature.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons with Glow Effects */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: isDarkMode ? "0 10px 30px rgba(168,85,247,0.4)" : "0 10px 30px rgba(168,85,247,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center px-8 py-4 rounded-xl font-semibold text-lg
                transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-slate-300 hover:from-purple-500 hover:to-blue-500"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-slate-300 hover:from-purple-700 hover:to-blue-700"
                }`}
            >
              Get Started
              <ChevronRight className="ml-3 transform transition-transform group-hover:translate-x-1" size={20} />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.2)" : "0 10px 30px rgba(0,0,0,0.08)",
              }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center px-8 py-4 rounded-xl font-semibold text-lg border-2
                backdrop-blur-sm transition-all duration-300
                ${
                  isDarkMode
                    ? "border-slate-600 text-slate-300 hover:border-purple-400 hover:text-purple-300 hover:bg-zinc-900/60"
                    : "border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-700 hover:bg-white/80"
                }`}
            >
              Learn More
              <Zap className="ml-3 transform transition-transform group-hover:rotate-12" size={20} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Code Editor Mockup with Dynamic Content and Glow Effect */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div
            className={`w-full max-w-[550px] h-[550px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500
              ${
                isDarkMode
                  ? "bg-zinc-900 border bg-zinc-900 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                  : "bg-white border border-gray-200/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
              }
              hover:ring-2 hover:ring-purple-500/30`}
          >
            <div
              className={`p-6 h-full flex flex-col
                ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
            >
              <div className="flex space-x-2 mb-4">
                {["red", "yellow", "green"].map((color) => (
                  <div key={color} className={`w-4 h-4 rounded-full bg-${color}-500`}></div>
                ))}
              </div>
              <div
                className={`flex-1 rounded-lg p-4 relative overflow-hidden font-mono text-sm
                  ${isDarkMode ? "bg-zinc-900 text-green-400" : "bg-white text-green-700"}`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-50 animate-pulse"
                  style={{ animationDuration: "3s" }}
                ></div>
                <AnimatePresence mode="wait">
                  {activeFeature === 0 && (
                    <motion.pre
                      key="code-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="whitespace-pre-wrap"
                    >
                      {`// Project Tracking Module
import { trackProgress, visualizeData } from './project-api';

const projectId = 'dev-dashboard-v2';
const tasks = ['UI/UX Design', 'Backend API', 'Frontend Dev', 'Deployment'];

async function updateProjectStatus() {
  console.log('> Fetching project status...');
  const status = await trackProgress(projectId);
  console.log('> Current Status:', status.overall);
  visualizeData(status.tasks);
  console.log('> Dashboard updated successfully!');
}

updateProjectStatus();`}
                    </motion.pre>
                  )}
                  {activeFeature === 1 && (
                    <motion.pre
                      key="code-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="whitespace-pre-wrap"
                    >
                      {`// Code Insights Engine
import { analyzeCode, suggestOptimizations } from './ai-code-analyzer';

const filePath = 'src/components/ComplexComponent.js';

async function getCodeInsights() {
  console.log('> Analyzing code for:', filePath);
  const insights = await analyzeCode(filePath);
  console.log('> Performance Score:', insights.performance);
  console.log('> Readability Score:', insights.readability);
  suggestOptimizations(insights.bottlenecks);
  console.log('> Insights generated. Ready for review.');
}

getCodeInsights();`}
                    </motion.pre>
                  )}
                  {activeFeature === 2 && (
                    <motion.pre
                      key="code-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="whitespace-pre-wrap"
                    >
                      {`// Personalized Learning Path
import { getLearningPath, recommendCourses } from './learning-engine';

const userId = 'user_12345';

async function loadLearningPath() {
  console.log('> Loading learning path for user:', userId);
  const path = await getLearningPath(userId);
  console.log('> Next up:', path.currentModule);
  recommendCourses(path.recommendedSkills);
  console.log('> Keep up the great work!');
}

loadLearningPath();`}
                    </motion.pre>
                  )}
                </AnimatePresence>
                <p className="ml-4 animate-pulse">|</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
