import express from 'express';
import {
  getGymMembershipPlans,
  addMember,
  getMembers,
  getMember,
  updateMember,
  assignInstructor,
  deleteMember,
  updateMemberStatus,
  getMemberStats
} from '../controllers/memberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and gym owner authorization
router.use(protect);
router.use(authorize('gymOwner'));

// Member statistics
router.get('/stats', getMemberStats);

// Get gym's membership plans
router.get('/membership-plans', getGymMembershipPlans);

// CRUD operations
router.post('/', addMember);
router.get('/', getMembers);
router.get('/:memberId', getMember);
router.put('/:memberId', updateMember);
router.delete('/:memberId', deleteMember);

// Member specific operations
router.put('/:memberId/assign-instructor', assignInstructor);
router.patch('/:memberId/status', updateMemberStatus);

export default router;