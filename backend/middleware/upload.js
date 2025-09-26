import multer from 'multer';
import path from 'path';
import { uploadToCloudinary, gymImageOptions, gymLogoOptions, profileImageOptions, workoutGifOptions } from '../config/cloudinary.js';

// Configure memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter to allow only images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// File filter for instructor applications (images and documents)
const instructorFileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const isImage = allowedImageTypes.test(extname.substring(1)) && file.mimetype.startsWith('image/');
  const isDoc = allowedDocTypes.test(extname.substring(1)) && 
    (file.mimetype === 'application/pdf' || 
     file.mimetype === 'application/msword' || 
     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  if (isImage || isDoc) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) and document files (pdf, doc, docx) are allowed'));
  }
};

// Multer configuration for images only
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: imageFileFilter
});

// Multer configuration for instructor applications (images and documents)
const instructorUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
    files: 15 // Maximum 15 files
  },
  fileFilter: instructorFileFilter
});

// Middleware for single image upload
export const uploadSingle = upload.single('image');

// Middleware for single gif upload (expects field name 'gif')
export const uploadSingleGif = upload.single('gif');

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

// Middleware for instructor application files
export const uploadInstructorFiles = instructorUpload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 },
  { name: 'certifications', maxCount: 10 }
]);

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 15 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }

  if (error.message.includes('Only image files are allowed') || error.message.includes('document files')) {
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

// Middleware to upload a single GIF to Cloudinary
export const uploadGifToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No GIF file provided'
      });
    }

    // Ensure uploaded file is a gif
    if (req.file.mimetype !== 'image/gif') {
      return res.status(400).json({
        success: false,
        message: 'Only GIF files are supported'
      });
    }

    const uploadedGif = await uploadSingleToCloudinary(req.file, workoutGifOptions);
    req.uploadedGif = uploadedGif;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload GIF to Cloudinary',
      error: error.message
    });
  }
};

// Helper function to upload document to Cloudinary
export const uploadDocumentToCloudinary = async (file) => {
  try {
    // Use raw resource type for documents to avoid strict format rejections
    const result = await uploadToCloudinary(file.buffer, {
      resource_type: 'raw',
      folder: 'instructor-documents'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.originalname,
      size: file.size,
      format: result.format
    };
  } catch (error) {
    throw new Error(`Failed to upload document: ${error.message}`);
  }
};

// Middleware to upload instructor files to Cloudinary
export const uploadInstructorFilesToCloudinary = async (req, res, next) => {
  try {
    if (!req.files) {
      return next(); // No files to upload, continue
    }

    const uploadedFiles = {};

    // Upload resume
    if (req.files.resume && req.files.resume[0]) {
      const resumeFile = req.files.resume[0];
      uploadedFiles.resume = await uploadDocumentToCloudinary(resumeFile);
    }

    // Upload profile picture
    if (req.files.profilePicture && req.files.profilePicture[0]) {
      const profilePictureFile = req.files.profilePicture[0];
      uploadedFiles.profilePicture = await uploadSingleToCloudinary(profilePictureFile, profileImageOptions);
    }

    // Upload certifications
    if (req.files.certifications && req.files.certifications.length > 0) {
      const certificationPromises = req.files.certifications.map(async (file) => {
        // Check if it's an image or document
        if (file.mimetype.startsWith('image/')) {
          return await uploadSingleToCloudinary(file, profileImageOptions);
        } else {
          return await uploadDocumentToCloudinary(file);
        }
      });
      
      uploadedFiles.certifications = await Promise.all(certificationPromises);
    }

    req.uploadedFiles = uploadedFiles;
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files to Cloudinary',
      error: error.message
    });
  }
};