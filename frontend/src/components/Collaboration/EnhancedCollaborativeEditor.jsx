import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { 
  Play, 
  Square, 
  Users, 
  Settings, 
  FileText, 
  Folder, 
  Plus,
  Download,
  Upload,
  Share2,
  Eye,
  Edit3,
  Terminal as TerminalIcon,
  MessageCircle,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Save,
  Copy,
  Trash2,
  FolderPlus,
  GitBranch,
  Clock,
  Bug,
  Zap,
  Code,
  Archive,
  Search,
  Monitor,
  Palette,
  RotateCcw,
  History,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  X,
  Send,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelRight,
  Split,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { safeToISOString } from '../../utils/dateUtils';

const EnhancedCollaborativeEditor = ({ sessionId, userId, userName, initialRole = 'viewer' }) => {
  const { isDarkMode } = useTheme();
  
  // Core states
  const [socket, setSocket] = useState(null);
  const [editor, setEditor] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [role, setRole] = useState(initialRole);
  
  // Execution & Terminal
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  
  // Real-time collaboration
  const [userCursors, setUserCursors] = useState(new Map());
  const [userSelections, setUserSelections] = useState(new Map());
  const [documentContent, setDocumentContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  // Chat & Communication
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  
  // File Management
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderStructure, setFolderStructure] = useState({});
  
  // Live Preview
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewMode, setPreviewMode] = useState('side'); // side, bottom, fullscreen
  
  // Development Tools
  const [breakpoints, setBreakpoints] = useState(new Set());
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugVariables, setDebugVariables] = useState({});
  const [callStack, setCallStack] = useState([]);
  
  // Version Control
  const [gitStatus, setGitStatus] = useState(null);
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [gitBranches, setGitBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState('main');
  
  // Code Quality
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showLinting, setShowLinting] = useState(true);
  
  // Session & Recording
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingData, setRecordingData] = useState([]);
  
  // Editor Settings
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editorTheme, setEditorTheme] = useState(isDarkMode ? 'vs-dark' : 'vs-light');
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  
  // Code Snippets & Templates
  const [snippets, setSnippets] = useState([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState([]);
  
  // UI Layout
  const [layout, setLayout] = useState('default'); // default, focus, split
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  
  // Package Management
  const [packages, setPackages] = useState([]);
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [packageSearchTerm, setPackageSearchTerm] = useState('');
  
  const editorRef = useRef(null);
  const updateTimeoutRef = useRef(null);
  const chatRef = useRef(null);
  const terminalRef = useRef(null);

  // Socket connection and event handlers
  useEffect(() => {
    console.log('Initializing Socket.IO connection...');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://prepmate-kvol.onrender.com';
    console.log('Connecting to:', backendUrl);
    
    const newSocket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to collaboration server with ID:', newSocket.id);
      setIsConnected(true);
      
      console.log('Joining session:', { sessionId, userId, userName, role: initialRole });
      newSocket.emit('join-session', {
        sessionId,
        userId,
        userName,
        role: initialRole
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection failed:', error.message);
      console.error('Full error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from collaboration server. Reason:', reason);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection failed:', error.message);
    });

    // Session events
    newSocket.on('session-joined', (data) => {
      setUsers(data.users || []);
      setFiles(data.files || []);
      setRole(data.role);
      setChatMessages(data.chatHistory || []);
      setSessionHistory(data.sessionHistory || []);
      setSnippets(data.snippets || []);
      setPackages(data.packages || []);
      
      if (data.files && data.files.length > 0) {
        setActiveFile(data.files[0]);
      }
    });

    newSocket.on('user-joined', (data) => {
      setUsers(prev => [...prev.filter(u => u.id !== data.user.id), data.user]);
      addSystemMessage(`${data.user.name} joined the session`);
    });

    newSocket.on('user-left', (data) => {
      setUsers(prev => prev.filter(u => u.id !== data.userId));
      addSystemMessage(`${data.userName} left the session`);
    });

    // Real-time collaboration events
    newSocket.on('document-update', ({ docName, content }) => {
      if (docName === activeFile?.name && content !== editor?.getValue()) {
        const position = editor?.getPosition();
        editor?.setValue(content);
        if (position) {
          editor?.setPosition(position);
        }
      }
    });

    newSocket.on('cursor-updated', (data) => {
      if (data.userId !== userId) {
        setUserCursors(prev => new Map(prev).set(data.userId, data.cursor));
      }
    });

    newSocket.on('selection-updated', (data) => {
      if (data.userId !== userId) {
        setUserSelections(prev => new Map(prev).set(data.userId, data.selection));
      }
    });

    // File operations
    newSocket.on('file-operation', (data) => {
      setFiles(data.files);
      if (data.operation === 'delete' && activeFile?.name === data.fileName) {
        setActiveFile(data.files?.[0] || null);
      }
      if (data.operation === 'create' && data.file) {
        setActiveFile(data.file);
      }
    });

    // Code execution
    newSocket.on('code-execution-result', (data) => {
      setOutput(data.output.stdout || data.output.stderr || 'No output');
      setIsExecuting(false);
      
      if (data.output.stderr) {
        setErrors(prev => [...prev, { 
          message: data.output.stderr, 
          line: 0, 
          column: 0, 
          severity: 'error' 
        }]);
      }
      
      if (data.debugInfo) {
        setDebugVariables(data.debugInfo.variables || {});
        setCallStack(data.debugInfo.callStack || []);
      }
    });

    // Terminal
    newSocket.on('terminal-response', (data) => {
      setTerminalOutput(prev => prev + `$ ${data.command}\n${data.output}\n`);
    });

    // Chat
    newSocket.on('chat-message', (data) => {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        userId: data.userId,
        userName: data.userName,
        message: data.message,
        timestamp: new Date(data.timestamp),
        avatar: data.avatar
      }]);
    });

    // Live preview
    newSocket.on('live-preview-update', (data) => {
      setPreviewUrl(data.url);
    });

    // Git operations
    newSocket.on('git-status-update', (data) => {
      setGitStatus(data.status);
      setGitBranches(data.branches || []);
      setCurrentBranch(data.currentBranch || 'main');
    });

    // Code quality
    newSocket.on('linting-results', (data) => {
      setErrors(data.errors || []);
      setWarnings(data.warnings || []);
      setSuggestions(data.suggestions || []);
    });

    // Package management
    newSocket.on('package-installed', (data) => {
      setPackages(prev => [...prev, data.package]);
    });

    newSocket.on('package-removed', (data) => {
      setPackages(prev => prev.filter(p => p.name !== data.packageName));
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      // Show user-friendly error message
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [sessionId, userId, userName, initialRole, activeFile?.name, editor, userId]);

  // Editor setup and configuration
  const handleEditorDidMount = useCallback((editorInstance) => {
    setEditor(editorInstance);
    editorRef.current = editorInstance;

    // Configure editor
    editorInstance.updateOptions({
      theme: editorTheme,
      fontSize,
      minimap: { enabled: showMinimap },
      wordWrap: wordWrap ? 'on' : 'off',
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderWhitespace: 'selection',
      renderControlCharacters: true,
      contextmenu: true,
      mouseWheelZoom: true
    });

    // Real-time collaboration
    editorInstance.onDidChangeCursorPosition((e) => {
      if (socket && activeFile) {
        socket.emit('cursor-update', {
          sessionId,
          userId,
          position: e.position,
          fileName: activeFile.name
        });
      }
    });

    editorInstance.onDidChangeCursorSelection((e) => {
      if (socket && activeFile) {
        socket.emit('selection-update', {
          sessionId,
          userId,
          selection: e.selection,
          fileName: activeFile.name
        });
      }
    });

    // Breakpoint support
    editorInstance.onMouseDown((e) => {
      if (e.target.type === 2) { // GUTTER_GLYPH_MARGIN
        const lineNumber = e.target.position.lineNumber;
        toggleBreakpoint(lineNumber);
      }
    });

  }, [socket, sessionId, activeFile, editorTheme, fontSize, showMinimap, wordWrap, userId]);

  // Document synchronization
  const handleEditorChange = useCallback((value) => {
    if (!activeFile || !socket || !value) return;

    setDocumentContent(value);
    
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      socket.emit('document-update', {
        sessionId,
        docName: activeFile.name,
        content: value,
        userId
      });
    }, 300);
  }, [activeFile, socket, sessionId, userId]);

  // Utility functions
  const addSystemMessage = (message) => {
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      userId: 'system',
      userName: 'System',
      message,
      timestamp: new Date(),
      isSystem: true
    }]);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap = {
      js: '🟨', jsx: '⚛️', ts: '🔷', tsx: '⚛️',
      py: '🐍', java: '☕', cpp: '⚙️', c: '⚙️',
      html: '🌐', css: '🎨', json: '📋', md: '📝',
      sql: '🗃️', php: '🐘', rb: '💎', go: '🐹'
    };
    return iconMap[ext] || '📄';
  };

  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const typeMap = {
      js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
      py: 'python', java: 'java', cpp: 'cpp', c: 'c',
      html: 'html', css: 'css', json: 'json', md: 'markdown',
      sql: 'sql', php: 'php', rb: 'ruby', go: 'go', rs: 'rust'
    };
    return typeMap[ext] || 'plaintext';
  };

  // Core functions
  const createNewFile = () => {
    const fileName = prompt('Enter file name (with extension):');
    if (fileName && socket) {
      const fileType = getFileType(fileName);
      socket.emit('file-operation', {
        sessionId,
        operation: 'create',
        fileName,
        content: getFileTemplate(fileType),
        path: selectedFolder ? `${selectedFolder}/${fileName}` : fileName,
        type: fileType
      });
    }
  };

  const createNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && socket) {
      socket.emit('file-operation', {
        sessionId,
        operation: 'create-folder',
        folderName,
        path: selectedFolder ? `${selectedFolder}/${folderName}` : folderName
      });
    }
  };

  const deleteFile = (fileName) => {
    if (confirm(`Delete ${fileName}?`) && socket) {
      socket.emit('file-operation', {
        sessionId,
        operation: 'delete',
        fileName
      });
    }
  };

  const executeCode = () => {
    if (!activeFile || !editor || !socket) return;
    
    setIsExecuting(true);
    const code = editor.getValue();
    
    socket.emit('execute-code', {
      sessionId,
      code,
      language: activeFile.type || language,
      fileName: activeFile.name,
      withDebug: isDebugging,
      breakpoints: Array.from(breakpoints)
    });
  };

  const sendChatMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('chat-message', {
        sessionId,
        message: newMessage.trim(),
        userId,
        userName,
        timestamp: safeToISOString(new Date())
      });
      setNewMessage('');
    }
  };

  const sendTerminalCommand = () => {
    if (terminalInput.trim() && socket) {
      socket.emit('terminal-command', {
        sessionId,
        command: terminalInput.trim()
      });
      setTerminalInput('');
    }
  };

  const toggleBreakpoint = (lineNumber) => {
    setBreakpoints(prev => {
      const newBreakpoints = new Set(prev);
      if (newBreakpoints.has(lineNumber)) {
        newBreakpoints.delete(lineNumber);
      } else {
        newBreakpoints.add(lineNumber);
      }
      
      if (socket) {
        socket.emit('breakpoint-update', {
          sessionId,
          fileName: activeFile?.name,
          breakpoints: Array.from(newBreakpoints)
        });
      }
      
      return newBreakpoints;
    });
  };

  const saveFile = () => {
    if (editor && activeFile && socket) {
      const content = editor.getValue();
      socket.emit('save-file', {
        sessionId,
        fileName: activeFile.name,
        content
      });
      setLastSaved(new Date());
    }
  };

  const getFileTemplate = (type) => {
    const templates = {
      javascript: 'console.log("Hello, World!");',
      python: 'print("Hello, World!")',
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Document</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>',
      css: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}',
      json: '{\n  "name": "example",\n  "version": "1.0.0"\n}'
    };
    return templates[type] || '';
  };

  const canEdit = role === 'owner' || role === 'editor';

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`h-12 border-b flex items-center justify-between px-4 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">Session: {sessionId}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{users.length} users</span>
          </div>

          {lastSaved && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick actions */}
          <button
            onClick={saveFile}
            disabled={!canEdit || !activeFile}
            className={`p-2 rounded text-sm font-medium flex items-center space-x-1 ${
              canEdit && activeFile
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>

          <button
            onClick={executeCode}
            disabled={!canEdit || isExecuting || !activeFile}
            className={`p-2 rounded text-sm font-medium flex items-center space-x-1 ${
              canEdit && activeFile && !isExecuting
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            title="Run Code (Ctrl+Enter)"
          >
            {isExecuting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded ${showChat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            title="Toggle Chat"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`p-2 rounded ${showLivePreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            title="Toggle Live Preview"
          >
            <Monitor className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className={`w-64 border-r flex flex-col ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            {/* File Explorer */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Files</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={createNewFile}
                      disabled={!canEdit}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                      title="New File"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={createNewFolder}
                      disabled={!canEdit}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                      title="New Folder"
                    >
                      <FolderPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-200 ${
                        activeFile?.name === file.name ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => setActiveFile(file)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{getFileIcon(file.name)}</span>
                        <span className="text-sm">{file.name}</span>
                      </div>
                      {canEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.name);
                          }}
                          className="p-1 rounded hover:bg-red-200 text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Panel */}
            <div className={`border-t p-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="font-semibold mb-2">Online Users</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.id === userId ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm">{user.name}</span>
                    <span className={`text-xs px-1 rounded ${
                      user.role === 'owner' ? 'bg-yellow-200 text-yellow-800' :
                      user.role === 'editor' ? 'bg-green-200 text-green-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1 relative">
            {activeFile ? (
              <Editor
                height="100%"
                defaultLanguage={getFileType(activeFile.name)}
                value={documentContent}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme={editorTheme}
                options={{
                  readOnly: !canEdit,
                  fontSize,
                  minimap: { enabled: showMinimap },
                  wordWrap: wordWrap ? 'on' : 'off',
                  lineNumbers: 'on'
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No file selected</h3>
                  <p className="text-gray-500">Select a file from the sidebar or create a new one</p>
                </div>
              </div>
            )}

            {/* Code Quality Indicators */}
            {showLinting && (errors.length > 0 || warnings.length > 0) && (
              <div className="absolute top-4 right-4 space-y-1">
                {errors.length > 0 && (
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{errors.length} errors</span>
                  </div>
                )}
                {warnings.length > 0 && (
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{warnings.length} warnings</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className={`h-64 border-t ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-black border-gray-200'}`}>
              <div className="flex items-center justify-between p-2 bg-gray-800 text-white">
                <span className="font-semibold">Terminal</span>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 text-green-400 font-mono text-sm overflow-y-auto h-48">
                <pre>{terminalOutput}</pre>
                <div className="flex items-center mt-2">
                  <span className="text-blue-400">$ </span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendTerminalCommand()}
                    className="bg-transparent border-none outline-none flex-1 ml-2 text-green-400"
                    placeholder="Enter command..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Output Panel */}
          {output && (
            <div className={`h-32 border-t p-4 overflow-y-auto ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Output</span>
                <button
                  onClick={() => setOutput('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <pre className="text-sm font-mono">{output}</pre>
            </div>
          )}
        </div>

        {/* Right Panel */}
        {!rightPanelCollapsed && (
          <div className={`w-80 border-l flex flex-col ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            {/* Tab Headers */}
            <div className="flex border-b">
              <button
                onClick={() => setShowChat(true)}
                className={`flex-1 p-2 text-sm ${showChat ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
              >
                <MessageCircle className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setShowLivePreview(true)}
                className={`flex-1 p-2 text-sm ${showLivePreview ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
              >
                <Monitor className="w-4 h-4 mx-auto" />
              </button>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`${msg.isSystem ? 'text-center text-gray-500 text-sm' : ''}`}>
                      {!msg.isSystem && (
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                            {msg.userName[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-sm">{msg.userName}</span>
                              <span className="text-xs text-gray-500">
                                {msg.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm">{msg.message}</div>
                          </div>
                        </div>
                      )}
                      {msg.isSystem && <div>{msg.message}</div>}
                    </div>
                  ))}
                </div>
                <div className="border-t p-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!newMessage.trim()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview Panel */}
            {showLivePreview && (
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Live Preview</span>
                    <button
                      onClick={() => window.open(previewUrl, '_blank')}
                      className="text-blue-600 hover:text-blue-800"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  {previewUrl ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-none"
                      title="Live Preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Monitor className="w-12 h-12 mx-auto mb-2" />
                        <p>No preview available</p>
                        <p className="text-sm">Run your code to see live preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-96 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editor Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Theme</label>
                <select
                  value={editorTheme}
                  onChange={(e) => setEditorTheme(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="vs-light">Light</option>
                  <option value="vs-dark">Dark</option>
                  <option value="hc-black">High Contrast</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{fontSize}px</span>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Minimap</label>
                <input
                  type="checkbox"
                  checked={showMinimap}
                  onChange={(e) => setShowMinimap(e.target.checked)}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Word Wrap</label>
                <input
                  type="checkbox"
                  checked={wordWrap}
                  onChange={(e) => setWordWrap(e.target.checked)}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Save</label>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className={`h-6 border-t flex items-center justify-between px-4 text-xs ${
        isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
      }`}>
        <div className="flex items-center space-x-4">
          <span>{activeFile ? `${getFileType(activeFile.name)} • ${activeFile.name}` : 'No file'}</span>
          {errors.length > 0 && (
            <span className="text-red-500">{errors.length} errors</span>
          )}
          {warnings.length > 0 && (
            <span className="text-yellow-500">{warnings.length} warnings</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span>Line 1, Column 1</span>
          <span>UTF-8</span>
          <span>{role}</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCollaborativeEditor;
