import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function testCustomerRegistration() {
  try {
    console.log('🧪 Testing Customer Registration Flow...\n');

    // 1. First, get available gyms
    console.log('1. Fetching available gyms...');
    const gymsResponse = await axios.get(`${API_BASE_URL}/gyms`);
    
    if (!gymsResponse.data.success || gymsResponse.data.data.length === 0) {
      console.log('❌ No gyms found. Please create a gym first.');
      return;
    }

    const testGym = gymsResponse.data.data[0];
    console.log(`✅ Using gym: ${testGym.gymName} (ID: ${testGym._id})`);

    // 2. Test customer registration data
    const testCustomerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: `test.customer.${Date.now()}@example.com`,
      phone: '+94771234567',
      gender: 'male',
      dateOfBirth: '1990-05-15',
      height: '175',
      weight: '70',
      bmi: '22.9',
      bodyFat: '15',
      waist: '32',
      hips: '36',
      biceps: '14',
      chest: '40',
      thighs: '22',
      fitnessGoals: ['Weight Loss', 'Muscle Gain'],
      plan: 'monthly',
      paymentMethod: 'bank_transfer',
      healthConditions: [],
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+94771234568'
      }
    };

    console.log('\n2. Test customer data:');
    console.log(JSON.stringify(testCustomerData, null, 2));

    // 3. Create FormData for the request
    const formData = new FormData();
    
    Object.keys(testCustomerData).forEach(key => {
      if (Array.isArray(testCustomerData[key])) {
        formData.append(key, JSON.stringify(testCustomerData[key]));
      } else if (typeof testCustomerData[key] === 'object') {
        formData.append(key, JSON.stringify(testCustomerData[key]));
      } else {
        formData.append(key, testCustomerData[key]);
      }
    });

    // 4. Create a dummy PDF receipt file for testing
    const receiptContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000173 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n253\n%%EOF';
    const receiptPath = path.join(process.cwd(), 'test-receipt.pdf');
    fs.writeFileSync(receiptPath, receiptContent);
    formData.append('receipt', fs.createReadStream(receiptPath), 'test-receipt.pdf');

    console.log('\n3. Submitting customer registration...');

    // 5. Submit registration
    const registrationResponse = await axios.post(
      `${API_BASE_URL}/members/register/${testGym._id}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    if (registrationResponse.data.success) {
      console.log('✅ Registration successful!');
      console.log(`Message: ${registrationResponse.data.message}`);
      console.log(`Customer: ${registrationResponse.data.data.customer.name}`);
      console.log(`Email: ${registrationResponse.data.data.customer.email}`);
      console.log(`Gym: ${registrationResponse.data.data.gym.name}`);
      console.log(`Member ID: ${registrationResponse.data.data.member._id}`);
      
      // 6. Check notifications
      console.log('\n4. Checking notifications...');
      
      // Try to get customer notifications (this would require auth in real scenario)
      console.log('📧 Notifications should have been sent to:');
      console.log(`   - Customer: ${testCustomerData.email}`);
      console.log(`   - Gym Owner: ${testGym.owner}`);
      
      console.log('\n🎉 Customer registration test completed successfully!');
      
      // Clean up test file
      if (fs.existsSync(receiptPath)) {
        fs.unlinkSync(receiptPath);
      }
      
    } else {
      console.log('❌ Registration failed:', registrationResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    // Clean up test file if it exists
    const receiptPath = path.join(process.cwd(), 'test-receipt.pdf');
    if (fs.existsSync(receiptPath)) {
      fs.unlinkSync(receiptPath);
    }
  }
}

// Run the test
testCustomerRegistration();