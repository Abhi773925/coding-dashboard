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
  Calendar,
  Star,
  Globe,
  Lock,
  Code,
  Terminal,
  Video,
  MessageCircle,
  GitBranch,
  Archive,
  Trash2,
  ExternalLink,
  BookOpen,
  Award,
  Zap,
  Monitor,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../navigation/Navigation';

const EnhancedSessionManager = ({ onJoinSession, onCreateSession }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinSessionId, setJoinSessionId] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  
  const [newSessionData, setNewSessionData] = useState({
    name: '',
    description: '',
    maxUsers: 10,
    isPublic: true,
    language: 'javascript',
    template: 'blank',
    features: {
      chat: true,
      voice: false,
      video: false,
      livePreview: true,
      git: false,
      terminal: true,
      debugging: false,
      recording: false
    },
    accessLevel: 'open', // open, invite-only, password
    password: '',
    duration: 'unlimited', // 1h, 2h, 4h, 8h, unlimited
    autoSave: true,
    theme: 'auto'
  });

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start with an empty project',
      icon: '📄',
      files: []
    },
    {
      id: 'react-starter',
      name: 'React Starter',
      description: 'React app with basic setup',
      icon: '⚛️',
      files: [
        { name: 'App.jsx', content: 'import React from "react";\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello React!</h1>\n    </div>\n  );\n}\n\nexport default App;' },
        { name: 'index.js', content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(<App />, document.getElementById("root"));' },
        { name: 'package.json', content: '{\n  "name": "react-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0"\n  }\n}' }
      ]
    },
    {
      id: 'node-api',
      name: 'Node.js API',
      description: 'Express.js REST API starter',
      icon: '🟢',
      files: [
        { name: 'index.js', content: 'const express = require("express");\nconst app = express();\n\napp.use(express.json());\n\napp.get("/", (req, res) => {\n  res.json({ message: "Hello World!" });\n});\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n  console.log(`Server running on port ${PORT}`);\n});' },
        { name: 'package.json', content: '{\n  "name": "node-api",\n  "version": "1.0.0",\n  "main": "index.js",\n  "dependencies": {\n    "express": "^4.18.0"\n  }\n}' }
      ]
    },
    {
      id: 'python-flask',
      name: 'Python Flask',
      description: 'Flask web application',
      icon: '🐍',
      files: [
        { name: 'app.py', content: 'from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return jsonify({"message": "Hello Flask!"})\n\nif __name__ == "__main__":\n    app.run(debug=True)' },
        { name: 'requirements.txt', content: 'Flask==2.3.0' }
      ]
    },
    {
      id: 'html-css-js',
      name: 'Web Development',
      description: 'HTML, CSS, and JavaScript',
      icon: '🌐',
      files: [
        { name: 'index.html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Web Project</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <script src="script.js"></script>\n</body>\n</html>' },
        { name: 'style.css', content: 'body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}' },
        { name: 'script.js', content: 'console.log("Hello from JavaScript!");\n\ndocument.addEventListener("DOMContentLoaded", function() {\n    console.log("DOM loaded");\n});' }
      ]
    },
    {
      id: 'interview-prep',
      name: 'Interview Practice',
      description: 'Coding interview environment',
      icon: '💼',
      files: [
        { name: 'solution.js', content: '// Coding Interview Problem\n// Write your solution here\n\nfunction solution() {\n    // Your code here\n}\n\n// Test cases\nconsole.log(solution());' }
      ]
    }
  ];

  const languages = [
    { id: 'all', name: 'All Languages', icon: '🌐' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚙️' },
    { id: 'html', name: 'Web Dev', icon: '🌐' },
    { id: 'go', name: 'Go', icon: '🐹' },
    { id: 'rust', name: 'Rust', icon: '🦀' }
  ];

  useEffect(() => {
    // Simulate fetching sessions from API
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
        tags: ['React', 'Interview', 'Frontend'],
        features: ['chat', 'video', 'recording'],
        rating: 4.8,
        sessions: 15,
        template: 'react-starter'
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
        tags: ['Python', 'Algorithms', 'DSA'],
        features: ['chat', 'terminal', 'debugging'],
        rating: 4.9,
        sessions: 23,
        template: 'python-flask'
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
        tags: ['MERN', 'Full Stack', 'Project'],
        features: ['chat', 'git', 'livePreview'],
        rating: 4.7,
        sessions: 8,
        template: 'node-api'
      },
      {
        id: 'session-4',
        name: 'Web Development Bootcamp',
        description: 'Learn HTML, CSS, and JavaScript from scratch',
        owner: 'Sarah Wilson',
        ownerId: 'user-4',
        users: 12,
        maxUsers: 20,
        isPublic: true,
        language: 'html',
        createdAt: new Date('2025-01-10'),
        lastActivity: new Date(Date.now() - 1800000),
        status: 'active',
        tags: ['HTML', 'CSS', 'JavaScript', 'Beginner'],
        features: ['chat', 'livePreview', 'recording'],
        rating: 4.6,
        sessions: 45,
        template: 'html-css-js'
      }
    ];
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || 
                       (filterRole === 'owner' && session.ownerId === user?.id) ||
                       (filterRole === 'participant' && session.ownerId !== user?.id);

    const matchesLanguage = filterLanguage === 'all' || session.language === filterLanguage;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesLanguage && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'users': return b.users - a.users;
      case 'rating': return b.rating - a.rating;
      case 'created': return new Date(b.createdAt) - new Date(a.createdAt);
      default: return new Date(b.lastActivity) - new Date(a.lastActivity);
    }
  });

  const handleCreateSession = async () => {
    try {
      const sessionData = {
        ...newSessionData,
        id: `session-${Date.now()}`,
        ownerId: user?.id,
        owner: user?.name,
        users: 1,
        createdAt: new Date(),
        lastActivity: new Date(),
        status: 'active',
        rating: 0,
        sessions: 0
      };

      const template = templates.find(t => t.id === newSessionData.template);
      if (template) {
        sessionData.files = template.files;
      }

      setSessions(prev => [sessionData, ...prev]);
      setShowCreateModal(false);
      
      // Reset form
      setNewSessionData({
        name: '',
        description: '',
        maxUsers: 10,
        isPublic: true,
        language: 'javascript',
        template: 'blank',
        features: {
          chat: true,
          voice: false,
          video: false,
          livePreview: true,
          git: false,
          terminal: true,
          debugging: false,
          recording: false
        },
        accessLevel: 'open',
        password: '',
        duration: 'unlimited',
        autoSave: true,
        theme: 'auto'
      });

      onCreateSession(sessionData);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleJoinSession = (sessionId, role = 'viewer') => {
    onJoinSession(sessionId, role);
  };

  const handleJoinByCode = () => {
    if (joinSessionId.trim()) {
      handleJoinSession(joinSessionId.trim());
      setJoinSessionId('');
      setShowJoinModal(false);
    }
  };

  const copySessionLink = (sessionId) => {
    const link = `${window.location.origin}/collaborate/${sessionId}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
    alert('Session link copied to clipboard!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageIcon = (language) => {
    const lang = languages.find(l => l.id === language);
    return lang?.icon || '📄';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900 text-slate-300' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Collaboration Hub</h1>
              <p className="text-gray-500 mt-1">Code together in real-time</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Join Session</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-slate-300 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${
                isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Sessions</option>
              <option value="owner">My Sessions</option>
              <option value="participant">Joined Sessions</option>
            </select>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${
                isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${
                isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              <option value="lastActivity">Last Activity</option>
              <option value="name">Name</option>
              <option value="users">Most Users</option>
              <option value="rating">Highest Rated</option>
              <option value="created">Newest</option>
            </select>

            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-slate-300' : 'bg-gray-200'}`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-slate-300' : 'bg-gray-200'}`}
              >
                <div className="space-y-1 w-4 h-4">
                  <div className="bg-current h-1 rounded"></div>
                  <div className="bg-current h-1 rounded"></div>
                  <div className="bg-current h-1 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                  isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getLanguageIcon(session.language)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{session.name}</h3>
                      <p className="text-sm text-gray-500">by {session.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {!session.isPublic && <Lock className="w-4 h-4 text-gray-400" />}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{session.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {session.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {session.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{session.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{session.users}/{session.maxUsers}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{session.rating}</span>
                    </div>
                  </div>
                  <span>{formatTimeAgo(session.lastActivity)}</span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  {session.features.includes('chat') && <MessageCircle className="w-4 h-4 text-blue-500" />}
                  {session.features.includes('video') && <Video className="w-4 h-4 text-green-500" />}
                  {session.features.includes('git') && <GitBranch className="w-4 h-4 text-orange-500" />}
                  {session.features.includes('terminal') && <Terminal className="w-4 h-4 text-purple-500" />}
                  {session.features.includes('livePreview') && <Monitor className="w-4 h-4 text-indigo-500" />}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleJoinSession(session.id, 'viewer')}
                    className="flex-1 px-3 py-2 bg-blue-600 text-slate-300 rounded hover:bg-blue-700 text-sm"
                  >
                    Join Session
                  </button>
                  <button
                    onClick={() => copySessionLink(session.id)}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getLanguageIcon(session.language)}</span>
                    <div>
                      <h3 className="font-semibold">{session.name}</h3>
                      <p className="text-sm text-gray-500">{session.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{session.users}/{session.maxUsers}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(session.lastActivity)}</span>
                    </div>
                    <button
                      onClick={() => handleJoinSession(session.id, 'viewer')}
                      className="px-4 py-2 bg-blue-600 text-slate-300 rounded hover:bg-blue-700"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or create a new session</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-slate-300 rounded-lg hover:bg-blue-700"
            >
              Create New Session
            </button>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${
            isDarkMode ? 'bg-zinc-900' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Session</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">Session Name</label>
                  <input
                    type="text"
                    value={newSessionData.name}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter session name..."
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newSessionData.description}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your session..."
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Project Template</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setNewSessionData(prev => ({ ...prev, template: template.id }))}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          newSessionData.template === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-500">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select
                      value={newSessionData.language}
                      onChange={(e) => setNewSessionData(prev => ({ ...prev, language: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      {languages.filter(l => l.id !== 'all').map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Users</label>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={newSessionData.maxUsers}
                      onChange={(e) => setNewSessionData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries({
                      chat: { icon: MessageCircle, label: 'Chat' },
                      voice: { icon: Mic, label: 'Voice' },
                      video: { icon: Video, label: 'Video' },
                      livePreview: { icon: Monitor, label: 'Live Preview' },
                      git: { icon: GitBranch, label: 'Git Integration' },
                      terminal: { icon: Terminal, label: 'Terminal' },
                      debugging: { icon: Bug, label: 'Debugging' },
                      recording: { icon: Archive, label: 'Recording' }
                    }).map(([key, { icon: Icon, label }]) => (
                      <label key={key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newSessionData.features[key]}
                          onChange={(e) => setNewSessionData(prev => ({
                            ...prev,
                            features: { ...prev.features, [key]: e.target.checked }
                          }))}
                          className="rounded"
                        />
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Access Control */}
                <div>
                  <label className="block text-sm font-medium mb-2">Access Level</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="accessLevel"
                        value="open"
                        checked={newSessionData.accessLevel === 'open'}
                        onChange={(e) => setNewSessionData(prev => ({ ...prev, accessLevel: e.target.value }))}
                      />
                      <Globe className="w-4 h-4" />
                      <span>Public - Anyone can join</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="accessLevel"
                        value="invite-only"
                        checked={newSessionData.accessLevel === 'invite-only'}
                        onChange={(e) => setNewSessionData(prev => ({ ...prev, accessLevel: e.target.value }))}
                      />
                      <Users className="w-4 h-4" />
                      <span>Invite Only - Share link to invite</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="accessLevel"
                        value="password"
                        checked={newSessionData.accessLevel === 'password'}
                        onChange={(e) => setNewSessionData(prev => ({ ...prev, accessLevel: e.target.value }))}
                      />
                      <Lock className="w-4 h-4" />
                      <span>Password Protected</span>
                    </label>
                  </div>
                  {newSessionData.accessLevel === 'password' && (
                    <input
                      type="password"
                      placeholder="Enter password..."
                      value={newSessionData.password}
                      onChange={(e) => setNewSessionData(prev => ({ ...prev, password: e.target.value }))}
                      className={`mt-2 w-full px-3 py-2 border rounded-lg ${
                        isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSession}
                    disabled={!newSessionData.name.trim()}
                    className="px-4 py-2 bg-blue-600 text-slate-300 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Create Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Session Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-lg p-6 ${
            isDarkMode ? 'bg-zinc-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Join Session</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Session ID or Link</label>
                <input
                  type="text"
                  value={joinSessionId}
                  onChange={(e) => setJoinSessionId(e.target.value)}
                  placeholder="Enter session ID or paste link..."
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode ? 'bg-zinc-900 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinByCode}
                  disabled={!joinSessionId.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-slate-300 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSessionManager;
