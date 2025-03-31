"use client";
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  FaFilter, 
  FaSearch, 
  FaCalendarAlt, 
  FaClock, 
  FaLink, 
  FaYoutube,
  FaSpinner 
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ContestTracker = () => {
  const { isDarkMode } = useTheme();

  // State Management
  const [contestData, setContestData] = useState({
    contests: [],
    totalContests: 0,
    upcomingContests: 0,
    pastContests: 0,
    loading: true,
    error: null
  });

  // Filters State
  const [filters, setFilters] = useState({
    platform: '',
    type: 'all',
    search: ''
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    contestsPerPage: 10
  });

  // Fetch Contests
  const fetchContests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/codingkaro/contests');
  
      setContestData({
        contests: response.data,
        totalContests: response.data.length,
        upcomingContests: response.data.filter(contest => !contest.past).length,
        pastContests: response.data.filter(contest => contest.past).length,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Fetch Error:', error);
      
      const errorMessage = error.response 
        ? `Server Error: ${error.response.status}` 
        : error.message || 'Unknown error occurred';
  
      setContestData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  // Fetch contests on component mount
  useEffect(() => {
    fetchContests();
  }, []);

  // Processed Contests with Memoization
  const processedContests = useMemo(() => {
    return contestData.contests
      .filter(contest => {
        if (filters.platform && contest.platform !== filters.platform) return false;
        if (filters.type === 'upcoming' && contest.past) return false;
        if (filters.type === 'past' && !contest.past) return false;
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return contest.title.toLowerCase().includes(searchTerm) ||
                 contest.platform.toLowerCase().includes(searchTerm);
        }
        return true;
      })
      .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
  }, [contestData.contests, filters]);

  // Loading State Render Method
  const renderLoadingState = () => (
    <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="flex flex-col items-center">
        <FaSpinner className={`animate-spin text-4xl ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} mb-4`} />
        <p className={isDarkMode ? 'text-zinc-300' : 'text-gray-700'}>Loading contests...</p>
      </div>
    </div>
  );

  // Error State Render Method
  const renderErrorState = () => (
    <div className={`border border-red-400 text-red-700 px-6 py-4 rounded-xl ${isDarkMode ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-red-100'}`}>
      <div className="flex items-center justify-between">
        <div>
          <strong className="font-bold block mb-2">Oops! Something went wrong</strong>
          <span className="text-sm">{contestData.error}</span>
        </div>
        <button 
          onClick={fetchContests}
          className={`text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors ${isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'}`}
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Render Contest Card
  const renderContestCard = (contest) => (
    <div 
      key={contest._id} 
      className={`
        p-6 mb-4 rounded-xl transition-all duration-300 
        hover:scale-[1.02]
        ${isDarkMode 
          ? contest.past ? 'bg-zinc-800 border-l-4 border-zinc-600' : 'bg-zinc-700 border-l-4 border-indigo-400'
          : contest.past ? 'bg-gray-100 border-l-4 border-gray-400' : 'bg-white border-l-4 border-green-500'
        }
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{contest.title}</h3>
        <span className={`
          px-3 py-1 rounded-full text-sm font-semibold
          ${isDarkMode 
            ? contest.past ? 'bg-zinc-700 text-zinc-300' : 'bg-indigo-400 text-gray-900'
            : contest.past ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-800'
          }
        `}>
          {contest.past ? 'Past' : 'Upcoming'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <div className="flex items-center">
          <FaCalendarAlt className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-blue-500'}`} />
          <span className={isDarkMode ? 'text-gray-300' : ''}>{new Date(contest.start_time).toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <FaClock className={`mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-purple-500'}`} />
          <span className={isDarkMode ? 'text-gray-300' : ''}>{contest.duration} minutes</span>
        </div>
        <div className="flex items-center">
          <FaLink className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
          <a 
            href={contest.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`hover:text-indigo-700 hover:underline ${isDarkMode ? 'text-indigo-300' : ''}`}
          >
            Contest Link
          </a>
        </div>
        {contest.past && contest.solution_link && (
          <div className="flex items-center">
            <FaYoutube className={`mr-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <a 
              href={contest.solution_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:text-red-700 hover:underline ${isDarkMode ? 'text-red-300' : ''}`}
            >
              Solution Video
            </a>
          </div>
        )}
      </div>
    </div>
  );

  // Filters Render Method
  const renderFilters = () => (
    <div className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
      <div className="flex flex-wrap items-center space-x-4">
        <div className="flex items-center space-x-2 flex-grow">
          <FaFilter className={`text-gray-500 ${isDarkMode ? 'text-zinc-400' : ''}`} />
          <select 
            value={filters.platform}
            onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
            className={`p-2 border rounded flex-grow ${isDarkMode ? 'bg-zinc-700 text-gray-300 border-zinc-600' : 'border-gray-300'}`}
          >
            <option value="">All Platforms</option>
            <option value="LeetCode">LeetCode</option>
            <option value="Codeforces">Codeforces</option>
            <option value="CodeChef">CodeChef</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 flex-grow">
          <select 
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className={`p-2 border rounded flex-grow ${isDarkMode ? 'bg-zinc-700 text-gray-300 border-zinc-600' : 'border-gray-300'}`}
          >
            <option value="all">All Contests</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 flex-grow">
          <FaSearch className={`text-gray-500 ${isDarkMode ? 'text-zinc-400' : ''}`} />
          <input 
            type="text"
            placeholder="Search contests..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className={`p-2 border rounded flex-grow ${isDarkMode ? 'bg-zinc-700 text-gray-300 border-zinc-600' : 'border-gray-300'}`}
          />
        </div>
      </div>
    </div>
  );

  // Pagination Render Method
  const renderPagination = () => {
    const paginatedContests = processedContests.slice(
      (pagination.currentPage - 1) * pagination.contestsPerPage,
      pagination.currentPage * pagination.contestsPerPage
    );

    return (
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button 
          onClick={() => setPagination(prev => ({ 
            ...prev, 
            currentPage: Math.max(1, prev.currentPage - 1) 
          }))}
          disabled={pagination.currentPage === 1}
          className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 disabled:opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'}`}
        >
          Previous
        </button>
        
        <span className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Page {pagination.currentPage}
        </span>
        
        <button 
          onClick={() => setPagination(prev => ({ 
            ...prev, 
            currentPage: prev.currentPage + 1 
          }))}
          disabled={paginatedContests.length < pagination.contestsPerPage}
          className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 disabled:opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'}`}
        >
          Next
        </button>
      </div>
    );
  };

  // Statistics Render Method
  const renderStatistics = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-zinc-800' : 'bg-blue-50'}`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-blue-800'}`}>Total Contests</h2>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-blue-600'}`}>{contestData.totalContests}</p>
      </div>
      <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-zinc-800' : 'bg-green-50'}`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-green-800'}`}>Upcoming Contests</h2>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-green-600'}`}>{contestData.upcomingContests}</p>
      </div>
      <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'}`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Past Contests</h2>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-600'}`}>{contestData.pastContests}</p>
      </div>
    </div>
  );

  // Paginated Contests
  const paginatedContests = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.contestsPerPage;
    const endIndex = startIndex + pagination.contestsPerPage;
    return processedContests.slice(startIndex, endIndex);
  }, [processedContests, pagination]);

  return (
    <div className={`mx-auto p-8  ${isDarkMode ? 'bg-zinc-950 text-gray-100 w-full' : 'bg-white-50 text-gray-900 max-w-5xl'}`}>
      <div className={`rounded-2xl p-8 ${isDarkMode ? '' : ''}`}>
        <h1 className={`text-4xl font-extrabold mb-8 text-center ${isDarkMode ? 'text-gray-100' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'}`}>
          Coding Contest Tracker
        </h1>

        {/* Statistics */}
        {renderStatistics()}

        {/* Filters */}
        {renderFilters()}
        
        {/* Contest List */}
        <div>
          {contestData.loading ? (
            renderLoadingState()
          ) : contestData.error ? (
            renderErrorState()
          ) : paginatedContests.length > 0 ? (
            paginatedContests.map(renderContestCard)
          ) : (
            <div className={`text-center p-6 rounded-xl ${isDarkMode ? 'bg-zinc-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
              No contests found matching your criteria
            </div>
          )}
        </div>

        {/* Pagination */}
        {!contestData.loading && !contestData.error && processedContests.length > 0 && renderPagination()}
      </div>
    </div>
  );
};

export default ContestTracker;