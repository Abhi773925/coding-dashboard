const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isForRevision: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Question', questionSchema);