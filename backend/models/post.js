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
  likes: { // New field to track total likes
    type: Number,
    default: 0 // Default to zero likes
  },
  likedByUsers: [{ // New field to track users who liked this post
    type: String, // Assuming you are storing user IDs as strings
    default: [] // Default to an empty array
  }]
});

module.exports = mongoose.model('Post', postSchema, 'posts');
