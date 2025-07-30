"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Editor } from "@monaco-editor/react"
import { io } from "socket.io-client"
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
  Sun,
  Moon,
  Code2,
  FileText,
  Folder,
  Share2,
  MessageCircle,
  Send,
  Settings,
  Crown,
  Edit3,
  Eye,
  UserPlus,
  Link,
  Menu,
  PanelRightOpen,
  LogOut,
  Palette,
  Brush,
  Square,
  Circle,
  Minus,
  Type,
  RotateCcw,
  Trash2,
  MousePointer,
} from "lucide-react"
import axios from "axios"
import config from "../../config/api"
import { useTheme } from "../context/ThemeContext"
import FloatingElement from "./FloatingElement"

// Add this right after the imports
const customStyles = `
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
    background-color: #4B5563;
    border-radius: 4px;
  }
  .scrollbar-track-gray-800::-webkit-scrollbar-track {
    background-color: #1F2937;
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
`

const pistonLanguages = [
  { language: "javascript", version: "18.15.0", name: "JavaScript (Node.js)", default: 'console.log("Hello from Node.js!");', icon: "🟨", ext: "js" },
  { language: "typescript", version: "5.0.3", name: "TypeScript", default: 'console.log("Hello from TypeScript!");', icon: "🔷", ext: "ts" },
  { language: "python", version: "3.10.0", name: "Python 3", default: 'print("Hello from Python!")', icon: "🐍", ext: "py" },
  {
    language: "java",
    version: "15.0.2",
    name: "Java",
    default:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}',
    icon: "☕",
    ext: "java",
  },
  {
    language: "c++",
    version: "10.2.0",
    name: "C++",
    default: '#include <iostream>\nint main() {\n    std::cout << "Hello from C++" << std::endl;\n    return 0;\n}',
    icon: "⚡",
    ext: "cpp",
  },
  {
    language: "c",
    version: "10.2.0",
    name: "C",
    default: '#include <stdio.h>\nint main() {\n    printf("Hello from C!");\n    return 0;\n}',
    icon: "🔧",
    ext: "c",
  },
  { language: "kotlin", version: "1.8.20", name: "Kotlin", default: 'fun main() {\n    println("Hello from Kotlin!")\n}', icon: "🎯", ext: "kt" },
  { language: "rust", version: "1.68.2", name: "Rust", default: 'fn main() {\n    println!("Hello from Rust!");\n}', icon: "🦀", ext: "rs" },
  { language: "php", version: "8.2.3", name: "PHP", default: '<?php\necho "Hello from PHP!";', icon: "🐘", ext: "php" },
  {
    language: "go",
    version: "1.16.2",
    name: "Go",
    default: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}',
    icon: "🐹",
    ext: "go",
  },
]

const getLanguageByExtension = (filename) => {
  const ext = filename.split(".").pop().toLowerCase()
  const lang = pistonLanguages.find((l) => l.ext === ext)
  if (lang) {
    return { ...lang, type: "language" }
  }
  return { language: "plain", version: "1.0.0", name: "Plain Text", default: "", icon: "📄", ext: "txt" }
}

const getMonacoLanguage = (ext) => {
  const languageMap = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    kt: "kotlin",
    rs: "rust",
    php: "php",
    go: "go",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    txt: "plaintext",
  }

  return languageMap[ext?.toLowerCase()] || "plaintext"
}

