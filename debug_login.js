const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:5000/api';

async function debugLogin() {
  console.log('🔍 Debugging login...\n');

  try {
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };

    console.log('Sending login request with:', loginData);
    
    const loginResponse = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    console.log('Response status:', loginResponse.status);
    
    const responseText = await loginResponse.text();
    console.log('Response body:', responseText);

    if (loginResponse.ok) {
      const result = JSON.parse(responseText);
      console.log('✅ Login successful!');
      console.log('Token:', result.token ? 'Received' : 'Missing');
    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugLogin(); 