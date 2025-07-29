import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CollaborationRequest from './models/CollaborationRequest.js';
import Gym from './models/Gym.js';

dotenv.config();

const checkCollabGymData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const request = await CollaborationRequest.findOne({ 
      toInstructor: '6887bf4d89ce9b4c4d60d37d' 
    }).populate('gym');
    
    if (request && request.gym) {
      console.log('📋 Gym Data Structure in Collaboration Request:');
      console.log('gymName:', request.gym.gymName);
      console.log('description:', request.gym.description);
      console.log('address:', request.gym.address);
      console.log('contactInfo:', request.gym.contactInfo);
      console.log('facilities:', request.gym.facilities);
      console.log('services:', request.gym.services);
      console.log('amenities:', request.gym.amenities);
      console.log('capacity:', request.gym.capacity);
      console.log('establishedYear:', request.gym.establishedYear);
      console.log('rating:', request.gym.rating);
      console.log('status:', request.gym.status);
      console.log('verificationStatus:', request.gym.verificationStatus);
      console.log('specialPrograms:', request.gym.specialPrograms);
      console.log('certifications:', request.gym.certifications);
      console.log('tags:', request.gym.tags);
      console.log('pricing:', request.gym.pricing);
      console.log('memberCount:', request.gym.memberCount);
      console.log('operatingHours:', request.gym.operatingHours);
      console.log('logo:', request.gym.logo);
      console.log('images:', request.gym.images);
    } else {
      console.log('No collaboration request found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkCollabGymData();