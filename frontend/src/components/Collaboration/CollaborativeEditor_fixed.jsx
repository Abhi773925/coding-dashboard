import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {useCallback} from 'react';
import CollabNotifications, { useCollabNotifications } from './CollabNotifications';
import axios from 'axios';
import { 
  Play, 
  RotateCcw, 
  Copy,
  Save,
  Settings, 
  Terminal, 
  Code2, 
  FileText, 
  CheckCircle,
  XCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
  Users,
  MessageCircle,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Smile,
  Paperclip,
  MoreHorizontal,
  Circle
} from 'lucide-react';
import { io } from 'socket.io-client';
import { config } from '../../config/config';

const CollaborativeEditor = ({ roomId, user, onLeaveRoom }) => {
  const { isDarkMode } = useTheme();
  const notify = useCollabNotifications();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Add custom styles for resizable panels
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .resizable-panel {
        resize: horizontal;
        overflow: auto;
      }
      
      .resizable-section {
        resize: vertical;
        overflow: auto;
      }
      
      .resize-handle {
        user-select: none;
      }
      
      .resize-handle:hover {
        opacity: 0.8;
      }
      
      .resizable-panel::-webkit-resizer,
      .resizable-section::-webkit-resizer {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);
  
  // Code editor states
  const [code, setCode] = useState('console.log("Hello, World!");');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState('users');
  const [isMobileView, setIsMobileView] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userCursors, setUserCursors] = useState(new Map());
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [activeFloatingTab, setActiveFloatingTab] = useState('chat');

  // Chat Overlay States
  const [isChatOverlayOpen, setIsChatOverlayOpen] = useState(false);
  const [activeOverlayTab, setActiveOverlayTab] = useState('chat');
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessages, setPrivateMessages] = useState(new Map());
  const [privateMessage, setPrivateMessage] = useState('');

  // Refs
  const codeEditorRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Mobile view detection
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Socket connection
  useEffect(() => {
    if (roomId && user) {
      const newSocket = io(config.API_URL, {
        auth: { token: localStorage.getItem('token') }
      });

      newSocket.emit('join-collaboration', {
        roomId,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          color: `bg-${['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo'][Math.floor(Math.random() * 7)]}-500`
        }
      });

      // Socket event listeners
      newSocket.on('connect', () => {
        setIsConnected(true);
        notify?.success('Connected to collaboration room');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        notify?.error('Disconnected from collaboration room');
      });

      newSocket.on('user-joined', (data) => {
        setConnectedUsers(data.users);
        setCurrentUser(data.currentUser);
        notify?.info(`${data.joinedUser.name} joined the room`);
      });

      newSocket.on('user-left', (data) => {
        setConnectedUsers(data.users);
        notify?.info(`${data.leftUser.name} left the room`);
      });

      newSocket.on('users-list', (data) => {
        setConnectedUsers(data.users);
        setCurrentUser(data.currentUser);
      });

      newSocket.on('code-updated', (data) => {
        if (data.userId !== currentUser?.id) {
          setCode(data.code);
        }
      });

      newSocket.on('cursor-moved', (data) => {
        if (data.userId !== currentUser?.id) {
          setUserCursors(prev => {
            const newCursors = new Map(prev);
            newCursors.set(data.userId, data);
            return newCursors;
          });
        }
      });

      newSocket.on('execution-result', (data) => {
        const message = {
          id: Date.now(),
          type: 'execution',
          userName: data.userName,
          userColor: data.userColor,
          content: {
            result: data.result,
            status: data.status,
            executionTime: data.executionTime
          },
          timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
        setOutput(data.result);
      });

      newSocket.on('message-received', (data) => {
        setMessages(prev => [...prev, data]);
      });

      newSocket.on('user-typing', (data) => {
        setTypingUsers(prev => new Set([...prev, data.userName]));
        setTimeout(() => {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userName);
            return newSet;
          });
        }, 3000);
      });

      newSocket.on('private-message-received', (data) => {
        setPrivateMessages(prev => {
          const newMessages = new Map(prev);
          const userMessages = newMessages.get(data.fromUserId) || [];
          newMessages.set(data.fromUserId, [...userMessages, {
            id: Date.now(),
            type: 'received',
            content: data.message,
            timestamp: new Date()
          }]);
          return newMessages;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.emit('leave-collaboration', { roomId });
        newSocket.disconnect();
      };
    }
  }, [roomId, user, currentUser?.id, notify]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Code change handler
  const handleCodeChange = useCallback((e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (socket && isConnected) {
      socket.emit('code-change', {
        roomId,
        code: newCode,
        userId: currentUser?.id
      });
    }
  }, [socket, isConnected, roomId, currentUser?.id]);

  // Cursor movement handler
  const handleCursorMove = useCallback((e) => {
    if (socket && isConnected && e.target.selectionStart !== undefined) {
      socket.emit('cursor-move', {
        roomId,
        userId: currentUser?.id,
        userName: currentUser?.name,
        userColor: currentUser?.color,
        position: e.target.selectionStart,
        timestamp: Date.now()
      });
    }
  }, [socket, isConnected, roomId, currentUser]);

  // Code execution
  const executeCode = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setIsRunning(true);
    
    try {
      const response = await axios.post(`${config.API_URL}/api/code/execute`, {
        code,
        language,
        input: input || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = response.data;
      const executionData = {
        roomId,
        result: result.output || result.error || 'No output',
        status: result.error ? 'error' : 'success',
        executionTime: result.time || 0,
        userName: currentUser?.name,
        userColor: currentUser?.color,
        userId: currentUser?.id
      };

      if (socket && isConnected) {
        socket.emit('code-executed', executionData);
      }

      setOutput(executionData.result);
      notify?.success('Code executed successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Execution failed';
      setOutput(errorMessage);
      notify?.error(errorMessage);
    } finally {
      setIsExecuting(false);
      setIsRunning(false);
    }
  };

  // Message sending
  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    const message = {
      id: Date.now(),
      type: 'message',
      content: newMessage,
      userName: currentUser?.name,
      userColor: currentUser?.color,
      userId: currentUser?.id,
      timestamp: new Date()
    };

    socket.emit('send-message', {
      roomId,
      message: message.content,
      userName: currentUser?.name,
      userColor: currentUser?.color,
      userId: currentUser?.id
    });

    setNewMessage('');
  };

  // Send private message
  const sendPrivateMessage = (toUser) => {
    if (!privateMessage.trim() || !socket || !isConnected) return;

    socket.emit('send-private-message', {
      roomId,
      toUserId: toUser.socketId,
      message: privateMessage,
      fromUserId: currentUser?.id,
      fromUserName: currentUser?.name
    });

    // Add to local private messages
    setPrivateMessages(prev => {
      const newMessages = new Map(prev);
      const userMessages = newMessages.get(toUser.socketId) || [];
      newMessages.set(toUser.socketId, [...userMessages, {
        id: Date.now(),
        type: 'sent',
        content: privateMessage,
        timestamp: new Date()
      }]);
      return newMessages;
    });

    setPrivateMessage('');
  };

  // Typing indicator
  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit('user-typing', {
        roomId,
        userName: currentUser?.name,
        userId: currentUser?.id
      });
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
    }`}>
      {/* Collaboration Notifications */}
      <CollabNotifications />

      {/* Header */}
      <header className={`flex items-center justify-between p-3 sm:p-4 border-b ${
        isDarkMode 
          ? 'bg-zinc-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Code2 className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`} />
            <h1 className={`text-lg sm:text-xl font-bold truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Collaborative Editor
            </h1>
          </div>

          {/* Room Info */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            isDarkMode ? 'bg-zinc-800 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            <Circle className={`w-2 h-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            Room: {roomId}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-2 py-1 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-zinc-800 border-zinc-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {/* Execute Button */}
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isExecuting
                ? isDarkMode 
                  ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isExecuting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isExecuting ? 'Running...' : 'Run'}
          </button>

          {/* User and Chat Toggle Icons */}
          <div className="flex items-center gap-1">
            {/* Users Count */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              isDarkMode ? 'bg-zinc-800 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {connectedUsers.length}
              </span>
            </div>

            {/* Chat Toggle */}
            <button
              onClick={() => setIsChatOverlayOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-zinc-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Resizable Layout */}
      <div className="flex-1 flex overflow-hidden">
        {isMobileView ? (
          /* Mobile Layout */
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className={`p-2 border-b ${
                isDarkMode ? 'bg-zinc-800 border-gray-700' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Code Editor
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Toggle Chat/Users */}
                    <button
                      onClick={() => setActiveTab(activeTab === 'chat' ? 'users' : 'chat')}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {activeTab === 'chat' ? <Users className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <textarea
                ref={codeEditorRef}
                value={code}
                onChange={handleCodeChange}
                onSelect={handleCursorMove}
                className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
                  isDarkMode 
                    ? 'bg-zinc-900 text-gray-100' 
                    : 'bg-white text-gray-900'
                }`}
                placeholder="Start coding together..."
                spellCheck={false}
              />
            </div>

            {/* Mobile Content Based on Active Tab */}
            <div className={`border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {activeTab === 'users' && (
                <div className={`h-full p-4 overflow-y-auto ${
                  isDarkMode ? 'bg-zinc-900' : 'bg-white'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Connected Users ({connectedUsers.length})
                  </h3>
                  <div className="space-y-3">
                    {connectedUsers.map((user) => (
                      <div
                        key={user.socketId}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center`}>
                          <span className="text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            {user.name}
                            {user.socketId === currentUser?.id && (
                              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              }`}>
                                You
                              </span>
                            )}
                          </div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {user.isActive ? 'Active' : 'Away'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="h-64 flex flex-col">
                  <div
                    ref={chatContainerRef}
                    className={`flex-1 overflow-y-auto p-4 space-y-3 ${
                      isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'
                    }`}
                  >
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-2">
                        {message.type !== 'system' && message.type !== 'execution' && (
                          <div className={`w-6 h-6 rounded-full ${message.userColor || 'bg-gray-500'} flex-shrink-0 flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">
                              {message.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {message.type === 'execution' && (
                          <div className={`w-6 h-6 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center`}>
                            <Terminal className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {message.type === 'system' ? (
                            <div className={`text-xs italic ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <Terminal className="w-4 h-4 inline mr-1" />
                              {message.content}
                            </div>
                          ) : message.type === 'execution' ? (
                            <div className={`p-2 rounded-lg ${
                              isDarkMode ? 'bg-zinc-700 border border-zinc-600' : 'bg-gray-100 border border-gray-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Terminal className="w-3 h-3 text-green-500" />
                                <span className={`text-xs font-medium ${
                                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                }`}>
                                  {message.userName} executed code
                                </span>
                                <span className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {formatTime(message.timestamp)}
                                </span>
                                {message.content.executionTime && (
                                  <span className={`text-xs px-1 py-0.5 rounded ${
                                    isDarkMode ? 'bg-zinc-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    {message.content.executionTime}ms
                                  </span>
                                )}
                              </div>
                              <pre className={`text-xs font-mono whitespace-pre-wrap ${
                                message.content.status === 'error' 
                                  ? 'text-red-400' 
                                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {message.content.result}
                              </pre>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-medium ${
                                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                }`}>
                                  {message.userName}
                                </span>
                                <span className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <div className={`text-sm ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {message.content}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {typingUsers.size > 0 && (
                      <div className={`text-sm italic ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className={`p-3 border-t ${
                    isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode 
                            ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          newMessage.trim()
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : isDarkMode 
                              ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'input' && (
                <div className="h-48 flex flex-col">
                  <div className={`p-3 ${
                    isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                  }`}>
                    <label className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Custom Input (for your code):
                    </label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter input for your code here..."
                      className={`w-full mt-2 p-3 text-sm rounded border h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                        isDarkMode 
                          ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'output' && (
                <div className={`h-48 p-4 overflow-y-auto ${
                  isDarkMode ? 'bg-zinc-900' : 'bg-white'
                }`}>
                  <pre className={`font-mono text-sm whitespace-pre-wrap ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {output || (
                      <span className={`${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Run your code to see the output here...
                      </span>
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Desktop Layout with Resizable Panels */
          <div className="flex-1 flex overflow-hidden">
            {/* Code Editor - Resizable */}
            <div className="flex flex-col min-w-0 resizable-panel" style={{ width: '60%', minWidth: '300px' }}>
              <div className={`p-3 border-b resize-handle ${
                isDarkMode ? 'bg-zinc-800 border-gray-700' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Code Editor
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      Resizable
                    </span>
                    {/* Resize indicator */}
                    <div className={`flex gap-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* User cursors indicators */}
                    {Array.from(userCursors.values()).map((cursor) => (
                      <div
                        key={cursor.userId}
                        className="flex items-center gap-1"
                        title={`${cursor.userName} is editing`}
                      >
                        <div className={`w-2 h-2 rounded-full ${cursor.userColor}`} />
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {cursor.userName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                ref={codeEditorRef}
                value={code}
                onChange={handleCodeChange}
                onSelect={handleCursorMove}
                className={`flex-1 p-4 font-mono resize-none focus:outline-none border-none ${
                  isDarkMode 
                    ? 'bg-zinc-900 text-gray-100' 
                    : 'bg-white text-gray-900'
                }`}
                placeholder="Start coding together..."
                spellCheck={false}
                style={{ lineHeight: '1.6' }}
              />
            </div>

            {/* Resize Handle */}
            <div className={`w-1 cursor-col-resize flex-shrink-0 hover:bg-blue-500 transition-colors ${
              isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'
            }`} 
            onMouseDown={(e) => {
              const startX = e.clientX;
              const leftPanel = e.target.previousElementSibling;
              const startWidth = leftPanel.offsetWidth;
              
              const handleMouseMove = (e) => {
                const newWidth = startWidth + (e.clientX - startX);
                const containerWidth = leftPanel.parentElement.offsetWidth;
                const minWidth = 300;
                const maxWidth = containerWidth - 320; // Account for right panel minimum
                
                if (newWidth >= minWidth && newWidth <= maxWidth) {
                  leftPanel.style.width = `${newWidth}px`;
                }
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
            />

            {/* Sidebar with Resizable Sections */}
            <div className={`flex-1 border-l flex flex-col min-w-0 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`} style={{ minWidth: '320px' }}>
              {/* Code Input Section - Resizable */}
              <div className={`border-b flex flex-col resizable-section ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`} style={{ height: '40%', minHeight: '200px' }}>
                <div className={`p-3 border-b ${
                  isDarkMode ? 'bg-zinc-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <label className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Custom Input
                    </label>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      Resizable
                    </span>
                    {/* Resize indicator */}
                    <div className={`flex gap-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                  </div>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input for your code here..."
                  className={`flex-1 p-3 text-sm resize-none border-none focus:outline-none ${
                    isDarkMode 
                      ? 'bg-zinc-800 text-white placeholder-gray-400' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Horizontal Resize Handle */}
              <div className={`h-1 cursor-row-resize flex-shrink-0 hover:bg-blue-500 transition-colors ${
                isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'
              }`}
              onMouseDown={(e) => {
                const startY = e.clientY;
                const topPanel = e.target.previousElementSibling;
                const startHeight = topPanel.offsetHeight;
                
                const handleMouseMove = (e) => {
                  const newHeight = startHeight + (e.clientY - startY);
                  const containerHeight = topPanel.parentElement.offsetHeight;
                  const minHeight = 200;
                  const maxHeight = containerHeight - 200; // Account for bottom panel minimum
                  
                  if (newHeight >= minHeight && newHeight <= maxHeight) {
                    topPanel.style.height = `${newHeight}px`;
                  }
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              />

              {/* Output Section - Resizable */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className={`p-3 border-b ${
                  isDarkMode ? 'bg-zinc-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Code Output
                      </label>
                      <span className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                      }`}>
                        Resizable
                      </span>
                      {/* Resize indicator */}
                      <div className={`flex gap-1 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                      </div>
                    </div>
                    <button
                      onClick={() => setOutput('')}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        isDarkMode 
                          ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className={`flex-1 p-4 overflow-y-auto min-h-0 ${
                  isDarkMode ? 'bg-zinc-900' : 'bg-white'
                }`}>
                  <pre className={`font-mono text-sm whitespace-pre-wrap ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {output || (
                      <span className={`${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Run your code to see the output here...
                      </span>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isChatOverlayOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop with blur effect */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsChatOverlayOpen(false)}
            />
            
            {/* Chat Container */}
            <motion.div
              className={`relative w-full max-w-4xl h-[80vh] mx-4 rounded-xl shadow-2xl overflow-hidden flex flex-col ${
                isDarkMode ? 'bg-zinc-900 border border-zinc-700' : 'bg-white border border-gray-200'
              }`}
              initial={{ scale: 0.8, opacity: 0, x: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag
              dragMomentum={false}
              dragElastic={0.2}
              dragConstraints={{
                top: -window.innerHeight * 0.3,
                left: -window.innerWidth * 0.3,
                right: window.innerWidth * 0.3,
                bottom: window.innerHeight * 0.3,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-4 border-b cursor-move ${
                isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className={`flex flex-col gap-1 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <div className="w-1 h-1 rounded-full bg-current"></div>
                    <div className="w-1 h-1 rounded-full bg-current"></div>
                    <div className="w-1 h-1 rounded-full bg-current"></div>
                    <div className="w-1 h-1 rounded-full bg-current"></div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveOverlayTab('chat')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeOverlayTab === 'chat'
                          ? isDarkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-zinc-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Chat ({messages.length})
                    </button>
                    <button
                      onClick={() => setActiveOverlayTab('users')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeOverlayTab === 'users'
                          ? isDarkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-zinc-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="w-4 h-4 inline mr-2" />
                      Users ({connectedUsers.length})
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsChatOverlayOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-zinc-700 text-gray-400 hover:text-white' 
                        : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex flex-1 min-h-0">
                {activeOverlayTab === 'chat' ? (
                  /* Chat Section */
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Chat Messages */}
                    <div
                      ref={chatContainerRef}
                      className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                        isDarkMode ? 'bg-zinc-900' : 'bg-white'
                      }`}
                    >
                      {messages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          {message.type !== 'system' && message.type !== 'execution' && (
                            <div className={`w-8 h-8 rounded-full ${message.userColor || 'bg-gray-500'} flex-shrink-0 flex items-center justify-center`}>
                              <span className="text-white text-sm font-bold">
                                {message.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          {message.type === 'execution' && (
                            <div className={`w-8 h-8 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center`}>
                              <Terminal className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {message.type === 'system' ? (
                              <div className={`text-sm italic ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <Terminal className="w-4 h-4 inline mr-1" />
                                {message.content}
                              </div>
                            ) : message.type === 'execution' ? (
                              <div className={`p-3 rounded-lg ${
                                isDarkMode ? 'bg-zinc-700 border border-zinc-600' : 'bg-gray-100 border border-gray-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Terminal className="w-4 h-4 text-green-500" />
                                  <span className={`text-sm font-medium ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                  }`}>
                                    {message.userName} executed code
                                  </span>
                                  <span className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.timestamp)}
                                  </span>
                                  {message.content.executionTime && (
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      isDarkMode ? 'bg-zinc-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {message.content.executionTime}ms
                                    </span>
                                  )}
                                </div>
                                <pre className={`text-sm font-mono whitespace-pre-wrap ${
                                  message.content.status === 'error' 
                                    ? 'text-red-400' 
                                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {message.content.result}
                                </pre>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-medium ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                  }`}>
                                    {message.userName}
                                  </span>
                                  <span className={`text-xs ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.timestamp)}
                                  </span>
                                </div>
                                <div className={`text-sm ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {message.content}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {typingUsers.size > 0 && (
                        <div className={`text-sm italic ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className={`p-4 border-t ${
                      isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode 
                              ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            newMessage.trim()
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : isDarkMode 
                                ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Users Section */
                  <div className="flex-1 flex">
                    {/* Users List */}
                    <div className="w-1/2 flex flex-col">
                      <div className={`flex-1 overflow-y-auto p-6 ${
                        isDarkMode ? 'bg-zinc-900' : 'bg-white'
                      }`}>
                        <h3 className={`text-lg font-semibold mb-6 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Connected Users ({connectedUsers.length})
                        </h3>
                        <div className="grid gap-4">
                          {connectedUsers.map((user) => (
                            <div
                              key={user.socketId}
                              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                                selectedUser?.socketId === user.socketId
                                  ? isDarkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                                  : isDarkMode ? 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                              }`}
                              onClick={() => setSelectedUser(user)}
                            >
                              <div className={`w-12 h-12 rounded-full ${user.color} flex items-center justify-center`}>
                                <span className="text-white text-lg font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium text-lg ${
                                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                }`}>
                                  {user.name}
                                  {user.socketId === currentUser?.id && (
                                    <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                                      isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {user.isActive ? 'Active' : 'Away'}
                                </div>
                              </div>
                              {user.socketId !== currentUser?.id && (
                                <button
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode 
                                      ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                  title="Send private message"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Private Chat Area */}
                    <div className={`w-1/2 border-l flex flex-col ${
                      isDarkMode ? 'border-zinc-700' : 'border-gray-200'
                    }`}>
                      {selectedUser && selectedUser.socketId !== currentUser?.id ? (
                        <>
                          {/* Private Chat Header */}
                          <div className={`p-4 border-b ${
                            isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${selectedUser.color} flex items-center justify-center`}>
                                <span className="text-white text-sm font-bold">
                                  {selectedUser.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className={`font-medium ${
                                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                }`}>
                                  {selectedUser.name}
                                </div>
                                <div className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {selectedUser.isActive ? 'Active' : 'Away'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Private Messages */}
                          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
                            isDarkMode ? 'bg-zinc-900' : 'bg-white'
                          }`}>
                            {(privateMessages.get(selectedUser.socketId) || []).map((msg) => (
                              <div 
                                key={msg.id}
                                className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-xs p-3 rounded-lg ${
                                  msg.type === 'sent'
                                    ? 'bg-blue-500 text-white'
                                    : isDarkMode 
                                      ? 'bg-zinc-700 text-gray-200' 
                                      : 'bg-gray-200 text-gray-900'
                                }`}>
                                  <div className="text-sm">{msg.content}</div>
                                  <div className={`text-xs mt-1 ${
                                    msg.type === 'sent' 
                                      ? 'text-blue-100' 
                                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {formatTime(msg.timestamp)}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {(privateMessages.get(selectedUser.socketId) || []).length === 0 && (
                              <div className={`text-center text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                No messages yet. Start a conversation!
                              </div>
                            )}
                          </div>

                          {/* Private Message Input */}
                          <div className={`p-4 border-t ${
                            isDarkMode ? 'border-zinc-700' : 'border-gray-200'
                          }`}>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={privateMessage}
                                onChange={(e) => setPrivateMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendPrivateMessage(selectedUser)}
                                placeholder={`Message ${selectedUser.name}...`}
                                className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  isDarkMode 
                                    ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                              />
                              <button
                                onClick={() => sendPrivateMessage(selectedUser)}
                                disabled={!privateMessage.trim()}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  privateMessage.trim()
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : isDarkMode 
                                      ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' 
                                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : selectedUser?.socketId === currentUser?.id ? (
                        <div className={`flex-1 flex items-center justify-center ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3" />
                            <p>You can't message yourself!</p>
                          </div>
                        </div>
                      ) : (
                        <div className={`flex-1 flex items-center justify-center ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3" />
                            <p>Select a user to start a private conversation</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollaborativeEditor;
