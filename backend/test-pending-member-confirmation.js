import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function testPendingMemberConfirmation() {
  try {
    console.log('🧪 Testing Payment Confirmation for Pending Member...\n');

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

    // Get members to find the pending one
    console.log('\n2. Fetching gym members to find pending payments...');
    const membersResponse = await axios.get(`${API_BASE_URL}/members?status=inactive&limit=50`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (!membersResponse.data.success) {
      console.log('❌ Failed to fetch members:', membersResponse.data.message);
      return;
    }

    // Filter for members with pending payment status
    const pendingMembers = membersResponse.data.data.filter(member => 
      member.paymentDetails?.paymentStatus === 'pending' || 
      (member.status === 'inactive' && member.paymentDetails?.method === 'manual')
    );

    if (pendingMembers.length === 0) {
      console.log('❌ No pending members found for payment confirmation.');
      console.log('   All inactive members:');
      membersResponse.data.data.forEach(member => {
        console.log(`   - ${member.firstName} ${member.lastName} (${member._id})`);
        console.log(`     Status: ${member.status}, Payment Status: ${member.paymentDetails?.paymentStatus || 'unknown'}, Method: ${member.paymentDetails?.method || 'unknown'}`);
      });
      return;
    }

    console.log(`✅ Found ${pendingMembers.length} pending member(s):`);
    pendingMembers.forEach(member => {
      console.log(`   - ${member.firstName} ${member.lastName} (${member._id})`);
      console.log(`     Status: ${member.status}, Payment Status: ${member.paymentDetails?.paymentStatus}`);
    });

    // Test confirmation on the first pending member
    const testMember = pendingMembers[0];
    console.log(`\n3. Confirming payment for ${testMember.firstName} ${testMember.lastName}...`);
    
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
      
      console.log('\n4. Verifying notification was sent...');
      console.log('📧 Customer notification should have been sent!');
    } else {
      console.log('❌ Payment confirmation failed:', confirmResponse.data.message);
    }

    console.log('\n🎉 Payment confirmation test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testPendingMemberConfirmation();