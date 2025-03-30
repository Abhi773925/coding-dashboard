const mongoose = require('mongoose');

const StreakSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastCodedDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Streak', StreakSchema);