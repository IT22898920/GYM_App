import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Create test notification
const createTestNotification = async () => {
  try {
    await connectDB();
    
    // Find a customer user
    const customer = await User.findOne({ role: 'customer' });
    if (!customer) {
      console.log('No customer found');
      return;
    }
    
    console.log('Found customer:', customer.email);
    
    // Create test notification
    const notification = new Notification({
      recipient: customer._id,
      type: 'welcome_message',
      title: 'Test Notification 🎉',
      message: `Hello ${customer.firstName}! This is a test notification to verify the system works.`,
      priority: 'high',
      link: '/profile'
    });
    
    await notification.save();
    console.log('Test notification created successfully:', notification._id);
    
    // Also create a second notification
    const notification2 = new Notification({
      recipient: customer._id,
      type: 'system_announcement',
      title: 'System Update',
      message: 'The notification system is now working properly for all users.',
      priority: 'medium',
      link: '/'
    });
    
    await notification2.save();
    console.log('Second notification created:', notification2._id);
    
  } catch (error) {
    console.error('Error creating test notification:', error);
  } finally {
    process.exit(0);
  }
};

createTestNotification();