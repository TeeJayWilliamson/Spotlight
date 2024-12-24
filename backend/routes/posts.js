const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // We'll create this next

router.post('/posts', async (req, res) => {
  try {
    const newPost = new Post({
      name: req.body.name,
      emblem: {
        title: req.body.emblem.title,
        image: req.body.emblem.image
      },
      recipients: req.body.recipients,
      message: req.body.message,
      timestamp: new Date(),
      isPrivate: req.body.isPrivate
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({ isPrivate: false })
      .sort({ timestamp: -1 })
      .limit(50); // Limit to most recent 50 posts
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;