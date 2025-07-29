import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateToken = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const instructor = await User.findOne({ email: 'instructor@gmail.com' });
    if (!instructor) {
      console.log('Instructor not found');
      return;
    }
    
    console.log('Instructor details:');
    console.log('- ID:', instructor._id);
    console.log('- Email:', instructor.email);
    console.log('- Role:', instructor.role);
    
    // Generate token
    const token = jwt.sign({ userId: instructor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('\nGenerated token:');
    console.log(token);
    
    // Test the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('\nToken verification successful:');
    console.log('- User ID:', decoded.userId);
    console.log('- Expires:', new Date(decoded.exp * 1000));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

generateToken();