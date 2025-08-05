import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Member from './models/Member.js';
import User from './models/User.js';

dotenv.config();

async function testDirectBankTransfer() {
  try {
    // Connect to DB
    await connectDB();
    console.log('✅ Connected to database');

    // Create test data
    const testData = {
      gym: '688747e3a54eef2bee1622dd',
      user: new mongoose.Types.ObjectId(),
      firstName: 'Direct',
      lastName: 'Test',
      email: `direct.test.${Date.now()}@test.com`,
      phoneNumber: '+94771234567',
      gender: 'male',
      dateOfBirth: new Date('1990-01-01'),
      membershipPlan: {
        name: 'Premium',
        price: 5000,
        features: ['Full access']
      },
      bodyMeasurements: {
        height: 175,
        weight: 70,
        waist: 32
      },
      paymentDetails: {
        method: 'manual',
        paymentStatus: 'pending',
        receiptPath: 'test/path.png'
      },
      status: 'inactive',
      createdBy: new mongoose.Types.ObjectId()
    };

    console.log('\n📝 Creating member with:');
    console.log('   Status:', testData.status);
    console.log('   Payment Status:', testData.paymentDetails.paymentStatus);
    console.log('   Payment Method:', testData.paymentDetails.method);

    const member = new Member(testData);
    await member.save();

    console.log('\n✅ Member created!');
    console.log('   ID:', member._id);
    console.log('   Status:', member.status);
    console.log('   Payment Status:', member.paymentDetails.paymentStatus);
    console.log('   Payment Method:', member.paymentDetails.method);

    // Fetch from DB to verify
    const savedMember = await Member.findById(member._id);
    console.log('\n🔍 Fetched from DB:');
    console.log('   Status:', savedMember.status);
    console.log('   Payment Status:', savedMember.paymentDetails.paymentStatus);

    if (savedMember.status === 'inactive' && savedMember.paymentDetails.paymentStatus === 'pending') {
      console.log('\n✅ SUCCESS: Bank transfer member correctly saved as inactive with pending status!');
    } else {
      console.log('\n❌ ERROR: Status should be inactive and payment should be pending!');
    }

    // Clean up
    await Member.findByIdAndDelete(member._id);
    console.log('\n🧹 Test member deleted');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from database');
  }
}

testDirectBankTransfer();