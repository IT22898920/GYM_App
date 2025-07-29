import CollaborationRequest from '../models/CollaborationRequest.js';
import InstructorApplication from '../models/InstructorApplication.js';
import Gym from '../models/Gym.js';
import User from '../models/User.js';

// Send collaboration request to instructor
export const sendCollaborationRequest = async (req, res) => {
  try {
    const { instructorId, message, gymId } = req.body;
    const gymOwnerId = req.user.id;

    // Validate request data
    if (!instructorId || !message || !gymId) {
      return res.status(400).json({
        success: false,
        message: 'Instructor ID, message, and gym ID are required'
      });
    }

    // Verify the gym owner owns the gym
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    if (gym.owner.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only send requests for your own gym'
      });
    }

    // Verify the instructor exists and is a freelance instructor
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    // Check if instructor is freelance
    const instructorApplication = await InstructorApplication.findOne({
      applicant: instructorId,
      status: 'approved',
      isFreelance: true
    });

    if (!instructorApplication) {
      return res.status(400).json({
        success: false,
        message: 'This instructor is not available for freelance work'
      });
    }

    // Check if there's already a pending request
    const existingRequest = await CollaborationRequest.findOne({
      fromGymOwner: gymOwnerId,
      toInstructor: instructorId,
      gym: gymId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request to this instructor for this gym'
      });
    }

    // Create the collaboration request
    const collaborationRequest = new CollaborationRequest({
      fromGymOwner: gymOwnerId,
      toInstructor: instructorId,
      gym: gymId,
      message
    });

    await collaborationRequest.save();

    // Populate the response
    const populatedRequest = await CollaborationRequest.findById(collaborationRequest._id)
      .populate('fromGymOwner', 'firstName lastName email')
      .populate('toInstructor', 'firstName lastName email')
      .populate('gym', 'gymName gymAddress');

    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully',
      data: populatedRequest
    });

  } catch (error) {
    console.error('Error sending collaboration request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send collaboration request',
      error: error.message
    });
  }
};

// Get collaboration requests for gym owner
export const getGymOwnerRequests = async (req, res) => {
  try {
    const gymOwnerId = req.user.id;
    const { status, gymId } = req.query;

    const filter = { fromGymOwner: gymOwnerId };
    if (status) filter.status = status;
    if (gymId) filter.gym = gymId;

    const requests = await CollaborationRequest.find(filter)
      .populate('toInstructor', 'firstName lastName email')
      .populate('gym', 'gymName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Error fetching gym owner requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collaboration requests',
      error: error.message
    });
  }
};

// Get collaboration requests for instructor
export const getInstructorRequests = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { status } = req.query;

    const filter = { toInstructor: instructorId };
    if (status) filter.status = status;

    const requests = await CollaborationRequest.find(filter)
      .populate('fromGymOwner', 'firstName lastName email')
      .populate('gym', 'gymName gymAddress facilities')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Error fetching instructor requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collaboration requests',
      error: error.message
    });
  }
};

// Respond to collaboration request (for instructors)
export const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, responseMessage } = req.body;
    const instructorId = req.user.id;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be either accept or reject'
      });
    }

    const request = await CollaborationRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found'
      });
    }

    // Verify the request is for this instructor
    if (request.toInstructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to your own requests'
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

    // Update request status
    if (action === 'accept') {
      await request.accept(responseMessage);
      
      // Add instructor to gym
      const gym = await Gym.findById(request.gym);
      if (!gym.instructors.includes(instructorId)) {
        gym.instructors.push(instructorId);
        await gym.save();
      }
    } else {
      await request.reject(responseMessage);
    }

    // Populate the response
    const updatedRequest = await CollaborationRequest.findById(requestId)
      .populate('fromGymOwner', 'firstName lastName email')
      .populate('toInstructor', 'firstName lastName email')
      .populate('gym', 'gymName');

    res.status(200).json({
      success: true,
      message: `Request ${action}ed successfully`,
      data: updatedRequest
    });

  } catch (error) {
    console.error('Error responding to request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to request',
      error: error.message
    });
  }
};

// Cancel collaboration request (for gym owners)
export const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const gymOwnerId = req.user.id;

    const request = await CollaborationRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found'
      });
    }

    // Verify the request is from this gym owner
    if (request.fromGymOwner.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests'
      });
    }

    // Cancel the request
    await request.cancel();

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel request',
      error: error.message
    });
  }
};