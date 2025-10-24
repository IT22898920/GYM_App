import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  planName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Strength Training', 'Weight Loss', 'Muscle Gain', 'Cardio', 'Flexibility', 'HIIT', 'Recovery']
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'inactive'],
    default: 'active'
  },
  schedule: [{
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    exercises: [{
      name: {
        type: String,
        required: true
      },
      sets: {
        type: String
      },
      reps: {
        type: String
      },
      weight: {
        type: String
      },
      duration: {
        type: String
      },
      notes: {
        type: String
      },
      workoutStatus: {
        type: Number,
        default: 0,
        enum: [0, 1] // 0 = not completed, 1 = completed
      },
      memberNotes: [{
        note: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
    }],
    meals: [{
      type: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Pre-Workout', 'Post-Workout']
      },
      time: {
        type: String
      },
      items: [{
        type: String
      }],
      calories: {
        type: String
      },
      protein: {
        type: String
      },
      carbs: {
        type: String
      },
      fats: {
        type: String
      },
      notes: {
        type: String
      }
    }],
    supplements: [{
      name: {
        type: String,
        required: true
      },
      dosage: {
        type: String
      },
      timing: {
        type: String
      },
      notes: {
        type: String
      }
    }]
  }]
}, {
  timestamps: true
});

// Index for instructor and student queries
workoutPlanSchema.index({ instructor: 1, student: 1 });

const MemberWorkoutPlan = mongoose.model('MemberWorkoutPlan', workoutPlanSchema);

export default MemberWorkoutPlan;
