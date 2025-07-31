const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  plan: {
    name: String,
    description: String,
    price: Number,
    duration: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly']
    },
    features: [String],
    sessionsIncluded: Number
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  sessionsUsed: {
    type: Number,
    default: 0
  },
  autoRenewal: {
    type: Boolean,
    default: false
  },
  payment: {
    paymentId: String,
    paymentMethod: String,
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paymentDate: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  billing: {
    nextBillingDate: Date,
    lastBillingDate: Date,
    billingHistory: [{
      date: Date,
      amount: Number,
      status: String,
      paymentId: String
    }]
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ mentor: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

// Virtual to check if subscription is currently active
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.endDate > new Date();
});

// Virtual to calculate remaining sessions
subscriptionSchema.virtual('remainingSessions').get(function() {
  return Math.max(0, (this.plan.sessionsIncluded || 0) - this.sessionsUsed);
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
