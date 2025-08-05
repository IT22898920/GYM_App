import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Member from './models/Member.js';

dotenv.config();

async function checkLastMember() {
  try {
    await connectDB();
    
    // Get the last created member
    const lastMember = await Member.findOne().sort({ createdAt: -1 });
    
    if (lastMember) {
      console.log('Last created member:');
      console.log('ID:', lastMember._id);
      console.log('Name:', lastMember.firstName, lastMember.lastName);
      console.log('Status:', lastMember.status);
      console.log('Payment Method:', lastMember.paymentDetails?.method);
      console.log('Payment Status:', lastMember.paymentDetails?.paymentStatus);
      console.log('Receipt Path:', lastMember.paymentDetails?.receiptPath);
      console.log('Created:', lastMember.createdAt);
    } else {
      console.log('No members found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkLastMember();