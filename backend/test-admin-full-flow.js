import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import User from './models/User.js';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const testAdminFullFlow = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found!');
      await mongoose.disconnect();
      return;
    }
    
    console.log('Admin user found:', adminUser.email);

    // Test 1: Admin Login
    console.log('\n=== Testing Admin Login ===');
    let adminToken;
    
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: adminUser.email,
        password: 'Dinuka@111', // From seedDatabase.js
        role: 'admin'
      });
      
      console.log('✅ Admin login successful!');
      console.log('- User role:', loginResponse.data.user.role);
      console.log('- User email:', loginResponse.data.user.email);
      console.log('- Token received:', loginResponse.data.token ? 'Yes' : 'No');
      
      adminToken = loginResponse.data.token;
      
    } catch (error) {
      console.log('❌ Admin login failed:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
      
      // If login fails, we can't continue with the API tests
      if (error.response?.status === 401) {
        console.log('\n💡 Tip: The admin password might not be "password123"');
        console.log('You can set the admin password by running:');
        console.log('node -e "import bcrypt from \'bcrypt\'; console.log(await bcrypt.hash(\'password123\', 12));"');
        console.log('Then update the admin user in MongoDB');
      }
      
      await mongoose.disconnect();
      return;
    }

    // Test 2: Access pending gyms with admin token
    console.log('\n=== Testing Admin Pending Gyms Access ===');
    try {
      const pendingResponse = await axios.get(`${API_URL}/gyms/admin/pending`, {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin pending gyms API success!');
      console.log('- Pending gyms count:', pendingResponse.data.count);
      console.log('- Data length:', pendingResponse.data.data?.length || 0);
      
      if (pendingResponse.data.data && pendingResponse.data.data.length > 0) {
        console.log('\nPending gyms:');
        pendingResponse.data.data.forEach(gym => {
          console.log(`- ${gym.gymName} (Owner: ${gym.owner?.email || 'Unknown'})`);
        });
      } else {
        console.log('No pending gyms found.');
      }
      
    } catch (error) {
      console.log('❌ Error accessing pending gyms:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
    }

    // Test 3: Approve a pending gym
    console.log('\n=== Testing Gym Approval ===');
    try {
      // First get a pending gym
      const pendingResponse = await axios.get(`${API_URL}/gyms/admin/pending`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (pendingResponse.data.data && pendingResponse.data.data.length > 0) {
        const pendingGym = pendingResponse.data.data[0];
        console.log(`Attempting to approve gym: ${pendingGym.gymName}`);
        
        const approveResponse = await axios.put(
          `${API_URL}/gyms/${pendingGym._id}/approve`,
          { adminNotes: 'Test approval from admin flow test' },
          { headers: { 'Authorization': `Bearer ${adminToken}` } }
        );
        
        console.log('✅ Gym approval successful!');
        console.log('- Gym status:', approveResponse.data.gym?.status);
        console.log('- Owner role updated:', approveResponse.data.user?.role);
        
      } else {
        console.log('No pending gyms to approve');
      }
      
    } catch (error) {
      console.log('❌ Error approving gym:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
    }

    await mongoose.disconnect();
    console.log('\n✅ Full admin flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await mongoose.disconnect();
  }
};

testAdminFullFlow();