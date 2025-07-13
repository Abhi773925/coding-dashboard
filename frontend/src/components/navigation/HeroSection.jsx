"use client"

import { useEffect, useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { Code, BookOpen, Users, ArrowRight, Rocket, Heart, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

const HeroSection = () => {
  const { isDarkMode } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const FloatingElement = ({ delay, duration, children, className }) => (
    <div
      className={`absolute opacity-80 ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        animation: `float ${duration}s ease-in-out infinite`,
      }}
    >
      {children}
    </div>
  )

  return (
    <div
      className={`
        relative min-h-screen flex items-center justify-center overflow-hidden pt-20
        transition-all duration-700 ease-in-out
        ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}
      `}
    >
      {/* Enhanced Flowing Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main flowing curves - more prominent */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(139, 92, 246, 0.12)"} />
              <stop offset="100%" stopColor={isDarkMode ? "rgba(139, 92, 246, 0.08)" : "rgba(99, 102, 241, 0.08)"} />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? "rgba(139, 92, 246, 0.12)" : "rgba(59, 130, 246, 0.1)"} />
              <stop offset="100%" stopColor={isDarkMode ? "rgba(59, 130, 246, 0.06)" : "rgba(139, 92, 246, 0.06)"} />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(168, 85, 247, 0.08)"} />
              <stop offset="100%" stopColor={isDarkMode ? "rgba(168, 85, 247, 0.05)" : "rgba(59, 130, 246, 0.05)"} />
            </linearGradient>
          </defs>

          {/* Multiple flowing curves for depth */}
          <path
            d="M0,450 Q360,250 720,400 T1440,350 L1440,900 L0,900 Z"
            fill="url(#gradient1)"
            className="animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <path
            d="M0,550 Q360,350 720,500 T1440,450 L1440,900 L0,900 Z"
            fill="url(#gradient2)"
            className="animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "2s" }}
          />
          <path
            d="M0,650 Q360,450 720,600 T1440,550 L1440,900 L0,900 Z"
            fill="url(#gradient3)"
            className="animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "4s" }}
          />
        </svg>

        {/* Enhanced floating geometric elements */}
        <FloatingElement delay={0} duration={6} className="top-24 left-20">
          <div
            className={`w-3 h-3 rounded-full ${isDarkMode ? "bg-blue-400" : "bg-purple-400"}`}
            style={{
              boxShadow: isDarkMode ? "0 0 25px rgba(59, 130, 246, 0.6)" : "0 0 20px rgba(139, 92, 246, 0.5)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={2} duration={8} className="top-32 right-24">
          <div
            className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-purple-400" : "bg-blue-400"}`}
            style={{
              boxShadow: isDarkMode ? "0 0 20px rgba(139, 92, 246, 0.7)" : "0 0 15px rgba(59, 130, 246, 0.6)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={4} duration={10} className="bottom-40 left-32">
          <div
            className={`w-4 h-4 rounded-full ${isDarkMode ? "bg-cyan-400" : "bg-indigo-400"}`}
            style={{
              boxShadow: isDarkMode ? "0 0 30px rgba(34, 211, 238, 0.5)" : "0 0 25px rgba(99, 102, 241, 0.4)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={1} duration={7} className="top-1/3 right-16">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? "bg-pink-400" : "bg-rose-400"}`}
            style={{
              boxShadow: isDarkMode ? "0 0 22px rgba(244, 114, 182, 0.6)" : "0 0 18px rgba(251, 113, 133, 0.5)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={3} duration={9} className="bottom-1/3 right-1/3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${isDarkMode ? "bg-emerald-400" : "bg-green-400"}`}
            style={{
              boxShadow: isDarkMode ? "0 0 28px rgba(52, 211, 153, 0.5)" : "0 0 22px rgba(34, 197, 94, 0.4)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={5} duration={11} className="top-1/2 left-1/4">
          <div
            className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? "bg-yellow-400" : "bg-orange-400"}`}
            style={{
              boxShadow: isDarkMode ? "0 0 18px rgba(251, 191, 36, 0.6)" : "0 0 15px rgba(251, 146, 60, 0.5)",
            }}
          />
        </FloatingElement>

        {/* Additional scattered dots for more depth */}
        {[...Array(12)].map((_, i) => (
          <FloatingElement
            key={i}
            delay={i * 0.8}
            duration={6 + i * 0.5}
            className={`top-${15 + i * 6}% left-${8 + i * 7}%`}
          >
            <div
              className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-400" : "bg-gray-400"} opacity-60`}
              style={{
                boxShadow: isDarkMode ? "0 0 8px rgba(148, 163, 184, 0.4)" : "0 0 6px rgba(156, 163, 175, 0.3)",
              }}
            />
          </FloatingElement>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        {/* Enhanced Beta Badge */}
        <div
          className={`inline-flex items-center px-5 py-3 rounded-full text-sm font-medium mb-10 
          backdrop-blur-sm border transition-all duration-300 hover:scale-105
          ${
            isDarkMode
              ? "bg-slate-800/70 border-slate-700/60 text-purple-300"
              : "bg-white/90 border-purple-200/60 text-purple-700"
          }`}
        >
          <div className={`w-2.5 h-2.5 rounded-full mr-3 ${isDarkMode ? "bg-yellow-400" : "bg-purple-500"}`} />
          <span className="font-semibold text-base">Beta</span>
          <span className="mx-3 opacity-60">—</span>
          <span className="opacity-90">We're actively improving.</span>
          <button
            className={`ml-5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105
            ${
              isDarkMode
                ? "bg-blue-400 text-slate-900 hover:bg-yellow-300"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Share Feedback →
          </button>
        </div>

        {/* Enhanced Main Heading */}
        <h1
          className={`font-bold mb-0 leading-tight tracking-tight
          text-5xl sm:text-6xl md:text-7xl lg:text-4xl xl:text-6xl
          ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          <span className="block mb-3">The Fastest Way to Master Coding with <p
            className={`block bg-gradient-to-r bg-clip-text text-transparent
            ${isDarkMode ? "from-purple-400 via-blue-400 to-cyan-400" : "from-purple-600 via-blue-600 to-indigo-600"}`}
          >
                  
          </p></span>
        
          <span
            className={`block bg-gradient-to-r bg-clip-text text-transparent
            ${isDarkMode ? "from-purple-400 via-blue-400 to-cyan-400" : "from-purple-600 via-blue-600 to-indigo-600"}`}
          >
            CODING KARO
          </span>
        </h1>

        {/* Enhanced Subtitle */}
        <p
          className={`text-xl md:text-2xl lg:text-3xl mb-14 max-w-4xl mx-auto leading-relaxed font-medium
          ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
        >
          No setup. No download. Instant learning, right in your browser. Experience the future—Beta is just the
          beginning.
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <Link
            to="/allcourse"
            className={`group relative px-10 py-5 rounded-2xl font-semibold text-xl
              transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
              ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              }
            `}
            style={{
              boxShadow: isDarkMode ? "0 10px 40px rgba(139, 92, 246, 0.3)" : "0 10px 40px rgba(139, 92, 246, 0.2)",
            }}
          >
            <div className="flex items-center justify-center">
              <BookOpen className="mr-4 w-6 h-6" />
              Start for Free
              <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/projects"
            className={`group px-10 py-5 rounded-2xl font-semibold text-xl border-2
              backdrop-blur-sm transition-all duration-300 transform hover:scale-105
              ${
                isDarkMode
                  ? "border-slate-600 text-slate-300 hover:border-purple-400 hover:text-purple-300 hover:bg-slate-800/60"
                  : "border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-700 hover:bg-white/80"
              }
            `}
          >
            <div className="flex items-center justify-center">
              <Rocket className="mr-4 w-6 h-6" />
              Explore Courses
            </div>
          </Link>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: Users,
              value: "50K+",
              label: "Active Developers",
              color: isDarkMode ? "text-blue-400" : "text-blue-600",
              bgColor: isDarkMode ? "bg-blue-500/10" : "bg-blue-500/5",
            },
            {
              icon: Code,
              value: "1M+",
              label: "Projects Created",
              color: isDarkMode ? "text-purple-400" : "text-purple-600",
              bgColor: isDarkMode ? "bg-purple-500/10" : "bg-purple-500/5",
            },
            {
              icon: TrendingUp,
              value: "300%",
              label: "Faster Development",
              color: isDarkMode ? "text-emerald-400" : "text-emerald-600",
              bgColor: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-500/5",
            },
            {
              icon: Heart,
              value: "99%",
              label: "Developer Satisfaction",
              color: isDarkMode ? "text-pink-400" : "text-pink-600",
              bgColor: isDarkMode ? "bg-pink-500/10" : "bg-pink-500/5",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-6 transition-all duration-300 group-hover:scale-110 ${stat.bgColor}
                ${isDarkMode ? "bg-slate-800/60 border border-slate-700/60" : "bg-white/80 border border-gray-200/60"}`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className={`text-4xl md:text-5xl font-bold mb-3 ${stat.color}`}>{stat.value}</div>
              <div className={`text-base font-medium ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          25% {
            transform: translateY(-15px) translateX(8px) scale(1.05);
          }
          50% {
            transform: translateY(-8px) translateX(-8px) scale(0.95);
          }
          75% {
            transform: translateY(-20px) translateX(5px) scale(1.02);
          }
        }
      `}</style>
    </div>
  )
}

export default HeroSection
