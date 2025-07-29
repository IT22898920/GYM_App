import GymRequest from '../models/GymRequest.js';
import Gym from '../models/Gym.js';
import User from '../models/User.js';
import InstructorApplication from '../models/InstructorApplication.js';
import NotificationService from '../services/notificationService.js';

// Send gym request (instructor to gym)
export const sendGymRequest = async (req, res) => {
  try {
    const { gymId, message } = req.body;
    const instructorId = req.user.id;

    // Validate request data
    if (!gymId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Gym ID and message are required'
      });
    }

    // Verify the gym exists
    const gym = await Gym.findById(gymId).populate('owner', 'firstName lastName email');
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Verify the user is an instructor
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can send gym requests'
      });
    }

    // Check if instructor is approved
    const instructorApplication = await InstructorApplication.findOne({
      applicant: instructorId,
      status: 'approved'
    });

    if (!instructorApplication) {
      return res.status(400).json({
        success: false,
        message: 'You must be an approved instructor to send gym requests'
      });
    }

    // Check if instructor is already part of this gym
    if (gym.instructors.includes(instructorId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already an instructor at this gym'
      });
    }

    // Check if there's already a pending request
    const existingRequest = await GymRequest.findOne({
      fromInstructor: instructorId,
      toGym: gymId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request to this gym'
      });
    }

    // Create the gym request
    const gymRequest = new GymRequest({
      fromInstructor: instructorId,
      toGym: gymId,
      message
    });

    await gymRequest.save();

    // Populate the response
    const populatedRequest = await GymRequest.findById(gymRequest._id)
      .populate('fromInstructor', 'firstName lastName email')
      .populate('toGym', 'gymName gymAddress')
      .populate({
        path: 'toGym',
        populate: {
          path: 'owner',
          select: 'firstName lastName email'
        }
      });

    // Send notifications
    try {
      // 1. Send confirmation notification to instructor
      await NotificationService.createNotification({
        recipient: instructorId,
        type: 'gym_request_sent',
        title: 'Gym Request Sent! 📤',
        message: `Your request to join "${gym.gymName}" has been sent successfully. The gym owner will review your request and get back to you soon.`,
        data: {
          requestId: gymRequest._id,
          gymId: gym._id,
          gymName: gym.gymName,
          gymOwner: `${gym.owner.firstName} ${gym.owner.lastName}`
        },
        link: '/instructor/apply-to-gym',
        priority: 'medium'
      });

      // 2. Send notification to gym owner
      await NotificationService.createNotification({
        recipient: gym.owner._id,
        type: 'gym_request_received',
        title: 'New Gym Request Received! 📨',
        message: `${instructor.firstName} ${instructor.lastName} wants to join your gym "${gym.gymName}" as an instructor. Review their request to approve or reject.`,
        data: {
          requestId: gymRequest._id,
          instructorId: instructorId,
          instructorName: `${instructor.firstName} ${instructor.lastName}`,
          instructorEmail: instructor.email,
          gymId: gym._id,
          gymName: gym.gymName,
          specialization: instructorApplication.specialization,
          experience: instructorApplication.experience
        },
        link: '/gym-owner/verify-reject-gym',
        priority: 'high'
      });
    } catch (notificationError) {
      console.error('Error sending request notifications:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Gym request sent successfully',
      data: populatedRequest
    });

  } catch (error) {
    console.error('Error sending gym request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send gym request',
      error: error.message
    });
  }
};

