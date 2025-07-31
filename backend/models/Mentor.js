const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profile: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    expertise: [{
      type: String,
      required: true
    }],
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    company: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      required: true,
      maxlength: 1000
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0
    },
    languages: [{
      type: String
    }],
    timeZone: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    linkedIn: String,
    github: String,
    portfolio: String
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    documents: [{
      type: String,
      url: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }]
  },
  availability: {
    weekdays: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      slots: [{
        startTime: String,
        endTime: String,
        isBooked: {
          type: Boolean,
          default: false
        }
      }]
    }],
    timeZone: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  stats: {
    totalSessions: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number,
      default: 0
    }
  },
  subscriptionPlans: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
      required: true
    },
    features: [String],
    sessionsIncluded: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search and filtering
mentorSchema.index({ 'profile.expertise': 1 });
mentorSchema.index({ 'profile.hourlyRate': 1 });
mentorSchema.index({ 'ratings.average': -1 });
mentorSchema.index({ status: 1 });

// Virtual for calculating mentor level based on experience and ratings
mentorSchema.virtual('level').get(function() {
  const experience = this.profile.experience;
  const rating = this.ratings.average;
  
  if (experience >= 10 && rating >= 4.5) return 'Expert';
  if (experience >= 5 && rating >= 4.0) return 'Senior';
  if (experience >= 2 && rating >= 3.5) return 'Intermediate';
  return 'Junior';
});

module.exports = mongoose.model('Mentor', mentorSchema);
