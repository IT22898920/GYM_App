import Member from '../models/Member.js';
import User from '../models/User.js';
import Gym from '../models/Gym.js';
import bcrypt from 'bcryptjs';
import NotificationService from '../services/notificationService.js';

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
    
    // If no user exists, create one
    if (!user) {
      const hashedPassword = await bcrypt.hash(memberData.password, 10);
      
      user = new User({
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        password: hashedPassword,
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
      createdBy: gymOwnerId
    });

    await member.save();

    // Send notification to the new member
    await NotificationService.createNotification({
      recipient: user._id,
      sender: gymOwnerId,
      type: 'member_added',
      title: 'Welcome to ' + gym.name,
      message: `You have been registered as a member at ${gym.name}. Your ${memberData.membershipPlan} membership is now active.`,
      data: {
        gymId: gym._id,
        memberId: member._id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: member
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
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;

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