import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Editor } from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { 
  Play, 
  Save, 
  Copy, 
  Download, 
  Users, 
  Upload,
  Search,
  X,
  Terminal,
  ChevronRight,
  ChevronDown,
  Star,
  Rocket,
  Sun,
  Moon,
  Code2,
  Layout,
  FileText,
  Folder,
  Plus
} from 'lucide-react';
import axios from 'axios';
import config from '../../config/api';
import { useTheme } from '../context/ThemeContext';
import FloatingElement from './FloatingElement';

const judge0Languages = [
  { id: 63, name: "JavaScript (Node.js)", default: 'console.log("Hello from Node.js!");', icon: "🟨", ext: "js" },
  { id: 74, name: "TypeScript", default: 'console.log("Hello from TypeScript!");', icon: "🔷", ext: "ts" },
  { id: 71, name: "Python 3", default: 'print("Hello from Python!")', icon: "🐍", ext: "py" },
  {
    id: 62,
    name: "Java",
    default:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}',
    icon: "☕",
    ext: "java",
  },
  {
    id: 54,
    name: "C++",
    default: '#include <iostream>\nint main() {\n    std::cout << "Hello from C++" << std::endl;\n    return 0;\n}',
    icon: "⚡",
    ext: "cpp",
  },
  {
    id: 50,
    name: "C",
    default: '#include <stdio.h>\nint main() {\n    printf("Hello from C!");\n    return 0;\n}',
    icon: "🔧",
    ext: "c",
  },
  { id: 78, name: "Kotlin", default: 'fun main() {\n    println("Hello from Kotlin!")\n}', icon: "🎯", ext: "kt" },
  { id: 73, name: "Rust", default: 'fn main() {\n    println!("Hello from Rust!");\n}', icon: "🦀", ext: "rs" },
  { id: 68, name: "PHP", default: '<?php\necho "Hello from PHP!";', icon: "🐘", ext: "php" },
  {
    id: 60,
    name: "Go",
    default: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}',
    icon: "🐹",
    ext: "go",
  },
];

const getLanguageByExtension = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const lang = judge0Languages.find((l) => l.ext === ext);
  if (lang) {
    return { ...lang, type: "language" };
  }
  return { id: null, name: "Plain Text", default: "", icon: "📄", ext: "txt" };
};

// Monaco Editor language mapping
const getMonacoLanguage = (ext) => {
  const languageMap = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'kt': 'kotlin',
    'rs': 'rust',
    'php': 'php',
    'go': 'go',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'txt': 'plaintext'
  };
  
  return languageMap[ext?.toLowerCase()] || 'plaintext';
};

