import mongoose from 'mongoose';

const collaborationRequestSchema = new mongoose.Schema({
  fromGymOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fromMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toInstructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  responseMessage: {
    type: String,
    trim: true,
    maxLength: 500
  },
  respondedAt: {
    type: Date
  },
  acceptedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Request expires after 30 days
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
collaborationRequestSchema.index({ fromGymOwner: 1, status: 1 });
collaborationRequestSchema.index({ fromMember: 1, status: 1 });
collaborationRequestSchema.index({ toInstructor: 1, status: 1 });
collaborationRequestSchema.index({ gym: 1 });
collaborationRequestSchema.index({ expiresAt: 1 });

// Virtual for checking if request is expired
collaborationRequestSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Method to accept request
collaborationRequestSchema.methods.accept = async function(responseMessage) {
  this.status = 'accepted';
  this.responseMessage = responseMessage;
  this.respondedAt = new Date();
  return this.save();
};

// Method to reject request
collaborationRequestSchema.methods.reject = async function(responseMessage) {
  this.status = 'rejected';
  this.responseMessage = responseMessage;
  this.respondedAt = new Date();
  return this.save();
};

// Method to cancel request
collaborationRequestSchema.methods.cancel = async function() {
  if (this.status !== 'pending') {
    throw new Error('Can only cancel pending requests');
  }
  this.status = 'cancelled';
  return this.save();
};

const CollaborationRequest = mongoose.model('CollaborationRequest', collaborationRequestSchema);

export default CollaborationRequest;