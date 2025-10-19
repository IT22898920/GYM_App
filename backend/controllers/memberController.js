import Member from '../models/Member.js';
import User from '../models/User.js';
import Gym from '../models/Gym.js';
import bcrypt from 'bcryptjs';
import NotificationService from '../services/notificationService.js';
import multer from 'multer';
import path from 'path';
import { uploadToCloudinary, receiptOptions } from '../config/cloudinary.js';

// Configure multer for receipt uploads (memory storage for Cloudinary)
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadReceipt = upload.single('receipt');

// Search existing users
export const searchExistingUsers = async (req, res) => {
  try {
    const { searchTerm, searchType } = req.query;
    const gymOwnerId = req.user.id;

    // Find the gym owned by this user
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    // Build search query
    const searchQuery = {};
    if (searchType === 'email') {
      searchQuery.email = { $regex: searchTerm, $options: 'i' };
    } else if (searchType === 'phone') {
      searchQuery.phoneNumber = { $regex: searchTerm, $options: 'i' };
    }

    // Search for users
    const users = await User.find(searchQuery)
      .select('firstName lastName email phoneNumber gender dateOfBirth role')
      .limit(10);

    // Check if users are already members
    const usersWithMembershipStatus = await Promise.all(users.map(async (user) => {
      const membership = await Member.findOne({ user: user._id }).populate('gym', 'name');
      return {
        ...user.toObject(),
        currentGym: membership ? membership.gym.name : null
      };
    }));

    res.status(200).json({
      success: true,
      data: usersWithMembershipStatus
    });

  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

// Add existing user as member
export const addExistingUserAsMember = async (req, res) => {
  try {
    const gymOwnerId = req.user.id;
    const {
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      gender,
      dateOfBirth,
      membershipPlan,
      membershipPrice,
      membershipFeatures,
      bodyMeasurements,
      fitnessGoals,
      paymentDetails,
      isExistingMember,
      isNewExistingMember,
      useCustomPassword
    } = req.body;

    // Find the gym owned by this user
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    let user;
    let isNewUser = false;

    if (isNewExistingMember) {
      // Creating a completely new user OR adding existing user to this gym
      // Check if user with this email already exists
      const existingUser = await User.findOne({ email: email });
      
      if (existingUser) {
        // User exists, check if they're already a member of this gym
        const existingMember = await Member.findOne({ 
          user: existingUser._id, 
          gym: gym._id 
        });
        
        if (existingMember) {
          return res.status(400).json({
            success: false,
            message: 'This person is already a member of your gym'
          });
        }
        
        // User exists but not a member of this gym - add them
        user = existingUser;
        
        // Generate new password for existing users being added as gym members
        let newPassword;
        if (useCustomPassword && password) {
          newPassword = password;
        } else {
          newPassword = Math.random().toString(36).slice(-8) + 'Gym@2024';
        }
        
        user.password = newPassword; // Don't hash manually - let User model pre-save hook handle it
        await user.save();
        user.temporaryPassword = newPassword; // For notification
      } else {
        // User doesn't exist - create new user
        let newPassword;
        if (useCustomPassword && password) {
          newPassword = password;
        } else {
          newPassword = Math.random().toString(36).slice(-8) + 'Gym@2024';
        }
        
        user = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          gender: gender,
          dateOfBirth: dateOfBirth,
          password: newPassword, // Don't hash manually - let User model pre-save hook handle it
          role: 'customer',
          isActive: true
        });
        
        await user.save();
        isNewUser = true;
        user.temporaryPassword = newPassword; // For notification
      }
    } else {
      // Existing user flow
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required for existing user'
        });
      }

      // Check if member already exists in this gym
      const existingMember = await Member.findOne({ 
        user: userId, 
        gym: gym._id 
      });
      
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'This user is already a member of your gym'
        });
      }

      // Get the user
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate a random password for the existing user if they haven't logged in
      const randomPassword = Math.random().toString(36).slice(-8) + 'Gym@2024';
      
      // Update user password if this is an existing member
      if (isExistingMember && !user.lastLogin) {
        user.password = randomPassword; // Don't hash manually - let User model pre-save hook handle it
        await user.save();
        user.temporaryPassword = randomPassword; // For notification
      }
    }

    // Create member record
    const member = new Member({
      gym: gym._id,
      user: user._id,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      phoneNumber: phoneNumber || user.phoneNumber,
      gender: gender || user.gender,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      membershipPlan: {
        name: membershipPlan,
        price: membershipPrice || 0,
        features: membershipFeatures || [],
        startDate: new Date()
      },
      bodyMeasurements: bodyMeasurements || {},
      fitnessGoals: fitnessGoals || [],
      paymentDetails: {
        method: 'manual',
        paymentStatus: paymentDetails?.paymentStatus || 'paid',
        lastPaymentDate: paymentDetails?.lastPaymentDate || new Date(),
        nextPaymentDate: paymentDetails?.nextPaymentDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      status: paymentDetails?.paymentStatus === 'paid' ? 'active' : 'inactive',
      createdBy: gymOwnerId
    });

    await member.save();

    // Send notification to the member with login credentials
    if (user.temporaryPassword) {
      await NotificationService.createNotification({
        recipient: user._id,
        sender: gymOwnerId,
        type: 'member_joined_gym',
        title: 'Welcome to ' + gym.gymName,
        message: `You have been registered as a member at ${gym.gymName}. Your ${membershipPlan} membership is now active. Your login credentials are: Email: ${user.email}, Password: ${user.temporaryPassword}. Please change your password after first login.`,
        data: {
          gymId: gym._id,
          memberId: member._id,
          temporaryPassword: user.temporaryPassword
        }
      });

      // Send email with credentials (if email service is configured)
      // You can add email sending logic here
    } else {
      await NotificationService.createNotification({
        recipient: user._id,
        sender: gymOwnerId,
        type: 'member_joined_gym',
        title: 'Welcome to ' + gym.gymName,
        message: `You have been registered as a member at ${gym.gymName}. Your ${membershipPlan} membership is now active.`,
        data: {
          gymId: gym._id,
          memberId: member._id
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: {
        member,
        temporaryPassword: user.temporaryPassword || null
      }
    });

  } catch (error) {
    console.error('Error adding existing user as member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member',
      error: error.message
    });
  }
};

