const mongoose = require('mongoose');

const collaborationSessionSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    default: 'Untitled Session'
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous sessions
  },
  createdByGuest: {
    type: String, // For guest users
    required: false
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    guestId: {
      type: String, // For guest users
      required: false
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    totalTimeSpent: {
      type: Number, // in milliseconds
      default: 0
    }
  }],
  currentCode: {
    type: String,
    default: '// Welcome to collaborative coding!\nconsole.log("Hello, World!");'
  },
  language: {
    type: String,
    default: 'javascript',
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript', 'php', 'ruby']
  },
  codeHistory: [{
    code: String,
    language: String,
    changedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      guestId: String,
      name: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    changeType: {
      type: String,
      enum: ['code_change', 'language_change', 'template_load'],
      default: 'code_change'
    }
  }],
  executionHistory: [{
    code: String,
    language: String,
    input: String,
    output: String,
    executionTime: Number, // in milliseconds
    status: {
      type: String,
      enum: ['success', 'error', 'timeout'],
      default: 'success'
    },
    executedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      guestId: String,
      name: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  chatMessages: [{
    messageId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'system', 'execution'],
      default: 'text'
    },
    content: mongoose.Schema.Types.Mixed, // Can be string or object for execution results
    sender: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      guestId: String,
      name: String,
      avatar: String,
      color: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reactions: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      guestId: String,
      name: String,
      reaction: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true // Index for cleanup queries
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowGuestAccess: {
      type: Boolean,
      default: true
    },
    maxParticipants: {
      type: Number,
      default: 10
    },
    autoSave: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    totalExecutions: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    totalCodeChanges: {
      type: Number,
      default: 0
    },
    peakParticipants: {
      type: Number,
      default: 0
    },
    languages: [{
      language: String,
      timeSpent: Number // in milliseconds
    }]
  }
}, {
  timestamps: true,
  // TTL index for automatic deletion after 7 days
  collection: 'collaboration_sessions'
});

// TTL index for automatic cleanup after 7 days of inactivity
collaborationSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

// Compound indexes for common queries
collaborationSessionSchema.index({ createdBy: 1, createdAt: -1 });
collaborationSessionSchema.index({ 'participants.userId': 1, lastActivity: -1 });
collaborationSessionSchema.index({ isActive: 1, lastActivity: -1 });

// Methods
collaborationSessionSchema.methods.addParticipant = function(participant) {
  // Check if participant already exists
  const existingParticipant = this.participants.find(p => 
    (p.userId && participant.userId && p.userId.toString() === participant.userId.toString()) ||
    (p.guestId && participant.guestId && p.guestId === participant.guestId)
  );

  if (!existingParticipant) {
    this.participants.push({
      ...participant,
      joinedAt: new Date(),
      isActive: true
    });
    
    // Update peak participants
    if (this.participants.length > this.metadata.peakParticipants) {
      this.metadata.peakParticipants = this.participants.length;
    }
  } else {
    // Reactivate if they were inactive
    existingParticipant.isActive = true;
    existingParticipant.leftAt = undefined;
  }

  this.lastActivity = new Date();
  return this.save();
};

collaborationSessionSchema.methods.removeParticipant = function(participantId, isGuest = false) {
  const participant = this.participants.find(p => 
    isGuest ? p.guestId === participantId : (p.userId && p.userId.toString() === participantId)
  );

  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
    
    // Calculate time spent
    const timeSpent = participant.leftAt - participant.joinedAt;
    participant.totalTimeSpent += timeSpent;
  }

  this.lastActivity = new Date();
  return this.save();
};

collaborationSessionSchema.methods.updateCode = function(code, language, changedBy) {
  this.currentCode = code;
  if (language) this.language = language;
  
  // Add to history
  this.codeHistory.push({
    code,
    language: language || this.language,
    changedBy,
    timestamp: new Date(),
    changeType: language ? 'language_change' : 'code_change'
  });

  // Keep only last 100 code changes
  if (this.codeHistory.length > 100) {
    this.codeHistory = this.codeHistory.slice(-100);
  }

  this.metadata.totalCodeChanges++;
  this.lastActivity = new Date();
  
  return this.save();
};

collaborationSessionSchema.methods.addExecution = function(execution) {
  this.executionHistory.push({
    ...execution,
    timestamp: new Date()
  });

  // Keep only last 50 executions
  if (this.executionHistory.length > 50) {
    this.executionHistory = this.executionHistory.slice(-50);
  }

  this.metadata.totalExecutions++;
  this.lastActivity = new Date();
  
  return this.save();
};

collaborationSessionSchema.methods.addMessage = function(message) {
  this.chatMessages.push({
    ...message,
    timestamp: new Date()
  });

  // Keep only last 200 messages
  if (this.chatMessages.length > 200) {
    this.chatMessages = this.chatMessages.slice(-200);
  }

  this.metadata.totalMessages++;
  this.lastActivity = new Date();
  
  return this.save();
};

collaborationSessionSchema.methods.getActiveParticipants = function() {
  return this.participants.filter(p => p.isActive);
};

collaborationSessionSchema.methods.getSessionStats = function() {
  const activeParticipants = this.getActiveParticipants();
  const totalDuration = new Date() - this.createdAt;
  
  return {
    duration: totalDuration,
    totalParticipants: this.participants.length,
    activeParticipants: activeParticipants.length,
    peakParticipants: this.metadata.peakParticipants,
    totalExecutions: this.metadata.totalExecutions,
    totalMessages: this.metadata.totalMessages,
    totalCodeChanges: this.metadata.totalCodeChanges,
    language: this.language,
    lastActivity: this.lastActivity
  };
};

// Static methods
collaborationSessionSchema.statics.findByRoomId = function(roomId) {
  return this.findOne({ roomId });
};

collaborationSessionSchema.statics.findUserSessions = function(userId, isGuest = false) {
  if (isGuest) {
    return this.find({
      'participants.guestId': userId
    }).sort({ lastActivity: -1 });
  }
  
  return this.find({
    $or: [
      { createdBy: userId },
      { 'participants.userId': userId }
    ]
  }).sort({ lastActivity: -1 });
};

collaborationSessionSchema.statics.findActiveSessions = function() {
  return this.find({
    isActive: true,
    'participants.isActive': true
  }).sort({ lastActivity: -1 });
};

collaborationSessionSchema.statics.cleanupInactiveSessions = function() {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  
  return this.updateMany(
    {
      lastActivity: { $lt: twoDaysAgo },
      'participants.isActive': false
    },
    {
      $set: { isActive: false }
    }
  );
};

module.exports = mongoose.model('CollaborationSession', collaborationSessionSchema);
