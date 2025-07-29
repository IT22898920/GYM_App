import express from 'express';
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  getMyApplications,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getApplicationStats,
  getVerifiedInstructors,
  toggleInstructorStatus,
  getInstructorById,
  getFreelanceInstructors
} from '../controllers/instructorController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { uploadInstructorFiles, uploadInstructorFilesToCloudinary, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Freelance instructors route - MUST be first to avoid conflicts
router.get('/freelance', authorize('gymOwner', 'gym-owner', 'admin'), getFreelanceInstructors);

// Instructor application routes
router.post(
  '/apply',
  uploadInstructorFiles,
  uploadInstructorFilesToCloudinary,
  handleUploadError,
  submitApplication
);

// All specific routes MUST come before parameterized routes
router.get('/my-applications', getMyApplications);

// Admin only routes - specific paths
router.get('/', authorize('admin'), getAllApplications);
router.get('/admin/stats', authorize('admin'), getApplicationStats);
router.get('/admin/verified', authorize('admin'), getVerifiedInstructors);
router.get('/admin/instructor/:id', authorize('admin'), getInstructorById);
router.put('/admin/instructor/:id/toggle-status', authorize('admin'), toggleInstructorStatus);

// PARAMETERIZED ROUTES - These MUST come LAST
router.get('/:id', getApplicationById);
router.put('/:id/approve', authorize('admin'), approveApplication);
router.put('/:id/reject', authorize('admin'), rejectApplication);
router.delete('/:id', authorize('admin'), deleteApplication);

export default router;