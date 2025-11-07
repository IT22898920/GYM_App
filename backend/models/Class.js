import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['Yoga', 'HIIT', 'Strength Training', 'Pilates', 'CrossFit', 'Cardio', 'Other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true // Format: "HH:MM"
  },
  duration: {
    type: Number,
    required: true, // Duration in minutes
    min: 15,
    max: 180
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  enrolledMembers: {
    type: Number,
    default: 0,
    min: 0
  },
  location: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  members: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  }],
  package: {
    type: String,
    enum: ['standard', '20-50', '50+'],
    default: 'standard'
  }
}, {
  timestamps: true
});

// Index for efficient queries
classSchema.index({ instructor: 1, date: 1 });
classSchema.index({ gym: 1 });

// Virtual to check if class is full
classSchema.virtual('isFull').get(function() {
  return this.enrolledMembers >= this.capacity;
});

// Method to add a member to the class
classSchema.methods.addMember = async function(memberId) {
  // Check if class is full
  if (this.isFull) {
    throw new Error('Class is full');
  }

  // Check if member is already enrolled
  const alreadyEnrolled = this.members.some(m => 
    m.member.toString() === memberId.toString()
  );

  if (alreadyEnrolled) {
    throw new Error('Member is already enrolled in this class');
  }

  // Add member
  this.members.push({
    member: memberId,
    enrolledAt: new Date()
  });

  this.enrolledMembers = this.members.length;
  await this.save();

  return this;
};

// Method to remove a member from the class
classSchema.methods.removeMember = async function(memberId) {
  const index = this.members.findIndex(m => 
    m.member.toString() === memberId.toString()
  );

  if (index === -1) {
    throw new Error('Member is not enrolled in this class');
  }

  this.members.splice(index, 1);
  this.enrolledMembers = this.members.length;
  await this.save();

  return this;
};

const Class = mongoose.model('Class', classSchema);

export default Class;

