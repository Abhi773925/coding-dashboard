import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Play, Square, Trash2, Download, Copy, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CollaborativeTerminal = ({ sessionId, socket, canExecute = true }) => {
  const { isDarkMode } = useTheme();
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [workingDirectory, setWorkingDirectory] = useState('/workspace');
  const [terminalSettings, setTerminalSettings] = useState({
    fontSize: 14,
    fontFamily: 'Monaco, Consolas, monospace',
    theme: isDarkMode ? 'dark' : 'light'
  });
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Predefined commands and their handlers
  const builtinCommands = {
    help: () => ({
      output: `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  ls            - List files and directories
  pwd           - Print working directory
  cd <dir>      - Change directory
  cat <file>    - Display file contents
  mkdir <dir>   - Create directory
  touch <file>  - Create file
  rm <file>     - Remove file
  echo <text>   - Print text
  node <file>   - Run JavaScript file
  python <file> - Run Python file
  npm <command> - Run npm command
  git <command> - Run git command
  
Use 'node --version' or 'python --version' to check versions.`,
      exitCode: 0
    }),
    
    clear: () => {
      setTerminalHistory([]);
      return { output: '', exitCode: 0 };
    },
    
    pwd: () => ({
      output: workingDirectory,
      exitCode: 0
    }),
    
    ls: () => ({
      output: `index.js
package.json
src/
  components/
  utils/
node_modules/
README.md`,
      exitCode: 0
    }),
    
    echo: (args) => ({
      output: args.join(' '),
      exitCode: 0
    }),
    
    'node --version': () => ({
      output: 'v18.17.0',
      exitCode: 0
    }),
    
    'python --version': () => ({
      output: 'Python 3.9.7',
      exitCode: 0
    }),
    
    'npm --version': () => ({
      output: '9.6.7',
      exitCode: 0
    })
  };

  useEffect(() => {
    if (socket) {
      socket.on('terminal-response', handleTerminalResponse);
      socket.on('terminal-broadcast', handleTerminalBroadcast);
      
      return () => {
        socket.off('terminal-response', handleTerminalResponse);
        socket.off('terminal-broadcast', handleTerminalBroadcast);
      };
    }
  }, [socket]);

  useEffect(() => {
    // Auto-scroll to bottom when new content is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    setTerminalSettings(prev => ({ ...prev, theme: isDarkMode ? 'dark' : 'light' }));
  }, [isDarkMode]);

  const handleTerminalResponse = useCallback((response) => {
    setTerminalHistory(prev => [...prev, {
      type: 'output',
      content: response.output,
      exitCode: response.exitCode,
      timestamp: new Date(response.timestamp),
      command: response.command
    }]);
    setIsExecuting(false);
  }, []);

  const handleTerminalBroadcast = useCallback((data) => {
    if (data.userId !== socket?.id) {
      setTerminalHistory(prev => [...prev, {
        type: 'broadcast',
        content: `${data.userName} executed: ${data.command}`,
        timestamp: new Date(),
        isRemote: true
      }]);
    }
  }, [socket]);

  const executeCommand = async (command) => {
    if (!command.trim()) return;

    const trimmedCommand = command.trim();
    
    // Add to command history
    setCommandHistory(prev => {
      const newHistory = [trimmedCommand, ...prev.filter(cmd => cmd !== trimmedCommand)];
      return newHistory.slice(0, 50); // Keep last 50 commands
    });
    setHistoryIndex(-1);

    // Add command to terminal history
    setTerminalHistory(prev => [...prev, {
      type: 'command',
      content: `$ ${trimmedCommand}`,
      timestamp: new Date(),
      workingDirectory
    }]);

    // Check for builtin commands first
    const [cmd, ...args] = trimmedCommand.split(' ');
    if (builtinCommands[cmd] || builtinCommands[trimmedCommand]) {
      const handler = builtinCommands[cmd] || builtinCommands[trimmedCommand];
      const result = handler(args);
      
      if (result.output) {
        setTerminalHistory(prev => [...prev, {
          type: 'output',
          content: result.output,
          exitCode: result.exitCode,
          timestamp: new Date()
        }]);
      }
      return;
    }

    // Handle directory changes
    if (cmd === 'cd') {
      const newDir = args[0] || '/workspace';
      setWorkingDirectory(newDir);
      setTerminalHistory(prev => [...prev, {
        type: 'output',
        content: '',
        exitCode: 0,
        timestamp: new Date()
      }]);
      return;
    }

    // For remote execution
    if (socket && canExecute) {
      setIsExecuting(true);
      socket.emit('terminal-command', {
        sessionId,
        command: trimmedCommand,
        workingDirectory
      });
    } else {
      // Mock execution for non-executable terminals
      setTimeout(() => {
        setTerminalHistory(prev => [...prev, {
          type: 'output',
          content: canExecute ? 
            `Mock output for: ${trimmedCommand}` : 
            'Command execution not allowed in this session',
          exitCode: canExecute ? 0 : 1,
          timestamp: new Date()
        }]);
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for common commands
      const commands = Object.keys(builtinCommands);
      const matches = commands.filter(cmd => cmd.startsWith(currentCommand));
      if (matches.length === 1) {
        setCurrentCommand(matches[0]);
      }
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setIsExecuting(false);
      setTerminalHistory(prev => [...prev, {
        type: 'output',
        content: '^C',
        exitCode: 130,
        timestamp: new Date()
      }]);
    }
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  const copyOutput = () => {
    const output = terminalHistory
      .map(entry => entry.content)
      .join('\n');
    navigator.clipboard.writeText(output);
  };

  const downloadLog = () => {
    const output = terminalHistory
      .map(entry => `[${entry.timestamp.toISOString()}] ${entry.content}`)
      .join('\n');
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className={`h-full flex flex-col ${
      isDarkMode ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Terminal Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Terminal
          </span>
          {isExecuting && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-xs text-yellow-500">Running...</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={clearTerminal}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Clear terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={copyOutput}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Copy output"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={downloadLog}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Download log"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Terminal settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Settings Panel */}
      {showSettings && (
        <div className={`px-4 py-2 border-b space-y-2 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <label className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Font Size:
            </label>
            <input
              type="range"
              min="10"
              max="20"
              value={terminalSettings.fontSize}
              onChange={(e) => setTerminalSettings(prev => ({ 
                ...prev, 
                fontSize: parseInt(e.target.value) 
              }))}
              className="w-20"
            />
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {terminalSettings.fontSize}px
            </span>
          </div>
        </div>
      )}

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto font-mono text-sm"
        style={{ 
          fontSize: terminalSettings.fontSize,
          fontFamily: terminalSettings.fontFamily
        }}
      >
        {/* Welcome Message */}
        {terminalHistory.length === 0 && (
          <div className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div>Welcome to Collaborative Terminal</div>
            <div>Type 'help' for available commands</div>
            <div className="mt-2">
              Current directory: <span className="text-blue-400">{workingDirectory}</span>
            </div>
          </div>
        )}

        {/* Terminal History */}
        {terminalHistory.map((entry, index) => (
          <div key={index} className="mb-1">
            {entry.type === 'command' && (
              <div className="flex items-start space-x-2">
                <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  [{formatTimestamp(entry.timestamp)}]
                </span>
                <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} font-semibold`}>
                  {entry.content}
                </span>
              </div>
            )}
            
            {entry.type === 'output' && entry.content && (
              <div className={`whitespace-pre-wrap ml-6 ${
                entry.exitCode !== 0 
                  ? isDarkMode ? 'text-red-400' : 'text-red-600'
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {entry.content}
              </div>
            )}
            
            {entry.type === 'broadcast' && (
              <div className={`italic ml-2 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {entry.content}
              </div>
            )}
          </div>
        ))}

        {/* Current Input */}
        <div className="flex items-center space-x-2">
          <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            [{formatTimestamp(new Date())}]
          </span>
          <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            $ 
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent outline-none ${
              isDarkMode ? 'text-green-400' : 'text-gray-900'
            }`}
            placeholder={canExecute ? "Enter command..." : "Read-only mode"}
            disabled={!canExecute || isExecuting}
            style={{ fontSize: terminalSettings.fontSize }}
            autoFocus
          />
          {isExecuting && (
            <button
              onClick={() => {
                setIsExecuting(false);
                // Send interrupt signal if connected to socket
                if (socket) {
                  socket.emit('terminal-interrupt', { sessionId });
                }
              }}
              className="text-red-500 hover:text-red-400"
              title="Interrupt execution"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Command Suggestions (if typing) */}
      {currentCommand && (
        <div className={`px-4 py-2 border-t text-xs ${
          isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex flex-wrap gap-2">
            {Object.keys(builtinCommands)
              .filter(cmd => cmd.startsWith(currentCommand.toLowerCase()))
              .slice(0, 5)
              .map(cmd => (
                <button
                  key={cmd}
                  onClick={() => setCurrentCommand(cmd)}
                  className={`px-2 py-1 rounded ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {cmd}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeTerminal;
