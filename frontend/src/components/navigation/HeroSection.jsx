"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code, BookOpen, Users, ArrowRight, Rocket, Heart, TrendingUp, Star } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
const HeroSection = () => {
  const { isDarkMode, colors, schemes } = useTheme()
  const navigate = useNavigate()

  const handlefullstack = () => {
    navigate('/courses/fullstack')
  }

  return (
    <div className={`relative flex mt-[-10px] flex-col items-center justify-center ${
      isDarkMode ? 'bg-zinc-900' : 'bg-white'
    }`}>
     
      <div className="px-4 py-10 md:py-35">
        {/* Main heading with animated text */}
        <h1 className={`relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {"Master Coding Skills with Expert Guidance"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className={`relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Transform your programming journey with structured learning paths, hands-on projects, 
          and expert mentorship. Join thousands of developers who've accelerated their careers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/allcourse"
            className={`w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
              isDarkMode 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-zinc-900 text-slate-300 hover:bg-zinc-900'
            }`}
          >
            Start Learning Now
          </Link>
          <Link
            to="/collaborate"
            className={`w-60 transform rounded-lg border px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
              isDarkMode 
                ? 'border-gray-700 bg-zinc-900 text-slate-300 hover:bg-zinc-900' 
                : 'border-gray-300 bg-white text-black hover:bg-gray-100'
            }`}
          >
            Try Playground
          </Link>
        </motion.div>

        {/* Preview section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className={`relative z-10 mt-20 rounded-3xl border p-4 shadow-md ${
            isDarkMode 
              ? 'border-neutral-800 bg-neutral-900' 
              : 'border-neutral-200 bg-neutral-100'
          }`}
        >
          <div className={`w-full overflow-hidden rounded-xl border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <div className={`aspect-[16/9] h-auto w-full bg-gradient-to-br flex items-center justify-center ${
              isDarkMode 
                ? 'from-gray-800 to-gray-900' 
                : 'from-indigo-50 to-purple-50'
            }`}>
              {/* Feature grid overlay */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 w-full max-w-4xl">
                {[
                  { icon: Code, title: "Interactive Coding", color: isDarkMode ? "text-blue-400" : "text-blue-600" },
                  { icon: BookOpen, title: "Rich Content", color: isDarkMode ? "text-green-400" : "text-green-600" },
                  { icon: Users, title: "Community", color: isDarkMode ? "text-purple-400" : "text-purple-600" },
                  { icon: TrendingUp, title: "Progress Tracking", color: isDarkMode ? "text-pink-400" : "text-pink-600" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.4 + index * 0.1 }}
                    className={`flex flex-col items-center text-center p-4 rounded-lg backdrop-blur-sm ${
                      isDarkMode ? 'bg-zinc-900/50' : 'bg-white/50'
                    }`}
                  >
                    <feature.icon className={`w-8 h-8 mb-2 ${feature.color}`} />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {feature.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.6 }}
          className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "50K+", label: "Students", icon: Users },
            { value: "1M+", label: "Code Lines", icon: Code },
            { value: "4.9/5", label: "Rating", icon: Star },
            { value: "99%", label: "Satisfaction", icon: Heart }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.8 + index * 0.1 }}
              className="flex flex-col items-center"
            >
              <stat.icon className={`w-6 h-6 mb-2 ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>{stat.value}</div>
              <div className={`text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSection
