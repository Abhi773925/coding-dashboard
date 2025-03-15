// models/taskformmodels.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  originalName: String,
  fileType: String,
  size: Number,
  uploadedBy: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

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
  assignedBy: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  // Updated to store multiple files
  files: [fileSchema],
  comments: [{
    text: String,
    user: String,
    date: {
      type: Date,
      default: Date.now
    },
    isFileUpload: Boolean,
    fileDetails: {
      fileName: String,
      fileUrl: String
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
  role: String,
  teamTask: Boolean,
  teamMembers: [String],
  createdBy: String,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);