// Get gym requests for gym owner
export const getGymRequests = async (req, res) => {
  try {
    const gymOwnerId = req.user.id;
    const { status, gymId } = req.query;

    // Find gyms owned by this user
    const gymFilter = { owner: gymOwnerId };
    if (gymId) gymFilter._id = gymId;
    
    const ownedGyms = await Gym.find(gymFilter).select('_id');
    const gymIds = ownedGyms.map(gym => gym._id);

    const filter = { toGym: { $in: gymIds } };
    if (status) filter.status = status;

    const requests = await GymRequest.find(filter)
      .populate('fromInstructor', 'firstName lastName email')
      .populate('toGym', 'gymName gymAddress')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Get instructor applications for additional details
    const requestsWithDetails = await Promise.all(
      requests.map(async (request) => {
        const instructorApplication = await InstructorApplication.findOne({
          applicant: request.fromInstructor._id,
          status: 'approved'
        });

        return {
          ...request.toObject(),
          instructorDetails: instructorApplication ? {
            specialization: instructorApplication.specialization,
            experience: instructorApplication.experience,
            profilePicture: instructorApplication.profilePicture,
            certifications: instructorApplication.certifications,
            isFreelance: instructorApplication.isFreelance,
            motivation: instructorApplication.motivation
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: requestsWithDetails
    });

  } catch (error) {
    console.error('Error fetching gym requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gym requests',
      error: error.message
    });
  }
};

// Get instructor's own gym requests
export const getInstructorGymRequests = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { status } = req.query;

    const filter = { fromInstructor: instructorId };
    if (status) filter.status = status;

    const requests = await GymRequest.find(filter)
      .populate('toGym', 'gymName gymAddress facilities')
      .populate({
        path: 'toGym',
        populate: {
          path: 'owner',
          select: 'firstName lastName email'
        }
      })
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Error fetching instructor gym requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gym requests',
      error: error.message
    });
  }
};

// Approve gym request (gym owner)
export const approveGymRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { responseMessage } = req.body;
    const gymOwnerId = req.user.id;

    const request = await GymRequest.findById(requestId)
      .populate('fromInstructor', 'firstName lastName email')
      .populate('toGym', 'gymName')
      .populate({
        path: 'toGym',
        populate: {
          path: 'owner',
          select: 'firstName lastName email'
        }
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Gym request not found'
      });
    }

    // Verify the gym owner owns this gym
    if (request.toGym.owner._id.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only approve requests for your own gym'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request has already been ${request.status}`
      });
    }

    // Check if request is expired
    if (request.isExpired) {
      return res.status(400).json({
        success: false,
        message: 'This request has expired'
      });
    }

    // Approve the request
    await request.approve(gymOwnerId, responseMessage);

    // Add instructor to gym
    const gym = await Gym.findById(request.toGym._id);
    if (!gym.instructors.includes(request.fromInstructor._id)) {
      gym.instructors.push(request.fromInstructor._id);
      await gym.save();
    }

    // Send notifications
    try {
      // 1. Send approval notification to instructor
      await NotificationService.createNotification({
        recipient: request.fromInstructor._id,
        type: 'gym_request_approved',
        title: 'Gym Request Approved! 🎉',
        message: `Congratulations! Your request to join "${request.toGym.gymName}" has been approved. You are now part of their instructor team and can start managing classes.`,
        data: {
          requestId: request._id,
          gymId: request.toGym._id,
          gymName: request.toGym.gymName,
          gymOwner: `${request.toGym.owner.firstName} ${request.toGym.owner.lastName}`,
          responseMessage: responseMessage
        },
        link: '/instructor/dashboard',
        priority: 'high'
      });

      // 2. Send confirmation notification to gym owner
      await NotificationService.createNotification({
        recipient: gymOwnerId,
        type: 'gym_request_approved',
        title: 'Instructor Request Approved ✅',
        message: `You have successfully approved ${request.fromInstructor.firstName} ${request.fromInstructor.lastName} to join "${request.toGym.gymName}" as an instructor.`,
        data: {
          requestId: request._id,
          instructorId: request.fromInstructor._id,
          instructorName: `${request.fromInstructor.firstName} ${request.fromInstructor.lastName}`,
          gymId: request.toGym._id,
          gymName: request.toGym.gymName
        },
        link: '/gym-owner/instructors',
        priority: 'medium'
      });
    } catch (notificationError) {
      console.error('Error sending approval notifications:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Gym request approved successfully',
      data: request
    });

  } catch (error) {
    console.error('Error approving gym request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve gym request',
      error: error.message
    });
  }
};

