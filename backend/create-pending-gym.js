import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Gym from './models/Gym.js';
import User from './models/User.js';

dotenv.config();

const createPendingGym = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a test gym owner
    const testGymOwnerEmail = 'testowner@gmail.com';
    let testGymOwner = await User.findOne({ email: testGymOwnerEmail });
    
    if (!testGymOwner) {
      console.log('Creating test gym owner...');
      const hashedPassword = await bcrypt.hash('test123', 12);
      
      testGymOwner = new User({
        firstName: 'Test',
        lastName: 'Owner',
        email: testGymOwnerEmail,
        password: hashedPassword,
        role: 'customer', // Will be changed to gymOwner when gym is approved
        phone: '+94777000001',
        isActive: true
      });
      
      await testGymOwner.save();
      console.log('✅ Test gym owner created:', testGymOwnerEmail);
    } else {
      console.log('✅ Test gym owner already exists:', testGymOwnerEmail);
    }

    // Create a pending gym
    const pendingGym = new Gym({
      gymName: 'FitZone Premium Gym',
      description: 'A modern fitness center with state-of-the-art equipment and professional trainers. We offer various fitness programs including weight training, cardio, yoga, and group classes.',
      owner: testGymOwner._id,
      contactInfo: {
        email: 'contact@fitzonegym.com',
        phone: '+94777123456',
        website: 'https://fitzonegym.com'
      },
      address: {
        street: '123 Fitness Street',
        city: 'Colombo',
        state: 'Western Province',
        zipCode: '00100',
        country: 'Sri Lanka'
      },
      location: {
        type: 'Point',
        coordinates: [79.8612, 6.9271] // Colombo coordinates
      },
      facilities: ['Weight Training', 'Cardio Equipment', 'Group Classes', 'Personal Training'],
      equipment: [
        { name: 'Treadmills', quantity: 8, condition: 'excellent' },
        { name: 'Dumbbells', quantity: 20, condition: 'good' },
        { name: 'Bench Press', quantity: 4, condition: 'excellent' }
      ],
      services: ['Personal Training', 'Nutrition Counseling', 'Fitness Assessment'],
      pricing: {
        membershipPlans: [
          { name: 'Monthly', duration: 'monthly', price: 5000 },
          { name: 'Quarterly', duration: 'quarterly', price: 14000 },
          { name: 'Annual', duration: 'yearly', price: 50000 }
        ],
        dropInFee: 500
      },
      capacity: 150,
      establishedYear: 2020,
      amenities: ['Parking', 'Locker Rooms', 'Showers', 'Wi-Fi', 'Air Conditioning'],
      specialPrograms: [
        { name: 'Weight Loss Programs', description: 'Comprehensive weight loss program', price: 8000, duration: 'monthly' },
        { name: 'Strength Training', description: 'Build muscle and strength', price: 6000, duration: 'monthly' },
        { name: 'Yoga Classes', description: 'Relaxation and flexibility', price: 4000, duration: 'monthly' }
      ],
      tags: ['modern', 'equipment', 'professional', 'clean'],
      status: 'pending', // This is the key - making it pending
      images: [],
      socialMedia: {
        facebook: 'https://facebook.com/fitzonegym',
        instagram: 'https://instagram.com/fitzonegym'
      },
      certifications: [
        { name: 'ISO 9001', issuedBy: 'ISO Organization', issuedDate: new Date('2023-01-01') },
        { name: 'Health Department Certified', issuedBy: 'Ministry of Health', issuedDate: new Date('2023-06-01') }
      ]
    });

    await pendingGym.save();
    
    console.log('✅ Pending gym created successfully!');
    console.log('- Gym Name:', pendingGym.gymName);
    console.log('- Status:', pendingGym.status);
    console.log('- Owner:', testGymOwner.email);
    console.log('- Gym ID:', pendingGym._id);

    // Create another pending gym for testing
    const anotherPendingGym = new Gym({
      gymName: 'PowerHouse Fitness',
      description: 'Your neighborhood gym with friendly staff and great equipment.',
      owner: testGymOwner._id,
      contactInfo: {
        email: 'info@powerhousefitness.com',
        phone: '+94777654321'
      },
      address: {
        street: '456 Strength Avenue',
        city: 'Kandy',
        state: 'Central Province',
        zipCode: '20000',
        country: 'Sri Lanka'
      },
      location: {
        type: 'Point',
        coordinates: [80.6337, 7.2906] // Kandy coordinates
      },
      facilities: ['Free Weights', 'Machines', 'Cardio Area'],
      services: ['Personal Training', 'Group Classes'],
      pricing: {
        membershipPlans: [
          { name: 'Monthly', duration: 'monthly', price: 4000 }
        ],
        dropInFee: 400
      },
      capacity: 80,
      establishedYear: 2021,
      amenities: ['Parking', 'Locker Rooms'],
      tags: ['friendly', 'neighborhood', 'affordable'],
      status: 'pending'
    });

    await anotherPendingGym.save();
    
    console.log('✅ Second pending gym created successfully!');
    console.log('- Gym Name:', anotherPendingGym.gymName);
    console.log('- Status:', anotherPendingGym.status);
    console.log('- Gym ID:', anotherPendingGym._id);

    // Verify pending gyms count
    const pendingCount = await Gym.countDocuments({ status: 'pending' });
    console.log('\n📊 Total pending gyms in database:', pendingCount);

    await mongoose.disconnect();
    console.log('\n✅ Pending gyms created successfully! Admin can now test the dashboard.');

  } catch (error) {
    console.error('❌ Error creating pending gym:', error.message);
    await mongoose.disconnect();
  }
};

createPendingGym();