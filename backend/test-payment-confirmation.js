import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function testPaymentConfirmation() {
  try {
    console.log('🧪 Testing Payment Confirmation Flow...\n');

    // First we need a gym owner token
    console.log('1. Logging in as gym owner...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'gym1@gmail.com',
      password: 'Dinuka@111'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const authToken = loginResponse.data.token;
    console.log('✅ Gym owner logged in successfully');

    // Get members to find a pending one
    console.log('\n2. Fetching gym members...');
    const membersResponse = await axios.get(`${API_BASE_URL}/members`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (!membersResponse.data.success || membersResponse.data.data.length === 0) {
      console.log('❌ No members found. Please register a customer first.');
      return;
    }

    // Find a member with pending payment status
    const pendingMember = membersResponse.data.data.find(member => 
      member.paymentDetails?.paymentStatus === 'pending' || member.status === 'inactive'
    );

    if (!pendingMember) {
      console.log('❌ No pending members found. Using first member for testing.');
      const testMember = membersResponse.data.data[0];
      console.log(`   Using member: ${testMember.firstName} ${testMember.lastName} (${testMember._id})`);
      
      // Test confirmation
      console.log('\n3. Confirming payment...');
      const confirmResponse = await axios.patch(
        `${API_BASE_URL}/members/${testMember._id}/confirm-payment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      if (confirmResponse.data.success) {
        console.log('✅ Payment confirmed successfully!');
        console.log(`   Message: ${confirmResponse.data.message}`);
        console.log(`   Member Status: ${confirmResponse.data.data.member.status}`);
        console.log(`   Payment Status: ${confirmResponse.data.data.member.paymentDetails.paymentStatus}`);
      } else {
        console.log('❌ Payment confirmation failed:', confirmResponse.data.message);
      }
    } else {
      console.log(`✅ Found pending member: ${pendingMember.firstName} ${pendingMember.lastName}`);
      console.log(`   Member ID: ${pendingMember._id}`);
      console.log(`   Current Status: ${pendingMember.status}`);
      console.log(`   Payment Status: ${pendingMember.paymentDetails?.paymentStatus || 'unknown'}`);

      // Test confirmation
      console.log('\n3. Confirming payment...');
      const confirmResponse = await axios.patch(
        `${API_BASE_URL}/members/${pendingMember._id}/confirm-payment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      if (confirmResponse.data.success) {
        console.log('✅ Payment confirmed successfully!');
        console.log(`   Message: ${confirmResponse.data.message}`);
        console.log(`   Member Status: ${confirmResponse.data.data.member.status}`);
        console.log(`   Payment Status: ${confirmResponse.data.data.member.paymentDetails.paymentStatus}`);
        
        console.log('\n4. Checking notifications...');
        console.log('📧 Customer notification should have been sent!');
      } else {
        console.log('❌ Payment confirmation failed:', confirmResponse.data.message);
      }
    }

    console.log('\n🎉 Payment confirmation test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testPaymentConfirmation();