// Get gym's membership plans
export const getGymMembershipPlans = async (req, res) => {
  try {
    const gymOwnerId = req.user.id;

    // Find the gym owned by this user
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' })
      .select('pricing.membershipPlans name');
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        gymName: gym.name,
        membershipPlans: gym.pricing?.membershipPlans || []
      }
    });

  } catch (error) {
    console.error('Error fetching membership plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership plans',
      error: error.message
    });
  }
};

// Add new member
export const addMember = async (req, res) => {
  try {
    const gymOwnerId = req.user.id;
    const memberData = req.body;

    // Find the gym owned by this user
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    // Check if member with this email already exists in this gym
    const existingMember = await Member.findOne({ 
      gym: gym._id, 
      email: memberData.email 
    });
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'A member with this email already exists in your gym'
      });
    }

    // Check if a user account exists with this email
    let user = await User.findOne({ email: memberData.email });
    let temporaryPassword = null;
    
    // If no user exists, create one
    if (!user) {
      // Generate a secure temporary password if not provided
      if (!memberData.password || memberData.password.length < 6) {
        temporaryPassword = Math.random().toString(36).slice(-8) + 'Gym@2024';
      } else {
        temporaryPassword = memberData.password;
      }
      
      user = new User({
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        password: temporaryPassword, // User model will hash it automatically
        phoneNumber: memberData.phoneNumber,
        role: 'customer',
        gender: memberData.gender,
        dateOfBirth: memberData.dateOfBirth
      });
      
      await user.save();
    }

    // Create member record
    const member = new Member({
      gym: gym._id,
      user: user._id,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phoneNumber: memberData.phoneNumber,
      gender: memberData.gender,
      dateOfBirth: memberData.dateOfBirth,
      address: memberData.address,
      membershipPlan: {
        name: memberData.membershipPlan,
        price: memberData.membershipPrice || 0,
        features: memberData.membershipFeatures || []
      },
      bodyMeasurements: {
        height: memberData.height,
        weight: memberData.weight,
        waist: memberData.waist,
        hips: memberData.hips || null,
        biceps: memberData.biceps || null,
        thighs: memberData.thighs || null,
        bodyFat: memberData.bodyFat || null
      },
      fitnessGoals: memberData.fitnessGoals || [],
      paymentDetails: {
        method: memberData.paymentDetails?.paymentMethod || 'manual',
        paymentStatus: 'paid'
      },
      status: 'active',
      createdBy: gymOwnerId
    });

    await member.save();

    // Send notification to the new member with login credentials
    if (temporaryPassword) {
      await NotificationService.createNotification({
        recipient: user._id,
        sender: gymOwnerId,
        type: 'member_joined_gym',
        title: 'Welcome to ' + gym.gymName,
        message: `You have been registered as a member at ${gym.gymName}. Your ${memberData.membershipPlan} membership is now active. Your login credentials are: Email: ${user.email}, Password: ${temporaryPassword}. Please change your password after first login.`,
        data: {
          gymId: gym._id,
          memberId: member._id,
          temporaryPassword: temporaryPassword
        }
      });
    } else {
      await NotificationService.createNotification({
        recipient: user._id,
        sender: gymOwnerId,
        type: 'member_joined_gym',
        title: 'Welcome to ' + gym.gymName,
        message: `You have been registered as a member at ${gym.gymName}. Your ${memberData.membershipPlan} membership is now active.`,
        data: {
          gymId: gym._id,
          memberId: member._id
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: {
        member,
        temporaryPassword: temporaryPassword || null
      }
    });

  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member',
      error: error.message
    });
  }
};

