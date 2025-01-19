const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Import the Post model

// POST route to create a new post
router.post('/', async (req, res) => {
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

// GET route to fetch posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ isPrivate: false })
      .sort({ timestamp: -1 })
      .limit(50); // Limit to most recent 50 posts
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to add a comment to a post
router.post('/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the current user has already commented on this post
    const hasCommented = post.comments.some(comment => comment.userId === req.body.userId);

    if (hasCommented) {
      return res.status(400).json({ message: 'You have already commented on this post.' });
    }

    const newComment = {
      userId: req.body.userId,
      username: req.body.username,
      name: req.body.name,
      comment: req.body.comment,
      timestamp: new Date()
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'An error occurred while adding the comment.' });
  }
});


// POST route to like a post
router.post('/:id/like', async (req, res) => {
  const userId = req.body.userId; // Assuming user ID is sent in the request body
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const hasLiked = post.likedByUsers.includes(userId);

    if (hasLiked) {
      // User has already liked this post, so we remove their like
      post.likes -= 1;
      post.likedByUsers = post.likedByUsers.filter(id => id !== userId);
    } else {
      // User is liking the post for the first time
      post.likes += 1;
      post.likedByUsers.push(userId);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
