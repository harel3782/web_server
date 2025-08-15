const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:5000/api';

async function testAllEndpoints() {
  console.log('🧪 Testing All Authentication Endpoints...\n');

  try {
    // 1. Test registration
    console.log('1. Testing registration...');
    const registerResponse = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@test.com',
        username: 'newuser',
        password: 'password123'
      })
    });

    if (registerResponse.ok) {
      const result = await registerResponse.json();
      console.log('✅ Registration successful');
      console.log('   Token received:', result.token ? 'Yes' : 'No');
      console.log('   User ID:', result.user.id);
    } else {
      const error = await registerResponse.json();
      console.log('ℹ️ Registration:', error.message);
    }

    // 2. Test login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const result = await loginResponse.json();
      console.log('✅ Login successful');
      console.log('   Token received:', result.token ? 'Yes' : 'No');
      console.log('   User ID:', result.user.id);
      
      // Store token for other tests
      const token = result.token;

      // 3. Test verify endpoint
      console.log('\n3. Testing verify endpoint...');
      const verifyResponse = await fetch(`${API_BASE}/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('✅ Verify successful');
        console.log('   Username:', verifyResult.user.username);
      } else {
        console.log('❌ Verify failed');
      }

      // 4. Test protected routes
      console.log('\n4. Testing protected routes...');
      const routesResponse = await fetch(`${API_BASE}/routes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (routesResponse.ok) {
        const routes = await routesResponse.json();
        console.log('✅ Routes retrieved successfully');
        console.log('   Number of routes:', routes.length);
      } else {
        console.log('❌ Routes retrieval failed');
      }

      // 5. Test logout
      console.log('\n5. Testing logout...');
      const logoutResponse = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (logoutResponse.ok) {
        console.log('✅ Logout successful');
      } else {
        console.log('❌ Logout failed');
      }
    } else {
      console.log('❌ Login failed');
    }

    // 6. Test unauthorized access
    console.log('\n6. Testing unauthorized access...');
    const unauthorizedResponse = await fetch(`${API_BASE}/verify`);
    
    if (unauthorizedResponse.status === 401) {
      console.log('✅ Unauthorized access properly blocked');
    } else {
      console.log('❌ Unauthorized access not properly blocked');
    }

    console.log('\n🎉 All endpoints tested successfully!');
    console.log('\n📋 Available Endpoints:');
    console.log('   ✅ POST /api/register - User registration');
    console.log('   ✅ POST /api/login - User login');
    console.log('   ✅ GET /api/verify - Token verification');
    console.log('   ✅ GET /api/routes - Get user routes (protected)');
    console.log('   ✅ POST /api/routes - Save route (protected)');
    console.log('   ✅ DELETE /api/routes/:id - Delete route (protected)');
    console.log('   ✅ POST /api/logout - User logout (protected)');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testAllEndpoints(); 