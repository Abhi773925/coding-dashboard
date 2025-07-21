"use client"

import { useState, useCallback, useEffect } from "react"
import syllabus from "../../data/javascriptSyllabus.json";
import ModernCodeCompiler from "../Compiler/CodeCompiler"
import { useTheme } from "../context/ThemeContext";
const JavaScriptLearning = () => {
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [leftWidth, setLeftWidth] = useState(30) // Default 30% width for syllabus
  const [isDragging, setIsDragging] = useState(false)

  const { isDarkMode } = useTheme() // Use the theme context

  const handleTopicToggle = (topic) => {
    if (expandedTopic?.id === topic.id) {
      setExpandedTopic(null)
      setSelectedQuestion(null)
    } else {
      setExpandedTopic(topic)
      setSelectedQuestion(null)
    }
  }

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question)
  }

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return

      const container = document.querySelector('.main-container')
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Constrain between 15% and 85%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 15), 85)
      setLeftWidth(constrainedWidth)
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse events when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className={`w-full min-h-screen pt-18 flex flex-col ${isDarkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex-1 w-full h-[calc(100vh-4rem)] p-4 overflow-hidden">
        <div className="flex gap-1 h-full w-full relative main-container">
          {/* Syllabus Navigation - Resizable width */}
          <div
            className={`
              bg-white/40
              dark:bg-slate-800/40
              rounded-lg
              backdrop-blur-sm
              flex
              flex-col
              h-full
              max-h-full
              ${isDarkMode ? "border border-slate-700/40" : "border border-gray-200/40"}
            `}
            style={{ width: `${leftWidth}%` }}
          >
            <h2
              className={`text-xl font-bold p-3 bg-gradient-to-r ${isDarkMode ? "from-indigo-400 via-blue-400 to-indigo-400" : "from-indigo-600 via-blue-600 to-indigo-600"} bg-clip-text text-transparent sticky top-0 bg-white/40 dark:bg-slate-800/40 border-b ${isDarkMode ? "border-slate-700/40" : "border-gray-200/40"}`}
            >
              JavaScript Syllabus
            </h2>

            <div className="overflow-y-auto flex-1 p-3 h-full">
              {syllabus.sections.map((section) => (
                <div key={section.id} className="mb-4">
                  <h3 className={`text-sm font-semibold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"} mb-2`}>
                    {section.title}
                  </h3>

                  <div className="space-y-1">
                    {section.topics.map((topic) => (
                      <div key={topic.id} className="mb-1">
                        {/* Topic Button */}
                        <button
                          onClick={() => handleTopicToggle(topic)}
                          className={`text-left w-full p-2 rounded-md transition-colors flex justify-between items-center text-sm ${
                            expandedTopic?.id === topic.id
                              ? "bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                              : "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                          }`}
                        >
                          <span className="truncate pr-2">{topic.name}</span>
                          <svg
                            className={`w-3 h-3 transition-transform flex-shrink-0 ${expandedTopic?.id === topic.id ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Expanded Topic Content */}
                        {expandedTopic?.id === topic.id && (
                          <div
                            className={`mt-1 ml-2 p-2 ${isDarkMode ? "bg-slate-900/50" : "bg-gray-50/50"} rounded-lg`}
                          >
                            {/* Subtopics */}
                            <div className="mb-3">
                              <h4
                                className={`text-xs font-semibold mb-1 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
                              >
                                Topics Covered
                              </h4>
                              <ul className="list-disc pl-3 space-y-0.5">
                                {topic.subtopics.map((subtopic, index) => (
                                  <li
                                    key={index}
                                    className={`text-xs ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
                                  >
                                    {subtopic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Practice Questions */}
                            <div className="mb-3">
                              <h4
                                className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
                              >
                                Practice Questions
                              </h4>
                              <div className="space-y-2">
                                {topic.practice.map((question) => (
                                  <div
                                    key={question.id}
                                    className={`border ${isDarkMode ? "border-slate-700/40" : "border-gray-200/40"} rounded-md p-2 transition-colors ${
                                      selectedQuestion?.id === question.id
                                        ? "ring-1 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/30"
                                        : "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <h5
                                        className={`text-xs font-medium ${isDarkMode ? "text-indigo-300" : "text-indigo-700"} truncate pr-1`}
                                      >
                                        {question.title}
                                      </h5>
                                      <span
                                        className={`px-1 py-0.5 rounded text-xs flex-shrink-0 ${
                                          question.difficulty === "easy"
                                            ? "bg-green-100 text-green-700"
                                            : question.difficulty === "medium"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {question.difficulty}
                                      </span>
                                    </div>
                                    <p
                                      className={`text-xs ${isDarkMode ? "text-slate-300" : "text-gray-700"} mb-2 line-clamp-2`}
                                    >
                                      {question.question}
                                    </p>
                                    <button
                                      onClick={() => handleQuestionSelect(question)}
                                      className={`px-2 py-1 rounded text-xs transition-colors ${
                                        selectedQuestion?.id === question.id
                                          ? "bg-indigo-700 text-white"
                                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                                      }`}
                                    >
                                      {selectedQuestion?.id === question.id ? "Selected" : "Practice"}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Challenge Question */}
                            <div>
                              <h4
                                className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
                              >
                                Challenge Question
                              </h4>
                              <div
                                className={`border ${isDarkMode ? "border-slate-700/40" : "border-gray-200/40"} rounded-md p-2 transition-colors ${
                                  selectedQuestion?.id === topic.miscQuestion.id
                                    ? "ring-1 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/30"
                                    : "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                                }`}
                              >
                                <h5
                                  className={`text-xs font-medium ${isDarkMode ? "text-indigo-300" : "text-indigo-700"} mb-1`}
                                >
                                  {topic.miscQuestion.title}
                                </h5>
                                <p
                                  className={`text-xs ${isDarkMode ? "text-slate-300" : "text-gray-700"} mb-2 line-clamp-2`}
                                >
                                  {topic.miscQuestion.question}
                                </p>
                                <button
                                  onClick={() => handleQuestionSelect(topic.miscQuestion)}
                                  className={`px-2 py-1 rounded text-xs transition-colors ${
                                    selectedQuestion?.id === topic.miscQuestion.id
                                      ? "bg-indigo-700 text-white"
                                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                                  }`}
                                >
                                  {selectedQuestion?.id === topic.miscQuestion.id ? "Selected" : "Challenge"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Resizer Handle */}
          <div
            className={`w-2 hover:w-3 bg-gray-300 dark:bg-gray-600 hover:bg-indigo-500 dark:hover:bg-indigo-400 cursor-col-resize transition-all duration-150 relative group ${
              isDragging ? "w-3 bg-indigo-500" : ""
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className={`absolute inset-0 flex items-center justify-center ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
              <div className="w-0.5 h-8 bg-white/60 rounded-full"></div>
              <div className="w-0.5 h-8 bg-white/60 rounded-full mx-0.5"></div>
            </div>
          </div>
          {/* Code Compiler - Dynamic width */}
          <div
            className={`bg-white/40 dark:bg-slate-800/40 rounded-lg backdrop-blur-sm flex flex-col h-full overflow-hidden ${isDarkMode ? "border border-slate-700/40" : "border border-gray-200/40"}`}
            style={{ width: `${100 - leftWidth - 0.5}%`, minHeight: '600px' }}
          >
            {selectedQuestion ? (
              <>
                <div className={`p-4 border-b ${isDarkMode ? "border-slate-700/40" : "border-gray-200/40"}`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                    {selectedQuestion.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"} mt-1`}>
                    {selectedQuestion.question}
                  </p>
                </div>
                <div className="flex-1 min-h-0">
                  <ModernCodeCompiler
                    initialCode={selectedQuestion.starterCode || "// Write your code here"}
                    language="javascript"
                    className="w-full h-full"
                    style={{ height: 'calc(100vh - 12rem)' }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full w-full pt-50">
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="text-6xl mb-6 animate-bounce">💻</div>
                  <p className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Code Compiler</p>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                    Select a question to start coding
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JavaScriptLearning
