const { Server } = require('socket.io');
const CollaborationSession = require('../models/CollaborationSession');
const SessionAnalytics = require('../models/SessionAnalytics');

class CollaborationService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: ["https://www.prepmate.site", "http://172.20.10.3:5173", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Store active collaboration rooms (in-memory for real-time features)
    this.rooms = new Map();
    this.users = new Map(); // socketId -> user info

    this.setupSocketHandlers();
    this.setupPeriodicTasks();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user joining a collaboration room
      socket.on('join-room', async (data) => {
        const { roomId, user } = data;
        
        try {
          // Store user info
          this.users.set(socket.id, {
            ...user,
            socketId: socket.id,
            joinedAt: new Date(),
            isActive: true
          });

          // Join the room
          socket.join(roomId);

          // Find or create session in database
          let session = await CollaborationSession.findByRoomId(roomId);
          
          if (!session) {
            // Create new session in database
            session = new CollaborationSession({
              roomId,
              title: `Session ${roomId}`,
              currentCode: '// Welcome to collaborative coding!\nconsole.log("Hello, World!");',
              language: 'javascript',
              createdByGuest: user.id,
              settings: {
                allowGuestAccess: true,
                maxParticipants: 10
              }
            });
            await session.save();
          }

          // Add participant to database session
          await session.addParticipant({
            guestId: user.id,
            name: user.name,
            email: user.email
          });

          // Initialize or update in-memory room
          if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
              id: roomId,
              code: session.currentCode,
              language: session.language,
              users: new Map(),
              messages: session.chatMessages.slice(-50), // Last 50 messages
              createdAt: session.createdAt,
              lastActivity: new Date(),
              dbSession: session
            });
          }

          const room = this.rooms.get(roomId);
          room.users.set(socket.id, this.users.get(socket.id));
          room.lastActivity = new Date();

          // Update analytics
          await SessionAnalytics.updateDailyStats(user.id, true, { sessionsJoined: 1 });

          // Send current room state to the new user
          socket.emit('room-state', {
            code: room.code,
            language: room.language,
            users: Array.from(room.users.values()),
            messages: room.messages
          });

          // Notify other users about the new participant
          socket.to(roomId).emit('user-joined', this.users.get(socket.id));

          console.log(`User ${user.name} joined room ${roomId}`);
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Handle code changes
      socket.on('code-change', async (data) => {
        const { roomId, code, cursorPosition, selection } = data;
        const room = this.rooms.get(roomId);
        const user = this.users.get(socket.id);
        
        if (room && user) {
          // Update room code
          room.code = code;
          room.lastActivity = new Date();

          try {
            // Update database session
            const session = await CollaborationSession.findByRoomId(roomId);
            if (session) {
              await session.updateCode(code, null, {
                guestId: user.id,
                name: user.name
              });
              
              // Update analytics
              await SessionAnalytics.updateDailyStats(user.id, true, { codeChangesMade: 1 });
            }
          } catch (error) {
            console.error('Error updating code in database:', error);
          }

          // Broadcast to other users in the room
          socket.to(roomId).emit('code-update', {
            code,
            cursorPosition,
            selection,
            userId: socket.id,
            timestamp: new Date()
          });
        }
      });

      // Handle language changes
      socket.on('language-change', async (data) => {
        const { roomId, language } = data;
        const room = this.rooms.get(roomId);
        const user = this.users.get(socket.id);
        
        if (room && user) {
          room.language = language;
          room.lastActivity = new Date();

          try {
            // Update database session
            const session = await CollaborationSession.findByRoomId(roomId);
            if (session) {
              await session.updateCode(room.code, language, {
                guestId: user.id,
                name: user.name
              });
              
              // Update language analytics
              await SessionAnalytics.updateLanguageStats(user.id, true, language, 0);
            }
          } catch (error) {
            console.error('Error updating language in database:', error);
          }

          // Broadcast to all users in the room
          this.io.to(roomId).emit('language-update', {
            language,
            userId: socket.id,
            timestamp: new Date()
          });
        }
      });

      // Handle cursor movements
      socket.on('cursor-move', (data) => {
        const { roomId, cursorPosition, selection } = data;
        const user = this.users.get(socket.id);
        
        if (user) {
          user.cursorPosition = cursorPosition;
          user.selection = selection;
          user.lastSeen = new Date();

          // Broadcast cursor position to other users
          socket.to(roomId).emit('cursor-update', {
            userId: socket.id,
            userName: user.name,
            userColor: user.color,
            cursorPosition,
            selection,
            timestamp: new Date()
          });
        }
      });

      // Handle chat messages
      socket.on('send-message', async (data) => {
        const { roomId, message, type = 'text' } = data;
        const room = this.rooms.get(roomId);
        const user = this.users.get(socket.id);
        
        if (room && user) {
          const chatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            content: message,
            userId: socket.id,
            userName: user.name,
            userAvatar: user.avatar,
            userColor: user.color,
            timestamp: new Date(),
            reactions: [],
            sender: {
              guestId: user.id,
              name: user.name,
              avatar: user.avatar,
              color: user.color
            }
          };

          room.messages.push(chatMessage);
          room.lastActivity = new Date();

          // Keep only last 100 messages in memory
          if (room.messages.length > 100) {
            room.messages = room.messages.slice(-100);
          }

          try {
            // Save message to database
            const session = await CollaborationSession.findByRoomId(roomId);
            if (session) {
              await session.addMessage(chatMessage);
              
              // Update analytics
              await SessionAnalytics.updateDailyStats(user.id, true, { messagesSent: 1 });
            }
          } catch (error) {
            console.error('Error saving message to database:', error);
          }

          // Broadcast message to all users in the room
          this.io.to(roomId).emit('new-message', chatMessage);
        }
      });

      // Handle private messages
      socket.on('send-private-message', (data) => {
        const { roomId, toUserId, toUserName, message, fromUserId, fromUserName } = data;
        const user = this.users.get(socket.id);
        
        if (user && toUserId) {
          const privateMessage = {
            id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'private',
            content: message,
            fromUserId: socket.id,
            fromUserName: user.name,
            fromUserColor: user.color,
            toUserId,
            toUserName,
            timestamp: new Date()
          };

          // Send to the target user
          this.io.to(toUserId).emit('private-message', privateMessage);
          
          // Send back to sender for confirmation
          socket.emit('private-message', privateMessage);
          
          console.log(`Private message from ${user.name} to ${toUserName}: ${message}`);
        }
      });

      // Handle code execution
      socket.on('execute-code', (data) => {
        const { roomId, code, language, input } = data;
        const user = this.users.get(socket.id);
        
        if (user) {
          // Broadcast execution start to other users
          socket.to(roomId).emit('execution-started', {
            userId: socket.id,
            userName: user.name,
            timestamp: new Date()
          });
        }
      });

      // Handle execution results
      socket.on('execution-result', async (data) => {
        const { roomId, result, executionTime, status } = data;
        const user = this.users.get(socket.id);
        const room = this.rooms.get(roomId);
        
        if (user && room) {
          try {
            // Save execution to database
            const session = await CollaborationSession.findByRoomId(roomId);
            if (session) {
              await session.addExecution({
                code: room.code,
                language: room.language,
                input: data.input || '',
                output: result,
                executionTime,
                status,
                executedBy: {
                  guestId: user.id,
                  name: user.name
                }
              });
              
              // Update analytics
              await SessionAnalytics.updateDailyStats(user.id, true, { codeExecutions: 1 });
              await SessionAnalytics.updateLanguageStats(user.id, true, room.language, 0, 1);
            }
          } catch (error) {
            console.error('Error saving execution to database:', error);
          }

          // Broadcast execution result to other users
          socket.to(roomId).emit('execution-completed', {
            userId: socket.id,
            userName: user.name,
            result,
            executionTime,
            status,
            timestamp: new Date()
          });

          // Add execution result as a chat message
          if (room) {
            const resultMessage = {
              id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              messageId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: 'execution',
              content: {
                result,
                executionTime,
                status,
                language: room.language
              },
              userId: socket.id,
              userName: user.name,
              userAvatar: user.avatar,
              userColor: user.color,
              timestamp: new Date(),
              reactions: [],
              sender: {
                guestId: user.id,
                name: user.name,
                avatar: user.avatar,
                color: user.color
              }
            };

            room.messages.push(resultMessage);
            
            try {
              // Save execution message to database
              const session = await CollaborationSession.findByRoomId(roomId);
              if (session) {
                await session.addMessage(resultMessage);
              }
            } catch (error) {
              console.error('Error saving execution message:', error);
            }
            
            this.io.to(roomId).emit('new-message', resultMessage);
          }
        }
      });

      // Handle video call signals
      socket.on('video-call-request', (data) => {
        const { roomId, targetUserId } = data;
        const user = this.users.get(socket.id);
        
        if (user) {
          socket.to(targetUserId).emit('incoming-video-call', {
            from: user,
            roomId
          });
        }
      });

      socket.on('video-call-response', (data) => {
        const { accepted, targetUserId, roomId } = data;
        socket.to(targetUserId).emit('video-call-answered', {
          accepted,
          roomId
        });
      });

      socket.on('video-signal', (data) => {
        const { targetUserId, signal, roomId } = data;
        socket.to(targetUserId).emit('video-signal', {
          signal,
          from: socket.id,
          roomId
        });
      });

      // Handle user activity status
      socket.on('user-activity', (data) => {
        const { roomId, isTyping, isActive } = data;
        const user = this.users.get(socket.id);
        
        if (user) {
          user.isTyping = isTyping;
          user.isActive = isActive;
          user.lastSeen = new Date();

          socket.to(roomId).emit('user-activity-update', {
            userId: socket.id,
            userName: user.name,
            isTyping,
            isActive,
            timestamp: new Date()
          });
        }
      });

      // Handle message reactions
      socket.on('react-to-message', (data) => {
        const { roomId, messageId, reaction } = data;
        const room = this.rooms.get(roomId);
        const user = this.users.get(socket.id);
        
        if (room && user) {
          const message = room.messages.find(msg => msg.id === messageId);
          if (message) {
            const existingReaction = message.reactions.find(r => r.userId === socket.id);
            
            if (existingReaction) {
              if (existingReaction.reaction === reaction) {
                // Remove reaction
                message.reactions = message.reactions.filter(r => r.userId !== socket.id);
              } else {
                // Update reaction
                existingReaction.reaction = reaction;
              }
            } else {
              // Add new reaction
              message.reactions.push({
                userId: socket.id,
                userName: user.name,
                reaction,
                timestamp: new Date()
              });
            }

            this.io.to(roomId).emit('message-reaction-update', {
              messageId,
              reactions: message.reactions
            });
          }
        }
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        const user = this.users.get(socket.id);
        
        if (user) {
          console.log(`User ${user.name} disconnected`);

          try {
            // Update session analytics
            const sessionDuration = new Date() - user.joinedAt;
            await SessionAnalytics.updateDailyStats(user.id, true, { 
              totalTimeSpent: sessionDuration 
            });

            // Remove user from all rooms and update database
            for (const [roomId, room] of this.rooms.entries()) {
              if (room.users.has(socket.id)) {
                room.users.delete(socket.id);
                
                // Update database session
                const session = await CollaborationSession.findByRoomId(roomId);
                if (session) {
                  await session.removeParticipant(user.id, true);
                }
                
                // Notify other users
                socket.to(roomId).emit('user-left', {
                  userId: socket.id,
                  userName: user.name
                });

                // Clean up empty rooms
                if (room.users.size === 0) {
                  // Mark session as inactive in database if no users
                  if (session) {
                    session.isActive = false;
                    await session.save();
                  }
                  
                  this.rooms.delete(roomId);
                  console.log(`Room ${roomId} deleted (empty)`);
                }
              }
            }
          } catch (error) {
            console.error('Error during user disconnect:', error);
          }

          this.users.delete(socket.id);
        }
      });

      // Handle room creation
      socket.on('create-room', async (data) => {
        const { user, isPrivate = false, name = "Collaborative Session", description = "", maxUsers = 10 } = data;
        const roomId = this.generateRoomId();
        
        // Store user info
        this.users.set(socket.id, {
          ...user,
          socketId: socket.id,
          joinedAt: new Date(),
          isActive: true
        });

        // Create new room
        const room = {
          id: roomId,
          name: name,
          description: description,
          isPrivate: isPrivate,
          isPublic: !isPrivate,
          maxUsers: maxUsers,
          code: '// Welcome to collaborative coding!\nconsole.log("Hello, World!");',
          language: 'javascript',
          users: new Map(),
          messages: [],
          createdAt: new Date(),
          lastActivity: new Date(),
          createdBy: socket.id
        };

        this.rooms.set(roomId, room);
        room.users.set(socket.id, this.users.get(socket.id));

        // Try to create a database session
        try {
          const session = new CollaborationSession({
            roomId,
            title: name,
            description: description,
            createdByGuest: user.id,
            settings: {
              isPublic: !isPrivate,
              allowGuestAccess: true,
              maxParticipants: maxUsers
            }
          });
          await session.save();
          room.dbSession = session;
          
          // Add participant to database session
          await session.addParticipant({
            guestId: user.id,
            name: user.name,
            email: user.email
          });
        } catch (error) {
          console.error('Error creating database session:', error);
        }

        socket.join(roomId);
        socket.emit('room-created', { roomId, room });

        console.log(`Room ${roomId} created by ${user.name}`);
      });

      // Get room info
      socket.on('get-room-info', (roomId) => {
        const room = this.rooms.get(roomId);
        if (room) {
          socket.emit('room-info', {
            id: room.id,
            userCount: room.users.size,
            createdAt: room.createdAt,
            lastActivity: room.lastActivity,
            language: room.language
          });
        } else {
          socket.emit('room-not-found', { roomId });
        }
      });
    });
  }

  setupPeriodicTasks() {
    // Clean up inactive sessions every 30 minutes
    setInterval(async () => {
      try {
        console.log('Running periodic session cleanup...');
        await this.cleanupInactiveRooms();
        await this.cleanupDatabaseSessions();
      } catch (error) {
        console.error('Error during periodic cleanup:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Update session analytics every 5 minutes
    setInterval(async () => {
      try {
        await this.updateActiveSessionAnalytics();
      } catch (error) {
        console.error('Error updating session analytics:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  async cleanupDatabaseSessions() {
    try {
      // Mark sessions as inactive if they haven't been active for 2 hours
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      
      const result = await CollaborationSession.updateMany(
        {
          lastActivity: { $lt: twoHoursAgo },
          isActive: true
        },
        {
          $set: { isActive: false }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`Marked ${result.modifiedCount} sessions as inactive`);
      }

      // Remove participants who haven't been seen for 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      await CollaborationSession.updateMany(
        {
          'participants.lastSeen': { $lt: oneHourAgo },
          'participants.isActive': true
        },
        {
          $set: {
            'participants.$.isActive': false,
            'participants.$.leftAt': new Date()
          }
        }
      );

    } catch (error) {
      console.error('Database cleanup error:', error);
    }
  }

  async updateActiveSessionAnalytics() {
    try {
      // Update time spent for active users
      for (const [socketId, user] of this.users.entries()) {
        if (user.isActive && user.joinedAt) {
          const currentSessionTime = new Date() - user.joinedAt;
          
          // Update daily analytics with current session time
          await SessionAnalytics.updateDailyStats(user.id, true, {
            totalTimeSpent: Math.min(currentSessionTime, 5 * 60 * 1000) // Max 5 minutes per update
          });

          // Update language time if user is in a room
          for (const [roomId, room] of this.rooms.entries()) {
            if (room.users.has(socketId)) {
              await SessionAnalytics.updateLanguageStats(
                user.id, 
                true, 
                room.language, 
                Math.min(currentSessionTime, 5 * 60 * 1000)
              );
              break; // User can only be in one room at a time
            }
          }
        }
      }
    } catch (error) {
      console.error('Analytics update error:', error);
    }
  }

  generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Get room statistics
  getRoomStats() {
    const stats = {
      totalRooms: this.rooms.size,
      totalUsers: this.users.size,
      roomDetails: []
    };

    for (const [roomId, room] of this.rooms.entries()) {
      stats.roomDetails.push({
        id: roomId,
        userCount: room.users.size,
        messageCount: room.messages.length,
        language: room.language,
        createdAt: room.createdAt,
        lastActivity: room.lastActivity
      });
    }

    return stats;
  }

  // Clean up inactive rooms (called periodically)
  async cleanupInactiveRooms() {
    const now = new Date();
    const inactiveThreshold = 2 * 60 * 60 * 1000; // 2 hours

    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.lastActivity > inactiveThreshold && room.users.size === 0) {
        try {
          // Mark database session as inactive
          const session = await CollaborationSession.findByRoomId(roomId);
          if (session) {
            session.isActive = false;
            await session.save();
          }
          
          this.rooms.delete(roomId);
          console.log(`Cleaned up inactive room: ${roomId}`);
        } catch (error) {
          console.error(`Error cleaning up room ${roomId}:`, error);
        }
      }
    }
  }
}

module.exports = CollaborationService;
