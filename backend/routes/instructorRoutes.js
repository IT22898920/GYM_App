import express from 'express';
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  getMyApplications,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getApplicationStats
} from '../controllers/instructorController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { uploadInstructorFiles, uploadInstructorFilesToCloudinary, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Instructor application routes
router.post(
  '/apply',
  uploadInstructorFiles,
  uploadInstructorFilesToCloudinary,
  handleUploadError,
  submitApplication
);

router.get('/my-applications', getMyApplications);
router.get('/:id', getApplicationById);

// Admin only routes
router.get('/', authorize('admin'), getAllApplications);
router.get('/admin/stats', authorize('admin'), getApplicationStats);
router.put('/:id/approve', authorize('admin'), approveApplication);
router.put('/:id/reject', authorize('admin'), rejectApplication);
router.delete('/:id', authorize('admin'), deleteApplication);

export default router;