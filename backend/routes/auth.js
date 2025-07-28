const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const User = require('../models/user'); // Adjust the path as needed

// @route   POST auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Include userId in response
        res.json({ token, userId: user.id }); // Send both token and userId
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST auth/create-user
// @desc    Create a new user (Admin only)
// @access  Private
router.post('/create-user', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/send-recognize-now', async (req, res) => {
  const { 
    senderId, 
    recipientIds, 
    points, 
    message, 
    emblem 
  } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find sender
    const sender = await User.findById(senderId).session(session);
    if (!sender) {
      throw new Error('Sender not found');
    }

    // Validate sender has enough RecognizeNow points
    const totalPointsToDeduct = points * recipientIds.length;
    if (sender.recognizeNowBalance < totalPointsToDeduct) {
      throw new Error('Insufficient RecognizeNow points');
    }

    // Deduct points from sender
    sender.recognizeNowBalance -= totalPointsToDeduct;
    await sender.save({ session });

    // Add points to recipients
    const recipients = await User.find({ _id: { $in: recipientIds } }).session(session);
    if (recipients.length === 0) {
      throw new Error('No valid recipients found');
    }

    await User.updateMany(
      { _id: { $in: recipientIds } },
      { $inc: { currentPointBalance: points } },
      { session }
    );

    // Create recognition post/log
    await RecognitionPost.create([{
      sender: sender.name,
      recipients: recipientIds,
      points,
      message,
      emblem,
      date: new Date()
    }], { session });

    await session.commitTransaction();
    
    res.status(200).json({ message: 'Points transferred successfully' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in /send-recognize-now:', error);
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
});



module.exports = router;
