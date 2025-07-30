import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  callType: {
    type: String,
    enum: ['voice', 'video'],
    required: true
  },
  status: {
    type: String,
    enum: ['initiated', 'ringing', 'accepted', 'rejected', 'ended', 'missed'],
    default: 'initiated'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  callId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Calculate duration when call ends
callSchema.methods.endCall = function() {
  this.endTime = new Date();
  this.duration = Math.round((this.endTime - this.startTime) / 1000);
  this.status = 'ended';
  return this.save();
};

// Mark call as accepted
callSchema.methods.acceptCall = function() {
  this.status = 'accepted';
  return this.save();
};

// Mark call as rejected
callSchema.methods.rejectCall = function() {
  this.status = 'rejected';
  this.endTime = new Date();
  return this.save();
};

// Mark call as missed
callSchema.methods.missCall = function() {
  this.status = 'missed';
  this.endTime = new Date();
  return this.save();
};

const Call = mongoose.model('Call', callSchema);

export default Call;