import InstructorApplication from '../models/InstructorApplication.js';
import User from '../models/User.js';
import Member from '../models/Member.js';
import Gym from '../models/Gym.js';
import MemberWorkoutPlan from '../models/MemberWorkoutPlan.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';
import NotificationService from '../services/notificationService.js';

// Submit instructor application
export const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      experience,
      availability,
      preferredLocation,
      isFreelance,
      motivation
    } = req.body;

    // Parse availability if it's a string
    let parsedAvailability = availability;
    if (typeof availability === 'string') {
      try {
        parsedAvailability = JSON.parse(availability);
      } catch (e) {
        parsedAvailability = [availability];
      }
    }

    // Check if user already has a pending application
    const existingApplication = await InstructorApplication.findOne({
      applicant: req.user.id,
      status: { $in: ['pending', 'under_review'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending instructor application. Please wait for review.'
      });
    }

    // Create application data
    const applicationData = {
      applicant: req.user.id,
      firstName,
      lastName,
      email,
      phone,
      specialization,
      experience: parseInt(experience),
      availability: parsedAvailability,
      preferredLocation,
      isFreelance: isFreelance === 'true',
      motivation
    };

    // Handle file uploads from Cloudinary middleware
    if (req.uploadedFiles) {
      if (req.uploadedFiles.resume) {
        applicationData.resume = {
          url: req.uploadedFiles.resume.url,
          publicId: req.uploadedFiles.resume.publicId,
          originalName: req.uploadedFiles.resume.originalName,
          size: req.uploadedFiles.resume.size,
          format: req.uploadedFiles.resume.format
        };
      }

      if (req.uploadedFiles.profilePicture) {
        applicationData.profilePicture = {
          url: req.uploadedFiles.profilePicture.url,
          publicId: req.uploadedFiles.profilePicture.publicId,
          originalName: req.uploadedFiles.profilePicture.originalName,
          size: req.uploadedFiles.profilePicture.size,
          format: req.uploadedFiles.profilePicture.format,
          width: req.uploadedFiles.profilePicture.width,
          height: req.uploadedFiles.profilePicture.height
        };
      }

      if (req.uploadedFiles.certifications && req.uploadedFiles.certifications.length > 0) {
        applicationData.certifications = req.uploadedFiles.certifications.map(cert => ({
          url: cert.url,
          publicId: cert.publicId,
          originalName: cert.originalName,
          size: cert.size,
          format: cert.format
        }));
      }
    }

    // Create the application
    const application = new InstructorApplication(applicationData);
    await application.save();

    // Populate applicant info
    const populatedApplication = await InstructorApplication.findById(application._id)
      .populate('applicant', 'firstName lastName email role');

    // Send notifications
    try {
      // 1. Send confirmation notification to applicant
      await NotificationService.createNotification({
        recipient: req.user.id,
        type: 'instructor_application_submitted',
        title: 'Application Submitted Successfully! 📝',
        message: `Your instructor application has been submitted successfully. We will review your application for "${specialization}" specialization and get back to you soon.`,
        data: {
          applicationId: application._id,
          specialization: specialization,
          experience: experience,
          isFreelance: isFreelance === 'true'
        },
        link: '/apply-instructor',
        priority: 'medium'
      });

      // 2. Send notification to all admins
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await NotificationService.createNotification({
          recipient: admin._id,
          type: 'instructor_application_pending',
          title: 'New Instructor Application Received 📋',
          message: `New instructor application from ${firstName} ${lastName} for "${specialization}". Review required for approval.`,
          data: {
            applicationId: application._id,
            applicantName: `${firstName} ${lastName}`,
            applicantEmail: email,
            specialization: specialization,
            experience: experience,
            isFreelance: isFreelance === 'true'
          },
          link: '/admin/instructor-applications',
          priority: 'high'
        });
      }
    } catch (notificationError) {
      console.error('Error sending application notifications:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Instructor application submitted successfully. We will review your application and get back to you soon.',
      data: populatedApplication
    });

  } catch (error) {
    console.error('Error submitting instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit instructor application',
      error: error.message
    });
  }
};

