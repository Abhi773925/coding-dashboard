import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  Plus,
  Users,
  Lock,
  Globe,
  Copy,
  ExternalLink,
  Clock,
  Code2,
  Play,
  Star,
  TrendingUp,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/api';

const RoomManager = ({ onJoinRoom }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('join');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Room creation state
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxUsers, setMaxUsers] = useState(10);
  
  // Join room state
  const [roomId, setRoomId] = useState('');
  const [publicRooms, setPublicRooms] = useState([]);
  const [recentRooms, setRecentRooms] = useState([]);

  useEffect(() => {
    fetchPublicRooms();
    loadRecentRooms();
  }, []);

  const fetchPublicRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.BACKEND_URL}/api/collaboration/rooms`);
      
      if (response.ok) {
        const data = await response.json();
        setPublicRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Failed to fetch public rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentRooms = () => {
    const recent = JSON.parse(localStorage.getItem('recentRooms') || '[]');
    setRecentRooms(recent);
  };

  const saveRecentRoom = (room) => {
    const recent = JSON.parse(localStorage.getItem('recentRooms') || '[]');
    const updated = [room, ...recent.filter(r => r.id !== room.id)].slice(0, 5);
    localStorage.setItem('recentRooms', JSON.stringify(updated));
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${config.BACKEND_URL}/api/collaboration/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription,
          isPrivate,
          maxUsers
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const room = {
          id: data.room.id,
          name: roomName,
          description: roomDescription,
          isPrivate: isPrivate,
          isPublic: !isPrivate,
          joinedAt: new Date().toISOString()
        };
        
        saveRecentRoom(room);
        onJoinRoom(data.room.id);
      }
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = (id) => {
    const room = {
      id,
      name: `Room ${id}`,
      description: '',
      joinedAt: new Date().toISOString()
    };
    
    saveRecentRoom(room);
    onJoinRoom(id);
  };

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const quickCreate = () => {
    // Quick create is always public by default for easy access
    const id = generateRoomId();
    const room = {
      id,
      name: `Quick Room ${id}`,
      description: 'Quick collaboration session',
      isPrivate: false,
      isPublic: true,
      joinedAt: new Date().toISOString()
    };
    
    saveRecentRoom(room);
    joinRoom(id);
  };

  const copyRoomLink = async (roomId) => {
    try {
      const link = `${window.location.origin}/collaborate?room=${roomId}`;
      await navigator.clipboard.writeText(link);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy room link:', err);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'text-yellow-500',
      python: 'text-blue-500',
      java: 'text-red-500',
      cpp: 'text-purple-500',
      c: 'text-gray-500',
      go: 'text-cyan-500',
      rust: 'text-orange-500',
      typescript: 'text-blue-600'
    };
    return colors[language] || 'text-gray-500';
  };

  const filteredRooms = publicRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-4 ${
      isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Collaborative Coding
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Create or join a room to start coding together in real-time
          </p>
        </div>

        {/* Tabs */}
        <div className={`flex rounded-lg p-1 mb-6 ${
          isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'
        }`}>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
              activeTab === 'join'
                ? (isDarkMode ? 'bg-zinc-700 text-white' : 'bg-white text-gray-900 shadow')
                : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            <Users className="w-4 h-4" />
            Join Room
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
              activeTab === 'create'
                ? (isDarkMode ? 'bg-zinc-700 text-white' : 'bg-white text-gray-900 shadow')
                : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Room
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'join' ? (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Join */}
              <div className={`p-6 rounded-xl border ${
                isDarkMode 
                  ? 'bg-zinc-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Join by Room ID */}
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Join by Room ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        placeholder="Enter room ID"
                        maxLength={8}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono ${
                          isDarkMode 
                            ? 'bg-zinc-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={() => roomId && joinRoom(roomId)}
                        disabled={!roomId || isLoading}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          roomId && !isLoading
                            ? (isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700')
                            : (isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-200 text-gray-400')
                        }`}
                      >
                        Join
                      </button>
                    </div>
                  </div>

                  {/* Quick Create */}
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Quick Start
                    </label>
                    <button
                      onClick={quickCreate}
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isDarkMode 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      Create & Join Room
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Rooms */}
              {recentRooms.length > 0 && (
                <div className={`p-6 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Recent Rooms
                    </h3>
                    <Clock className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recentRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`group p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                          isDarkMode 
                            ? 'bg-zinc-700 border-gray-600 hover:bg-zinc-600' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => joinRoom(room.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-mono text-sm ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            {room.id}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyRoomLink(room.id);
                            }}
                            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-opacity-50 ${
                              isDarkMode ? 'hover:bg-zinc-600' : 'hover:bg-gray-200'
                            }`}
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className={`font-medium truncate mb-1 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {room.name}
                        </div>
                        <div className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatTimeAgo(room.joinedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Public Rooms */}
              <div className={`p-6 rounded-xl border ${
                isDarkMode 
                  ? 'bg-zinc-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Public Rooms
                    </h3>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    }`}>
                      Open for all
                    </div>
                  </div>
                  <button
                    onClick={fetchPublicRooms}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-all ${
                      isDarkMode 
                        ? 'hover:bg-zinc-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rooms..."
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDarkMode 
                        ? 'bg-zinc-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`group p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-zinc-700 border-gray-600 hover:bg-zinc-600' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => joinRoom(room.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold truncate mb-1 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            {room.name}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-mono text-sm ${
                              isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                            }`}>
                              {room.id}
                            </span>
                            {room.isPrivate ? (
                              <Lock className="w-3 h-3 text-red-500" />
                            ) : (
                              <Globe className="w-3 h-3 text-green-500" />
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyRoomLink(room.id);
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-opacity-50 ${
                            isDarkMode ? 'hover:bg-zinc-600' : 'hover:bg-gray-200'
                          }`}
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      {room.description && (
                        <p className={`text-sm mb-3 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {room.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{room.currentUsers}/{room.maxUsers}</span>
                          </div>
                          {room.language && (
                            <div className="flex items-center gap-1">
                              <Code2 className={`w-3 h-3 ${getLanguageColor(room.language)}`} />
                              <span className={getLanguageColor(room.language)}>
                                {room.language}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={`${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {formatTimeAgo(room.lastActivity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredRooms.length === 0 && !isLoading && (
                  <div className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No rooms found. Create one to get started!</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-6 rounded-xl border ${
                isDarkMode 
                  ? 'bg-zinc-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Room
              </h3>

              <div className="space-y-4 max-w-2xl">
                {/* Room Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Room Name *
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDarkMode 
                        ? 'bg-zinc-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Room Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description (Optional)
                  </label>
                  <textarea
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    placeholder="Describe what you'll be working on"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                      isDarkMode 
                        ? 'bg-zinc-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Room Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Privacy */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Room Access
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPrivate(false)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          !isPrivate
                            ? (isDarkMode ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-600 border-indigo-600 text-white')
                            : (isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-zinc-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50')
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        <div className="flex flex-col items-start">
                          <span>Public</span>
                          <span className="text-xs opacity-80">Anyone can join</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setIsPrivate(true)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          isPrivate
                            ? (isDarkMode ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-600 border-indigo-600 text-white')
                            : (isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-zinc-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50')
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                        <div className="flex flex-col items-start">
                          <span>Private</span>
                          <span className="text-xs opacity-80">Invite only</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Max Users */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Max Users
                    </label>
                    <select
                      value={maxUsers}
                      onChange={(e) => setMaxUsers(parseInt(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDarkMode 
                          ? 'bg-zinc-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {[5, 10, 15, 20, 25, 50].map(num => (
                        <option key={num} value={num}>{num} users</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Create Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={createRoom}
                    disabled={!roomName.trim() || isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      roomName.trim() && !isLoading
                        ? (isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700')
                        : (isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-200 text-gray-400')
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {isLoading ? 'Creating...' : 'Create Room'}
                  </button>
                  
                  <button
                    onClick={quickCreate}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      isDarkMode 
                        ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Quick Start
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoomManager;