// Reject gym request (gym owner)
export const rejectGymRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { responseMessage } = req.body;
    const gymOwnerId = req.user.id;

    const request = await GymRequest.findById(requestId)
      .populate('fromInstructor', 'firstName lastName email')
      .populate('toGym', 'gymName')
      .populate({
        path: 'toGym',
        populate: {
          path: 'owner',
          select: 'firstName lastName email'
        }
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Gym request not found'
      });
    }

    // Verify the gym owner owns this gym
    if (request.toGym.owner._id.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only reject requests for your own gym'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request has already been ${request.status}`
      });
    }

    // Reject the request
    await request.reject(gymOwnerId, responseMessage);

    // Send notifications
    try {
      // 1. Send rejection notification to instructor
      await NotificationService.createNotification({
        recipient: request.fromInstructor._id,
        type: 'gym_request_rejected',
        title: 'Gym Request Update',
        message: `Your request to join "${request.toGym.gymName}" has been reviewed. ${responseMessage || 'The gym owner decided not to proceed at this time.'}`,
        data: {
          requestId: request._id,
          gymId: request.toGym._id,
          gymName: request.toGym.gymName,
          gymOwner: `${request.toGym.owner.firstName} ${request.toGym.owner.lastName}`,
          responseMessage: responseMessage
        },
        link: '/instructor/apply-to-gym',
        priority: 'medium'
      });

      // 2. Send confirmation notification to gym owner
      await NotificationService.createNotification({
        recipient: gymOwnerId,
        type: 'gym_request_rejected',
        title: 'Instructor Request Rejected ❌',
        message: `You have rejected the request from ${request.fromInstructor.firstName} ${request.fromInstructor.lastName} to join "${request.toGym.gymName}".`,
        data: {
          requestId: request._id,
          instructorId: request.fromInstructor._id,
          instructorName: `${request.fromInstructor.firstName} ${request.fromInstructor.lastName}`,
          gymId: request.toGym._id,
          gymName: request.toGym.gymName
        },
        link: '/gym-owner/verify-reject-gym',
        priority: 'low'
      });
    } catch (notificationError) {
      console.error('Error sending rejection notifications:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Gym request rejected',
      data: request
    });

  } catch (error) {
    console.error('Error rejecting gym request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject gym request',
      error: error.message
    });
  }
};

// Cancel gym request (instructor)
export const cancelGymRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const instructorId = req.user.id;

    const request = await GymRequest.findById(requestId)
      .populate('fromInstructor', 'firstName lastName email')
      .populate('toGym', 'gymName')
      .populate({
        path: 'toGym',
        populate: {
          path: 'owner',
          select: 'firstName lastName email'
        }
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Gym request not found'
      });
    }

    // Verify the request is from this instructor
    if (request.fromInstructor._id.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests'
      });
    }

    // Cancel the request
    await request.cancel();

    // Send notification to gym owner
    try {
      await NotificationService.createNotification({
        recipient: request.toGym.owner._id,
        type: 'gym_request_cancelled',
        title: 'Gym Request Cancelled 🚫',
        message: `${request.fromInstructor.firstName} ${request.fromInstructor.lastName} has cancelled their request to join "${request.toGym.gymName}".`,
        data: {
          requestId: request._id,
          instructorId: request.fromInstructor._id,
          instructorName: `${request.fromInstructor.firstName} ${request.fromInstructor.lastName}`,
          gymId: request.toGym._id,
          gymName: request.toGym.gymName
        },
        link: '/gym-owner/verify-reject-gym',
        priority: 'low'
      });
    } catch (notificationError) {
      console.error('Error sending cancellation notification:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling gym request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel request',
      error: error.message
    });
  }
};