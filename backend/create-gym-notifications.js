import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';
import Gym from './models/Gym.js';

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

// Create test gym notifications
const createGymNotifications = async () => {
  try {
    await connectDB();
    
    // Find gym owner user
    const gymOwner = await User.findOne({ role: 'gymOwner' });
    if (!gymOwner) {
      console.log('No gym owner found');
      return;
    }
    
    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found');
      return;
    }
    
    console.log('Found gym owner:', gymOwner.email);
    console.log('Found admin:', admin.email);
    
    // 1. Create gym registration submitted notification for gym owner
    const notification1 = new Notification({
      recipient: gymOwner._id,
      type: 'gym_registration_submitted',
      title: 'Gym Registration Submitted 📋',
      message: `Your gym "Test Gym" has been successfully registered and is now pending admin approval. We will notify you once it's reviewed.`,
      priority: 'medium',
      link: '/gym-owner/dashboard'
    });
    await notification1.save();
    console.log('✅ Gym registration submitted notification created for gym owner');
    
    // 2. Create new gym registration notification for admin
    const notification2 = new Notification({
      recipient: admin._id,
      type: 'new_gym_registration',
      title: 'New Gym Registration Pending 🏢',
      message: `New gym "Test Gym" registered by ${gymOwner.firstName} ${gymOwner.lastName}. Review required for approval.`,
      priority: 'high',
      link: '/admin/gym-registrations'
    });
    await notification2.save();
    console.log('✅ New gym registration notification created for admin');
    
    // 3. Create gym approved notification for gym owner
    const notification3 = new Notification({
      recipient: gymOwner._id,
      type: 'gym_registration_approved',
      title: 'Gym Registration Approved! 🎉',
      message: `Congratulations! Your gym "Test Gym" has been approved and is now live on our platform. You can start managing your gym and accepting members.`,
      priority: 'high',
      link: '/gym-owner/dashboard'
    });
    await notification3.save();
    console.log('✅ Gym approved notification created for gym owner');
    
    // 4. Create admin action completed notification for admin
    const notification4 = new Notification({
      recipient: admin._id,
      type: 'admin_action_completed',
      title: 'Gym Approved Successfully ✅',
      message: `You have successfully approved "Test Gym" owned by ${gymOwner.firstName} ${gymOwner.lastName}. The gym is now active on the platform.`,
      priority: 'medium',
      link: '/admin/gym-registrations'
    });
    await notification4.save();
    console.log('✅ Admin action completed notification created');
    
    // 5. Create gym rejected notification for gym owner
    const notification5 = new Notification({
      recipient: gymOwner._id,
      type: 'gym_registration_rejected',
      title: 'Gym Registration Update',
      message: `Unfortunately, your gym registration for "Test Gym 2" has been rejected. Reason: Missing required documents. You can contact support for more information or resubmit with the required changes.`,
      priority: 'high',
      link: '/register-gym'
    });
    await notification5.save();
    console.log('✅ Gym rejected notification created for gym owner');
    
    console.log('\n🎉 All gym notifications created successfully!');
    console.log('\nNotifications created:');
    console.log('1. Gym Registration Submitted (Gym Owner)');
    console.log('2. New Gym Registration Pending (Admin)');
    console.log('3. Gym Registration Approved (Gym Owner)');
    console.log('4. Admin Action Completed (Admin)');
    console.log('5. Gym Registration Rejected (Gym Owner)');
    
  } catch (error) {
    console.error('Error creating gym notifications:', error);
  } finally {
    process.exit(0);
  }
};

createGymNotifications();