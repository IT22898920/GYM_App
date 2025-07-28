import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Gym from './models/Gym.js';

dotenv.config();

const createPendingGym = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a customer user first
    const customerUser = new User({
      firstName: 'Test',
      lastName: 'Customer',
      email: `customer-${Date.now()}@test.com`,
      password: 'password123',
      role: 'customer',
      isEmailVerified: true,
      phone: '0771234567'
    });

    await customerUser.save();
    console.log('Customer user created:', customerUser.email);

    // Create a pending gym
    const pendingGym = new Gym({
      gymName: `Pending Gym ${Date.now()}`,
      description: 'A new gym pending approval',
      owner: customerUser._id,
      contactInfo: {
        email: 'pending@gym.com',
        phone: '0771234567',
        website: 'https://pendinggym.com'
      },
      address: {
        street: '456 Pending Street',
        city: 'Kandy',
        state: 'Central Province',
        zipCode: '20000',
        country: 'Sri Lanka'
      },
      location: {
        type: 'Point',
        coordinates: [80.6337, 7.2906] // Kandy coordinates
      },
      facilities: ['Weight Training', 'Cardio'],
      services: ['Personal Training', 'Group Classes'],
      amenities: ['Parking', 'Lockers'],
      capacity: 50,
      establishedYear: 2024,
      status: 'pending', // Pending status
      verificationStatus: 'pending',
      operatingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '07:00', close: '20:00' },
        sunday: { open: '07:00', close: '18:00' }
      },
      pricing: {
        membershipPlans: [
          {
            name: 'Basic',
            duration: 'monthly',
            price: 3000,
            benefits: ['Gym access', 'Locker']
          }
        ],
        dropInFee: 300
      }
    });

    await pendingGym.save();
    console.log('Pending gym created:', pendingGym.gymName);

    // Create a rejected gym for testing
    const rejectedCustomer = new User({
      firstName: 'Rejected',
      lastName: 'Owner',
      email: `rejected-${Date.now()}@test.com`,
      password: 'password123',
      role: 'customer',
      isEmailVerified: true,
      phone: '0771234568'
    });

    await rejectedCustomer.save();

    const rejectedGym = new Gym({
      gymName: `Rejected Gym ${Date.now()}`,
      description: 'A gym that was rejected',
      owner: rejectedCustomer._id,
      contactInfo: {
        email: 'rejected@gym.com',
        phone: '0771234568',
        website: 'https://rejectedgym.com'
      },
      address: {
        street: '789 Rejected Road',
        city: 'Galle',
        state: 'Southern Province',
        zipCode: '80000',
        country: 'Sri Lanka'
      },
      location: {
        type: 'Point',
        coordinates: [80.2170, 6.0535] // Galle coordinates
      },
      facilities: ['Basic Equipment'],
      services: ['Self Training'],
      amenities: ['Parking'],
      capacity: 30,
      establishedYear: 2024,
      status: 'rejected', // Rejected status
      verificationStatus: 'rejected',
      adminNotes: 'Insufficient facilities and documentation',
      operatingHours: {
        monday: { open: '08:00', close: '20:00' },
        tuesday: { open: '08:00', close: '20:00' },
        wednesday: { open: '08:00', close: '20:00' },
        thursday: { open: '08:00', close: '20:00' },
        friday: { open: '08:00', close: '20:00' },
        saturday: { open: '08:00', close: '18:00' },
        sunday: { closed: true }
      },
      pricing: {
        membershipPlans: [
          {
            name: 'Standard',
            duration: 'monthly',
            price: 2000,
            benefits: ['Basic gym access']
          }
        ],
        dropInFee: 200
      }
    });

    await rejectedGym.save();
    console.log('Rejected gym created:', rejectedGym.gymName);

    console.log('\nTest gyms created successfully!');
    console.log('You should now see:');
    console.log('- 1 pending gym');
    console.log('- 1 rejected gym');
    console.log('- Plus any existing approved gyms');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createPendingGym();