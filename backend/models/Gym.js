import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  gymName: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true,
    maxlength: [100, 'Gym name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Gym description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Gym owner is required']
  },
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'Sri Lanka'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Location coordinates are required'],
      validate: {
        validator: function(val) {
          return val.length === 2;
        },
        message: 'Coordinates must be an array of [longitude, latitude]'
      }
    }
  },
  facilities: [{
    type: String,
    trim: true
  }],
  equipment: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  }],
  services: [{
    type: String,
    trim: true
  }],
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  pricing: {
    membershipPlans: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      duration: {
        type: String,
        required: true,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      benefits: [String]
    }],
    dropInFee: {
      type: Number,
      min: 0
    }
  },
  logo: {
    url: String,
    publicId: String, // Cloudinary public ID for deletion
    originalName: String,
    size: Number,
    format: String,
    width: Number,
    height: Number
  },
  images: [{
    url: String,
    publicId: String, // Cloudinary public ID for deletion
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    originalName: String,
    size: Number,
    format: String,
    width: Number,
    height: Number
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  specialPrograms: [{
    name: String,
    description: String,
    price: Number,
    duration: String
  }],
  capacity: {
    type: Number,
    required: [true, 'Gym capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  establishedYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date
  }],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  bankAccount: {
    accountHolderName: {
      type: String,
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true
    },
    bankName: {
      type: String,
      trim: true
    },
    branchName: {
      type: String,
      trim: true
    },
    swiftCode: {
      type: String,
      trim: true
    },
    iban: {
      type: String,
      trim: true
    },
    currency: {
      type: String,
      default: 'LKR',
      trim: true
    },
    accountType: {
      type: String,
      enum: ['savings', 'current', 'business'],
      default: 'business'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  instructors: [{
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    specialization: String,
    salary: {
      type: Number,
      min: 0
    },
    startDate: {
      type: Date
    },
    description: String,
    resume: {
      url: String,
      publicId: String,
      originalName: String,
      size: Number,
      format: String
    },
    certifications: [{
      url: String,
      publicId: String,
      originalName: String,
      size: Number,
      format: String
    }],
    schedule: [{
      day: String,
      startTime: String,
      endTime: String,
      className: String
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
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

// Create geospatial index for location-based queries
gymSchema.index({ location: '2dsphere' });

// Index for text search
gymSchema.index({
  gymName: 'text',
  description: 'text',
  'address.city': 'text',
  'address.state': 'text',
  facilities: 'text',
  services: 'text',
  tags: 'text'
});

// Virtual for full address
gymSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Pre-save middleware to update updatedAt
gymSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate distance from a point
gymSchema.methods.calculateDistance = function(userCoordinates) {
  const gymCoords = this.location.coordinates;
  const [gymLng, gymLat] = gymCoords;
  const [userLng, userLat] = userCoordinates;
  
  // Haversine formula for distance calculation
  const R = 6371; // Earth's radius in kilometers
  const dLat = (userLat - gymLat) * Math.PI / 180;
  const dLng = (userLng - gymLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(gymLat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance; // Distance in kilometers
};

const Gym = mongoose.model('Gym', gymSchema);

export default Gym;