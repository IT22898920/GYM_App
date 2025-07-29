import express from 'express';
import {
  registerGym,
  getAllGyms,
  getGymById,
  updateGym,
  deleteGym,
  getGymsByOwner,
  approveGym,
  rejectGym,
  searchNearbyGyms,
  uploadImages,
  uploadGymLogo,
  deleteGymImage,
  getGymStats,
  getGymDashboard,
  addInstructorToGym,
  removeInstructorFromGym,
  getGymInstructors,
  searchAvailableInstructors,
  registerGymInstructor
} from '../controllers/gymController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateGymRegistration, validateGymUpdate } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { uploadGymImages, uploadGymImagesToCloudinary, uploadLogo, uploadGymLogoToCloudinary, handleUploadError, uploadInstructorFiles, uploadInstructorFilesToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// Apply optional authentication to getAllGyms to check user role
router.get('/', optionalAuth, getAllGyms);

// Public routes
router.get('/search/nearby', searchNearbyGyms);
router.get('/:id', getGymById);

// Protected routes - require authentication
router.use(protect);

// Gym registration - allow customers to register their gym
router.post('/register', authorize('customer', 'gymOwner', 'admin'), validateGymRegistration, handleValidationErrors, registerGym);
router.post('/register-instructor', authorize('gymOwner', 'admin'), uploadInstructorFiles, uploadInstructorFilesToCloudinary, registerGymInstructor);
router.get('/owner/gyms', authorize('customer', 'gymOwner', 'admin'), getGymsByOwner);
router.get('/owner/dashboard', authorize('gymOwner', 'admin'), getGymDashboard);
router.put('/:id', authorize('gymOwner', 'admin'), validateGymUpdate, handleValidationErrors, updateGym);
router.post('/:id/upload-images', authorize('customer', 'gymOwner', 'admin'), uploadGymImages, uploadGymImagesToCloudinary, uploadImages);
router.post('/:id/upload-logo', authorize('customer', 'gymOwner', 'admin'), uploadLogo, uploadGymLogoToCloudinary, uploadGymLogo);
router.delete('/:id/images/:imageId', authorize('gymOwner', 'admin'), deleteGymImage);
router.delete('/:id', authorize('gymOwner', 'admin'), deleteGym);

// Instructor management routes for gym owners
// Note: More specific routes must come before general ones
router.get('/:gymId/instructors/search', authorize('gymOwner', 'admin'), searchAvailableInstructors);
router.get('/:gymId/instructors', authorize('gymOwner', 'admin'), getGymInstructors);
router.post('/:gymId/instructors', authorize('gymOwner', 'admin'), addInstructorToGym);
router.delete('/:gymId/instructors/:instructorId', authorize('gymOwner', 'admin'), removeInstructorFromGym);

// Admin only routes
router.get('/admin/stats', authorize('admin'), getGymStats);
router.put('/:id/approve', authorize('admin'), approveGym);
router.put('/:id/reject', authorize('admin'), rejectGym);

export default router;