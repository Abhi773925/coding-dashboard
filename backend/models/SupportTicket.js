const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'billing', 'general', 'cv-review', 'mentorship', 'account'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    attachments: [{
      filename: String,
      url: String,
      fileType: String
    }]
  }],
  resolution: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolutionNote: String,
    satisfaction: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String
    }
  },
  cvReview: {
    cvUrl: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor'
    },
    reviewNotes: String,
    suggestions: [String],
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    reviewDate: Date,
    improvementAreas: [{
      category: String,
      feedback: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    }]
  },
  tags: [String],
  escalated: {
    type: Boolean,
    default: false
  },
  escalatedAt: Date,
  estimatedResolutionTime: Number // in hours
}, {
  timestamps: true
});

// Auto-generate ticket ID
supportTicketSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.ticketId = `TKT-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Index for efficient queries
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ ticketId: 1 });
supportTicketSchema.index({ type: 1, priority: 1 });
supportTicketSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
