import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function checkPendingViaAPI() {
  try {
    // Login as gym owner
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'gym1@gmail.com',
      password: 'Dinuka@111'
    });

    const authToken = loginResponse.data.token;
    console.log('✅ Logged in as gym owner');

    // Check all members
    console.log('\n1. Checking all members:');
    const allResponse = await axios.get(`${API_BASE_URL}/members?limit=50`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log(`Total members: ${allResponse.data.data.length}`);
    allResponse.data.data.forEach(m => {
      console.log(`- ${m.firstName} ${m.lastName}: status=${m.status}, paymentStatus=${m.paymentDetails?.paymentStatus}, method=${m.paymentDetails?.method}`);
    });

    // Check inactive members
    console.log('\n2. Checking inactive members:');
    const inactiveResponse = await axios.get(`${API_BASE_URL}/members?status=inactive&limit=50`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log(`Inactive members: ${inactiveResponse.data.data.length}`);
    
    const pendingMembers = inactiveResponse.data.data.filter(member => 
      member.paymentDetails?.paymentStatus === 'pending' || 
      (member.status === 'inactive' && member.paymentDetails?.method === 'manual')
    );
    
    console.log(`\n3. Pending payment members: ${pendingMembers.length}`);
    pendingMembers.forEach(m => {
      console.log(`- ${m.firstName} ${m.lastName}`);
      console.log(`  Status: ${m.status}`);
      console.log(`  Payment Status: ${m.paymentDetails?.paymentStatus}`);
      console.log(`  Payment Method: ${m.paymentDetails?.method}`);
      console.log(`  Receipt Path: ${m.paymentDetails?.receiptPath || 'none'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

checkPendingViaAPI();