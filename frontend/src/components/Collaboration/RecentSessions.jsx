import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { 
  Clock, 
  Users, 
  Code2, 
  Calendar,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  X,
  Play,
  History
} from 'lucide-react';
import { config } from '../../config/config';

const RecentSessions = ({ onJoinRoom, onClose }) => {
  const { isDarkMode } = useTheme();
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get user info from localStorage
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const isLoggedIn = !!(userEmail && userName);

  const languages = [
    'javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript', 'php', 'ruby'
  ];

  const fetchRecentSessions = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (!isLoggedIn) {
        // For guest users, try to get guestId from localStorage
        const guestId = localStorage.getItem('guestId') || `guest_${Date.now()}`;
        localStorage.setItem('guestId', guestId);
        params.append('guestId', guestId);
      }
      params.append('limit', '10'); // Limit to recent 10 sessions

      const response = await axios.get(`${config.API_BASE_URL}/api/sessions?${params.toString()}`, {
        withCredentials: true,
        headers: {
          'Authorization': isLoggedIn ? `Bearer ${localStorage.getItem('sessionToken')}` : undefined
        }
      });

      if (response.data.success) {
        setRecentSessions(response.data.sessions || []);
      } else {
        setError('Failed to fetch recent sessions');
      }
    } catch (err) {
      console.error('Error fetching recent sessions:', err);
      setError('Error loading recent sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentSessions();
  }, [isLoggedIn]);

  const handleJoinSession = (roomId) => {
    onJoinRoom(roomId);
    onClose();
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffInMinutes = Math.floor((now - sessionDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '🔷',
      c: '🔵',
      go: '🐹',
      rust: '🦀',
      typescript: '🔷',
      php: '🐘',
      ruby: '💎'
    };
    return icons[language] || '📝';
  };

  const filteredSessions = recentSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || session.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return (
      <motion.div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-900 bg-opacity-50'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`w-full max-w-2xl mx-4 p-8 rounded-2xl shadow-2xl ${
            isDarkMode ? 'bg-zinc-900 border border-zinc-700' : 'bg-white border border-gray-200'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="flex items-center justify-center">
            <RefreshCw className={`w-8 h-8 animate-spin ${
              isDarkMode ? 'text-blue-400' : 'text-blue-500'
            }`} />
            <span className={`ml-3 text-lg ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Loading recent sessions...
            </span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-900 bg-opacity-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`w-full max-w-4xl max-h-[80vh] mx-4 rounded-2xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-zinc-900 border border-zinc-700' : 'bg-white border border-gray-200'
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${
          isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className={`w-6 h-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Sessions
              </h2>
              {isLoggedIn ? (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                }`}>
                  Logged in as {userName}
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                }`}>
                  Guest User
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-zinc-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-zinc-700 border-zinc-600 text-gray-300 hover:bg-zinc-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Language</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`} />
              </button>
              
              {showFilters && (
                <div className={`absolute top-full mt-1 right-0 w-48 rounded-lg border shadow-lg z-10 ${
                  isDarkMode ? 'bg-zinc-800 border-zinc-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    <button
                      onClick={() => setFilterLanguage('all')}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        filterLanguage === 'all'
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      All Languages
                    </button>
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => setFilterLanguage(lang)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          filterLanguage === lang
                            ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : isDarkMode ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {getLanguageIcon(lang)} {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={fetchRecentSessions}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              <p>{error}</p>
              <button
                onClick={fetchRecentSessions}
                className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Try Again
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className={`text-center py-12 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || filterLanguage !== 'all' ? 'No matching sessions found' : 'No recent sessions'}
              </h3>
              <p className="text-sm">
                {searchQuery || filterLanguage !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : isLoggedIn 
                    ? 'Start collaborating to see your sessions here'
                    : 'Your recent sessions will appear here'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSessions.map((session) => (
                <motion.div
                  key={session.roomId}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750 hover:border-zinc-600' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                  onClick={() => handleJoinSession(session.roomId)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getLanguageIcon(session.language)}</span>
                        <h3 className={`text-lg font-semibold truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {session.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          session.isActive
                            ? isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                            : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {session.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {session.description && (
                        <p className={`text-sm mb-3 line-clamp-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {session.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Users className="w-4 h-4" />
                          <span>{session.participantCount} participant{session.participantCount !== 1 ? 's' : ''}</span>
                        </div>
                        
                        <div className={`flex items-center gap-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(session.lastActivity)}</span>
                        </div>
                        
                        <div className={`flex items-center gap-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Code2 className="w-4 h-4" />
                          <span>{session.language}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinSession(session.roomId);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecentSessions;
