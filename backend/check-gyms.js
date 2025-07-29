import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gym from './models/Gym.js';

dotenv.config();

const checkGyms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const gyms = await Gym.find({ status: 'approved' }).limit(3);
    console.log('Found', gyms.length, 'approved gyms:');
    
    gyms.forEach((gym, i) => {
      console.log(`${i+1}. Name: ${gym.gymName}`);
      console.log(`   Address: ${gym.address ? `${gym.address.street}, ${gym.address.city}` : 'No address'}`);
      console.log(`   Facilities: ${gym.facilities?.length || 0} facilities`);
      console.log(`   Description: ${gym.description?.substring(0, 50)}...`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkGyms();