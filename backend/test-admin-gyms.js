import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import User from './models/User.js';
import Gym from './models/Gym.js';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const testAdminGymAccess = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First, check what gyms exist in the database
    const allGyms = await Gym.find({}).populate('owner', 'firstName lastName email role');
    console.log('\n=== All Gyms in Database ===');
    console.log('Total gyms:', allGyms.length);
    
    const gymsByStatus = {
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    allGyms.forEach(gym => {
      console.log(`- ${gym.gymName} (Status: ${gym.status}, Owner: ${gym.owner?.email || 'Unknown'})`);
      if (gym.status in gymsByStatus) {
        gymsByStatus[gym.status]++;
      }
    });
    
    console.log('\nGyms by status:');
    console.log('- Pending:', gymsByStatus.pending);
    console.log('- Approved:', gymsByStatus.approved);
    console.log('- Rejected:', gymsByStatus.rejected);

    // Find an admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('\nNo admin user found! Please create an admin user first.');
      await mongoose.disconnect();
      return;
    }
    
    console.log('\nAdmin user found:', adminUser.email);

    // Since we don't know the password, let's test the API directly with a token
    // For now, let's just test what a regular customer sees vs what should be returned
    
    console.log('\n=== Testing API Without Authentication ===');
    try {
      const publicResponse = await axios.get(`${API_URL}/gyms`);
      console.log('Public API Response (no auth):', {
        success: publicResponse.data.success,
        dataLength: publicResponse.data.data?.length || 0,
        pagination: publicResponse.data.pagination
      });
      
      console.log('\nGyms returned without auth (should be only approved):');
      publicResponse.data.data?.forEach(gym => {
        console.log(`- ${gym.gymName} (Status: ${gym.status})`);
      });
    } catch (error) {
      console.log('Error fetching without auth:', error.response?.data?.message || error.message);
    }

    // Let's check the frontend auth context to understand the issue
    console.log('\n=== Checking Frontend Configuration ===');
    console.log('The frontend should be:');
    console.log('1. Storing the token in localStorage as "token"');
    console.log('2. Sending it in the Authorization header as "Bearer {token}"');
    console.log('3. Using the correct API URL from VITE_API_URL env variable');
    
    console.log('\n=== Recommendations ===');
    console.log('1. Check browser DevTools Network tab to see the actual API request');
    console.log('2. Verify the Authorization header is being sent');
    console.log('3. Check localStorage for the token');
    console.log('4. Ensure the admin user has the correct role in the database');

    await mongoose.disconnect();
    console.log('\nTest completed!');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    await mongoose.disconnect();
  }
};

testAdminGymAccess();