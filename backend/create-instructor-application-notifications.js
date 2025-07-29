import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';
import InstructorApplication from './models/InstructorApplication.js';

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

// Create test instructor application notifications
const createInstructorApplicationNotifications = async () => {
  try {
    await connectDB();
    
    // Find customer user (who will apply)
    let customer = await User.findOne({ role: 'customer' });
    if (!customer) {
      // Create a test customer
      customer = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.customer@example.com',
        password: 'password123',
        role: 'customer',
        isVerified: true
      });
      await customer.save();
      console.log('✅ Created test customer:', customer.email);
    }
    
    // Find admin users
    const admins = await User.find({ role: 'admin' });
    if (admins.length === 0) {
      console.log('No admin users found');
      return;
    }
    
    console.log('Found customer:', customer.email);
    console.log('Found admins:', admins.map(admin => admin.email));
    
    // Create test application data
    const applicationData = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      specialization: 'Personal Training',
      experience: 3,
      isFreelance: true
    };
    
    // 1. Create application submitted notification for customer
    const submittedNotification = new Notification({
      recipient: customer._id,
      type: 'instructor_application_submitted',
      title: 'Application Submitted Successfully! 📝',
      message: `Your instructor application has been submitted successfully. We will review your application for "${applicationData.specialization}" specialization and get back to you soon.`,
      data: {
        specialization: applicationData.specialization,
        experience: applicationData.experience,
        isFreelance: applicationData.isFreelance
      },
      link: '/apply-instructor',
      priority: 'medium'
    });
    await submittedNotification.save();
    console.log('✅ Application submitted notification created for customer');
    
    // 2. Create pending application notifications for each admin
    for (const admin of admins) {
      const pendingNotification = new Notification({
        recipient: admin._id,
        type: 'instructor_application_pending',
        title: 'New Instructor Application Received 📋',
        message: `New instructor application from ${applicationData.firstName} ${applicationData.lastName} for "${applicationData.specialization}". Review required for approval.`,
        data: {
          applicantName: `${applicationData.firstName} ${applicationData.lastName}`,
          applicantEmail: applicationData.email,
          specialization: applicationData.specialization,
          experience: applicationData.experience,
          isFreelance: applicationData.isFreelance
        },
        link: '/admin/instructor-applications',
        priority: 'high'
      });
      await pendingNotification.save();
      console.log(`✅ Pending application notification created for admin: ${admin.email}`);
    }
    
    // 3. Create approved notification for customer
    const approvedNotification = new Notification({
      recipient: customer._id,
      type: 'instructor_application_approved',
      title: 'Congratulations! Application Approved! 🎉',
      message: `Your instructor application for "${applicationData.specialization}" has been approved! Welcome to our instructor team. You can now start creating workout plans and managing classes.`,
      data: {
        specialization: applicationData.specialization,
        experience: applicationData.experience,
        approvedBy: admins[0].firstName + ' ' + admins[0].lastName
      },
      link: '/instructor/dashboard',
      priority: 'high'
    });
    await approvedNotification.save();
    console.log('✅ Application approved notification created for customer');
    
    // 4. Create rejected notification for customer (example)
    const rejectedNotification = new Notification({
      recipient: customer._id,
      type: 'instructor_application_rejected',
      title: 'Application Update Required',
      message: `Your instructor application for "${applicationData.specialization}" requires some updates. Please review the feedback and resubmit with the required changes.`,
      data: {
        specialization: applicationData.specialization,
        rejectionReason: 'Please provide additional certifications',
        reviewedBy: admins[0].firstName + ' ' + admins[0].lastName
      },
      link: '/apply-instructor',
      priority: 'high'
    });
    await rejectedNotification.save();
    console.log('✅ Application rejected notification created for customer');
    
    console.log('\n🎉 All instructor application notifications created successfully!');
    console.log('\nNotifications created:');
    console.log('1. Application submitted (Customer)');
    console.log(`2. Application pending review (${admins.length} Admin(s))`);
    console.log('3. Application approved (Customer)');
    console.log('4. Application rejected (Customer)');
    
    console.log('\n📊 Test Data Summary:');
    console.log(`- Customer: ${customer.email}`);
    console.log(`- Admins: ${admins.map(admin => admin.email).join(', ')}`);
    console.log(`- Specialization: ${applicationData.specialization}`);
    console.log(`- Experience: ${applicationData.experience} years`);
    console.log(`- Freelance: ${applicationData.isFreelance ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.error('Error creating instructor application notifications:', error);
  } finally {
    process.exit(0);
  }
};

createInstructorApplicationNotifications();