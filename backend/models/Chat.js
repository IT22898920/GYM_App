import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  collaborationRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollaborationRequest',
    required: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  messages: [messageSchema],
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastMessage when a new message is added
chatSchema.methods.addMessage = async function(senderId, content) {
  const message = {
    sender: senderId,
    content,
    readBy: [{ user: senderId, readAt: new Date() }]
  };
  
  this.messages.push(message);
  this.lastMessage = {
    content,
    sender: senderId,
    createdAt: new Date()
  };
  this.updatedAt = new Date();
  
  return this.save();
};

// Mark messages as read
chatSchema.methods.markAsRead = async function(userId) {
  let updated = false;
  
  this.messages.forEach(message => {
    const alreadyRead = message.readBy.some(read => 
      read.user.toString() === userId.toString()
    );
    
    if (!alreadyRead && message.sender.toString() !== userId.toString()) {
      message.readBy.push({ user: userId, readAt: new Date() });
      updated = true;
    }
  });
  
  if (updated) {
    return this.save();
  }
  return this;
};

// Get unread count for a user
chatSchema.methods.getUnreadCount = function(userId) {
  return this.messages.filter(message => {
    const isRead = message.readBy.some(read => 
      read.user.toString() === userId.toString()
    );
    return !isRead && message.sender.toString() !== userId.toString();
  }).length;
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;