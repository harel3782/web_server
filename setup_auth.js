const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nivivri1:ibcGtBTUgs76EISQ@cluster0.hpw44xe.mongodb.net/trip?retryWrites=true&w=majority&appName=Cluster0';

async function setupAuthentication() {
  try {
    console.log('🔧 Setting up authentication...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if testuser exists
    let user = await User.findOne({ username: 'testuser' });
    
    if (user) {
      console.log('ℹ️ User "testuser" already exists');
      
      // Check if password is already hashed
      if (user.password.length < 20) {
        console.log('🔄 Updating password to hashed version...');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash('password123', salt);
        await user.save();
        console.log('✅ Password updated successfully');
      } else {
        console.log('✅ Password is already hashed');
      }
    } else {
      console.log('➕ Creating new test user...');
      user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123' // Will be hashed automatically
      });
      await user.save();
      console.log('✅ Test user created successfully');
    }

    // Create another test user
    let user2 = await User.findOne({ username: 'testuser2' });
    
    if (!user2) {
      console.log('➕ Creating second test user...');
      user2 = new User({
        email: 'test2@example.com',
        username: 'testuser2',
        password: 'password123'
      });
      await user2.save();
      console.log('✅ Second test user created successfully');
    }

    console.log('\n🎉 Authentication setup completed!');
    console.log('\n📋 Test Users:');
    console.log('   Username: testuser, Password: password123');
    console.log('   Username: testuser2, Password: password123');
    console.log('\n🔐 You can now test the authentication system!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

setupAuthentication(); 