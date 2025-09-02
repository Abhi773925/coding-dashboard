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
  Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CollaborativeEditor = ({ sessionId, userId, userName, initialRole = 'viewer' }) => {
  const { isDarkMode } = useTheme();
  const [socket, setSocket] = useState(null);
  const [editor, setEditor] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [role, setRole] = useState(initialRole);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [userCursors, setUserCursors] = useState(new Map());
  const [userSelections, setUserSelections] = useState(new Map());
  const [documentContent, setDocumentContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  // New features
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [breakpoints, setBreakpoints] = useState(new Set());
  const [isDebugging, setIsDebugging] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [gitStatus, setGitStatus] = useState(null);
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingData, setRecordingData] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [showSnippets, setShowSnippets] = useState(false);

  const editorRef = useRef(null);
  const updateTimeoutRef = useRef(null);
  const chatRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'https://prepmate-kvol.onrender.com', {
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to collaboration server');
      setIsConnected(true);
      
      // Join the session
      newSocket.emit('join-session', {
        sessionId,
        userId,
        userName,
        role: initialRole
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      setIsConnected(false);
    });

    newSocket.on('session-joined', (data) => {
      console.log('Joined session:', data);
      setUsers(data.users);
      setFiles(data.files || []);
      setRole(data.role);
      setChatMessages(data.chatHistory || []);
      setSessionHistory(data.sessionHistory || []);
      
      // Open the first file if available
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
      setUserCursors(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
      setUserSelections(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
      addSystemMessage(`${data.userName} left the session`);
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

    newSocket.on('file-operation', (data) => {
      setFiles(data.files);
      if (data.operation === 'delete' && activeFile?.name === data.fileName) {
        setActiveFile(null);
      }
      if (data.operation === 'create' && data.file) {
        setActiveFile(data.file);
      }
    });

    newSocket.on('code-execution-result', (data) => {
      setOutput(data.output.stdout || data.output.stderr || 'No output');
      setIsExecuting(false);
      if (data.output.stderr) {
        setErrors(prev => [...prev, { message: data.output.stderr, line: 0, column: 0 }]);
      }
    });

    newSocket.on('terminal-response', (data) => {
      setTerminalOutput(prev => prev + `$ ${data.command}\n${data.output}\n`);
    });

    newSocket.on('chat-message', (data) => {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        userId: data.userId,
        userName: data.userName,
        message: data.message,
        timestamp: new Date(data.timestamp)
      }]);
    });

    newSocket.on('live-preview-update', (data) => {
      setPreviewUrl(data.url);
    });

    newSocket.on('git-status-update', (data) => {
      setGitStatus(data.status);
    });

    newSocket.on('linting-results', (data) => {
      setErrors(data.errors || []);
      setWarnings(data.warnings || []);
      setSuggestions(data.suggestions || []);
    });

    newSocket.on('session-recording', (data) => {
      setRecordingData(prev => [...prev, data]);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      alert(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [sessionId, userId, userName, initialRole]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !activeFile || !editor || !socket) return;

    const saveInterval = setInterval(() => {
      const content = editor.getValue();
      if (content !== documentContent) {
        socket.emit('auto-save', {
          sessionId,
          fileName: activeFile.name,
          content
        });
        setLastSaved(new Date());
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(saveInterval);
  }, [autoSave, activeFile, editor, socket, documentContent, sessionId]);

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

  // Set up simple real-time collaboration without Yjs
  useEffect(() => {
    if (!activeFile || !editor || !socket) return;

    // Request current document state
    socket.emit('yjs-sync', { 
      sessionId, 
      docName: activeFile.name 
    });

    // Listen for document updates from other users
    const handleDocumentUpdate = ({ docName, content }) => {
      if (docName === activeFile.name && content !== editor.getValue()) {
        const position = editor.getPosition();
        editor.setValue(content);
        if (position) {
          editor.setPosition(position);
        }
      }
    };

    // Listen for document state
    const handleDocumentState = ({ docName, content, language: docLanguage }) => {
      if (docName === activeFile.name) {
        setDocumentContent(content || '');
        setLanguage(docLanguage || 'javascript');
        if (content && content !== editor.getValue()) {
          editor.setValue(content);
        }
      }
    };

    socket.on('document-update', handleDocumentUpdate);
    socket.on('document-state', handleDocumentState);

    return () => {
      socket.off('document-update', handleDocumentUpdate);
      socket.off('document-state', handleDocumentState);
    };
  }, [activeFile, editor, socket]);

  const handleEditorChange = useCallback((value) => {
    if (!activeFile || !socket || !value) return;

    // Debounce updates to avoid too many socket emissions
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      socket.emit('yjs-sync', {
        sessionId,
        docName: activeFile.name,
        content: value
      });
    }, 300);
  }, [activeFile, socket, sessionId]);

  const handleEditorDidMount = useCallback((editorInstance) => {
    setEditor(editorInstance);
    editorRef.current = editorInstance;

    // Configure editor
    editorInstance.updateOptions({
      theme: isDarkMode ? 'vs-dark' : 'vs-light',
      fontSize,
      minimap: { enabled: showMinimap },
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      scrollBeyondLastLine: false,
      automaticLayout: true
    });

    // Track cursor position changes
    editorInstance.onDidChangeCursorPosition((e) => {
      if (socket && activeFile) {
        socket.emit('cursor-update', {
          sessionId,
          position: e.position,
          fileName: activeFile.name
        });
      }
    });

    // Track selection changes
    editorInstance.onDidChangeCursorSelection((e) => {
      if (socket && activeFile) {
        socket.emit('selection-update', {
          sessionId,
          selection: e.selection,
          fileName: activeFile.name
        });
      }
    });

    // Add breakpoint support
    editorInstance.onMouseDown((e) => {
      if (e.target.type === 2) { // GUTTER_GLYPH_MARGIN
        const lineNumber = e.target.position.lineNumber;
        toggleBreakpoint(lineNumber);
      }
    });
  }, [socket, sessionId, activeFile, isDarkMode, fontSize, showMinimap]);

  // Enhanced file operations
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

  const renameFile = (oldName) => {
    const newName = prompt('Enter new name:', oldName);
    if (newName && newName !== oldName && socket) {
      socket.emit('file-operation', {
        sessionId,
        operation: 'rename',
        oldName,
        newName
      });
    }
  };

  const downloadFile = (fileName) => {
    if (editor && activeFile?.name === fileName) {
      const content = editor.getValue();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const uploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (socket) {
            socket.emit('file-operation', {
              sessionId,
              operation: 'upload',
              fileName: file.name,
              content: event.target.result,
              type: getFileType(file.name)
            });
          }
        };
        reader.readAsText(file);
      });
    };
    input.click();
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

  const sendTerminalCommand = () => {
    const command = prompt('Enter command:');
    if (command && socket) {
      socket.emit('terminal-command', {
        sessionId,
        command
      });
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('chat-message', {
        sessionId,
        message: newMessage.trim(),
        userId,
        userName,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
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

  const formatCode = () => {
    if (editor && socket) {
      const code = editor.getValue();
      socket.emit('format-code', {
        sessionId,
        code,
        language: activeFile?.type || language,
        fileName: activeFile?.name
      });
    }
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

  const searchInFiles = (term) => {
    if (socket) {
      socket.emit('search-files', {
        sessionId,
        searchTerm: term
      });
    }
  };

  const initGitRepo = () => {
    if (socket) {
      socket.emit('git-operation', {
        sessionId,
        operation: 'init'
      });
    }
  };

  const gitCommit = (message) => {
    if (socket && message) {
      socket.emit('git-operation', {
        sessionId,
        operation: 'commit',
        message
      });
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingData([]);
    if (socket) {
      socket.emit('start-recording', { sessionId });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (socket) {
      socket.emit('stop-recording', { sessionId });
    }
  };

  const saveSnippet = () => {
    if (editor) {
      const selection = editor.getSelection();
      const selectedText = editor.getModel().getValueInRange(selection);
      const name = prompt('Snippet name:');
      if (name && selectedText) {
        const snippet = {
          id: Date.now(),
          name,
          code: selectedText,
          language: activeFile?.type || language,
          createdAt: new Date()
        };
        setSnippets(prev => [...prev, snippet]);
        if (socket) {
          socket.emit('save-snippet', { sessionId, snippet });
        }
      }
    }
  };

  const insertSnippet = (snippet) => {
    if (editor) {
      const position = editor.getPosition();
      editor.executeEdits('insert-snippet', [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: snippet.code
      }]);
    }
  };

  // Utility functions
  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      sql: 'sql',
      php: 'php',
      rb: 'ruby',
      go: 'go',
      rs: 'rust'
    };
    return typeMap[ext] || 'plaintext';
  };

  const getFileTemplate = (type) => {
    const templates = {
      javascript: '// JavaScript file\nconsole.log("Hello, World!");',
      python: '# Python file\nprint("Hello, World!")',
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Document</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '/* CSS file */\nbody {\n  margin: 0;\n  padding: 0;\n}',
      json: '{\n  "name": "example",\n  "version": "1.0.0"\n}'
    };
    return templates[type] || '';
  };

  const canEdit = role === 'owner' || role === 'editor';

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`h-14 border-b flex items-center justify-between px-4 ${
        isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              Session: {sessionId}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {users.length} users
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={executeCode}
            disabled={!canEdit || isExecuting || !activeFile}
            className={`px-3 py-1.5 rounded text-sm font-medium flex items-center space-x-1 ${
              canEdit && activeFile && !isExecuting
                ? 'bg-green-600 hover:bg-green-700 text-slate-300'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {isExecuting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isExecuting ? 'Running...' : 'Run'}</span>
          </button>

          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
          >
            <TerminalIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => {/* Implement share functionality */}}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className={`w-64 border-r flex flex-col ${
          isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Files */}
          <div className="flex-1">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                  Files
                </h3>
                {canEdit && (
                  <button
                    onClick={createNewFile}
                    className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-2 space-y-1">
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    activeFile?.name === file.name
                      ? isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                      : isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFile(file)}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                      {file.name}
                    </span>
                  </div>
                  {canEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Users */}
          <div className={`border-t p-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              Active Users
            </h3>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.role === 'owner' ? 'bg-red-500' :
                    user.role === 'editor' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user.name}
                  </span>
                  <span className={`text-xs px-1 py-0.5 rounded ${
                    user.role === 'owner' ? 'bg-red-100 text-red-800' :
                    user.role === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {activeFile ? (
            <>
              <div className={`h-10 border-b flex items-center px-4 ${
                isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                  {activeFile.name}
                </span>
                {!canEdit && (
                  <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    Read Only
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={activeFile.type || 'javascript'}
                  value={activeFile.content || ''}
                  theme={isDarkMode ? 'vs-dark' : 'light'}
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                  options={{
                    readOnly: !canEdit,
                    fontSize: 14,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                  No file selected
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Create or select a file to start coding
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Output Panel */}
        {(output || showTerminal) && (
          <div className={`w-80 border-l flex flex-col ${
            isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`h-10 border-b flex items-center px-4 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                {showTerminal ? 'Terminal' : 'Output'}
              </span>
            </div>
            
            <div className="flex-1 p-4 overflow-auto">
              {showTerminal ? (
                <div>
                  <div className={`mb-4 p-3 rounded font-mono text-sm ${
                    isDarkMode ? 'bg-zinc-900 text-green-400' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
                  </div>
                  <button
                    onClick={sendTerminalCommand}
                    className="px-3 py-1 bg-blue-600 text-slate-300 rounded text-sm hover:bg-blue-700"
                  >
                    Run Command
                  </button>
                </div>
              ) : (
                <div className={`p-3 rounded font-mono text-sm ${
                  isDarkMode ? 'bg-zinc-900 text-slate-300' : 'bg-gray-100 text-gray-800'
                }`}>
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeEditor;
