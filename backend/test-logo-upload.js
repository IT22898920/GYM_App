import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:5000/api';

// Test user credentials (using our existing customer-turned-gymOwner)
const testUser = {
  email: 'customer@test.com',
  password: 'password123'
};

// Create a simple test logo (1x1 pixel PNG)
const createTestLogo = () => {
  // Base64 of a 1x1 pixel red PNG
  const pngData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(pngData, 'base64');
  const testLogoPath = path.join(__dirname, 'test-logo.png');
  fs.writeFileSync(testLogoPath, buffer);
  return testLogoPath;
};

// Login function
async function login() {
  try {
    console.log('🔐 Logging in as gym owner...');
    const response = await axios.post(`${API_URL}/auth/gym-owner/login`, {
      email: testUser.email,
      password: testUser.password,
      role: 'gymOwner'
    });
    console.log('✅ Login successful');
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Get user's gyms
async function getMyGyms(token) {
  try {
    console.log('📋 Fetching user gyms...');
    const response = await axios.get(`${API_URL}/gyms/owner/gyms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Gyms fetched:', response.data.data.length, 'gyms found');
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch gyms:', error.response?.data || error.message);
    throw error;
  }
}

// Upload logo to gym
async function uploadLogo(gymId, token, logoPath) {
  try {
    console.log(`🎨 Uploading test logo to gym ${gymId}...`);
    
    const formData = new FormData();
    formData.append('logo', fs.createReadStream(logoPath));

    const response = await axios.post(
      `${API_URL}/gyms/${gymId}/upload-logo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );

    console.log('✅ Logo uploaded successfully to Cloudinary!');
    console.log('🎨 Logo details:');
    console.log('   URL:', response.data.data.logo.url);
    console.log('   Public ID:', response.data.data.logo.publicId);
    console.log('   Size:', response.data.data.logo.size, 'bytes');
    console.log('   Dimensions:', `${response.data.data.logo.width}x${response.data.data.logo.height}`);
    console.log('   Format:', response.data.data.logo.format);

    return response.data;
  } catch (error) {
    console.error('❌ Logo upload failed:', error.response?.data || error.message);
    throw error;
  }
}

// Get gym with logo
async function getGymWithLogo(gymId, token) {
  try {
    console.log('🏋️ Fetching gym details to verify logo...');
    const response = await axios.get(`${API_URL}/gyms/${gymId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const gym = response.data.data;
    console.log('✅ Gym details fetched');
    console.log('   Gym name:', gym.gymName);
    console.log('   Logo stored:', gym.logo ? 'Yes' : 'No');
    
    if (gym.logo) {
      console.log('   Logo URL:', gym.logo.url);
      console.log('   Logo Public ID:', gym.logo.publicId);
    }
    
    return gym;
  } catch (error) {
    console.error('❌ Failed to fetch gym:', error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function testLogoUpload() {
  console.log('🚀 Starting Gym Logo Upload Test');
  console.log('=================================\n');

  let testLogoPath;
  
  try {
    // Create test logo
    console.log('🎨 Creating test logo...');
    testLogoPath = createTestLogo();
    console.log('✅ Test logo created:', testLogoPath);

    // Login
    const token = await login();

    // Get user's gyms
    const gyms = await getMyGyms(token);
    
    if (gyms.length === 0) {
      console.log('❌ No gyms found for this user. Please register a gym first.');
      return;
    }

    const firstGym = gyms[0];
    console.log(`📍 Using gym: ${firstGym.gymName} (ID: ${firstGym._id})`);

    // Upload logo
    await uploadLogo(firstGym._id, token, testLogoPath);

    // Verify logo is stored
    await getGymWithLogo(firstGym._id, token);

    console.log('\n✅ Logo upload test completed successfully!');
    console.log('🎉 Gym logo is now being stored in Cloudinary and database!');

  } catch (error) {
    console.error('\n❌ Logo upload test failed:', error.message);
  } finally {
    // Cleanup test logo
    if (testLogoPath && fs.existsSync(testLogoPath)) {
      fs.unlinkSync(testLogoPath);
      console.log('🧹 Cleaned up test logo');
    }
  }
}

// Run the test
testLogoUpload();