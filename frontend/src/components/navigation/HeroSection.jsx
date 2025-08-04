"use client"

import { useEffect, useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { Code, BookOpen, Users, ArrowRight, Rocket, Heart, TrendingUp,Star } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const HeroSection = () => {
  const { isDarkMode, colors, schemes } = useTheme()
  const navigate=useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
const handlefullstack=()=>{
  navigate('/courses/fullstack');
}
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
        ${schemes.pageBackground(isDarkMode)}
      `}
    >
      {/* Enhanced Background Effect with Better Theme Consistency */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <div 
            className={`absolute inset-0 opacity-40 ${isDarkMode ? 'opacity-60' : 'opacity-30'}`}
            style={{
              background: isDarkMode 
                ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 35%, rgba(0,0,0,0) 70%), radial-gradient(ellipse at bottom right, rgba(34,211,238,0.1) 0%, rgba(99,102,241,0.05) 50%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 35%, rgba(255,255,255,0) 70%), radial-gradient(ellipse at bottom right, rgba(34,211,238,0.06) 0%, rgba(99,102,241,0.03) 50%, rgba(255,255,255,0) 70%)'
            }}
          />
        </div>

        {/* Lightning Layer with Enhanced Theme Colors */}
        <div className="absolute inset-0">
          <svg
            className={`absolute inset-0 w-full h-full ${isDarkMode ? 'opacity-40' : 'opacity-25'}`}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="lightning1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor={isDarkMode ? "#6366f1" : "#4f46e5"} stopOpacity={isDarkMode ? "0.5" : "0.3"} />
                <stop offset="100%" stopColor={isDarkMode ? "#6366f1" : "#4f46e5"} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="lightning2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor={isDarkMode ? "#8b5cf6" : "#7c3aed"} stopOpacity={isDarkMode ? "0.5" : "0.3"} />
                <stop offset="100%" stopColor={isDarkMode ? "#8b5cf6" : "#7c3aed"} stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Lightning Bolts with Theme-Aware Colors */}
            <path
              className="lightning-path"
              d="M30,0 L45,30 L15,40 L60,100"
              stroke={isDarkMode ? "#818cf8" : "#6366f1"}
              strokeWidth={isDarkMode ? "0.6" : "0.4"}
              fill="none"
              opacity={isDarkMode ? "0.7" : "0.5"}
            />
            <path
              className="lightning-path-reverse"
              d="M70,100 L65,70 L85,60 L40,0"
              stroke={isDarkMode ? "#a78bfa" : "#8b5cf6"}
              strokeWidth={isDarkMode ? "0.6" : "0.4"}
              fill="none"
              opacity={isDarkMode ? "0.7" : "0.5"}
            />
          </svg>

          {/* Enhanced Energy Orbs with Better Theme Integration */}
          <div 
            className={`energy-orb absolute top-1/4 left-1/4 w-32 h-32 rounded-full transition-all duration-700 ${isDarkMode ? 'opacity-60' : 'opacity-40'}`}
            style={{
              background: isDarkMode ? 
                'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 40%, rgba(0,0,0,0) 70%)' :
                'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 40%, rgba(255,255,255,0) 70%)',
              filter: isDarkMode ? 'blur(1px)' : 'blur(0.5px)'
            }}
          />
          <div 
            className={`energy-orb absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full transition-all duration-700 ${isDarkMode ? 'opacity-60' : 'opacity-40'}`}
            style={{
              background: isDarkMode ?
                'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(34,211,238,0.15) 40%, rgba(0,0,0,0) 70%)' :
                'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.08) 40%, rgba(255,255,255,0) 70%)',
              filter: isDarkMode ? 'blur(1px)' : 'blur(0.5px)'
            }}
          />
          {/* Additional Accent Orb for Balance */}
          <div 
            className={`energy-orb absolute top-2/3 left-1/6 w-24 h-24 rounded-full transition-all duration-700 ${isDarkMode ? 'opacity-50' : 'opacity-30'}`}
            style={{
              background: isDarkMode ?
                'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(99,102,241,0.1) 40%, rgba(0,0,0,0) 70%)' :
                'radial-gradient(circle, rgba(34,211,238,0.1) 0%, rgba(99,102,241,0.06) 40%, rgba(255,255,255,0) 70%)',
              filter: isDarkMode ? 'blur(0.8px)' : 'blur(0.4px)'
            }}
          />
        </div>

        {/* Enhanced floating geometric elements with better theme awareness */}
        <FloatingElement delay={0} duration={6} className="top-24 left-20">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-700 ${
              isDarkMode ? "bg-indigo-400" : "bg-indigo-500"
            }`}
            style={{
              boxShadow: isDarkMode 
                ? "0 0 25px rgba(99, 102, 241, 0.7), 0 0 50px rgba(99, 102, 241, 0.3)" 
                : "0 0 20px rgba(99, 102, 241, 0.6), 0 0 40px rgba(99, 102, 241, 0.2)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={2} duration={8} className="top-32 right-24">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-700 ${
              isDarkMode ? "bg-purple-400" : "bg-purple-500"
            }`}
            style={{
              boxShadow: isDarkMode 
                ? "0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)" 
                : "0 0 15px rgba(139, 92, 246, 0.7), 0 0 30px rgba(139, 92, 246, 0.3)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={4} duration={10} className="bottom-40 left-32">
          <div
            className={`w-4 h-4 rounded-full transition-all duration-700 ${
              isDarkMode ? "bg-cyan-400" : "bg-blue-500"
            }`}
            style={{
              boxShadow: isDarkMode 
                ? "0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(34, 211, 238, 0.3)" 
                : "0 0 25px rgba(59, 130, 246, 0.5), 0 0 50px rgba(59, 130, 246, 0.2)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={1} duration={7} className="top-1/3 right-16">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${
              isDarkMode ? "bg-pink-400" : "bg-rose-500"
            }`}
            style={{
              boxShadow: isDarkMode 
                ? "0 0 22px rgba(244, 114, 182, 0.7), 0 0 44px rgba(244, 114, 182, 0.3)" 
                : "0 0 18px rgba(244, 63, 94, 0.6), 0 0 36px rgba(244, 63, 94, 0.2)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={3} duration={9} className="bottom-1/3 right-1/3">
          <div
            className={`w-3.5 h-3.5 rounded-full transition-all duration-700 ${
              isDarkMode ? "bg-emerald-400" : "bg-emerald-500"
            }`}
            style={{
              boxShadow: isDarkMode 
                ? "0 0 28px rgba(52, 211, 153, 0.6), 0 0 56px rgba(52, 211, 153, 0.3)" 
                : "0 0 22px rgba(34, 197, 94, 0.5), 0 0 44px rgba(34, 197, 94, 0.2)",
            }}
          />
        </FloatingElement>

        <FloatingElement delay={5} duration={11} className="top-1/2 left-1/4">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
              isDarkMode ? "bg-yellow-400" : "bg-amber-500"
            }`}
            style={{
              boxShadow: isDarkMode 
                ? "0 0 18px rgba(251, 191, 36, 0.7), 0 0 36px rgba(251, 191, 36, 0.3)" 
                : "0 0 15px rgba(245, 158, 11, 0.6), 0 0 30px rgba(245, 158, 11, 0.2)",
            }}
          />
        </FloatingElement>

        {/* Additional scattered dots with enhanced theme consistency */}
        {[...Array(12)].map((_, i) => (
          <FloatingElement
            key={i}
            delay={i * 0.8}
            duration={6 + i * 0.5}
            className={`top-${15 + i * 6}% left-${8 + i * 7}%`}
          >
            <div
              className={`w-1 h-1 rounded-full transition-all duration-700 ${
                isDarkMode ? "bg-slate-300" : "bg-gray-500"
              } ${isDarkMode ? 'opacity-70' : 'opacity-50'}`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 0 8px rgba(203, 213, 225, 0.5)" 
                  : "0 0 6px rgba(107, 114, 128, 0.4)",
              }}
            />
          </FloatingElement>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Enhanced New Feature Badge with Better Theme Integration */}
        <div className="flex justify-center mb-8">
          <div
            className={`group inline-flex items-center px-6 py-3 rounded-full text-sm font-medium
            ${colors.effects.backdrop} border-2 transition-all duration-500 hover:scale-105 cursor-pointer
            transform hover:rotate-1 hover:shadow-xl
            ${
              isDarkMode
                ? "bg-slate-800/60 border-indigo-400/40 text-indigo-300 hover:bg-slate-700/70 hover:border-indigo-400/60 shadow-lg shadow-indigo-500/20"
                : "bg-white/80 border-indigo-400/40 text-indigo-700 hover:bg-white/90 hover:border-indigo-500/50 shadow-lg shadow-indigo-500/10"
            }`}
            onClick={handlefullstack}
          >
            <span className="relative flex h-2 w-2 mr-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDarkMode ? "bg-purple-400" : "bg-purple-500"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isDarkMode ? "bg-purple-500" : "bg-purple-600"
              }`}></span>
            </span>
            <span className="font-semibold">✨ New!</span>
            <span className="mx-2 opacity-60">•</span>
            <span className="font-medium">Full-Stack Course Available</span>
            <ArrowRight className={`ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${
              isDarkMode ? "text-indigo-300" : "text-indigo-600"
            }`} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
          <div>
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className={colors.text.primary}>Empower Your</span>
              <span className={`block mt-1 ${schemes.brandGradient(isDarkMode)} bg-clip-text text-transparent`}
              >
                Learning Journey
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl mb-8 leading-relaxed ${colors.text.secondary}`}
            >
              Master programming with structured learning paths, hands-on projects, and real-world applications. 
              Your journey to becoming a skilled developer starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                to="/allcourse"
                className={`group px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center
                  transition-all duration-300 transform hover:scale-105   
                  ${schemes.primaryButton(isDarkMode)}
                `}
                style={{
                  boxShadow: isDarkMode ? "0 10px 40px rgba(139, 92, 246, 0.3)" : "0 10px 40px rgba(139, 92, 246, 0.2)",
                }}
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/collaborate"
                className={`group px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center
                  border-2 ${colors.effects.backdrop} transition-all duration-300 transform hover:scale-105 
                  ${
                    isDarkMode
                      ? "border-slate-600/40 text-slate-300 hover:bg-slate-800/40 hover:border-indigo-500/40"
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50/40 hover:border-indigo-300"
                  }
                `}
              >
                <Rocket className="mr-2 w-5 h-5" />
                Open Playground
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className={`flex items-center justify-center lg:justify-start gap-6 text-sm
              ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                50K+ Students
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                4.9/5 Rating
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                99% Satisfaction
              </div>
            </div>
          </div>

          {/* Right Side - Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Code,
                title: "Structured Learning",
                description: "Step-by-step courses designed for both beginners and advanced developers",
                color: isDarkMode ? "from-blue-500 to-cyan-500" : "from-blue-600 to-cyan-600"
              },
              {
                icon: BookOpen,
                title: "Rich Content",
                description: "Video lectures, coding exercises, and real-world projects",
                color: isDarkMode ? "from-indigo-500 to-blue-500" : "from-indigo-600 to-blue-600"
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Learn together with our active community of developers",
                color: isDarkMode ? "from-blue-500 to-indigo-500" : "from-blue-600 to-indigo-600"
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description: "Monitor your learning journey with detailed analytics",
                color: isDarkMode ? "from-indigo-500 to-blue-500" : "from-indigo-600 to-blue-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105
                  ${
                    isDarkMode
                      ? "bg-slate-800/40 border-slate-700/40 hover:border-slate-600"
                      : "bg-white/40 border-gray-200/40 hover:border-purple-200"
                  }
                `}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Users,
              value: "50K+",
              label: "Active Learners",
              color: isDarkMode ? "text-blue-400" : "text-blue-600",
              bgColor: isDarkMode ? "bg-blue-500/10" : "bg-blue-500/5",
            },
            {
              icon: Code,
              value: "1M+",
              label: "Lines of Code",
              color: isDarkMode ? "text-purple-400" : "text-purple-600",
              bgColor: isDarkMode ? "bg-purple-500/10" : "bg-purple-500/5",
            },
            {
              icon: TrendingUp,
              value: "300%",
              label: "Faster Learning",
              color: isDarkMode ? "text-emerald-400" : "text-emerald-600",
              bgColor: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-500/5",
            },
            {
              icon: Heart,
              value: "99%",
              label: "Satisfaction Rate",
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.01); }
        }

        .lightning-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: lightning 3s linear infinite;
        }

        .lightning-path-reverse {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: lightning 3s linear infinite 1.5s;
        }

        .energy-orb {
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes lightning {
          0% { 
            stroke-dashoffset: 200;
            opacity: 0;
          }
          30% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            stroke-dashoffset: -200;
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.5;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}

export default HeroSection
