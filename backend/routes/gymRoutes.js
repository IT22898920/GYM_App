import express from 'express';
import {
  createGym,
  getAllGyms,
  getGymById,
  updateGym,
  deleteGym,
  getGymsByOwner,
  approveGym,
  rejectGym,
  getGymsNearLocation,
  uploadGymImages,
  uploadGymLogo,
  deleteGymImage,
  getGymStatistics,
  addInstructorToGym,
  removeInstructorFromGym,
  getGymInstructors,
  registerInstructorForGym,
  updateInstructorInGym,
  updateBankAccount,
  getBankAccount,
  deleteBankAccount,
  getPendingGyms,
  toggleGymStatus
} from '../controllers/gymController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateGymRegistration, validateGymUpdate, validateBankAccount } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { uploadGymImages as uploadGymImagesMiddleware, uploadGymImagesToCloudinary, uploadLogo, uploadGymLogoToCloudinary, handleUploadError, uploadInstructorFiles, uploadInstructorFilesToCloudinary } from '../middleware/upload.js';
import { getGymWorkouts, addGymWorkouts, removeGymWorkout } from '../controllers/gymController.js';

const router = express.Router();

// Apply optional authentication to getAllGyms to check user role
router.get('/', optionalAuth, getAllGyms);

// Public routes
router.get('/search/nearby', getGymsNearLocation);
router.get('/:id', getGymById);

// Protected routes - require authentication
router.use(protect);

// Gym registration - allow customers to register their gym
router.post('/register', authorize('customer', 'gymOwner', 'admin'), validateGymRegistration, handleValidationErrors, createGym);
router.post('/register-instructor', authorize('gymOwner', 'admin'), uploadInstructorFiles, uploadInstructorFilesToCloudinary, registerInstructorForGym);
router.get('/owner/gyms', authorize('customer', 'gymOwner', 'admin'), getGymsByOwner);
router.put('/:id', authorize('gymOwner', 'admin'), validateGymUpdate, handleValidationErrors, updateGym);
router.post('/:id/upload-images', authorize('customer', 'gymOwner', 'admin'), uploadGymImagesMiddleware, uploadGymImagesToCloudinary, uploadGymImages);
router.post('/:id/upload-logo', authorize('customer', 'gymOwner', 'admin'), uploadLogo, uploadGymLogoToCloudinary, uploadGymLogo);
router.delete('/:id/images/:imageId', authorize('gymOwner', 'admin'), deleteGymImage);
router.delete('/:id', authorize('gymOwner', 'admin'), deleteGym);

// Bank account management routes
router.put('/:id/bank-account', authorize('gymOwner', 'admin'), validateBankAccount, handleValidationErrors, updateBankAccount);
router.get('/:id/bank-account', authorize('gymOwner', 'admin'), getBankAccount);
router.delete('/:id/bank-account', authorize('gymOwner', 'admin'), deleteBankAccount);

// Instructor management routes for gym owners
// Note: More specific routes must come before general ones
router.get('/:gymId/instructors', authorize('gymOwner', 'admin'), getGymInstructors);
router.post('/:gymId/instructors', authorize('gymOwner', 'admin'), addInstructorToGym);
router.put('/:gymId/instructors/:instructorId', authorize('gymOwner', 'admin'), updateInstructorInGym);
router.delete('/:gymId/instructors/:instructorId', authorize('gymOwner', 'admin'), removeInstructorFromGym);

// Gym workouts management
router.get('/:id/workouts', authorize('customer', 'gymOwner', 'admin'), getGymWorkouts);
router.post('/:id/workouts', authorize('gymOwner', 'admin'), addGymWorkouts);
router.delete('/:id/workouts/:workoutId', authorize('gymOwner', 'admin'), removeGymWorkout);

// Admin only routes
router.get('/admin/pending', authorize('admin'), getPendingGyms);
router.get('/:id/statistics', authorize('gymOwner', 'admin'), getGymStatistics);
router.put('/:id/approve', authorize('admin'), approveGym);
router.put('/:id/reject', authorize('admin'), rejectGym);
router.put('/:id/toggle-status', authorize('gymOwner', 'admin'), toggleGymStatus);

export default router;