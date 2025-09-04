import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {useCallback} from 'react';
import CollabNotifications, { useCollabNotifications } from './CollabNotifications';
// Import the Resizable component
import { Resizable } from 're-resizable';

// Define custom CSS styles for resizable components
const resizableStyle = {
  border: '1px solid transparent',
  transition: 'border-color 0.3s ease',
};

const resizableHoverStyle = {
  border: '1px dashed #3B82F6',
};

const resizeHandleStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '8px',
  cursor: 'row-resize',
};

const handleLineStyle = {
  width: '30px',
  height: '4px',
  borderRadius: '999px',
  backgroundColor: '#3B82F6',
  opacity: 0.5,
};
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
  
  // Add custom resizing state
  const [editorHeight, setEditorHeight] = useState('60vh');
  const [inputHeight, setInputHeight] = useState('128px');
  const [outputHeight, setOutputHeight] = useState('300px');
  
  // Check if user is logged in
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const isLoggedIn = !!(userEmail && userName);
  
  // Code editor states
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [status, setStatus] = useState('ready');
  const [hasCustomCode, setHasCustomCode] = useState(false);
  
  // UI states
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const [fontSize, setFontSize] = useState(14);
  
  // Collaboration states
  const [currentUser, setCurrentUser] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [userCursors, setUserCursors] = useState(new Map());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [userColors] = useState([
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ]);
  
  // Video call states
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  
  // Refs
  const chatRef = useRef(null);
  const codeEditorRef = useRef(null);
  
  // Supported languages with templates
  const languages = [
    { id: 'javascript', name: 'JavaScript', version: '18.15.0', extension: 'js' },
    { id: 'python', name: 'Python', version: '3.10.0', extension: 'py' },
    { id: 'java', name: 'Java', version: '15.0.2', extension: 'java' },
    { id: 'cpp', name: 'C++', version: '10.2.0', extension: 'cpp' },
    { id: 'c', name: 'C', version: '10.2.0', extension: 'c' },
    { id: 'go', name: 'Go', version: '1.16.2', extension: 'go' },
    { id: 'rust', name: 'Rust', version: '1.68.2', extension: 'rs' },
    { id: 'typescript', name: 'TypeScript', version: '5.0.3', extension: 'ts' },
    { id: 'php', name: 'PHP', version: '8.2.3', extension: 'php' },
    { id: 'ruby', name: 'Ruby', version: '3.0.1', extension: 'rb' }
  ];

  // Language templates
  const languageTemplates = {
    javascript: `// JavaScript - Hello World
console.log("Hello, World!");

// Example function
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,

    python: `# Python - Hello World
print("Hello, World!")

# Example function
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))

# Example class
class Calculator:
    def add(self, a, b):
        return a + b
    
    def subtract(self, a, b):
        return a - b

calc = Calculator()
print(f"5 + 3 = {calc.add(5, 3)}")`,

    java: `// Java - Hello World
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Example method call
        String greeting = greet("Developer");
        System.out.println(greeting);
        
        // Example class usage
        Calculator calc = new Calculator();
        System.out.println("5 + 3 = " + calc.add(5, 3));
    }
    
    // Example method
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    // Example class
    static class Calculator {
        public int add(int a, int b) {
            return a + b;
        }
        
        public int subtract(int a, int b) {
            return a - b;
        }
    }
}`,

    cpp: `// C++ - Hello World
#include <iostream>
#include <string>

using namespace std;

// Example function
string greet(const string& name) {
    return "Hello, " + name + "!";
}

// Example class
class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }
    
    int subtract(int a, int b) {
        return a - b;
    }
};

int main() {
    cout << "Hello, World!" << endl;
    
    // Example function call
    cout << greet("Developer") << endl;
    
    // Example class usage
    Calculator calc;
    cout << "5 + 3 = " << calc.add(5, 3) << endl;
    
    return 0;
}`,

    c: `// C - Hello World
#include <stdio.h>
#include <string.h>

// Example function
void greet(const char* name) {
    printf("Hello, %s!\\n", name);
}

// Example struct
struct Calculator {
    int (*add)(int, int);
    int (*subtract)(int, int);
};

int add_func(int a, int b) {
    return a + b;
}

int subtract_func(int a, int b) {
    return a - b;
}

