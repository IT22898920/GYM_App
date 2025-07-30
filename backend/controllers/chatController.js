import Chat from '../models/Chat.js';
import CollaborationRequest from '../models/CollaborationRequest.js';
import NotificationService from '../services/notificationService.js';

// Get all chats for the current user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'firstName lastName email role')
    .populate('gym', 'gymName')
    .populate('lastMessage.sender', 'firstName lastName')
    .sort({ updatedAt: -1 });
    
    // Add unread count for each chat
    const chatsWithUnread = chats.map(chat => {
      const chatObj = chat.toObject();
      chatObj.unreadCount = chat.getUnreadCount(userId);
      return chatObj;
    });
    
    res.status(200).json({
      success: true,
      data: chatsWithUnread
    });
    
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

// Get or create chat for a collaboration
export const getOrCreateChat = async (req, res) => {
  try {
    const { collaborationId } = req.params;
    const userId = req.user.id;
    
    // Verify collaboration exists and is accepted
    const collaboration = await CollaborationRequest.findById(collaborationId)
      .populate('fromGymOwner', 'firstName lastName')
      .populate('toInstructor', 'firstName lastName')
      .populate('gym', 'gymName');
      
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }
    
    if (collaboration.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Chat is only available for accepted collaborations'
      });
    }
    
    // Verify user is part of the collaboration
    const isGymOwner = collaboration.fromGymOwner._id.toString() === userId;
    const isInstructor = collaboration.toInstructor._id.toString() === userId;
    
    if (!isGymOwner && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this chat'
      });
    }
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      collaborationRequest: collaborationId
    }).populate('participants', 'firstName lastName email role')
      .populate('gym', 'gymName')
      .populate('messages.sender', 'firstName lastName');
    
    // Create new chat if doesn't exist
    if (!chat) {
      chat = new Chat({
        participants: [collaboration.fromGymOwner._id, collaboration.toInstructor._id],
        collaborationRequest: collaborationId,
        gym: collaboration.gym._id,
        messages: []
      });
      
      await chat.save();
      
      // Populate the new chat
      chat = await Chat.findById(chat._id)
        .populate('participants', 'firstName lastName email role')
        .populate('gym', 'gymName')
        .populate('messages.sender', 'firstName lastName');
    }
    
    // Mark messages as read
    await chat.markAsRead(userId);
    
    res.status(200).json({
      success: true,
      data: chat
    });
    
  } catch (error) {
    console.error('Error getting/creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat',
      error: error.message
    });
  }
};

// Send a message in a chat
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;
    
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }
    
    // Find the chat
    const chat = await Chat.findById(chatId)
      .populate('participants', 'firstName lastName');
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Verify sender is a participant
    const isParticipant = chat.participants.some(p => 
      p._id.toString() === senderId
    );
    
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to send messages in this chat'
      });
    }
    
    // Add the message
    await chat.addMessage(senderId, content);
    
    // Get the updated chat with populated data
    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'firstName lastName email role')
      .populate('gym', 'gymName')
      .populate('messages.sender', 'firstName lastName');
    
    // Send notification to the other participant
    const recipient = chat.participants.find(p => 
      p._id.toString() !== senderId
    );
    
    if (recipient) {
      const sender = chat.participants.find(p => 
        p._id.toString() === senderId
      );
      
      await NotificationService.createNotification({
        recipient: recipient._id,
        sender: senderId,
        type: 'new_chat_message',
        title: 'New Message 💬',
        message: `${sender.firstName} ${sender.lastName} sent you a message`,
        data: {
          chatId: chat._id,
          messagePreview: content.substring(0, 50) + (content.length > 50 ? '...' : '')
        },
        link: `/chat/${chat._id}`,
        priority: 'medium'
      });
    }
    
    // Return the last message
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    
    res.status(201).json({
      success: true,
      data: lastMessage
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Verify user is a participant
    const isParticipant = chat.participants.some(p => 
      p._id.toString() === userId
    );
    
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this chat'
      });
    }
    
    await chat.markAsRead(userId);
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
    
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({
      participants: userId,
      isActive: true
    });
    
    let totalUnread = 0;
    chats.forEach(chat => {
      totalUnread += chat.getUnreadCount(userId);
    });
    
    res.status(200).json({
      success: true,
      data: { unreadCount: totalUnread }
    });
    
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};