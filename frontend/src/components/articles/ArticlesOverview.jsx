import React from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { BookOpen, Clock, ArrowRight, Cpu, Network, Box } from "lucide-react"

const ArticlesOverview = () => {
  const { isDarkMode } = useTheme()

  const articles = [
    {
      title: "Object-Oriented Programming",
      description: "Learn the fundamentals of OOP including classes, objects, inheritance, encapsulation, abstraction, and polymorphism.",
      readTime: "15 min read",
      route: "/articles/oops",
      icon: Box,
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Computer Networks",
      description: "Understand how computers communicate, network protocols, OSI model, and TCP/IP fundamentals.",
      readTime: "20 min read",
      route: "/articles/computer-networks",
      icon: Network,
      color: "from-green-500 to-blue-600"
    },
    {
      title: "Operating Systems",
      description: "Explore process management, memory management, file systems, and scheduling algorithms.",
      readTime: "18 min read",
      route: "/articles/operating-systems",
      icon: Cpu,
      color: "from-purple-500 to-pink-600"
    }
  ]

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
    }`}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Technical Articles
          </h1>
          <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Comprehensive guides covering essential computer science concepts. 
            Each article is written to be easy to understand and remember.
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{articles.length} Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {articles.reduce((total, article) => {
                  const time = parseInt(article.readTime.split(' ')[0])
                  return total + time
                }, 0)} min total reading
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const { icon: Icon, color } = article
            return (
              <Link
                key={article.title}
                to={article.route}
                className="group no-underline"
              >
                <div className={`
                  h-full p-6 rounded-xl border transition-all duration-300
                  transform group-hover:scale-105 group-hover:shadow-xl
                  ${isDarkMode 
                    ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800" 
                    : "bg-white/70 border-gray-200 hover:bg-white hover:shadow-lg"
                  }
                `}>
                  {/* Article Icon */}
                  <div className={`
                    inline-flex p-3 rounded-lg mb-4
                    bg-gradient-to-br ${color} text-white shadow-lg
                  `}>
                    <Icon size={24} />
                  </div>
                  
                  {/* Article Title */}
                  <h3 className={`
                    text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors
                    ${isDarkMode ? "text-white" : "text-gray-900"}
                  `}>
                    {article.title}
                  </h3>
                  
                  {/* Article Description */}
                  <p className={`
                    text-sm leading-relaxed mb-4
                    ${isDarkMode ? "text-gray-300" : "text-gray-600"}
                  `}>
                    {article.description}
                  </p>
                  
                  {/* Article Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-500" />
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {article.readTime}
                      </span>
                    </div>
                    
                    <ArrowRight 
                      size={16} 
                      className="text-blue-500 group-hover:translate-x-1 transition-transform" 
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <div className={`
          p-8 rounded-xl border
          ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"}
        `}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Start Your Learning Journey
          </h2>
          <p className={`text-base mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            These articles are designed to provide clear, comprehensive explanations of fundamental 
            computer science concepts. Take your time to read through each one and build a strong foundation.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Easy to understand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Comprehensive coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Practical examples</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlesOverview
