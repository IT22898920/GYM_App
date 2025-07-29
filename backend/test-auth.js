import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { protect, authorize } from './middleware/auth.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Test route that should work for instructors
app.get('/test-instructor', protect, authorize(['instructor']), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted!',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Test route that should work for gym owners
app.get('/test-gym-owner', protect, authorize(['gymOwner']), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted!',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log('- GET /test-instructor (requires instructor role)');
  console.log('- GET /test-gym-owner (requires gymOwner role)');
});

export default app;