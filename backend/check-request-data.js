import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CollaborationRequest from './models/CollaborationRequest.js';
import GymRequest from './models/GymRequest.js';
import User from './models/User.js';
import Gym from './models/Gym.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check collaboration requests for instructor1@gmail.com
    const collabRequests = await CollaborationRequest.find({ 
      toInstructor: '6887bf4d89ce9b4c4d60d37d' 
    })
    .populate('fromGymOwner', 'firstName lastName email')
    .populate('gym', 'gymName gymAddress')
    .sort({ createdAt: -1 });
    
    console.log('Collaboration Requests for instructor1@gmail.com:', collabRequests.length);
    collabRequests.forEach((req, i) => {
      console.log(`${i+1}. Status: ${req.status}
      From: ${req.fromGymOwner?.firstName} ${req.fromGymOwner?.lastName} (${req.fromGymOwner?.email})
      Gym: ${req.gym?.gymName}
      Message: ${req.message.substring(0, 50)}...
      Created: ${req.createdAt}`);
    });
    
    // Check gym requests for instructor1@gmail.com
    const gymRequests = await GymRequest.find({ 
      fromInstructor: '6887bf4d89ce9b4c4d60d37d' 
    })
    .populate('toGym', 'gymName gymAddress')
    .sort({ createdAt: -1 });
    
    console.log('\nGym Requests from instructor1@gmail.com:', gymRequests.length);
    gymRequests.forEach((req, i) => {
      console.log(`${i+1}. Status: ${req.status}
      To: ${req.toGym?.gymName}
      Message: ${req.message.substring(0, 50)}...
      Created: ${req.createdAt}`);
    });
    
    console.log('\n📊 Summary:');
    console.log('- Collaboration Requests (gym → instructor):', collabRequests.length);
    console.log('- Gym Requests (instructor → gym):', gymRequests.length);
    console.log('- Total requests:', collabRequests.length + gymRequests.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();