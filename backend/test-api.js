// Simple API test script
// Run this with: node test-api.js

const API_URL = 'http://localhost:5000/api';

// Test health endpoint
async function testHealth() {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }
}

// Test user registration
async function testRegister() {
  try {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'test123',
      role: 'customer'
    };

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration Success:', data);
      return data.token;
    } else {
      console.log('❌ Registration Failed:', data);
    }
  } catch (error) {
    console.log('❌ Registration Error:', error.message);
  }
}

// Test user login
async function testLogin() {
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'test123'
    };

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login Success:', data);
      return data.token;
    } else {
      console.log('❌ Login Failed:', data);
    }
  } catch (error) {
    console.log('❌ Login Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing API endpoints...\n');
  
  await testHealth();
  console.log('');
  
  const token = await testRegister();
  console.log('');
  
  await testLogin();
  
  console.log('\n✨ Test completed!');
}

runTests();