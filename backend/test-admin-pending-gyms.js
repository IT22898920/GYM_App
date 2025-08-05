import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const testAdminPendingGyms = async () => {
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
    console.log('Admin user ID:', adminUser._id);
    console.log('Admin user role:', adminUser.role);

    // Generate a JWT token for the admin user (same way the backend does)
    const token = jwt.sign(
      { 
        userId: adminUser._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('\nGenerated admin token (first 50 chars):', token.substring(0, 50) + '...');

    // Test the admin pending gyms endpoint
    console.log('\n=== Testing Admin Pending Gyms Endpoint ===');
    try {
      const response = await axios.get(`${API_URL}/gyms/admin/pending`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ SUCCESS! Admin pending gyms API response:');
      console.log('- Success:', response.data.success);
      console.log('- Count:', response.data.count);
      console.log('- Data length:', response.data.data?.length || 0);
      
      if (response.data.data && response.data.data.length > 0) {
        console.log('\nPending gyms returned:');
        response.data.data.forEach(gym => {
          console.log(`- ${gym.gymName} (Status: ${gym.status}, Owner: ${gym.owner?.email || 'Unknown'})`);
        });
      } else {
        console.log('No pending gyms returned (but there should be 1)');
      }
      
    } catch (error) {
      console.log('❌ ERROR calling admin pending gyms endpoint:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
      console.log('Full error data:', error.response?.data);
    }

    // Test regular gyms endpoint with admin token (should return all gyms)
    console.log('\n=== Testing Regular Gyms Endpoint with Admin Token ===');
    try {
      const response = await axios.get(`${API_URL}/gyms`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Regular gyms API response with admin token:');
      console.log('- Success:', response.data.success);
      console.log('- Data length:', response.data.data?.length || 0);
      
      if (response.data.data && response.data.data.length > 0) {
        console.log('\nAll gyms returned to admin:');
        response.data.data.forEach(gym => {
          console.log(`- ${gym.gymName} (Status: ${gym.status})`);
        });
      }
      
    } catch (error) {
      console.log('❌ ERROR calling regular gyms endpoint:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
    }

    await mongoose.disconnect();
    console.log('\n✅ Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await mongoose.disconnect();
  }
};

testAdminPendingGyms();