const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  sessionDetails: {
    title: {
      type: String,
      required: true
    },
    description: String,
    type: {
      type: String,
      enum: ['one-on-one', 'code-review', 'interview-prep', 'career-guidance', 'technical-discussion'],
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      default: 60
    },
    meetingLink: String,
    agenda: [String],
    materials: [{
      name: String,
      url: String,
      type: String
    }]
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  notes: {
    mentorNotes: String,
    menteeNotes: String,
    sessionSummary: String,
    actionItems: [String],
    nextSteps: [String]
  },
  recording: {
    isRecorded: {
      type: Boolean,
      default: false
    },
    recordingUrl: String,
    duration: Number
  },
  feedback: {
    menteeRating: {
      type: Number,
      min: 1,
      max: 5
    },
    menteeReview: String,
    mentorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    mentorReview: String,
    improvementAreas: [String]
  },
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
    isSubscriptionSession: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
mentorshipSessionSchema.index({ mentor: 1, scheduledDate: 1 });
mentorshipSessionSchema.index({ mentee: 1, scheduledDate: 1 });
mentorshipSessionSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('MentorshipSession', mentorshipSessionSchema);
