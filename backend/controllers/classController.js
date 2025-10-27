import Class from '../models/Class.js';
import Member from '../models/Member.js';
import User from '../models/User.js';
import Gym from '../models/Gym.js';
import NotificationService from '../services/notificationService.js';

// Create a new class
export const createClass = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const {
      name,
      description,
      type,
      date,
      time,
      duration,
      price,
      capacity,
      location,
      package: packageName = 'standard'
    } = req.body;

    // Validate required fields
    if (!name || !type || !date || !time || !duration || !price || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, type, date, time, duration, price, and capacity'
      });
    }

    // Find the gym where the instructor is registered
    const gym = await Gym.findOne({
      'instructors.instructor': instructorId,
      'instructors.isActive': true
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No active gym found for this instructor'
      });
    }

    // Create the class
    const newClass = new Class({
      instructor: instructorId,
      gym: gym._id,
      name,
      description,
      type,
      date: new Date(date),
      time,
      duration,
      price,
      capacity,
      enrolledMembers: 0,
      location: location || 'Not specified',
      package: packageName,
      status: 'upcoming'
    });

    await newClass.save();

    // Populate references for response
    const populatedClass = await Class.findById(newClass._id)
      .populate('instructor', 'firstName lastName email')
      .populate('gym', 'gymName gymAddress');

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: populatedClass
    });

  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create class',
      error: error.message
    });
  }
};

// Get all classes for an instructor
export const getInstructorClasses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { instructor: instructorId };
    
    if (status) {
      query.status = status;
    }

    // Get total count
    const totalClasses = await Class.countDocuments(query);

    // Get paginated classes
    const classes = await Class.find(query)
      .populate('instructor', 'firstName lastName email')
      .populate('gym', 'gymName gymAddress')
      .populate('members.member', 'firstName lastName email phoneNumber')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      success: true,
      data: classes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalClasses / limit),
        totalClasses,
        hasNextPage: page * limit < totalClasses,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching instructor classes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes',
      error: error.message
    });
  }
};

// Get class by ID
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.id;

    const classObj = await Class.findById(id)
      .populate('instructor', 'firstName lastName email')
      .populate('gym', 'gymName gymAddress')
      .populate('members.member', 'firstName lastName email phoneNumber gender');

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if the instructor is authorized to view this class
    if (classObj.instructor._id.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this class'
      });
    }

    res.status(200).json({
      success: true,
      data: classObj
    });

  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class',
      error: error.message
    });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.id;
    const updateData = req.body;

    const classObj = await Class.findById(id);

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check authorization
    if (classObj.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this class'
      });
    }

    // Don't allow updating fields that shouldn't be changed
    const allowedFields = ['name', 'description', 'type', 'date', 'time', 'duration', 'price', 'capacity', 'location', 'status', 'package'];
    const updates = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    // Handle date conversion
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    // Update the class
    Object.assign(classObj, updates);
    await classObj.save();

    // Populate for response
    const updatedClass = await Class.findById(id)
      .populate('instructor', 'firstName lastName email')
      .populate('gym', 'gymName gymAddress')
      .populate('members.member', 'firstName lastName email phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass
    });

  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update class',
      error: error.message
    });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.id;

    const classObj = await Class.findById(id);

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check authorization
    if (classObj.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this class'
      });
    }

    await Class.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete class',
      error: error.message
    });
  }
};

// Add member to class
export const addMemberToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.id;
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID is required'
      });
    }

    const classObj = await Class.findById(id);

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check authorization
    if (classObj.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this class'
      });
    }

    // Check if member exists
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Check if member is assigned to this instructor
    if (member.assignedInstructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'This member is not assigned to you'
      });
    }

    // Add member to class
    await classObj.addMember(memberId);

    // Notify the member
    try {
      const instructor = await User.findById(instructorId);
      if (member.user) {
        await NotificationService.createNotification({
          recipient: member.user,
          sender: instructorId,
          type: 'class_enrolled',
          title: 'Enrolled in Class! 🎯',
          message: `${instructor.firstName} ${instructor.lastName} enrolled you in class: "${classObj.name}"`,
          data: {
            classId: classObj._id,
            className: classObj.name,
            classDate: classObj.date,
            classTime: classObj.time,
            instructorId: instructorId,
            instructorName: `${instructor.firstName} ${instructor.lastName}`
          },
          link: '/customer/class-schedule',
          priority: 'medium'
        });
      }
    } catch (notificationError) {
      console.error('Error creating class enrollment notification:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Member added to class successfully'
    });

  } catch (error) {
    console.error('Error adding member to class:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add member to class',
      error: error.message
    });
  }
};

// Remove member from class
export const removeMemberFromClass = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const instructorId = req.user.id;

    const classObj = await Class.findById(id);

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check authorization
    if (classObj.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this class'
      });
    }

    // Remove member from class
    await classObj.removeMember(memberId);

    res.status(200).json({
      success: true,
      message: 'Member removed from class successfully'
    });

  } catch (error) {
    console.error('Error removing member from class:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove member from class',
      error: error.message
    });
  }
};

// Get members assigned to instructor for dropdown
export const getClassEligibleMembers = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get members assigned to this instructor
    const members = await Member.find({ assignedInstructor: instructorId })
      .select('firstName lastName email phoneNumber')
      .sort({ firstName: 1, lastName: 1 });

    res.status(200).json({
      success: true,
      data: members
    });

  } catch (error) {
    console.error('Error fetching eligible members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch eligible members',
      error: error.message
    });
  }
};

