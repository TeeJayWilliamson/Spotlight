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
    console.error('Error creating post:', error);
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
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST route to add a comment to a post
router.post('/:id/comment', async (req, res) => {
  try {
    console.log('Received comment request:', req.body);
    
    if (!req.body.name || !req.body.comment) {  // Check for name and comment
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name and comment are required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      name: req.body.name,
      comment: req.body.comment,
      timestamp: new Date()
    };

    console.log('Adding new comment:', newComment);
    
    post.comments.push(newComment);
    const updatedPost = await post.save();
    
    console.log('Comment added successfully');
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Server error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'An error occurred while adding the comment', 
      error: error.message 
    });
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
    console.error('Error liking post:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
