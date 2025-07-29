import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';
import Gym from './models/Gym.js';
import GymRequest from './models/GymRequest.js';

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

// Create test gym request notifications
const createGymRequestNotifications = async () => {
  try {
    await connectDB();
    
    // Find instructor user
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.log('No instructor found');
      return;
    }
    
    // Find any gym and its owner for testing
    const gym = await Gym.findOne({ status: 'approved' }).populate('owner', 'firstName lastName email');
    if (!gym) {
      console.log('No approved gym found');
      return;
    }
    
    const gymOwner = gym.owner;
    
    console.log('Found instructor:', instructor.email);
    console.log('Found gym owner:', gymOwner.email);
    console.log('Found gym:', gym.gymName);
    
    // 1. Create gym request sent notification for instructor
    const requestSentNotification = new Notification({
      recipient: instructor._id,
      type: 'gym_request_sent',
      title: 'Gym Request Sent! 📤',
      message: `Your request to join "${gym.gymName}" has been sent successfully. The gym owner will review your request and get back to you soon.`,
      data: {
        gymId: gym._id,
        gymName: gym.gymName,
        gymOwner: `${gymOwner.firstName} ${gymOwner.lastName}`
      },
      link: '/instructor/apply-to-gym',
      priority: 'medium'
    });
    await requestSentNotification.save();
    console.log('✅ Gym request sent notification created for instructor');
    
    // 2. Create gym request received notification for gym owner
    const requestReceivedNotification = new Notification({
      recipient: gymOwner._id,
      type: 'gym_request_received',
      title: 'New Gym Request Received! 📨',
      message: `${instructor.firstName} ${instructor.lastName} wants to join your gym "${gym.gymName}" as an instructor. Review their request to approve or reject.`,
      data: {
        instructorId: instructor._id,
        instructorName: `${instructor.firstName} ${instructor.lastName}`,
        instructorEmail: instructor.email,
        gymId: gym._id,
        gymName: gym.gymName,
        specialization: 'Personal Training',
        experience: 3
      },
      link: '/gym-owner/verify-reject-gym',
      priority: 'high'
    });
    await requestReceivedNotification.save();
    console.log('✅ Gym request received notification created for gym owner');
    
    // 3. Create gym request approved notification for instructor
    const requestApprovedNotification = new Notification({
      recipient: instructor._id,
      type: 'gym_request_approved',
      title: 'Gym Request Approved! 🎉',
      message: `Congratulations! Your request to join "${gym.gymName}" has been approved. You are now part of their instructor team and can start managing classes.`,
      data: {
        gymId: gym._id,
        gymName: gym.gymName,
        gymOwner: `${gymOwner.firstName} ${gymOwner.lastName}`,
        responseMessage: 'Welcome to our team! We look forward to working with you.'
      },
      link: '/instructor/dashboard',
      priority: 'high'
    });
    await requestApprovedNotification.save();
    console.log('✅ Gym request approved notification created for instructor');
    
    // 4. Create gym request approved confirmation for gym owner
    const ownerConfirmationNotification = new Notification({
      recipient: gymOwner._id,
      type: 'gym_request_approved',
      title: 'Instructor Request Approved ✅',
      message: `You have successfully approved ${instructor.firstName} ${instructor.lastName} to join "${gym.gymName}" as an instructor.`,
      data: {
        instructorId: instructor._id,
        instructorName: `${instructor.firstName} ${instructor.lastName}`,
        gymId: gym._id,
        gymName: gym.gymName
      },
      link: '/gym-owner/instructors',
      priority: 'medium'
    });
    await ownerConfirmationNotification.save();
    console.log('✅ Gym request approval confirmation created for gym owner');
    
    // 5. Create gym request rejected notification for instructor
    const requestRejectedNotification = new Notification({
      recipient: instructor._id,
      type: 'gym_request_rejected',
      title: 'Gym Request Update',
      message: `Your request to join "${gym.gymName}" has been reviewed. We need instructors with more experience at this time. Thank you for your interest.`,
      data: {
        gymId: gym._id,
        gymName: gym.gymName,
        gymOwner: `${gymOwner.firstName} ${gymOwner.lastName}`,
        responseMessage: 'We need instructors with more experience at this time.'
      },
      link: '/instructor/apply-to-gym',
      priority: 'medium'
    });
    await requestRejectedNotification.save();
    console.log('✅ Gym request rejected notification created for instructor');
    
    // 6. Create gym request cancelled notification for gym owner
    const requestCancelledNotification = new Notification({
      recipient: gymOwner._id,
      type: 'gym_request_cancelled',
      title: 'Gym Request Cancelled 🚫',
      message: `${instructor.firstName} ${instructor.lastName} has cancelled their request to join "${gym.gymName}".`,
      data: {
        instructorId: instructor._id,
        instructorName: `${instructor.firstName} ${instructor.lastName}`,
        gymId: gym._id,
        gymName: gym.gymName
      },
      link: '/gym-owner/verify-reject-gym',
      priority: 'low'
    });
    await requestCancelledNotification.save();
    console.log('✅ Gym request cancelled notification created for gym owner');
    
    console.log('\n🎉 All gym request notifications created successfully!');
    console.log('\nNotifications created:');
    console.log('1. Gym request sent (Instructor)');
    console.log('2. Gym request received (Gym Owner)');
    console.log('3. Gym request approved (Instructor)');
    console.log('4. Gym request approval confirmation (Gym Owner)');
    console.log('5. Gym request rejected (Instructor)');
    console.log('6. Gym request cancelled (Gym Owner)');
    
    console.log('\n📊 Test Data Summary:');
    console.log(`- Instructor: ${instructor.email}`);
    console.log(`- Gym Owner: ${gymOwner.email}`);
    console.log(`- Gym: ${gym.gymName}`);
    
    // Create a sample gym request document for testing
    const sampleGymRequest = new GymRequest({
      fromInstructor: instructor._id,
      toGym: gym._id,
      message: 'I would like to join your gym as a Personal Training instructor. I have 3 years of experience and am passionate about helping people achieve their fitness goals.'
    });
    await sampleGymRequest.save();
    console.log('\n✅ Sample gym request document created for testing');
    
  } catch (error) {
    console.error('Error creating gym request notifications:', error);
  } finally {
    process.exit(0);
  }
};

createGymRequestNotifications();