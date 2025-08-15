const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require('./middleware/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import models
const User = require('./models/User');
const Route = require('./models/Route');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nivivri1:ibcGtBTUgs76EISQ@cluster0.hpw44xe.mongodb.net/trip?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Email, username, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Create new user (password will be hashed automatically)
    const newUser = new User({ email, username, password });
    await newUser.save();

    // Generate JWT token
    const token = newUser.generateAuthToken();

    res.status(201).json({ 
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({ 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout endpoint (client-side token removal)
app.post("/api/logout", auth, async (req, res) => {
  try {
    // In a more complex system, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify token endpoint
app.get("/api/verify", auth, async (req, res) => {
  try {
    // If we reach here, the token is valid (auth middleware passed)
    res.json({ 
      message: "Token is valid",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's saved routes (protected)
app.get("/api/routes", auth, async (req, res) => {
  try {
    // Get username from authenticated user
    const username = req.user.username;
    
    const routes = await Route.find({ username }).sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save a new route (protected)
app.post("/api/routes", auth, async (req, res) => {
  try {
    const { name, description, destination, type, pathEncoded, pathDaysEncoded } = req.body;
    const username = req.user.username; // Get username from authenticated user
    
    if (!username || !name || !destination || !type || !pathEncoded) {
      return res.status(400).json({ message: "Username, name, destination, type, and pathEncoded are required" });
    }

    // Validate pathEncoded is a non-empty string
    if (typeof pathEncoded !== 'string' || pathEncoded.trim() === '') {
      return res.status(400).json({ message: "pathEncoded must be a non-empty string" });
    }

    // Validate pathDaysEncoded if provided
    if (pathDaysEncoded && !Array.isArray(pathDaysEncoded)) {
      return res.status(400).json({ message: "pathDaysEncoded must be an array of strings" });
    }

    const newRoute = new Route({
      username,
      name,
      description,
      destination,
      type,
      pathEncoded,
      pathDaysEncoded
    });

    await newRoute.save();

    res.status(201).json({ message: "Route saved successfully", route: newRoute });
  } catch (error) {
    console.error('Save route error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a route (protected)
app.delete("/api/routes/:routeId", auth, async (req, res) => {
  try {
    const { routeId } = req.params;
    const username = req.user.username; // Get username from authenticated user

    const deletedRoute = await Route.findOneAndDelete({ 
      _id: routeId, 
      username 
    });
    

    if (!deletedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
