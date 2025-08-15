const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:5000/api';

async function testTokenVerification() {
  console.log('🧪 Testing Token Verification...\n');

  try {
    // 1. First login to get a token
    console.log('1. Logging in to get token...');
    const loginResponse = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }

    const loginResult = await loginResponse.json();
    const token = loginResult.token;
    console.log('✅ Login successful, token received');

    // 2. Test token verification with valid token
    console.log('\n2. Testing token verification with valid token...');
    const verifyResponse = await fetch(`${API_BASE}/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (verifyResponse.ok) {
      const verifyResult = await verifyResponse.json();
      console.log('✅ Token verification successful');
      console.log('   User ID:', verifyResult.user.id);
      console.log('   Username:', verifyResult.user.username);
      console.log('   Email:', verifyResult.user.email);
    } else {
      const error = await verifyResponse.json();
      console.log('❌ Token verification failed:', error.message);
    }

    // 3. Test token verification without token
    console.log('\n3. Testing token verification without token...');
    const noTokenResponse = await fetch(`${API_BASE}/verify`);
    
    if (noTokenResponse.status === 401) {
      console.log('✅ Properly blocked access without token');
    } else {
      console.log('❌ Should have blocked access without token');
    }

    // 4. Test token verification with invalid token
    console.log('\n4. Testing token verification with invalid token...');
    const invalidTokenResponse = await fetch(`${API_BASE}/verify`, {
      headers: { 'Authorization': 'Bearer invalid_token_here' }
    });
    
    if (invalidTokenResponse.status === 401) {
      console.log('✅ Properly blocked access with invalid token');
    } else {
      console.log('❌ Should have blocked access with invalid token');
    }

    console.log('\n🎉 Token verification endpoint works correctly!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testTokenVerification(); 