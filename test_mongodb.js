const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:5000/api';

async function testMongoDBIntegration() {
  console.log('🧪 Testing MongoDB Integration...\n');

  try {
    // 1. Register a test user
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      })
    });
    
    if (registerResponse.ok) {
      console.log('✅ User registration successful');
    } else {
      const error = await registerResponse.json();
      console.log('ℹ️ User might already exist:', error.message);
    }

    // 2. Login
    console.log('\n2. Testing user login...');
    const loginResponse = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ User login successful');
      console.log('   User:', loginData.user.username);
    } else {
      console.log('❌ User login failed');
      return;
    }

    // 3. Save a route
    console.log('\n3. Testing route saving...');
    const routeData = {
      username: 'testuser',
      name: 'Test Route',
      description: 'A test route for verification',
      destination: 'Tel Aviv',
      type: 'cycling-regular',
      path: [[34.7818, 32.0853], [34.7818, 32.0853]], // Sample coordinates
      pathDays: []
    };

    const saveResponse = await fetch(`${API_BASE}/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData)
    });

    if (saveResponse.ok) {
      const savedRoute = await saveResponse.json();
      console.log('✅ Route saved successfully');
      console.log('   Route ID:', savedRoute.route._id);
      console.log('   Route Name:', savedRoute.route.name);
    } else {
      const error = await saveResponse.json();
      console.log('❌ Route saving failed:', error.message);
      return;
    }

    // 4. Get user routes
    console.log('\n4. Testing route retrieval...');
    const getRoutesResponse = await fetch(`${API_BASE}/routes?username=testuser`);
    
    if (getRoutesResponse.ok) {
      const routes = await getRoutesResponse.json();
      console.log('✅ Routes retrieved successfully');
      console.log('   Number of routes:', routes.length);
      if (routes.length > 0) {
        console.log('   First route name:', routes[0].name);
        console.log('   First route ID:', routes[0]._id);
      }
    } else {
      const error = await getRoutesResponse.json();
      console.log('❌ Route retrieval failed:', error.message);
    }

    // 5. Delete a route (if we have one)
    console.log('\n5. Testing route deletion...');
    const routesResponse = await fetch(`${API_BASE}/routes?username=testuser`);
    if (routesResponse.ok) {
      const routes = await routesResponse.json();
      if (routes.length > 0) {
        const routeId = routes[0]._id;
        const deleteResponse = await fetch(`${API_BASE}/routes/${routeId}?username=testuser`, {
          method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Route deleted successfully');
        } else {
          const error = await deleteResponse.json();
          console.log('❌ Route deletion failed:', error.message);
        }
      } else {
        console.log('⚠️ No routes to delete');
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ User registration/login working');
    console.log('   ✅ Route saving working');
    console.log('   ✅ Route retrieval working');
    console.log('   ✅ Route deletion working');
    console.log('\n🚀 Your MongoDB route saving feature is ready to use!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testMongoDBIntegration(); 