// Get all members for a gym
export const getMembers = async (req, res) => {
  try {
    const gymOwnerId = req.user.id;
    const { page = 1, limit = 10, search = '', status = 'all', instructorId } = req.query;

    // Find the gym
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    // Build query
    const query = { gym: gym._id };
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Optional filter by assigned instructor
    if (instructorId) {
      query.assignedInstructor = instructorId;
    }

    // Get total count
    const totalMembers = await Member.countDocuments(query);

    // Get paginated members
    const members = await Member.find(query)
      .populate('user', 'firstName lastName email')
      .populate('assignedInstructor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMembers / limit),
        totalMembers,
        hasNextPage: page * limit < totalMembers,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
      error: error.message
    });
  }
};

// Get single member details
export const getMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const gymOwnerId = req.user.id;

    // Find the gym
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    const member = await Member.findOne({ _id: memberId, gym: gym._id })
      .populate('user', 'firstName lastName email')
      .populate('assignedInstructor', 'firstName lastName specialization');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });

  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member details',
      error: error.message
    });
  }
};

// Update member
export const updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const gymOwnerId = req.user.id;
    const updates = req.body;

    // Find the gym
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    const member = await Member.findOneAndUpdate(
      { _id: memberId, gym: gym._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });

  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update member',
      error: error.message
    });
  }
};

