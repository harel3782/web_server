const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nivivri1:ibcGtBTUgs76EISQ@cluster0.hpw44xe.mongodb.net/trip?retryWrites=true&w=majority&appName=Cluster0';

async function importUsers() {
  try {
    console.log('📥 Importing users from users.json...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Read users.json file
    const usersData = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    console.log(`📋 Found ${usersData.length} users to import`);

    let importedCount = 0;
    let skippedCount = 0;

    for (const userData of usersData) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [{ username: userData.username }, { email: userData.email }] 
        });

        if (existingUser) {
          console.log(`⏭️ Skipping ${userData.username} - already exists`);
          skippedCount++;
          continue;
        }

        // Create new user (password is required)
        const newUser = new User({
          email: userData.email,
          username: userData.username,
          password: userData.password // Password will be hashed automatically
        });

        await newUser.save();
        console.log(`✅ Imported user: ${userData.username}`);
        importedCount++;

      } catch (error) {
        console.log(`❌ Failed to import ${userData.username}:`, error.message);
      }
    }

    console.log('\n🎉 Import completed!');
    console.log(`   ✅ Imported: ${importedCount} users`);
    console.log(`   ⏭️ Skipped: ${skippedCount} users (already exist)`);
    console.log('\n📋 Available users:');
    
    const allUsers = await User.find({});
    allUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
    });

  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

importUsers(); 