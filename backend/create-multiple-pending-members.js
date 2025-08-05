import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

async function createMultiplePendingMembers() {
  try {
    console.log('🧪 Creating multiple members with pending payment status...\n');

    const gymId = '688747e3a54eef2bee1622dd'; // Gym1 owned by gym1@gmail.com
    
    // Create a dummy receipt image file
    const receiptContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync('/tmp/test-receipt.png', receiptContent);

    const members = [
      {
        firstName: 'Kamal',
        lastName: 'Perera',
        email: `kamal.perera.${Date.now()}@gmail.com`,
        phone: '+94771234567',
        plan: 'Premium'
      },
      {
        firstName: 'Nimal',
        lastName: 'Silva',
        email: `nimal.silva.${Date.now()}@gmail.com`,
        phone: '+94777654321',
        plan: 'Basic'
      },
      {
        firstName: 'Sunil',
        lastName: 'Fernando',
        email: `sunil.fernando.${Date.now()}@gmail.com`,
        phone: '+94779876543',
        plan: 'Standard'
      }
    ];

    for (const member of members) {
      const customerData = {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        gender: 'male',
        dateOfBirth: '1990-01-01',
        height: '175',
        weight: '70',
        bmi: '22.9',
        waist: '32',
        fitnessGoals: JSON.stringify(['Weight Loss', 'Muscle Gain']),
        plan: member.plan,
        paymentMethod: 'bank_transfer',
        healthConditions: JSON.stringify([]),
        emergencyContact: JSON.stringify({
          name: 'Emergency Contact',
          phone: '+94771234567',
          relationship: 'Friend'
        })
      };

      const formData = new FormData();
      Object.keys(customerData).forEach(key => {
        formData.append(key, customerData[key]);
      });
      formData.append('receipt', fs.createReadStream('/tmp/test-receipt.png'));

      try {
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
          console.log(`✅ Created pending member: ${member.firstName} ${member.lastName}`);
          console.log(`   Email: ${member.email}`);
          console.log(`   Plan: ${member.plan}`);
          console.log('');
        }
      } catch (err) {
        console.log(`❌ Failed to create ${member.firstName}: ${err.response?.data?.message || err.message}`);
      }
    }

    // Clean up
    fs.unlinkSync('/tmp/test-receipt.png');
    
    console.log('\n🎉 Multiple pending members created!');
    console.log('📝 Check the gym owner dashboard to see them in the pending payments section.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

createMultiplePendingMembers();