// Get all instructor applications (Admin only)
export const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      specialization,
      search
    } = req.query;

    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Specialization filter
    if (specialization) {
      filter.specialization = specialization;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const applications = await InstructorApplication.find(filter)
      .populate('applicant', 'firstName lastName email role')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InstructorApplication.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching instructor applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor applications',
      error: error.message
    });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role phone')
      .populate('reviewedBy', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    // Check if user can view this application
    if (req.user.role !== 'admin' && application.applicant._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor application',
      error: error.message
    });
  }
};

// Get user's own applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await InstructorApplication.find({ applicant: req.user.id })
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your applications',
      error: error.message
    });
  }
};

// Approve instructor application (Admin only)
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const application = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    if (application.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Application is already approved'
      });
    }

    // Approve the application
    await application.approve(req.user.id, adminNotes);

    // Update user role to instructor if they are a customer
    if (application.applicant.role === 'customer') {
      await User.findByIdAndUpdate(
        application.applicant._id,
        { 
          role: 'instructor',
          specialization: [application.specialization],
          experience: application.experience
        }
      );
    }

    // Populate the updated application
    const updatedApplication = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role')
      .populate('reviewedBy', 'firstName lastName email');

    // Send approval notification
    try {
      await NotificationService.notifyInstructorApplication(updatedApplication, 'approved');
    } catch (notificationError) {
      console.error('Error sending approval notification:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Instructor application approved successfully',
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error approving instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve instructor application',
      error: error.message
    });
  }
};

// Reject instructor application (Admin only)
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const application = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    if (application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Application is already rejected'
      });
    }

    // Reject the application
    await application.reject(req.user.id, adminNotes);

    // Populate the updated application
    const updatedApplication = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role')
      .populate('reviewedBy', 'firstName lastName email');

    // Send rejection notification
    try {
      await NotificationService.notifyInstructorApplication(updatedApplication, 'rejected');
    } catch (notificationError) {
      console.error('Error sending rejection notification:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Instructor application rejected',
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error rejecting instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject instructor application',
      error: error.message
    });
  }
};

// Delete instructor application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await InstructorApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    // Check if user can delete this application
    if (req.user.role !== 'admin' && application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    // Delete files from Cloudinary
    const filesToDelete = [];
    
    if (application.resume?.publicId) {
      filesToDelete.push(application.resume.publicId);
    }
    
    if (application.profilePicture?.publicId) {
      filesToDelete.push(application.profilePicture.publicId);
    }
    
    if (application.certifications?.length > 0) {
      application.certifications.forEach(cert => {
        if (cert.publicId) {
          filesToDelete.push(cert.publicId);
        }
      });
    }

    // Delete files from Cloudinary
    for (const publicId of filesToDelete) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error(`Error deleting file ${publicId} from Cloudinary:`, error);
      }
    }

    // Delete the application
    await InstructorApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Instructor application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete instructor application',
      error: error.message
    });
  }
};

// Get instructor application statistics (Admin only)
export const getApplicationStats = async (req, res) => {
  try {
    const totalApplications = await InstructorApplication.countDocuments();
    const pendingApplications = await InstructorApplication.countDocuments({ status: 'pending' });
    const approvedApplications = await InstructorApplication.countDocuments({ status: 'approved' });
    const rejectedApplications = await InstructorApplication.countDocuments({ status: 'rejected' });
    const underReviewApplications = await InstructorApplication.countDocuments({ status: 'under_review' });

    // Get applications by specialization
    const applicationsBySpecialization = await InstructorApplication.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentApplications = await InstructorApplication.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          underReviewApplications,
          recentApplications
        },
        applicationsBySpecialization
      }
    });

  } catch (error) {
    console.error('Error fetching instructor application statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor application statistics',
      error: error.message
    });
  }
};

