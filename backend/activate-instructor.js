import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const activateInstructor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const instructor = await User.findOne({ email: 'instructor@gmail.com' });
    if (!instructor) {
      console.log('Instructor not found');
      return;
    }
    
    console.log('Before update:');
    console.log('- isActive:', instructor.isActive);
    console.log('- isVerified:', instructor.isVerified);
    
    // Activate the instructor
    instructor.isActive = true;
    instructor.isVerified = true;
    await instructor.save();
    
    console.log('\nAfter update:');
    console.log('- isActive:', instructor.isActive);
    console.log('- isVerified:', instructor.isVerified);
    console.log('✅ Instructor account activated');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

activateInstructor();