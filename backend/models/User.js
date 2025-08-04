const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: null
    },
    picture: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null,
      maxlength: 500
    },
    location: {
      type: String,
      default: null
    },
    website: {
      type: String,
      default: null
    },
    // Platform usernames
    leetcode: {
      type: String,
      default: null
    },
    github: {
      type: String,
      default: null
    },
    linkedin: {
      type: String,
      default: null
    },
    instagram: {
      type: String,
      default: null
    },
    geeksforgeeks:{
      type: String,
      default: null
    },
    codechef: {
      type: String,
      default: null
    },
    codeforces: {
      type: String,
      default: null
    },
    hackerrank: {
      type: String,
      default: null
    },
    hackerearth: {
      type: String,
      default: null
    },
    // Additional profile settings
    isPublic: {
      type: Boolean,
      default: true
    },
    // Cache for platform stats (to reduce API calls)
    platformStatsCache: {
      type: Map,
      of: {
        data: mongoose.Schema.Types.Mixed,
        lastUpdated: Date
      },
      default: new Map()
    },
    // User preferences
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      emailNotifications: {
        type: Boolean,
        default: true
      },
      publicProfile: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);