// Get all verified instructors (Admin only)
export const getVerifiedInstructors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialization,
      search,
      status = 'active'
    } = req.query;

    const filter = {
      role: 'instructor',
      isActive: status === 'active'
    };

    // Specialization filter
    if (specialization && specialization !== 'all') {
      filter.specialization = { $in: [specialization] };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const instructors = await User.find(filter)
      .select('-password -refreshToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    // Get additional stats for each instructor
    const instructorsWithStats = await Promise.all(
      instructors.map(async (instructor) => {
        // Get approved application data
        const application = await InstructorApplication.findOne({
          applicant: instructor._id,
          status: 'approved'
        });

        return {
          ...instructor.toObject(),
          application: application ? {
            approvedAt: application.approvedAt,
            specialization: application.specialization,
            experience: application.experience,
            certifications: application.certifications,
            profilePicture: application.profilePicture,
            resume: application.resume,
            motivation: application.motivation,
            preferredLocation: application.preferredLocation,
            availability: application.availability,
            isFreelance: application.isFreelance
          } : null,
          // Add placeholder stats (you can expand this with real data)
          stats: {
            totalStudents: Math.floor(Math.random() * 200) + 20,
            classesCompleted: Math.floor(Math.random() * 500) + 50,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1)
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      data: instructorsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching verified instructors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verified instructors',
      error: error.message
    });
  }
};

// Deactivate/Activate instructor (Admin only)
export const toggleInstructorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const instructor = await User.findById(id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    if (instructor.role !== 'instructor') {
      return res.status(400).json({
        success: false,
        message: 'User is not an instructor'
      });
    }

    instructor.isActive = isActive;
    await instructor.save();

    res.status(200).json({
      success: true,
      message: `Instructor ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: instructor
    });

  } catch (error) {
    console.error('Error toggling instructor status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update instructor status',
      error: error.message
    });
  }
};

// Get instructor details by ID (Admin only)
export const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;

    const instructor = await User.findById(id)
      .select('-password -refreshToken -passwordResetToken -passwordResetExpires');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    if (instructor.role !== 'instructor') {
      return res.status(400).json({
        success: false,
        message: 'User is not an instructor'
      });
    }

    // Get approved application data
    const application = await InstructorApplication.findOne({
      applicant: instructor._id,
      status: 'approved'
    });

    const instructorWithDetails = {
      ...instructor.toObject(),
      application: application ? {
        approvedAt: application.approvedAt,
        specialization: application.specialization,
        experience: application.experience,
        certifications: application.certifications,
        profilePicture: application.profilePicture,
        motivation: application.motivation,
        preferredLocation: application.preferredLocation,
        availability: application.availability,
        resume: application.resume,
        isFreelance: application.isFreelance
      } : null
    };

    res.status(200).json({
      success: true,
      data: instructorWithDetails
    });

  } catch (error) {
    console.error('Error fetching instructor details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor details',
      error: error.message
    });
  }
};

// Get freelance instructors for gym owners to apply to
export const getFreelanceInstructors = async (req, res) => {
  try {
    const { gymId } = req.query; // Get gym ID from query parameters
    
    // Find approved instructor applications where isFreelance is true
    const freelanceInstructors = await InstructorApplication.find({
      status: 'approved',
      isFreelance: true
    })
    .populate('applicant', 'firstName lastName email phone')
    .select('specialization experience preferredLocation availability profilePicture certifications resume isFreelance motivation')
    .sort({ createdAt: -1 });

    let instructorsWithDetails = freelanceInstructors.map(application => ({
      _id: application.applicant._id,
      firstName: application.applicant.firstName,
      lastName: application.applicant.lastName,
      email: application.applicant.email,
      phone: application.applicant.phone,
      applicationDetails: {
        specialization: application.specialization,
        experience: application.experience,
        preferredLocation: application.preferredLocation,
        availability: application.availability,
        profilePicture: application.profilePicture,
        certifications: application.certifications,
        resume: application.resume,
        isFreelance: application.isFreelance,
        motivation: application.motivation
      }
    }));

    // If gymId is provided, exclude instructors who already have accepted collaboration requests with this gym
    if (gymId) {
      const CollaborationRequest = (await import('../models/CollaborationRequest.js')).default;
      
      const acceptedCollaborations = await CollaborationRequest.find({
        gym: gymId,
        status: 'accepted'
      }).select('toInstructor');

      const acceptedInstructorIds = acceptedCollaborations.map(collab => collab.toInstructor.toString());
      
      // Filter out instructors who already have accepted collaboration requests with this gym
      instructorsWithDetails = instructorsWithDetails.filter(instructor => 
        !acceptedInstructorIds.includes(instructor._id.toString())
      );
    }

    res.status(200).json({
      success: true,
      data: instructorsWithDetails
    });

  } catch (error) {
    console.error('Error fetching freelance instructors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch freelance instructors',
      error: error.message
    });
  }
};

// Get members assigned to instructor
export const getAssignedMembers = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;

    // Build query
    const query = { assignedInstructor: instructorId };
    
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
      .populate('gym', 'gymName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Check if this instructor is freelance
    const instructorApplication = await InstructorApplication.findOne({
      applicant: instructorId,
      status: 'approved'
    });

    const isInstructorFreelance = instructorApplication?.isFreelance || false;

    // Add freelancing info to each member
    const membersWithFreelanceInfo = members.map(member => ({
      ...member.toObject(),
      isFreelance: isInstructorFreelance
    }));

    res.status(200).json({
      success: true,
      data: membersWithFreelanceInfo,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMembers / limit),
        totalMembers,
        hasNextPage: page * limit < totalMembers,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching assigned members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned members',
      error: error.message
    });
  }
};

// Create workout plan for student
export const createWorkoutPlan = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { 
      studentId, 
      planName, 
      startDate, 
      endDate, 
      type, 
      description, 
      schedule 
    } = req.body;

    // Validate required fields
    if (!studentId || !planName || !startDate || !endDate || !type) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: studentId, planName, startDate, endDate, and type'
      });
    }

    // Verify the member is assigned to this instructor
    const member = await Member.findById(studentId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    if (member.assignedInstructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'This member is not assigned to you'
      });
    }

    // Create workout plan
    const workoutPlan = new MemberWorkoutPlan({
      instructor: instructorId,
      student: studentId,
      planName,
      type,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      schedule: schedule || []
    });

    await workoutPlan.save();

    // Populate references for response
    const populatedPlan = await MemberWorkoutPlan.findById(workoutPlan._id)
      .populate('student', 'firstName lastName email')
      .populate('instructor', 'firstName lastName');

    // Send notification to the member about the assigned workout plan
    try {
      const instructor = await User.findById(instructorId);
      if (member.user) {
        await NotificationService.createNotification({
          recipient: member.user,
          sender: instructorId,
          type: 'workout_plan_assigned',
          title: 'New Workout Plan Assigned! 💪',
          message: `${instructor.firstName} ${instructor.lastName} has assigned you a new workout plan: "${planName}"`,
          data: {
            workoutPlanId: workoutPlan._id,
            planName: planName,
            instructorId: instructorId,
            instructorName: `${instructor.firstName} ${instructor.lastName}`,
            startDate: startDate,
            endDate: endDate,
            type: type
          },
          link: '/customer/my-workout',
          priority: 'high'
        });
        console.log('Workout plan assignment notification sent to member');
      }
    } catch (notificationError) {
      console.error('Error creating workout plan notification:', notificationError);
      // Don't fail the workout plan creation if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully',
      data: populatedPlan
    });

  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create workout plan',
      error: error.message
    });
  }
};

// Get instructor's assigned workout plans with member progress
export const getInstructorWorkoutPlans = async (req, res) => {
  try {
    const instructorId = req.user.id;
    console.log('Fetching workout plans for instructor:', instructorId);

    // Find all workout plans assigned by this instructor
    const workoutPlans = await MemberWorkoutPlan.find({ instructor: instructorId })
      .populate('student', 'firstName lastName email phoneNumber')
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    console.log('Found workout plans:', workoutPlans.length);
    console.log('Sample workout plan:', workoutPlans[0] ? {
      id: workoutPlans[0]._id,
      student: workoutPlans[0].student,
      planName: workoutPlans[0].planName
    } : 'No plans found');

    // If no workout plans found, return empty array
    if (!workoutPlans || workoutPlans.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Group workout plans by member and calculate progress
    const memberPlans = {};
    
    try {
      workoutPlans.forEach((plan, index) => {
        try {
          // Skip plans with null or missing student references
          if (!plan.student || !plan.student._id) {
            console.warn(`Skipping workout plan ${index} with missing student reference:`, plan._id);
            return;
          }
          
          const memberId = plan.student._id.toString();
          
          if (!memberPlans[memberId]) {
            memberPlans[memberId] = {
              member: plan.student,
              plans: [],
              totalProgress: 0,
              activePlans: 0
            };
          }

          // Calculate progress for this plan
          let totalExercises = 0;
          let completedExercises = 0;
          
          if (plan.schedule && Array.isArray(plan.schedule)) {
            plan.schedule.forEach(day => {
              if (day.exercises && Array.isArray(day.exercises)) {
                day.exercises.forEach(exercise => {
                  totalExercises++;
                  if (exercise.workoutStatus === 1) {
                    completedExercises++;
                  }
                });
              }
            });
          }

          const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
          
          memberPlans[memberId].plans.push({
            ...plan.toObject(),
            progress,
            completedExercises,
            totalExercises
          });

          memberPlans[memberId].totalProgress += progress;
          memberPlans[memberId].activePlans++;
        } catch (planError) {
          console.error(`Error processing workout plan ${index}:`, planError);
          console.error('Plan data:', plan);
        }
      });
    } catch (forEachError) {
      console.error('Error in forEach loop:', forEachError);
      throw forEachError;
    }

    // Convert to array and calculate average progress
    const membersWithPlans = Object.values(memberPlans).map(member => ({
      ...member,
      averageProgress: Math.round(member.totalProgress / member.activePlans)
    }));

    console.log('Processed members with plans:', membersWithPlans.length);
    console.log('Sample member data:', membersWithPlans[0] ? {
      memberName: `${membersWithPlans[0].member.firstName} ${membersWithPlans[0].member.lastName}`,
      plansCount: membersWithPlans[0].plans.length,
      averageProgress: membersWithPlans[0].averageProgress
    } : 'No members found');

    res.status(200).json({
      success: true,
      data: membersWithPlans
    });

  } catch (error) {
    console.error('Error fetching instructor workout plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout plans',
      error: error.message
    });
  }
};

// Get instructor's gym and available exercises
export const getInstructorGymExercises = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Find the gym where this instructor is registered
    const gym = await Gym.findOne({
      'instructors.instructor': instructorId,
      'instructors.isActive': true
    }).populate('selectedWorkouts', 'name url');

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No active gym found for this instructor'
      });
    }

    // Extract exercise names from selectedWorkouts (GIFs)
    const exercises = gym.selectedWorkouts.map(workout => ({
      id: workout._id,
      name: workout.name,
      url: workout.url
    }));

    res.status(200).json({
      success: true,
      data: {
        gym: {
          id: gym._id,
          name: gym.gymName
        },
        exercises: exercises
      }
    });

  } catch (error) {
    console.error('Error fetching instructor gym exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gym exercises',
      error: error.message
    });
  }
};