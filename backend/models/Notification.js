import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  type: {
    type: String,
    required: true,
    enum: [
      // Gym related
      'gym_registration_approved',
      'gym_registration_rejected',
      'gym_registration_pending',
      'gym_registration_submitted',
      'new_gym_registration',
      'gym_updated',
      
      // Instructor related
      'instructor_application_submitted',
      'instructor_application_approved',
      'instructor_application_rejected',
      'instructor_application_pending',
      'instructor_added_to_gym',
      'instructor_removed_from_gym',
      'instructor_registration_completed',
      
      // Collaboration related
      'collaboration_request_received',
      'collaboration_request_accepted',
      'collaboration_request_rejected',
      'collaboration_request_cancelled',
      
      // Chat related
      'new_chat_message',
      'incoming_call',
      'call_accepted',
      'call_rejected',
      'call_ended',
      'call_missed',
      
      // Gym request related (instructor to gym)
      'gym_request_sent',
      'gym_request_received',
      'gym_request_approved',
      'gym_request_rejected',
      'gym_request_cancelled',
      
      // Class related
      'class_scheduled',
      'class_cancelled',
      'class_updated',
      'class_booking_confirmed',
      'class_booking_cancelled',
      
      // Workout related
      'workout_gif_uploaded',
      
      // Member related
      'member_joined_gym',
      'member_left_gym',
      'instructor_assigned',
      'member_assigned',
      'membership_expiring',
      'membership_expired',
      
      // Payment related
      'payment_received',
      'payment_failed',
      'subscription_renewed',
      
      // General
      'system_announcement',
      'welcome_message',
      'profile_updated',
      'password_changed',
      'admin_action_completed'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  link: {
    type: String,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Notifications expire after 30 days by default
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 });

// Virtual for checking if notification is expired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
    return this.save();
  }
  return this;
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  
  // Populate sender info
  await notification.populate('sender', 'firstName lastName email');
  
  return notification;
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({
    recipient: userId,
    read: false,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    {
      recipient: userId,
      read: false
    },
    {
      read: true,
      readAt: new Date()
    }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;