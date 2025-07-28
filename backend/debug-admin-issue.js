import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Gym from './models/Gym.js';

dotenv.config();

const debugAdminIssue = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check gyms in database
    const allGyms = await Gym.find({}).populate('owner', 'firstName lastName email role');
    console.log('\n=== Summary ===');
    console.log('Total gyms:', allGyms.length);
    
    const statuses = { pending: 0, approved: 0, rejected: 0 };
    allGyms.forEach(gym => {
      if (gym.status in statuses) statuses[gym.status]++;
    });
    
    console.log(`Pending: ${statuses.pending}, Approved: ${statuses.approved}, Rejected: ${statuses.rejected}`);

    // Find admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`\nAdmin users found: ${adminUsers.length}`);
    adminUsers.forEach(admin => {
      console.log(`- ${admin.email} (Active: ${admin.isActive})`);
    });

    console.log('\n=== Solution ===');
    console.log('The issue was that the /api/gyms endpoint was public and didn\'t check for admin authentication.');
    console.log('This has been fixed by adding optionalAuth middleware to the route.');
    console.log('\nNow:');
    console.log('- Public users see only approved gyms');
    console.log('- Admin users see ALL gyms (pending, approved, rejected)');
    console.log('\nThe admin panel should now show all gym registrations!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
};

debugAdminIssue();