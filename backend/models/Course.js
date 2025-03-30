const mongoose = require('mongoose');

const QuestionProgressSchema = new mongoose.Schema({
  userEmail: { 
    type: String, 
    required: true 
  },
  status: { 
    type: Boolean, 
    default: false 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  forRevision: { 
    type: Boolean, 
    default: false 
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const QuestionSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  links: {
    article: { type: String, default: '' },
    youtube: { type: String, default: '' },
    practice: { type: String, default: '' }
  },
  // Store progress for each user separately
  userProgress: [QuestionProgressSchema]
});

const DaySchema = new mongoose.Schema({
  dayNumber: { 
    type: Number, 
    required: true 
  },
  dayTitle: { 
    type: String, 
    required: true 
  },
  questions: [QuestionSchema],
  totalQuestions: { 
    type: Number, 
    default: 0 
  }
});

const CourseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  totalQuestions: { 
    type: Number, 
    default: 0 
  },
  days: [DaySchema]
}, {
  timestamps: true
});

// Pre-save hook to calculate total questions
CourseSchema.pre('save', function(next) {
  this.totalQuestions = this.days.reduce((total, day) => 
    total + (day.questions ? day.questions.length : 0), 0
  );
  
  next();
});

module.exports = mongoose.model('Course', CourseSchema);