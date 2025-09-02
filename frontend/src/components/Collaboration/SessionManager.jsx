import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Users, 
  Clock, 
  Settings, 
  Copy, 
  Eye, 
  Edit3, 
  Crown,
  Plus,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../navigation/Navigation';

const SessionManager = ({ onJoinSession, onCreateSession }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    name: '',
    description: '',
    maxUsers: 10,
    isPublic: true,
    language: 'javascript',
    template: 'blank'
  });

  // Mock sessions data - replace with actual API call
  useEffect(() => {
    // Simulate fetching sessions
    const mockSessions = [
      {
        id: 'session-1',
        name: 'React Interview Practice',
        description: 'Mock interview session for React developers',
        owner: 'John Doe',
        ownerId: 'user-1',
        users: 3,
        maxUsers: 5,
        isPublic: true,
        language: 'javascript',
        createdAt: new Date('2025-01-15'),
        lastActivity: new Date(),
        status: 'active',
        tags: ['React', 'Interview', 'Frontend']
      },
      {
        id: 'session-2',
        name: 'Python Algorithm Study',
        description: 'Collaborative algorithm problem solving',
        owner: 'Jane Smith',
        ownerId: 'user-2',
        users: 2,
        maxUsers: 8,
        isPublic: true,
        language: 'python',
        createdAt: new Date('2025-01-14'),
        lastActivity: new Date(Date.now() - 3600000),
        status: 'active',
        tags: ['Python', 'Algorithms', 'DSA']
      },
      {
        id: 'session-3',
        name: 'Full Stack Project',
        description: 'Building a MERN stack application together',
        owner: 'Alex Johnson',
        ownerId: 'user-3',
        users: 5,
        maxUsers: 10,
        isPublic: false,
        language: 'javascript',
        createdAt: new Date('2025-01-13'),
        lastActivity: new Date(Date.now() - 7200000),
        status: 'active',
        tags: ['MERN', 'Full Stack', 'Project']
      }
    ];
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterRole === 'all' || 
                         (filterRole === 'owner' && session.ownerId === user?.id) ||
                         (filterRole === 'participant' && session.ownerId !== user?.id);
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateSession = async () => {
    const sessionId = `session-${Date.now()}`;
    const newSession = {
      id: sessionId,
      ...newSessionData,
      owner: user?.name || 'Anonymous',
      ownerId: user?.id || 'anonymous',
      users: 1,
      createdAt: new Date(),
      lastActivity: new Date(),
      status: 'active',
      tags: []
    };

    setSessions(prev => [newSession, ...prev]);
    setShowCreateModal(false);
    setNewSessionData({
      name: '',
      description: '',
      maxUsers: 10,
      isPublic: true,
      language: 'javascript',
      template: 'blank'
    });

    if (onCreateSession) {
      onCreateSession(newSession);
    }
  };

  const handleJoinSession = (session, role = 'viewer') => {
    if (onJoinSession) {
      onJoinSession(session.id, role);
    }
  };

  const copySessionLink = (sessionId) => {
    const link = `${window.location.origin}/collaborate/${sessionId}`;
    navigator.clipboard.writeText(link);
    // You can add a toast notification here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'ended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      typescript: '🔷',
      go: '🟦',
      rust: '🦀'
    };
    return icons[language] || '📄';
  };

  const templates = [
    { id: 'blank', name: 'Blank Project', description: 'Start with an empty workspace' },
    { id: 'react', name: 'React App', description: 'Basic React application setup' },
    { id: 'node', name: 'Node.js API', description: 'Express.js REST API template' },
    { id: 'python-flask', name: 'Python Flask', description: 'Flask web application' },
    { id: 'interview', name: 'Interview Setup', description: 'Optimized for coding interviews' },
    { id: 'algorithm', name: 'Algorithm Practice', description: 'Data structures and algorithms' }
  ];

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
            Collaborative Sessions
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join existing sessions or create your own collaborative coding environment
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-gray-700 text-slate-300 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            {/* Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-zinc-900 border-gray-700 text-slate-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="all">All Sessions</option>
              <option value="owner">My Sessions</option>
              <option value="participant">Joined Sessions</option>
            </select>
          </div>

          {/* Create Session Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`rounded-xl border p-6 transition-all duration-200 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-zinc-900 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getLanguageIcon(session.language)}</span>
                  <div>
                    <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                      {session.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {session.ownerId === user?.id && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {session.description}
              </p>

              {/* Tags */}
              {session.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-zinc-900 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {session.users}/{session.maxUsers} users
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {session.owner}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {session.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {Math.round((Date.now() - session.lastActivity.getTime()) / 60000)}m ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleJoinSession(session, 'viewer')}
                    className={`px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 ${
                      isDarkMode 
                        ? 'bg-zinc-900 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  
                  {session.users < session.maxUsers && (
                    <button
                      onClick={() => handleJoinSession(session, 'editor')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded text-sm font-medium flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Join</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => copySessionLink(session.id)}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
                  title="Copy session link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Users className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              No sessions found
            </h3>
            <p className={`text-gray-500 mb-4`}>
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first collaborative session to get started'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded-lg font-medium"
            >
              Create New Session
            </button>
          </div>
        )}

        {/* Create Session Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl p-6 w-full max-w-md ${
              isDarkMode ? 'bg-zinc-900' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                Create New Session
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateSession(); }} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Session Name
                  </label>
                  <input
                    type="text"
                    value={newSessionData.name}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode 
                        ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={newSessionData.description}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode 
                        ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Language
                    </label>
                    <select
                      value={newSessionData.language}
                      onChange={(e) => setNewSessionData(prev => ({ ...prev, language: e.target.value }))}
                      className={`w-full px-3 py-2 rounded border ${
                        isDarkMode 
                          ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="typescript">TypeScript</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Max Users
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={newSessionData.maxUsers}
                      onChange={(e) => setNewSessionData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded border ${
                        isDarkMode 
                          ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Template
                  </label>
                  <select
                    value={newSessionData.template}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, template: e.target.value }))}
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode 
                        ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newSessionData.isPublic}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="isPublic" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Make session public
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className={`flex-1 px-4 py-2 rounded font-medium ${
                      isDarkMode 
                        ? 'bg-zinc-900 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded font-medium"
                  >
                    Create Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;
