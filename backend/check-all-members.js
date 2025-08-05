import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function checkAllMembers() {
  try {
    console.log('🔍 Checking all members in the system...\n');

    // Login as gym owner
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'gym1@gmail.com',
      password: 'Dinuka@111'
    });

    const authToken = loginResponse.data.token;
    console.log('✅ Logged in as gym owner');

    // Get all members (no status filter)
    console.log('\n📋 All members:');
    const allMembersResponse = await axios.get(`${API_BASE_URL}/members?limit=50`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (allMembersResponse.data.success) {
      const allMembers = allMembersResponse.data.data;
      console.log(`Found ${allMembers.length} total members:`);
      
      allMembers.forEach((member, index) => {
        console.log(`${index + 1}. ${member.firstName} ${member.lastName} (${member._id})`);
        console.log(`   Email: ${member.email}`);
        console.log(`   Status: ${member.status}`);
        console.log(`   Payment Status: ${member.paymentDetails?.paymentStatus || 'unknown'}`);
        console.log(`   Payment Method: ${member.paymentDetails?.method || 'unknown'}`);
        console.log(`   Receipt Path: ${member.paymentDetails?.receiptPath || 'none'}`);
        console.log(`   Created: ${new Date(member.createdAt).toLocaleString()}`);
        console.log('');
      });
    }

    // Get inactive members specifically
    console.log('\n🔴 Inactive members:');
    const inactiveMembersResponse = await axios.get(`${API_BASE_URL}/members?status=inactive&limit=50`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (inactiveMembersResponse.data.success) {
      const inactiveMembers = inactiveMembersResponse.data.data;
      console.log(`Found ${inactiveMembers.length} inactive members:`);
      
      inactiveMembers.forEach((member, index) => {
        console.log(`${index + 1}. ${member.firstName} ${member.lastName} (${member._id})`);
        console.log(`   Status: ${member.status}`);
        console.log(`   Payment Status: ${member.paymentDetails?.paymentStatus || 'unknown'}`);
        console.log(`   Payment Method: ${member.paymentDetails?.method || 'unknown'}`);
        console.log(`   Created: ${new Date(member.createdAt).toLocaleString()}`);
        console.log('');
      });

      // Check for pending payments
      const pendingMembers = inactiveMembers.filter(member => 
        member.paymentDetails?.paymentStatus === 'pending' || 
        (member.status === 'inactive' && member.paymentDetails?.method === 'manual')
      );

      console.log(`\n⏳ Members with pending payments: ${pendingMembers.length}`);
      pendingMembers.forEach((member, index) => {
        console.log(`${index + 1}. ${member.firstName} ${member.lastName}`);
        console.log(`   Should appear in pending payments section`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

checkAllMembers();