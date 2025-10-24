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
  getMemberStats,
  registerCustomerToGym,
  uploadReceipt,
  confirmCustomerPayment,
  searchExistingUsers,
  addExistingUserAsMember,
  getMyProfile,
  getMyWorkoutPlans,
  updateWorkoutStatus,
  addMemberNote,
  deleteMemberNote
} from '../controllers/memberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for customer registration
router.post('/register/:gymId', uploadReceipt, registerCustomerToGym);

// Customer-specific routes (require authentication)
router.get('/my-profile', protect, authorize('customer'), getMyProfile);
router.get('/my-workout-plans', protect, authorize('customer'), getMyWorkoutPlans);
router.patch('/update-workout-status', protect, authorize('customer'), updateWorkoutStatus);
router.post('/add-member-note', protect, authorize('customer'), addMemberNote);
router.delete('/delete-member-note', protect, authorize('customer'), deleteMemberNote);

// All routes below require authentication and gym owner authorization
router.use(protect);
router.use(authorize('gymOwner'));

// Member statistics
router.get('/stats', getMemberStats);

// Get gym's membership plans
router.get('/membership-plans', getGymMembershipPlans);

// Search existing users
router.get('/search-users', searchExistingUsers);

// CRUD operations
router.post('/', addMember);
router.post('/add-existing', addExistingUserAsMember);
router.get('/', getMembers);
router.get('/:memberId', getMember);
router.put('/:memberId', updateMember);
router.delete('/:memberId', deleteMember);

// Member specific operations
router.put('/:memberId/assign-instructor', assignInstructor);
router.patch('/:memberId/status', updateMemberStatus);
router.patch('/:memberId/confirm-payment', confirmCustomerPayment);

export default router;