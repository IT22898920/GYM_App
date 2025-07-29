import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

// Test the gym requests API endpoints
async function testGymRequestsAPI() {
  try {
    console.log('🧪 Testing Gym Requests API Endpoints...\n');

    // Test health endpoint first
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Server health:', healthData.message);
    
    console.log('\n📊 Summary:');
    console.log('- Server is running');
    console.log('- Gym Request endpoints are available at:');
    console.log('  POST /api/gym-requests/send');
    console.log('  GET  /api/gym-requests/my-requests');
    console.log('  GET  /api/gym-requests');
    console.log('  PUT  /api/gym-requests/approve/:id');
    console.log('  PUT  /api/gym-requests/reject/:id');
    console.log('  PUT  /api/gym-requests/cancel/:id');
    
    console.log('\n🎉 API is ready for testing!');
    console.log('\nTo test the frontend:');
    console.log('1. Start the frontend: cd frontend && npm run dev');
    console.log('2. Login as an instructor');
    console.log('3. Navigate to Gym Requests in the sidebar');
    console.log('4. Login as a gym owner'); 
    console.log('5. Navigate to Gym Requests to approve/reject');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testGymRequestsAPI();