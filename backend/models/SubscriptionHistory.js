import mongoose from 'mongoose';

const subscriptionHistorySchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  action: {
    type: String,
    enum: ['created', 'updated', 'extended', 'cancelled', 'expired'],
    required: true
  },
  previousPlan: {
    name: String,
    price: Number,
    startDate: Date,
    endDate: Date,
    features: [String]
  },
  newPlan: {
    name: String,
    price: Number,
    startDate: Date,
    endDate: Date,
    features: [String]
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionHistorySchema.index({ member: 1, createdAt: -1 });
subscriptionHistorySchema.index({ performedBy: 1 });

const SubscriptionHistory = mongoose.model('SubscriptionHistory', subscriptionHistorySchema);

export default SubscriptionHistory;

