import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload options for gym images
export const gymImageOptions = {
  folder: 'gym-app/gyms',
  allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  transformation: [
    { width: 1200, height: 800, crop: 'limit' }, // Limit max size
    { quality: 'auto' }, // Auto quality optimization
    { fetch_format: 'auto' } // Auto format (WebP when supported)
  ],
  resource_type: 'image'
};

// Upload options for gym logos
export const gymLogoOptions = {
  folder: 'gym-app/logos',
  allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  transformation: [
    { width: 400, height: 400, crop: 'limit' }, // Smaller size for logos
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ],
  resource_type: 'image'
};

// Upload options for profile images
export const profileImageOptions = {
  folder: 'gym-app/profiles',
  allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  transformation: [
    { width: 300, height: 300, crop: 'fill', gravity: 'face' }, // Square crop with face detection
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ],
  resource_type: 'image'
};

// Helper function to upload single image to Cloudinary
export const uploadToCloudinary = async (buffer, options = gymImageOptions) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  });
};

export default cloudinary;