const fetch = require('node-fetch');

async function testRouteSaving() {
  console.log('Testing route saving functionality...');
  
  try {
    // Test saving a route
    const routeData = {
      username: 'testuser',
      name: 'Test Route',
      description: 'A test route',
      destination: 'Tel Aviv',
      type: 'cycling-regular',
      path: [[34.7818, 32.0853]],
      pathDays: []
    };

    const response = await fetch('http://localhost:5000/api/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Route saved successfully:', result.message);
      console.log('Route ID:', result.route.id);
    } else {
      const error = await response.json();
      console.log('❌ Error:', error.message);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testRouteSaving(); 