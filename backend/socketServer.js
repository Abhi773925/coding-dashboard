const { Server } = require('socket.io');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CollaborationServer {
  constructor(httpServer) {
    console.log('🚀 Initializing Collaboration Server...');
    
    this.io = new Server(httpServer, {
      cors: {
        origin: ["https://www.prepmate.site", "http://172.20.10.3:5173"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["*"],
        optionsSuccessStatus: 200
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 1e6
    });

    this.sessions = new Map(); // Active collaboration sessions
    this.userPresence = new Map(); // User presence tracking
    this.documents = new Map(); // Document storage for simple sync
    this.chatHistory = new Map(); // Chat history per session
    this.sessionRecordings = new Map(); // Session recordings
    this.snippets = new Map(); // Code snippets per session
    this.gitRepositories = new Map(); // Git repos per session
    this.packageManagers = new Map(); // Package management per session

    this.setupEventHandlers();
    this.setupServerErrorHandling();
    
    console.log('✅ Collaboration Server initialized successfully');
  }

  setupServerErrorHandling() {
    this.io.engine.on("connection_error", (err) => {
      console.error("❌ Socket.IO Connection Error:", err.req);
      console.error("❌ Error Code:", err.code);
      console.error("❌ Error Message:", err.message);
      console.error("❌ Error Context:", err.context);
    });

    this.io.on('connect_error', (error) => {
      console.error('❌ Socket.IO connect error:', error);
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`✅ User connected: ${socket.id} from ${socket.handshake.address}`);

      // Add error handling for individual socket
      socket.on('error', (error) => {
        console.error(`❌ Socket error for ${socket.id}:`, error);
      });

      socket.on('disconnect', (reason) => {
        console.log(`🔌 User disconnected: ${socket.id}, reason: ${reason}`);
        this.handleDisconnect(socket);
      });

      // Core session management
      socket.on('join-session', async (data) => {
        const { sessionId, userId, userName, role = 'viewer' } = data;
        console.log(`🔗 Join session request: ${JSON.stringify({ sessionId, userId, userName, role })}`);
        
        try {
          await this.handleJoinSession(socket, sessionId, userId, userName, role);
          console.log(`✅ Successfully joined session: ${sessionId} for user: ${userName}`);
        } catch (error) {
          console.error(`❌ Failed to join session ${sessionId}:`, error);
          socket.emit('error', { 
            message: 'Failed to join session', 
            error: error.message,
            type: 'join_session_error'
          });
        }
      });

      // Enhanced collaboration events
      socket.on('code-change', (data) => {
        this.handleCodeChange(socket, data);
      });

      socket.on('execute-code', (data) => {
        this.handleCodeExecution(socket, data);
      });

      socket.on('chat-message', (data) => {
        this.handleChatMessage(socket, data);
      });

      socket.on('share-file', (data) => {
        this.handleFileShare(socket, data);
      });

      socket.on('update-role', (data) => {
        this.handleRoleUpdate(socket, data);
      });

      // File and language synchronization
      socket.on('language-change', (data) => {
        this.handleLanguageChange(socket, data);
      });

      socket.on('file-change', (data) => {
        this.handleFileChange(socket, data);
      });

      socket.on('cursor-position', (data) => {
        this.handleCursorPosition(socket, data);
      });

      socket.on('leave-session', (sessionId) => {
        this.handleLeaveSession(socket, sessionId);
      });

      // Real-time collaboration
      socket.on('document-update', (data) => {
        this.handleDocumentUpdate(socket, data);
      });

      socket.on('cursor-update', (data) => {
        this.handleCursorUpdate(socket, data);
      });

      socket.on('selection-update', (data) => {
        this.handleSelectionUpdate(socket, data);
      });

      // File operations
      socket.on('file-operation', (data) => {
        this.handleFileOperation(socket, data);
      });

      socket.on('save-file', (data) => {
        this.handleSaveFile(socket, data);
      });

      socket.on('auto-save', (data) => {
        this.handleAutoSave(socket, data);
      });

      // Code execution and debugging
      socket.on('execute-code', (data) => {
        this.handleCodeExecution(socket, data);
      });

      socket.on('debug-code', (data) => {
        this.handleDebugCode(socket, data);
      });

      socket.on('breakpoint-update', (data) => {
        this.handleBreakpointUpdate(socket, data);
      });

      // Terminal operations
      socket.on('terminal-command', (data) => {
        this.handleTerminalCommand(socket, data);
      });

      // Chat functionality
      socket.on('chat-message', (data) => {
        this.handleChatMessage(socket, data);
      });

      // Live preview
      socket.on('start-live-preview', (data) => {
        this.handleStartLivePreview(socket, data);
      });

      socket.on('stop-live-preview', (data) => {
        this.handleStopLivePreview(socket, data);
      });

      // Version control
      socket.on('git-operation', (data) => {
        this.handleGitOperation(socket, data);
      });

      // Code quality
      socket.on('format-code', (data) => {
        this.handleFormatCode(socket, data);
      });

      socket.on('lint-code', (data) => {
        this.handleLintCode(socket, data);
      });

      // Package management
      socket.on('install-package', (data) => {
        this.handleInstallPackage(socket, data);
      });

      socket.on('uninstall-package', (data) => {
        this.handleUninstallPackage(socket, data);
      });

      // Session recording
      socket.on('start-recording', (data) => {
        this.handleStartRecording(socket, data);
      });

      socket.on('stop-recording', (data) => {
        this.handleStopRecording(socket, data);
      });

      // Code snippets
      socket.on('save-snippet', (data) => {
        this.handleSaveSnippet(socket, data);
      });

      socket.on('load-snippets', (data) => {
        this.handleLoadSnippets(socket, data);
      });

      // Search functionality
      socket.on('search-files', (data) => {
        this.handleSearchFiles(socket, data);
      });

      // Audio/Video calls
      socket.on('start-voice-call', (data) => {
        this.handleStartVoiceCall(socket, data);
      });

      socket.on('start-video-call', (data) => {
        this.handleStartVideoCall(socket, data);
      });

      socket.on('webrtc-signal', (data) => {
        this.handleWebRTCSignal(socket, data);
      });

      // Screen sharing
      socket.on('start-screen-share', (data) => {
        this.handleStartScreenShare(socket, data);
      });

      socket.on('stop-screen-share', (data) => {
        this.handleStopScreenShare(socket, data);
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // Legacy Yjs support
      socket.on('yjs-sync', (data) => {
        this.handleYjsSync(socket, data);
      });
    });
  }

  async handleJoinSession(socket, sessionId, userId, userName, role) {
    // Create session if it doesn't exist
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        users: new Map(),
        files: new Map(),
        owner: userId,
        // Current session state
        currentCode: 'console.log("Hello from collaborative session!");',
        currentLanguage: 'JavaScript (Node.js)',
        currentLanguageId: 63,
        currentFile: 'code',
        settings: {
          allowEdit: ['owner', 'editor'],
          allowView: ['owner', 'editor', 'viewer'],
          maxUsers: 10,
          features: {
            chat: true,
            voice: false,
            video: false,
            livePreview: true,
            git: false,
            terminal: true,
            debugging: false,
            recording: false
          }
        },
        createdAt: new Date(),
        lastActivity: new Date(),
        isRecording: false,
        livePreviewUrl: null,
        gitRepo: null
      });
      
      // Initialize session data
      this.chatHistory.set(sessionId, []);
      this.snippets.set(sessionId, []);
      this.documents.set(sessionId, new Map());
    }

    const session = this.sessions.get(sessionId);
    
    // Check if session is full
    if (session.users.size >= session.settings.maxUsers) {
      throw new Error('Session is full');
    }

    // Add user to session with proper role handling
    const assignedRole = session.users.size === 0 && role !== 'viewer' ? 'owner' : (role || 'viewer');
    
    session.users.set(userId, {
      id: userId,
      name: userName,
      role: assignedRole,
      socketId: socket.id,
      joinedAt: new Date(),
      isActive: true,
      cursor: null,
      selection: null
    });

    // Join socket room
    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.userId = userId;
    
    console.log(`🏠 User ${userName} joined room: ${sessionId}`);
    console.log(`👥 Room ${sessionId} now has ${this.io.sockets.adapter.rooms.get(sessionId)?.size || 0} clients`);

    // Update user presence
    this.userPresence.set(socket.id, {
      userId,
      userName,
      sessionId,
      joinedAt: new Date()
    });

    // Send session data to user
    socket.emit('session-joined', {
      users: Array.from(session.users.values()),
      role: session.users.get(userId).role,
      files: Array.from(session.files.values()),
      settings: session.settings,
      chatHistory: this.chatHistory.get(sessionId) || [],
      snippets: this.snippets.get(sessionId) || [],
      documents: Object.fromEntries(this.documents.get(sessionId) || new Map()),
      // Send current session state
      code: session.currentCode || '',
      language: session.currentLanguage || '',
      languageId: session.currentLanguageId || null,
      filename: session.currentFile || 'code'
    });

    // Notify all users (including the new user) about updated user list
    this.io.to(sessionId).emit('users-updated', {
      users: Array.from(session.users.values()),
      userJoined: userName
    });

    session.lastActivity = new Date();
    console.log(`User ${userName} joined session ${sessionId} as ${role}`);
  }

  handleDocumentUpdate(socket, data) {
    const { sessionId, docName, content, userId } = data;
    
    if (!this.sessions.has(sessionId)) return;
    
    const sessionDocs = this.documents.get(sessionId) || new Map();
    sessionDocs.set(docName, {
      content,
      lastModified: new Date(),
      lastModifiedBy: userId
    });
    this.documents.set(sessionId, sessionDocs);

    // Broadcast to other users in the session
    socket.to(sessionId).emit('document-update', {
      docName,
      content,
      userId
    });

    // Update session activity
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  handleFileOperation(socket, data) {
    const { sessionId, operation, fileName, content, path: filePath, type } = data;
    const session = this.sessions.get(sessionId);
    
    if (!session) return;

    switch (operation) {
      case 'create':
        const newFile = {
          name: fileName,
          path: filePath || fileName,
          content: content || '',
          type: type || 'plaintext',
          createdAt: new Date(),
          lastModified: new Date()
        };
        session.files.set(fileName, newFile);
        
        // Also store in documents
        const sessionDocs = this.documents.get(sessionId) || new Map();
        sessionDocs.set(fileName, { content: content || '', lastModified: new Date() });
        this.documents.set(sessionId, sessionDocs);
        break;

      case 'delete':
        session.files.delete(fileName);
        const docs = this.documents.get(sessionId);
        if (docs) {
          docs.delete(fileName);
        }
        break;

      case 'rename':
        const oldFile = session.files.get(data.oldName);
        if (oldFile) {
          oldFile.name = data.newName;
          oldFile.lastModified = new Date();
          session.files.delete(data.oldName);
          session.files.set(data.newName, oldFile);
        }
        break;

      case 'create-folder':
        // Handle folder creation
        break;

      case 'upload':
        const uploadedFile = {
          name: fileName,
          path: filePath || fileName,
          content: content,
          type: type || 'plaintext',
          createdAt: new Date(),
          lastModified: new Date(),
          uploaded: true
        };
        session.files.set(fileName, uploadedFile);
        break;
    }

    // Broadcast file operation to all users
    this.io.to(sessionId).emit('file-operation', {
      operation,
      files: Array.from(session.files.values()),
      file: operation === 'create' ? session.files.get(fileName) : null
    });
  }

  async handleCodeExecution(socket, data) {
    const { sessionId, code, language, fileName, withDebug, breakpoints } = data;
    
    try {
      let result;
      
      if (withDebug && breakpoints?.length > 0) {
        result = await this.executeCodeWithDebug(code, language, breakpoints);
      } else {
        result = await this.executeCode(code, language);
      }

      // Broadcast result to all users in session
      this.io.to(sessionId).emit('code-execution-result', {
        fileName,
        output: result.output,
        debugInfo: result.debugInfo,
        executedBy: socket.userId
      });

      // Update live preview if applicable
      if (language === 'html' || language === 'javascript') {
        this.updateLivePreview(sessionId, code, language);
      }

    } catch (error) {
      socket.emit('code-execution-result', {
        fileName,
        output: { stderr: error.message },
        error: true
      });
    }
  }

  async executeCode(code, language) {
    // Simple code execution - enhance based on your needs
    try {
      let command;
      let tempFile;

      switch (language) {
        case 'javascript':
          tempFile = path.join(__dirname, 'temp', `temp_${Date.now()}.js`);
          fs.writeFileSync(tempFile, code);
          command = `node "${tempFile}"`;
          break;
        
        case 'python':
          tempFile = path.join(__dirname, 'temp', `temp_${Date.now()}.py`);
          fs.writeFileSync(tempFile, code);
          command = `python "${tempFile}"`;
          break;
        
        default:
          throw new Error(`Language ${language} not supported`);
      }

      const output = execSync(command, { 
        timeout: 10000,
        encoding: 'utf8'
      });

      // Clean up temp file
      if (tempFile && fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

      return { output: { stdout: output } };
    } catch (error) {
      return { output: { stderr: error.message } };
    }
  }

  handleTerminalCommand(socket, data) {
    const { sessionId, command } = data;
    
    try {
      const output = execSync(command, {
        timeout: 5000,
        encoding: 'utf8',
        cwd: this.getSessionWorkspace(sessionId)
      });

      this.io.to(sessionId).emit('terminal-response', {
        command,
        output,
        timestamp: new Date()
      });
    } catch (error) {
      this.io.to(sessionId).emit('terminal-response', {
        command,
        output: error.message,
        error: true,
        timestamp: new Date()
      });
    }
  }

  handleGitOperation(socket, data) {
    const { sessionId, operation, message, branch } = data;
    
    try {
      const workspace = this.getSessionWorkspace(sessionId);
      let command;
      
      switch (operation) {
        case 'init':
          command = 'git init';
          break;
        case 'add':
          command = 'git add .';
          break;
        case 'commit':
          command = `git commit -m "${message}"`;
          break;
        case 'status':
          command = 'git status --porcelain';
          break;
        case 'branch':
          command = `git checkout -b ${branch}`;
          break;
        default:
          throw new Error(`Git operation ${operation} not supported`);
      }

      const output = execSync(command, {
        cwd: workspace,
        encoding: 'utf8'
      });

      this.io.to(sessionId).emit('git-status-update', {
        operation,
        output,
        success: true
      });
    } catch (error) {
      socket.emit('git-status-update', {
        operation,
        error: error.message,
        success: false
      });
    }
  }

  handleInstallPackage(socket, data) {
    const { sessionId, packageName, packageManager } = data;
    
    try {
      const workspace = this.getSessionWorkspace(sessionId);
      let command;
      
      switch (packageManager) {
        case 'npm':
          command = `npm install ${packageName}`;
          break;
        case 'pip':
          command = `pip install ${packageName}`;
          break;
        default:
          command = `npm install ${packageName}`;
      }

      const output = execSync(command, {
        cwd: workspace,
        encoding: 'utf8'
      });

      this.io.to(sessionId).emit('package-installed', {
        package: { name: packageName, version: 'latest' },
        output
      });
    } catch (error) {
      socket.emit('error', {
        message: `Failed to install ${packageName}: ${error.message}`
      });
    }
  }

  handleSaveSnippet(socket, data) {
    const { sessionId, snippet } = data;
    
    if (!this.snippets.has(sessionId)) {
      this.snippets.set(sessionId, []);
    }

    this.snippets.get(sessionId).push(snippet);

    this.io.to(sessionId).emit('snippet-saved', {
      snippet,
      snippets: this.snippets.get(sessionId)
    });
  }

  handleStartRecording(socket, data) {
    const { sessionId } = data;
    const session = this.sessions.get(sessionId);
    
    if (session) {
      session.isRecording = true;
      this.sessionRecordings.set(sessionId, {
        startTime: new Date(),
        events: []
      });

      this.io.to(sessionId).emit('recording-started', {
        startTime: new Date()
      });
    }
  }

  handleStopRecording(socket, data) {
    const { sessionId } = data;
    const session = this.sessions.get(sessionId);
    
    if (session) {
      session.isRecording = false;
      const recording = this.sessionRecordings.get(sessionId);
      
      if (recording) {
        recording.endTime = new Date();
        recording.duration = recording.endTime - recording.startTime;
      }

      this.io.to(sessionId).emit('recording-stopped', {
        endTime: new Date(),
        recording
      });
    }
  }

  updateLivePreview(sessionId, code, language) {
    // Generate live preview URL for HTML/JS/CSS
    if (language === 'html' || language === 'javascript') {
      const previewUrl = this.generatePreviewUrl(sessionId, code);
      this.io.to(sessionId).emit('live-preview-update', {
        url: previewUrl
      });
    }
  }

  generatePreviewUrl(sessionId, code) {
    // Simple implementation - enhance as needed
    const previewPath = path.join(__dirname, 'previews', `${sessionId}.html`);
    fs.writeFileSync(previewPath, code);
    return `/preview/${sessionId}.html`;
  }

  getSessionWorkspace(sessionId) {
    const workspacePath = path.join(__dirname, 'workspaces', sessionId);
    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath, { recursive: true });
    }
    return workspacePath;
  }

  handleLeaveSession(socket, sessionId) {
    const session = this.sessions.get(sessionId);
    if (session && socket.userId) {
      const userToRemove = session.users.get(socket.userId);
      session.users.delete(socket.userId);
      socket.leave(sessionId);
      
      // Emit updated user list to all remaining users
      this.io.to(sessionId).emit('users-updated', {
        users: Array.from(session.users.values()),
        userLeft: userToRemove?.name || this.userPresence.get(socket.id)?.userName
      });
    }
    
    this.userPresence.delete(socket.id);
  }

  handleDisconnect(socket) {
    if (socket.sessionId) {
      this.handleLeaveSession(socket, socket.sessionId);
    }
    console.log(`User disconnected: ${socket.id}`);
  }

  // Utility methods
  getActiveSessions() {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      userCount: session.users.size,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity
    }));
  }

  getUserPresence() {
    return Array.from(this.userPresence.values());
  }

  // Legacy Yjs compatibility
  handleYjsSync(socket, data) {
    const { sessionId, docName, content } = data;
    
    if (content) {
      this.handleDocumentUpdate(socket, { sessionId, docName, content, userId: socket.userId });
    } else {
      // Send current document state
      const sessionDocs = this.documents.get(sessionId);
      if (sessionDocs && sessionDocs.has(docName)) {
        const doc = sessionDocs.get(docName);
        socket.emit('document-state', {
          docName,
          content: doc.content,
          language: this.getLanguageFromFileName(docName)
        });
      }
    }
  }

  getLanguageFromFileName(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const langMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.html': 'html',
      '.css': 'css',
      '.json': 'json'
    };
    return langMap[ext] || 'plaintext';
  }

  // Additional handlers for new features
  handleCursorUpdate(socket, data) {
    socket.to(data.sessionId).emit('cursor-updated', {
      userId: socket.userId,
      cursor: data.position,
      fileName: data.fileName
    });
  }

  handleSelectionUpdate(socket, data) {
    socket.to(data.sessionId).emit('selection-updated', {
      userId: socket.userId,
      selection: data.selection,
      fileName: data.fileName
    });
  }

  handleSaveFile(socket, data) {
    this.handleDocumentUpdate(socket, data);
    socket.emit('file-saved', {
      fileName: data.fileName,
      timestamp: new Date()
    });
  }

  handleAutoSave(socket, data) {
    this.handleDocumentUpdate(socket, data);
  }

  // Enhanced collaboration handlers
  handleCodeChange(socket, data) {
    const { sessionId, code } = data;
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Update session code
    session.currentCode = code;
    session.lastActivity = new Date();

    // Broadcast to all users in session except sender
    socket.to(`session-${sessionId}`).emit('code-change', { code });
  }

  async handleCodeExecution(socket, data) {
    const { sessionId, code, language, languageId, stdin } = data;
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      // Here you would integrate with Judge0 API or your code execution service
      const axios = require('axios');
      
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          language_id: languageId,
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
        }
      );

      const result = {
        stdout: response.data.stdout,
        stderr: response.data.stderr,
        compile_output: response.data.compile_output
      };

      const details = {
        status: response.data.status?.description || "Unknown",
        time: response.data.time || "0",
        memory: Math.round((response.data.memory || 0) / 1024),
        compile_output: response.data.compile_output,
        stderr: response.data.stderr,
      };

      // Send result back to all users in session
      this.io.to(`session-${sessionId}`).emit('code-execution-result', {
        output: result,
        details: details
      });

    } catch (error) {
      socket.emit('code-execution-result', {
        output: { stderr: `Execution error: ${error.message}` },
        details: null
      });
    }
  }

  handleChatMessage(socket, data) {
    const { sessionId, message, userId, userName } = data;
    console.log(`💬 Chat message received:`, { sessionId, userId, userName, message: message.substring(0, 50) });
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error(`❌ Session not found for chat message: ${sessionId}`);
      socket.emit('error', { message: 'Session not found', type: 'chat_error' });
      return;
    }

    // Store chat message
    if (!this.chatHistory.has(sessionId)) {
      this.chatHistory.set(sessionId, []);
    }
    
    const chatMessage = {
      id: Date.now(),
      userId,
      userName,
      message,
      timestamp: new Date()
    };

    this.chatHistory.get(sessionId).push(chatMessage);
    console.log(`💬 Broadcasting chat message to room: ${sessionId}`);

    // Broadcast to all users in session (using the same room name as join)
    this.io.to(sessionId).emit('chat-message', chatMessage);
    
    // Log successful broadcast
    console.log(`✅ Chat message broadcasted successfully to ${this.io.sockets.adapter.rooms.get(sessionId)?.size || 0} clients`);
  }

  handleLanguageChange(socket, data) {
    const { sessionId, languageId, languageName, defaultCode, userId, userName } = data;
    console.log(`🔧 Language change received:`, { sessionId, languageId, languageName, userId, userName });
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error(`❌ Session not found for language change: ${sessionId}`);
      socket.emit('error', { message: 'Session not found', type: 'language_error' });
      return;
    }

    // Update session language and code
    session.currentLanguage = languageName;
    session.currentLanguageId = languageId;
    session.currentCode = defaultCode;
    session.lastActivity = new Date();

    console.log(`🔧 Broadcasting language change to room: ${sessionId}`);

    // Broadcast to all users in session except sender
    socket.to(sessionId).emit('language-change', {
      languageId,
      languageName,
      defaultCode,
      userId,
      userName
    });

    console.log(`✅ Language change broadcasted successfully`);
  }

  handleFileChange(socket, data) {
    const { sessionId, filename, code, language, userId, userName } = data;
    console.log(`📁 File change received:`, { sessionId, filename, language, userId, userName });
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error(`❌ Session not found for file change: ${sessionId}`);
      socket.emit('error', { message: 'Session not found', type: 'file_error' });
      return;
    }

    // Update session with new file
    session.currentCode = code;
    session.currentFile = filename;
    session.currentLanguage = language;
    session.lastActivity = new Date();

    console.log(`📁 Broadcasting file change to room: ${sessionId}`);

    // Broadcast to all users in session except sender
    socket.to(sessionId).emit('file-change', {
      filename,
      code,
      language,
      userId,
      userName
    });

    console.log(`✅ File change broadcasted successfully`);
  }

  handleFileShare(socket, data) {
    const { sessionId, file, userId, userName } = data;
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Add file to session
    session.files.set(file.name, {
      ...file,
      sharedBy: userId,
      sharedAt: new Date()
    });

    // Broadcast to all users in session except sender
    socket.to(`session-${sessionId}`).emit('file-shared', {
      file,
      userId,
      userName
    });
  }

  handleRoleUpdate(socket, data) {
    const { sessionId, userId, newRole } = data;
    console.log(`🔄 Role update request:`, { sessionId, userId, newRole, requesterId: socket.userId });
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error(`❌ Session not found for role update: ${sessionId}`);
      socket.emit('error', { message: 'Session not found', type: 'role_update_error' });
      return;
    }

    // Check if requester is owner
    const requester = session.users.get(socket.userId);
    if (!requester || requester.role !== 'owner') {
      console.error(`❌ Role update denied - requester is not owner:`, { 
        requesterId: socket.userId, 
        requesterRole: requester?.role 
      });
      socket.emit('error', { message: 'Only session owner can change user roles', type: 'permission_denied' });
      return;
    }

    const user = session.users.get(userId);
    if (!user) {
      console.error(`❌ User not found for role update: ${userId}`);
      socket.emit('error', { message: 'User not found in session', type: 'user_not_found' });
      return;
    }

    const oldRole = user.role;
    
    // Prevent unnecessary role updates
    if (oldRole === newRole) {
      console.log(`ℹ️ Role update skipped - user ${userId} already has role ${newRole}`);
      return;
    }

    user.role = newRole;
    user.lastActivity = new Date();

    console.log(`✅ Role updated: ${userId} from ${oldRole} to ${newRole}`);

    // Broadcast role update to all users in session including the user whose role changed
    this.io.to(sessionId).emit('role-updated', {
      userId,
      userName: user.name,
      role: newRole,
      oldRole: oldRole
    });

    // Broadcast updated user list
    this.broadcastUserList(sessionId);
    
    console.log(`📢 Role update broadcasted to room: ${sessionId}`);
  }

  handleCursorPosition(socket, data) {
    const { sessionId, position, userId, userName } = data;
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const user = session.users.get(userId);
    if (user) {
      user.cursorPosition = position;
      user.lastActivity = new Date();

      // Broadcast cursor position to others
      socket.to(`session-${sessionId}`).emit('cursor-position', {
        userId,
        userName,
        position,
        color: user.color || '#3B82F6'
      });
    }
  }

  broadcastUserList(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const users = Array.from(session.users.values()).map(user => ({
      id: user.id,
      name: user.name,
      role: user.role,
      isActive: true,
      lastActivity: user.lastActivity
    }));

    this.io.to(`session-${sessionId}`).emit('users-updated', { users });
  }
}

module.exports = CollaborationServer;
