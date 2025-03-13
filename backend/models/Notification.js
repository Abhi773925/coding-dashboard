const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['task_assigned', 'task_updated', 'comment_added', 'file_uploaded', 'status_changed'],
    required: true
  },
  createdBy: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);