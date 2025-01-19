// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  emblem: {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  recipients: [{
    type: String,
    required: true
  }],
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedByUsers: [{
    type: String,
    default: []
  }],
  comments: [{
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true  // Add name to the schema
    },
    comment: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Post', postSchema, 'posts');