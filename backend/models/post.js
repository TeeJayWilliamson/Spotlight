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
  }
});

module.exports = mongoose.model('Post', postSchema);
