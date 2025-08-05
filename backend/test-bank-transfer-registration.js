import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function testBankTransferRegistration() {
  try {
    console.log('🧪 Testing Bank Transfer Registration...\n');

    const gymId = '688747e3a54eef2bee1622dd'; // Gym1
    
    // Create a dummy receipt
    const receiptContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync('/tmp/test-receipt.png', receiptContent);

    const customerData = {
      firstName: 'Test',
      lastName: 'BankTransfer',
      email: `bank.transfer.${Date.now()}@test.com`,
      phone: '+94771234567',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      height: '175',
      weight: '70',
      bmi: '22.9',
      waist: '32',
      fitnessGoals: JSON.stringify(['Weight Loss']),
      plan: 'Premium',
      paymentMethod: 'bank_transfer',
      healthConditions: JSON.stringify([]),
      emergencyContact: JSON.stringify({
        name: 'Emergency',
        phone: '+94771234567',
        relationship: 'Friend'
      })
    };

    console.log('1. Customer Data:');
    console.log(`   Payment Method: ${customerData.paymentMethod}`);
    console.log(`   Email: ${customerData.email}`);

    const formData = new FormData();
    Object.keys(customerData).forEach(key => {
      formData.append(key, customerData[key]);
    });
    formData.append('receipt', fs.createReadStream('/tmp/test-receipt.png'));

    console.log('\n2. Sending registration request...');
    const response = await axios.post(
      `${API_BASE_URL}/members/register/${gymId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        }
      }
    );

    if (response.data.success) {
      const member = response.data.data.member;
      console.log('\n✅ Registration Response:');
      console.log(`   Member ID: ${member._id}`);
      console.log(`   Status: ${member.status}`);
      console.log(`   Payment Status: ${member.paymentDetails?.paymentStatus}`);
      console.log(`   Payment Method: ${member.paymentDetails?.method}`);
      console.log(`   Receipt Path: ${member.paymentDetails?.receiptPath || 'none'}`);
      
      console.log('\n📋 Expected vs Actual:');
      console.log(`   Expected Status: inactive | Actual: ${member.status}`);
      console.log(`   Expected Payment Status: pending | Actual: ${member.paymentDetails?.paymentStatus}`);
      
      if (member.status === 'inactive' && member.paymentDetails?.paymentStatus === 'pending') {
        console.log('\n✅ SUCCESS: Bank transfer registration working correctly!');
      } else {
        console.log('\n❌ ERROR: Status should be inactive and payment should be pending!');
      }
    }

    // Clean up
    fs.unlinkSync('/tmp/test-receipt.png');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBankTransferRegistration();