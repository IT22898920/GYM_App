import CollaborationRequest from '../models/CollaborationRequest.js';
import InstructorApplication from '../models/InstructorApplication.js';
import Gym from '../models/Gym.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Member from '../models/Member.js';
import NotificationService from '../services/notificationService.js';

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

    // Send notification to instructor
    await NotificationService.notifyCollaborationRequest(populatedRequest, 'sent');

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
      .populate('gym', 'gymName description address contactInfo facilities services amenities capacity establishedYear rating status verificationStatus specialPrograms certifications tags pricing memberCount operatingHours logo images')
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
      
      // Add instructor to gym with proper structure
      const gym = await Gym.findById(request.gym);
      const existingInstructor = gym.instructors.find(inst => 
        inst.instructor && inst.instructor.toString() === instructorId
      );
      
      if (!existingInstructor) {
        // Get instructor's application details for specialization
        const instructorApplication = await InstructorApplication.findOne({
          applicant: instructorId,
          status: 'approved'
        });
        
        // Create instructor object with proper structure
        const instructorObject = {
          instructor: instructorId,
          addedAt: new Date(),
          specialization: instructorApplication?.specialization || 'General Fitness',
          startDate: new Date(),
          isActive: true
        };
        
        gym.instructors.push(instructorObject);
        await gym.save();
      }

      // Create chat for the collaboration
      const existingChat = await Chat.findOne({
        collaborationRequest: requestId
      });
      
      if (!existingChat) {
        const chat = new Chat({
          participants: [request.fromGymOwner, instructorId],
          collaborationRequest: requestId,
          gym: request.gym,
          messages: []
        });
        
        await chat.save();
      }
    } else {
      await request.reject(responseMessage);
    }

    // Populate the response
    const updatedRequest = await CollaborationRequest.findById(requestId)
      .populate('fromGymOwner', 'firstName lastName email')
      .populate('toInstructor', 'firstName lastName email')
      .populate('gym', 'gymName');

    // Send notification to gym owner
    await NotificationService.notifyCollaborationRequest(updatedRequest, action === 'accept' ? 'accepted' : 'rejected');

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

    // Populate request for notification
    const populatedRequest = await CollaborationRequest.findById(requestId)
      .populate('fromGymOwner', 'firstName lastName email')
      .populate('toInstructor', 'firstName lastName email')
      .populate('gym', 'gymName');

    // Send notification to instructor
    await NotificationService.notifyCollaborationRequest(populatedRequest, 'cancelled');

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

// Create member-instructor chat collaboration
export const createMemberInstructorChat = async (req, res) => {
  try {
    const { instructorId } = req.body;
    const customerId = req.user.id;

    // Validate request data
    if (!instructorId) {
      return res.status(400).json({
        success: false,
        message: 'Instructor ID is required'
      });
    }

    // Find the member record linked to this customer user
    const member = await Member.findOne({ user: customerId }).populate('assignedInstructor');
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member profile not found. Please register as a member first.'
      });
    }

    if (!member.assignedInstructor || member.assignedInstructor._id.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only chat with your assigned instructor'
      });
    }

    // Check if collaboration request already exists
    let collaborationRequest = await CollaborationRequest.findOne({
      fromMember: customerId,
      toInstructor: instructorId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (!collaborationRequest) {
      // Create new collaboration request
      collaborationRequest = new CollaborationRequest({
        fromMember: customerId,
        toInstructor: instructorId,
        gym: member.gym,
        message: 'Member-Instructor Communication',
        status: 'accepted', // Auto-accept for assigned instructors
        acceptedAt: new Date()
      });

      await collaborationRequest.save();

      // Create chat for the collaboration
      const chat = new Chat({
        participants: [customerId, instructorId],
        collaborationRequest: collaborationRequest._id,
        gym: member.gym,
        messages: []
      });

      await chat.save();
    }

    // Populate the response
    const populatedRequest = await CollaborationRequest.findById(collaborationRequest._id)
      .populate('fromMember', 'firstName lastName email')
      .populate('toInstructor', 'firstName lastName email')
      .populate('gym', 'gymName');

    console.log('Created collaboration request:', populatedRequest);

    res.status(200).json({
      success: true,
      message: 'Member-instructor chat collaboration created successfully',
      data: populatedRequest
    });

  } catch (error) {
    console.error('Error creating member-instructor chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create member-instructor chat',
      error: error.message
    });
  }
};