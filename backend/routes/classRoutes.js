import express from 'express';
import {
  createClass,
  getInstructorClasses,
  getClassById,
  updateClass,
  deleteClass,
  addMemberToClass,
  removeMemberFromClass,
  getClassEligibleMembers
} from '../controllers/classController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication first, then instructor role
router.use(protect);
router.use(authorize('instructor'));

// Create a new class
router.post('/', createClass);

// Get all classes for instructor
router.get('/', getInstructorClasses);

// Get eligible members for class enrollment
router.get('/eligible-members', getClassEligibleMembers);

// Get class by ID
router.get('/:id', getClassById);

// Update class
router.put('/:id', updateClass);

// Delete class
router.delete('/:id', deleteClass);

// Add member to class
router.post('/:id/members', addMemberToClass);

// Remove member from class
router.delete('/:id/members/:memberId', removeMemberFromClass);

export default router;

