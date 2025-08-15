const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nivivri1:ibcGtBTUgs76EISQ@cluster0.hpw44xe.mongodb.net/trip?retryWrites=true&w=majority&appName=Cluster0';

async function fixUser() {
  try {
    console.log('🔧 Fixing user password...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Delete existing testuser
    await User.deleteOne({ username: 'testuser' });
    console.log('🗑️ Deleted existing testuser');

    // Create new user with correct password hashing
    const newUser = new User({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    });
    
    await newUser.save();
    console.log('✅ Created new testuser with proper password hashing');

    // Verify the password works
    const user = await User.findOne({ username: 'testuser' });
    const isMatch = await user.comparePassword('password123');
    console.log('✅ Password verification:', isMatch);

    console.log('\n🎉 User fixed successfully!');
    console.log('Username: testuser');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixUser(); 