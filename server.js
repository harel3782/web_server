const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
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
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Create new user
    const newUser = new User({ email, username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's saved routes
app.get("/api/routes", async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    
    const routes = await Route.find({ username }).sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save a new route
app.post("/api/routes", async (req, res) => {
  try {
    const { username, name, description, destination, type, pathEncoded, pathDaysEncoded } = req.body;
    
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

// Delete a route
app.delete("/api/routes/:routeId", async (req, res) => {
  try {
    const { routeId } = req.params;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

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
