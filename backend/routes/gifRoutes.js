import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingleGif, uploadGifToCloudinary, handleUploadError } from '../middleware/upload.js';
import { uploadGif, listGifs, deleteGif, updateGif } from '../controllers/gifController.js';

const router = express.Router();

// List all GIFs (public or protected based on needs; keeping public here)
router.get('/', listGifs);

// Upload a new GIF (require authentication; allow admin and gymOwner to upload)
router.post(
  '/upload',
  protect,
  authorize('admin'),
  uploadSingleGif,
  uploadGifToCloudinary,
  handleUploadError,
  uploadGif
);

// Delete a GIF (require authentication; admin only)
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteGif
);

// Update a GIF (require authentication; admin only)
router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateGif
);

export default router;


