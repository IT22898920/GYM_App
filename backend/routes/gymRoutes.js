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
  getGymStats,
  getGymDashboard
} from '../controllers/gymController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateGymRegistration, validateGymUpdate } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { uploadGymImages, uploadGymImagesToCloudinary, uploadLogo, uploadGymLogoToCloudinary, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllGyms);
router.get('/search/nearby', searchNearbyGyms);
router.get('/:id', getGymById);

// Protected routes - require authentication
router.use(protect);

// Gym registration - allow customers to register their gym
router.post('/register', authorize('customer', 'gymOwner', 'admin'), validateGymRegistration, handleValidationErrors, registerGym);
router.get('/owner/gyms', authorize('customer', 'gymOwner', 'admin'), getGymsByOwner);
router.get('/owner/dashboard', authorize('gymOwner', 'admin'), getGymDashboard);
router.put('/:id', authorize('gymOwner', 'admin'), validateGymUpdate, handleValidationErrors, updateGym);
router.post('/:id/upload-images', authorize('customer', 'gymOwner', 'admin'), uploadGymImages, uploadGymImagesToCloudinary, uploadImages);
router.post('/:id/upload-logo', authorize('customer', 'gymOwner', 'admin'), uploadLogo, uploadGymLogoToCloudinary, uploadGymLogo);
router.delete('/:id', authorize('gymOwner', 'admin'), deleteGym);

// Admin only routes
router.get('/admin/stats', authorize('admin'), getGymStats);
router.put('/:id/approve', authorize('admin'), approveGym);
router.put('/:id/reject', authorize('admin'), rejectGym);

export default router;