// Assign instructor to member
export const assignInstructor = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { instructorId } = req.body;
    const gymOwnerId = req.user.id;

    // Find the gym
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    // Verify instructor exists and has appropriate role
    const instructor = await User.findOne({ 
      _id: instructorId, 
      role: 'instructor' 
    });
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    const member = await Member.findOneAndUpdate(
      { _id: memberId, gym: gym._id },
      { assignedInstructor: instructorId },
      { new: true }
    ).populate('assignedInstructor', 'firstName lastName');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Send notification to member
    if (member.user) {
      await NotificationService.createNotification({
        recipient: member.user,
        sender: gymOwnerId,
        type: 'instructor_assigned',
        title: 'Instructor Assigned',
        message: `${instructor.firstName} ${instructor.lastName} has been assigned as your instructor`,
        data: {
          instructorId: instructor._id,
          memberId: member._id
        }
      });
    }

    // Send notification to instructor
    await NotificationService.createNotification({
      recipient: instructorId,
      sender: gymOwnerId,
      type: 'member_assigned',
      title: 'New Member Assigned',
      message: `You have been assigned a new member: ${member.firstName} ${member.lastName}`,
      data: {
        instructorId: instructor._id,
        memberId: member._id,
        memberName: `${member.firstName} ${member.lastName}`
      }
    });

    res.status(200).json({
      success: true,
      message: 'Instructor assigned successfully',
      data: member
    });

  } catch (error) {
    console.error('Error assigning instructor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign instructor',
      error: error.message
    });
  }
};

// Delete member
export const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const gymOwnerId = req.user.id;

    // Find the gym
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    const member = await Member.findOneAndDelete({ 
      _id: memberId, 
      gym: gym._id 
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete member',
      error: error.message
    });
  }
};

// Update member status
export const updateMemberStatus = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status } = req.body;
    const gymOwnerId = req.user.id;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Find the gym
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    const member = await Member.findOneAndUpdate(
      { _id: memberId, gym: gym._id },
      { status },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member status updated successfully',
      data: member
    });

  } catch (error) {
    console.error('Error updating member status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update member status',
      error: error.message
    });
  }
};

// Get member statistics
export const getMemberStats = async (req, res) => {
  try {
    const gymOwnerId = req.user.id;

    // Find the gym
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    const totalMembers = await Member.countDocuments({ gym: gym._id });
    const activeMembers = await Member.countDocuments({ gym: gym._id, status: 'active' });
    const inactiveMembers = await Member.countDocuments({ gym: gym._id, status: 'inactive' });
    
    // Calculate monthly revenue
    const members = await Member.find({ gym: gym._id, status: 'active' });
    const monthlyRevenue = members.reduce((total, member) => {
      return total + (member.membershipPlan.price || 0);
    }, 0);

    // Calculate average attendance
    const avgAttendance = members.reduce((total, member) => {
      return total + (member.attendance || 0);
    }, 0) / (activeMembers || 1);

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        monthlyRevenue,
        avgAttendance: Math.round(avgAttendance),
        retentionRate: totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching member stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member statistics',
      error: error.message
    });
  }
};

