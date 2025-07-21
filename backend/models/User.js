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
    leetcode: {
      type: String,
      default: null
    },
    github: {
      type: String,
      default: null
    }
    ,
    geeksforgeeks:{
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);