import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
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
  ChevronDown,
  ChevronRight,
  Users,
  GripVertical
} from 'lucide-react';
import axios from 'axios';

const Compiler = () => {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState('console.log("Hello, World!");');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [status, setStatus] = useState('ready');
  const [fontSize, setFontSize] = useState(14);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const [syntaxHighlight, setSyntaxHighlight] = useState(true);
  
  // Draggable panel states
  const [isDragging, setIsDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(65); // percentage for horizontal split
  const [topPanelHeight, setTopPanelHeight] = useState(50); // percentage for vertical split
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  
  // Refs for dragging
  const containerRef = useRef(null);
  const horizontalDragRef = useRef(null);
  const verticalDragRef = useRef(null);

  // Supported languages
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

  // Simple code templates
  const codeTemplates = {
    javascript: 'console.log("Hello, World!");',
    python: 'print("Hello, World!")',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    rust: 'fn main() {\n    println!("Hello, World!");\n}',
    typescript: 'console.log("Hello, World!");',
    php: '<?php\necho "Hello, World!\\n";\n?>',
    ruby: 'puts "Hello, World!"'
  };

  // Auto-detect mobile view and handle responsive breakpoints
  useEffect(() => {
    const checkMobileView = () => {
      const width = window.innerWidth;
      setIsMobileView(width < 768);
      
      // Adjust font size based on screen size
      if (width < 640) {
        setFontSize(12); // Small mobile
      } else if (width < 768) {
        setFontSize(13); // Large mobile
      } else if (width < 1024) {
        setFontSize(14); // Tablet
      } else {
        setFontSize(14); // Desktop
      }
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Horizontal drag handlers (code editor vs input/output)
  const handleHorizontalMouseDown = (e) => {
    if (isMobileView) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    e.preventDefault();
  };

  const handleHorizontalMouseMove = (e) => {
    if (!isDragging || !containerRef.current || isMobileView) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 30% and 80%
    const constrainedWidth = Math.min(Math.max(newWidth, 30), 80);
    setLeftPanelWidth(constrainedWidth);
  };

  const handleHorizontalMouseUp = () => {
    setIsDragging(false);
  };

  // Vertical drag handlers (input vs output)
  const handleVerticalMouseDown = (e) => {
    if (isMobileView) return;
    setIsVerticalDragging(true);
    setDragStartY(e.clientY);
    e.preventDefault();
  };

  const handleVerticalMouseMove = (e) => {
    if (!isVerticalDragging || !containerRef.current || isMobileView) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const rightPanel = containerRef.current.querySelector('.right-panel');
    if (!rightPanel) return;
    
    const rightPanelRect = rightPanel.getBoundingClientRect();
    const newHeight = ((e.clientY - rightPanelRect.top) / rightPanelRect.height) * 100;
    
    // Constrain between 20% and 80%
    const constrainedHeight = Math.min(Math.max(newHeight, 20), 80);
    setTopPanelHeight(constrainedHeight);
  };

  const handleVerticalMouseUp = () => {
    setIsVerticalDragging(false);
  };

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleHorizontalMouseMove);
      document.addEventListener('mouseup', handleHorizontalMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleHorizontalMouseMove);
      document.removeEventListener('mouseup', handleHorizontalMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleHorizontalMouseMove);
      document.removeEventListener('mouseup', handleHorizontalMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  useEffect(() => {
    if (isVerticalDragging) {
      document.addEventListener('mousemove', handleVerticalMouseMove);
      document.addEventListener('mouseup', handleVerticalMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleVerticalMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleVerticalMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isVerticalDragging]);

  // Execute code using Piston API
  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setStatus('running');
    setOutput('');
    const startTime = Date.now();

    try {
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
      setExecutionTime(endTime - startTime);
      
      if (response.data.run) {
        const result = response.data.run.stdout || response.data.run.stderr || 'No output';
        setOutput(result);
        setStatus(response.data.run.stderr ? 'error' : 'success');
      } else if (response.data.compile && response.data.compile.stderr) {
        setOutput(response.data.compile.stderr);
        setStatus('error');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}\nPlease check your internet connection or try again later.`);
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(codeTemplates[newLanguage] || '');
    setInput('');
    setOutput('');
    setStatus('ready');
    setExecutionTime(null);
  };

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Syntax highlighting function
  const applySyntaxHighlight = (text) => {
    if (!syntaxHighlight) return text;
    
    const keywords = {
      javascript: ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'console'],
      python: ['def', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'print'],
      java: ['public', 'private', 'class', 'static', 'void', 'int', 'String', 'if', 'else', 'for'],
      cpp: ['#include', 'int', 'void', 'class', 'public', 'private', 'if', 'else', 'for', 'while'],
      c: ['#include', 'int', 'void', 'char', 'if', 'else', 'for', 'while', 'return'],
    };

    const langKeywords = keywords[language] || [];
    let highlightedText = text;
    
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedText = highlightedText.replace(regex, `<span class="text-blue-500 font-semibold">${keyword}</span>`);
    });
    
    // Highlight strings
    highlightedText = highlightedText.replace(/"([^"]*)"/g, '<span class="text-green-500">"$1"</span>');
    highlightedText = highlightedText.replace(/'([^']*)'/g, '<span class="text-green-500">\'$1\'</span>');
    
    // Highlight comments
    if (language === 'javascript' || language === 'java' || language === 'cpp' || language === 'c') {
      highlightedText = highlightedText.replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>');
    } else if (language === 'python') {
      highlightedText = highlightedText.replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>');
    }
    
    return highlightedText;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
    } ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className={`flex items-center justify-between p-3 sm:p-4 border-b transition-all ${
          isDarkMode 
            ? 'bg-zinc-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <Terminal className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
              <h1 className={`text-lg sm:text-xl font-bold truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {isMobileView ? 'IDE' : 'Compiler'}
              </h1>
            </div>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0 max-w-[120px] sm:max-w-none ${
                isDarkMode 
                  ? 'bg-zinc-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {isMobileView ? lang.name.slice(0, 8) + (lang.name.length > 8 ? '...' : '') : lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Status - Hide on very small screens */}
            {!isMobileView && (
              <div className="flex items-center gap-2">
                {status === 'ready' && (
                  <div className="flex items-center gap-1 text-sm text-blue-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="hidden sm:inline">Ready</span>
                  </div>
                )}
                {status === 'running' && (
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="hidden sm:inline">Running</span>
                  </div>
                )}
                {status === 'success' && (
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Success</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Error</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <button
              onClick={executeCode}
              disabled={isRunning}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                isRunning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95'
              } ${
                isDarkMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  <span className="hidden xs:inline">{isMobileView ? 'Run...' : 'Running...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Run</span>
                </>
              )}
            </button>

            <button
              onClick={copyCode}
              className={`p-1.5 sm:p-2 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {!isMobileView && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div 
          ref={containerRef} 
          className="flex-1 overflow-hidden"
        >
          {isMobileView ? (
            /* Mobile Layout - Tabbed Interface */
            <div className="flex flex-col h-full">
              {/* Code Editor */}
              <div className="h-[45vh] min-h-[300px] flex flex-col border-b border-gray-700">
                <div className={`flex items-center justify-between px-3 py-2 border-b ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-gray-700' 
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Code2 className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Code Editor
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-zinc-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {languages.find(lang => lang.id === language)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {executionTime && (
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {executionTime}ms
                      </span>
                    )}
                    <div className="flex items-center">
                      {status === 'ready' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      {status === 'running' && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>}
                      {status === 'success' && <CheckCircle className="w-3 h-3 text-green-500" />}
                      {status === 'error' && <XCircle className="w-3 h-3 text-red-500" />}
                    </div>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`flex-1 p-3 font-mono resize-none focus:outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-zinc-900 text-gray-100' 
                      : 'bg-white text-gray-900'
                  }`}
                  style={{ 
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.4'
                  }}
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </div>

              {/* Input/Output Tabs */}
              <div className="flex-1 flex flex-col">
                {/* Tab Headers */}
                <div className={`flex border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => setActiveTab('input')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all ${
                      activeTab === 'input'
                        ? (isDarkMode 
                            ? 'bg-zinc-800 text-white border-b-2 border-indigo-500' 
                            : 'bg-white text-gray-900 border-b-2 border-indigo-500')
                        : (isDarkMode 
                            ? 'bg-zinc-700 text-gray-400 hover:text-gray-300' 
                            : 'bg-gray-100 text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Input
                  </button>
                  <button
                    onClick={() => setActiveTab('output')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all ${
                      activeTab === 'output'
                        ? (isDarkMode 
                            ? 'bg-zinc-800 text-white border-b-2 border-indigo-500' 
                            : 'bg-white text-gray-900 border-b-2 border-indigo-500')
                        : (isDarkMode 
                            ? 'bg-zinc-700 text-gray-400 hover:text-gray-300' 
                            : 'bg-gray-100 text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    Output
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="flex-1 flex flex-col">
                  {activeTab === 'input' ? (
                    <div className="flex-1 flex flex-col">
                      <div className={`flex items-center justify-between px-3 py-2 ${
                        isDarkMode 
                          ? 'bg-zinc-800' 
                          : 'bg-gray-50'
                      }`}>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Program Input
                        </span>
                        <button
                          onClick={() => setInput('')}
                          className={`p-1 rounded transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-zinc-700 text-gray-400' 
                              : 'hover:bg-gray-200 text-gray-500'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`flex-1 p-3 font-mono text-sm resize-none focus:outline-none ${
                          isDarkMode 
                            ? 'bg-zinc-800 text-gray-100' 
                            : 'bg-gray-50 text-gray-900'
                        }`}
                        placeholder="Enter input for your program..."
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      <div className={`flex items-center justify-between px-3 py-2 ${
                        isDarkMode 
                          ? 'bg-zinc-800' 
                          : 'bg-gray-50'
                      }`}>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Program Output
                        </span>
                        <button
                          onClick={() => setOutput('')}
                          className={`p-1 rounded transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-zinc-700 text-gray-400' 
                              : 'hover:bg-gray-200 text-gray-500'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                      <div className={`flex-1 p-3 overflow-auto ${
                        isDarkMode 
                          ? 'bg-zinc-900' 
                          : 'bg-white'
                      }`}>
                        <pre className={`font-mono text-sm whitespace-pre-wrap ${
                          isDarkMode 
                            ? 'text-gray-100' 
                            : 'text-gray-900'
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
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Layout - Draggable Panels */
            <div className="flex h-full">
              {/* Left Panel - Code Editor */}
              <div 
                className="flex flex-col relative"
                style={{ width: `${leftPanelWidth}%` }}
              >
                <div className={`flex items-center justify-between px-4 py-2 border-b ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-gray-700' 
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Code2 className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Code Editor
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {executionTime && (
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {executionTime}ms
                      </span>
                    )}
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`flex-1 p-4 font-mono resize-none focus:outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-zinc-900 text-gray-100' 
                      : 'bg-white text-gray-900'
                  }`}
                  style={{ 
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.5'
                  }}
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </div>

              {/* Horizontal Drag Handle */}
              <div
                ref={horizontalDragRef}
                onMouseDown={handleHorizontalMouseDown}
                className={`w-1 cursor-col-resize transition-all hover:w-2 group relative ${
                  isDarkMode ? 'bg-gray-600 hover:bg-indigo-500' : 'bg-gray-300 hover:bg-indigo-500'
                } ${isDragging ? 'bg-indigo-500 w-2' : ''}`}
              >
                <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
                  <GripVertical className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </div>
              </div>

              {/* Right Panel - Input & Output */}
              <div 
                className="flex flex-col right-panel"
                style={{ width: `${100 - leftPanelWidth}%` }}
              >
                {/* Input Section */}
                <div 
                  className="flex flex-col border-b border-gray-700"
                  style={{ height: `${topPanelHeight}%` }}
                >
                  <div className={`flex items-center justify-between px-4 py-2 border-b ${
                    isDarkMode 
                      ? 'bg-zinc-800 border-gray-700' 
                      : 'bg-gray-100 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Input
                      </span>
                    </div>
                    <button
                      onClick={() => setInput('')}
                      className={`p-1 rounded transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-zinc-700 text-gray-400' 
                          : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
                      isDarkMode 
                        ? 'bg-zinc-800 text-gray-100' 
                        : 'bg-gray-50 text-gray-900'
                    }`}
                    placeholder="Enter input for your program..."
                  />
                </div>

                {/* Vertical Drag Handle */}
                <div
                  ref={verticalDragRef}
                  onMouseDown={handleVerticalMouseDown}
                  className={`h-1 cursor-row-resize transition-all hover:h-2 group relative ${
                    isDarkMode ? 'bg-gray-600 hover:bg-indigo-500' : 'bg-gray-300 hover:bg-indigo-500'
                  } ${isVerticalDragging ? 'bg-indigo-500 h-2' : ''}`}
                >
                  <div className="absolute inset-x-0 -top-1 -bottom-1 flex items-center justify-center">
                    <div className={`w-12 h-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                    }`} />
                  </div>
                </div>

                {/* Output Section */}
                <div 
                  className="flex flex-col"
                  style={{ height: `${100 - topPanelHeight}%` }}
                >
                  <div className={`flex items-center justify-between px-4 py-2 border-b ${
                    isDarkMode 
                      ? 'bg-zinc-800 border-gray-700' 
                      : 'bg-gray-100 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Terminal className={`w-4 h-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Output
                      </span>
                    </div>
                    <button
                      onClick={() => setOutput('')}
                      className={`p-1 rounded transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-zinc-700 text-gray-400' 
                          : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  <div className={`flex-1 p-4 overflow-auto ${
                    isDarkMode 
                      ? 'bg-zinc-900' 
                      : 'bg-white'
                  }`}>
                    <pre className={`font-mono text-sm whitespace-pre-wrap ${
                      isDarkMode 
                        ? 'text-gray-100' 
                        : 'text-gray-900'
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

        {/* Mobile Bottom Actions */}
        {isMobileView && (
          <div className={`flex items-center gap-2 p-3 border-t ${
            isDarkMode 
              ? 'bg-zinc-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={executeCode}
              disabled={isRunning}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                isRunning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-95'
              } ${
                isDarkMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-semibold">Run Code</span>
                </>
              )}
            </button>

            <button
              onClick={copyCode}
              className={`px-4 py-3 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title="Copy Code"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Mobile Settings Button */}
            <button
              onClick={() => {
                // Toggle font size on mobile
                setFontSize(prev => prev === 12 ? 14 : 12);
              }}
              className={`px-4 py-3 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title="Toggle Font Size"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;