// Register customer to gym
export const registerCustomerToGym = async (req, res) => {
  try {    
    console.log('DEBUG - Raw request body:', req.body);
    console.log('DEBUG - Request file:', req.file ? 'File uploaded' : 'No file');
    
    const { gymId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      height,
      weight,
      bmi,
      bodyFat,
      waist,
      hips,
      biceps,
      chest,
      thighs,
      fitnessGoals,
      plan,
      paymentMethod,
      healthConditions,
      emergencyContact
    } = req.body;

    // Validation check
    if (!firstName || !lastName || !email || !phone || !gender || !dateOfBirth || 
        !height || !weight || !waist || !plan || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find the gym
    const gym = await Gym.findById(gymId).populate('owner', 'firstName lastName email _id');
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    if (!gym.owner || !gym.owner._id) {
      return res.status(400).json({
        success: false,
        message: 'Gym owner not found'
      });
    }

    // Check if customer already exists
    let customer = await User.findOne({ email, role: 'customer' });
    
    if (!customer) {
      // Create new customer user
      customer = new User({
        firstName,
        lastName,
        email,
        phone,
        role: 'customer',
        password: Math.random().toString(36).slice(-8), // Random password
        isActive: true
      });
      await customer.save();
    }

    // Check if customer is already a member of this gym
    const existingMember = await Member.findOne({
      user: customer._id,
      gym: gymId
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Customer is already a member of this gym'
      });
    }

    // Parse arrays if they come as strings (from FormData)
    const parsedFitnessGoals = fitnessGoals ? 
      (typeof fitnessGoals === 'string' ? JSON.parse(fitnessGoals) : fitnessGoals) : [];
    const parsedHealthConditions = healthConditions ? 
      (typeof healthConditions === 'string' ? JSON.parse(healthConditions) : healthConditions) : [];
    const parsedEmergencyContact = emergencyContact ? 
      (typeof emergencyContact === 'string' ? JSON.parse(emergencyContact) : emergencyContact) : null;

    // Debug payment method
    console.log('DEBUG - Registration payment method:', paymentMethod);
    console.log('DEBUG - Payment method type:', typeof paymentMethod);
    console.log('DEBUG - Payment method exact value:', JSON.stringify(paymentMethod));
    console.log('DEBUG - Is bank transfer?', paymentMethod === 'bank_transfer');
    console.log('DEBUG - Req.body full:', req.body);
    
    // Upload receipt to Cloudinary if file is provided
    let receiptUrl = null;
    if (req.file && paymentMethod === 'bank_transfer') {
      try {
        console.log('DEBUG - Uploading receipt to Cloudinary...');
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, receiptOptions);
        receiptUrl = cloudinaryResult.secure_url;
        console.log('DEBUG - Receipt uploaded to Cloudinary:', receiptUrl);
      } catch (uploadError) {
        console.error('Error uploading receipt to Cloudinary:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload receipt. Please try again.',
          error: uploadError.message
        });
      }
    }

    // Create member record with all required fields
    const member = new Member({
      user: customer._id,
      gym: gymId,
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      membershipPlan: {
        name: plan,
        price: 1000, // Default price, will be updated based on gym's pricing
        features: ['Basic access'],
        startDate: new Date()
      },
      bodyMeasurements: {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmi),
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        waist: parseFloat(waist),
        hips: hips ? parseFloat(hips) : undefined,
        biceps: biceps ? parseFloat(biceps) : undefined,
        thighs: thighs ? parseFloat(thighs) : undefined
      },
      fitnessGoals: parsedFitnessGoals,
      emergencyContact: parsedEmergencyContact,
      medicalInfo: {
        conditions: parsedHealthConditions
      },
      paymentDetails: {
        method: paymentMethod === 'bank_transfer' ? 'manual' : 'card',
        paymentStatus: paymentMethod === 'bank_transfer' ? 'pending' : 'paid',
        receiptPath: receiptUrl
      },
      status: paymentMethod === 'bank_transfer' ? 'inactive' : 'active',
      createdBy: gym.owner._id
    });
    
    // Extra debug before save
    console.log('DEBUG - Member object before save:');
    console.log('  status:', member.status);
    console.log('  paymentDetails.method:', member.paymentDetails.method);
    console.log('  paymentDetails.paymentStatus:', member.paymentDetails.paymentStatus);

    console.log('DEBUG - Member before save:', {
      status: member.status,
      paymentStatus: member.paymentDetails.paymentStatus,
      paymentMethod: member.paymentDetails.method
    });

    await member.save();

    // Create notifications
    try {
      // Notification for customer
      await NotificationService.createNotification({
        recipient: customer._id,
        type: 'member_joined_gym',
        title: `Welcome to ${gym.gymName}!`,
        message: `Your membership registration at ${gym.gymName} has been ${paymentMethod === 'bank_transfer' ? 'submitted and is pending approval' : 'completed successfully'}.`,
        data: {
          gymId: gym._id,
          gymName: gym.gymName,
          memberId: member._id,
          paymentMethod,
          status: member.status
        }
      });

      // Notification for gym owner
      const gymOwnerMessage = paymentMethod === 'bank_transfer' 
        ? `${firstName} ${lastName} has registered as a new member at your gym ${gym.gymName} via bank transfer. Please verify the payment receipt and approve the membership.`
        : `${firstName} ${lastName} has registered as a new member at your gym ${gym.gymName}.`;
      
      const gymOwnerTitle = paymentMethod === 'bank_transfer' 
        ? 'New Member Registration - Payment Verification Required'
        : 'New Member Registration';

      await NotificationService.createNotification({
        recipient: gym.owner._id,
        type: paymentMethod === 'bank_transfer' ? 'payment_received' : 'member_joined_gym',
        title: gymOwnerTitle,
        message: gymOwnerMessage,
        priority: paymentMethod === 'bank_transfer' ? 'high' : 'medium',
        data: {
          gymId: gym._id,
          gymName: gym.gymName,
          memberId: member._id,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          paymentMethod,
          status: member.status,
          receiptPath: receiptUrl,
          requiresVerification: paymentMethod === 'bank_transfer'
        }
      });

      console.log('Notifications created successfully for customer and gym owner');
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Don't fail the registration if notifications fail
    }

    console.log('DEBUG - Final member status:', member.status);
    console.log('DEBUG - Final payment status:', member.paymentDetails.paymentStatus);
    console.log('DEBUG - Payment method check:', paymentMethod === 'bank_transfer');
    
    res.status(201).json({
      success: true,
      message: paymentMethod === 'bank_transfer' 
        ? 'Registration submitted successfully! Your membership is pending approval after payment verification.'
        : 'Registration completed successfully! Welcome to the gym!',
      data: {
        member,
        customer: {
          id: customer._id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email
        },
        gym: {
          id: gym._id,
          name: gym.gymName
        }
      }
    });

  } catch (error) {
    console.error('Error registering customer to gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register customer to gym',
      error: error.message
    });
  }
};

