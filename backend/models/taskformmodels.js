// This is what your Task model schema should look like for the comments
// models/taskformmodels.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  assignedTo: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  file: String,
  comments: [{
    text: String,
    user: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Done'],
    default: 'Pending'
  },
  role: String
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);