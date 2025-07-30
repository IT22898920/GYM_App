import Call from '../models/Call.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import NotificationService from '../services/notificationService.js';
import { v4 as uuidv4 } from 'uuid';

// Initiate a call
export const initiateCall = async (req, res) => {
  try {
    const { chatId, callType } = req.body;
    const callerId = req.user.id;

    // Validate call type
    if (!['voice', 'video'].includes(callType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid call type'
      });
    }

    // Find the chat
    const chat = await Chat.findById(chatId).populate('participants', 'firstName lastName');
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify caller is part of the chat
    const isParticipant = chat.participants.some(p => p._id.toString() === callerId);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to call in this chat'
      });
    }

    // Find the recipient (other participant)
    const recipient = chat.participants.find(p => p._id.toString() !== callerId);
    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if there's already an active call
    const activeCall = await Call.findOne({
      $or: [
        { caller: callerId, status: { $in: ['initiated', 'ringing', 'accepted'] } },
        { recipient: callerId, status: { $in: ['initiated', 'ringing', 'accepted'] } },
        { caller: recipient._id, status: { $in: ['initiated', 'ringing', 'accepted'] } },
        { recipient: recipient._id, status: { $in: ['initiated', 'ringing', 'accepted'] } }
      ]
    });

    if (activeCall) {
      return res.status(400).json({
        success: false,
        message: 'There is already an active call'
      });
    }

    // Create new call
    const callId = uuidv4();
    const call = new Call({
      caller: callerId,
      recipient: recipient._id,
      chat: chatId,
      callType,
      callId,
      status: 'ringing'
    });

    await call.save();
    console.log(`📞 Call created - ID: ${call._id}, Status: ${call.status}, CallID: ${callId}`);

    // Populate the call for response
    const populatedCall = await Call.findById(call._id)
      .populate('caller', 'firstName lastName')
      .populate('recipient', 'firstName lastName');

    // Send notification to recipient
    await NotificationService.createNotification({
      recipient: recipient._id,
      sender: callerId,
      type: 'incoming_call',
      title: `Incoming ${callType} call 📞`,
      message: `${req.user.firstName} ${req.user.lastName} is calling you`,
      data: {
        callId: call._id,
        callType,
        chatId
      },
      priority: 'high'
    });

    // TODO: Send real-time notification via Socket.io
    // io.to(recipient._id.toString()).emit('incoming_call', populatedCall);

    res.status(201).json({
      success: true,
      message: 'Call initiated successfully',
      data: populatedCall
    });

  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate call',
      error: error.message
    });
  }
};

// Accept a call
export const acceptCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    console.log(`🔍 Accept call attempt - CallID: ${callId}, UserID: ${userId}`);

    const call = await Call.findById(callId);
    if (!call) {
      console.log(`❌ Call not found - CallID: ${callId}`);
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    console.log(`📞 Call found - Status: ${call.status}, Caller: ${call.caller}, Recipient: ${call.recipient}`);

    // Verify user is the recipient
    if (call.recipient.toString() !== userId) {
      console.log(`❌ Authorization failed - Expected recipient: ${call.recipient}, Actual user: ${userId}`);
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this call'
      });
    }

    // Check if call is still ringing
    if (call.status !== 'ringing') {
      console.log(`❌ Call status invalid - Expected: 'ringing', Actual: '${call.status}'`);
      return res.status(400).json({
        success: false,
        message: 'Call is no longer available',
        debug: {
          currentStatus: call.status,
          callId: callId,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Accept the call
    await call.acceptCall();

    // Populate the call
    const populatedCall = await Call.findById(callId)
      .populate('caller', 'firstName lastName')
      .populate('recipient', 'firstName lastName');

    // TODO: Notify caller via Socket.io
    // io.to(call.caller.toString()).emit('call_accepted', populatedCall);

    res.status(200).json({
      success: true,
      message: 'Call accepted successfully',
      data: populatedCall
    });

  } catch (error) {
    console.error('Error accepting call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept call',
      error: error.message
    });
  }
};

// Reject a call
export const rejectCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Verify user is the recipient
    if (call.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this call'
      });
    }

    // Reject the call
    await call.rejectCall();

    // TODO: Notify caller via Socket.io
    // io.to(call.caller.toString()).emit('call_rejected', { callId });

    res.status(200).json({
      success: true,
      message: 'Call rejected successfully'
    });

  } catch (error) {
    console.error('Error rejecting call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject call',
      error: error.message
    });
  }
};

// End a call
export const endCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Verify user is part of the call
    const isParticipant = call.caller.toString() === userId || call.recipient.toString() === userId;
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to end this call'
      });
    }

    // End the call
    await call.endCall();

    // Get the other participant
    const otherUserId = call.caller.toString() === userId ? call.recipient : call.caller;

    // TODO: Notify other participant via Socket.io
    // io.to(otherUserId.toString()).emit('call_ended', { callId });

    res.status(200).json({
      success: true,
      message: 'Call ended successfully',
      data: {
        duration: call.duration
      }
    });

  } catch (error) {
    console.error('Error ending call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end call',
      error: error.message
    });
  }
};

// Get call history
export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const calls = await Call.find({
      $or: [
        { caller: userId },
        { recipient: userId }
      ]
    })
    .populate('caller', 'firstName lastName')
    .populate('recipient', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const totalCalls = await Call.countDocuments({
      $or: [
        { caller: userId },
        { recipient: userId }
      ]
    });

    res.status(200).json({
      success: true,
      data: calls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCalls / limit),
        totalCalls,
        hasNextPage: page * limit < totalCalls,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching call history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch call history',
      error: error.message
    });
  }
};

// Delete a call from history
export const deleteCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    // Find the call
    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Verify user is part of the call
    const isParticipant = call.caller.toString() === userId || call.recipient.toString() === userId;
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this call'
      });
    }

    // Delete the call
    await Call.findByIdAndDelete(callId);

    res.status(200).json({
      success: true,
      message: 'Call deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete call',
      error: error.message
    });
  }
};