// Confirm customer payment (for gym owners)
export const confirmCustomerPayment = async (req, res) => {
  try {
    const { memberId } = req.params;
    const gymOwnerId = req.user.id;

    // Find the gym owned by this user
    const gym = await Gym.findOne({ owner: gymOwnerId, status: 'approved' });
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No approved gym found for this owner'
      });
    }

    // Find the member
    const member = await Member.findOne({ 
      _id: memberId, 
      gym: gym._id 
    }).populate('user', 'firstName lastName email');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Update member status to active and payment status to paid
    member.status = 'active';
    member.paymentDetails.paymentStatus = 'paid';
    await member.save();

    // Send notification to customer
    try {
      await NotificationService.createNotification({
        recipient: member.user._id,
        type: 'payment_received',
        title: 'Payment Confirmed!',
        message: `Your payment has been verified and approved by ${gym.gymName}. Your membership is now active. Welcome to the gym!`,
        priority: 'high',
        data: {
          gymId: gym._id,
          gymName: gym.gymName,
          memberId: member._id,
          status: 'confirmed',
          membershipStatus: 'active'
        }
      });

      console.log('Payment confirmation notification sent to customer');
    } catch (notificationError) {
      console.error('Error creating payment confirmation notification:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully. Customer has been notified.',
      data: {
        member,
        gym: {
          id: gym._id,
          name: gym.gymName
        }
      }
    });

  } catch (error) {
    console.error('Error confirming customer payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

// Get customer's own profile (for logged-in customers)
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the member record for this user
    const member = await Member.findOne({ user: userId })
      .populate('gym', 'gymName name location address pricing')
      .populate('assignedInstructor', 'firstName lastName email phoneNumber specialization')
      .populate('user', 'firstName lastName email phoneNumber');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member profile not found. You may not be registered at any gym yet.'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });

  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Get customer's workout plans (for logged-in customers)
export const getMyWorkoutPlans = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the member record for this user
    const member = await Member.findOne({ user: userId });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member profile not found'
      });
    }

    // Import MemberWorkoutPlan model
    const MemberWorkoutPlan = (await import('../models/MemberWorkoutPlan.js')).default;

    // Find all workout plans assigned to this member
    const workoutPlans = await MemberWorkoutPlan.find({ student: member._id })
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: workoutPlans
    });

  } catch (error) {
    console.error('Error fetching workout plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout plans',
      error: error.message
    });
  }
};

