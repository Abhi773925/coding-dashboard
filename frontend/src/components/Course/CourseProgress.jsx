"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit,
  Trash2,
  FileText,
  PlayCircle,
  Star,
  LinkIcon,
  Filter,
  BookOpen,
  CheckSquare,
  X,
  Calendar,
  Target,
  CheckCircle,
  Circle,
  Menu,
  Search,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../navigation/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../config/api";

// Backend URL Configuration
const BACKEND_URL = `${config.API_URL}`;

const MinimalCourseProgress = () => {
  const { isDarkMode } = useTheme();
  const { isLoggedIn, login, user } = useAuth();

  // State Management
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState({
    difficulty: "All",
    status: "All",
    revision: false,
    search: "",
  });
  const [isEditingNotes, setIsEditingNotes] = useState({});
  const [tempNotes, setTempNotes] = useState({});

  // Fetch Course Data
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint =
          isLoggedIn && user?.email
            ? `${BACKEND_URL}/codingkaro/courses/DSA Placement Preparation?userEmail=${encodeURIComponent(
                user.email
              )}`
            : `${BACKEND_URL}/codingkaro/courses/DSA Placement Preparation`;

        const headers = isLoggedIn
          ? {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" };

        const response = await axios.get(endpoint, {
          withCredentials: true,
          headers,
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch course");
        }

        const courseData = response.data.data;
        if (!courseData || !courseData.days) {
          throw new Error("Invalid course data structure");
        }

        setCourse(courseData);
        if (courseData.days.length > 0) {
          setSelectedDay(courseData.days[0].dayNumber);
        }
        setLoading(false);
      } catch (error) {
        console.error("Course Fetch Error:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred"
        );
        setLoading(false);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
      }
    };
    fetchCourse();
  }, [isLoggedIn, isDarkMode, user]);

  // Calculate day progress
  const getDayProgress = (day) => {
    if (!day.questions || day.questions.length === 0) return 0;
    const completed = day.questions.filter((q) => q.status).length;
    return Math.round((completed / day.questions.length) * 100);
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (!course || !course.days)
      return { totalQuestions: 0, completedQuestions: 0, completionRate: 0 };

    const totalQuestions = course.totalQuestions || 0;
    const completedQuestions = course.completedQuestions || 0;
    const completionRate =
      totalQuestions > 0
        ? Math.round((completedQuestions / totalQuestions) * 100)
        : 0;

    return { totalQuestions, completedQuestions, completionRate };
  }, [course]);

  // Filter questions for selected day
  const filteredQuestions = useMemo(() => {
    const currentDay = course?.days?.find(
      (day) => day.dayNumber === selectedDay
    );
    if (!currentDay || !currentDay.questions) return [];

    return currentDay.questions.filter((question) => {
      const difficultyMatch =
        filter.difficulty === "All" ||
        question.difficulty === filter.difficulty;
      const statusMatch =
        filter.status === "All" ||
        (filter.status === "Completed" && question.status) ||
        (filter.status === "Pending" && !question.status);
      const revisionMatch = !filter.revision || question.forRevision;
      const searchMatch =
        !filter.search ||
        question.title.toLowerCase().includes(filter.search.toLowerCase());

      return difficultyMatch && statusMatch && revisionMatch && searchMatch;
    });
  }, [course, selectedDay, filter]);

  // Update Question Status/Notes
  const updateQuestionStatus = async (
    courseId,
    dayNumber,
    questionId,
    updates
  ) => {
    if (!isLoggedIn || !user || !user.email) {
      toast.warn("Please login to track your progress", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
      login();
      return;
    }

    // Double-check email availability
    const userEmail = user.email || localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.error("User email not found. Please log in again.", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
      return;
    }

    try {
      const updateData = { ...updates, userEmail };
      const response = await axios.put(
        `${BACKEND_URL}/codingkaro/courses/${courseId}/days/${dayNumber}/questions/${questionId}`,
        updateData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update question");
      }
      setCourse(response.data.data);
      toast.success("Updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: isDarkMode ? "dark" : "light",
      });
    } catch (error) {
      console.error("Update Question Error:", error);
      toast.error("Failed to update question", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  const handleEditNotes = (questionId) => {
    setIsEditingNotes((prev) => ({ ...prev, [questionId]: true }));
    const question = filteredQuestions.find((q) => q.id === questionId);
    setTempNotes((prev) => ({ ...prev, [questionId]: question.notes || "" }));
  };

  const handleSaveNotes = (questionId) => {
    updateQuestionStatus(course._id, selectedDay, questionId, {
      notes: tempNotes[questionId] || "",
    });
    setIsEditingNotes((prev) => ({ ...prev, [questionId]: false }));
  };

  const handleCancelNotes = (questionId) => {
    setIsEditingNotes((prev) => ({ ...prev, [questionId]: false }));
    setTempNotes((prev) => ({ ...prev, [questionId]: "" }));
  };

  // Loading State
  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center pt-20 ${
          isDarkMode ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-4 ${
            isDarkMode ? "border-indigo-400" : "border-indigo-600"
          } mb-4`}
        ></div>
        <p
          className={`text-sm ${
            isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Loading course data...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center pt-20 ${
          isDarkMode ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <div
          className={`text-center p-8 rounded-xl ${
            isDarkMode ? "bg-neutral-800" : "bg-neutral-100"
          } shadow-lg max-w-md w-11/12`}
        >
          <div
            className={`inline-flex p-4 rounded-full ${
              isDarkMode ? "bg-red-900/20" : "bg-red-50"
            } mb-4`}
          >
            <AlertCircle
              className={`w-8 h-8 ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            />
          </div>
          <h2
            className={`text-2xl font-bold mb-3 ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Error Loading Course
          </h2>
          <p
            className={`mb-6 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 mx-auto ${
              isDarkMode 
                ? "bg-indigo-600 text-white hover:bg-indigo-500" 
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-0 ${
        isDarkMode ? "bg-zinc-900 text-slate-300" : "bg-white text-slate-700"
      }`}
    >
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-20 left-4 z-50 p-2 rounded-lg lg:hidden ${
          isDarkMode ? "bg-neutral-800" : "bg-neutral-100"
        } shadow-lg`}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex w-full h-[calc(100vh)] pt-20 fixed top-0">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : -320 }}
          className={`fixed lg:static w-80 lg:w-72 h-full z-40 ${
            isDarkMode ? "bg-neutral-900" : "bg-white"
          } border-r ${
            isDarkMode ? "border-neutral-800" : "border-neutral-200"
          } overflow-y-auto ${!isSidebarOpen && "lg:block hidden"}`}
        >
          {/* Stats Header */}
          <div
            className={`p-4 border-b ${
              isDarkMode ? "border-neutral-800" : "border-neutral-200"
            } sticky top-0 ${isDarkMode ? "bg-neutral-900" : "bg-white"} z-10`}
          >
            <h1 className="font-bold text-lg mb-3">DSA Progress</h1>
            <div
              className={`space-y-3 ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <div className="text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span>Total Progress</span>
                  <span className="font-medium">
                    {stats.completedQuestions}/{stats.totalQuestions}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-full h-2 rounded-full ${
                      isDarkMode ? "bg-neutral-700" : "bg-neutral-200"
                    } mr-2`}
                  >
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                  <span className="font-medium text-sm min-w-[35px]">
                    {stats.completionRate}%
                  </span>
                </div>
              </div>
              {!isLoggedIn && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                  isDarkMode 
                    ? "bg-yellow-900/30 text-yellow-200" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Login to track your progress</span>
                </div>
              )}
            </div>
          </div>

          {/* Days List */}
          <div className="p-2">
            {course?.days?.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDay(day.dayNumber);
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full p-3 mb-1 rounded-lg text-left transition-all duration-200 ${
                  selectedDay === day.dayNumber
                    ? "bg-indigo-600 text-white shadow-md"
                    : isDarkMode
                    ? "hover:bg-neutral-800"
                    : "hover:bg-neutral-100"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">Day {day.dayNumber}</span>
                  <span className="text-sm font-medium">{getDayProgress(day)}%</span>
                </div>
                <div className="text-sm opacity-80 truncate">
                  {day.dayTitle}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-w-0 ${isSidebarOpen ? 'lg:ml-0' : ''}`}>
          {/* Header */}
          <div
            className={`p-4 border-b ${
              isDarkMode ? "border-neutral-800" : "border-neutral-200"
            } ${
              isDarkMode ? "bg-neutral-900/80" : "bg-white/80"
            } backdrop-blur-sm sticky top-0 z-20`}
          >
            <div className="flex flex-col text-right lg:flex-row lg:items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold truncate">
                  Day {selectedDay}
                  
                </h2>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {filteredQuestions.length} questions
                </div>
              </div>

              {/* Filters */}
              <div>
                {/* Mobile All-in-One Line Filters */}
                <div className="lg:hidden flex gap-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={filter.search}
                      onChange={(e) =>
                        setFilter((prev) => ({ ...prev, search: e.target.value }))
                      }
                      className={`w-full pl-5 pr-1 py-0.5 rounded border text-xs ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700 text-slate-300 placeholder-slate-400"
                          : "bg-white border-neutral-300 text-slate-700 placeholder-slate-500"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    />
                  </div>
                  
                  <select
                    value={filter.difficulty}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        difficulty: e.target.value,
                      }))
                    }
                    className={`px-1 py-0.5 rounded border text-xs min-w-[60px] ${
                      isDarkMode
                        ? "bg-neutral-800 border-neutral-700 text-slate-300"
                        : "bg-white border-neutral-300 text-slate-700"
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  >
                    <option value="All">All</option>
                    <option value="Easy">E</option>
                    <option value="Medium">M</option>
                    <option value="Hard">H</option>
                  </select>

                  <select
                    value={filter.status}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className={`px-1 py-0.5 rounded border text-xs min-w-[60px] ${
                      isDarkMode
                        ? "bg-neutral-800 border-neutral-700 text-slate-300"
                        : "bg-white border-neutral-300 text-slate-700"
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  >
                    <option value="All">All</option>
                    <option value="Completed">✓</option>
                    <option value="Pending">○</option>
                  </select>
                </div>

                {/* Desktop Filters */}
                <div className="hidden lg:flex gap-2">
                  <div className="relative flex-1 min-w-[200px] lg:min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={filter.search}
                      onChange={(e) =>
                        setFilter((prev) => ({ ...prev, search: e.target.value }))
                      }
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700 text-slate-300 placeholder-slate-400"
                          : "bg-white border-neutral-300 text-slate-700 placeholder-slate-500"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>

                  <select
                    value={filter.difficulty}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        difficulty: e.target.value,
                      }))
                    }
                    className={`px-3 py-2 rounded-lg border text-sm min-w-[120px] ${
                      isDarkMode
                        ? "bg-neutral-800 border-neutral-700 text-slate-300"
                        : "bg-white border-neutral-300 text-slate-700"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="All">All Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <select
                    value={filter.status}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className={`px-3 py-2 rounded-lg border text-sm min-w-[110px] ${
                      isDarkMode
                        ? "bg-neutral-800 border-neutral-700 text-slate-300"
                        : "bg-white border-neutral-300 text-slate-700"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="All">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredQuestions.length > 0 ? (
              <div className="space-y-3">
                {filteredQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      isDarkMode
                        ? "bg-neutral-800/70 border-neutral-700"
                        : "bg-neutral-100 border-neutral-200"
                    } shadow-sm hover:shadow-md transition-shadow`}
                  >
                    {/* Mobile-First Responsive Layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      {/* Top Row: Title + Difficulty (Mobile) / Left Side (Desktop) */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="font-semibold text-sm flex-1 min-w-0 leading-tight">
                          {question.title}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${
                            question.difficulty === "Easy"
                              ? isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                              : question.difficulty === "Medium"
                              ? isDarkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                              : isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {question.difficulty[0]}
                        </span>
                      </div>

                      {/* Bottom Row: All Controls (Mobile) / Right Side (Desktop) */}
                      <div className="flex items-center justify-end gap-1 shrink-0">
                        {/* Action Links */}
                        {question.links.article && (
                          <a
                            href={question.links.article}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded transition-colors ${
                              isDarkMode
                                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            }`}
                            title="Article"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        {question.links.youtube && (
                          <a
                            href={question.links.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded transition-colors ${
                              isDarkMode
                                ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                            title="Video"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </a>
                        )}
                        {question.links.practice && (
                          <a
                            href={question.links.practice}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded transition-colors ${
                              isDarkMode
                                ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                                : "bg-green-100 text-green-600 hover:bg-green-200"
                            }`}
                            title="Practice"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                        
                        {/* Revision Star */}
                        <button
                          onClick={() =>
                            updateQuestionStatus(
                              course._id,
                              selectedDay,
                              question.id,
                              { forRevision: !question.forRevision }
                            )
                          }
                          className={`p-1.5 rounded transition-colors ${
                            question.forRevision
                              ? "text-yellow-600 bg-yellow-100 hover:bg-yellow-200"
                              : isDarkMode
                              ? "text-gray-400 hover:bg-slate-700"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title="Toggle Revision"
                        >
                          <Star className="w-4 h-4" />
                        </button>

                        {/* Notes Button */}
                        <button
                          onClick={() => handleEditNotes(question.id)}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode 
                              ? "text-blue-400 hover:bg-blue-900/30" 
                              : "text-blue-600 hover:bg-blue-100"
                          }`}
                          title={question.notes ? "Edit Notes" : "Add Notes"}
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Status Checkbox */}
                        <button
                          onClick={() =>
                            updateQuestionStatus(
                              course._id,
                              selectedDay,
                              question.id,
                              { status: !question.status }
                            )
                          }
                          className={`p-1.5 rounded transition-colors ${
                            question.status
                              ? isDarkMode ? "text-green-400 hover:bg-green-900/30" : "text-green-600 hover:bg-green-100"
                              : isDarkMode
                              ? "text-slate-400 hover:bg-neutral-800"
                              : "text-slate-500 hover:bg-neutral-100"
                          }`}
                          title="Mark Complete"
                        >
                          {question.status ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Notes Section (compact) */}
                    {isEditingNotes[question.id] && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          <button
                            onClick={() => handleSaveNotes(question.id)}
                            className={`p-1.5 rounded transition-colors ${
                              isDarkMode 
                                ? "text-green-400 hover:bg-green-900/30" 
                                : "text-green-600 hover:bg-green-100"
                            }`}
                            title="Save Notes"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelNotes(question.id)}
                            className={`p-1.5 rounded transition-colors ${
                              isDarkMode 
                                ? "text-red-400 hover:bg-red-900/30" 
                                : "text-red-600 hover:bg-red-100"
                            }`}
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={tempNotes[question.id] || ""}
                          onChange={(e) => setTempNotes(prev => ({ ...prev, [question.id]: e.target.value }))}
                          className={`w-full p-2 rounded text-xs resize-none ${
                            isDarkMode 
                              ? "bg-neutral-700 text-slate-300 border-neutral-600" 
                              : "bg-white text-slate-700 border-neutral-300"
                          } border focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                          rows={2}
                          placeholder="Add your notes here..."
                        />
                      </div>
                    )}

                    {/* Notes Display */}
                    {!isEditingNotes[question.id] && question.notes && (
                      <p className={`text-xs mt-2 p-2 rounded ${
                        isDarkMode ? "bg-neutral-800 text-slate-300" : "bg-neutral-100 text-slate-700"
                      }`}>
                        {question.notes}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen
                  className={`w-12 h-12 mx-auto mb-4 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  No questions found
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Try adjusting your filters or select a different day
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default MinimalCourseProgress;