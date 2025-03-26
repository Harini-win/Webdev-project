const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static('image'));

mongoose.connect('mongodb://localhost:27017/flavourrhythm')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// User Model
const User = mongoose.model('User', userSchema);

// Root API route - Test connection
app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

// User Registration
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/front.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'front.html'));
});
app.get('/trial.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'trial.html'));
});
app.get('/display.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'display.html'));
});
app.get('/fav.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fav.html'));
});
app.get('/recipie.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'recipie.html'));
});
app.get('/joke.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'joke.html'));
});
app.get('/BG.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'BG.png'));
});
app.get('/fonts/CuteEasterPersonalUse-Wy8nV.ttf', (req, res) => {
  res.sendFile(path.join(__dirname, 'fonts/CuteEasterPersonalUse-Wy8nV.ttf'));
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
