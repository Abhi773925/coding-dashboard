import React from "react"
import { Link } from "react-router-dom"
import { Database, BookOpen, Laptop } from "lucide-react"
import { useTheme } from "../context/ThemeContext" // Adjust path as needed

// ----- Custom Card Components -----
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border p-6 shadow-md ${className}`}>{children}</div>
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

// ----- Main Component -----
export default function NotesOverview() {
  const { isDarkMode } = useTheme()

  const noteCategories = [
    {
      title: "SQL Notes",
      description: "Master the Language of Data",
      icon: Database,
      route: "/sql-notes",
      status: "available",
    },
    {
      title: "JavaScript Learning",
      description: "Master the Basics of JavaScript",
      icon: BookOpen,
      route: "/learning/javascript",
      status: "available",
    },
    {
      title: "Operating System Notes",
      description: "Fundamentals of Operating Systems",
      icon: Laptop,
      route: "#",
      status: "updating-soon",
    },
  ]

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center justify-start py-12 px-4 transition-all duration-500 ${
        isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    //   style={{
    //     backgroundImage: `
    //       radial-gradient(circle at 25% 25%, ${isDarkMode ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.01)"} 0%, transparent 50%),
    //       radial-gradient(circle at 75% 75%, ${isDarkMode ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.05)"} 0%, transparent 0%),
    //       ${isDarkMode
    //         ? `repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)`
    //         : `repeating-linear-gradient(0deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px)`},
    //       ${isDarkMode
    //         ? `repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)`
    //         : `repeating-linear-gradient(90deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px)`}
    //     `,
    //     backgroundSize: "cover, cover, 20px 20px, 20px 20px",
    //     backgroundRepeat: "no-repeat, no-repeat, repeat, repeat",
    //     backgroundPosition: "0 0, 0 0, 0 0, 0 0",
    //   }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 pt-20 sm:pt:25 md:pt-30 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
         One Hub for All Your Technical Notes.
        </h1>
        <p className={`text-xl md:text-2xl font-light ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Explore various technical topics
        </p>
        <div className="mt-8 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {noteCategories.map((category) => {
          const Icon = category.icon
          const cardContent = (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{category.title}</CardTitle>
                <Icon className="h-8 w-8 text-gray-500" />
              </CardHeader>
              <CardContent>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {category.description}
                </CardDescription>
                {category.status === "updating-soon" && (
                  <div className="mt-4 text-sm font-semibold text-orange-500">Updating soon!</div>
                )}
              </CardContent>
            </>
          )

          return (
            <Card
              key={category.title}
              className={`relative overflow-hidden transition-transform duration-300 hover:scale-105 ${
                isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
              }`}
            >
              {category.status === "available" ? (
                <Link to={category.route} className="block h-full">
                  {cardContent}
                </Link>
              ) : (
                <div className="h-full cursor-not-allowed opacity-70">{cardContent}</div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
