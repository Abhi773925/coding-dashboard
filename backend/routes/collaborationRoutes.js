const express = require('express');
const router = express.Router();

// Collaboration endpoints
router.post('/rooms', (req, res) => {
  try {
    const { name, description, isPrivate = false, maxUsers = 10 } = req.body;
    
    if (!name || name.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Room name must be at least 3 characters long'
      });
    }

    // Generate room ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId = '';
    for (let i = 0; i < 8; i++) {
      roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const room = {
      id: roomId,
      name,
      description: description || '',
      isPrivate,
      isPublic: !isPrivate, // Set isPublic opposite to isPrivate
      maxUsers,
      createdAt: new Date(),
      createdBy: req.user?.id || 'anonymous'
    };

    // Create the room in the database if we have a CollaborationSession model
    // This will be implemented in production code
    try {
      const CollaborationSession = require('../models/CollaborationSession');
      const session = new CollaborationSession({
        roomId,
        title: name,
        description: description || '',
        createdByGuest: req.user?.id || 'anonymous',
        settings: {
          isPublic: !isPrivate,
          allowGuestAccess: true,
          maxParticipants: maxUsers
        }
      });
      session.save();
    } catch (dbError) {
      console.error('Failed to save room to database:', dbError);
      // Continue even if database save fails
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
});

router.get('/rooms/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    
    // This would typically fetch from database
    // For now, we'll return a mock response
    const room = {
      id: roomId,
      name: `Room ${roomId}`,
      description: 'Collaborative coding room',
      isPrivate: false,
      maxUsers: 10,
      currentUsers: 0,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    res.json({
      success: true,
      room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room',
      error: error.message
    });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    let rooms = [];
    
    // Try to fetch public rooms from the database
    try {
      const CollaborationSession = require('../models/CollaborationSession');
      console.log('Fetching public rooms from database...');
      
      // Check total count of sessions first
      const totalSessions = await CollaborationSession.countDocuments();
      console.log(`Total sessions in database: ${totalSessions}`);
      
      // Find active sessions that are public
      const sessions = await CollaborationSession.find({
        'settings.isPublic': true
      })
        .sort({ lastActivity: -1 })
        .limit(10);
      
      console.log(`Found ${sessions.length} public sessions`);
      
      if (sessions.length === 0) {
        // Log a sample session to check structure
        const sampleSession = await CollaborationSession.findOne({});
        if (sampleSession) {
          console.log('Sample session structure:', {
            roomId: sampleSession.roomId,
            title: sampleSession.title,
            isPublic: sampleSession.settings?.isPublic,
            isActive: sampleSession.isActive
          });
        }
      }
      
      // Transform to the expected format
      rooms = sessions.map(session => {
        const activeParticipants = session.getActiveParticipants ? 
          session.getActiveParticipants() : [];
          
        return {
          id: session.roomId,
          name: session.title,
          description: session.description,
          isPrivate: !session.settings.isPublic,
          maxUsers: session.settings.maxParticipants || 10,
          currentUsers: activeParticipants.length,
          language: session.language,
          createdAt: session.createdAt,
          lastActivity: session.lastActivity
        };
      });
    } catch (dbError) {
      console.error('Failed to fetch rooms from database:', dbError);
      
      // Fallback to mock data if database query fails
      rooms = [
        {
          id: 'PUBLIC01',
          name: 'JavaScript Playground',
          description: 'Practice JavaScript together',
          isPrivate: false,
          maxUsers: 20,
          currentUsers: 5,
          language: 'javascript',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          lastActivity: new Date()
        },
        {
          id: 'PUBLIC02',
          name: 'Python Learning',
          description: 'Learn Python fundamentals',
          isPrivate: false,
          maxUsers: 15,
          currentUsers: 3,
          language: 'python',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          lastActivity: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
        },
        {
          id: 'PUBLIC03',
          name: 'Algorithm Study',
          description: 'Solve algorithms together',
          isPrivate: false,
          maxUsers: 10,
          currentUsers: 8,
          language: 'cpp',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          lastActivity: new Date()
        }
      ];
    }

    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
      error: error.message
    });
  }
});

// Get room statistics
router.get('/stats', (req, res) => {
  try {
    // This would typically come from the collaboration service
    const stats = {
      totalRooms: 15,
      activeUsers: 42,
      totalCollaborations: 156,
      averageSessionTime: '45 minutes'
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
});

module.exports = router;