int main() {
    printf("Hello, World!\\n");
    
    // Example function call
    greet("Developer");
    
    // Example struct usage
    struct Calculator calc = {add_func, subtract_func};
    printf("5 + 3 = %d\\n", calc.add(5, 3));
    
    return 0;
}`,

    go: `// Go - Hello World
package main

import "fmt"

// Example function
func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

// Example struct
type Calculator struct{}

func (c Calculator) Add(a, b int) int {
    return a + b
}

func (c Calculator) Subtract(a, b int) int {
    return a - b
}

func main() {
    fmt.Println("Hello, World!")
    
    // Example function call
    fmt.Println(greet("Developer"))
    
    // Example struct usage
    calc := Calculator{}
    fmt.Printf("5 + 3 = %d\\n", calc.Add(5, 3))
}`,

    rust: `// Rust - Hello World
use std::fmt;

// Example function
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Example struct
struct Calculator;

impl Calculator {
    fn add(&self, a: i32, b: i32) -> i32 {
        a + b
    }
    
    fn subtract(&self, a: i32, b: i32) -> i32 {
        a - b
    }
}

fn main() {
    println!("Hello, World!");
    
    // Example function call
    println!("{}", greet("Developer"));
    
    // Example struct usage
    let calc = Calculator;
    println!("5 + 3 = {}", calc.add(5, 3));
}`,

    typescript: `// TypeScript - Hello World
interface Person {
    name: string;
    age?: number;
}