const CollaborativeCodeCompiler = ({ sessionId: propSessionId }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Basic states
  const [code, setCode] = useState(judge0Languages[0].default);
  const [output, setOutput] = useState('');
  const [stdin, setStdin] = useState('');
  const [selectedLang, setSelectedLang] = useState(judge0Languages[0]);
  const [filename, setFilename] = useState('code');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionDetails, setExecutionDetails] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // CodeCompiler features
  const [activeTab, setActiveTab] = useState("backend");
  const [selectedFrontend, setSelectedFrontend] = useState("React");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalCommand, setTerminalCommand] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState("/");
  const [projectRoot, setProjectRoot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openFolders, setOpenFolders] = useState({ 
    frontend: true, 
    backend: true, 
    uploaded: true, 
    root: true, 
    savedCode: true 
  });
  const [openTabs, setOpenTabs] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false);

  // Collaboration states
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(propSessionId || '');
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [role, setRole] = useState('viewer');

  // Refs
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch saved code snippets from database
  const fetchSavedSnippets = useCallback(async () => {
    setIsLoadingSnippets(true);
    try {
      const userId = localStorage.getItem('userEmail');
      if (!userId) {
        console.log('No user email found in localStorage');
        setSavedSnippets([]);
        return;
      }
      
      const response = await axios.get(`${config.API_URL}/code/snippets/${userId}`);
      console.log('Response data:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setSavedSnippets(response.data);
      } else if (response.data && response.data.snippets && Array.isArray(response.data.snippets)) {
        setSavedSnippets(response.data.snippets);
      } else {
        console.error('Received non-array data:', response.data);
        setSavedSnippets([]);
      }
    } catch (error) {
      console.error('Error fetching saved snippets:', error);
      setSavedSnippets([]);
    } finally {
      setIsLoadingSnippets(false);
    }
  }, []);

  // Load on component mount
  useEffect(() => {
    fetchSavedSnippets();
  }, [fetchSavedSnippets]);

  // Socket.IO connection
  useEffect(() => {
    if (!sessionId) return;

    const SOCKET_URL = config.SOCKET_URL;
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      setIsConnected(true);
      const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
      const userName = localStorage.getItem('userName') || `User ${Date.now().toString().slice(-4)}`;
      
      newSocket.emit('join-session', {
        sessionId,
        userId,
        userName
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('session-joined', (data) => {
      setUsers(data.users);
      setRole(data.role);
      if (data.code) {
        setCode(data.code);
      }
    });

    newSocket.on('code-change', (data) => {
      if (editorRef.current) {
        editorRef.current.setValue(data.code);
      }
      setCode(data.code);
    });

    newSocket.on('users-updated', (data) => {
      setUsers(data.users);
    });

    newSocket.on('code-execution-result', (data) => {
      setOutput(data.output.stdout || data.output.stderr || 'No output');
      setIsExecuting(false);
      setExecutionDetails(data.details);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  // Editor change handler
  const handleEditorChange = useCallback((value) => {
    setCode(value || '');
    if (socket && sessionId) {
      socket.emit('code-change', {
        sessionId,
        code: value || ''
      });
    }
  }, [socket, sessionId]);

  // Editor mount handler
  const handleEditorDidMount = useCallback((editorInstance) => {
    editorRef.current = editorInstance;
  }, []);

  // Execute code function - Using CodeCompiler's working approach
  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      setOutput('No code to execute');
      return;
    }
    
    setIsExecuting(true);
    setLoading(true);
    setIsRunning(true);
    setOutput("🚀 Running...");
    setExecutionDetails(null);
    
    try {
      if (socket && sessionId && role !== 'viewer') {
        // Use collaborative execution
        socket.emit('execute-code', {
          sessionId,
          code,
          language: selectedLang.name,
          languageId: selectedLang.id,
          stdin: stdin || ''
        });
      } else {
        // Direct Judge0 API execution (working from CodeCompiler)
        console.log('Executing code with Judge0 API');
        
        const { data } = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            language_id: selectedLang.id,
            source_code: code,
            stdin: stdin,
            cpu_time_limit: 5,
            memory_limit: 512000,
          },
          {
            params: { base64_encoded: "false", wait: "true" },
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": "af4a1574a2msh2682c4dc719c971p122eb1jsn51b3589532bf",
              "Content-Type": "application/json",
            },
          },
        );

        const result = data.stdout || data.stderr || data.compile_output || "No output";
        setOutput(result);
        setExecutionDetails({
          status: data.status?.description || "Unknown",
          time: data.time || "0",
          memory: Math.round((data.memory || 0) / 1024),
          compile_output: data.compile_output,
          stderr: data.stderr,
        });
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput("Error: " + error.message);
      setExecutionDetails(null);
    } finally {
      setIsExecuting(false);
      setLoading(false);
      setIsRunning(false);
    }
  }, [code, selectedLang, stdin, socket, sessionId, role]);

  // Copy code function
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  // Upload files function
  const uploadFiles = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newUploadedFiles = [];
    let filesProcessed = 0;
    let isCodeProject = false;
    let projectDirectory = null;
    let packageJson = null;

    // First pass: detect project type and find package.json
    files.forEach((file) => {
      const path = file.webkitRelativePath || file.name;
      const isPackageJson = file.name === 'package.json';
      const isReactFile = file.name.endsWith('.jsx') || file.name.endsWith('.tsx') || file.name.endsWith('.js');
      
      if (isPackageJson) {
        packageJson = file;
        projectDirectory = path.split('/')[0];
      }
      
      // Check if it's a React project
      if (isReactFile || isPackageJson) {
        isCodeProject = true;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const detectedLang = getLanguageByExtension(file.name);
        const relativePath = file.webkitRelativePath || file.name;
        
        // Determine file type and prepare for editor
        const fileType = (() => {
          if (isCodeProject) {
            if (file.name === 'package.json') return 'config';
            if (file.name.endsWith('.jsx') || file.name.endsWith('.tsx') ||
                 file.name.endsWith('.js') || file.name.endsWith('.ts')) return 'framework';
            if (file.name.endsWith('.css') || file.name.endsWith('.scss')) return 'style';
            if (file.name.endsWith('.html')) return 'framework';
            if (file.name.endsWith('.json')) return 'config';
            return 'framework'; // All files in React project should be editable
          }
          return 'uploaded';
        })();

        const uploadedFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          path: relativePath,
          content,
          type: fileType,
          size: file.size,
          lastModified: new Date(file.lastModified),
          data: {
            ...detectedLang,
            isCodeProject,
            projectDirectory,
            stackblitzUrl: isCodeProject ? "https://stackblitz.com/edit/react-ts?embed=1&file=src/App.tsx" : null
          }
        };
        
        newUploadedFiles.push(uploadedFile);

        filesProcessed++;
        if (filesProcessed === files.length) {
          setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
        }
      };
      reader.readAsText(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Open file function
  const openFile = useCallback((file, type) => {
    console.log('Opening file:', file, 'Type:', type);
    
    if (type === 'language') {
      // Switch to a programming language
      setSelectedLang(file);
      setCode(file.default);
      setFilename('code');
    } else if (type === 'uploaded' || type === 'saved') {
      // Open an uploaded or saved file
      setCode(file.content || file.code || '');
      setFilename(file.name || file.filename || 'untitled');
      
      // Try to detect language from file extension
      const detectedLang = getLanguageByExtension(file.name || file.filename || '');
      if (detectedLang.id) {
        setSelectedLang(detectedLang);
      } else {
        // Fallback to JavaScript if no language detected
        setSelectedLang(judge0Languages[0]);
      }
    }
    
    // Update active file
    setActiveFile({ ...file, type });
    
    // Add to open tabs if not already open
    const existingTab = openTabs.find(tab => 
      tab.data.id === file.id || 
      (tab.data.name === file.name && tab.type === type)
    );
    
    if (!existingTab) {
      setOpenTabs(prev => [...prev, { data: file, type, id: file.id || Date.now() }]);
    }
  }, [openTabs]);

  // Close tab function
  const closeTab = useCallback((tabId) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    // If closing active tab, switch to another tab or clear
    const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
    if (remainingTabs.length > 0) {
      const newActiveTab = remainingTabs[remainingTabs.length - 1];
      openFile(newActiveTab.data, newActiveTab.type);
    } else {
      setActiveFile(null);
      setCode(selectedLang.default);
      setFilename('code');
    }
  }, [openTabs, openFile, selectedLang]);

  // Delete file function
  const deleteFile = useCallback((fileId, type) => {
    if (type === 'uploaded') {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    }
    // Close tab if open
    const tabToClose = openTabs.find(tab => tab.data.id === fileId);
    if (tabToClose) {
      closeTab(tabToClose.id);
    }
  }, [openTabs, closeTab]);

  // Toggle folder function
  const toggleFolder = useCallback((folderName) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  }, []);

  // Clear uploaded files function
  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([])
    // Close any open tabs that were uploaded files
    setOpenTabs((prev) => prev.filter((tab) => tab.type !== "uploaded"))
    setActiveFile(null) // Reset active file if it was an uploaded one
  }, [])

  // Execute terminal command function (from CodeCompiler)
  const executeTerminalCommand = useCallback(async (command) => {
    setTerminalOutput((prev) => prev + "\n$ " + command)
    
    // Handle npm/yarn commands
    if (command.startsWith("npm ") || command.startsWith("yarn ")) {
      setTerminalOutput((prev) => prev + "\nExecuting package manager command...")
      // Here we would integrate with actual package manager
      setTerminalOutput((prev) => prev + "\nPackage manager command executed successfully")
    }
    
    // Handle cd command
    if (command.startsWith("cd ")) {
      const newPath = command.slice(3)
      setCurrentDirectory(newPath)
      setTerminalOutput((prev) => prev + "\nChanged directory to: " + newPath)
    }
    
    // Handle ls/dir command
    if (command === "ls" || command === "dir") {
      const files = uploadedFiles.map(f => f.name).join("\n")
      setTerminalOutput((prev) => prev + "\n" + files)
    }
    
    // Handle clear command
    if (command === "clear") {
      setTerminalOutput("")
    }
    
    setTerminalCommand("")
  }, [uploadedFiles])

  // Run terminal command function (wrapper for executeTerminalCommand)
  const runTerminalCommand = useCallback(async () => {
    if (!terminalCommand.trim()) return;
    await executeTerminalCommand(terminalCommand);
  }, [terminalCommand, executeTerminalCommand]);

  // Load saved snippet function
  const loadSavedSnippet = useCallback(async (snippet) => {
    try {
      setCode(snippet.code);
      setFilename(snippet.filename);
      
      // Find matching language
      const lang = judge0Languages.find(l => l.name === snippet.language);
      if (lang) {
        setSelectedLang(lang);
      }
      
      setSaveStatus('Code loaded successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error loading snippet:', error);
      setSaveStatus('Error loading snippet');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, []);

  // Filter function for search
  const filterItems = useCallback((items, query) => {
    if (!query) return items;
    return items.filter(item => 
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.filename?.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  // Save code function - Enhanced like original CodeCompiler
  const saveCode = useCallback(async () => {
    try {
      if (!code.trim()) {
        setSaveStatus('Cannot save empty code');
        setTimeout(() => setSaveStatus(''), 3000);
        return;
      }

      let saveFilename = filename;
      if (!saveFilename || saveFilename === 'code') {
        saveFilename = prompt('Enter filename:') || `${selectedLang.name.toLowerCase()}_${Date.now()}`;
      }

      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      
      if (!userEmail || !userName) {
        setSaveStatus('Please log in to save code');
        setTimeout(() => setSaveStatus(''), 3000);
        return;
      }

      const response = await axios.post(`${config.API_URL}/code/save`, {
        filename: saveFilename,
        code,
        language: selectedLang.name,
        userEmail,
        userName
      });

      if (response.data.success) {
        setSaveStatus('Code saved successfully!');
        setFilename(saveFilename);
        // Refresh saved snippets
        fetchSavedSnippets();
      } else {
        setSaveStatus('Failed to save code');
      }
    } catch (error) {
      console.error('Error saving code:', error);
      setSaveStatus(error.response?.data?.error || 'Error saving code');
    } finally {
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [code, filename, selectedLang, fetchSavedSnippets]);

  // Download code function
  const downloadCode = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.${selectedLang.ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [code, filename, selectedLang]);

  // File structure for sidebar (from CodeCompiler)
  const fileStructure = useMemo(
    () => ({
      savedCode: {
        name: "Saved Code",
        icon: Save,
        files: isLoadingSnippets ? [{
          name: "Loading...",
          type: "loading",
          icon: "⏳",
          data: { isLoading: true }
        }] : savedSnippets.map((snippet) => ({
          name: snippet.filename,
          type: "saved",
          icon: "📄",
          data: snippet.type === "loading" ? { isLoading: true } : {
            ...snippet,
            id: snippet._id,
            code: snippet.code,
            language: snippet.language
          },
        })),
      },
      backend: {
        name: "Backend Languages",
        icon: Code2,
        files: judge0Languages.map((lang) => ({
          name: lang.name,
          type: "language",
          icon: lang.icon,
          data: lang,
        })),
      },
      ...(uploadedFiles.length > 0 && {
        uploaded: {
          name: "Uploaded Files",
          icon: Upload,
          files: uploadedFiles.map((file) => ({
            name: file.name,
            type: file.type || "uploaded",
            icon: "📄",
            data: file,
          })),
        },
      }),
    }),
    [savedSnippets, isLoadingSnippets, uploadedFiles]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveCode();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        executeCode();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        downloadCode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveCode, executeCode, downloadCode]);

  const canEdit = role === 'owner' || role === 'editor';

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Top Toolbar - Enhanced like original CodeCompiler */}
      <div className={`h-14 border-b flex items-center justify-between px-4 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Layout className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <select
            value={selectedLang.name}
            onChange={(e) => {
              const lang = judge0Languages.find(l => l.name === e.target.value);
              setSelectedLang(lang);
              setCode(lang.default);
            }}
            className={`px-3 py-2 rounded border min-w-48 ${
              isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            {judge0Languages.map((lang) => (
              <option key={lang.id} value={lang.name}>
                {lang.icon} {lang.name}
              </option>
            ))}
          </select>

          {/* Filename Input */}
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename..."
            className={`px-3 py-2 rounded border w-48 ${
              isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>

          {/* Run Button */}
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className={`px-4 py-2 rounded flex items-center space-x-2 font-medium ${
              !isExecuting
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>

          {/* Save Button */}
          <button
            onClick={saveCode}
            disabled={!code.trim()}
            className={`px-4 py-2 rounded flex items-center space-x-2 font-medium ${
              code.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={copyCode}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              copied
                ? 'bg-green-600 text-white'
                : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={downloadCode}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          {/* Terminal Button */}
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded ${
              showTerminal
                ? 'bg-blue-600 text-white'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadFiles}
        multiple
        style={{ display: 'none' }}
        accept=".js,.ts,.py,.java,.cpp,.c,.kt,.rs,.php,.go,.txt,.md,.json,.html,.css"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        {sidebarOpen && (
          <div className={`w-80 border-r flex flex-col ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded border text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* File Explorer */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Language Templates */}
              <div>
                <button
                  onClick={() => toggleFolder('backend')}
                  className="flex items-center space-x-2 text-left w-full mb-2"
                >
                  <div className="text-gray-400">
                    {openFolders.backend ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Language Templates</span>
                </button>
                {openFolders.backend && (
                  <div className="ml-6 space-y-1">
                    {filterItems(judge0Languages, searchQuery).map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => openFile(lang, 'language')}
                        className={`flex items-center space-x-2 text-sm w-full text-left p-2 rounded hover:bg-opacity-10 hover:bg-blue-500 ${
                          selectedLang.id === lang.id ? 'bg-blue-500 bg-opacity-20' : ''
                        }`}
                      >
                        <span>{lang.icon}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploaded Files */}
              <div>
                <button
                  onClick={() => toggleFolder('uploaded')}
                  className="flex items-center space-x-2 text-left w-full mb-2"
                >
                  <div className="text-gray-400">
                    {openFolders.uploaded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <Folder className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">Uploaded Files ({uploadedFiles.length})</span>
                </button>
                {openFolders.uploaded && (
                  <div className="ml-6 space-y-1">
                    {filterItems(uploadedFiles, searchQuery).map((file) => (
                      <div key={file.id} className="flex items-center justify-between group">
                        <button
                          onClick={() => openFile(file, 'uploaded')}
                          className={`flex items-center space-x-2 text-sm flex-1 text-left p-2 rounded hover:bg-opacity-10 hover:bg-blue-500 ${
                            activeFile?.id === file.id ? 'bg-blue-500 bg-opacity-20' : ''
                          }`}
                        >
                          <FileText className="w-3 h-3" />
                          <span className="truncate">{file.name}</span>
                        </button>
                        <button
                          onClick={() => deleteFile(file.id, 'uploaded')}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Code Snippets */}
              <div>
                <button
                  onClick={() => toggleFolder('savedCode')}
                  className="flex items-center space-x-2 text-left w-full mb-2"
                >
                  <div className="text-gray-400">
                    {openFolders.savedCode ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <Folder className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold">Saved Code ({savedSnippets?.length || 0})</span>
                </button>
                {openFolders.savedCode && (
                  <div className="ml-6 space-y-1">
                    {(savedSnippets?.length === 0 || !savedSnippets) ? (
                      <div className="text-sm text-gray-500">Loading...</div>
                    ) : (
                      filterItems(savedSnippets || [], searchQuery).map((snippet) => (
                        <button
                          key={snippet._id}
                          onClick={() => loadSavedSnippet(snippet)}
                          className="flex items-center space-x-2 text-sm w-full text-left p-2 rounded hover:bg-opacity-10 hover:bg-blue-500"
                        >
                          <Star className="w-3 h-3 text-yellow-500" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{snippet.filename}</div>
                            <div className="text-xs text-gray-500">{snippet.language}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Collaboration Info */}
              {sessionId && (
                <div>
                  <button
                    onClick={() => toggleFolder('collaboration')}
                    className="flex items-center space-x-2 text-left w-full mb-2"
                  >
                    <div className="text-gray-400">
                      {openFolders.collaboration ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold">Collaboration ({users?.length || 0})</span>
                  </button>
                  {openFolders.collaboration && (
                    <div className="ml-6 space-y-2">
                      <div className="text-xs text-gray-500">Session: {sessionId}</div>
                      <div className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {isConnected ? 'Connected' : 'Disconnected'}
                      </div>
                      <div className="space-y-1">
                        {(users || []).map((user) => (
                          <div key={user.id} className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="flex-1">{user.name}</span>
                            <span className={`text-xs px-1 py-0.5 rounded ${
                              user.role === 'owner' ? 'bg-yellow-200 text-yellow-800' :
                              user.role === 'editor' ? 'bg-blue-200 text-blue-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          {openTabs.length > 0 && (
            <div className={`border-b flex overflow-x-auto ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              {openTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-2 px-4 py-2 border-r cursor-pointer hover:bg-opacity-10 hover:bg-blue-500 ${
                    activeFile?.id === tab.data.id 
                      ? isDarkMode ? 'bg-gray-700' : 'bg-white'
                      : ''
                  }`}
                  onClick={() => openFile(tab.data, tab.type)}
                >
                  <FileText className="w-3 h-3" />
                  <span className="text-sm truncate max-w-32">
                    {tab.data.name || tab.data.filename || 'Untitled'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Editor and Right Panel Container */}
          <div className="flex-1 flex">
            {/* Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage={getMonacoLanguage(selectedLang.ext)}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme={isDarkMode ? "vs-dark" : "vs"}
                options={{
                  readOnly: !canEdit,
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>

            {/* Right Panel - Input and Output */}
            <div className={`w-96 border-l flex flex-col ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              {/* Input Section */}
              <div className="h-1/2 border-b border-gray-700">
                <div className={`h-10 border-b flex items-center justify-between px-4 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
                }`}>
                  <span className="text-sm font-medium">📥 Input Terminal</span>
                  <div className="flex items-center gap-2">
                    {stdin && stdin.length > 0 && (
                      <span className="text-xs text-green-400">
                        {stdin.split('\n').length} lines
                      </span>
                    )}
                    {stdin && stdin.length > 0 && (
                      <button
                        onClick={() => setStdin('')}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        title="Clear input"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program (if required)..."
                    className={`w-full h-full p-3 border rounded resize-none font-mono text-sm ${
                      isDarkMode 
                        ? 'bg-gray-900 text-white border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>

              {/* Output Section */}
              <div className="h-1/2">
                <div className={`h-10 border-b flex items-center justify-between px-4 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Code2 className="w-4 h-4" />
                    <span className="text-sm font-medium">📤 Output Terminal</span>
                    {isExecuting && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                        <span className="text-xs text-blue-400">Running...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(output)}
                      className={`text-gray-400 transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-600'}`}
                      title="Copy output"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setOutput('');
                        setExecutionDetails(null);
                      }}
                      className={`text-gray-400 transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-600'}`}
                      title="Clear output"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <pre className={`font-mono text-sm whitespace-pre-wrap ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {output || 'Run your code to see output here...'}
                  </pre>
                  
                  {/* Execution Details */}
                  {executionDetails && (
                    <div className={`mt-4 p-3 border rounded ${
                      isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-100 border-gray-300'
                    }`}>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          executionDetails.status === 'Accepted' ? 'bg-green-600' : 'bg-red-600'
                        } text-white`}>
                          {executionDetails.status}
                        </span>
                        <span className="text-gray-400">
                          Time: {executionDetails.time}ms
                        </span>
                        <span className="text-gray-400">
                          Memory: {executionDetails.memory}KB
                        </span>
                      </div>
                      
                      {executionDetails.stderr && (
                        <div className="mt-2">
                          <div className="text-red-300 font-semibold text-xs mb-1">Error:</div>
                          <pre className="text-red-200 text-xs whitespace-pre-wrap">
                            {executionDetails.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      {showTerminal && (
        <div className={`h-64 border-t ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-black border-gray-200'
        }`}>
          <div className="flex items-center justify-between p-2 bg-gray-800 text-white">
            <span className="font-semibold">Terminal - {currentDirectory}</span>
            <button
              onClick={() => setShowTerminal(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 text-green-400 font-mono text-sm overflow-y-auto h-48">
            <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
            <div className="flex items-center mt-2">
              <span className="text-blue-400">$ </span>
              <input
                type="text"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && runTerminalCommand()}
                className="bg-transparent border-none outline-none flex-1 ml-2 text-green-400"
                placeholder="Enter command..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className={`h-6 border-t flex items-center justify-between px-4 text-xs ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <span>{selectedLang.name}</span>
          <span>{filename}.{selectedLang.ext}</span>
          {sessionId && (
            <>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Session: {sessionId}</span>
              <span>{users?.length || 0} users</span>
            </>
          )}
        </div>
        
        <div className="text-gray-400">
          {saveStatus && <span>{saveStatus}</span>}
        </div>
      </div>

      {/* Floating Elements */}
      <FloatingElement />
    </div>
  );
};

export default CollaborativeCodeCompiler;
