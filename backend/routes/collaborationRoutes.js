import express from 'express';
import {
  sendCollaborationRequest,
  getGymOwnerRequests,
  getInstructorRequests,
  respondToRequest,
  cancelRequest,
  createMemberInstructorChat
} from '../controllers/collaborationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Gym owner routes
router.post('/send', authorize('gymOwner', 'gym-owner'), sendCollaborationRequest);
router.get('/gym-owner', authorize('gymOwner', 'gym-owner'), getGymOwnerRequests);
router.put('/:requestId/cancel', authorize('gymOwner', 'gym-owner'), cancelRequest);

// Instructor routes
router.get('/instructor', authorize('instructor'), getInstructorRequests);
router.put('/:requestId/respond', authorize('instructor'), respondToRequest);

// Member routes
router.post('/member-instructor', authorize('customer'), createMemberInstructorChat);

export default router;