// Update workout exercise status
export const updateWorkoutStatus = async (req, res) => {
  try {
    const { workoutPlanId, dayIndex, exerciseIndex, workoutStatus } = req.body;
    const userId = req.user.id;

    console.log('🔄 Update workout status request:', {
      workoutPlanId,
      dayIndex,
      exerciseIndex,
      workoutStatus,
      userId,
      userIdType: typeof userId
    });

    // Find the member record for this user
    const member = await Member.findOne({ user: userId });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member profile not found'
      });
    }

    console.log('🔍 Found member:', {
      memberId: member._id,
      userId: userId
    });

    // Import MemberWorkoutPlan model
    const MemberWorkoutPlan = (await import('../models/MemberWorkoutPlan.js')).default;

    // Find the workout plan and verify it belongs to this member
    const workoutPlan = await MemberWorkoutPlan.findOne({
      _id: workoutPlanId,
      student: member._id
    });

    console.log('🔍 Found workout plan:', workoutPlan ? 'Yes' : 'No');
    if (workoutPlan) {
      console.log('🔍 Workout plan schedule length:', workoutPlan.schedule.length);
      console.log('🔍 Day at index', dayIndex, ':', workoutPlan.schedule[dayIndex]);
      if (workoutPlan.schedule[dayIndex]) {
        console.log('🔍 Exercises in day:', workoutPlan.schedule[dayIndex].exercises.length);
        console.log('🔍 Exercise at index', exerciseIndex, ':', workoutPlan.schedule[dayIndex].exercises[exerciseIndex]);
      }
    } else {
      // Debug: Check if workout plan exists but with different student
      const allPlans = await MemberWorkoutPlan.find({ _id: workoutPlanId });
      console.log('🔍 All workout plans with this ID:', allPlans.length);
      if (allPlans.length > 0) {
        console.log('🔍 Plan exists but student mismatch:', {
          planStudent: allPlans[0].student,
          requestMemberId: member._id,
          match: allPlans[0].student.toString() === member._id.toString()
        });
      }
    }

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found or not assigned to you'
      });
    }

    // Validate indices
    if (!workoutPlan.schedule[dayIndex] || !workoutPlan.schedule[dayIndex].exercises[exerciseIndex]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exercise index'
      });
    }

    // Check if exercise is already completed and trying to mark as incomplete
    const currentExercise = workoutPlan.schedule[dayIndex].exercises[exerciseIndex];
    if (currentExercise.workoutStatus === 1 && workoutStatus === 0) {
      return res.status(400).json({
        success: false,
        message: 'Exercise is already completed and cannot be changed'
      });
    }

    // Update the workout status
    workoutPlan.schedule[dayIndex].exercises[exerciseIndex].workoutStatus = workoutStatus;
    await workoutPlan.save();

    // Calculate progress
    let totalExercises = 0;
    let completedExercises = 0;
    
    workoutPlan.schedule.forEach(day => {
      day.exercises.forEach(exercise => {
        totalExercises++;
        if (exercise.workoutStatus === 1) {
          completedExercises++;
        }
      });
    });

    const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: 'Workout status updated successfully',
      data: {
        workoutStatus,
        progress,
        completedExercises,
        totalExercises
      }
    });

  } catch (error) {
    console.error('Error updating workout status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update workout status',
      error: error.message
    });
  }
};