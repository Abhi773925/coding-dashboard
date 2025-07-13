"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"
import { Lightbulb, Clock, Zap, CheckCircle, RefreshCw, PlusCircle } from "lucide-react"

const IdeaStormGame = () => {
  const { isDarkMode } = useTheme()
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [challenge, setChallenge] = useState({})
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [ideas, setIdeas] = useState([])
  const [newIdea, setNewIdea] = useState("")
  const [totalPoints, setTotalPoints] = useState(0)
  const [lastScore, setLastScore] = useState(0)
  const [feedback, setFeedback] = useState("")
  const inputRef = useRef(null)

  // Sample challenge categories based on your course structure
  const challenges = [
    {
      category: "Data Structures",
      title: "Real-world Applications",
      prompt: "Brainstorm real-world applications where a linked list would be more useful than an array.",
      keywords: ["memory", "allocation", "insertion", "deletion", "dynamic", "size", "playlist", "browser", "history"],
      color: "indigo",
    },
    {
      category: "Web Development",
      title: "User Experience Improvements",
      prompt: "Generate ideas for making a web application more accessible and user-friendly.",
      keywords: [
        "contrast",
        "keyboard",
        "navigation",
        "screen reader",
        "alt text",
        "semantic",
        "feedback",
        "error messages",
        "responsive",
        "focus",
        "states",
      ],
      color: "emerald",
    },
    {
      category: "Technical Interview",
      title: "Problem-solving Approaches",
      prompt: "List different approaches to solving algorithm problems during a technical interview.",
      keywords: [
        "brute force",
        "divide and conquer",
        "dynamic programming",
        "greedy",
        "recursion",
        "iteration",
        "binary search",
        "sorting",
        "hash table",
        "tree",
        "graph",
      ],
      color: "purple",
    },
  ]

  // Start the game with a random challenge
  const startGame = () => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]
    setChallenge(randomChallenge)
    setIdeas([])
    setNewIdea("")
    setTimeLeft(180)
    setTotalPoints(0)
    setLastScore(0)
    setFeedback("")
    setGameActive(true)
    setGameOver(false)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  // Timer countdown
  useEffect(() => {
    let timer
    if (gameActive && !gameOver && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && !gameOver) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [gameActive, timeLeft, gameOver])

  // End the game
  const endGame = () => {
    setGameActive(false)
    setGameOver(true)
  }

  // Handle idea submission
  const handleSubmitIdea = (e) => {
    e.preventDefault()
    if (newIdea.trim() === "") return

    // Check for duplicate ideas
    if (ideas.some((idea) => idea.text.toLowerCase() === newIdea.toLowerCase())) {
      setFeedback("You've already added this idea!")
      setTimeout(() => setFeedback(""), 2000)
      return
    }

    // Calculate points based on keywords and idea length
    let points = 5 // Base points
    const matchedKeywords = []

    challenge.keywords.forEach((keyword) => {
      if (newIdea.toLowerCase().includes(keyword.toLowerCase())) {
        points += 3
        matchedKeywords.push(keyword)
      }
    })

    // Bonus for longer, more detailed ideas
    if (newIdea.length > 50) points += 2

    // Add the idea to the list
    const newIdeaObj = {
      id: Date.now(),
      text: newIdea,
      points: points,
      keywords: matchedKeywords,
    }

    setIdeas([...ideas, newIdeaObj])
    setTotalPoints(totalPoints + points)
    setLastScore(points)
    setNewIdea("")

    // Show point feedback
    setFeedback(`+${points} points${matchedKeywords.length > 0 ? " (keyword bonus!)" : ""}`)
    setTimeout(() => setFeedback(""), 2000)

    // Add time bonus for good ideas
    if (points > 5) {
      setTimeLeft((prev) => Math.min(prev + 5, 180))
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Get colors based on category
  const getCategoryColors = (color) => {
    const colors = {
      indigo: {
        gradient: "from-indigo-600 to-purple-600",
        bg: isDarkMode ? "bg-indigo-900/40" : "bg-indigo-100",
        text: isDarkMode ? "text-indigo-300" : "text-indigo-600",
        border: isDarkMode ? "border-indigo-700" : "border-indigo-200",
        borderLeft: isDarkMode ? "border-indigo-500" : "border-indigo-600",
      },
      emerald: {
        gradient: "from-emerald-600 to-teal-600",
        bg: isDarkMode ? "bg-emerald-900/40" : "bg-emerald-100",
        text: isDarkMode ? "text-emerald-300" : "text-emerald-600",
        border: isDarkMode ? "border-emerald-700" : "border-emerald-200",
        borderLeft: isDarkMode ? "border-emerald-500" : "border-emerald-600",
      },
      purple: {
        gradient: "from-purple-600 to-pink-600",
        bg: isDarkMode ? "bg-purple-900/40" : "bg-purple-100",
        text: isDarkMode ? "text-purple-300" : "text-purple-600",
        border: isDarkMode ? "border-purple-700" : "border-purple-200",
        borderLeft: isDarkMode ? "border-purple-500" : "border-purple-600",
      },
    }
    return colors[color] || colors.indigo // Default to indigo if color not found
  }

  const currentCategoryColors = challenge.color ? getCategoryColors(challenge.color) : getCategoryColors("indigo")

  return (
    <div
      className={`
        min-h-screen py-12 px-4 sm:px-6 lg:px-8
        ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"}
        transition-colors duration-300
      `}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className={`
            text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8
            bg-clip-text text-transparent
            ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
                : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
            }
          `}
        >
          IdeaStorm
        </h2>

        {!gameActive && !gameOver && (
          <div
            className={`
              p-8 rounded-2xl shadow-2xl backdrop-blur-md
              ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
              transform transition-all duration-300 hover:scale-[1.02]
            `}
            style={{
              boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
            }}
          >
            <div className="text-center">
              <div
                className={`mb-6 w-20 h-20 rounded-full mx-auto flex items-center justify-center
                  bg-gradient-to-br from-purple-600 to-blue-600`}
                style={{
                  boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
                }}
              >
                <Lightbulb size={36} className="text-white" strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl font-bold mb-4">Rapid Idea Generation</h3>
              <p className={`mb-6 max-w-2xl mx-auto ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                Challenge your creative thinking with our brainstorming game! You'll have 3 minutes to generate as many
                quality ideas as possible on a random tech topic. Points are awarded for creativity, relevance, and
                depth.
              </p>

              <button
                onClick={startGame}
                className={`
                  py-3 px-8 rounded-xl font-semibold text-lg text-white
                  bg-gradient-to-r from-purple-600 to-blue-600
                  hover:from-purple-500 hover:to-blue-500
                  transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                `}
                style={{
                  boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
                }}
              >
                Start Brainstorming
              </button>
            </div>
          </div>
        )}

        {gameActive && !gameOver && challenge && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Challenge panel */}
            <div
              className={`
                p-6 rounded-2xl shadow-lg col-span-1 md:col-span-1
                ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
                relative overflow-hidden
              `}
              style={{
                boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
              }}
            >
              {/* Background gradient */}
              <div
                className={`
                  absolute inset-0 opacity-10
                  bg-gradient-to-br ${currentCategoryColors.gradient}
                `}
              />

              <div className="relative z-10">
                <span
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium inline-block mb-4
                    ${currentCategoryColors.bg} ${currentCategoryColors.text}
                  `}
                >
                  {challenge.category}
                </span>

                <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
                <p className={`mb-6 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{challenge.prompt}</p>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock size={18} className={isDarkMode ? "text-slate-400" : "text-gray-500"} />
                    <span className={`font-mono ${timeLeft < 30 ? "text-red-500 font-bold" : ""}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Zap size={18} className="text-yellow-500" />
                    <span className="font-medium">{totalPoints} points</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CheckCircle size={18} className={isDarkMode ? "text-slate-400" : "text-gray-500"} />
                    <span>{ideas.length} ideas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ideas input and display */}
            <div
              className={`
                p-6 rounded-2xl shadow-lg col-span-1 md:col-span-2
                ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
                flex flex-col
              `}
              style={{
                boxShadow: isDarkMode ? "0 15px 40px rgba(0,0,0,0.4)" : "0 15px 40px rgba(0,0,0,0.1)",
              }}
            >
              <form onSubmit={handleSubmitIdea} className="mb-4">
                <div className="flex">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                    placeholder="Type your idea here..."
                    className={`
                      flex-grow p-3 rounded-l-lg outline-none
                      ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-400"
                          : "bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-500"
                      }
                    `}
                  />
                  <button
                    type="submit"
                    className={`
                      p-3 rounded-r-lg
                      bg-gradient-to-r from-purple-600 to-blue-600
                      text-white font-medium hover:opacity-90 transition-opacity
                    `}
                  >
                    Add
                  </button>
                </div>

                {feedback && (
                  <div
                    className={`
                      mt-2 text-center py-1 rounded-lg font-medium text-sm
                      ${
                        feedback.includes("+")
                          ? isDarkMode
                            ? "bg-emerald-900/30 text-emerald-300"
                            : "bg-emerald-100 text-emerald-700"
                          : isDarkMode
                            ? "bg-red-900/30 text-red-300"
                            : "bg-red-100 text-red-700"
                      }
                      animate-pulse
                    `}
                  >
                    {feedback}
                  </div>
                )}
              </form>

              <div className="flex-grow overflow-y-auto max-h-96 pr-2 space-y-3">
                {ideas.length === 0 ? (
                  <div
                    className={`
                      p-4 rounded-lg text-center border-2 border-dashed
                      ${isDarkMode ? "border-slate-700 text-slate-500" : "border-gray-200 text-gray-400"}
                    `}
                  >
                    <PlusCircle size={24} className="mx-auto mb-2 opacity-50" />
                    <p>Your ideas will appear here.</p>
                    <p className="text-sm">Be creative! Quality ideas earn more points!</p>
                  </div>
                ) : (
                  ideas.map((idea, index) => (
                    <div
                      key={idea.id}
                      className={`
                        p-4 rounded-lg border-l-4
                        ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}
                        ${currentCategoryColors.borderLeft}
                        flex justify-between items-start
                      `}
                    >
                      <p className={isDarkMode ? "text-white" : "text-gray-800"}>{idea.text}</p>
                      <span
                        className={`
                          ml-3 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
                          ${isDarkMode ? "bg-slate-600 text-slate-200" : "bg-gray-200 text-gray-700"}
                        `}
                      >
                        +{idea.points}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {gameOver && (
          <div
            className={`
              p-8 rounded-2xl shadow-2xl backdrop-blur-md
              ${isDarkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-gray-200/50"}
              transform transition-all duration-300 hover:scale-[1.02]
            `}
            style={{
              boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
            }}
          >
            <div className="text-center">
              <div
                className={`mb-6 w-20 h-20 rounded-full mx-auto flex items-center justify-center
                  bg-gradient-to-br from-purple-600 to-blue-600`}
                style={{
                  boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
                }}
              >
                <Lightbulb size={36} className="text-white" strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl font-bold mb-2">Brainstorming Complete!</h3>
              <p className={`text-lg mb-6 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                Your creative juices were flowing!
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div
                  className={`p-4 rounded-xl ${isDarkMode ? "bg-indigo-900/30" : "bg-indigo-100"} ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}
                >
                  <p className="text-3xl font-bold">{totalPoints}</p>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Total Points</p>
                </div>
                <div
                  className={`p-4 rounded-xl ${isDarkMode ? "bg-purple-900/30" : "bg-purple-100"} ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                >
                  <p className="text-3xl font-bold">{ideas.length}</p>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Ideas Generated</p>
                </div>
                <div
                  className={`p-4 rounded-xl ${isDarkMode ? "bg-emerald-900/30" : "bg-emerald-100"} ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`}
                >
                  <p className="text-3xl font-bold">{ideas.length > 0 ? Math.round(totalPoints / ideas.length) : 0}</p>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Avg. Quality</p>
                </div>
              </div>

              {ideas.length > 0 && (
                <div className="mb-8">
                  <h4 className={`font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Your Best Ideas:</h4>
                  <div className="max-w-2xl mx-auto">
                    {[...ideas]
                      .sort((a, b) => b.points - a.points)
                      .slice(0, 3)
                      .map((idea, index) => (
                        <div
                          key={idea.id}
                          className={`
                            p-4 rounded-lg border-l-4 mb-3 text-left
                            ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}
                            ${currentCategoryColors.borderLeft}
                          `}
                        >
                          <div className="flex justify-between">
                            <p className={isDarkMode ? "text-white" : "text-gray-800"}>{idea.text}</p>
                            <span
                              className={`
                                ml-3 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
                                ${isDarkMode ? "bg-slate-600 text-slate-200" : "bg-gray-200 text-gray-700"}
                              `}
                            >
                              +{idea.points}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <button
                onClick={startGame}
                className={`
                  py-3 px-8 rounded-xl font-semibold text-lg text-white flex items-center justify-center mx-auto
                  bg-gradient-to-r from-purple-600 to-blue-600
                  hover:from-purple-500 hover:to-blue-500
                  transform transition-all duration-300 hover:scale-105
                `}
                style={{
                  boxShadow: isDarkMode ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(139, 92, 246, 0.2)",
                }}
              >
                <RefreshCw size={16} className="mr-2" />
                New Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IdeaStormGame
