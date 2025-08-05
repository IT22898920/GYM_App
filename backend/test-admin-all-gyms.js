import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const testAdminAllGyms = async () => {
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

    // Generate a JWT token for the admin user
    const token = jwt.sign(
      { userId: adminUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('\n=== Testing /gyms endpoint with Admin Token (No Status Filter) ===');
    try {
      const response = await axios.get(`${API_URL}/gyms?limit=100`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ SUCCESS! Admin all gyms API response:');
      console.log('- Success:', response.data.success);
      console.log('- Total returned:', response.data.data?.length || 0);
      console.log('- Pagination:', response.data.pagination);
      
      if (response.data.data && response.data.data.length > 0) {
        console.log('\n📊 Gyms by status:');
        const statusCount = {};
        response.data.data.forEach(gym => {
          statusCount[gym.status] = (statusCount[gym.status] || 0) + 1;
        });
        Object.entries(statusCount).forEach(([status, count]) => {
          console.log(`- ${status}: ${count}`);
        });
        
        console.log('\n🏢 All gyms returned:');
        response.data.data.forEach(gym => {
          console.log(`- ${gym.gymName} (Status: ${gym.status}, Owner: ${gym.owner?.email || 'Unknown'})`);
        });
      } else {
        console.log('No gyms returned');
      }
      
    } catch (error) {
      console.log('❌ ERROR calling /gyms endpoint:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
    }

    console.log('\n=== Testing /gyms endpoint with status=pending ===');
    try {
      const response = await axios.get(`${API_URL}/gyms?status=pending&limit=100`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ SUCCESS! Admin pending gyms via /gyms:');
      console.log('- Success:', response.data.success);
      console.log('- Total returned:', response.data.data?.length || 0);
      
      if (response.data.data && response.data.data.length > 0) {
        console.log('\nPending gyms via /gyms:');
        response.data.data.forEach(gym => {
          console.log(`- ${gym.gymName} (Status: ${gym.status})`);
        });
      } else {
        console.log('No pending gyms returned via /gyms endpoint');
      }
      
    } catch (error) {
      console.log('❌ ERROR calling /gyms?status=pending:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
    }

    console.log('\n=== Testing /gyms endpoint with status=approved ===');
    try {
      const response = await axios.get(`${API_URL}/gyms?status=approved&limit=100`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ SUCCESS! Admin approved gyms via /gyms:');
      console.log('- Success:', response.data.success);
      console.log('- Total returned:', response.data.data?.length || 0);
      
    } catch (error) {
      console.log('❌ ERROR calling /gyms?status=approved:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
    }

    await mongoose.disconnect();
    console.log('\n✅ Admin all gyms test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await mongoose.disconnect();
  }
};

testAdminAllGyms();