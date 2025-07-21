import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const seedUsers = [
  {
    firstName: 'Gym',
    lastName: 'Owner',
    email: 'gymOwner@gmail.com',
    password: 'Dinuka@111',
    role: 'gymOwner',
    phone: '+94777123456',
    isVerified: true,
    isActive: true,
    gymDetails: {
      gymName: 'Elite Fitness Center',
      gymAddress: {
        street: '123 Main Street',
        city: 'Colombo',
        state: 'Western',
        zipCode: '10000',
        country: 'Sri Lanka'
      },
      establishedYear: 2020,
      facilities: ['Weight Training', 'Cardio', 'Group Classes', 'Swimming Pool', 'Sauna']
    }
  },
  {
    firstName: 'Fitness',
    lastName: 'Instructor',
    email: 'instructor@gmail.com',
    password: 'Dinuka@111',
    role: 'instructor',
    phone: '+94777123457',
    isVerified: true,
    isActive: true,
    specialization: ['Weight Training', 'Cardio', 'Yoga', 'Personal Training'],
    experience: 5,
    certifications: [
      {
        name: 'Certified Personal Trainer',
        issuedBy: 'ACSM',
        issuedDate: new Date('2020-01-01'),
        expiryDate: new Date('2025-01-01')
      },
      {
        name: 'Yoga Instructor Certification',
        issuedBy: 'Yoga Alliance',
        issuedDate: new Date('2019-06-01'),
        expiryDate: new Date('2024-06-01')
      }
    ]
  },
  {
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@gmail.com',
    password: 'Dinuka@111',
    role: 'admin',
    phone: '+94777123458',
    isVerified: true,
    isActive: true
  },
  {
    firstName: 'John',
    lastName: 'Customer',
    email: 'customer@gmail.com',
    password: 'Dinuka@111',
    role: 'customer',
    phone: '+94777123459',
    isVerified: true,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional - be careful in production!)
    console.log('Checking for existing users...');
    
    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User with email ${userData.email} already exists. Skipping...`);
        continue;
      }

      // Create new user
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${userData.role} user: ${userData.email}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts Created:');
    console.log('┌─────────────────┬───────────────────────┬─────────────┐');
    console.log('│ Role            │ Email                 │ Password    │');
    console.log('├─────────────────┼───────────────────────┼─────────────┤');
    console.log('│ Gym Owner       │ gymOwner@gmail.com    │ Dinuka@111  │');
    console.log('│ Instructor      │ instructor@gmail.com  │ Dinuka@111  │');
    console.log('│ Admin           │ admin@gmail.com       │ Dinuka@111  │');
    console.log('│ Customer        │ customer@gmail.com    │ Dinuka@111  │');
    console.log('└─────────────────┴───────────────────────┴─────────────┘');
    console.log('\n🔐 You can now test login with these accounts!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n📦 Database connection closed');
    process.exit(0);
  }
};

// Run the seeder
seedDatabase();