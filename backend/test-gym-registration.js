import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';

// Test users
const testUsers = {
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    email: `customer-${Date.now()}@test.com`, // Use timestamp to ensure unique email
    password: 'password123',
    role: 'customer'
  },
  admin: {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  }
};

// Test gym data
const testGymData = {
  gymName: `FitZone Wellness Center ${Date.now()}`,
  description: 'A modern fitness center with state-of-the-art equipment',
  contactInfo: {
    email: 'contact@fitzone.com',
    phone: '0771234567',
    website: 'https://fitzone.com'
  },
  address: {
    street: '123 Main Street',
    city: 'Colombo',
    state: 'Western Province',
    zipCode: '00700',
    country: 'Sri Lanka'
  },
  location: {
    type: 'Point',
    coordinates: [79.8612, 6.9271] // Colombo coordinates [lng, lat]
  },
  facilities: ['Weight Machines', 'Cardio Equipment', 'Swimming Pool', 'Locker Rooms'],
  services: ['Personal Training', 'Group Classes', 'Yoga', 'CrossFit'],
  pricing: {
    membershipPlans: [
      {
        name: 'Basic',
        duration: 'monthly',
        price: 5000,
        benefits: ['Access to gym equipment', 'Locker room access']
      },
      {
        name: 'Premium',
        duration: 'monthly',
        price: 8000,
        benefits: ['All Basic benefits', 'Group classes', 'Swimming pool access']
      }
    ],
    dropInFee: 500
  },
  amenities: ['Parking', 'Showers', 'Towel Service'],
  capacity: 100,
  establishedYear: 2020,
  socialMedia: {
    facebook: 'https://facebook.com/fitzone',
    instagram: 'https://instagram.com/fitzone'
  },
  tags: ['modern', 'wellness', 'fitness']
};

// Helper function to register a user
async function registerUser(userData) {
  try {
    console.log(`\n📝 Registering ${userData.role}:`, userData.email);
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log('✅ Registration successful');
    return response.data;
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  User already exists, skipping registration');
      return null;
    }
    console.error('❌ Registration failed:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to login
async function loginUser(email, password, role = 'customer') {
  try {
    console.log(`\n🔐 Logging in as ${role}:`, email);
    
    // Map role to endpoint path and request body role
    const roleMapping = {
      'customer': { path: 'customer', bodyRole: 'customer' },
      'admin': { path: 'admin', bodyRole: 'admin' },
      'instructor': { path: 'instructor', bodyRole: 'instructor' },
      'gym-owner': { path: 'gym-owner', bodyRole: 'gymOwner' },
      'gymOwner': { path: 'gym-owner', bodyRole: 'gymOwner' }
    };
    
    const mapping = roleMapping[role] || { path: role, bodyRole: role };
    
    const response = await axios.post(`${API_URL}/auth/${mapping.path}/login`, { 
      email, 
      password,
      role: mapping.bodyRole 
    });
    console.log('✅ Login successful');
    console.log('   Token:', response.data.token);
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to register a gym
async function registerGym(gymData, token) {
  try {
    console.log('\n🏋️ Registering gym:', gymData.gymName);
    const response = await axios.post(
      `${API_URL}/gyms/register`,
      gymData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Gym registration successful');
    console.log('   Gym ID:', response.data.data._id);
    console.log('   Status:', response.data.data.status);
    return response.data;
  } catch (error) {
    console.error('❌ Gym registration failed:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to approve gym (admin only)
async function approveGym(gymId, adminToken) {
  try {
    console.log(`\n✅ Approving gym: ${gymId}`);
    const response = await axios.put(
      `${API_URL}/gyms/${gymId}/approve`,
      { adminNotes: 'Approved after review' },
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Gym approved successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Gym approval failed:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to get user's gyms
async function getMyGyms(token) {
  try {
    console.log('\n📋 Fetching user\'s gyms');
    const response = await axios.get(
      `${API_URL}/gyms/owner/gyms`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Gyms fetched successfully');
    console.log('   Total gyms:', response.data.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch gyms:', error.response?.data || error.message);
    throw error;
  }
}

// Main test flow
async function runTests() {
  console.log('🚀 Starting Gym Registration Test Flow');
  console.log('=====================================\n');

  try {
    // Step 1: Register users
    console.log('Step 1: Register Test Users');
    console.log('---------------------------');
    await registerUser(testUsers.customer);
    await registerUser(testUsers.admin);

    // Step 2: Customer login
    console.log('\nStep 2: Customer Login');
    console.log('----------------------');
    const customerAuth = await loginUser(testUsers.customer.email, testUsers.customer.password, 'customer');
    const customerToken = customerAuth.token;

    // Step 3: Customer registers gym
    console.log('\nStep 3: Customer Registers Gym');
    console.log('------------------------------');
    const gymResponse = await registerGym(testGymData, customerToken);
    const gymId = gymResponse.data._id;

    // Step 4: Check customer's gyms
    console.log('\nStep 4: Check Customer\'s Gyms');
    console.log('-----------------------------');
    await getMyGyms(customerToken);

    // Step 5: Admin login
    console.log('\nStep 5: Admin Login');
    console.log('-------------------');
    const adminAuth = await loginUser(testUsers.admin.email, testUsers.admin.password, 'admin');
    const adminToken = adminAuth.token;

    // Step 6: Admin approves gym
    console.log('\nStep 6: Admin Approves Gym');
    console.log('--------------------------');
    await approveGym(gymId, adminToken);

    // Step 7: Customer (now gym owner) checks gyms again
    console.log('\nStep 7: Check Updated User Status');
    console.log('---------------------------------');
    console.log('ℹ️  Note: User role should now be updated to gymOwner');
    
    // Re-login to get updated token with new role
    console.log('\n🔐 Re-logging in to get updated role...');
    const updatedAuth = await loginUser(testUsers.customer.email, testUsers.customer.password, 'gym-owner');
    console.log('   New role:', updatedAuth.user.role);
    
    await getMyGyms(updatedAuth.token);

    console.log('\n\n✅ All tests completed successfully!');
    console.log('=====================================');
    console.log('\n📌 Summary:');
    console.log('- Customer registered: customer@test.com');
    console.log('- Gym registered: FitZone Wellness Center');
    console.log('- Admin approved the gym');
    console.log('- Customer role updated to gymOwner');
    console.log('\n🎉 The gym registration flow is working correctly!');

  } catch (error) {
    console.error('\n\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();