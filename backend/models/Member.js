import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const memberSchema = new mongoose.Schema({
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    required: true
  },
  lastVisit: {
    type: Date
  },
  membershipPlan: {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    features: [{
      type: String
    }],
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    }
  },
  bodyMeasurements: {
    height: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    bmi: {
      type: Number
    },
    bodyFat: {
      type: Number
    },
    waist: {
      type: Number,
      required: true
    },
    hips: {
      type: Number
    },
    biceps: {
      type: Number
    },
    thighs: {
      type: Number
    }
  },
  fitnessGoals: [{
    type: String
  }],
  assignedInstructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendance: {
    type: Number,
    default: 0
  },
  classesAttended: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['card', 'manual'],
      required: true
    },
    lastPaymentDate: {
      type: Date,
      default: Date.now
    },
    nextPaymentDate: {
      type: Date
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      required: true
    },
    receiptPath: {
      type: String,
      default: null
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalInfo: {
    conditions: [String],
    medications: [String],
    allergies: [String],
    notes: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate next payment date based on membership plan
memberSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('membershipPlan')) {
    // Set end date to 30 days from start date for monthly plans
    const startDate = this.membershipPlan.startDate || new Date();
    this.membershipPlan.endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Set next payment date
    this.paymentDetails.nextPaymentDate = this.membershipPlan.endDate;
  }
  
  // Calculate BMI if height and weight are provided
  if (this.bodyMeasurements.height && this.bodyMeasurements.weight) {
    const heightInMeters = this.bodyMeasurements.height / 100;
    this.bodyMeasurements.bmi = parseFloat((this.bodyMeasurements.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  
  next();
});

// Create index for gym and email combination
memberSchema.index({ gym: 1, email: 1 }, { unique: true });

// Virtual for age
memberSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Method to check if membership is active
memberSchema.methods.isMembershipActive = function() {
  if (this.status !== 'active') return false;
  if (!this.membershipPlan.endDate) return true;
  return new Date() < new Date(this.membershipPlan.endDate);
};

// Method to update attendance
memberSchema.methods.updateAttendance = async function() {
  this.lastVisit = new Date();
  this.classesAttended += 1;
  
  // Calculate attendance percentage (assuming daily visits expected)
  const daysSinceJoined = Math.ceil((new Date() - this.joinDate) / (1000 * 60 * 60 * 24));
  this.attendance = Math.min(100, Math.round((this.classesAttended / daysSinceJoined) * 100));
  
  await this.save();
};

// Method to update progress
memberSchema.methods.updateProgress = async function(newProgress) {
  this.progress = Math.min(100, Math.max(0, newProgress));
  await this.save();
};

const Member = mongoose.model('Member', memberSchema);

export default Member;