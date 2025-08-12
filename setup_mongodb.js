const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB Atlas Setup\n');

rl.question('Enter your MongoDB Atlas password: ', (password) => {
  const envContent = `# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://nivivri1:${password}@cluster0.hpw44xe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Server Port
PORT=5000
`;

  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ .env file created successfully!');
  console.log('📝 Your MongoDB Atlas connection is configured.');
  console.log('\n🚀 Next steps:');
  console.log('1. Start the server: node server.js');
  console.log('2. Test the connection: node test_mongodb.js');
  console.log('3. View your data in MongoDB Atlas dashboard');
  
  rl.close();
}); 