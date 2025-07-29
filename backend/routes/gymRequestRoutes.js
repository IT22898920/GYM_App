import express from 'express';
import {
  sendGymRequest,
  getGymRequests,
  getInstructorGymRequests,
  approveGymRequest,
  rejectGymRequest,
  cancelGymRequest
} from '../controllers/gymRequestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Instructor routes
router.post('/send', authorize('instructor'), sendGymRequest);
router.get('/my-requests', authorize('instructor'), getInstructorGymRequests);
router.put('/cancel/:requestId', authorize('instructor'), cancelGymRequest);

// Gym owner routes  
router.get('/', authorize('gymOwner'), getGymRequests);
router.put('/approve/:requestId', authorize('gymOwner'), approveGymRequest);
router.put('/reject/:requestId', authorize('gymOwner'), rejectGymRequest);

export default router;