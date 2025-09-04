const CollaborationSession = require('../models/CollaborationSession');
const SessionAnalytics = require('../models/SessionAnalytics');
const User = require('../models/User');

class SessionController {
  // Create a new collaboration session
  static async createSession(req, res) {
    try {
      const { title, description, settings } = req.body;
      const userId = req.user?.id;
      const guestId = req.body.guestId;
      
      // Generate unique room ID
      const roomId = generateRoomId();
      
      const sessionData = {
        roomId,
        title: title || 'Untitled Session',
        description: description || '',
        settings: {
          isPublic: settings?.isPublic || false,
          allowGuestAccess: settings?.allowGuestAccess || true,
          maxParticipants: settings?.maxParticipants || 10,
          autoSave: settings?.autoSave || true
        }
      };

      if (userId) {
        sessionData.createdBy = userId;
      } else if (guestId) {
        sessionData.createdByGuest = guestId;
      }

      const session = new CollaborationSession(sessionData);
      await session.save();

      // Update analytics
      if (userId) {
        await SessionAnalytics.updateDailyStats(userId, false, { sessionsCreated: 1 });
      } else if (guestId) {
        await SessionAnalytics.updateDailyStats(guestId, true, { sessionsCreated: 1 });
      }

      res.status(201).json({
        success: true,
        session: {
          roomId: session.roomId,
          title: session.title,
          description: session.description,
          settings: session.settings,
          createdAt: session.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create session',
        error: error.message
      });
    }
  }

  // Get session by room ID
  static async getSession(req, res) {
    try {
      const { roomId } = req.params;
      
      const session = await CollaborationSession.findByRoomId(roomId)
        .populate('createdBy', 'name email avatar')
        .populate('participants.userId', 'name email avatar');

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      res.json({
        success: true,
        session: {
          roomId: session.roomId,
          title: session.title,
          description: session.description,
          createdBy: session.createdBy,
          createdByGuest: session.createdByGuest,
          participants: session.getActiveParticipants(),
          currentCode: session.currentCode,
          language: session.language,
          settings: session.settings,
          stats: session.getSessionStats(),
          createdAt: session.createdAt,
          lastActivity: session.lastActivity
        }
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch session',
        error: error.message
      });
    }
  }

  // Join a session
  static async joinSession(req, res) {
    try {
      const { roomId } = req.params;
      const { name, email } = req.body;
      const userId = req.user?.id;
      const guestId = req.body.guestId;

      const session = await CollaborationSession.findByRoomId(roomId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Check if session is at capacity
      const activeParticipants = session.getActiveParticipants();
      if (activeParticipants.length >= session.settings.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Session is at maximum capacity'
        });
      }

      // Add participant
      const participant = {
        name: name || req.user?.name || `Guest ${Date.now()}`,
        email: email || req.user?.email
      };

      if (userId) {
        participant.userId = userId;
      } else if (guestId) {
        participant.guestId = guestId;
      }

      await session.addParticipant(participant);

      // Update analytics
      if (userId) {
        await SessionAnalytics.updateDailyStats(userId, false, { sessionsJoined: 1 });
      } else if (guestId) {
        await SessionAnalytics.updateDailyStats(guestId, true, { sessionsJoined: 1 });
      }

      res.json({
        success: true,
        message: 'Successfully joined session',
        session: {
          roomId: session.roomId,
          currentCode: session.currentCode,
          language: session.language,
          participants: session.getActiveParticipants()
        }
      });
    } catch (error) {
      console.error('Error joining session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to join session',
        error: error.message
      });
    }
  }

  // Leave a session
  static async leaveSession(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user?.id || req.body.guestId;
      const isGuest = !req.user?.id;

      const session = await CollaborationSession.findByRoomId(roomId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      await session.removeParticipant(userId, isGuest);

      // Update analytics - calculate time spent
      const participant = session.participants.find(p => 
        isGuest ? p.guestId === userId : (p.userId && p.userId.toString() === userId)
      );

      if (participant) {
        const timeSpent = new Date() - participant.joinedAt;
        if (userId) {
          await SessionAnalytics.updateDailyStats(userId, isGuest, { totalTimeSpent: timeSpent });
        }
      }

      res.json({
        success: true,
        message: 'Successfully left session'
      });
    } catch (error) {
      console.error('Error leaving session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to leave session',
        error: error.message
      });
    }
  }

  // Get user's session history
  static async getUserSessions(req, res) {
    try {
      const userId = req.user?.id || req.query.guestId;
      const isGuest = !req.user?.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const sessions = await CollaborationSession.findUserSessions(userId, isGuest)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy', 'name email avatar')
        .select('roomId title description createdAt lastActivity language metadata participants settings');

      const totalSessions = await CollaborationSession.countDocuments(
        isGuest ? { 'participants.guestId': userId } : {
          $or: [
            { createdBy: userId },
            { 'participants.userId': userId }
          ]
        }
      );

      res.json({
        success: true,
        sessions: sessions.map(session => ({
          roomId: session.roomId,
          title: session.title,
          description: session.description,
          createdBy: session.createdBy,
          createdAt: session.createdAt,
          lastActivity: session.lastActivity,
          language: session.language,
          participantCount: session.participants.length,
          stats: session.getSessionStats(),
          isActive: session.isActive
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalSessions / limit),
          totalSessions,
          hasNext: page < Math.ceil(totalSessions / limit),
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sessions',
        error: error.message
      });
    }
  }

  // Get session analytics for a user
  static async getUserAnalytics(req, res) {
    try {
      const userId = req.user?.id || req.query.guestId;
      const isGuest = !req.user?.id;
      const days = parseInt(req.query.days) || 30;

      const analytics = await SessionAnalytics.getUserStats(userId, isGuest, days);
      
      // Calculate summary statistics
      const summary = analytics.reduce((acc, day) => {
        acc.totalTimeSpent += day.dailyStats.totalTimeSpent;
        acc.totalExecutions += day.dailyStats.codeExecutions;
        acc.totalSessions += day.dailyStats.sessionsJoined;
        acc.totalMessages += day.dailyStats.messagesSent;
        acc.totalCodeChanges += day.dailyStats.codeChangesMade;
        
        // Track language usage
        day.dailyStats.languagesUsed.forEach(lang => {
          if (!acc.languageStats[lang.language]) {
            acc.languageStats[lang.language] = { timeSpent: 0, executions: 0 };
          }
          acc.languageStats[lang.language].timeSpent += lang.timeSpent;
          acc.languageStats[lang.language].executions += lang.executions;
        });
        
        return acc;
      }, {
        totalTimeSpent: 0,
        totalExecutions: 0,
        totalSessions: 0,
        totalMessages: 0,
        totalCodeChanges: 0,
        languageStats: {}
      });

      // Find most used language
      let favoriteLanguage = null;
      let maxTime = 0;
      Object.entries(summary.languageStats).forEach(([lang, stats]) => {
        if (stats.timeSpent > maxTime) {
          maxTime = stats.timeSpent;
          favoriteLanguage = lang;
        }
      });

      res.json({
        success: true,
        analytics: {
          summary: {
            ...summary,
            favoriteLanguage,
            averageSessionDuration: summary.totalSessions > 0 ? summary.totalTimeSpent / summary.totalSessions : 0,
            averageExecutionsPerSession: summary.totalSessions > 0 ? summary.totalExecutions / summary.totalSessions : 0
          },
          dailyStats: analytics.map(day => ({
            date: day.date,
            ...day.dailyStats
          })),
          period: `${days} days`
        }
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics',
        error: error.message
      });
    }
  }

  // Get global collaboration statistics
  static async getGlobalStats(req, res) {
    try {
      const activeSessions = await CollaborationSession.findActiveSessions();
      const globalStats = await SessionAnalytics.getGlobalStats();
      const leaderboard = await SessionAnalytics.getLeaderboard('totalTimeSpent', 10);

      res.json({
        success: true,
        stats: {
          activeSessions: {
            count: activeSessions.length,
            sessions: activeSessions.map(session => ({
              roomId: session.roomId,
              title: session.title,
              participantCount: session.getActiveParticipants().length,
              language: session.language,
              lastActivity: session.lastActivity
            }))
          },
          global: globalStats[0] || {},
          leaderboard
        }
      });
    } catch (error) {
      console.error('Error fetching global stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }

  // Cleanup inactive sessions (admin endpoint)
  static async cleanupSessions(req, res) {
    try {
      const result = await CollaborationSession.cleanupInactiveSessions();
      
      res.json({
        success: true,
        message: 'Session cleanup completed',
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error('Error during session cleanup:', error);
      res.status(500).json({
        success: false,
        message: 'Cleanup failed',
        error: error.message
      });
    }
  }

  // Search public sessions
  static async searchSessions(req, res) {
    try {
      const { query, language, page = 1, limit = 20 } = req.query;
      
      const searchCriteria = {
        'settings.isPublic': true,
        isActive: true
      };

      if (query) {
        searchCriteria.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }

      if (language) {
        searchCriteria.language = language;
      }

      const sessions = await CollaborationSession.find(searchCriteria)
        .populate('createdBy', 'name avatar')
        .sort({ lastActivity: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .select('roomId title description language createdBy createdAt lastActivity participants settings metadata');

      const totalSessions = await CollaborationSession.countDocuments(searchCriteria);

      res.json({
        success: true,
        sessions: sessions.map(session => ({
          roomId: session.roomId,
          title: session.title,
          description: session.description,
          language: session.language,
          createdBy: session.createdBy,
          createdAt: session.createdAt,
          lastActivity: session.lastActivity,
          participantCount: session.getActiveParticipants().length,
          maxParticipants: session.settings.maxParticipants,
          canJoin: session.getActiveParticipants().length < session.settings.maxParticipants
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalSessions / limit),
          totalSessions,
          hasNext: page < Math.ceil(totalSessions / limit),
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Error searching sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error.message
      });
    }
  }
}

// Helper function to generate room ID
function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = SessionController;
