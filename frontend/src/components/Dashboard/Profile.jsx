"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import {
  BookOpen,
  Code,
  Github,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Star,
  GitFork,
  Trophy,
  UserCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Profile = () => {
  const { isDarkMode } = useTheme()
  const [userProfile, setUserProfile] = useState(null)
  const [developerScore, setDeveloperScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail")
        if (!email) {
          throw new Error("Email not found in localStorage. Please log in.")
        }

        // Fetch profile data
        const profileResponse = await fetch(
          `https://coding-dashboard-ngwi.onrender.com/api/codingkaro/users?email=${email}`,
        )
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile data")
        }
        const profileData = await profileResponse.json()
        setUserProfile(profileData)

        // Fetch developer score
        const scoreResponse = await fetch(
          `https://coding-dashboard-ngwi.onrender.com/api/codingkaro/users/score?email=${email}`,
        )
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json()
          setDeveloperScore(scoreData)
        }
        // Initialize expanded sections based on available data
        if (profileData.platformStats) {
          const initialExpandedState = Object.keys(profileData.platformStats).reduce((acc, platform) => {
            acc[platform] = true // Initially expand all platform sections
            return acc
          }, {})
          setExpandedSections(initialExpandedState)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  // Framer Motion Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  // Platform specific colors
  const platformColors = {
    leetcode: {
      iconBg: isDarkMode ? "bg-indigo-900/30" : "bg-indigo-100",
      iconText: isDarkMode ? "text-indigo-300" : "text-indigo-600",
      progress: "bg-indigo-500",
      border: isDarkMode ? "border-indigo-700/50" : "border-indigo-200/50",
    },
    github: {
      iconBg: isDarkMode ? "bg-blue-900/30" : "bg-blue-100",
      iconText: isDarkMode ? "text-gray-300" : "text-gray-700",
      progress: isDarkMode ? "bg-gray-300" : "bg-gray-700",
      border: isDarkMode ? "border-gray-700/50" : "border-gray-200/50",
    },
    geeksforgeeks: {
      iconBg: isDarkMode ? "bg-green-900/30" : "bg-green-100",
      iconText: isDarkMode ? "text-green-300" : "text-green-600",
      progress: "bg-green-600",
      border: isDarkMode ? "border-green-700/50" : "border-green-200/50",
    },
  }

  const getPlatformColor = (platform, type) => {
    const colors = platformColors[platform] || platformColors.github
    return colors[type]
  }

  // Helper function to render LeetCode stats
  const renderLeetCodeStats = (data) => {
    const { stats } = data
    const sectionId = "leetcode"
    const isExpanded = expandedSections[sectionId] !== false

    return (
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sectionVariants}
        className={`
          rounded-2xl shadow-xl p-6 sm:p-8 mb-6 transition-all duration-300
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
          ${getPlatformColor(sectionId, "border")}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start">
            {stats.profile.userAvatar && (
              <img
                src={stats.profile.userAvatar || "/placeholder.svg"}
                alt="LeetCode Avatar"
                className={`w-16 h-16 rounded-full mr-4 border-2 ${isDarkMode ? "border-yellow-500/70" : "border-yellow-500"}`}
              />
            )}
            <div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {stats.profile.realName || stats.username}
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>@{stats.username}</p>
              {stats.profile.aboutMe && (
                <p className={`mt-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"} text-sm`}>
                  {stats.profile.aboutMe}
                </p>
              )}
            </div>
          </div>
          <motion.button
            onClick={() => toggleSection(sectionId)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              p-2 rounded-full transition-colors duration-300
              ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}
            `}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse LeetCode stats" : "Expand LeetCode stats"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sectionVariants}
              className="mt-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Problem Solving</h4>
                  <div className="mt-2 space-y-1">
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Total Solved:</span>
                      <span className="font-medium">{stats.problemStats.totalSolved}</span>
                    </p>
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Total Submissions:</span>
                      <span className="font-medium">{stats.problemStats.totalSubmissions}</span>
                    </p>
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-600/50">
                      <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        Difficulty Breakdown:
                      </h5>
                      <div className="flex flex-col space-y-2">
                        {["easy", "medium", "hard"].map((diff) => (
                          <div key={diff}>
                            <div className="flex justify-between text-xs font-medium mb-1">
                              <span
                                className={`${
                                  diff === "easy"
                                    ? isDarkMode
                                      ? "text-green-300"
                                      : "text-green-800"
                                    : diff === "medium"
                                      ? isDarkMode
                                        ? "text-yellow-300"
                                        : "text-yellow-800"
                                      : isDarkMode
                                        ? "text-red-300"
                                        : "text-red-800"
                                }`}
                              >
                                {diff.charAt(0).toUpperCase() + diff.slice(1)}:{" "}
                                {stats.problemStats.difficulty[diff] || 0}
                              </span>
                              <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                                {stats.problemStats.totalSolved > 0
                                  ? (
                                      ((stats.problemStats.difficulty[diff] || 0) / stats.problemStats.totalSolved) *
                                      100
                                    ).toFixed(1)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full ${isDarkMode ? "bg-slate-600" : "bg-gray-200"}`}>
                              <div
                                className={`h-2 rounded-full ${
                                  diff === "easy" ? "bg-green-500" : diff === "medium" ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{
                                  width: `${
                                    stats.problemStats.totalSolved > 0
                                      ? ((stats.problemStats.difficulty[diff] || 0) / stats.problemStats.totalSolved) *
                                        100
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Contest Stats</h4>
                  {stats.contestStats ? (
                    <div className="mt-2 space-y-1">
                      <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        <span>Rating:</span>
                        <span className="font-medium">{Math.round(stats.contestStats.rating)}</span>
                      </p>
                      <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        <span>Contests Attended:</span>
                        <span className="font-medium">{stats.contestStats.attended}</span>
                      </p>
                      <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        <span>Global Rank:</span>
                        <span className="font-medium">
                          {stats.contestStats.globalRanking.toLocaleString()}
                          <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                            {" "}
                            (Top {stats.contestStats.topPercentage.toFixed(1)}%)
                          </span>
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className={`${isDarkMode ? "text-slate-400" : "text-gray-500"} text-sm italic mt-2`}>
                      No contest data available
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Activity</h4>
                  <div className="mt-2 space-y-1">
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Current Streak:</span>
                      <span className="font-medium">{stats.calendar.streak} days</span>
                    </p>
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Active Days:</span>
                      <span className="font-medium">{stats.calendar.totalActiveDays}</span>
                    </p>
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Badges:</span>
                      <span className="font-medium">{stats.badges.length}</span>
                    </p>
                  </div>
                  {stats.badges.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-600/50">
                      <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        Recent Badges:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {stats.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge.id}
                            className={`${isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-800"} text-xs px-2 py-1 rounded-full`}
                          >
                            {badge.displayName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="mt-6">
                <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.problemStats.byTags.fundamental
                    .sort((a, b) => b.problemsSolved - a.problemsSolved)
                    .slice(0, 5)
                    .map((tag) => (
                      <span
                        key={tag.tagName}
                        className={`${isDarkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-100 text-indigo-800"} text-xs px-2 py-1 rounded-full`}
                      >
                        {tag.tagName}: {tag.problemsSolved}
                      </span>
                    ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Helper function to render GitHub stats
  const renderGitHubStats = (data) => {
    const { stats } = data
    const sectionId = "github"
    const isExpanded = expandedSections[sectionId] !== false

    return (
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sectionVariants}
        className={`
          rounded-2xl shadow-xl p-6 sm:p-8 mb-6 transition-all duration-300
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
          ${getPlatformColor(sectionId, "border")}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start">
            {stats.profile.avatar && (
              <img
                src={stats.profile.avatar || "/placeholder.svg"}
                alt="GitHub Avatar"
                className={`w-16 h-16 rounded-full mr-4 border-2 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              />
            )}
            <div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {stats.profile.name || stats.username}
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>@{stats.profile.login}</p>
              {stats.profile.bio && (
                <p className={`mt-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"} text-sm`}>{stats.profile.bio}</p>
              )}
            </div>
          </div>
          <motion.button
            onClick={() => toggleSection(sectionId)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              p-2 rounded-full transition-colors duration-300
              ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}
            `}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse GitHub stats" : "Expand GitHub stats"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sectionVariants}
              className="mt-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Profile Stats</h4>
                  <div className="mt-2 space-y-1">
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Public Repos:</span>
                      <span className="font-medium">{stats.stats.publicRepos}</span>
                    </p>
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Followers:</span>
                      <span className="font-medium">{stats.stats.followers}</span>
                    </p>
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Following:</span>
                      <span className="font-medium">{stats.stats.following}</span>
                    </p>
                    <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                      <span>Total Stars:</span>
                      <span className="font-medium">{stats.stats.totalStars}</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Location & Contact</h4>
                  <div className="mt-2 space-y-1">
                    {stats.profile.location ? (
                      <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        <span>Location:</span>
                        <span className="font-medium">{stats.profile.location}</span>
                      </p>
                    ) : (
                      <p className={`${isDarkMode ? "text-slate-400" : "text-gray-500"} text-sm italic`}>
                        No location provided
                      </p>
                    )}
                    {stats.profile.company && (
                      <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        <span>Company:</span>
                        <span className="font-medium">{stats.profile.company}</span>
                      </p>
                    )}
                    {stats.profile.blog && (
                      <p className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        <span>Website:</span>
                        <a
                          href={stats.profile.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-medium ${isDarkMode ? "text-purple-300" : "text-purple-600"} hover:underline flex items-center truncate max-w-xs`}
                        >
                          {stats.profile.blog}
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              {stats.repositories && stats.repositories.length > 0 && (
                <motion.div variants={itemVariants} className="mt-6">
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>Repositories</h4>
                  <div className="overflow-x-auto rounded-lg border">
                    <table
                      className={`min-w-full divide-y ${isDarkMode ? "divide-slate-700 border-slate-700" : "divide-gray-200 border-gray-200"}`}
                    >
                      <thead className={isDarkMode ? "bg-slate-700" : "bg-gray-100"}>
                        <tr>
                          <th
                            className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"} uppercase tracking-wider`}
                          >
                            Name
                          </th>
                          <th
                            className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"} uppercase tracking-wider`}
                          >
                            Language
                          </th>
                          <th
                            className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"} uppercase tracking-wider`}
                          >
                            Updated
                          </th>
                          <th
                            className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"} uppercase tracking-wider`}
                          >
                            <Star size={14} className="inline-block mr-1" /> Stars
                          </th>
                          <th
                            className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"} uppercase tracking-wider`}
                          >
                            <GitFork size={14} className="inline-block mr-1" /> Forks
                          </th>
                        </tr>
                      </thead>
                      <tbody className={isDarkMode ? "bg-slate-800/50 text-slate-300" : "bg-white/80 text-gray-700"}>
                        {stats.repositories
                          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                          .slice(0, 5) // Limit to top 5 for brevity
                          .map((repo) => (
                            <tr
                              key={repo.name}
                              className={`border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"} hover:${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"}`}
                            >
                              <td className="px-4 py-3">
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${isDarkMode ? "text-purple-300" : "text-purple-600"} hover:underline flex items-center`}
                                >
                                  {repo.name}
                                  <ExternalLink size={14} className="ml-1" />
                                </a>
                                {repo.description && (
                                  <p
                                    className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"} truncate max-w-xs`}
                                  >
                                    {repo.description}
                                  </p>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">{repo.language || "N/A"}</td>
                              <td className="px-4 py-3 text-sm">{new Date(repo.updatedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{repo.stars}</td>
                              <td className="px-4 py-3 text-sm">{repo.forks}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {stats.languages && stats.languages.length > 0 && (
                <motion.div variants={itemVariants} className="mt-6">
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>Top Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {stats.languages.slice(0, 5).map((lang) => (
                      <span
                        key={lang.name}
                        className={`${isDarkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-100 text-indigo-800"} text-xs px-2 py-1 rounded-full`}
                      >
                        {lang.name}: {lang.count}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Function to render GeeksforGeeks stats
  const renderGeeksForGeeksStats = (data) => {
    const { stats } = data
    const sectionId = "geeksforgeeks"
    const isExpanded = expandedSections[sectionId] !== false

    return (
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sectionVariants}
        className={`
          rounded-2xl shadow-xl p-6 sm:p-8 mb-6 transition-all duration-300
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
          ${getPlatformColor(sectionId, "border")}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start">
            {stats.profile.avatar && (
              <img
                src={stats.profile.avatar || "/placeholder.svg"}
                alt="GeeksforGeeks Avatar"
                className={`w-16 h-16 rounded-full mr-4 border-2 ${isDarkMode ? "border-green-500/70" : "border-green-500"}`}
              />
            )}
            <div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {stats.profile.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>{stats.profile.institute}</p>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                Rank: {stats.profile.ranking}
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => toggleSection(sectionId)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              p-2 rounded-full transition-colors duration-300
              ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}
            `}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse GeeksforGeeks stats" : "Expand GeeksforGeeks stats"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sectionVariants}
              className="mt-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Problem Stats</h4>
                  <div className="mt-2 space-y-1">
                    {Object.entries(stats.problemStats || {}).map(([category, count]) => (
                      <p
                        key={category}
                        className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
                      >
                        <span>{category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:</span>
                        <span className="font-medium">{count}</span>
                      </p>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Coding Scores</h4>
                  <div className="mt-2 space-y-1">
                    {Object.entries(stats.codingScores || {}).map(([score, value]) => (
                      <p
                        key={score}
                        className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
                      >
                        <span>{score.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:</span>
                        <span className="font-medium">{value}</span>
                      </p>
                    ))}
                  </div>
                </motion.div>
              </div>

              {stats.badges && stats.badges.length > 0 && (
                <motion.div variants={itemVariants} className="mt-6">
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {stats.badges.map((badge) => (
                      <span
                        key={badge.name}
                        className={`${isDarkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"} text-xs px-2 py-1 rounded-full`}
                      >
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {stats.monthlyActivity && Object.keys(stats.monthlyActivity).length > 0 && (
                <motion.div variants={itemVariants} className="mt-6">
                  <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
                    Recent Activity
                  </h4>
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}>
                    <div className="grid grid-cols-7 gap-1">
                      {Object.entries(stats.monthlyActivity)
                        .slice(0, 1) // Just show the most recent month
                        .flatMap(([month, days]) =>
                          days
                            .slice(-28)
                            .map((day, index) => (
                              <div
                                key={index}
                                className={`w-4 h-4 rounded-sm ${
                                  day.count === 0
                                    ? isDarkMode
                                      ? "bg-slate-600"
                                      : "bg-gray-200"
                                    : day.count < 3
                                      ? isDarkMode
                                        ? "bg-green-900/70"
                                        : "bg-green-200"
                                      : day.count < 5
                                        ? isDarkMode
                                          ? "bg-green-800/70"
                                          : "bg-green-300"
                                        : isDarkMode
                                          ? "bg-green-600"
                                          : "bg-green-500"
                                }`}
                                title={`${day.date}: ${day.count} contributions`}
                              ></div>
                            )),
                        )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Function to render developer score dashboard
  const renderDeveloperScore = () => {
    if (!developerScore) return null

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className={`
          rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transition-all duration-300
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold mb-6
            bg-clip-text text-transparent
            ${isDarkMode ? "bg-gradient-to-r from-purple-400 to-blue-400" : "bg-gradient-to-r from-purple-600 to-blue-600"}`}
        >
          Developer Score
        </h2>

        <motion.div
          variants={itemVariants}
          className={`
            bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg
            ${isDarkMode ? "shadow-purple-900/30" : "shadow-purple-600/30"}
          `}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <Trophy size={48} className="text-yellow-300" />
              <div>
                <p className="text-4xl font-extrabold">{Math.round(developerScore.totalScore)}</p>
                <p className="text-sm mt-1 opacity-90">Overall Developer Score</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Based on your activity across:</p>
              <p className="text-sm font-semibold">{Object.keys(developerScore.platformScores).join(", ")}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6">
          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
            Platform Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(developerScore.platformScores).map(([platform, score]) => (
              <div
                key={platform}
                className={`p-4 rounded-lg transition-colors duration-300
                  ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                  <span className={`font-bold text-lg ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {Math.round(score)}
                  </span>
                </div>
                <div
                  className={`w-full h-2.5 rounded-full transition-colors duration-300 ${isDarkMode ? "bg-slate-600" : "bg-gray-200"}`}
                >
                  <div
                    className={`h-2.5 rounded-full ${getPlatformColor(platform, "progress")}`}
                    style={{ width: `${Math.min(100, (score / developerScore.totalScore) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Function to render missing platforms section
  const renderMissingPlatforms = () => {
    if (!userProfile.missingPlatforms || userProfile.missingPlatforms.length === 0) return null

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className={`
          rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transition-all duration-300
          ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
        `}
        style={{
          boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold mb-6
            bg-clip-text text-transparent
            ${isDarkMode ? "bg-gradient-to-r from-emerald-400 to-cyan-400" : "bg-gradient-to-r from-emerald-600 to-teal-600"}`}
        >
          Complete Your Profile
        </h2>
        <p className={`mb-6 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
          Connect these platforms to unlock your full developer potential and get a more accurate score!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userProfile.missingPlatforms.map((platform) => (
            <motion.div
              key={platform}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                boxShadow: isDarkMode ? "0 10px 20px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.97 }}
              className={`
                border rounded-xl p-6 text-center transition-all duration-300
                ${isDarkMode ? "border-slate-700 bg-slate-700/50" : "border-gray-200 bg-gray-50/50"}
              `}
            >
              <div
                className={`text-4xl mb-4 flex justify-center items-center w-16 h-16 rounded-full mx-auto
                  ${getPlatformColor(platform, "iconBg")} ${getPlatformColor(platform, "iconText")}`}
              >
                {platform === "leetcode" ? (
                  <Code size={32} />
                ) : platform === "github" ? (
                  <Github size={32} />
                ) : platform === "geeksforgeeks" ? (
                  <BookOpen size={32} />
                ) : (
                  <UserCircle size={32} />
                )}
              </div>
              <h3 className={`font-bold text-xl ${isDarkMode ? "text-gray-100" : "text-gray-900"} mb-2`}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"} mb-4`}>
                {platform === "leetcode"
                  ? "Showcase your competitive programming skills."
                  : platform === "github"
                    ? "Display your open-source contributions and projects."
                    : platform === "geeksforgeeks"
                      ? "Highlight your DSA and computer science knowledge."
                      : "Connect your coding profile."}
              </p>
              <button
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-base
                  transition-all duration-300 hover:scale-[1.02]
                  ${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}
                  shadow-md hover:shadow-lg`}
              >
                Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (loading)
    return (
      <div
        className={`flex justify-center items-center
        min-h-screen transition-all duration-700
        ${
          isDarkMode
          
            ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }
      `}
      >
        <div
          className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4
            ${isDarkMode ? "border-purple-400" : "border-blue-500"}`}
        ></div>
        <p className={`ml-4 text-lg ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Loading profile...</p>
      </div>
    )

  if (error)
    return (
      <div
       className={`flex justify-center items-center
        min-h-screen transition-all duration-700
        ${
          isDarkMode
          
            ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }
      `}
      >
        <div
          className={`
            rounded-2xl p-8 text-center shadow-xl w-full max-w-md
            ${isDarkMode ? "bg-red-900/50 border border-red-700/50 text-red-300" : "bg-red-50/80 border border-red-200/50 text-red-700"}
          `}
          style={{
            boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
          }}
        >
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p className="mb-4 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`
              px-6 py-3 rounded-xl text-white font-semibold
              transition-all duration-300 transform hover:scale-105
              ${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}
              shadow-lg
            `}
          >
            Retry
          </button>
        </div>
      </div>
    )

  if (!userProfile)
    return (
      <div
        className={`relative min-h-screen flex flex-col justify-center items-center pt-24 p-4
          ${isDarkMode ? "bg-slate-950" : "bg-gray-50"} transition-colors duration-500`}
      >
        <div
          className={`
            text-center p-8 rounded-2xl shadow-xl w-full max-w-md
            ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50 text-slate-300" : "bg-white/80 border border-gray-200/50 text-gray-900"}
          `}
          style={{
            boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
          }}
        >
          <UserCircle size={48} className="mx-auto mb-4 text-purple-500" />
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            No profile data available
          </h3>
          <p className={`${isDarkMode ? "text-slate-400" : "text-gray-500"} mb-4`}>
            Please ensure your email is correct and coding platform usernames are added in your settings.
          </p>
          <button
            onClick={() => {
              /* navigate to settings or provide instructions */
            }}
            className={`
              px-6 py-3 rounded-xl text-white font-semibold
              transition-all duration-300 transform hover:scale-105
              ${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}
              shadow-lg
            `}
          >
            Go to Settings
          </button>
        </div>
      </div>
    )

  return (
    <div
 className={`
        min-h-screen transition-all duration-700
        ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }
      `}
    >
      {/* Animated Background Blobs (contained within the component) */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none
          ${isDarkMode ? "opacity-30" : "opacity-10"}`}
      >
        <div
          className={`absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob
            ${isDarkMode ? "bg-purple-900" : "bg-purple-400"}`}
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

      <div className="relative z-10 container mx-auto p-4 max-w-7xl">
        {/* Main Profile Header Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className={`
            bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white
            ${isDarkMode ? "shadow-purple-900/30" : "shadow-purple-600/30"}
          `}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Developer Profile</h1>
              <p className="text-lg font-medium">{userProfile.name}</p>
              <p className="text-blue-100 text-sm">{userProfile.email}</p>
            </div>
            {userProfile.missingPlatforms && userProfile.missingPlatforms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 md:mt-0"
              >
                <button
                  className={`
                    bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300
                    shadow-md hover:shadow-lg transform hover:scale-105
                  `}
                >
                  Update Profile Settings
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Developer Score Section */}
        {renderDeveloperScore()}

        {/* Missing Platforms Section */}
        {renderMissingPlatforms()}

        {/* Platform Profiles */}
        <div className="space-y-8">
          {userProfile.platformStats &&
            Object.entries(userProfile.platformStats).map(([platform, data]) => (
              <div key={platform}>
                <h2
                  className={`text-2xl sm:text-3xl font-bold mb-6 pb-3 border-b
                    ${isDarkMode ? "text-white border-slate-700" : "text-gray-900 border-gray-200"}
                    bg-clip-text text-transparent
                    ${
                      platform === "leetcode"
                        ? isDarkMode
                          ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                          : "bg-gradient-to-r from-yellow-600 to-orange-600"
                        : platform === "github"
                          ? isDarkMode
                            ? "bg-gradient-to-r from-gray-300 to-gray-500"
                            : "bg-gradient-to-r from-gray-700 to-gray-900"
                          : platform === "geeksforgeeks"
                            ? isDarkMode
                              ? "bg-gradient-to-r from-green-400 to-emerald-400"
                              : "bg-gradient-to-r from-green-600 to-emerald-600"
                            : ""
                    }
                  `}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)} Profile
                </h2>
                {platform === "leetcode" && renderLeetCodeStats(data)}
                {platform === "github" && renderGitHubStats(data)}
                {platform === "geeksforgeeks" && renderGeeksForGeeksStats(data)}
              </div>
            ))}
        </div>
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

export default Profile