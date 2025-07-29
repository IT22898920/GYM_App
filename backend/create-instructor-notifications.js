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

// Create test instructor registration notifications
const createInstructorNotifications = async () => {
  try {
    await connectDB();
    
    // Find gym owner user
    const gymOwner = await User.findOne({ role: 'gymOwner' });
    if (!gymOwner) {
      console.log('No gym owner found');
      return;
    }
    
    // Find or create instructor user
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      // Create a test instructor
      instructor = new User({
        firstName: 'Test',
        lastName: 'Instructor',
        email: 'test.instructor@example.com',
        password: 'password123',
        role: 'instructor',
        isVerified: true
      });
      await instructor.save();
      console.log('✅ Created test instructor:', instructor.email);
    }
    
    // Find gym
    const gym = await Gym.findOne({ owner: gymOwner._id });
    const gymName = gym ? gym.gymName : 'Test Gym';
    
    console.log('Found gym owner:', gymOwner.email);
    console.log('Found instructor:', instructor.email);
    console.log('Found gym:', gymName);
    
    // 1. Create welcome notification for new instructor
    const welcomeNotification = new Notification({
      recipient: instructor._id,
      type: 'instructor_registration_completed',
      title: 'Welcome to the Team! 👨‍🏫',
      message: `Welcome to "${gymName}"! You have been successfully registered as an instructor. You can now start creating workout plans and managing classes for your students.`,
      data: {
        gymId: gym?._id,
        gymName: gymName,
        gymOwnerId: gymOwner._id,
        instructorName: `${instructor.firstName} ${instructor.lastName}`,
        specialization: 'General Fitness'
      },
      priority: 'high',
      link: '/instructor/dashboard'
    });
    await welcomeNotification.save();
    console.log('✅ Welcome notification created for instructor');
    
    // 2. Create confirmation notification for gym owner
    const confirmationNotification = new Notification({
      recipient: gymOwner._id,
      type: 'instructor_registration_completed',
      title: 'New Instructor Added Successfully! 🎉',
      message: `${instructor.firstName} ${instructor.lastName} has been successfully registered as an instructor for "${gymName}". They can now start managing classes and students.`,
      data: {
        gymId: gym?._id,
        gymName: gymName,
        instructorId: instructor._id,
        instructorName: `${instructor.firstName} ${instructor.lastName}`,
        instructorEmail: instructor.email,
        specialization: 'General Fitness'
      },
      priority: 'medium',
      link: '/gym-owner/instructors'
    });
    await confirmationNotification.save();
    console.log('✅ Confirmation notification created for gym owner');
    
    // 3. Create instructor added to gym notification
    const instructorAddedNotification = new Notification({
      recipient: instructor._id,
      type: 'instructor_added_to_gym',
      title: 'Added to Gym Team 🏢',
      message: `You have been added to the instructor team at "${gymName}". Start exploring your dashboard to manage classes and connect with students.`,
      data: {
        gymId: gym?._id,
        gymName: gymName,
        gymOwnerId: gymOwner._id,
        addedBy: `${gymOwner.firstName} ${gymOwner.lastName}`
      },
      priority: 'medium',
      link: '/instructor/dashboard'
    });
    await instructorAddedNotification.save();
    console.log('✅ Instructor added to gym notification created');
    
    console.log('\n🎉 All instructor registration notifications created successfully!');
    console.log('\nNotifications created:');
    console.log('1. Welcome notification for instructor');
    console.log('2. Confirmation notification for gym owner');
    console.log('3. Instructor added to gym notification');
    
    console.log('\n📊 Test Data Summary:');
    console.log(`- Gym Owner: ${gymOwner.email}`);
    console.log(`- Instructor: ${instructor.email}`);
    console.log(`- Gym: ${gymName}`);
    
  } catch (error) {
    console.error('Error creating instructor notifications:', error);
  } finally {
    process.exit(0);
  }
};

createInstructorNotifications();