import React from "react"
import { Link } from "react-router-dom"
import { Network, Database, Cpu, Globe, Code, BookOpen, Layers, Server } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border p-6 shadow-md transition-all duration-300 hover:shadow-lg ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
)

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm ${className}`}>{children}</p>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`${className}`}>{children}</div>
)

export default function InterviewSeriesOverview() {
  const { isDarkMode } = useTheme()

  const interviewSeries = [
    {
      title: "Computer Networks",
      description: "Master networking fundamentals for tech interviews",
      icon: Network,
      route: "/interview-series/computer-networks",
      status: "available",
      color: "from-blue-500 to-cyan-500",
      topics: ["OSI Model", "TCP/IP", "Routing", "Switching", "Security"]
    },
    {
      title: "Operating Systems",
      description: "Core OS concepts and system design",
      icon: Cpu,
      route: "/interview-series/operating-systems",
      status: "available",
      color: "from-purple-500 to-pink-500",
      topics: ["Processes", "Memory", "File Systems", "Scheduling"]
    },
    {
      title: "Database Systems",
      description: "DBMS concepts and database design",
      icon: Database,
      route: "/sql-notes",
      status: "available",
      color: "from-green-500 to-emerald-500",
      topics: ["ACID", "Normalization", "Indexing", "Transactions"]
    },
    {
      title: "OOPS",
      description: "Scalable system architecture principles",
      icon: Server,
      route: "/interview-series/oops",
      status: "available",
      color: "from-orange-500 to-red-500",
      topics: ["Inheritance", "Polymorphism", "Abstraction", "Encapsulation", "Design Patterns"]
    },
    {
      title: "Algorithms & Data Structures",
      description: "Core programming interview topics",
      icon: Code,
      route: "/interview-series/algorithms",
      status: "coming-soon",
      color: "from-indigo-500 to-purple-500",
      topics: ["Arrays", "Trees", "Graphs", "Dynamic Programming"]
    },
    {
      title: "Web Technologies",
      description: "Modern web development concepts",
      icon: Globe,
      route: "/interview-series/web-technologies",
      status: "coming-soon",
      color: "from-teal-500 to-blue-500",
      topics: ["HTTP", "REST APIs", "Authentication", "Performance"]
    }
  ]

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center justify-start py-12 px-4 transition-all duration-500 ${
        isDarkMode ? "bg-zinc-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, ${isDarkMode ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.05)"} 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${isDarkMode ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.05)"} 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, ${isDarkMode ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.05)"} 0%, transparent 50%)
        `,
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-16 max-w-4xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
          <BookOpen className="w-8 h-8 text-slate-300" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Interview Series
        </h1>
        <p className={`text-xl md:text-2xl font-light mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Comprehensive technical notes for acing your interviews
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl w-full">
        {[
          { label: "Topics Covered", value: "150+", icon: Layers },
          { label: "Interview Questions", value: "500+", icon: BookOpen },
          { label: "Companies", value: "100+", icon: Globe },
          { label: "Success Rate", value: "95%", icon: Code }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`text-center p-6 rounded-xl border ${
              isDarkMode ? bg-zinc-900 : "bg-white/80 border-gray-200"
            }`}>
              <Icon className={`w-8 h-8 mx-auto mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
              <div className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400 " : "text-gray-600"}`}>
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {interviewSeries.map((series) => {
          const Icon = series.icon
          const isAvailable = series.status === "available"
          
          const cardContent = (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${series.color} text-slate-300 shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className={isDarkMode ? "text-slate-300" : "text-gray-900"}>
                    {series.title}
                  </CardTitle>
                </div>
                {series.status === "coming-soon" && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                    Soon
                  </span>
                )}
                {series.status === "available" && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                    Ready
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {series.description}
                </CardDescription>
                
                {/* Topics Preview */}
                <div className="mb-4">
                  <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Key Topics:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {series.topics.map((topic, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-md ${
                          isDarkMode 
                            ? "bg-zinc-900 text-gray-300" 
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                {isAvailable && (
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Click to explore
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </>
          )

          return (
            <Card
              key={series.title}
              className={`relative overflow-hidden transition-all duration-300 ${
                isAvailable 
                  ? "hover:scale-105 cursor-pointer" 
                  : "cursor-not-allowed opacity-75"
              } ${
                isDarkMode ? "bg-zinc-900/80 border-gray-700 hover:bg-zinc-900" : "bg-white/80 border-gray-200 hover:bg-white"
              }`}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${series.color} opacity-5`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {isAvailable ? (
                  <Link to={series.route} className="block h-full">
                    {cardContent}
                  </Link>
                ) : (
                  <div className="h-full">
                    {cardContent}
                  </div>
                )}
              </div>

              {/* Coming Soon Overlay */}
              {!isAvailable && (
                <div className="absolute inset-0 bg-zinc-900 bg-opacity-10 flex items-center justify-center">
                  <div className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? "bg-zinc-900 text-gray-300" : "bg-white text-gray-700"
                  } shadow-lg border`}>
                    <span className="text-sm font-medium">Coming Soon</span>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center max-w-2xl">
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
          Start Your Interview Preparation
        </h2>
        <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Master the fundamentals with our comprehensive interview series. Each topic is carefully curated with real interview questions from top tech companies.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/interview-series/computer-networks"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-slate-300 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Start with Networking
          </Link>
          <Link
            to="/allcourse"
            className={`px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDarkMode 
                ? "border-gray-600 text-gray-300 hover:bg-zinc-900" 
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  )
}