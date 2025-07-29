import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GymRequest from './models/GymRequest.js';
import Notification from './models/Notification.js';
import User from './models/User.js';
import Gym from './models/Gym.js';

dotenv.config();

const createTestGymRequest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find instructor1@gmail.com
    const instructor = await User.findOne({ email: 'instructor1@gmail.com' });
    if (!instructor) {
      console.log('instructor1@gmail.com not found');
      return;
    }
    
    // Find a gym to send request to
    const gym = await Gym.findOne({ status: 'approved' }).populate('owner', 'firstName lastName email');
    if (!gym) {
      console.log('No approved gym found');
      return;
    }
    
    console.log('Creating test gym request...');
    console.log('From instructor:', instructor.email);
    console.log('To gym:', gym.gymName, '(Owner:', gym.owner.email + ')');
    
    // Create the gym request
    const gymRequest = new GymRequest({
      fromInstructor: instructor._id,
      toGym: gym._id,
      message: 'Hi! I would like to join your gym as a personal trainer. I have 5 years of experience in fitness training and specialize in weight training and cardio workouts. I am passionate about helping people achieve their fitness goals.'
    });
    
    await gymRequest.save();
    console.log('✅ Gym request created with ID:', gymRequest._id);
    
    // Create notifications
    console.log('\nCreating notifications...');
    
    // 1. Notification for instructor (confirmation)
    const instructorNotif = new Notification({
      recipient: instructor._id,
      type: 'gym_request_sent',
      title: 'Gym Request Sent! 📤',
      message: `Your request to join "${gym.gymName}" has been sent successfully. The gym owner will review your request and get back to you soon.`,
      data: {
        requestId: gymRequest._id,
        gymId: gym._id,
        gymName: gym.gymName,
        gymOwner: `${gym.owner.firstName} ${gym.owner.lastName}`
      },
      link: '/instructor/gym-requests',
      priority: 'medium'
    });
    await instructorNotif.save();
    console.log('✅ Instructor notification created');
    
    // 2. Notification for gym owner
    const gymOwnerNotif = new Notification({
      recipient: gym.owner._id,
      type: 'gym_request_received',
      title: 'New Gym Request Received! 📨',
      message: `${instructor.firstName} ${instructor.lastName} wants to join your gym "${gym.gymName}" as an instructor. Review their request to approve or reject.`,
      data: {
        requestId: gymRequest._id,
        instructorId: instructor._id,
        instructorName: `${instructor.firstName} ${instructor.lastName}`,
        instructorEmail: instructor.email,
        gymId: gym._id,
        gymName: gym.gymName
      },
      link: '/gym-owner/verify-reject-gym',
      priority: 'high'
    });
    await gymOwnerNotif.save();
    console.log('✅ Gym owner notification created');
    
    console.log('\n🎉 Test gym request created successfully!');
    console.log('\n📊 Summary:');
    console.log('- Request ID:', gymRequest._id);
    console.log('- From:', instructor.email);
    console.log('- To:', gym.gymName, '(' + gym.owner.email + ')');
    console.log('- Status:', gymRequest.status);
    console.log('- Created:', gymRequest.createdAt);
    
    console.log('\n🔍 Now check:');
    console.log('1. instructor1@gmail.com should see 1 request in "My Requests"');
    console.log('2. Gym owner should see 1 pending request to approve/reject');
    console.log('3. Both should have notifications');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test gym request:', error);
    process.exit(1);
  }
};

createTestGymRequest();