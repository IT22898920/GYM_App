import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function debugGymOwner() {
  try {
    console.log('🔍 Debugging gym owner and gym relationship...\n');

    // Login as gym owner
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'gym1@gmail.com',
      password: 'Dinuka@111'
    });

    const authToken = loginResponse.data.token;
    const gymOwnerId = loginResponse.data.user.id;
    console.log('✅ Logged in as gym owner');
    console.log(`   Gym Owner ID: ${gymOwnerId}`);

    // Get gyms to see which gym this owner owns
    const gymsResponse = await axios.get(`${API_BASE_URL}/gyms`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (gymsResponse.data.success) {
      console.log(`\n🏢 All gyms (${gymsResponse.data.data.length}):`);
      gymsResponse.data.data.forEach((gym, index) => {
        console.log(`${index + 1}. ${gym.gymName} (${gym._id})`);
        console.log(`   Owner ID: ${gym.owner._id || gym.owner}`);
        console.log(`   Status: ${gym.status}`);
        console.log(`   Matches current owner: ${(gym.owner._id || gym.owner) === gymOwnerId}`);
        console.log('');
      });
    }

    // Check owner's gyms specifically
    console.log('\n🏢 Getting owner\'s gyms...');
    const ownerGymsResponse = await axios.get(`${API_BASE_URL}/gyms/owner/gyms`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (ownerGymsResponse.data.success) {
      console.log(`Found ${ownerGymsResponse.data.data.length} gyms owned by this user:`);
      ownerGymsResponse.data.data.forEach((gym, index) => {
        console.log(`${index + 1}. ${gym.gymName} (${gym._id})`);
        console.log(`   Status: ${gym.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugGymOwner();