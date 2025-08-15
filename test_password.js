const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nivivri1:ibcGtBTUgs76EISQ@cluster0.hpw44xe.mongodb.net/trip?retryWrites=true&w=majority&appName=Cluster0';

async function testPassword() {
  try {
    console.log('🔍 Testing password comparison...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Find the user
    const user = await User.findOne({ username: 'testuser' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.username);
    console.log('Password hash length:', user.password.length);
    console.log('Password hash starts with:', user.password.substring(0, 10) + '...');

    // Test password comparison
    const testPassword = 'password123';
    console.log('\nTesting password:', testPassword);
    
    const isMatch = await user.comparePassword(testPassword);
    console.log('Password match:', isMatch);

    // Test direct bcrypt comparison
    const directMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Direct bcrypt match:', directMatch);

    // Test wrong password
    const wrongPassword = 'wrongpassword';
    console.log('\nTesting wrong password:', wrongPassword);
    
    const wrongMatch = await user.comparePassword(wrongPassword);
    console.log('Wrong password match:', wrongMatch);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testPassword(); 