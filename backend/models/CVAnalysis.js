const mongoose = require('mongoose');

const cvAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor'
  },
  cvFile: {
    filename: String,
    url: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  analysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    sections: {
      contactInfo: {
        score: Number,
        feedback: String,
        suggestions: [String]
      },
      summary: {
        score: Number,
        feedback: String,
        suggestions: [String]
      },
      experience: {
        score: Number,
        feedback: String,
        suggestions: [String]
      },
      education: {
        score: Number,
        feedback: String,
        suggestions: [String]
      },
      skills: {
        score: Number,
        feedback: String,
        suggestions: [String]
      },
      projects: {
        score: Number,
        feedback: String,
        suggestions: [String]
      },
      formatting: {
        score: Number,
        feedback: String,
        suggestions: [String]
      }
    },
    strengths: [String],
    weaknesses: [String],
    recommendations: [{
      category: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      description: String,
      example: String
    }],
    industrySpecific: {
      targetRole: String,
      relevanceScore: Number,
      missingKeywords: [String],
      suggestedKeywords: [String]
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in-review', 'completed', 'revision-needed'],
    default: 'pending'
  },
  reviewType: {
    type: String,
    enum: ['automated', 'manual', 'hybrid'],
    default: 'automated'
  },
  reviewDate: Date,
  revisions: [{
    version: Number,
    cvUrl: String,
    uploadDate: Date,
    changes: [String],
    feedback: String
  }],
  payment: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'pending'
    },
    isSubscriptionService: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
cvAnalysisSchema.index({ user: 1, createdAt: -1 });
cvAnalysisSchema.index({ mentor: 1, status: 1 });
cvAnalysisSchema.index({ status: 1, reviewDate: 1 });

module.exports = mongoose.model('CVAnalysis', cvAnalysisSchema);