const CollaborativeCodeCompiler = ({ sessionId: propSessionId }) => {
  const { isDarkMode, toggleTheme } = useTheme()

  // Basic states
  const [code, setCode] = useState(pistonLanguages[0].default)
  const [output, setOutput] = useState("")
  const [stdin, setStdin] = useState("")
  const [selectedLang, setSelectedLang] = useState(pistonLanguages[0])
  const [filename, setFilename] = useState("code")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionDetails, setExecutionDetails] = useState(null)
  const [saveStatus, setSaveStatus] = useState("")

  // Layout states - NEW
  const [activePanel, setActivePanel] = useState("files")
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [showInputTerminal, setShowInputTerminal] = useState(true)
  const [showOutputTerminal, setShowOutputTerminal] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

  // CodeCompiler features
  const [activeTab, setActiveTab] = useState("backend")
  const [selectedFrontend, setSelectedFrontend] = useState("React")
  const [terminalOutput, setTerminalOutput] = useState("")
  const [terminalCommand, setTerminalCommand] = useState("")
  const [showTerminal, setShowTerminal] = useState(false)
  const [currentDirectory, setCurrentDirectory] = useState("/")
  const [projectRoot, setProjectRoot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openFolders, setOpenFolders] = useState({
    frontend: true,
    backend: true,
    uploaded: true,
    root: true,
    savedCode: true,
    collaboration: true,
  })
  const [openTabs, setOpenTabs] = useState([])
  const [activeFile, setActiveFile] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [savedSnippets, setSavedSnippets] = useState([])
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false)

  // Collaboration states - KEEP ALL EXISTING
  const [socket, setSocket] = useState(null)
  const [sessionId, setSessionId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionFromUrl = urlParams.get("session")
    return sessionFromUrl || propSessionId || localStorage.getItem("currentSessionId") || ""
  })
  const [users, setUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [role, setRole] = useState(() => localStorage.getItem("sessionRole") || "viewer")
  const [shouldRestoreSession, setShouldRestoreSession] = useState(true)

  // Enhanced collaboration states - KEEP ALL EXISTING
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [cursors, setCursors] = useState({})
  const [sessionLink, setSessionLink] = useState("")
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isJoiningSession, setIsJoiningSession] = useState(false)
  const [joinSessionId, setJoinSessionId] = useState("")
  const [notifications, setNotifications] = useState([])

  // Whiteboard states
  const [whiteboardElements, setWhiteboardElements] = useState([])
  const [currentTool, setCurrentTool] = useState("pen")
  const [currentColor, setCurrentColor] = useState("#000000")
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(2)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState("")

  // Refs
  const editorRef = useRef(null)
  const fileInputRef = useRef(null)
  const chatMessagesRef = useRef(null)
  const canvasRef = useRef(null)

  // Auto-scroll chat to bottom when new messages arrive - KEEP EXISTING
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [chatMessages])

  // Fetch saved code snippets from database - KEEP EXISTING
  const fetchSavedSnippets = useCallback(async () => {
    setIsLoadingSnippets(true)
    try {
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        console.log("No user email found in localStorage")
        setSavedSnippets([])
        return
      }

      const response = await axios.get(`${config.API_URL}/code/snippets/${userEmail}`)
      console.log("Response data:", response.data)

      if (response.data && Array.isArray(response.data)) {
        setSavedSnippets(response.data)
      } else if (response.data && response.data.snippets && Array.isArray(response.data.snippets)) {
        setSavedSnippets(response.data.snippets)
      } else {
        console.error("Received non-array data:", response.data)
        setSavedSnippets([])
      }
    } catch (error) {
      console.error("Error fetching saved snippets:", error)
      setSavedSnippets([])
    } finally {
      setIsLoadingSnippets(false)
    }
  }, [])

  // Load on component mount - KEEP EXISTING
  useEffect(() => {
    fetchSavedSnippets()
  }, [fetchSavedSnippets])

  // Fetch available runtimes from Piston API
  const fetchAvailableRuntimes = useCallback(async () => {
    try {
      const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
      console.log('Available Piston runtimes:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching runtimes:', error);
      return [];
    }
  }, []);

  // Handle browser refresh and URL changes - KEEP EXISTING
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width < 1024)

      if (width < 768) {
        setSidebarOpen(false)
      }
    }

    const handleBeforeUnload = (e) => {
      if (sessionId && shouldRestoreSession) {
        localStorage.setItem("currentSessionId", sessionId)
        localStorage.setItem("sessionRole", role)
        localStorage.setItem("shouldRestoreSession", "true")
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && sessionId && shouldRestoreSession) {
        console.log("Page became visible, checking session...")
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [sessionId, role, shouldRestoreSession])

  // Notification system - KEEP EXISTING
  const addNotification = useCallback((message, type = "info") => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: Date.now(),
    }
    setNotifications((prev) => [...prev, notification])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    }, 5000)
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  // Helper function to check if user is properly logged in - MUST BE EARLY
  const isUserLoggedIn = useCallback(() => {
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user") 
    
    // Check if both values exist and are not empty strings
    const hasEmail = userEmail && userEmail.trim() !== "" && userEmail !== "null" && userEmail !== "undefined"
    const hasName = userName && userName.trim() !== "" && userName !== "null" && userName !== "undefined"
    
    console.log("Login check details:", { 
      userEmail: `"${userEmail}"`, 
      userName: `"${userName}"`, 
      hasEmail, 
      hasName, 
      isLoggedIn: hasEmail && hasName,
      emailType: typeof userEmail,
      nameType: typeof userName,
      allStorageKeys: Object.keys(localStorage).filter(key => key.toLowerCase().includes('user') || key.toLowerCase().includes('name'))
    })
    
    return hasEmail && hasName
  }, [])

  // Debug localStorage on component mount
  useEffect(() => {
    console.log("=== Component Mount Debug ===")
    console.log("All localStorage items:", {
      userEmail: localStorage.getItem("userEmail"),
      userName: localStorage.getItem("userName"),
      name: localStorage.getItem("name"),
      user: localStorage.getItem("user"),
      currentSessionId: localStorage.getItem("currentSessionId"),
      sessionRole: localStorage.getItem("sessionRole"),
      allKeys: Object.keys(localStorage)
    })
    console.log("Login status:", isUserLoggedIn())
    console.log("=============================")
  }, [isUserLoggedIn])

  // Socket.IO connection - KEEP ALL EXISTING COLLABORATION LOGIC
  useEffect(() => {
    if (!sessionId) return

    const SOCKET_URL = config.SOCKET_URL
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      forceNew: true,
    })

    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")

    if (!isUserLoggedIn()) {
      console.log("No user authentication found. Please log in to use collaboration features.")
      addNotification("Please log in to use collaboration features", "warning")
      return
    }

    const userId = userEmail

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
      setIsConnected(true)

      localStorage.setItem("currentSessionId", sessionId)
      localStorage.setItem("sessionRole", role)

      console.log("Emitting join-session with:", {
        sessionId,
        userId,
        userName,
      })

      newSocket.emit("join-session", {
        sessionId,
        userId,
        userName,
      })

      setTimeout(() => {
        if (users.length === 0) {
          console.warn("No users received after 3 seconds, checking connection...")
          addNotification("Taking longer than expected to join session...", "warning")
        }
      }, 3000)
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setIsConnected(false)
      addNotification("Failed to connect to collaboration server", "error")
    })

    newSocket.on("reconnect", () => {
      console.log("Socket reconnected, rejoining session...")
      setIsConnected(true)

      newSocket.emit("join-session", {
        sessionId,
        userId,
        userName,
      })

      addNotification("Reconnected to collaboration server", "success")
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    newSocket.on("session-joined", (data) => {
      console.log("Session joined:", data)

      const users = data.users || data.session?.users || []
      const role = data.role || data.session?.role || "viewer"
      const sessionCode = data.code || data.session?.code
      const sessionLanguage = data.language || data.session?.language
      const sessionLanguageId = data.languageId || data.session?.languageId
      const sessionFilename = data.filename || data.session?.filename || "code"

      setUsers(users)
      setRole(role)
      localStorage.setItem("sessionRole", role)

      if (sessionCode && sessionCode !== code) {
        setCode(sessionCode)
        if (editorRef.current) {
          editorRef.current.setValue(sessionCode)
        }
      }

      if (sessionLanguageId && sessionLanguage) {
        // For backward compatibility, try to find by name first, then by old ID
        const lang = pistonLanguages.find((l) => l.name === sessionLanguage) || 
                     pistonLanguages.find((l) => l.language === sessionLanguage)
        if (lang) {
          setSelectedLang(lang)
        }
      }

      if (sessionFilename) {
        setFilename(sessionFilename)
      }

      addNotification(`Successfully joined collaboration session! Role: ${role}`, "success")
    })

    newSocket.on("error", (error) => {
      console.error("Socket error:", error)
      addNotification(`Collaboration error: ${error.message || "Unknown error"}`, "error")
    })

    newSocket.on("code-change", (data) => {
      if (editorRef.current) {
        editorRef.current.setValue(data.code)
      }
      setCode(data.code)
    })

    newSocket.on("language-change", (data) => {
      console.log("Language changed by another user:", data)
      // Handle both new Piston format and legacy format
      const lang = pistonLanguages.find((l) => l.name === data.language) || 
                   pistonLanguages.find((l) => l.language === data.language) ||
                   (data.languageId && pistonLanguages[data.languageId]) // fallback for old format
      if (lang) {
        setSelectedLang(lang)
        if (data.defaultCode) {
          setCode(data.defaultCode)
          if (editorRef.current) {
            editorRef.current.setValue(data.defaultCode)
          }
        }
        setFilename("code")
        addNotification(`${data.userName} switched to ${lang.name}`, "info")
      }
    })

    newSocket.on("file-change", (data) => {
      console.log("File changed by another user:", data)
      setFilename(data.filename)
      if (data.code !== undefined) {
        setCode(data.code)
        if (editorRef.current) {
          editorRef.current.setValue(data.code)
        }
      }
      if (data.language) {
        const lang = pistonLanguages.find((l) => l.name === data.language)
        if (lang) {
          setSelectedLang(lang)
        }
      }
      addNotification(`${data.userName} opened ${data.filename}`, "info")
    })

    newSocket.on("users-updated", (data) => {
      console.log("Users updated:", data)
      setUsers(data.users || [])
      if (data.userJoined) {
        addNotification(`${data.userJoined} joined the session`, "info")
      }
      if (data.userLeft) {
        addNotification(`${data.userLeft} left the session`, "info")
      }
    })

    newSocket.on("code-execution-result", (data) => {
      setOutput(data.output.stdout || data.output.stderr || "No output")
      setIsExecuting(false)
      setExecutionDetails(data.details)
    })

    newSocket.on("chat-message", (data) => {
      console.log("Received chat message:", data)

      const userEmail = localStorage.getItem("userEmail")
      if (data.userId === userEmail) {
        console.log("Ignoring own message from server")
        return
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])

      addNotification(
        `${data.userName}: ${data.message.substring(0, 30)}${data.message.length > 30 ? "..." : ""}`,
        "info",
      )
    })

    newSocket.on("cursor-position", (data) => {
      setCursors((prev) => ({
        ...prev,
        [data.userId]: {
          position: data.position,
          userName: data.userName,
          color: data.color,
        },
      }))
    })

    newSocket.on("file-shared", (data) => {
      setUploadedFiles((prev) => [...prev, data.file])
      
      // Auto-open the shared file for all users
      openFile(data.file, "uploaded")
      
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          message: `${data.userName} shared a file: ${data.file.name}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    })

    newSocket.on("session-info", (data) => {
      setSessionLink(data.sessionLink)
    })

    newSocket.on("role-updated", (data) => {
      console.log("Role updated event received:", data)
      const userEmail = localStorage.getItem("userEmail")

      if (data.userId === userEmail && data.role !== role) {
        console.log("My role updated to:", data.role)
        setRole(data.role)
        localStorage.setItem("sessionRole", data.role)
        addNotification(`Your role has been updated to ${data.role}`, "success")
      } else if (data.userId !== userEmail) {
        addNotification(`${data.userName}'s role updated to ${data.role}`, "info")
      }

      setUsers((prev) => prev.map((user) => (user.id === data.userId ? { ...user, role: data.role } : user)))

      const updatedUserName = data.userName || users.find((u) => u.id === data.userId)?.name || "User"
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          message: `${updatedUserName}'s role has been updated from ${data.oldRole || "unknown"} to ${data.role}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    })

    // Whiteboard events
    newSocket.on("whiteboard-draw", (data) => {
      if (data.sessionId === sessionId) {
        setWhiteboardElements(prev => [...prev, data.element])
      }
    })

    newSocket.on("whiteboard-clear", (data) => {
      if (data.sessionId === sessionId) {
        setWhiteboardElements([])
      }
    })

    newSocket.on("whiteboard-undo", (data) => {
      if (data.sessionId === sessionId) {
        setWhiteboardElements(prev => prev.slice(0, -1))
      }
    })

    newSocket.on("whiteboard-opened", (data) => {
      if (data.sessionId === sessionId) {
        setActivePanel("whiteboard")
        addNotification(`${data.userName} opened the whiteboard`, "info")
      }
    })

    newSocket.on("whiteboard-closed", (data) => {
      if (data.sessionId === sessionId) {
        setActivePanel("")
        addNotification(`${data.userName} closed the whiteboard`, "info")
      }
    })

    setSocket(newSocket)

    return () => {
      console.log("Cleaning up socket connection")
      newSocket.disconnect()
    }
  }, [sessionId, addNotification])

  // Calculate edit permissions - KEEP EXISTING
  // Permission logic - allow all users to edit now
  const canEdit = true // !sessionId || role === "owner" || role === "editor"

  // Enhanced editor change handler with file synchronization - KEEP EXISTING
  const handleEditorChange = useCallback(
    (value) => {
      setCode(value || "")

      if (socket && sessionId && canEdit) {
        socket.emit("code-change", {
          sessionId,
          code: value || "",
          userId: localStorage.getItem("userEmail"),
          userName: localStorage.getItem("userName"),
        })
      }
    },
    [socket, sessionId, canEdit],
  )

  // Enhanced language change handler with synchronization - Updated for Piston API
  const handleLanguageChange = useCallback(
    (lang) => {
      setSelectedLang(lang)
      setCode(lang.default)
      setFilename("code")

      if (socket && sessionId && canEdit) {
        socket.emit("language-change", {
          sessionId,
          language: lang.name,
          languageInfo: lang,
          defaultCode: lang.default,
          userId: localStorage.getItem("userEmail"),
          userName: localStorage.getItem("userName"),
        })
      }
    },
    [socket, sessionId, canEdit],
  )

  // Enhanced file open handler with synchronization - KEEP EXISTING
  const handleFileOpen = useCallback(
    (file, type) => {
      console.log("Opening file:", file, "Type:", type)

      if (type === "language") {
        handleLanguageChange(file)
      } else if (type === "uploaded" || type === "saved") {
        setCode(file.content || file.code || "")
        setFilename(file.name || file.filename || "untitled")

        const detectedLang = getLanguageByExtension(file.name || file.filename || "")
        if (detectedLang.language) {
          setSelectedLang(detectedLang)
        } else {
          setSelectedLang(pistonLanguages[0])
        }

        if (socket && sessionId && canEdit) {
          socket.emit("file-change", {
            sessionId,
            filename: file.name || file.filename || "untitled",
            code: file.content || file.code || "",
            language: detectedLang.name || pistonLanguages[0].name,
            userId: localStorage.getItem("userEmail"),
            userName: localStorage.getItem("userName"),
          })
        }
      }

      setActiveFile({ ...file, type })

      const existingTab = openTabs.find(
        (tab) => tab.data.id === file.id || (tab.data.name === file.name && tab.type === type),
      )

      if (!existingTab) {
        setOpenTabs((prev) => [...prev, { data: file, type, id: file.id || Date.now() }])
      }
    },
    [socket, sessionId, canEdit, openTabs, handleLanguageChange],
  )

  // Editor mount handler - KEEP EXISTING
  const handleEditorDidMount = useCallback((editorInstance) => {
    editorRef.current = editorInstance
  }, [])

  // Execute code function - Updated to use Piston API
  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      setOutput("No code to execute")
      return
    }

    setIsExecuting(true)
    setLoading(true)
    setIsRunning(true)
    setOutput("🚀 Running...")
    setExecutionDetails(null)

    // Auto-open input/output terminals when running code
    setShowInputTerminal(true)
    setShowOutputTerminal(true)
    setRightPanelOpen(true)

    try {
      if (socket && sessionId && role !== "viewer") {
        socket.emit("execute-code", {
          sessionId,
          code,
          language: selectedLang.name,
          languageInfo: selectedLang,
          stdin: stdin || "",
        })
      } else {
        console.log("Executing code with Piston API")

        const { data } = await axios.post("https://emkc.org/api/v2/piston/execute", {
          language: selectedLang.language,
          version: selectedLang.version,
          files: [
            {
              name: `main.${selectedLang.ext}`,
              content: code
            }
          ],
          stdin: stdin,
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1
        })

        const result = data.run?.stdout || data.run?.stderr || data.compile?.stdout || data.compile?.stderr || "No output"
        setOutput(result)
        setExecutionDetails({
          status: data.run?.code === 0 ? "Accepted" : "Runtime Error",
          time: data.run?.signal ? `Signal: ${data.run.signal}` : "N/A",
          memory: "N/A",
          compile_output: data.compile?.stdout || data.compile?.stderr || "",
          stderr: data.run?.stderr || "",
        })
      }
    } catch (error) {
      console.error("Execution error:", error)
      setOutput("Error: " + error.message)
      setExecutionDetails(null)
    } finally {
      setIsExecuting(false)
      setLoading(false)
      setIsRunning(false)
    }
  }, [code, selectedLang, stdin, socket, sessionId, role])

  // Copy code function - KEEP EXISTING
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  // ALL OTHER EXISTING FUNCTIONS - KEEP AS IS
  const uploadFiles = useCallback((event) => {
    const files = Array.from(event.target.files)
    const newUploadedFiles = []
    let filesProcessed = 0
    let isCodeProject = false
    let projectDirectory = null
    let packageJson = null

    files.forEach((file) => {
      const path = file.webkitRelativePath || file.name
      const isPackageJson = file.name === "package.json"
      const isReactFile = file.name.endsWith(".jsx") || file.name.endsWith(".tsx") || file.name.endsWith(".js")

      if (isPackageJson) {
        packageJson = file
        projectDirectory = path.split("/")[0]
      }

      if (isReactFile || isPackageJson) {
        isCodeProject = true
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const detectedLang = getLanguageByExtension(file.name)
        const relativePath = file.webkitRelativePath || file.name

        const fileType = (() => {
          if (isCodeProject) {
            if (file.name === "package.json") return "config"
            if (
              file.name.endsWith(".jsx") ||
              file.name.endsWith(".tsx") ||
              file.name.endsWith(".js") ||
              file.name.endsWith(".ts")
            )
              return "framework"
            if (file.name.endsWith(".css") || file.name.endsWith(".scss")) return "style"
            if (file.name.endsWith(".html")) return "framework"
            if (file.name.endsWith(".json")) return "config"
            return "framework"
          }
          return "uploaded"
        })()

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
            stackblitzUrl: isCodeProject ? "https://stackblitz.com/edit/react-ts?embed=1&file=src/App.tsx" : null,
          },
        }

        newUploadedFiles.push(uploadedFile)
        filesProcessed++
        if (filesProcessed === files.length) {
          setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
        }
      }
      reader.readAsText(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  // KEEP ALL OTHER EXISTING FUNCTIONS...
  const openFile = useCallback(
    (file, type) => {
      handleFileOpen(file, type)
    },
    [handleFileOpen],
  )

  const closeTab = useCallback(
    (tabId) => {
      setOpenTabs((prev) => prev.filter((tab) => tab.id !== tabId))

      const remainingTabs = openTabs.filter((tab) => tab.id !== tabId)
      if (remainingTabs.length > 0) {
        const newActiveTab = remainingTabs[remainingTabs.length - 1]
        openFile(newActiveTab.data, newActiveTab.type)
      } else {
        setActiveFile(null)
        setCode(selectedLang.default)
        setFilename("code")
      }
    },
    [openTabs, openFile, selectedLang],
  )

  const deleteFile = useCallback(
    async (fileId, type) => {
      if (type === "uploaded") {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
      } else if (type === "saved") {
        try {
          await axios.delete(`${config.API_URL}/code/snippets/${fileId}`)
          addNotification("Code snippet deleted successfully", "success")
          fetchSavedSnippets() // Refresh the list
        } catch (error) {
          console.error("Error deleting snippet:", error)
          addNotification("Failed to delete code snippet", "error")
        }
      }
      const tabToClose = openTabs.find((tab) => tab.data.id === fileId)
      if (tabToClose) {
        closeTab(tabToClose.id)
      }
    },
    [openTabs, closeTab, addNotification, fetchSavedSnippets],
  )

  const toggleFolder = useCallback((folderName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }))
  }, [])

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([])
    setOpenTabs((prev) => prev.filter((tab) => tab.type !== "uploaded"))
    setActiveFile(null)
  }, [])

  const executeTerminalCommand = useCallback(
    async (command) => {
      setTerminalOutput((prev) => prev + "\n$ " + command)

      if (command.startsWith("npm ") || command.startsWith("yarn ")) {
        setTerminalOutput((prev) => prev + "\nExecuting package manager command...")
        setTerminalOutput((prev) => prev + "\nPackage manager command executed successfully")
      }

      if (command.startsWith("cd ")) {
        const newPath = command.slice(3)
        setCurrentDirectory(newPath)
        setTerminalOutput((prev) => prev + "\nChanged directory to: " + newPath)
      }

      if (command === "ls" || command === "dir") {
        const files = uploadedFiles.map((f) => f.name).join("\n")
        setTerminalOutput((prev) => prev + "\n" + files)
      }

      if (command === "clear") {
        setTerminalOutput("")
      }

      setTerminalCommand("")
    },
    [uploadedFiles],
  )

  const runTerminalCommand = useCallback(async () => {
    if (!terminalCommand.trim()) return
    await executeTerminalCommand(terminalCommand)
  }, [terminalCommand, executeTerminalCommand])

  // KEEP ALL EXISTING COLLABORATION FUNCTIONS
  const createSession = useCallback(async () => {
    setIsCreatingSession(true)
    try {
      const userEmail = localStorage.getItem("userEmail")
      const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")
      console.log("Creating session with:", { userEmail, userName })
      
      if (!isUserLoggedIn()) {
        addNotification("Please log in to create a collaboration session", "error")
        setIsCreatingSession(false)
        return
      }

      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      setSessionId(newSessionId)
      setRole("owner")
      localStorage.setItem("currentSessionId", newSessionId)
      localStorage.setItem("sessionRole", "owner")

      const link = `${window.location.origin}${window.location.pathname}?session=${newSessionId}`
      setSessionLink(link)
      setShowSessionModal(false)

      setChatMessages([
        {
          id: Date.now(),
          type: "system",
          message: "Session created successfully! Share the link to invite others.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ])

      window.history.pushState({}, "", `${window.location.pathname}?session=${newSessionId}`)

      console.log("Session created:", newSessionId)
    } catch (error) {
      console.error("Error creating session:", error)
      addNotification("Failed to create session", "error")
    } finally {
      setIsCreatingSession(false)
    }
  }, [addNotification, isUserLoggedIn])

  const joinSession = useCallback(async () => {
    if (!joinSessionId.trim()) return
    setIsJoiningSession(true)
    try {
      const userEmail = localStorage.getItem("userEmail")
      const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")

      if (!isUserLoggedIn()) {
        addNotification("Please log in to join a collaboration session", "error")
        setIsJoiningSession(false)
        return
      }

      setSessionId(joinSessionId)
      setRole("viewer")
      localStorage.setItem("currentSessionId", joinSessionId)
      localStorage.setItem("sessionRole", "viewer")
      setShowSessionModal(false)
      setJoinSessionId("")

      window.history.pushState({}, "", `${window.location.pathname}?session=${joinSessionId}`)

      console.log("Joining session:", joinSessionId)
    } catch (error) {
      console.error("Error joining session:", error)
      addNotification("Failed to join session", "error")
    } finally {
      setIsJoiningSession(false)
    }
  }, [joinSessionId, addNotification, isUserLoggedIn])

  const sendChatMessage = useCallback(() => {
    if (!chatInput.trim() || !socket) {
      console.log("Cannot send message:", { chatInput: chatInput.trim(), socket: !!socket })
      return
    }

    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")

    console.log("Sending chat message:", {
      sessionId,
      message: chatInput,
      userId: userEmail,
      userName: userName,
      socketConnected: socket.connected,
    })

    socket.emit("chat-message", {
      sessionId,
      message: chatInput,
      userId: userEmail,
      userName: userName,
    })

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        userId: userEmail,
        userName: userName,
        message: chatInput,
        timestamp: new Date().toLocaleTimeString(),
        isLocal: true,
      },
    ])

    setChatInput("")
    addNotification("Message sent", "success")
  }, [chatInput, socket, sessionId, addNotification])

  const shareFile = useCallback(
    (file) => {
      if (!socket || !sessionId) return

      const userEmail = localStorage.getItem("userEmail")
      const userName = localStorage.getItem("userName")

      socket.emit("share-file", {
        sessionId,
        file,
        userId: userEmail,
        userName: userName,
      })
    },
    [socket, sessionId],
  )

  const updateUserRole = useCallback(
    (userId, newRole) => {
      console.log("Updating user role:", { userId, newRole, currentRole: role, sessionId, socket: !!socket })

      if (!socket || !sessionId || role !== "owner") {
        console.error("Cannot update role:", {
          hasSocket: !!socket,
          hasSessionId: !!sessionId,
          isOwner: role === "owner",
          currentRole: role,
        })
        addNotification("You must be the session owner to change user roles", "error")
        return
      }

      console.log("Emitting update-role:", { sessionId, userId, newRole })

      socket.emit("update-role", {
        sessionId,
        userId,
        newRole,
      })

      addNotification(`Updating ${userId}'s role to ${newRole}...`, "info")
    },
    [socket, sessionId, role, addNotification],
  )

  const copySessionLink = useCallback(() => {
    if (!sessionLink) return
    navigator.clipboard.writeText(sessionLink)
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "system",
        message: "Session link copied to clipboard!",
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }, [sessionLink])

  const leaveSession = useCallback(() => {
    setShouldRestoreSession(false)

    setSessionId("")
    setUsers([])
    setRole("viewer")
    setChatMessages([])
    setCursors({})
    setSessionLink("")
    setIsConnected(false)

    localStorage.removeItem("currentSessionId")
    localStorage.removeItem("sessionRole")
    localStorage.removeItem("shouldRestoreSession")

    window.history.pushState({}, "", window.location.pathname)

    if (socket) {
      socket.emit("leave-session", { sessionId })
      socket.disconnect()
    }

    addNotification("Left collaboration session", "info")
  }, [socket, sessionId])

  const loadSavedSnippet = useCallback(async (snippet) => {
    try {
      setCode(snippet.code)
      setFilename(snippet.filename)

      const lang = pistonLanguages.find((l) => l.name === snippet.language)
      if (lang) {
        setSelectedLang(lang)
      }

      setSaveStatus("Code loaded successfully!")
      setTimeout(() => setSaveStatus(""), 3000)
    } catch (error) {
      console.error("Error loading snippet:", error)
      setSaveStatus("Error loading snippet")
      setTimeout(() => setSaveStatus(""), 3000)
    }
  }, [])

  const filterItems = useCallback((items, query) => {
    if (!query) return items
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.filename?.toLowerCase().includes(query.toLowerCase()),
    )
  }, [])

  const saveCode = useCallback(async () => {
    try {
      if (!code.trim()) {
        addNotification("Cannot save empty code", "error")
        return
      }

      let saveFilename = filename
      if (!saveFilename || saveFilename === "code") {
        saveFilename = prompt("Enter filename:") || `${selectedLang.name.toLowerCase()}_${Date.now()}`
      }

      const userEmail = localStorage.getItem("userEmail")
      const userName = localStorage.getItem("userName")

      if (!userEmail || !userName) {
        addNotification("Please log in to save code", "error")
        return
      }

      addNotification("Saving code...", "info")

      const response = await axios.post(`${config.API_URL}/code/save`, {
        userId: userEmail, // Using userEmail as userId
        filename: saveFilename,
        code,
        language: selectedLang.name,
      })

      if (response.data.message) {
        addNotification(response.data.message, "success")
        setFilename(saveFilename)
        fetchSavedSnippets() // Refresh the saved snippets list
      } else {
        addNotification("Failed to save code", "error")
      }
    } catch (error) {
      console.error("Error saving code:", error)
      const errorMessage = error.response?.data?.error || "Error saving code"
      addNotification(errorMessage, "error")
    }
  }, [code, filename, selectedLang, fetchSavedSnippets, addNotification])

  const downloadCode = useCallback(() => {
    const element = document.createElement("a")
    const file = new Blob([code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${filename}.${selectedLang.ext}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }, [code, filename, selectedLang])

  // Whiteboard Functions
  const startDrawing = useCallback((e) => {
    if (!sessionId) return
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (currentTool === "pen" || currentTool === "brush") {
      setCurrentPath(`M ${x} ${y}`)
    }
  }, [sessionId, currentTool])

  const draw = useCallback((e) => {
    if (!isDrawing || !sessionId) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (currentTool === "pen" || currentTool === "brush") {
      setCurrentPath(prev => `${prev} L ${x} ${y}`)
    }
  }, [isDrawing, sessionId, currentTool])

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !sessionId) return
    setIsDrawing(false)
    
    if (currentPath && (currentTool === "pen" || currentTool === "brush")) {
      const element = {
        id: Date.now(),
        type: currentTool,
        path: currentPath,
        color: currentColor,
        strokeWidth: currentStrokeWidth,
        userId: localStorage.getItem("userEmail"),
        userName: localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")
      }
      
      setWhiteboardElements(prev => [...prev, element])
      
      if (socket) {
        socket.emit("whiteboard-draw", {
          sessionId,
          element
        })
      }
    }
    
    setCurrentPath("")
  }, [isDrawing, sessionId, currentPath, currentTool, currentColor, currentStrokeWidth, socket])

  const addShape = useCallback((shapeType, e) => {
    if (!sessionId) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const element = {
      id: Date.now(),
      type: shapeType,
      x,
      y,
      width: 100,
      height: 100,
      color: currentColor,
      strokeWidth: currentStrokeWidth,
      userId: localStorage.getItem("userEmail"),
      userName: localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")
    }
    
    setWhiteboardElements(prev => [...prev, element])
    
    if (socket) {
      socket.emit("whiteboard-draw", {
        sessionId,
        element
      })
    }
  }, [sessionId, currentColor, currentStrokeWidth, socket])

  const clearWhiteboard = useCallback(() => {
    if (!sessionId) return
    setWhiteboardElements([])
    
    if (socket) {
      socket.emit("whiteboard-clear", {
        sessionId,
        userId: localStorage.getItem("userEmail")
      })
    }
  }, [sessionId, socket])

  const undoLastAction = useCallback(() => {
    if (!sessionId || whiteboardElements.length === 0) return
    setWhiteboardElements(prev => prev.slice(0, -1))
    
    if (socket) {
      socket.emit("whiteboard-undo", {
        sessionId,
        userId: localStorage.getItem("userEmail")
      })
    }
  }, [sessionId, whiteboardElements.length, socket])

  // Synchronized panel management
  const closePanelSynchronized = useCallback((panelId) => {
    setActivePanel("")
    
    // Synchronize panel closure with other users
    if (sessionId && socket && panelId === "whiteboard") {
      const userEmail = localStorage.getItem("userEmail")
      const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")
      
      socket.emit("whiteboard-close", {
        sessionId,
        userId: userEmail,
        userName: userName
      })
    }
  }, [sessionId, socket])

  const fileStructure = useMemo(
    () => ({
      savedCode: {
        name: "Saved Code",
        icon: Save,
        files: isLoadingSnippets
          ? [
              {
                name: "Loading...",
                type: "loading",
                icon: "⏳",
                data: { isLoading: true },
              },
            ]
          : savedSnippets.map((snippet) => ({
              name: snippet.filename,
              type: "saved",
              icon: "📄",
              data:
                snippet.type === "loading"
                  ? { isLoading: true }
                  : {
                      ...snippet,
                      id: snippet._id,
                      code: snippet.code,
                      language: snippet.language,
                    },
            })),
      },
      backend: {
        name: "Backend Languages",
        icon: Code2,
        files: pistonLanguages.map((lang) => ({
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
    [savedSnippets, isLoadingSnippets, uploadedFiles],
  )

  // Keyboard shortcuts - KEEP EXISTING
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault()
        saveCode()
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault()
        executeCode()
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault()
        downloadCode()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [saveCode, executeCode, downloadCode])

  // Debug logging - KEEP EXISTING
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")
    console.log("Collaboration state:", {
      sessionId,
      isConnected,
      users: users?.length || 0,
      role,
      socket: !!socket,
      userEmail,
      userName,
      isLoggedIn: isUserLoggedIn(),
    })
  }, [sessionId, isConnected, users, role, socket, isUserLoggedIn])

  // NEW SIDEBAR CONFIGURATION
  const sidebarItems = [
    {
      id: "files",
      icon: FileText,
      label: "Files",
      active: activePanel === "files",
      onClick: () => setActivePanel(activePanel === "files" ? "" : "files"),
    },
    {
      id: "run",
      icon: Play,
      label: "Run Code",
      active: false,
      onClick: executeCode,
      disabled: isExecuting,
    },
    {
      id: "share",
      icon: Share2,
      label: "Share",
      active: false,
      onClick: () => {
        if (sessionId) {
          copySessionLink()
        } else {
          addNotification("Create a session first to share", "warning")
        }
      },
    },
    {
      id: "collaboration",
      icon: Users,
      label: "Collaboration",
      active: activePanel === "collaboration",
      onClick: () => setActivePanel(activePanel === "collaboration" ? "" : "collaboration"),
      badge: sessionId ? users?.length || 0 : 0,
    },
    {
      id: "whiteboard",
      icon: Palette,
      label: "Whiteboard",
      active: activePanel === "whiteboard",
      onClick: () => {
        const newState = activePanel === "whiteboard" ? "" : "whiteboard"
        setActivePanel(newState)
        
        // Synchronize whiteboard state with other users
        if (sessionId && socket) {
          const userEmail = localStorage.getItem("userEmail")
          const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")
          
          if (newState === "whiteboard") {
            socket.emit("whiteboard-open", {
              sessionId,
              userId: userEmail,
              userName: userName
            })
            addNotification("Whiteboard opened", "info")
          } else {
            socket.emit("whiteboard-close", {
              sessionId,
              userId: userEmail,
              userName: userName
            })
            addNotification("Whiteboard closed - Editor is now visible", "info")
          }
        }
      },
    },
    {
      id: "terminal",
      icon: Terminal,
      label: "Terminal",
      active: activePanel === "terminal",
      onClick: () => setActivePanel(activePanel === "terminal" ? "" : "terminal"),
    },
    {
      id: "saved",
      icon: Star,
      label: "Saved Code",
      active: activePanel === "saved",
      onClick: () => setActivePanel(activePanel === "saved" ? "" : "saved"),
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      active: activePanel === "settings",
      onClick: () => setActivePanel(activePanel === "settings" ? "" : "settings"),
    },
  ]

  // NEW PANEL CONTENT RENDERER
  const renderPanelContent = () => {
    switch (activePanel) {
      case "files":
        return (
          <div className="h-full flex flex-col overflow-x-hidden">
            <div className={`p-4 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } border-b`}>
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Folder className="w-5 h-5 text-blue-500" />
                <span>File Explorer</span>
              </h2>
              <div className="relative mb-3">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                      : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
                <button
                  onClick={saveCode}
                  disabled={!code.trim()}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    code.trim()
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : `${isDarkMode ? "bg-gray-600 text-gray-300" : "bg-gray-300 text-gray-500"} cursor-not-allowed`
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Language Templates */}
              <div className={`${
                isDarkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white border-gray-300"
              } rounded-lg border overflow-hidden`}>
                <button
                  onClick={() => toggleFolder("backend")}
                  className={`flex items-center space-x-2 text-left w-full p-3 ${
                    isDarkMode 
                      ? "hover:bg-gray-600" 
                      : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  <div className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {openFolders.backend ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span className={`font-semibold ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  }`}>Language Templates</span>
                  <span className={`text-xs ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  } ml-auto`}>({pistonLanguages.length})</span>
                </button>
                {openFolders.backend && (
                  <div className={`border-t ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  }`}>
                    {filterItems(pistonLanguages, searchQuery).map((lang) => (
                      <button
                        key={lang.language}
                        onClick={() => openFile(lang, "language")}
                        className={`flex items-center space-x-3 text-sm w-full text-left p-3 border-b ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        } last:border-b-0 ${
                          isDarkMode ? "hover:bg-blue-900" : "hover:bg-blue-50"
                        } transition-colors ${
                          selectedLang.language === lang.language
                            ? `${isDarkMode ? "bg-blue-800 border-blue-500" : "bg-blue-100 border-blue-300"}`
                            : ""
                        }`}
                      >
                        <span className="text-lg">{lang.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{lang.name}</div>
                          <div className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}>.{lang.ext} files</div>
                        </div>
                        {selectedLang.language === lang.language && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className={`${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600" 
                    : "bg-white border-gray-300"
                } rounded-lg border overflow-hidden`}>
                  <button
                    onClick={() => toggleFolder("uploaded")}
                    className={`flex items-center space-x-2 text-left w-full p-3 ${
                      isDarkMode 
                        ? "hover:bg-gray-600" 
                        : "hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <div className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {openFolders.uploaded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                    <Folder className="w-4 h-4 text-green-500" />
                    <span className={`font-semibold ${
                      isDarkMode ? "text-green-300" : "text-green-700"
                    }`}>Uploaded Files</span>
                    <span className={`text-xs ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    } ml-auto`}>({uploadedFiles.length})</span>
                  </button>
                  {openFolders.uploaded && (
                    <div className={`border-t ${
                      isDarkMode ? "border-gray-600" : "border-gray-300"
                    }`}>
                      {filterItems(uploadedFiles, searchQuery).map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between group border-b ${
                            isDarkMode ? "border-gray-600" : "border-gray-200"
                          } last:border-b-0 ${
                            isDarkMode ? "hover:bg-green-900" : "hover:bg-green-50"
                          } transition-colors`}
                        >
                          <button
                            onClick={() => openFile(file, "uploaded")}
                            className={`flex items-center space-x-3 text-sm flex-1 text-left p-3 ${
                              activeFile?.id === file.id 
                                ? `${isDarkMode ? "bg-green-800" : "bg-green-100"}` 
                                : ""
                            }`}
                          >
                            <FileText className="w-4 h-4 text-green-600" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{file.name}</div>
                              <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                            </div>
                          </button>
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-1 px-2">
                            {sessionId && (
                              <button
                                onClick={() => shareFile(file)}
                                className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                title="Share with collaborators"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteFile(file.id, "uploaded")}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="Delete file"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Saved Code Snippets */}
              <div className={`${
                isDarkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white border-gray-300"
              } rounded-lg border overflow-hidden`}>
                <button
                  onClick={() => toggleFolder("savedCode")}
                  className={`flex items-center space-x-2 text-left w-full p-3 ${
                    isDarkMode 
                      ? "hover:bg-gray-600" 
                      : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  <div className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {openFolders.savedCode ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <Folder className="w-4 h-4 text-purple-500" />
                  <span className={`font-semibold ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  }`}>Saved Code</span>
                  <span className={`text-xs ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  } ml-auto`}>({savedSnippets?.length || 0})</span>
                </button>
                {openFolders.savedCode && (
                  <div className={`border-t ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  }`}>
                    {savedSnippets?.length === 0 || !savedSnippets ? (
                      <div className={`p-4 text-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } text-sm`}>
                        {isLoadingSnippets ? "Loading..." : "No saved code snippets"}
                      </div>
                    ) : (
                      filterItems(savedSnippets || [], searchQuery).map((snippet) => (
                        <div
                          key={snippet._id}
                          className={`flex items-center justify-between group border-b ${
                            isDarkMode ? "border-gray-600" : "border-gray-200"
                          } last:border-b-0 ${
                            isDarkMode ? "hover:bg-purple-900" : "hover:bg-purple-50"
                          } transition-colors`}
                        >
                          <button
                            onClick={() => loadSavedSnippet(snippet)}
                            className="flex items-center space-x-3 text-sm flex-1 text-left p-3"
                          >
                            <Star className="w-4 h-4 text-yellow-500" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{snippet.filename}</div>
                              <div className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}>{snippet.language}</div>
                            </div>
                          </button>
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-1 px-2">
                            <button
                              onClick={() => deleteFile(snippet._id, "saved")}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="Delete snippet"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "collaboration":
        return (
          <div className="h-full flex flex-col overflow-x-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span>Collaboration</span>
              </h2>
              {!sessionId ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (!isUserLoggedIn()) {
                        addNotification("Please log in to use collaboration features", "warning")
                        return
                      }
                      setShowSessionModal(true)
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Start Collaboration</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg ${
                      isConnected ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm">{isConnected ? "Connected" : "Disconnected"}</span>
                    <span className="ml-auto text-sm">{users?.length || 0} users</span>
                  </div>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      showChat ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={leaveSession}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Session</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {sessionId && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Session Info</h3>
                    <div className="text-xs font-mono bg-gray-700 p-2 rounded break-all overflow-hidden">{sessionId}</div>
                    <div
                      className={`text-xs flex items-center space-x-2 mt-2 ${isConnected ? "text-green-500" : "text-red-500"}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                      <span>Status: {isConnected ? "Connected" : "Disconnected"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={copySessionLink}
                      className={`w-full px-3 py-2 text-xs rounded flex items-center space-x-2 ${
                        isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      <Link className="w-3 h-3" />
                      <span>Copy Session Link</span>
                    </button>

                    {role === "owner" && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                        <Crown className="w-3 h-3" />
                        <span>Session Owner</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Connected Users ({users?.length || 0})</h3>
                    {!users || users.length === 0 ? (
                      <div className="text-xs text-gray-500 italic p-2 text-center">
                        {isConnected ? "Waiting for users to join..." : "Disconnected from collaboration server"}
                      </div>
                    ) : (
                      users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between text-sm group p-2 rounded hover:bg-gray-700 min-w-0"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${user.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                            <span className="flex-1 truncate min-w-0">{user.name}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded flex items-center space-x-1 flex-shrink-0 ${
                                user.role === "owner"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : user.role === "editor"
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {user.role === "owner" && <Crown className="w-2 h-2" />}
                              {user.role === "editor" && <Edit3 className="w-2 h-2" />}
                              {user.role === "viewer" && <Eye className="w-2 h-2" />}
                              <span>{user.role}</span>
                            </span>
                          </div>

                          {/* Role Management (only for owner) */}
                          {role === "owner" && user.id !== localStorage.getItem("userEmail") && (
                            <div className="opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0">
                              <select
                                value={user.role}
                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                className="text-xs bg-gray-600 text-white rounded px-1 py-1"
                              >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                                <option value="owner">Owner</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "terminal":
        return (
          <div className="h-full flex flex-col overflow-x-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-green-500" />
                <span>Terminal</span>
              </h2>
              <div className="text-sm text-gray-400">Current directory: {currentDirectory}</div>
            </div>

            <div className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{terminalOutput || "Terminal ready..."}</pre>
              <div className="flex items-center mt-2">
                <span className="text-blue-400">$ </span> 
                <input
                  type="text"
                  value={terminalCommand}
                  onChange={(e) => setTerminalCommand(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      runTerminalCommand()
                    }
                  }}
                  className="bg-transparent border-none outline-none flex-1 ml-2 text-green-400"
                  placeholder="Enter command..."
                />
              </div>
            </div>
          </div>
        )

      case "saved":
        return (
          <div className="h-full flex flex-col overflow-x-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Saved Code</span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {savedSnippets?.length === 0 || !savedSnippets ? (
                <div className="text-center text-gray-400 text-sm">
                  {isLoadingSnippets ? "Loading saved snippets..." : "No saved code snippets yet"}
                </div>
              ) : (
                <div className="space-y-2">
                  {savedSnippets.map((snippet) => (
                    <button
                      key={snippet._id}
                      onClick={() => loadSavedSnippet(snippet)}
                      className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                    >
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{snippet.filename}</div>
                        <div className="text-xs text-gray-400">{snippet.language}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case "settings":
        return (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span>Settings</span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Theme Section */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-300">Theme</h3>
                <div className="space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                        {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</div>
                        <div className="text-xs text-gray-400">
                          {isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      <span className="text-xs">Toggle</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Layout Section */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-300">Layout</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
                      rightPanelOpen 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    title={rightPanelOpen ? "Hide Input/Output Panel" : "Show Input/Output Panel"}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        rightPanelOpen ? "bg-blue-700" : "bg-gray-600"
                      }`}>
                        <PanelRightOpen className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">I/O Panel</div>
                        <div className="text-xs text-gray-400">
                          {rightPanelOpen ? "Panel is visible" : "Panel is hidden"}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      rightPanelOpen 
                        ? "bg-blue-700 text-blue-200" 
                        : "bg-gray-600 text-gray-300 group-hover:bg-gray-500"
                    }`}>
                      {rightPanelOpen ? "ON" : "OFF"}
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Actions Section */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-300">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={copyCode}
                    disabled={!code.trim()}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
                      code.trim()
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-800 cursor-not-allowed opacity-50"
                    }`}
                    title={code.trim() ? "Copy current code to clipboard" : "No code to copy"}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        code.trim() ? "bg-gray-600" : "bg-gray-700"
                      }`}>
                        <Copy className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Copy Code</div>
                        <div className="text-xs text-gray-400">
                          Copy to clipboard
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      <span className="text-xs">Ctrl+C</span>
                    </div>
                  </button>

                  <button
                    onClick={downloadCode}
                    disabled={!code.trim()}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
                      code.trim()
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-800 cursor-not-allowed opacity-50"
                    }`}
                    title={code.trim() ? "Download code as file" : "No code to download"}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        code.trim() ? "bg-gray-600" : "bg-gray-700"
                      }`}>
                        <Download className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Download Code</div>
                        <div className="text-xs text-gray-400">
                          Save as .{selectedLang.ext} file
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      <span className="text-xs">Ctrl+S</span>
                    </div>
                  </button>

                  <button
                    onClick={saveCode}
                    disabled={!code.trim()}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
                      code.trim()
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-800 cursor-not-allowed opacity-50"
                    }`}
                    title={code.trim() ? "Save code to your snippets" : "No code to save"}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        code.trim() ? "bg-gray-600" : "bg-gray-700"
                      }`}>
                        <Save className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Save Code</div>
                        <div className="text-xs text-gray-400">
                          Save to snippets
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      <span className="text-xs">Ctrl+Shift+S</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Editor Settings Section */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-300">Editor</h3>
                <div className="space-y-2">
                  <div className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Current Language</div>
                        <div className="text-xs text-gray-400">
                          {selectedLang.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                      .{selectedLang.ext}
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Code Stats</div>
                        <div className="text-xs text-gray-400">
                          {code.length} chars • {code.split('\n').length} lines
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "whiteboard":
        return (
          <div className="h-full flex flex-col overflow-x-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-500" />
                <span>Whiteboard</span>
              </h2>
              {!sessionId ? (
                <div className="text-center text-gray-400 text-sm">
                  Start a collaboration session to use the whiteboard
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Drawing Tools */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-300 text-sm">Drawing Tools</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCurrentTool("pen")}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          currentTool === "pen" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <MousePointer className="w-4 h-4" />
                        <span>Pen</span>
                      </button>
                      <button
                        onClick={() => setCurrentTool("brush")}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          currentTool === "brush" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <Brush className="w-4 h-4" />
                        <span>Brush</span>
                      </button>
                      <button
                        onClick={() => setCurrentTool("rectangle")}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          currentTool === "rectangle" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <Square className="w-4 h-4" />
                        <span>Rectangle</span>
                      </button>
                      <button
                        onClick={() => setCurrentTool("circle")}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          currentTool === "circle" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <Circle className="w-4 h-4" />
                        <span>Circle</span>
                      </button>
                      <button
                        onClick={() => setCurrentTool("line")}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          currentTool === "line" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                        <span>Line</span>
                      </button>
                      <button
                        onClick={() => setCurrentTool("text")}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          currentTool === "text" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <Type className="w-4 h-4" />
                        <span>Text</span>
                      </button>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-300 text-sm">Color</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-400">{currentColor}</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB", "#A52A2A", "#808080"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setCurrentColor(color)}
                          className={`w-6 h-6 rounded border-2 transition-all ${
                            currentColor === color ? "border-white scale-110" : "border-gray-600"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stroke Width */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-300 text-sm">Stroke Width</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={currentStrokeWidth}
                        onChange={(e) => setCurrentStrokeWidth(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-400 w-8">{currentStrokeWidth}px</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-300 text-sm">Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={undoLastAction}
                        disabled={whiteboardElements.length === 0}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          whiteboardElements.length > 0
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Undo</span>
                      </button>
                      <button
                        onClick={clearWhiteboard}
                        disabled={whiteboardElements.length === 0}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          whiteboardElements.length > 0
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All</span>
                      </button>
                    </div>
                  </div>

                  {/* Canvas Info */}
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Elements: {whiteboardElements.length}</div>
                    <div>Tool: {currentTool}</div>
                    {users && users.length > 0 && (
                      <div>Collaborators: {users.length}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Whiteboard Canvas */}
            {sessionId && (
              <div className="flex-1 p-4 overflow-hidden">
                <div className="w-full h-full bg-white rounded-lg border-2 border-gray-300 relative overflow-hidden">
                  <svg
                    ref={canvasRef}
                    className="w-full h-full cursor-crosshair"
                    onMouseDown={currentTool === "rectangle" || currentTool === "circle" || currentTool === "line" 
                      ? (e) => addShape(currentTool, e) 
                      : startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  >
                    {/* Render all drawing elements */}
                    {whiteboardElements.map((element) => {
                      if (element.type === "pen" || element.type === "brush") {
                        return (
                          <path
                            key={element.id}
                            d={element.path}
                            stroke={element.color}
                            strokeWidth={element.strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )
                      } else if (element.type === "rectangle") {
                        return (
                          <rect
                            key={element.id}
                            x={element.x}
                            y={element.y}
                            width={element.width}
                            height={element.height}
                            stroke={element.color}
                            strokeWidth={element.strokeWidth}
                            fill="none"
                          />
                        )
                      } else if (element.type === "circle") {
                        return (
                          <circle
                            key={element.id}
                            cx={element.x + element.width/2}
                            cy={element.y + element.height/2}
                            r={Math.min(element.width, element.height)/2}
                            stroke={element.color}
                            strokeWidth={element.strokeWidth}
                            fill="none"
                          />
                        )
                      } else if (element.type === "line") {
                        return (
                          <line
                            key={element.id}
                            x1={element.x}
                            y1={element.y}
                            x2={element.x + element.width}
                            y2={element.y + element.height}
                            stroke={element.color}
                            strokeWidth={element.strokeWidth}
                          />
                        )
                      }
                      return null
                    })}

                    {/* Current drawing path */}
                    {isDrawing && currentPath && (
                      <path
                        d={currentPath}
                        stroke={currentColor}
                        strokeWidth={currentStrokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>

                  {/* Canvas overlay for user cursors */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Object.entries(cursors).map(([userId, cursor]) => {
                      if (userId === localStorage.getItem("userEmail")) return null
                      return (
                        <div
                          key={userId}
                          className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2 -translate-y-2"
                          style={{
                            left: cursor.x,
                            top: cursor.y,
                          }}
                        >
                          <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                            {cursor.userName}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`h-screen w-screen max-h-screen max-w-screen overflow-hidden flex ${
      isDarkMode 
        ? "bg-gray-900 text-white" 
        : "bg-gray-50 text-gray-900"
    }`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadFiles}
        multiple
        style={{ display: "none" }}
        accept=".js,.ts,.py,.java,.cpp,.c,.kt,.rs,.php,.go,.txt,.md,.json,.html,.css"
      />

      {/* Vertical Sidebar */}
      <div className={`w-16 min-w-16 max-w-16 h-full max-h-full ${
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-300"
      } border-r flex flex-col items-center py-4 space-y-2 flex-shrink-0`}>
        {/* Logo/Brand - Back to Home */}
        <button 
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center mb-4 flex-shrink-0 transition-colors"
          title="Back to Home"
        >
          <Code2 className="w-6 h-6 text-white" />
        </button>

        {/* Sidebar Items */}
        {sidebarItems.map((item) => (
          <div key={item.id} className="relative group">
            <button
              onClick={item.onClick}
              disabled={item.disabled}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 relative ${
                item.active
                  ? "bg-blue-600 text-white shadow-lg"
                  : item.disabled
                    ? `${isDarkMode ? "text-gray-500" : "text-gray-400"} cursor-not-allowed`
                    : `${isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"}`
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>

            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </div>
          </div>
        ))}

        {/* Bottom Spacer */}
        <div className="flex-1" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full max-h-full overflow-hidden flex min-w-0">
        {/* Left Panel */}
        {activePanel && !isMobile && (
          <div className={`${isTablet ? "w-80 min-w-80 max-w-80" : "w-96 min-w-96 max-w-96"} h-full max-h-full ${
            isDarkMode 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-300"
          } border-r flex flex-col overflow-hidden overflow-x-hidden flex-shrink-0`}>
            {renderPanelContent()}
          </div>
        )}

        {/* Mobile Panel Overlay */}
        {activePanel && isMobile && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => closePanelSynchronized(activePanel)} />
            <div className={`fixed left-16 top-0 bottom-0 w-80 min-w-80 max-w-80 ${
              isDarkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-300"
            } border-r z-50 flex flex-col overflow-hidden overflow-x-hidden flex-shrink-0`}>
              <div className={`flex items-center justify-between p-4 ${
                isDarkMode 
                  ? "border-gray-700" 
                  : "border-gray-300"
              } border-b flex-shrink-0`}>
                <h2 className="text-lg font-semibold truncate">{sidebarItems.find((item) => item.id === activePanel)?.label}</h2>
                <button onClick={() => closePanelSynchronized(activePanel)} className={`${
                  isDarkMode 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-600 hover:text-gray-800"
                } flex-shrink-0`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden overflow-x-hidden">{renderPanelContent()}</div>
            </div>
          </>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full max-h-full">
  {/* Top Bar */}
  <div className={`h-14 ${
    isDarkMode 
      ? "bg-gradient-to-r from-gray-800 to-gray-750 border-gray-700" 
      : "bg-gradient-to-r from-white to-gray-100 border-gray-300"
  } border-b flex items-center justify-between px-2 sm:px-4 flex-shrink-0`}>
    <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => {
            if (activePanel) {
              closePanelSynchronized(activePanel)
            } else {
              setActivePanel("files")
            }
          }}
          className={`p-2 rounded-lg ${
            isDarkMode 
              ? "text-gray-400 hover:text-white hover:bg-gray-700" 
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
          } transition-colors flex-shrink-0`}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Language Selector */}
      <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
        <span className={`text-xs ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } hidden md:block`}>Language:</span>
        <select
          value={selectedLang.name}
          onChange={(e) => {
            const lang = pistonLanguages.find((l) => l.name === e.target.value)
            handleLanguageChange(lang)
          }}
          className={`px-2 sm:px-3 py-2 ${
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white" 
              : "bg-white border-gray-300 text-gray-900"
          } border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-0 max-w-32 sm:max-w-none`}
        >
          {pistonLanguages.map((lang) => (
            <option key={lang.language} value={lang.name}>
              {lang.icon} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filename Input */}
      <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
        <span className={`text-xs ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } hidden md:block`}>File:</span>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="filename"
          className={`px-2 sm:px-3 py-2 ${
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white" 
              : "bg-white border-gray-300 text-gray-900"
          } border rounded-lg text-sm w-20 sm:w-32 md:w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
        />
        <span className={`text-xs ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } flex-shrink-0`}>.{selectedLang.ext}</span>
      </div>
    </div>

    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
      {/* User Status Indicator */}
      {(() => {
        const userEmail = localStorage.getItem("userEmail")
        const userName = localStorage.getItem("userName") || localStorage.getItem("name") || localStorage.getItem("user")
        const isLoggedIn = isUserLoggedIn()

        return (
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              isLoggedIn
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLoggedIn ? "bg-green-500" : "bg-red-500"}`} />
            <span className="truncate max-w-20 hidden sm:inline">{isLoggedIn ? userName : "Guest"}</span>
          </div>
        )
      })()}

      {/* Session Management */}
      {!sessionId ? (
        <button
          onClick={() => {
            if (!isUserLoggedIn()) {
              addNotification("Please log in to use collaboration features", "warning")
              return
            }
            setShowSessionModal(true)
          }}
          className="px-3 py-1.5 rounded-lg flex items-center space-x-2 font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Collaborate</span>
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isConnected 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span>{users?.length || 0} users</span>
          </div>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-colors ${
              showChat 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
            title="Toggle Chat"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            onClick={leaveSession}
            className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
            title="Leave Session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        <button
          onClick={executeCode}
          disabled={isExecuting || !code.trim()}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 font-medium text-sm transition-all duration-200 ${
            !isExecuting && code.trim()
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {isExecuting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span className="hidden sm:inline">Running...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Run</span>
            </>
          )}
        </button>

        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            rightPanelOpen 
              ? "bg-blue-600 text-white shadow-lg" 
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
          title="Toggle I/O Panel"
        >
          <PanelRightOpen className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

  {/* Tabs */}
  {openTabs.length > 0 && (
    <div className="border-b border-gray-700 flex overflow-x-auto bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {openTabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors flex-shrink-0 ${
            activeFile?.id === tab.data.id ? "bg-gray-700 border-b-2 border-blue-500" : ""
          }`}
          onClick={() => openFile(tab.data, tab.type)}
        >
          <FileText className="w-3 h-3 text-blue-400" />
          <span className="text-sm truncate max-w-32">{tab.data.name || tab.data.filename || "Untitled"}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeTab(tab.id)
            }}
            className="hover:text-red-400 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Editor */}
  <div className="flex-1 relative overflow-hidden">
    <Editor
      height="100%"
      defaultLanguage={getMonacoLanguage(selectedLang.ext)}
      value={code}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      theme={isDarkMode ? "vs-dark" : "vs"}
      options={{
        readOnly: false, // Allow all users to edit
        fontSize: 14,
        minimap: { enabled: !isMobile },
        wordWrap: "on",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        renderLineHighlight: "all",
        selectOnLineNumbers: true,
        roundedSelection: false,
      }}
    />
  </div>
</div>

        {/* Right Panel - I/O */}
        {rightPanelOpen && (
  <div
    className={`${
      isMobile ? "fixed inset-y-0 right-0 w-full z-40 max-w-full" : isTablet ? "w-80 min-w-80 max-w-80" : "w-96 min-w-96 max-w-96"
    } ${
      isDarkMode 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-300"
    } border-l flex flex-col overflow-hidden h-full max-h-full flex-shrink-0`}
  >
    {/* Panel Header */}
    <div className={`h-12 ${
      isDarkMode 
        ? "bg-gray-700 border-gray-600" 
        : "bg-gray-100 border-gray-300"
    } border-b flex items-center justify-between px-4 flex-shrink-0`}>
      <div className="flex items-center space-x-2">
        <Terminal className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-semibold">Input/Output</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowInputTerminal(!showInputTerminal)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            showInputTerminal 
              ? "bg-blue-600 text-white" 
              : `${isDarkMode ? "bg-gray-600 text-gray-300 hover:bg-gray-500" : "bg-gray-300 text-gray-600 hover:bg-gray-400"}`
          }`}
        >
          Input
        </button>
        <button
          onClick={() => setShowOutputTerminal(!showOutputTerminal)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            showOutputTerminal 
              ? "bg-green-600 text-white" 
              : `${isDarkMode ? "bg-gray-600 text-gray-300 hover:bg-gray-500" : "bg-gray-300 text-gray-600 hover:bg-gray-400"}`
          }`}
        >
          Output
        </button>
        {isMobile && (
          <button
            onClick={() => setRightPanelOpen(false)}
            className={`${
              isDarkMode 
                ? "text-gray-400 hover:text-white" 
                : "text-gray-600 hover:text-gray-800"
            } ml-2`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>

    {/* Panel Content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Input Section */}
      {showInputTerminal && (
        <div className={`${showOutputTerminal ? "flex-1" : "flex-1"} flex flex-col border-b border-gray-700 overflow-hidden`}>
          <div className="h-8 bg-gray-750 border-b border-gray-600 flex items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs font-medium text-blue-300">Standard Input</span>
              {stdin && stdin.length > 0 && (
                <span className="text-xs text-gray-400">({stdin.split('\n').length} lines)</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {stdin && (
                <button
                  onClick={() => setStdin("")}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  title="Clear input"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowInputTerminal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-hidden">
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter program input here..."
              className="w-full h-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white font-mono text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 overflow-auto"
              style={{ minHeight: "120px" }}
            />
          </div>
        </div>
      )}

      {/* Output Section */}
      {showOutputTerminal && (
        <div className={`${showInputTerminal ? "flex-1" : "flex-1"} flex flex-col overflow-hidden`}>
          <div className="h-8 bg-gray-750 border-b border-gray-600 flex items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isExecuting ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`}></div>
              <span className="text-xs font-medium text-green-300">Program Output</span>
              {isExecuting && (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border border-blue-400 border-t-transparent"></div>
                  <span className="text-xs text-blue-400">Running...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
                title="Copy output"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  setOutput("")
                  setExecutionDetails(null)
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors"
                title="Clear output"
              >
                Clear
              </button>
              <button
                onClick={() => setShowOutputTerminal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-auto">
            <div className="min-h-full">
              {output ? (
                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-words">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  <div className="text-center">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Run your code to see output</p>
                  </div>
                </div>
              )}

              {/* Execution Details */}
              {executionDetails && (
                <div className="mt-4 p-3 bg-gray-900 border border-gray-600 rounded-md">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full text-white font-medium ${
                        executionDetails.status === "Accepted" 
                          ? "bg-green-600" 
                          : executionDetails.status?.includes("Error") || executionDetails.status?.includes("Failed")
                            ? "bg-red-600"
                            : "bg-yellow-600"
                      }`}
                    >
                      {executionDetails.status}
                    </span>
                    <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      ⏱️ {executionDetails.time}ms
                    </span>
                    <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      💾 {executionDetails.memory}KB
                    </span>
                  </div>

                  {executionDetails.stderr && (
                    <div className="mt-3 p-2 bg-red-900/20 border border-red-600/30 rounded">
                      <div className="text-red-300 font-semibold text-xs mb-1 flex items-center">
                        <X className="w-3 h-3 mr-1" />
                        Error Output:
                      </div>
                      <pre className="text-red-200 text-xs whitespace-pre-wrap break-words overflow-auto max-h-20">
                        {executionDetails.stderr}
                      </pre>
                    </div>
                  )}

                  {executionDetails.compile_output && (
                    <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-600/30 rounded">
                      <div className="text-yellow-300 font-semibold text-xs mb-1">Compilation:</div>
                      <pre className="text-yellow-200 text-xs whitespace-pre-wrap break-words overflow-auto max-h-20">
                        {executionDetails.compile_output}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Show controls if both terminals are hidden */}
      {!showInputTerminal && !showOutputTerminal && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <Terminal className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">I/O Panel Hidden</h3>
              <p className="text-gray-500 text-sm mb-4">Both input and output terminals are hidden</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setShowInputTerminal(true)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>📥</span>
                <span>Show Input Terminal</span>
              </button>
              <button
                onClick={() => setShowOutputTerminal(true)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>📤</span>
                <span>Show Output Terminal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}
      {/* Terminal */}
      {showTerminal && (
        <div className="h-64 border-t bg-gray-900 border-gray-700">
          <div className="flex items-center justify-between p-2 bg-gray-800 text-white">
            <span className="font-semibold">Terminal - {currentDirectory}</span>
            <button onClick={() => setShowTerminal(false)} className="text-gray-400 hover:text-white">
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
                onKeyPress={(e) => e.key === "Enter" && runTerminalCommand()}
                className="bg-transparent border-none outline-none flex-1 ml-2 text-green-400"
                placeholder="Enter command..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Status Bar */}
<div className="absolute bottom-0 left-16 right-0 h-7 bg-gradient-to-r from-gray-800 to-gray-750 border-t border-gray-700 flex items-center justify-between px-4 text-xs font-medium">
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
      <span className="text-blue-400">{selectedLang.icon}</span>
      <span className="text-gray-300">{selectedLang.name}</span>
    </div>
    <div className="flex items-center space-x-1">
      <FileText className="w-3 h-3 text-gray-400" />
      <span className="text-gray-300">{filename}.{selectedLang.ext}</span>
    </div>
    {sessionId && (
      <>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-gray-400">Session:</span>
          <span className="text-gray-300 font-mono">{sessionId.substring(0, 8)}...</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3 text-gray-400" />
          <span className="text-gray-300">{users?.length || 0} users</span>
        </div>
        {role && (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            role === "owner" ? "bg-yellow-600 text-white" :
            role === "editor" ? "bg-blue-600 text-white" :
            "bg-gray-600 text-white"
          }`}>
            {role}
          </span>
        )}
      </>
    )}
  </div>

  <div className="flex items-center space-x-4">
    {saveStatus && (
      <span className={`${
        saveStatus.includes("success") ? "text-green-400" :
        saveStatus.includes("Error") || saveStatus.includes("Failed") ? "text-red-400" :
        "text-yellow-400"
      }`}>
        {saveStatus}
      </span>
    )}
    <div className="text-gray-400">
      {code.length} chars • {code.split('\n').length} lines
    </div>
  </div>
</div>

      {/* Floating Elements */}
      <FloatingElement />

      {/* Session Management Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Collaboration Session</h3>
              <button onClick={() => setShowSessionModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Create Session */}
              <div>
                <h4 className="font-medium mb-2">Create New Session</h4>
                <p className="text-sm text-gray-500 mb-3">Start a new collaborative coding session and invite others</p>
                <button
                  onClick={createSession}
                  disabled={isCreatingSession}
                  className={`w-full px-4 py-2 rounded flex items-center justify-center space-x-2 font-medium ${
                    isCreatingSession
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{isCreatingSession ? "Creating..." : "Create Session"}</span>
                </button>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-medium mb-2">Join Existing Session</h4>
                <p className="text-sm text-gray-500 mb-3">Enter a session ID to join an existing session</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={joinSessionId}
                    onChange={(e) => setJoinSessionId(e.target.value)}
                    placeholder="Enter session ID..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={joinSession}
                    disabled={isJoiningSession || !joinSessionId.trim()}
                    className={`w-full px-4 py-2 rounded flex items-center justify-center space-x-2 font-medium ${
                      isJoiningSession || !joinSessionId.trim()
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isJoiningSession ? "Joining..." : "Join Session"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Chat Panel */}
      {showChat && sessionId && (
        <div className="fixed right-4 bottom-4 w-80 h-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
          <div className="h-12 bg-gray-700 border-b border-gray-600 flex items-center justify-between px-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Chat ({users?.length || 0} users)</span>
              {isConnected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </div>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm italic">No messages yet. Start a conversation!</div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className={`${msg.type === "system" ? "text-center" : ""}`}>
                    {msg.type === "system" ? (
                      <div className="text-xs text-gray-500 italic bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {msg.message}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{msg.userName}</span>
                          <span className="text-gray-400">{msg.timestamp}</span>
                        </div>
                        <div
                          className={`text-sm p-2 rounded max-w-xs ${
                            msg.userId === localStorage.getItem("userEmail")
                              ? "bg-blue-600 text-white ml-auto"
                              : "bg-gray-700"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-600 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendChatMessage()
                  }
                }}
                placeholder={isConnected ? "Type a message..." : "Disconnected - cannot send messages"}
                disabled={!isConnected || !socket}
                className={`flex-1 px-3 py-2 text-sm rounded border ${
                  !isConnected || !socket
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
                }`}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || !isConnected || !socket}
                className={`px-3 py-2 rounded ${
                  chatInput.trim() && isConnected && socket
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs mt-1 flex items-center justify-between">
              <span className={isConnected ? "text-green-500" : "text-red-500"}>
                {isConnected ? "🟢 Connected to chat" : "🔴 Disconnected from chat"}
              </span>
              <span className="text-gray-500">{users?.length || 0} users online</span>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-72 ${
                notification.type === "success"
                  ? "bg-green-600 text-white"
                  : notification.type === "error"
                    ? "bg-red-600 text-white"
                    : notification.type === "warning"
                      ? "bg-yellow-600 text-white"
                      : "bg-blue-600 text-white"
              }`}
            >
              <span className="text-sm">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-3 text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CollaborativeCodeCompiler;
