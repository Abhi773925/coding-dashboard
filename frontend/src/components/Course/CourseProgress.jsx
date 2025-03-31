import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Edit, 
  Trash2, 
  FileText, 
  PlayCircle,
  Star,
  Link as LinkIcon,
  Filter
} from 'lucide-react';
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../navigation/Navigation";

// Backend URL Configuration
const BACKEND_URL = 'https://coding-dashboard-ngwi.onrender.com/api';

const CourseProgress = () => {
  // Theme and Authentication Hooks
  const { isDarkMode } = useTheme();
  const { isLoggedIn, login, user } = useAuth();

  // State Management
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDays, setOpenDays] = useState({});
  const [editingNotes, setEditingNotes] = useState({});
  const [filter, setFilter] = useState({
    difficulty: 'All',
    status: 'All',
    revision: false,
    showNotes: false
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch Course Data
  useEffect(() => {
    const fetchCourse = async () => {
      // Reset loading and error states
      setLoading(true);
      setError(null);

      // Check login status
      if (!isLoggedIn || !user || !user.email) {
        toast.error('Please login to view course progress', {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        setLoading(false);
        return;
      }

      try {
        // Include userEmail as a query parameter
        const response = await axios.get(
          `${BACKEND_URL}/codingkaro/courses/DSA Placement Preparation?userEmail=${encodeURIComponent(user.email)}`,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Validate response
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch course');
        }

        const courseData = response.data.data;

        // Validate course structure
        if (!courseData || !courseData.days) {
          throw new Error('Invalid course data structure');
        }

        // Set course data and initialize day collapse state
        setCourse(courseData);
        const initialOpenDays = courseData.days.reduce((acc, day) => {
          acc[day.dayNumber] = false;
          return acc;
        }, {});
        setOpenDays(initialOpenDays);
        setLoading(false);

      } catch (error) {
        console.error('Course Fetch Error:', error);
        setError(
          error.response?.data?.message || 
          error.message || 
          'An unexpected error occurred'
        );
        setLoading(false);

        // Show error toast
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
      }
    };

    fetchCourse();
  }, [isLoggedIn, isDarkMode, user]);

  // Update Question Status/Notes
  const updateQuestionStatus = async (courseId, dayNumber, questionId, updates) => {
    // Login Check
    if (!isLoggedIn || !user || !user.email) {
      toast.error('Please login to update progress', {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
      
      // Prompt Login
      const confirmLogin = window.confirm('You need to login to update progress. Login now?');
      if (confirmLogin) {
        login();
      }
      return;
    }

    try {
      // Include userEmail in the request body
      const updateData = {
        ...updates,
        userEmail: user.email
      };

      const response = await axios.put(
        `${BACKEND_URL}/codingkaro/courses/${courseId}/days/${dayNumber}/questions/${questionId}`, 
        updateData,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Validate Response
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update question');
      }

      // Update Course State
      setCourse(response.data.data);
      
      // Reset Note Editing State
      if (updates.notes !== undefined) {
        setEditingNotes(prev => ({
          ...prev,
          [`${dayNumber}-${questionId}`]: false
        }));
      }

      // Success Notification
      toast.success('Progress updated successfully!', {
        position: "top-right",
        autoClose: 2000,
        theme: isDarkMode ? "dark" : "light",
      });

    } catch (error) {
      console.error('Update Question Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update question status', 
        {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        }
      );
    }
  };

  // Toggle Day Collapse
  const toggleDayCollapse = (dayNumber) => {
    setOpenDays(prev => ({
      ...prev,
      [dayNumber]: !prev[dayNumber]
    }));
  };

  // Filter Questions
  const filterQuestions = () => {
    if (!course) return [];

    return course.days.map(day => ({
      ...day,
      questions: day.questions.filter(question => {
        const difficultyMatch = 
          filter.difficulty === 'All' || 
          question.difficulty === filter.difficulty;
        
        const statusMatch = 
          filter.status === 'All' || 
          (filter.status === 'Completed' && question.status) ||
          (filter.status === 'Pending' && !question.status);
        
        const revisionMatch = 
          !filter.revision || question.forRevision;

        const notesMatch = 
          !filter.showNotes || (question.notes && question.notes.trim() !== '');

        return difficultyMatch && 
               statusMatch && 
               revisionMatch && 
               notesMatch;
      })
    })).filter(day => day.questions.length > 0);
  };

  // Filter Toolbar Component
  const FilterToolbar = () => {
    return (
      <div 
        className={`
          sticky top-0 z-10 p-4
          ${isDarkMode 
            ? 'bg-black-900 text-zinc-100 border-b border-zinc-700' 
            : 'bg-white text-gray-900 border-b border-gray-200'}
        `}
      >
        {/* Mobile Filter Toggle */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <span 
            className={`
              text-sm font-medium
              ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}
            `}
          >
            Progress: 
            <span 
              className={`
                ml-2 font-bold
                ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
              `}
            >
              {course ? `${course.completedQuestions || 0}/${course.totalQuestions || 0}` : '0/0'}
            </span>
          </span>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              px-3 py-1 rounded text-sm flex items-center
              ${isDarkMode 
                ? 'bg-black text-zinc-100 hover:bg-black' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
            `}
          >
            <Filter size={16} className="mr-2" />
            {isFilterOpen ? 'Close Filters' : 'Open Filters'}
          </button>
        </div>

        {/* User Information */}
        {user && (
          <div className={`mb-4 ${isFilterOpen || 'hidden md:flex'}`}>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
              Tracking progress for: <span className="font-bold">{user.name || user.email}</span>
            </span>
          </div>
        )}

        {/* Filters Container - Responsive Layout */}
        <div 
          className={`
            flex flex-col md:flex-row justify-between items-start md:items-center
            ${isFilterOpen || 'hidden md:flex'}
            space-y-4 md:space-y-0
          `}
        >
          {/* Filter Dropdowns and Checkboxes */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
            {/* Difficulty Dropdown - Responsive */}
            <div className="w-full md:w-auto">
              <select 
                value={filter.difficulty}
                onChange={(e) => setFilter(prev => ({...prev, difficulty: e.target.value}))}
                className={`
                  w-full md:w-auto px-3 py-2 rounded border text-sm
                  ${isDarkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100' 
                    : 'bg-white border-gray-300 text-gray-900'}
                `}
              >
                <option value="All">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Status Dropdown - Responsive */}
            <div className="w-full md:w-auto">
              <select 
                value={filter.status}
                onChange={(e) => setFilter(prev => ({...prev, status: e.target.value}))}
                className={`
                  w-full md:w-auto px-3 py-2 rounded border text-sm
                  ${isDarkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100' 
                    : 'bg-white border-gray-300 text-gray-900'}
                `}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Checkboxes - Responsive Vertical/Horizontal Layout */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
              <label 
                className={`
                  flex items-center space-x-2 w-full md:w-auto
                  ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}
                `}
              >
                <input
                  type="checkbox"
                  checked={filter.revision}
                  onChange={() => setFilter(prev => ({...prev, revision: !prev.revision}))}
                  className={`
                    form-checkbox
                    ${isDarkMode 
                      ? 'text-indigo-400' 
                      : 'text-blue-600'}
                  `}
                />
                <span className="text-sm">Revision</span>
              </label>
              <label 
                className={`
                  flex items-center space-x-2 w-full md:w-auto
                  ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}
                `}
              >
                <input
                  type="checkbox"
                  checked={filter.showNotes}
                  onChange={() => setFilter(prev => ({...prev, showNotes: !prev.showNotes}))}
                  className={`
                    form-checkbox
                    ${isDarkMode 
                      ? 'text-indigo-400' 
                      : 'text-blue-600'}
                  `}
                />
                <span className="text-sm">With Notes</span>
              </label>
            </div>
          </div>

          {/* Progress - Hide on Mobile, Show on Larger Screens */}
          <div className="hidden md:flex items-center space-x-2">
            <span 
              className={`
                text-sm font-medium
                ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}
              `}
            >
              Progress: 
            </span>
            <span 
              className={`
                font-bold
                ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
              `}
            >
              {course ? `${course.completedQuestions || 0}/${course.totalQuestions || 0}` : '0/0'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render Loading State
  if (loading) {
    return (
      <div 
        className={`
          flex items-center justify-center min-h-screen 
          transition-colors duration-300 p-4 pt-32
          ${isDarkMode ? 'bg-black' : 'bg-gray-100'}
        `}
      >
        <div 
          className={`
            animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-t-4 
            ${isDarkMode ? 'border-indigo-400' : 'border-blue-500'}
          `}
        ></div>
      </div>
    );
  }

  // Render Login Prompt
  if (!isLoggedIn || !user || !user.email) {
    return (
      <div 
        className={`
          flex flex-col items-center justify-center min-h-screen 
          transition-colors duration-300 p-4 pt-32
          ${isDarkMode ? 'bg-black' : 'bg-gray-100'}
        `}
      >
        <div 
          className={`
            text-center p-8 rounded-xl shadow-2xl w-full max-w-md
            ${isDarkMode 
              ? 'bg-black text-zinc-100' 
              : 'bg-white text-gray-900'}
          `}
        >
          <h2 
            className={`
              text-2xl font-bold mb-4
              ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
            `}
          >
            Login Required
          </h2>
          <p 
            className={`
              mb-6 
              ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}
            `}
          >
            Please login to view and track your course progress.
          </p>
          <button
            onClick={login}
            className={`
              px-6 py-3 rounded-full text-white font-semibold w-full
              transition-all duration-300 transform hover:scale-105
              ${isDarkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-500 hover:bg-indigo-600'}
            `}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div 
        className={`
          flex items-center justify-center min-h-screen min-w-screen
          transition-colors duration-300 p-4 pt-32
          ${isDarkMode ? 'bg-black' : 'bg-red-100'}
        `}
      >
        <div className="text-center max-w-md w-full">
          <h2 
            className={`
              text-xl md:text-2xl font-bold mb-4
              ${isDarkMode ? 'text-red-400' : 'text-red-600'}
            `}
          >
            Error
          </h2>
          <p 
            className={`
              mb-4 text-sm md:text-base
              ${isDarkMode ? 'text-red-300' : 'text-red-500'}
            `}
          >
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className={`
              px-4 py-2 rounded text-sm md:text-base w-full
              transition-colors duration-300
              ${isDarkMode 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'}
            `}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div 
      className={`
        min-h-screen pt-32 flex flex-col
        ${isDarkMode ? 'bg-black text-zinc-100' : 'bg-white text-gray-900'}
      `}
    >
      {/* Filter Toolbar */}
      <FilterToolbar />

      {/* Questions View */}
      <div 
        className={`
          flex-grow p-4
          ${isDarkMode ? 'bg-black' : 'bg-white'}
        `}
      >
        {filterQuestions().map(day => (

<div
key={day.dayNumber}
className="relative mb-6 p-2 rounded-2xl border-1  border-gradient-to-r from-blue-500 via-green-500 to-purple-500 "

>
            
            <button
              onClick={() => toggleDayCollapse(day.dayNumber)}
              className={`
                w-full text-left px-4 py-2 rounded flex justify-between items-center
                ${isDarkMode 
                  ? 'bg-black text-zinc-100 hover:bg-black' 
                  : 'bg-white text-gray-900 hover:bg-gray-100'}
              `}
            >
              <span className="font-semibold">
                Day {day.dayNumber}: {day.dayTitle}
              </span>
              {openDays[day.dayNumber] ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openDays[day.dayNumber] && (
              <div 
                className={`
                  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4
                  ${isDarkMode ? 'bg-black-900' : 'bg-white'}
                `}
              >
                {day.questions.map(question => (
                  <div 
                    key={question.id}
                    className={`
                      border rounded-lg p-4 shadow-lg transition-all duration-300
                      ${isDarkMode 
                        ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 hover:shadow-xl hover:scale-[1.02]' 
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-xl hover:scale-[1.02]'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className={`
                          text-sm font-semibold flex-grow
                          ${isDarkMode ? 'text-zinc-100' : 'text-gray-900'}
                        `}
                      >
                        {question.title}
                      </h3>
                      <span 
                        className={`
                          px-2 py-1 rounded-full text-xs font-bold ml-2
                          ${
                            question.difficulty === 'Easy' 
                              ? (isDarkMode 
                                ? 'bg-emerald-800 text-emerald-200' 
                                : 'bg-green-600 text-green-100')
                              : question.difficulty === 'Medium'
                              ? (isDarkMode 
                                ? 'bg-yellow-800 text-yellow-200' 
                                : 'bg-yellow-600 text-yellow-100')
                              : (isDarkMode 
                                ? 'bg-red-800 text-red-200' 
                                : 'bg-red-600 text-red-100')
                          }
                        `}
                      >
                        {question.difficulty}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex space-x-2">
                        {question.links.article && (
                          <a 
                            href={question.links.article} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`
                              ${isDarkMode 
                                ? 'text-indigo-300 hover:text-indigo-200' 
                                : 'text-blue-500 hover:text-blue-700'}
                            `}
                            title="Article"
                          >
                            <FileText size={16} />
                          </a>
                        )}
                        {question.links.youtube && (
                          <a 
                            href={question.links.youtube} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`
                              ${isDarkMode 
                                ? 'text-red-300 hover:text-red-200' 
                                : 'text-red-500 hover:text-red-700'}
                            `}
                            title="YouTube Tutorial"
                          >
                            <PlayCircle size={16} />
                          </a>
                        )}
                        {question.links.practice && (
                          <a 
                            href={question.links.practice} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`
                              ${isDarkMode 
                                ? 'text-green-300 hover:text-green-200' 
                                : 'text-green-500 hover:text-green-700'}
                            `}
                            title="Problem Link"
                          >
                            <LinkIcon size={16} />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuestionStatus(
                            course._id, 
                            day.dayNumber, 
                            question.id, 
                            { forRevision: !question.forRevision }
                          )}
                          className={`
                            ${question.forRevision 
                              ? (isDarkMode 
                                ? 'text-yellow-400' 
                                : 'text-yellow-600') 
                              : (isDarkMode 
                                ? 'text-zinc-500' 
                                : 'text-gray-400')}
                          `}
                          title="Mark for Revision"
                        >
                          <Star size={16} />
                        </button>
                        <input
                          type="checkbox"
                          checked={question.status}
                          onChange={() => updateQuestionStatus(
                            course._id, 
                            day.dayNumber, 
                            question.id, 
                            { status: !question.status }
                          )}
                          className={`
                            form-checkbox h-4 w-4
                            ${isDarkMode 
                              ? 'text-indigo-400' 
                              : 'text-blue-600'}
                          `}
                        />
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div 
                      className={`
                        mt-4 p-3 rounded-lg
                        ${isDarkMode 
                          ? 'bg-zinc-700 bg-opacity-50' 
                          : 'bg-gray-100'}
                      `}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 
                          className={`
                            text-sm font-semibold
                            ${isDarkMode ? 'text-zinc-200' : 'text-gray-700'}
                          `}
                        >
                          Notes
                        </h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const newNotes = prompt(
                                'Enter your notes:', 
                                question.notes || ''
                              );
                              if (newNotes !== null) {
                                updateQuestionStatus(
                                  course._id, 
                                  day.dayNumber, 
                                  question.id, 
                                  { notes: newNotes }
                                );
                              }
                            }}
                            className={`
                              ${isDarkMode 
                                ? 'text-indigo-400 hover:text-indigo-300' 
                                : 'text-blue-600 hover:text-blue-700'}
                            `}
                            title="Edit Notes"
                          >
                            <Edit size={16} />
                          </button>
                          {question.notes && (
                            <button
                              onClick={() => updateQuestionStatus(
                                course._id, 
                                day.dayNumber, 
                                question.id, 
                                { notes: '' }
                              )}
                              className={`
                                ${isDarkMode 
                                  ? 'text-red-400 hover:text-red-300' 
                                  : 'text-red-600 hover:text-red-700'}
                              `}
                              title="Clear Notes"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p 
                        className={`
                          text-sm
                          ${isDarkMode 
                            ? 'text-zinc-300' 
                            : 'text-gray-600'}
                        `}
                      >
                        {question.notes || 'No notes added'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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

export default CourseProgress;