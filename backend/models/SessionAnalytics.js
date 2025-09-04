const mongoose = require('mongoose');

const sessionAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow tracking for guest users
  },
  guestId: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  dailyStats: {
    sessionsJoined: {
      type: Number,
      default: 0
    },
    sessionsCreated: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number, // in milliseconds
      default: 0
    },
    codeExecutions: {
      type: Number,
      default: 0
    },
    messagesSent: {
      type: Number,
      default: 0
    },
    codeChangesMade: {
      type: Number,
      default: 0
    },
    languagesUsed: [{
      language: String,
      timeSpent: Number,
      executions: Number
    }],
    collaborationTime: {
      type: Number, // time spent with other users
      default: 0
    },
    soloTime: {
      type: Number, // time spent alone in sessions
      default: 0
    }
  },
  weeklyStats: {
    week: {
      type: Number, // Week number of the year
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0
    },
    totalCollaborators: {
      type: Number,
      default: 0
    },
    favoriteLanguage: {
      language: String,
      timeSpent: Number
    },
    productivity: {
      executionsPerHour: Number,
      linesOfCodePerSession: Number
    }
  },
  monthlyStats: {
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    longestSession: {
      duration: Number,
      roomId: String,
      date: Date
    },
    mostProductiveDay: {
      date: Date,
      executions: Number,
      timeSpent: Number
    },
    collaborationNetwork: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      guestId: String,
      name: String,
      sessionsShared: Number,
      timeSpentTogether: Number
    }]
  }
}, {
  timestamps: true,
  collection: 'session_analytics'
});

// Compound indexes for efficient queries
sessionAnalyticsSchema.index({ userId: 1, date: -1 });
sessionAnalyticsSchema.index({ guestId: 1, date: -1 });
sessionAnalyticsSchema.index({ 'weeklyStats.year': 1, 'weeklyStats.week': 1 });
sessionAnalyticsSchema.index({ 'monthlyStats.year': 1, 'monthlyStats.month': 1 });

// TTL index - keep analytics for 1 year
sessionAnalyticsSchema.index({ date: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

// Static methods for analytics
sessionAnalyticsSchema.statics.updateDailyStats = function(userId, isGuest, updates) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const query = { date: today };
  if (isGuest) {
    query.guestId = userId;
  } else {
    query.userId = userId;
  }

  return this.findOneAndUpdate(
    query,
    {
      $inc: {
        'dailyStats.sessionsJoined': updates.sessionsJoined || 0,
        'dailyStats.sessionsCreated': updates.sessionsCreated || 0,
        'dailyStats.totalTimeSpent': updates.totalTimeSpent || 0,
        'dailyStats.codeExecutions': updates.codeExecutions || 0,
        'dailyStats.messagesSent': updates.messagesSent || 0,
        'dailyStats.codeChangesMade': updates.codeChangesMade || 0,
        'dailyStats.collaborationTime': updates.collaborationTime || 0,
        'dailyStats.soloTime': updates.soloTime || 0
      },
      $set: {
        userId: isGuest ? undefined : userId,
        guestId: isGuest ? userId : undefined
      }
    },
    {
      upsert: true,
      new: true
    }
  );
};

sessionAnalyticsSchema.statics.updateLanguageStats = function(userId, isGuest, language, timeSpent, executions = 0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const query = { date: today };
  if (isGuest) {
    query.guestId = userId;
  } else {
    query.userId = userId;
  }

  return this.findOneAndUpdate(
    query,
    {
      $inc: {
        [`dailyStats.languagesUsed.$[lang].timeSpent`]: timeSpent,
        [`dailyStats.languagesUsed.$[lang].executions`]: executions
      }
    },
    {
      arrayFilters: [{ 'lang.language': language }],
      upsert: true,
      new: true
    }
  ).catch(() => {
    // If language doesn't exist, add it
    return this.findOneAndUpdate(
      query,
      {
        $push: {
          'dailyStats.languagesUsed': {
            language,
            timeSpent,
            executions
          }
        }
      },
      { upsert: true, new: true }
    );
  });
};

sessionAnalyticsSchema.statics.getUserStats = function(userId, isGuest = false, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const query = { date: { $gte: startDate } };
  if (isGuest) {
    query.guestId = userId;
  } else {
    query.userId = userId;
  }

  return this.find(query).sort({ date: -1 });
};

sessionAnalyticsSchema.statics.getLeaderboard = function(metric = 'totalTimeSpent', limit = 10) {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: oneWeekAgo },
        userId: { $exists: true } // Only registered users for leaderboard
      }
    },
    {
      $group: {
        _id: '$userId',
        totalTimeSpent: { $sum: '$dailyStats.totalTimeSpent' },
        totalExecutions: { $sum: '$dailyStats.codeExecutions' },
        totalSessions: { $sum: '$dailyStats.sessionsJoined' },
        totalMessages: { $sum: '$dailyStats.messagesSent' }
      }
    },
    {
      $sort: { [metric]: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        userId: '$_id',
        name: '$userInfo.name',
        email: '$userInfo.email',
        avatar: '$userInfo.avatar',
        totalTimeSpent: 1,
        totalExecutions: 1,
        totalSessions: 1,
        totalMessages: 1
      }
    }
  ]);
};

sessionAnalyticsSchema.statics.getGlobalStats = function() {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: oneWeekAgo }
      }
    },
    {
      $group: {
        _id: null,
        totalUsers: { $addToSet: { $ifNull: ['$userId', '$guestId'] } },
        totalTimeSpent: { $sum: '$dailyStats.totalTimeSpent' },
        totalExecutions: { $sum: '$dailyStats.codeExecutions' },
        totalSessions: { $sum: '$dailyStats.sessionsJoined' },
        totalMessages: { $sum: '$dailyStats.messagesSent' },
        languages: { $push: '$dailyStats.languagesUsed' }
      }
    },
    {
      $project: {
        totalUsers: { $size: '$totalUsers' },
        totalTimeSpent: 1,
        totalExecutions: 1,
        totalSessions: 1,
        totalMessages: 1,
        averageSessionDuration: {
          $cond: [
            { $eq: ['$totalSessions', 0] },
            0,
            { $divide: ['$totalTimeSpent', '$totalSessions'] }
          ]
        },
        languages: 1
      }
    }
  ]);
};

module.exports = mongoose.model('SessionAnalytics', sessionAnalyticsSchema);
