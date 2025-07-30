"use client"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Download, Copy, Play, Code2, Layout, Search, X, Terminal, ChevronRight, ChevronDown, Users, Star, Rocket, Sun, Moon, Upload, Code, Save } from 'lucide-react'
import axios from "axios"
import FloatingElement from "./FloatingElement"
import { useTheme } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom"

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
    default: '#include <iostream>\nint main() {\n    std::cout << "Hello from C++";\n    return 0;\n}',
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
]

const getLanguageByExtension = (filename) => {
  const ext = filename.split(".").pop()
  const lang = judge0Languages.find((l) => l.ext === ext)
  if (lang) {
    return { ...lang, type: "language" } // Mark as language type
  }
  // Default for other files, or handle as plain text
  return { id: null, name: "Plain Text", default: "", icon: "📄", ext: "txt" }
}

const ModernCodeCompiler = () => {
  const { isDarkMode, toggleTheme, colors, schemes } = useTheme()
  const [activeTab, setActiveTab] = useState("backend")
  const [selectedFrontend, setSelectedFrontend] = useState("React")
  const [selectedLang, setSelectedLang] = useState(judge0Languages[0])
  const [code, setCode] = useState(judge0Languages[0].default)
  const [filename, setFilename] = useState("code")
  const [stdin, setStdin] = useState("")
  const [output, setOutput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState("")
  const [terminalCommand, setTerminalCommand] = useState("")
  const [showTerminal, setShowTerminal] = useState(false)
  const [currentDirectory, setCurrentDirectory] = useState("/")
  const [projectRoot, setProjectRoot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false) // Added missing state
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  const [executionDetails, setExecutionDetails] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openFolders, setOpenFolders] = useState({ frontend: true, backend: true, uploaded: true, root: true, savedCode: true })
  const [openTabs, setOpenTabs] = useState([])
  const [activeFile, setActiveFile] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [savedSnippets, setSavedSnippets] = useState([])
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false)
  const fileInputRef = useRef(null)
