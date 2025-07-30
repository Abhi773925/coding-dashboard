"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { Code, BookOpen, Github, Cpu, Globe, Award, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Link } from "react-router-dom"

const Learning = () => {
  const { isDarkMode, colors, schemes } = useTheme()
  const [activeTab, setActiveTab] = useState("dsa")
  const [expandedSections, setExpandedSections] = useState({
    dsa: [0],
    webdev: [0],
    career: [0],
  })

  const toggleSection = (path, index) => {
    setExpandedSections((prev) => {
      const newExpanded = { ...prev }
      if (newExpanded[path].includes(index)) {
        newExpanded[path] = newExpanded[path].filter((i) => i !== index)
      } else {
        newExpanded[path] = [...newExpanded[path], index]
      }
      return newExpanded
    })
  }

  // Learning paths data
  const paths = {
    dsa: [
      {
        title: "Phase 1: Programming Fundamentals (4-6 weeks)",
        icon: <Code size={18} />,
        content: [
          "Choose a language: JavaScript, Python, or Java",
          "Core concepts: Variables, data types, operators, loops, conditionals",
          "Functions and scope: Parameters, return values, closures",
          "Object-oriented programming basics",
          "Practice: 30-50 basic programming challenges",
        ],
      },
      {
        title: "Phase 2: Basic Data Structures (6-8 weeks)",
        icon: <Cpu size={18} />,
        content: [
          "Arrays and Strings: Manipulation techniques, common patterns",
          "Linked Lists: Singly and doubly linked lists, operations",
          "Stacks and Queues: Implementation and applications",
          "Hash Tables/Maps: Hash functions, collision handling",
          "Trees: Binary trees, BST, tree traversals",
          "Heaps: Min/max heaps, priority queues",
        ],
      },
      {
        title: "Phase 3: Basic Algorithms (4-6 weeks)",
        icon: <Cpu size={18} />,
        content: [
          "Searching: Linear search, binary search",
          "Sorting: Bubble, selection, insertion, merge, quick sort",
          "Recursion: Base cases, recursive thinking",
          "Time & Space Complexity: Big O notation",
          "Problem Solving Patterns: Two pointers, sliding window, frequency counter",
        ],
      },
      {
        title: "Phase 4: Advanced DSA (8-10 weeks)",
        icon: <Cpu size={18} />,
        content: [
          "Graphs: Representation, traversals (BFS/DFS), shortest path algorithms",
          "Dynamic Programming: Memoization, tabulation",
          "Greedy Algorithms: Interval scheduling, activity selection",
          "Backtracking: N-Queens, combination problems",
          "Trie and Advanced Tree Structures",
          "Advanced problems from LeetCode, HackerRank, CodeForces",
        ],
      },
    ],
    webdev: [
      {
        title: "Phase 1: Frontend Basics (6-8 weeks)",
        icon: <Globe size={18} />,
        content: [
          "HTML5: Semantic elements, forms, validation",
          "CSS3: Selectors, box model, flexbox, grid, responsive design",
          "JavaScript Fundamentals: DOM manipulation, events, AJAX",
          "Build 3-5 static websites from scratch",
        ],
      },
      {
        title: "Phase 2: Frontend Frameworks (8-10 weeks)",
        icon: <Globe size={18} />,
        content: [
          "Choose a framework: React (recommended), Vue, or Angular",
          "Components, props, state management",
          "Routing and navigation",
          "Hooks (React) or equivalent concepts",
          "API integration, fetch/axios",
          "Build 2-3 dynamic web applications",
        ],
      },
      {
        title: "Phase 3: Backend Development (8-10 weeks)",
        icon: <Globe size={18} />,
        content: [
          "Choose a backend: Node.js+Express, Django, Ruby on Rails",
          "Server-side programming fundamentals",
          "RESTful API design and implementation",
          "Database integration: SQL (PostgreSQL/MySQL) or NoSQL (MongoDB)",
          "Authentication & Authorization: JWT, OAuth",
          "Build a complete backend API for one of your frontend projects",
        ],
      },
      {
        title: "Phase 4: Full Stack & DevOps (6-8 weeks)",
        icon: <Globe size={18} />,
        content: [
          "Connect frontend and backend applications",
          "Deployment: Heroku, Vercel, Netlify, AWS",
          "CI/CD basics: GitHub Actions or similar",
          "Performance optimization techniques",
          "Security best practices",
          "Build and deploy 1-2 complete full-stack applications",
        ],
      },
    ],
    career: [
      {
        title: "Phase 1: Portfolio Building (4-6 weeks)",
        icon: <Github size={18} />,
        content: [
          "Create a professional GitHub profile",
          "Build a personal portfolio website",
          "Document all projects with detailed READMEs",
          "Contribute to open-source projects",
        ],
      },
      {
        title: "Phase 2: Interview Preparation (6-8 weeks)",
        icon: <Github size={18} />,
        content: [
          "DSA practice: Solve 100+ medium-level problems",
          "System design basics",
          "Behavioral interview preparation",
          "Mock interviews with peers or platforms like Pramp",
        ],
      },
      {
        title: "Phase 3: Job Application Strategy (ongoing)",
        icon: <Github size={18} />,
        content: [
          "Resume and LinkedIn optimization",
          "Networking: Tech meetups, conferences, online communities",
          "Application tracking system",
          "Negotiation strategies",
          "Continuous learning plan",
        ],
      },
    ],
  }

  // Resources data
  const resources = [
    {
      title: "DSA Resources",
      icon: <Cpu size={20} />,
      items: [
        "LeetCode, HackerRank, AlgoExpert",
        '"Cracking the Coding Interview" book',
        "Grokking Algorithms book",
        "CodingKaro DSA Foundation course",
      ],
    },
    {
      title: "Web Dev Resources",
      icon: <Globe size={20} />,
      items: [
        "MDN Web Docs",
        "freeCodeCamp, The Odin Project",
        "Frontend Mentor challenges",
        "CodingKaro Full Stack Bootcamp",
      ],
    },
    {
      title: "Career Resources",
      icon: <Award size={20} />,
      items: [
        "Tech interview handbook",
        "Pramp for mock interviews",
        "CodingKaro Career Prep workshop",
        "GitHub Student Developer Pack",
      ],
    },
  ]

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

  const FlowingBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
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
    )
  }

  return (
    <div
      className={`relative min-h-screen w-full pt-12 transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <FlowingBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Your{" "}
            <span
              className={`bg-clip-text text-transparent ${isDarkMode ? "bg-gradient-to-r from-purple-400 to-blue-400" : "bg-gradient-to-r from-purple-600 to-blue-600"}`}
            >
              Learning
            </span>{" "}
            Path
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
            Follow our structured learning paths to master programming skills and prepare for your tech career.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-10 gap-2">
          {[
            { id: "dsa", label: "Data Structures & Algorithms", icon: <Cpu className="mr-2" /> },
            { id: "webdev", label: "Web Development", icon: <Globe className="mr-2" /> },
            { id: "career", label: "Career Preparation", icon: <Award className="mr-2" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300
                ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/30"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30"
                    : isDarkMode
                      ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800/80 border border-slate-700/50"
                      : "bg-white/80 text-gray-700 hover:bg-gray-100/80 border border-gray-200/50"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {paths[activeTab].map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.005]
                ${
                  isDarkMode
                    ? "border-slate-700/50 bg-slate-800/70 shadow-2xl shadow-black/40"
                    : "border-gray-200/50 bg-white/80 shadow-2xl shadow-gray-200/80"
                }
              `}
              style={{
                boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className={`flex justify-between items-center p-5 cursor-pointer
                  ${isDarkMode ? "hover:bg-slate-800/80" : "hover:bg-gray-100/80"}
                `}
                onClick={() => toggleSection(activeTab, sectionIndex)}
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 mr-3 p-2 rounded-lg
                      ${isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-600"}
                    `}
                  >
                    {section.icon}
                  </div>
                  <h3 className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {section.title}
                  </h3>
                </div>
                <span>
                  {expandedSections[activeTab].includes(sectionIndex) ? (
                    <ChevronUp className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
                  ) : (
                    <ChevronDown className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
                  )}
                </span>
              </div>

              {expandedSections[activeTab].includes(sectionIndex) && (
                <div
                  className={`p-5 border-t
                    ${isDarkMode ? "border-slate-700/50 bg-slate-900/70" : "border-gray-100/50 bg-gray-50/70"}
                  `}
                >
                  <ul className={`space-y-3 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span
                          className={`flex-shrink-0 mr-2 mt-1 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                        >
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resources section */}
        <div
          className={`mt-12 rounded-2xl overflow-hidden
            ${isDarkMode ? "bg-slate-800/70 shadow-2xl shadow-black/40" : "bg-white/80 shadow-2xl shadow-gray-200/80"}
          `}
          style={{
            boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
          }}
        >
          <div className="p-6 sm:p-8">
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Recommended Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                    ${
                      isDarkMode
                        ? "bg-slate-700/50 hover:bg-slate-700/80 shadow-lg shadow-black/30"
                        : "bg-gray-50/80 hover:bg-gray-100/80 shadow-lg shadow-gray-200/80"
                    }
                  `}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`p-2 rounded-lg mr-3
                        ${isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-600"}
                      `}
                    >
                      {resource.icon}
                    </div>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{resource.title}</h3>
                  </div>
                  <ul className={`space-y-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                    {resource.items.map((item, j) => (
                      <li key={j} className="flex items-start">
                        <span className={`flex-shrink-0 mr-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                          •
                        </span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <div
          className={`mt-12 rounded-2xl overflow-hidden
            ${isDarkMode ? "bg-slate-900/60 shadow-xl shadow-black/20" : "bg-white/60 shadow-xl shadow-gray-200/50"}
            backdrop-blur-lg border ${isDarkMode ? "border-slate-700/40" : "border-gray-200/40"}
          `}
          style={{
            boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.3)" : "0 15px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="md:w-2/3">
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Track Your Progress
                </h2>
                <p className={`mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                  Sign up or log in to track your progress through the learning path. CodingKaro members get access to:
                </p>
                <ul className={`space-y-3 mb-6 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                  <li className="flex items-center">
                    <div
                      className={`flex-shrink-0 p-1 rounded-full mr-3
                        ${isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-600"}
                      `}
                    >
                      <Check size={16} />
                    </div>
                    Personalized learning dashboard
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`flex-shrink-0 p-1 rounded-full mr-3
                        ${isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-600"}
                      `}
                    >
                      <Check size={16} />
                    </div>
                    Project reviews from mentors
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`flex-shrink-0 p-1 rounded-full mr-3
                        ${isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-600"}
                      `}
                    >
                      <Check size={16} />
                    </div>
                    Completion certificates
                  </li>
                </ul>
              </div>

              <div className="md:w-1/3 flex justify-center">
                <Link
                  to="/allcourse"
                  className={`
                    flex items-center justify-center
                    px-8 py-4 rounded-xl text-lg font-semibold
                    transition-all duration-300 transform hover:scale-105
                    shadow-xl
                    ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-900/30"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-600/40"
                    }
                  `}
                >
                  <BookOpen className="mr-2" />
                  <span>Join Now</span>
                </Link>
              </div>
            </div>
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

export default Learning
