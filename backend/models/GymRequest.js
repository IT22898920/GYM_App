import mongoose from 'mongoose';

const gymRequestSchema = new mongoose.Schema({
  fromInstructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toGym: {
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
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  responseMessage: {
    type: String,
    trim: true,
    maxLength: 500
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: {
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
gymRequestSchema.index({ fromInstructor: 1, status: 1 });
gymRequestSchema.index({ toGym: 1, status: 1 });
gymRequestSchema.index({ expiresAt: 1 });

// Virtual for checking if request is expired
gymRequestSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Method to approve request
gymRequestSchema.methods.approve = async function(gymOwnerId, responseMessage) {
  this.status = 'approved';
  this.responseMessage = responseMessage;
  this.reviewedBy = gymOwnerId;
  this.respondedAt = new Date();
  return this.save();
};

// Method to reject request
gymRequestSchema.methods.reject = async function(gymOwnerId, responseMessage) {
  this.status = 'rejected';
  this.responseMessage = responseMessage;
  this.reviewedBy = gymOwnerId;
  this.respondedAt = new Date();
  return this.save();
};

// Method to cancel request
gymRequestSchema.methods.cancel = async function() {
  if (this.status !== 'pending') {
    throw new Error('Can only cancel pending requests');
  }
  this.status = 'cancelled';
  return this.save();
};

const GymRequest = mongoose.model('GymRequest', gymRequestSchema);

export default GymRequest;