const navigate=useNavigate();
const handleclicker=()=>{
  navigate('/');
}
  // Fetch saved code snippets
  const fetchSavedSnippets = useCallback(async () => {
    setIsLoadingSnippets(true);
    try {
      const userId = localStorage.getItem('userEmail');
      if (!userId) {
        console.log('No user email found in localStorage');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/code/snippets/${userId}`);
      if (Array.isArray(response.data)) {
        setSavedSnippets(response.data);
      } else {
        console.error('Received non-array data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching saved snippets:', error);
      setSaveStatus('Error loading saved code');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoadingSnippets(false);
    }
  }, []);

  // Load saved snippets on component mount
  useEffect(() => {
    fetchSavedSnippets();
  }, [fetchSavedSnippets]);

  const handleFileUpload = useCallback((event) => {
    const files = event.target.files
    if (!files.length) return

    const newUploadedFiles = []
    let filesProcessed = 0
    let isCodeProject = false
    let projectDirectory = null
    let packageJson = null

    // First pass: detect project type and find package.json
    Array.from(files).forEach((file) => {
      const path = file.webkitRelativePath
      const isPackageJson = file.name === 'package.json'
      const isReactFile = file.name.endsWith('.jsx') || file.name.endsWith('.tsx') || file.name.endsWith('.js')
      
      if (isPackageJson) {
        packageJson = file
        projectDirectory = path.split('/')[0]
      }
      
      // Check if it's a React project
      if (isReactFile || isPackageJson) {
        isCodeProject = true
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const detectedLang = getLanguageByExtension(file.name)
        const relativePath = file.webkitRelativePath
        
        // Determine file type and prepare for editor
        const fileType = (() => {
          if (isCodeProject) {
            if (file.name === 'package.json') return 'config'
            if (file.name.endsWith('.jsx') || file.name.endsWith('.tsx') ||
                 file.name.endsWith('.js') || file.name.endsWith('.ts')) return 'framework'
            if (file.name.endsWith('.css') || file.name.endsWith('.scss')) return 'style'
            if (file.name.endsWith('.html')) return 'framework'
            if (file.name.endsWith('.json')) return 'config'
            return 'framework' // All files in React project should be editable
          }
          return 'uploaded'
        })()

        const editorFilePath = relativePath.replace(projectDirectory + '/', '')
        const frameworkUrl = isCodeProject ?
          `https://stackblitz.com/edit/react-ts?embed=1&file=${editorFilePath}&view=editor&hideNavigation=1` : null

        newUploadedFiles.push({
          name: file.name,
          path: relativePath,
          content: content,
          type: fileType,
          data: {
            ...detectedLang,
            isCodeProject,
            projectDirectory,
            stackblitzUrl: isCodeProject ? "https://stackblitz.com/edit/react-ts?embed=1&file=src/App.tsx" : null
          }
        })

        filesProcessed++
        if (filesProcessed === files.length) {
          setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
        }
      }
      reader.readAsText(file)
    })
  }, [])

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([])
    // Close any open tabs that were uploaded files
    setOpenTabs((prev) => prev.filter((tab) => tab.type !== "uploaded"))
    setActiveFile(null) // Reset active file if it was an uploaded one
  }, [])

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
    setTerminalCommand("")
  }, [uploadedFiles])

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
          files: (() => {
            // Create a tree structure for files
            const fileTree = {};
            
            uploadedFiles.forEach((file) => {
              const pathParts = file.path.split('/');
              let currentLevel = fileTree;
              
              // Create nested structure
              for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
                if (!currentLevel[part]) {
                  currentLevel[part] = {
                    isDirectory: true,
                    children: {},
                  };
                }
                currentLevel = currentLevel[part].children;
              }
              
              // Add the file
              const fileName = pathParts[pathParts.length - 1];
              currentLevel[fileName] = {
                isDirectory: false,
                file: {
                  name: fileName,
                  path: file.path,
                  type: file.type,
                  icon: file.data?.icon || "📄",
                  data: file.data,
                  content: file.content,
                }
              };
            });
            
            // Convert tree to flat array with proper structure
            const convertTreeToArray = (tree, path = '') => {
              return Object.entries(tree).map(([name, node]) => {
                if (node.isDirectory) {
                  return {
                    name,
                    type: 'directory',
                    icon: '📁',
                    path: path + name,
                    children: convertTreeToArray(node.children, path + name + '/'),
                  };
                } else {
                  return node.file;
                }
              });
            };
            
            return convertTreeToArray(fileTree);
          })(),
        },
      }),
    }),
    [uploadedFiles, savedSnippets, isLoadingSnippets],
  )

  const saveCode = async () => {
    try {
      if (!code.trim()) {
        setSaveStatus('Cannot save empty code');
        setTimeout(() => setSaveStatus(''), 3000);
        return;
      }
      // Prompt for filename if not set
      let saveFilename = filename;
      if (!saveFilename) {
        const userInput = prompt('Enter a filename for your code:', 'untitled');
        if (!userInput) {
          setSaveStatus('Save cancelled');
          setTimeout(() => setSaveStatus(''), 3000);
          return;
        }
        saveFilename = userInput;
        setFilename(userInput); // Update the filename in the UI
      }

      const userId = localStorage.getItem('userEmail'); 

      const response = await axios.post('http://localhost:5000/api/code/save', {
        userId,
        filename: saveFilename,
        code,
        language: selectedLang.name
      });
      
      const message = response.data.isUpdate ? 'Code updated successfully!' : 'Code saved successfully!';
      setSaveStatus(message);
      setTimeout(() => setSaveStatus(''), 3000);
      
      // Refresh the saved snippets list
      fetchSavedSnippets();
    } catch (error) {
      console.error('Error saving code:', error);
      setSaveStatus(error.response?.data?.error || 'Error saving code');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const downloadCode = useCallback(() => {
    const extension = selectedLang.ext
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, selectedLang.ext])

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  const runBackendCode = async () => {
    setLoading(true)
    setIsRunning(true) // Added this line
    setOutput("Running...")
    setExecutionDetails(null)
    try {
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
            "x-rapidapi-key": "af4a1574a2msh2682c4dc719c971p122eb1jsn51b3589532bf", // Replace with your actual RapidAPI key
            "Content-Type": "application/json",
          },
        },
      )
      const result = data.stdout || data.stderr || data.compile_output || "No output"
      setOutput(result)
      setExecutionDetails({
        status: data.status?.description || "Unknown",
        time: data.time || "0",
        memory: Math.round((data.memory || 0) / 1024),
        compile_output: data.compile_output,
        stderr: data.stderr,
      })
    } catch (err) {
      setOutput("Error: " + err.message)
      setExecutionDetails(null)
    } finally {
      setLoading(false)
      setIsRunning(false)
    }
  }

  const toggleFolder = (folder) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }))
  }

  const openFile = (file, type) => {
    // Don't create tabs for directories
    if (file.type === 'directory') {
      toggleFolder(file.path);
      return;
    }

    // Handle saved code snippets
    if (type === 'saved') {
      setActiveTab("backend");
      setCode(file.data.code);
      setFilename(file.data.filename);
      setSelectedLang(judge0Languages.find(lang => lang.name === file.data.language) || judge0Languages[0]);
    }

    const tabId = `${type}-${file.path || file.name}`
    if (!openTabs.find((tab) => tab.id === tabId)) {
      setOpenTabs((prev) => [
        ...prev,
        {
          id: tabId,
          name: file.name,
          path: file.path,
          type,
          data: file,
        },
      ])
    }
    setActiveFile(tabId)

    if (type === "framework" || (file.data?.isCodeProject && file.path)) {
      setActiveTab("frontend")
      const projectFiles = uploadedFiles.filter(f =>
        f.data?.projectDirectory === file.data?.projectDirectory
      );
      
      // Create a modified URL with the current file highlighted
      const baseUrl = "https://stackblitz.com/edit/react-ts"
      const currentFilePath = file.path || `src/${file.name}`
      const frameworkUrl = `${baseUrl}?embed=1&file=${currentFilePath}&view=editor`
      
      // If it's an uploaded React project, update the iframe URL
      if (file.data?.isCodeProject) {
        setSelectedFrontend("React")
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.src = frameworkUrl;
        }
      } else {
        setSelectedFrontend(file.name)
      }
    } else if (type === "language") {
      setActiveTab("backend")
      setSelectedLang(file.data)
      setCode(file.data.default)
    } else if (type === "uploaded") {
      // If the file is part of a React project, treat it as a framework
      if (file.data?.isCodeProject) {
        setActiveTab("frontend")
        setSelectedFrontend("React")
      } else {
        setActiveTab("backend")
        setCode(file.content)
        // Try to set selectedLang if it's a known language
        const detectedLang = judge0Languages.find((l) => l.ext === file.data.ext)
        if (detectedLang) {
          setSelectedLang(detectedLang)
        } else {
          // Fallback for unknown extensions or plain text
          setSelectedLang({ id: null, name: "Plain Text", default: "", icon: "📄", ext: "txt" })
        }
      }
    }
  }

  const closeTab = (tabId, e) => {
    e.stopPropagation()
    setOpenTabs((prev) => prev.filter((tab) => tab.id !== tabId))
    if (activeFile === tabId) {
      const remainingTabs = openTabs.filter((tab) => tab.id !== tabId)
      setActiveFile(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null)
    }
  }

  // Theme classes matching Hero section
  const themeBgClass = isDarkMode ? "bg-[#0f172b]" : "bg-gradient-to-br from-indigo-50 to-blue-100"
  const sidebarBgClass = isDarkMode ? "bg-[#0f172b] border-gray-700/50" : "bg-white/80 border-indigo-100/50"
  const headerBgClass = isDarkMode ? "bg-[#0f172b] border-gray-700/50" : "bg-white/80 border-indigo-100/50"
  const editorBgClass = isDarkMode ?"bg-[#0f172b]" : "bg-white"
  const inputOutputBgClass = isDarkMode ? "bg-[#0f172b]" : "bg-indigo-50/50"
  const textColorClass = isDarkMode ? "text-gray-100" : "text-gray-800"
  const subTextColorClass = isDarkMode ? "text-gray-300" : "text-gray-600"
  const placeholderColorClass = isDarkMode ? "placeholder-gray-500" : "placeholder-gray-400"
  const borderColorClass = isDarkMode ? "border-gray-700/50" : "border-indigo-200/50"
  const hoverBgClass = isDarkMode ? "hover:bg-gray-700/30" : "hover:bg-indigo-50/60"
  const activeTabBgClass = isDarkMode
    ? "bg-gray-700/50 border-b-2 border-indigo-500"
    : "bg-indigo-50/50 border-b-2 border-blue-600"
  const buttonPrimaryClass = isDarkMode
    ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700"
    : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700"
  const buttonSecondaryClass = isDarkMode
    ? "bg-gray-700/50 hover:bg-gray-700/70 text-gray-300"
    : "bg-indigo-100/50 hover:bg-indigo-200/70 text-gray-700"
  const selectClass = isDarkMode
    ? "bg-gray-700/50 text-gray-100 focus:ring-indigo-500/50"
    : "bg-indigo-100/50 text-gray-800 focus:ring-blue-500/50"
  const statBgClass = isDarkMode ? "bg-gray-800/30" : "bg-indigo-100"
  const statTextColorClass = isDarkMode ? "text-gray-400" : "text-gray-600"
  const statValueColorClass = (color) => (isDarkMode ? color : color.replace("-400", "-600"))
  const buttonBaseClass = "flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-xs sm:text-sm"

  return (
    <div className={`min-h-screen  ${themeBgClass} ${textColorClass} relative overflow-hidden`}>
      {/* Toast Notification */}
      {saveStatus && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all transform ${
          saveStatus.includes('error') || saveStatus.includes('cancelled')
            ? 'bg-red-500'
            : saveStatus.includes('updated')
            ? 'bg-blue-500'
            : 'bg-green-500'
        } text-white`}>
          <p className="flex items-center gap-2">
            {saveStatus.includes('error') || saveStatus.includes('cancelled') ? (
              <X className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveStatus}
          </p>
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="lightning1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor={isDarkMode ? "#4f46e5" : "#3b82f6"} stopOpacity="0.4" />
                <stop offset="100%" stopColor={isDarkMode ? "#4f46e5" : "#3b82f6"} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="lightning2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor={isDarkMode ? "#4338ca" : "#2563eb"} stopOpacity="0.4" />
                <stop offset="100%" stopColor={isDarkMode ? "#4338ca" : "#2563eb"} stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              className="lightning-path"
              d="M30,0 L45,30 L15,40 L60,100"
              stroke={isDarkMode ? "#818cf8" : "#6366f1"}
              strokeWidth="0.5"
              fill="none"
            />
            <path
              className="lightning-path-reverse"
              d="M70,100 L65,70 L85,60 L40,0"
              stroke={isDarkMode ? "#8b5cf6" : "#7c3aed"}
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
          <div
            className="energy-orb absolute top-1/4 left-1/4 w-32 h-32 rounded-full"
            style={{
              background: isDarkMode
                ? "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 50%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div
            className="energy-orb absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full"
            style={{
              background: isDarkMode
                ? "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(124,58,237,0.1) 50%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(124,58,237,0.05) 50%, rgba(0,0,0,0) 70%)",
            }}
          />
        </div>
        <FloatingElement delay={0} duration={6} className="top-24 left-20">
          <div
            className={`w-3 h-3 rounded-full ${isDarkMode ? "bg-indigo-400" : "bg-blue-500"}`}
            style={{ boxShadow: isDarkMode ? "0 0 25px rgba(79, 70, 229, 0.6)" : "0 0 20px rgba(59, 130, 246, 0.5)" }}
          />
        </FloatingElement>
        <FloatingElement delay={2} duration={8} className="top-32 right-24">
          <div
            className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-indigo-500" : "bg-blue-400"}`}
            style={{ boxShadow: isDarkMode ? "0 0 20px rgba(67, 56, 202, 0.7)" : "0 0 15px rgba(37, 99, 235, 0.6)" }}
          />
        </FloatingElement>
        <FloatingElement delay={4} duration={10} className="bottom-40 left-32">
          <div
            className={`w-4 h-4 rounded-full ${isDarkMode ? "bg-indigo-400" : "bg-blue-500"}`}
            style={{ boxShadow: isDarkMode ? "0 0 30px rgba(79, 70, 229, 0.5)" : "0 0 25px rgba(59, 130, 246, 0.4)" }}
          />
        </FloatingElement>
      </div>

      {/* Main Layout */}
      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-80" : "w-12"} ${sidebarBgClass} backdrop-blur-sm border-r ${borderColorClass} transition-all duration-300 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className={`flex items-center justify-between p-4 border-b ${borderColorClass}`} >
            {sidebarOpen && (
              <div className="flex items-center gap-2 cursor-pointer " onClick={handleclicker}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-200/50"} transition-colors`}
            >
              <Layout className="w-4 h-4" />
            </button>
          </div>

          {sidebarOpen && (
            <>
              {/* Search Bar */}
              <div className={`p-4 border-b ${borderColorClass}`}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search files..."
                    className={`w-full ${isDarkMode ? "bg-slate-700/50 text-white" : "bg-gray-200/50 text-gray-800"} p-2 pl-8 rounded-lg text-sm focus:outline-none focus:ring-2 ${isDarkMode ? "focus:ring-indigo-500/50" : "focus:ring-indigo-600/50"} ${placeholderColorClass}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* File Explorer */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  {Object.entries(fileStructure).map(([key, folder]) => (
                    <div key={key} className="mb-2">
                      <button
                        onClick={() => toggleFolder(key)}
                        className={`flex items-center gap-2 w-full p-2 ${hoverBgClass} rounded-md transition-colors text-left`}
                      >
                        {openFolders[key] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <folder.icon className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium">{folder.name}</span>
                      </button>
                      {openFolders[key] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {folder.files
                            .filter((file) => {
                              const searchLower = searchQuery.toLowerCase();
                              return file.name.toLowerCase().includes(searchLower) ||
                                     (file.path && file.path.toLowerCase().includes(searchLower));
                            })
                            .map((file, index) => {
                              const renderFileOrFolder = (item, depth = 0) => {
                                if (item.type === 'directory') {
                                  return (
                                    <div key={item.path}>
                                      <button
                                        onClick={() => toggleFolder(item.path)}
                                        className={`flex items-center gap-2 w-full p-2 ${hoverBgClass} rounded-md transition-colors text-left group`}
                                        style={{ paddingLeft: (depth * 1) + 'rem' }}
                                      >
                                        {openFolders[item.path] ?
                                          <ChevronDown className="w-4 h-4" /> :
                                          <ChevronRight className="w-4 h-4" />
                                        }
                                        <span className="text-lg">📁</span>
                                        <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"} group-hover:${textColorClass}`}>
                                          {item.name}
                                        </span>
                                      </button>
                                      {openFolders[item.path] && item.children && (
                                        <div className="ml-4">
                                          {item.children.map(child => renderFileOrFolder(child, depth + 1))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                                
                                if (item.type === 'loading') {
                                  return (
                                    <div
                                      key={index}
                                      className={`flex items-center gap-2 w-full p-2 ${hoverBgClass} rounded-md transition-colors text-left group animate-pulse`}
                                      style={{ paddingLeft: (depth * 1) + 'rem' }}
                                    >
                                      <span className="text-lg">⏳</span>
                                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <button
                                    key={item.path || index}
                                    onClick={() => openFile(item, item.type)}
                                    className={`flex items-center gap-2 w-full p-2 ${hoverBgClass} rounded-md transition-colors text-left group`}
                                    style={{ paddingLeft: (depth * 1) + 'rem' }}
                                  >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"} group-hover:${textColorClass}`}>
                                      {item.name}
                                    </span>
                                  </button>
                                );
                              };
                              return renderFileOrFolder(file);
                            })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload and Clear Buttons */}
              <div className={`p-4 border-t ${borderColorClass} flex flex-col gap-2`}>
                <input
                  type="file"
                  webkitdirectory="true"
                  directory=""
                  multiple
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${buttonSecondaryClass}`}
                >
                  <Upload size={16} />
                  Upload Files
                </button>
                {uploadedFiles.length > 0 && (
                  <button
                    onClick={clearUploadedFiles}
                    className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${isDarkMode ? "bg-red-700/50 hover:bg-red-700 text-white" : "bg-red-200/50 hover:bg-red-300 text-red-800"}`}
                  >
                    <X size={16} />
                    Clear Uploaded
                  </button>
                )}
              </div>

              {/* Stats Section */}
              <div className={`p-4 border-t ${borderColorClass}`}>
                <div className="grid grid-cols-2 gap-3 text-center">
                  {[
                    { icon: Users, value: "50K+", label: "Users", color: "text-blue-400" },
                    { icon: Star, value: "4.9", label: "Rating", color: "text-yellow-400" },
                    { icon: Code2, value: "15+", label: "Languages", color: "text-green-400" },
                    { icon: Rocket, value: "99%", label: "Uptime", color: "text-purple-400" },
                  ].map((stat, index) => (
                    <div key={index} className={`p-2 rounded-lg ${statBgClass}`}>
                      <stat.icon className={`w-4 h-4 mx-auto mb-1 ${statValueColorClass(stat.color)}`} />
                      <div className={`text-xs font-bold ${statValueColorClass(stat.color)}`}>{stat.value}</div>
                      <div className={`text-xs ${statTextColorClass}`}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className={`flex items-center ${headerBgClass} backdrop-blur-sm border-b ${borderColorClass}`}>
            {openTabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => openFile(tab.data, tab.type)} // Re-open file to ensure content is loaded
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer border-r ${borderColorClass} transition-all max-w-xs ${
                  activeFile === tab.id ? activeTabBgClass : hoverBgClass
                }`}
              >
                <span className="text-sm">{tab.data.icon || "📄"}</span>
                <span className="text-sm font-medium truncate">{tab.name.split("/").pop()}</span>{" "}
                {/* Display only file name in tab */}
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className={`p-0.5 ${isDarkMode ? "hover:bg-slate-600/50" : "hover:bg-gray-300/50"} rounded transition-colors`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {openTabs.length === 0 && (
              <div className={`flex items-center gap-2 px-4 py-3 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                <Code2 className="w-4 h-4" />
                <span className="text-sm">Select a file to start coding</span>
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div
            className={`flex items-center justify-between ${isDarkMode ? "bg-slate-800/40" : "bg-gray-100/40"} backdrop-blur-sm border-b ${borderColorClass} px-4 py-2`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("backend")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${
                  activeTab === "frontend" ? buttonPrimaryClass : buttonSecondaryClass
                }`}
              >
                <Layout size={16} />
                Frontend
              </button>
              <button
                onClick={() => setActiveTab("backend")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${
                  activeTab === "backend" ? buttonPrimaryClass : buttonSecondaryClass
                }`}
              >
                <Code2 size={16} />
                Backend
              </button>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "frontend" ? (
                <select
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 ${selectClass}`}
                  value={selectedFrontend}
                  onChange={(e) => setSelectedFrontend(e.target.value)}
                >
                  <option value="React">React</option>
                  <option value="Next.js">Next.js</option>
                  <option value="Vite">Vite</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 ${selectClass}`}
                    value={selectedLang.name}
                    onChange={(e) => {
                      const lang = judge0Languages.find((l) => l.name === e.target.value)
                      setSelectedLang(lang)
                      setCode(lang.default)
                      setOutput("")
                    }}
                  >
                    {judge0Languages.map((lang) => (
                      <option key={lang.id} value={lang.name}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Enter filename"
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 ${selectClass} w-28 sm:w-40`}
                  />
                </div>
              )}
              {activeTab === "backend" ? (
                <button
                  onClick={runBackendCode}
                  className={`${buttonBaseClass} bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium`}
                  disabled={loading}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{loading ? "Running..." : "Run"}</span>
                </button>
              ) : (
                <button
                  onClick={() => {}} // TODO: Add live preview functionality
                  className={`${buttonBaseClass} bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium`}
                  disabled={loading}
                >
                  <Layout className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{loading ? "Loading..." : "Preview"}</span>
                </button>
              )}
              <button
                onClick={saveCode}
                className={`${buttonBaseClass} ${buttonSecondaryClass}`}
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Save</span>
              </button>
              <button
                onClick={copyCode}
                className={`${buttonBaseClass} ${buttonSecondaryClass}`}
              >
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={downloadCode}
                className={`${buttonBaseClass} ${buttonSecondaryClass}`}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Download</span>
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-200/50"} transition-colors`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex">
            {/* Main Editor */}
            <div className="flex-1">
             
                <div className={`flex-1 ${editorBgClass}`}>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`w-full h-full ${editorBgClass} ${textColorClass} p-4 font-mono text-sm resize-none focus:outline-none ${placeholderColorClass}`}
                    placeholder="Write your code here..."
                    spellCheck={false}
                  />
                </div>
            
            </div>

            {/* Side Panel for Backend */}
            {activeTab === "backend" && (
              <div className={`w-96 border-l ${borderColorClass} flex flex-col`}>
                {/* Input Section */}
                <div className={`flex-1 flex flex-col border-b ${borderColorClass}`}>
                  <div className={`${headerBgClass} backdrop-blur-sm p-3 border-b ${borderColorClass}`}>
                    <h3 className={`text-sm font-semibold ${subTextColorClass} flex items-center gap-2`}>
                      <Terminal className="w-4 h-4" />
                      Input
                    </h3>
                  </div>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter program input here..."
                    className={`flex-1 ${inputOutputBgClass} ${textColorClass} p-4 font-mono text-sm resize-none focus:outline-none ${placeholderColorClass}`}
                  />
                </div>

                {/* Output Section */}
                <div className="flex-1 flex flex-col">
                  <div className={`${headerBgClass} backdrop-blur-sm p-3 border-b ${borderColorClass}`}>
                    <h3 className={`text-sm font-semibold ${subTextColorClass} flex items-center gap-2`}>
                      <Code2 className="w-4 h-4" />
                      Output
                    </h3>
                  </div>
                  <div className={`flex-1 ${inputOutputBgClass} p-4 overflow-y-auto`}>
                    <pre
                      className={`text-green-400 font-mono text-sm whitespace-pre-wrap ${isDarkMode ? "" : "text-green-600"}`}
                    >
                      {output || "Run your code to see output here..."}
                    </pre>
                    {executionDetails && (
                      <div className={`mt-4 p-3 ${isDarkMode ? "bg-slate-800/50" : "bg-gray-200/50"} rounded-lg border ${borderColorClass}`}>
                        <div className={`text-xs ${statTextColorClass} space-y-1`}>
                          <div>
                            Status: <span
                              className={
                                executionDetails.status === "Accepted"
                                  ? isDarkMode
                                    ? "text-green-400"
                                    : "text-green-600"
                                  : isDarkMode
                                    ? "text-yellow-400"
                                    : "text-yellow-600"
                              }
                            >
                              {executionDetails.status}
                            </span>
                          </div>
                          <div>
                            Time: <span className={textColorClass}>{executionDetails.time}s</span>
                          </div>
                          <div>
                            Memory: <span className={textColorClass}>{executionDetails.memory} KB</span>
                          </div>
                        </div>
                        {(executionDetails.compile_output || executionDetails.stderr) && (
                          <div className={`mt-2 text-xs ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                            {executionDetails.compile_output || executionDetails.stderr}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {activeTab === "backend" && (
            <>
              <div className={`border-t ${borderColorClass} ${showTerminal ? 'h-48 sm:h-64' : 'h-8'} transition-all duration-300`}>
                <div className="flex items-center justify-between px-2 sm:px-4 py-1 bg-opacity-50 cursor-pointer"
                     onClick={() => setShowTerminal(!showTerminal)}>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium">Terminal</span>
                  </div>
                  <button className={`p-1 rounded hover:${hoverBgClass}`}>
                    {showTerminal ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
                {showTerminal && (
                  <div className={`h-40 sm:h-56 ${editorBgClass} font-mono text-xs sm:text-sm p-2 overflow-auto`}>
                    <div className="whitespace-pre-wrap mb-2">{terminalOutput}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">$</span>
                      <input
                        type="text"
                        value={terminalCommand}
                        onChange={(e) => setTerminalCommand(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && terminalCommand.trim()) {
                            executeTerminalCommand(terminalCommand.trim())
                          }
                        }}
                        className={`flex-1 bg-transparent border-none outline-none ${textColorClass}`}
                        placeholder="Enter command..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.01); }
        }
        .lightning-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: lightning 3s linear infinite;
        }
        .lightning-path-reverse {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: lightning 3s linear infinite 1.5s;
        }
        .energy-orb {
          animation: pulse 4s ease-in-out infinite;
        }
        @keyframes lightning {
          0% {
            stroke-dashoffset: 200;
            opacity: 0;
          }
          30% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            stroke-dashoffset: -200;
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        /* Custom Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgba(15, 23, 43, 0.3)' : 'rgba(241, 245, 249, 0.3)'};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(59, 130, 246, 0.4)'};
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(99, 102, 241, 0.6)' : 'rgba(59, 130, 246, 0.6)'};
        }
        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? 'rgba(99, 102, 241, 0.4) rgba(15, 23, 43, 0.3)' : 'rgba(59, 130, 246, 0.4) rgba(241, 245, 249, 0.3)'};
        }
        /* Hide scrollbar for code editor while preserving functionality */
        textarea::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
      `}</style>
    </div>
  );
};

export default ModernCodeCompiler;
