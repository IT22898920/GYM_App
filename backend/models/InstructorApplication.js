import mongoose from 'mongoose';

const instructorApplicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'Strength Training',
      'Yoga',
      'Cardio',
      'HIIT',
      'Pilates',
      'CrossFit',
      'Dance Fitness',
      'Martial Arts'
    ]
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0,
    max: 50
  },
  availability: [{
    type: String,
    enum: [
      'weekday-morning',
      'weekday-afternoon', 
      'weekday-evening',
      'weekend-morning',
      'weekend-afternoon'
    ]
  }],
  preferredLocation: {
    type: String,
    required: [true, 'Preferred location is required'],
    enum: [
      'Downtown Center',
      'Uptown Studio',
      'West Side Gym',
      'East End Fitness',
      'South Park Location'
    ]
  },
  isFreelance: {
    type: Boolean,
    default: false
  },
  motivation: {
    type: String,
    required: [true, 'Motivation is required'],
    trim: true,
    maxlength: [1000, 'Motivation cannot exceed 1000 characters']
  },
  resume: {
    url: String,
    publicId: String,
    originalName: String,
    size: Number,
    format: String
  },
  profilePicture: {
    url: String,
    publicId: String,
    originalName: String,
    size: Number,
    format: String,
    width: Number,
    height: Number
  },
  certifications: [{
    url: String,
    publicId: String,
    originalName: String,
    size: Number,
    format: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
instructorApplicationSchema.index({ applicant: 1 });
instructorApplicationSchema.index({ status: 1 });
instructorApplicationSchema.index({ email: 1 });
instructorApplicationSchema.index({ createdAt: -1 });

// Virtual for full name
instructorApplicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to approve application
instructorApplicationSchema.methods.approve = function(reviewerId, notes = '') {
  this.status = 'approved';
  this.adminNotes = notes;
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.approvedAt = new Date();
  return this.save();
};

// Method to reject application
instructorApplicationSchema.methods.reject = function(reviewerId, notes = '') {
  this.status = 'rejected';
  this.adminNotes = notes;
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.rejectedAt = new Date();
  return this.save();
};

const InstructorApplication = mongoose.model('InstructorApplication', instructorApplicationSchema);

export default InstructorApplication;