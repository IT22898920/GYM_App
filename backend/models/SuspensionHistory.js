import mongoose from 'mongoose';

const suspensionHistorySchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['gym', 'instructor'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityTypeRef'
  },
  entityTypeRef: {
    type: String,
    enum: ['Gym', 'User']
  },
  action: {
    type: String,
    enum: ['suspended', 'unsuspended'],
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  suspensionType: {
    type: String,
    enum: ['global', 'gym-specific'],
    default: 'global'
  },
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym'
  },
  suspendedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  suspendedAt: {
    type: Date,
    default: Date.now
  },
  unsuspendDate: {
    type: Date
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
suspensionHistorySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
suspensionHistorySchema.index({ suspendedBy: 1 });
suspensionHistorySchema.index({ action: 1, createdAt: -1 });

const SuspensionHistory = mongoose.model('SuspensionHistory', suspensionHistorySchema);

export default SuspensionHistory;

