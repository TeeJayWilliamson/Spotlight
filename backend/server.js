require('dotenv').config(); // Ensure dotenv is loaded at the top
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Add path module to serve static files

const User = require('./models/user'); // Ensure this path matches your directory structure
const authRoutes = require('./routes/auth'); // Correct path for auth.js

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const helmet = require('helmet');
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Add other domains as needed
    },
  },
));

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
const dbURI = process.env.MONGO_URI;  // Always use MONGO_URI from the .env file

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));

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

    // Compare the password with the stored hashed password (for database users)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for the user from the database
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to get user info
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

// Endpoint to get all users (for sending emblems, etc.)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to send an emblem to another user
app.post('/send-emblem', async (req, res) => {
  const { fromUsername, toUsername, reason } = req.body;
  try {
    const fromUser = await User.findOne({ username: fromUsername });
    const toUser = await User.findOne({ username: toUsername });

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the emblem to the recipient's profile
    toUser.emblemsReceived.push({ from: fromUsername, reason: reason });
    fromUser.emblemsGiven += 1;

    // Save the updated users
    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: 'Emblem sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from the React app (after it's built)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  // For any other routes, serve the React app's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