// Example function with type annotations
function greet(person: Person): string {
    return \`Hello, \${person.name}!\`;
}

// Example class with TypeScript features
class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
    
    subtract(a: number, b: number): number {
        return a - b;
    }
}

// Example usage
console.log("Hello, World!");

const developer: Person = { name: "Developer", age: 25 };
console.log(greet(developer));

const calc = new Calculator();
console.log(\`5 + 3 = \${calc.add(5, 3)}\`);`,

    php: `<?php
// PHP - Hello World
echo "Hello, World!\\n";

// Example function
function greet($name) {
    return "Hello, " . $name . "!";
}

// Example class
class Calculator {
    public function add($a, $b) {
        return $a + $b;
    }
    
    public function subtract($a, $b) {
        return $a - $b;
    }
}

// Example usage
echo greet("Developer") . "\\n";

$calc = new Calculator();
echo "5 + 3 = " . $calc->add(5, 3) . "\\n";
?>`,

    ruby: `# Ruby - Hello World
puts "Hello, World!"

# Example method
def greet(name)
  "Hello, #{name}!"
end

# Example class
class Calculator
  def add(a, b)
    a + b
  end
  
  def subtract(a, b)
    a - b
  end
end

# Example usage
puts greet("Developer")

calc = Calculator.new
puts "5 + 3 = #{calc.add(5, 3)}"
`
  };

  // Additional states for floating chat
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [activeFloatingTab, setActiveFloatingTab] = useState('chat');
  const [isChatOverlayOpen, setIsChatOverlayOpen] = useState(false);
  const [activeOverlayTab, setActiveOverlayTab] = useState('chat');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [privateMessages, setPrivateMessages] = useState(new Map());
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState('');
  
  // Additional states for template management
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  // Additional refs
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastCursorPositionRef = useRef(0);

  // Check mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);
  
  // Handle orientation changes specifically for mobile
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isMobileView && isLandscape) {
        // Adjust UI for landscape mode on mobile
        const fontSize = Math.max(12, Math.min(16, Math.floor(window.innerHeight / 35)));
        setFontSize(fontSize);
      } else {
        // Reset to default for portrait
        setFontSize(14);
      }
    };
    
    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, [isMobileView]);

  // Initialize with template for default language
  useEffect(() => {
    if (!hasCustomCode && languageTemplates[language]) {
      setCode(languageTemplates[language]);
    }
  }, [language, hasCustomCode]);

  // Initialize socket connection
  useEffect(() => {
    if (!roomId) return;

    const newSocket = io(config.API_BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Get logged-in user info from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    // Generate user info using real data from localStorage
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userName || `User ${Math.floor(Math.random() * 1000)}`,
      email: userEmail || null,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || Date.now()}`,
      color: userColors[Math.floor(Math.random() * userColors.length)]
    };

    setCurrentUser(user);
    setSocket(newSocket);

    // Socket event handlers
    newSocket.on('connect', () => {
      console.log('Connected to collaboration server');
      setIsConnected(true);
      
      // Join the room
      newSocket.emit('join-room', { roomId, user });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      setIsConnected(false);
    });

    newSocket.on('room-state', (state) => {
      setCode(state.code);
      setLanguage(state.language);
      setConnectedUsers(state.users);
      setMessages(state.messages);
    });

    newSocket.on('user-joined', (user) => {
      setConnectedUsers(prev => [...prev, user]);
      const userDisplayName = user.name !== `User ${Math.floor(Math.random() * 1000)}` ? user.name : 'A user';
      addSystemMessage(`${userDisplayName} joined the session`);
    });

    newSocket.on('user-left', (data) => {
      setConnectedUsers(prev => prev.filter(u => u.socketId !== data.userId));
      setUserCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(data.userId);
        return newCursors;
      });
      const userDisplayName = data.userName !== `User ${Math.floor(Math.random() * 1000)}` ? data.userName : 'A user';
      addSystemMessage(`${userDisplayName} left the session`);
    });

    newSocket.on('code-update', (data) => {
      setCode(data.code);
    });

    newSocket.on('language-update', (data) => {
      setLanguage(data.language);
    });

    newSocket.on('cursor-update', (data) => {
      setUserCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.set(data.userId, data);
        return newCursors;
      });
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollChatToBottom();
    });

    newSocket.on('user-activity-update', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => new Set([...prev, data.userName]));
      } else {
        setTypingUsers(prev => {
          const newTyping = new Set(prev);
          newTyping.delete(data.userName);
          return newTyping;
        });
      }
    });

    newSocket.on('execution-started', (data) => {
      const userDisplayName = data.userName && !data.userName.startsWith('User ') ? data.userName : 'A user';
      addSystemMessage(`${userDisplayName} is running the code...`);
    });

    newSocket.on('execution-completed', (data) => {
      const userDisplayName = data.userName && !data.userName.startsWith('User ') ? data.userName : 'A user';
      addSystemMessage(`${userDisplayName} executed code in ${data.executionTime}ms`);
    });

    newSocket.on('execution-result', (data) => {
      // Add execution result as a system message
      const executionMessage = {
        id: `exec_${Date.now()}`,
        type: 'execution',
        content: {
          result: data.result,
          executionTime: data.executionTime,
          status: data.status,
          language: data.language || language
        },
        timestamp: new Date(),
        userId: data.userId || 'system',
        userName: data.userName || 'System',
        userColor: data.userColor
      };
      setMessages(prev => [...prev, executionMessage]);
      scrollChatToBottom();
    });

    newSocket.on('private-message', (data) => {
      const { fromUserId, fromUserName, message, toUserId } = data;
      
      // If this message is for us, add it to private messages
      if (toUserId === currentUser?.id) {
        setPrivateMessages(prev => {
          const updated = new Map(prev);
          const userMessages = updated.get(fromUserId) || [];
          updated.set(fromUserId, [...userMessages, {
            id: `pm_${Date.now()}_${Math.random()}`,
            type: 'received',
            content: message,
            timestamp: new Date(),
            fromUserId,
            fromUserName
          }]);
          return updated;
        });
      }
      
      // If this message is from us, add it to our sent messages
      if (fromUserId === currentUser?.id) {
        setPrivateMessages(prev => {
          const updated = new Map(prev);
          const userMessages = updated.get(toUserId) || [];
          updated.set(toUserId, [...userMessages, {
            id: `pm_${Date.now()}_${Math.random()}`,
            type: 'sent',
            content: message,
            timestamp: new Date(),
            toUserId,
            toUserName: data.toUserName
          }]);
          return updated;
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // Add system message helper
  const addSystemMessage = (content) => {
    const systemMessage = {
      id: `sys_${Date.now()}`,
      type: 'system',
      content,
      timestamp: new Date(),
      userId: 'system',
      userName: 'System'
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  // Scroll chat to bottom
  const scrollChatToBottom = useCallback(() => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  // Show login status notification
  useEffect(() => {
    if (currentUser) {
      if (isLoggedIn) {
        addSystemMessage(`Welcome ${userName}! You're collaborating as a logged-in user.`);
      } else {
        addSystemMessage(`You're collaborating as a guest. Log in to save your session and access more features.`);
      }
    }
  }, [currentUser, isLoggedIn, userName]);

  // Handle code changes
  const handleCodeChange = useCallback((e) => {
    const newCode = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setCode(newCode);
    setHasCustomCode(true); // Mark that user has written custom code
    lastCursorPositionRef.current = cursorPosition;

    if (socket && isConnected) {
      socket.emit('code-change', {
        roomId,
        code: newCode,
        cursorPosition,
        selection: {
          start: e.target.selectionStart,
          end: e.target.selectionEnd
        }
      });
    }
  }, [socket, isConnected, roomId]);

  // Handle cursor movement
  const handleCursorMove = useCallback((e) => {
    const cursorPosition = e.target.selectionStart;
    
    if (socket && isConnected && cursorPosition !== lastCursorPositionRef.current) {
      socket.emit('cursor-move', {
        roomId,
        cursorPosition,
        selection: {
          start: e.target.selectionStart,
          end: e.target.selectionEnd
        }
      });
      lastCursorPositionRef.current = cursorPosition;
    }
  }, [socket, isConnected, roomId]);

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Load template for new language if user hasn't written custom code
    if (!hasCustomCode && languageTemplates[newLanguage]) {
      setCode(languageTemplates[newLanguage]);
      if (socket && isConnected) {
        socket.emit('code-change', {
          roomId,
          code: languageTemplates[newLanguage],
          cursorPosition: 0,
          selection: { start: 0, end: 0 }
        });
      }
    }
    
    if (socket && isConnected) {
      socket.emit('language-change', { roomId, language: newLanguage });
    }
  };

  // Reset to template
  const resetToTemplate = () => {
    if (languageTemplates[language]) {
      setCode(languageTemplates[language]);
      setHasCustomCode(false);
      if (socket && isConnected) {
        socket.emit('code-change', {
          roomId,
          code: languageTemplates[language],
          cursorPosition: 0,
          selection: { start: 0, end: 0 }
        });
      }
      addSystemMessage(`Reset to ${languages.find(l => l.id === language)?.name} template`);
    }
  };

  // Execute code using Piston API (same as Compiler.jsx)
  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsExecuting(true);
    setOutput('');
    const startTime = Date.now();

    try {
      if (socket && isConnected) {
        socket.emit('execute-code', { roomId, code, language, input });
      }

      const selectedLang = languages.find(lang => lang.id === language);
      
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: language,
        version: selectedLang.version,
        files: [
          {
            name: `main.${selectedLang.extension}`,
            content: code
          }
        ],
        stdin: input,
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      });

      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      if (response.data.run) {
        const result = response.data.run.stdout || response.data.run.stderr || 'No output';
        setOutput(result);
        const status = response.data.run.stderr ? 'error' : 'success';
        
        if (socket && isConnected) {
          socket.emit('execution-result', {
            roomId,
            result,
            executionTime,
            status,
            userId: currentUser?.id,
            userName: currentUser?.name,
            userColor: currentUser?.color
          });
        }
      } else if (response.data.compile && response.data.compile.stderr) {
        const result = response.data.compile.stderr;
        setOutput(result);
        
        if (socket && isConnected) {
          socket.emit('execution-result', {
            roomId,
            result,
            executionTime,
            status: 'error',
            userId: currentUser?.id,
            userName: currentUser?.name,
            userColor: currentUser?.color
          });
        }
      }
    } catch (error) {
      const errorMsg = `Error: ${error.message}\nPlease check your internet connection or try again later.`;
      setOutput(errorMsg);
      
      if (socket && isConnected) {
        socket.emit('execution-result', {
          roomId,
          result: errorMsg,
          executionTime: 0,
          status: 'error',
          userId: currentUser?.id,
          userName: currentUser?.name,
          userColor: currentUser?.color
        });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    socket.emit('send-message', {
      roomId,
      message: newMessage.trim(),
      type: 'text'
    });

    setNewMessage('');
  };

  // Send private message
  const sendPrivateMessage = (toUser) => {
    if (!privateMessage.trim() || !socket || !isConnected || !toUser) return;

    socket.emit('send-private-message', {
      roomId,
      toUserId: toUser.socketId,
      toUserName: toUser.name,
      message: privateMessage.trim(),
      fromUserId: currentUser?.id,
      fromUserName: currentUser?.name
    });

    // Add to our local private messages
    setPrivateMessages(prev => {
      const updated = new Map(prev);
      const userMessages = updated.get(toUser.socketId) || [];
      updated.set(toUser.socketId, [...userMessages, {
        id: `pm_${Date.now()}_${Math.random()}`,
        type: 'sent',
        content: privateMessage.trim(),
        timestamp: new Date(),
        toUserId: toUser.socketId,
        toUserName: toUser.name
      }]);
      return updated;
    });

    setPrivateMessage('');
  };

  // Execute terminal command
  const executeTerminalCommand = () => {
    if (!terminalInput.trim()) return;

    const command = terminalInput.trim();
    const timestamp = new Date().toLocaleTimeString();
    
    // Add command to terminal output
    setTerminalOutput(prev => [
      ...prev,
      {
        type: 'command',
        content: `$ ${command}`,
        timestamp
      }
    ]);

    // Simulate command execution (in real app, this would connect to actual terminal)
    setTimeout(() => {
      let result = '';
      
      // Simple command simulation
      if (command === 'help') {
        result = 'Available commands:\n- help: Show this help\n- clear: Clear terminal\n- pwd: Show current directory\n- date: Show current date\n- echo [text]: Echo text';
      } else if (command === 'clear') {
        setTerminalOutput([]);
        setTerminalInput('');
        return;
      } else if (command === 'pwd') {
        result = '/workspace/collaborative-editor';
      } else if (command === 'date') {
        result = new Date().toString();
      } else if (command.startsWith('echo ')) {
        result = command.substring(5);
      } else if (command === 'ls') {
        result = 'main.js\npackage.json\nREADME.md\nsrc/';
      } else {
        result = `Command not found: ${command}`;
      }

      setTerminalOutput(prev => [
        ...prev,
        {
          type: 'output',
          content: result,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 300);

    setTerminalInput('');
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit('user-activity', { roomId, isTyping: true, isActive: true });
      
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('user-activity', { roomId, isTyping: false, isActive: true });
      }, 1000);
    }
  };

  // Copy room link
  const copyRoomLink = async () => {
    try {
      const link = `${window.location.origin}/collaborate?room=${roomId}`;
      await navigator.clipboard.writeText(link);
      addSystemMessage('Room link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy room link:', err);
      addSystemMessage('Failed to copy room link');
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`min-h-screen flex flex-col w-full max-w-full ${
      isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
    }`}>
      {/* Collaboration Notifications */}
      <CollabNotifications />

      {/* Header */}
      <header className={`flex flex-wrap sm:flex-nowrap items-center justify-between p-2 sm:p-4 border-b ${
        isDarkMode 
          ? 'bg-zinc-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Code2 className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`} />
            
          </div>

          {/* Connection Status */}
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

          {/* User Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isLoggedIn ? 'bg-blue-500' : 'bg-orange-500'
            }`} />
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isLoggedIn ? userName : 'Guest'}
            </span>
          </div>

          {/* Room ID */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg ${
            isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
          }`}>
            <span className={`text-sm font-mono ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {roomId}
            </span>
            <button
              onClick={copyRoomLink}
              className={`p-1 hover:scale-110 transition-transform ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 order-3 sm:order-none">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`px-2 sm:px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDarkMode 
                ? 'bg-zinc-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {isMobileView ? lang.id.substring(0, 3) : lang.name}
              </option>
            ))}
          </select>

          {/* Template Reset Button */}
          <button
            onClick={resetToTemplate}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode 
                ? 'bg-zinc-700 text-gray-400 hover:bg-zinc-600 hover:text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
            }`}
            title="Reset to template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User and Chat Toggle Icons */}
          <div className="flex items-center gap-1">
            {/* Users Toggle */}
            <button
              onClick={() => setIsUsersOpen(!isUsersOpen)}
              className={`p-2 rounded-lg transition-all relative ${
                isUsersOpen
                  ? isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDarkMode 
                    ? 'bg-zinc-700 text-gray-400 hover:bg-zinc-600 hover:text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
              }`}
              title={`${isUsersOpen ? 'Hide' : 'Show'} Users`}
            >
              <Users className="w-4 h-4" />
              {connectedUsers.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {connectedUsers.length}
                </div>
              )}
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setIsChatOverlayOpen(true)}
              className={`p-2 rounded-lg transition-all relative ${
                isChatOpen
                  ? isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDarkMode 
                    ? 'bg-zinc-700 text-gray-400 hover:bg-zinc-600 hover:text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
              }`}
              title="Open Chat Overlay"
            >
              <MessageCircle className="w-4 h-4" />
              {messages.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {messages.length > 99 ? '99+' : messages.length}
                </div>
              )}
            </button>
          </div>

          {/* Execute Button */}
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all ${
              isExecuting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            } ${
              isDarkMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isExecuting ? 'Running...' : 'Run'}
            </span>
          </button>

          {/* Users Count */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
          }`}>
            <Users className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {connectedUsers.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

              <Resizable
                defaultSize={{ width: '100%', height: '100%' }}
                minHeight="200px"
                maxHeight="80vh"
                enable={{ bottom: true }}
                handleClasses={{
                  bottom: `h-2 w-full cursor-row-resize bg-opacity-50 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-400'}`
                }}
                className="flex-1 overflow-hidden"
              >
                <textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={handleCodeChange}
                  onSelect={handleCursorMove}
                  className={`w-full h-full p-3 sm:p-4 font-mono text-sm resize-none focus:outline-none ${
                    isDarkMode 
                      ? 'bg-zinc-900 text-gray-100' 
                      : 'bg-white text-gray-900'
                  }`}
                  placeholder="Start coding together..."
                  spellCheck={false}
                  style={{ 
                    fontSize: `${fontSize}px`, 
                    lineHeight: '1.6',
                  }}
                />
              </Resizable>
            </div>

            {/* Mobile Tabs */}
            <div className={`border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 flex items-center justify-center gap-1 p-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'users'
                      ? (isDarkMode ? 'bg-zinc-800 text-white border-b-2 border-indigo-500' : 'bg-white text-gray-900 border-b-2 border-indigo-500')
                      : (isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-100 text-gray-600')
                  }`}
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Users ({connectedUsers.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 flex items-center justify-center gap-1 p-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                      ? (isDarkMode ? 'bg-zinc-800 text-white border-b-2 border-indigo-500' : 'bg-white text-gray-900 border-b-2 border-indigo-500')
                      : (isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-100 text-gray-600')
                  }`}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('output')}
                  className={`flex-1 flex items-center justify-center gap-1 p-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'output'
                      ? (isDarkMode ? 'bg-zinc-800 text-white border-b-2 border-indigo-500' : 'bg-white text-gray-900 border-b-2 border-indigo-500')
                      : (isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-100 text-gray-600')
                  }`}
                >
                  <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Output</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="h-64 overflow-hidden">
                {activeTab === 'users' && (
                  <div className={`h-full overflow-y-auto p-4 ${
                    isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'
                  }`}>
                    <div className="space-y-3">
                      {connectedUsers.map((user) => (
                        <div
                          key={user.socketId}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            isDarkMode ? 'bg-zinc-700' : 'bg-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center`}>
                            <span className="text-white text-sm font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium truncate ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                              {user.name}
                              {user.socketId === currentUser?.id && ' (You)'}
                            </div>
                            <div className={`text-xs ${
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
                  <div className="h-full flex flex-col">
                    <div className={`flex-1 p-4 ${
                      isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'
                    }`}>
                      <div className="text-center">
                        <MessageCircle className={`w-12 h-12 mx-auto mb-3 ${
                          isDarkMode ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Tap the chat button to open chat overlay
                        </p>
                        <button
                          onClick={() => setIsChatOverlayOpen(true)}
                          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Open Chat
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'output' && (
                  <Resizable
                    defaultSize={{ width: '100%', height: '100%' }}
                    minHeight="100px"
                    maxHeight="60vh"
                    onResizeStop={(e, direction, ref, d) => {
                      // Mobile output height is dynamic
                    }}
                    enable={{ bottom: true }}
                    style={{
                      ...resizableStyle,
                      height: '100%'
                    }}
                    handleComponent={{
                      bottom: (
                        <div style={resizeHandleStyle} 
                             className={`${isDarkMode ? 'hover:bg-zinc-600' : 'hover:bg-gray-300'}`}>
                          <div style={handleLineStyle}></div>
                        </div>
                      ),
                    }}
                    className="h-full"
                  >
                    <div className={`h-full p-4 overflow-y-auto ${
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
                  </Resizable>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className={`p-3 border-b ${
                isDarkMode ? 'bg-zinc-800 border-gray-700' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Code Editor
                  </span>
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

              <Resizable
                defaultSize={{ width: '100%', height: editorHeight }}
                minHeight="200px"
                maxHeight="80vh"
                onResizeStop={(e, direction, ref, d) => {
                  setEditorHeight(ref.style.height);
                }}
                enable={{ bottom: true }}
                style={{
                  ...resizableStyle,
                  position: 'relative',
                  flex: 1
                }}
                handleComponent={{
                  bottom: (
                    <div style={resizeHandleStyle} 
                         className={`${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'}`}>
                      <div style={handleLineStyle}></div>
                    </div>
                  ),
                }}
              >
                <textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={handleCodeChange}
                  onSelect={handleCursorMove}
                  className={`w-full h-full p-4 font-mono resize-none focus:outline-none ${
                    isDarkMode 
                      ? 'bg-zinc-900 text-gray-100' 
                      : 'bg-white text-gray-900'
                  }`}
                  placeholder="Start coding together..."
                  spellCheck={false}
                  style={{ lineHeight: '1.6' }}
                />
              </Resizable>
            </div>

            {/* Sidebar */}
            <div className={`w-80 border-l flex flex-col ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Code Input Section */}
              <div className={`border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className={`p-3 ${
                  isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Custom Input (for your code):
                    </label>
                    <span className={`text-xs italic ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} title="Drag the bottom edge to resize">
                      Resizable
                    </span>
                  </div>
                  <Resizable
                    defaultSize={{ width: '100%', height: inputHeight }}
                    minHeight="80px"
                    maxHeight="300px"
                    onResizeStop={(e, direction, ref, d) => {
                      setInputHeight(ref.style.height);
                    }}
                    enable={{ bottom: true }}
                    style={{
                      ...resizableStyle,
                      marginTop: '8px'
                    }}
                    handleComponent={{
                      bottom: (
                        <div style={resizeHandleStyle} 
                             className={`${isDarkMode ? 'hover:bg-zinc-600' : 'hover:bg-gray-300'}`}>
                          <div style={handleLineStyle}></div>
                        </div>
                      ),
                    }}
                  >
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter input for your code here..."
                      className={`w-full h-full p-3 text-sm rounded border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </Resizable>
                </div>
              </div>

              {/* Output Section */}
              <div className="flex-1 flex flex-col">
                <div className={`p-3 ${
                  isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Code Output:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsChatOverlayOpen(true)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        <MessageCircle className="w-3 h-3 inline mr-1" />
                        Chat
                      </button>
                      <button
                        onClick={() => setOutput('')}
                        className={`p-1 rounded hover:bg-opacity-50 ${
                          isDarkMode ? 'hover:bg-zinc-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                        }`}
                        title="Clear output"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <Resizable
                    defaultSize={{ width: '100%', height: outputHeight }}
                    minHeight="100px"
                    maxHeight="60vh"
                    onResizeStop={(e, direction, ref, d) => {
                      setOutputHeight(ref.style.height);
                    }}
                    enable={{ top: true }}
                    style={{
                      ...resizableStyle,
                      position: 'relative'
                    }}
                    handleComponent={{
                      top: (
                        <div style={{
                          ...resizeHandleStyle,
                          position: 'absolute', 
                          top: 0, 
                          zIndex: 10
                        }} 
                             className={`${isDarkMode ? 'hover:bg-zinc-600' : 'hover:bg-gray-300'}`}>
                          <div style={handleLineStyle}></div>
                        </div>
                      ),
                    }}
                  >
                    <div className={`h-full overflow-y-auto p-3 rounded border font-mono text-sm ${
                      isDarkMode 
                        ? 'bg-zinc-900 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <pre className="whitespace-pre-wrap">
                        {output || (
                          <span className={`${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            Run your code to see the output here...
                          </span>
                        )}
                      </pre>
                    </div>
                  </Resizable>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Chat Toggle Button - Always visible on mobile */}
        {isMobileView && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <button
              onClick={() => setIsChatOverlayOpen(true)}
              className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              {messages.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {messages.length > 99 ? '99+' : messages.length}
                </div>
              )}
            </button>
          </motion.div>
        )}

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
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b ${
                  isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-4">
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
                                  <div className={`flex items-center gap-2 mt-1 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    <Circle className={`w-3 h-3 fill-current ${
                                      user.isActive ? 'text-green-400' : 'text-gray-400'
                                    }`} />
                                    <span className="text-sm">
                                      {user.isActive ? 'Active' : 'Away'}
                                    </span>
                                    <span className="text-sm">•</span>
                                    <span className="text-sm">
                                      {user.email ? user.email : 'Guest user'}
                                    </span>
                                  </div>
                                </div>
                                {user.socketId !== currentUser?.id && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      className={`p-2 rounded-lg transition-colors ${
                                        isDarkMode 
                                          ? 'hover:bg-zinc-600 text-gray-400 hover:text-white' 
                                          : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                                      }`}
                                      title="Video call"
                                    >
                                      <Video className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUser(user);
                                      }}
                                      className={`p-2 rounded-lg transition-colors ${
                                        selectedUser?.socketId === user.socketId
                                          ? 'bg-blue-500 text-white'
                                          : isDarkMode 
                                            ? 'hover:bg-zinc-600 text-gray-400 hover:text-white' 
                                            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                                      }`}
                                      title="Send private message"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Private Chat Section */}
                      <div className={`w-1/2 border-l flex flex-col ${
                        isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
                      }`}>
                        {selectedUser && selectedUser.socketId !== currentUser?.id ? (
                          <>
                            {/* Private Chat Header */}
                            <div className={`p-4 border-b ${
                              isDarkMode ? 'border-zinc-700' : 'border-gray-200'
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${selectedUser.color} flex items-center justify-center`}>
                                  <span className="text-white text-sm font-bold">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h4 className={`font-medium ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    Chat with {selectedUser.name}
                                  </h4>
                                  <span className={`text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    Private conversation
                                  </span>
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

        {/* Floating Chat Panel */}
        <AnimatePresence>
          {isFloatingChatOpen && isMobileView && (
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFloatingChatOpen(false)}
            >
              <motion.div
                className={`fixed bottom-0 left-0 right-0 h-96 rounded-t-2xl shadow-2xl ${
                  isDarkMode ? 'bg-zinc-900' : 'bg-white'
                }`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Floating Chat Header */}
                <div className={`flex items-center justify-between p-4 border-b ${
                  isDarkMode ? 'border-zinc-700' : 'border-gray-200'
                }`}>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveFloatingTab('chat')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFloatingTab === 'chat'
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
                      onClick={() => setActiveFloatingTab('users')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFloatingTab === 'users'
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
                  <button
                    onClick={() => setIsFloatingChatOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-zinc-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Floating Chat Content */}
                <div className="flex-1 h-80 overflow-hidden">
                  {activeFloatingTab === 'chat' && (
                    <div className="h-full flex flex-col">
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
                                  {message.content}
                                </div>
                              ) : message.type === 'execution' ? (
                                <div className={`p-2 rounded-lg ${
                                  isDarkMode ? 'bg-zinc-700' : 'bg-gray-100'
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
                        {typingUsers.size > 0 && (
                          <div className={`text-sm italic ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                          </div>
                        )}
                      </div>
                      
                      {/* Message Input */}
                      <div className={`p-4 border-t ${
                        isDarkMode ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                              isDarkMode 
                                ? 'bg-zinc-800 border-zinc-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFloatingTab === 'users' && (
                    <div className="h-full p-4 overflow-y-auto">
                      <div className="space-y-3">
                        {connectedUsers.map((user) => (
                          <div key={user.id} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${user.color || 'bg-gray-500'} flex items-center justify-center`}>
                              <span className="text-white text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className={`font-medium ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-900'
                              }`}>
                                {user.name}
                              </div>
                              <div className={`text-xs ${
                                user.isActive 
                                  ? 'text-green-500' 
                                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {user.isActive ? 'Active' : 'Away'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
