import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function createPendingMember() {
  try {
    console.log('🧪 Creating a member with pending payment status...\n');

    // Use the correct gym for our test gym owner
    console.log('1. Using the correct gym for our test gym owner...');
    const gymId = '688747e3a54eef2bee1622dd'; // Gym1 owned by gym1@gmail.com
    console.log(`✅ Using gym: Gym1 (ID: ${gymId})`);

    // Create test customer data with bank transfer payment
    const customerData = {
      firstName: 'Test',
      lastName: 'PendingCustomer',
      email: `pending.customer.${Date.now()}@example.com`,
      phone: '+1234567890',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      height: '175',
      weight: '70',
      bmi: '22.9',
      waist: '32',
      fitnessGoals: JSON.stringify(['Weight Loss', 'Muscle Gain']),
      plan: 'Basic',
      paymentMethod: 'bank_transfer',
      healthConditions: JSON.stringify([]),
      emergencyContact: JSON.stringify({
        name: 'Emergency Contact',
        phone: '+1234567890',
        relationship: 'Friend'
      })
    };

    console.log('\n2. Registering customer with bank transfer payment...');

    // Create form data
    const formData = new FormData();
    Object.keys(customerData).forEach(key => {
      formData.append(key, customerData[key]);
    });

    // Create a dummy receipt image file for testing
    const receiptContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync('/tmp/test-receipt.png', receiptContent);
    formData.append('receipt', fs.createReadStream('/tmp/test-receipt.png'));

    const registrationResponse = await axios.post(
      `${API_BASE_URL}/members/register/${gymId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        }
      }
    );

    if (registrationResponse.data.success) {
      console.log('✅ Customer registered successfully!');
      console.log(`   Customer: ${customerData.firstName} ${customerData.lastName}`);
      console.log(`   Email: ${customerData.email}`);
      console.log(`   Status: ${registrationResponse.data.data.member.status}`);
      console.log(`   Payment Status: ${registrationResponse.data.data.member.paymentDetails.paymentStatus}`);
      console.log(`   Member ID: ${registrationResponse.data.data.member._id}`);
      
      console.log('\n🎉 Test member with pending payment created successfully!');
      console.log('📝 This member should now appear in the gym owner\'s pending payments section.');
    } else {
      console.log('❌ Registration failed:', registrationResponse.data.message);
    }

    // Clean up temp file
    try {
      fs.unlinkSync('/tmp/test-receipt.png');
    } catch (err) {
      // Ignore cleanup errors
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
createPendingMember();