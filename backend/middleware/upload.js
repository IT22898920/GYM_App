import multer from 'multer';
import path from 'path';
import { uploadToCloudinary, gymImageOptions, gymLogoOptions, profileImageOptions } from '../config/cloudinary.js';

// Configure memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Middleware for single image upload
export const uploadSingle = upload.single('image');

// Middleware for single logo upload
export const uploadLogo = upload.single('logo');

// Middleware for multiple gym images
export const uploadGymImages = upload.array('images', 10);

// Middleware for gym profile with multiple fields
export const uploadGymFiles = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'logo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]);

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }

  if (error.message === 'Only image files are allowed (jpeg, jpg, png, gif, webp)') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

// Helper function to upload single file to Cloudinary
export const uploadSingleToCloudinary = async (file, options = gymImageOptions) => {
  try {
    const result = await uploadToCloudinary(file.buffer, options);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.originalname,
      size: file.size,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Helper function to upload multiple files to Cloudinary
export const uploadMultipleToCloudinary = async (files, options = gymImageOptions) => {
  try {
    const uploadPromises = files.map(file => uploadSingleToCloudinary(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

// Middleware to upload gym images to Cloudinary
export const uploadGymImagesToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const uploadedImages = await uploadMultipleToCloudinary(req.files, gymImageOptions);
    req.uploadedImages = uploadedImages;
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images to Cloudinary',
      error: error.message
    });
  }
};

// Middleware to upload gym logo to Cloudinary
export const uploadGymLogoToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No logo provided'
      });
    }

    const uploadedLogo = await uploadSingleToCloudinary(req.file, gymLogoOptions);
    req.uploadedLogo = uploadedLogo;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo to Cloudinary',
      error: error.message
    });
  }
};

// Middleware to upload profile image to Cloudinary
export const uploadProfileImageToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile image provided'
      });
    }

    const uploadedImage = await uploadSingleToCloudinary(req.file, profileImageOptions);
    req.uploadedProfileImage = uploadedImage;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image to Cloudinary',
      error: error.message
    });
  }
};