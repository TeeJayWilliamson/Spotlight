require('dotenv').config(); // Ensure dotenv is loaded at the top
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const User = require('./models/user');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

const app = express();
const port = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://spotlight-ttc-30e93233aa0e.herokuapp.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'", process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
  },
}));

// Connect to MongoDB
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, {})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Convert buffer to base64
    const fileStr = req.file.buffer.toString('base64');
    const fileType = req.file.mimetype;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${fileType};base64,${fileStr}`,
      {
        folder: 'profile_pictures',
        resource_type: 'auto'
      }
    );

    res.json({ 
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Update profile image endpoint
app.post('/updateProfileImage', async (req, res) => {
  const { username, profileImage } = req.body;
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { profileImage } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile image updated successfully',
      profileImage: updatedUser.profileImage 
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ message: 'Error updating profile image' });
  }
});

// Hardcoded test credentials for testing
const TEST_USERNAME = 'testUser';
const TEST_PASSWORD = 'testPassword123';

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username and password match the test credentials
    if (username === TEST_USERNAME && password === TEST_PASSWORD) {
      // Generate JWT token for the hardcoded test user
      const token = jwt.sign({ userId: 'testUserId' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    // If not a match, check the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for the database user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ valid: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (err) {
    res.json({ valid: false });
  }
});

// Get user info endpoint
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users endpoint
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send emblem endpoint
app.post('/send-emblem', async (req, res) => {
  const { fromUsername, toUsername, reason } = req.body;
  try {
    const fromUser = await User.findOne({ username: fromUsername });
    const toUser = await User.findOne({ username: toUsername });

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    toUser.emblemsReceived.push({ from: fromUsername, reason });
    fromUser.emblemsGiven += 1;

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: 'Emblem sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Handle all GET requests by sending back the React app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Get user points
app.get('/user-points/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ currentPointBalance: user.currentPointBalance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Award points
app.post('/award-points', async (req, res) => {
  const { username, points } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $inc: { currentPointBalance: points } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'Points awarded successfully',
      newBalance: user.currentPointBalance 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

app.post('/redeem-points', async (req, res) => {
  const { username, pointsToDeduct } = req.body;
  
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has sufficient points
    if (user.currentPointBalance < pointsToDeduct) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    // Deduct points
    user.currentPointBalance -= pointsToDeduct;
    await user.save();
    
    res.json({ 
      message: 'Points redeemed successfully',
      newBalance: user.currentPointBalance 
    });
  } catch (error) {
    console.error('Redemption error:', error);
    res.status(500).json({ message: 'Server error during redemption' });
  }
});

