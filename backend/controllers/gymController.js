import Gym from '../models/Gym.js';
import User from '../models/User.js';
import InstructorApplication from '../models/InstructorApplication.js';
import { sendGymApprovalEmail, sendGymRejectionEmail, sendGymPendingEmail } from '../utils/emailService.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';
import NotificationService from '../services/notificationService.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Gif from '../models/Gif.js';

// Upload gym logo
export const uploadGymLogo = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload logo for this gym'
      });
    }

    // Check if logo was uploaded via Cloudinary middleware
    if (!req.uploadedLogo) {
      return res.status(400).json({
        success: false,
        message: 'No logo was successfully uploaded'
      });
    }

    // Update gym with logo information
    gym.logo = {
      url: req.uploadedLogo.url,
      publicId: req.uploadedLogo.publicId,
      originalName: req.uploadedLogo.originalName,
      size: req.uploadedLogo.size,
      format: req.uploadedLogo.format,
      width: req.uploadedLogo.width,
      height: req.uploadedLogo.height
    };

    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logo: gym.logo
      }
    });

  } catch (error) {
    console.error('Error uploading gym logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload gym logo',
      error: error.message
    });
  }
};

// Upload gym images
export const uploadGymImages = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images for this gym'
      });
    }

    // Check if images were uploaded via Cloudinary middleware
    if (!req.uploadedImages || req.uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images were successfully uploaded'
      });
    }

    // Add uploaded images to gym
    const newImages = req.uploadedImages.map((image, index) => ({
      url: image.url,
      publicId: image.publicId,
      caption: req.body.captions ? req.body.captions[index] : '',
      isPrimary: gym.images.length === 0 && index === 0, // Make first image primary if no images exist
      originalName: image.originalName,
      size: image.size,
      format: image.format,
      width: image.width,
      height: image.height
    }));

    gym.images.push(...newImages);
    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: newImages,
        totalImages: gym.images.length
      }
    });

  } catch (error) {
    console.error('Error uploading gym images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload gym images',
      error: error.message
    });
  }
};

// Create a new gym
export const createGym = async (req, res) => {
  try {
    const {
      gymName,
      gymType,
      description,
      contactInfo,
      address,
      coordinates,
      facilities,
      services,
      operatingHours,
      capacity,
      establishedYear,
      tags,
      selectedWorkouts,
      paymentMethods,
      paymentProcessor,
      promotions,
      socialMedia,
      registrationFee
    } = req.body;

    // Ensure user is a gym owner or admin
    if (!req.user || (req.user.role !== 'gymOwner' && req.user.role !== 'admin' && req.user.role !== 'customer')) {
      return res.status(403).json({
        success: false,
        message: 'Only gym owners can create gyms'
      });
    }

    // Basic validation
    if (!gymName || !gymType) {
      return res.status(400).json({
        success: false,
        message: 'Gym name and type are required'
      });
    }

    // Check if gym with same name already exists
    const existingGym = await Gym.findOne({ gymName });
    if (existingGym) {
      return res.status(400).json({
        success: false,
        message: 'A gym with this name already exists'
      });
    }

    // Convert selectedWorkouts string IDs to ObjectIds
    const workoutObjectIds = selectedWorkouts && selectedWorkouts.length > 0 
      ? selectedWorkouts.filter(id => id && id.trim() !== '').map(id => {
          try {
            return new mongoose.Types.ObjectId(id);
          } catch (error) {
            console.warn('Invalid workout ID:', id, error.message);
            return null;
          }
        }).filter(id => id !== null)
      : [];


    // Normalize optional/enumerated fields
    const normalizedPaymentProcessor = paymentProcessor && typeof paymentProcessor === 'string' && paymentProcessor.trim()
      ? paymentProcessor
      : undefined;

    // Create new gym
    const newGym = new Gym({
      gymName,
      gymType,
      description,
      owner: req.user.id,
      contactInfo,
      address,
      location: {
        type: 'Point',
        coordinates: coordinates // [longitude, latitude]
      },
      facilities,
      services,
      operatingHours,
      capacity,
      establishedYear,
      tags,
      selectedWorkouts: workoutObjectIds,
      paymentMethods: Array.isArray(paymentMethods) ? paymentMethods : [],
      paymentProcessor: normalizedPaymentProcessor,
      promotions,
      socialMedia: socialMedia || {},
      registrationFee: {
        amount: registrationFee?.amount || 20,
        currency: registrationFee?.currency || 'USD',
        paid: registrationFee?.paid || false,
        paymentMethod: registrationFee?.paymentMethod,
        paidAt: registrationFee?.paid ? new Date() : undefined
      },
      status: 'pending',
      verificationStatus: 'pending',
      isActive: false // Will be activated after approval
    });

    const savedGym = await newGym.save();

    // If user is a customer, don't change their role yet - will change after approval
    // Send notification email to admin
    try {
      await sendGymPendingEmail(req.user.email, gymName);
    } catch (emailError) {
      console.error('Error sending gym pending email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Gym registration submitted successfully. Awaiting admin approval.',
      data: savedGym
    });

  } catch (error) {
    console.error('Error creating gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gym',
      error: error.message
    });
  }
};

// Get all gyms (public)
export const getAllGyms = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      city,
      services,
      facilities,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    // Only show approved gyms to non-admin users
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'approved';
      query.isActive = true;
    } else if (status) {
      // Admin with specific status filter
      query.status = status;
    }
    // Admin without status parameter gets all gyms (no status filter)

    // Search functionality
    if (search) {
      query.$or = [
        { gymName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by city
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by services
    if (services) {
      const serviceArray = services.split(',');
      query.services = { $in: serviceArray };
    }

    // Filter by facilities
    if (facilities) {
      const facilityArray = facilities.split(',');
      query.facilities = { $in: facilityArray };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const gyms = await Gym.find(query)
      .populate('owner', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalGyms = await Gym.countDocuments(query);

    res.status(200).json({
      success: true,
      data: gyms,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalGyms / limit),
        totalItems: totalGyms,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gyms',
      error: error.message
    });
  }
};

// Get gym by ID (public)
export const getGymById = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id)
      .populate('owner', 'firstName lastName email')
      .populate({
        path: 'instructors.instructor',
        select: 'firstName lastName email specialization'
      });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Only show approved gyms to non-admin users
    if ((!req.user || req.user.role !== 'admin') && gym.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    res.status(200).json({
      success: true,
      data: gym
    });

  } catch (error) {
    console.error('Error fetching gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gym',
      error: error.message
    });
  }
};

// Update gym (owner or admin only)
export const updateGym = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gym'
      });
    }

    // Don't allow status updates through this endpoint
    delete updateData.status;
    delete updateData.verificationStatus;
    delete updateData.owner;

    // Update location if coordinates provided
    if (updateData.coordinates) {
      updateData.location = {
        type: 'Point',
        coordinates: updateData.coordinates
      };
      delete updateData.coordinates;
    }

    // Sanitize enum fields that may be sent as empty strings
    if (Object.prototype.hasOwnProperty.call(updateData, 'paymentProcessor')) {
      if (!updateData.paymentProcessor || (typeof updateData.paymentProcessor === 'string' && !updateData.paymentProcessor.trim())) {
        delete updateData.paymentProcessor; // avoid enum validation error for ''
      }
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'paymentMethods') && !Array.isArray(updateData.paymentMethods)) {
      delete updateData.paymentMethods;
    }

    const updatedGym = await Gym.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Gym updated successfully',
      data: updatedGym
    });

  } catch (error) {
    console.error('Error updating gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gym',
      error: error.message
    });
  }
};

// Delete gym (owner or admin only)
export const deleteGym = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gym'
      });
    }

    await Gym.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Gym deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gym',
      error: error.message
    });
  }
};

// Get gyms by owner
export const getGymsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const gyms = await Gym.find({ owner: ownerId }).populate('owner', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: gyms
    });

  } catch (error) {
    console.error('Error fetching owner gyms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gyms',
      error: error.message
    });
  }
};

// Admin: Approve gym
export const approveGym = async (req, res) => {
  try {
    console.log('🏢 APPROVE GYM FUNCTION CALLED');
    console.log('🏢 Gym ID:', req.params.id);
    console.log('🏢 Admin Notes:', req.body.adminNotes);
    console.log('🏢 Admin User:', req.user.id, req.user.role);
    
    const { id } = req.params;
    const { adminNotes } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve gyms'
      });
    }

    const gym = await Gym.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        verificationStatus: 'verified',
        isActive: true,
        adminNotes: adminNotes || '',
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('owner', 'firstName lastName email role');

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Update user role from customer to gymOwner if they are a customer
    if (gym.owner.role === 'customer') {
      await User.findByIdAndUpdate(
        gym.owner._id,
        { role: 'gymOwner' },
        { new: true }
      );
      
      console.log('🏢 Updated user role from customer to gymOwner');
    }

    // Send approval notification
    try {
      await NotificationService.createGymNotification(gym._id, 'approved', req.user.id);
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Send approval email
    try {
      await sendGymApprovalEmail(gym.owner.email, gym.gymName);
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
    }

    console.log('🏢 GYM APPROVED SUCCESSFULLY');
    res.status(200).json({
      success: true,
      message: 'Gym approved successfully',
      data: gym
    });

  } catch (error) {
    console.error('🏢 Error approving gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve gym',
      error: error.message
    });
  }
};

// Admin: Reject gym
export const rejectGym = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes, reason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can reject gyms'
      });
    }

    const gym = await Gym.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        verificationStatus: 'rejected',
        adminNotes: adminNotes || reason || 'No reason provided',
        isActive: false,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('owner', 'firstName lastName email');

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Send rejection notification
    try {
      await NotificationService.createGymNotification(gym._id, 'rejected', req.user.id);
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Send rejection email
    try {
      await sendGymRejectionEmail(gym.owner.email, gym.gymName, adminNotes || reason || 'No reason provided');
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Gym rejected successfully',
      data: gym
    });

  } catch (error) {
    console.error('Error rejecting gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject gym',
      error: error.message
    });
  }
};

// Get gyms near location
export const getGymsNearLocation = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const gyms = await Gym.find({
      status: 'approved',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).populate('owner', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: gyms,
      count: gyms.length
    });

  } catch (error) {
    console.error('Error fetching nearby gyms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby gyms',
      error: error.message
    });
  }
};

// Admin: Get all pending gyms
export const getPendingGyms = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view pending gyms'
      });
    }

    const pendingGyms = await Gym.find({ status: 'pending' })
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingGyms,
      count: pendingGyms.length
    });

  } catch (error) {
    console.error('Error fetching pending gyms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending gyms',
      error: error.message
    });
  }
};

// Toggle gym active status (owner or admin)
export const toggleGymStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gym'
      });
    }

    gym.isActive = !gym.isActive;
    await gym.save();

    res.status(200).json({
      success: true,
      message: `Gym ${gym.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        isActive: gym.isActive
      }
    });

  } catch (error) {
    console.error('Error toggling gym status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle gym status',
      error: error.message
    });
  }
};

// Add instructor to gym
export const addInstructorToGym = async (req, res) => {
  try {
    const { gymId } = req.params;
    const {
      instructorId,
      specialization,
      salary,
      startDate,
      description,
      schedule
    } = req.body;

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add instructors to this gym'
      });
    }

    // Check if instructor exists and is an instructor
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found or user is not an instructor'
      });
    }

    // Check if instructor is already added to this gym
    const existingInstructor = gym.instructors.find(
      inst => inst.instructor.toString() === instructorId
    );
    if (existingInstructor) {
      return res.status(400).json({
        success: false,
        message: 'Instructor is already added to this gym'
      });
    }

    // Add instructor to gym
    gym.instructors.push({
      instructor: instructorId,
      specialization,
      salary,
      startDate: startDate || Date.now(),
      description,
      schedule,
      isActive: true
    });

    await gym.save();

    // Populate the newly added instructor
    await gym.populate({
      path: 'instructors.instructor',
      select: 'firstName lastName email specialization'
    });

    res.status(200).json({
      success: true,
      message: 'Instructor added successfully',
      data: gym.instructors[gym.instructors.length - 1]
    });

  } catch (error) {
    console.error('Error adding instructor to gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add instructor to gym',
      error: error.message
    });
  }
};

// Remove instructor from gym
export const removeInstructorFromGym = async (req, res) => {
  try {
    const { gymId, instructorId } = req.params;

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove instructors from this gym'
      });
    }

    // Remove instructor from gym
    gym.instructors = gym.instructors.filter(
      inst => inst.instructor.toString() !== instructorId
    );

    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Instructor removed successfully'
    });

  } catch (error) {
    console.error('Error removing instructor from gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove instructor from gym',
      error: error.message
    });
  }
};

// Update instructor in gym
export const updateInstructorInGym = async (req, res) => {
  try {
    const { gymId, instructorId } = req.params;
    const updateData = req.body;

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update instructors in this gym'
      });
    }

    // Find and update instructor
    const instructorIndex = gym.instructors.findIndex(
      inst => inst.instructor.toString() === instructorId
    );

    if (instructorIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found in this gym'
      });
    }

    // Update instructor data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'instructor' && key !== 'addedAt') {
        gym.instructors[instructorIndex][key] = updateData[key];
      }
    });

    await gym.save();

    // Populate the updated instructor
    await gym.populate({
      path: 'instructors.instructor',
      select: 'firstName lastName email specialization'
    });

    res.status(200).json({
      success: true,
      message: 'Instructor updated successfully',
      data: gym.instructors[instructorIndex]
    });

  } catch (error) {
    console.error('Error updating instructor in gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update instructor in gym',
      error: error.message
    });
  }
};

// Get gym statistics (owner or admin)
export const getGymStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view gym statistics'
      });
    }

    // Calculate statistics
    const stats = {
      totalInstructors: gym.instructors.length,
      activeInstructors: gym.instructors.filter(inst => inst.isActive).length,
      totalServices: gym.services.length,
      totalFacilities: gym.facilities.length,
      totalImages: gym.images.length,
      hasLogo: !!gym.logo,
      membershipPlans: gym.pricing.membershipPlans.length,
      rating: gym.rating.average,
      totalReviews: gym.rating.totalReviews,
      establishedSince: gym.establishedYear ? new Date().getFullYear() - gym.establishedYear : null
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching gym statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gym statistics',
      error: error.message
    });
  }
};

// Register a new instructor for a gym (Gym Owner only)
export const registerInstructorForGym = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      specialization,
      experience,
      salary,
      startDate,
      description,
      password,
      gymId
    } = req.body;

    // Check if user is gym owner or admin
    if (req.user.role !== 'gymOwner' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only gym owners can register instructors'
      });
    }

    // Verify the gym exists and user owns it
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add instructors to this gym'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new instructor user
    const newInstructor = new User({
      email,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      role: 'instructor',
      specialization,
      experience,
      isActive: true,
      registeredBy: req.user.id
    });

    await newInstructor.save();

    // Add instructor to gym
    gym.instructors.push({
      instructor: newInstructor._id,
      specialization,
      salary,
      startDate: startDate || Date.now(),
      description,
      isActive: true
    });

    await gym.save();

    // Create notification for the new instructor
    try {
      await NotificationService.createNotification(
        newInstructor._id,
        'instructor_registered',
        `You have been registered as an instructor at ${gym.gymName}`,
        {
          gymId: gym._id,
          gymName: gym.gymName,
          registeredBy: req.user.id
        }
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.status(201).json({
      success: true,
      message: 'Instructor registered successfully',
      data: {
        instructor: {
          id: newInstructor._id,
          email: newInstructor.email,
          firstName: newInstructor.firstName,
          lastName: newInstructor.lastName,
          role: newInstructor.role,
          specialization: newInstructor.specialization
        },
        gym: {
          id: gym._id,
          name: gym.gymName
        }
      }
    });

  } catch (error) {
    console.error('Error registering instructor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register instructor',
      error: error.message
    });
  }
};

// Get instructors for a specific gym
export const getGymInstructors = async (req, res) => {
  try {
    const { gymId } = req.params;

    const gym = await Gym.findById(gymId)
      .select('instructors gymName owner')
      .populate({
        path: 'instructors.instructor',
        select: 'firstName lastName email phone specialization experience isActive'
      });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user has permission to view instructors
    const isOwner = gym.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      // For non-owners, only return active instructors with limited info
      const publicInstructors = gym.instructors
        .filter(inst => inst.isActive)
        .map(inst => ({
          instructor: {
            id: inst.instructor._id,
            firstName: inst.instructor.firstName,
            lastName: inst.instructor.lastName,
            specialization: inst.instructor.specialization
          },
          schedule: inst.schedule
        }));

      return res.status(200).json({
        success: true,
        data: publicInstructors
      });
    }

    // For owners and admins, return full instructor info
    // Filter out instructors where population failed (instructor is null)
    const validInstructors = gym.instructors.filter(inst => inst.instructor && inst.instructor._id);
    
    res.status(200).json({
      success: true,
      data: validInstructors
    });

  } catch (error) {
    console.error('Error fetching gym instructors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gym instructors',
      error: error.message
    });
  }
};

// Update bank account details
export const updateBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const bankAccountData = req.body;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update bank account for this gym'
      });
    }

    // Update bank account details
    gym.bankAccount = {
      ...gym.bankAccount,
      ...bankAccountData,
      lastUpdated: Date.now()
    };

    await gym.save();

    // Return gym with masked account number
    const gymResponse = gym.toObject();
    if (gymResponse.bankAccount && gymResponse.bankAccount.accountNumber) {
      // Mask account number for security
      const accountNum = gymResponse.bankAccount.accountNumber;
      gymResponse.bankAccount.accountNumber = accountNum.slice(0, 4) + '****' + accountNum.slice(-4);
    }

    res.status(200).json({
      success: true,
      message: 'Bank account details updated successfully',
      data: gymResponse
    });
  } catch (error) {
    console.error('Error updating bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bank account details',
      error: error.message
    });
  }
};

// Get bank account details
export const getBankAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id).select('bankAccount owner');
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bank account details'
      });
    }

    // Return bank account with masked account number
    const bankAccount = gym.bankAccount || {};
    if (bankAccount.accountNumber) {
      const accountNum = bankAccount.accountNumber;
      bankAccount.accountNumber = accountNum.slice(0, 4) + '****' + accountNum.slice(-4);
    }

    res.status(200).json({
      success: true,
      data: bankAccount
    });
  } catch (error) {
    console.error('Error fetching bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bank account details',
      error: error.message
    });
  }
};

// Delete bank account details
export const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete bank account for this gym'
      });
    }

    // Clear bank account details
    gym.bankAccount = undefined;
    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Bank account details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bank account details',
      error: error.message
    });
  }
};

// Delete gym logo
export const deleteGymLogo = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete logo for this gym'
      });
    }

    if (!gym.logo || !gym.logo.publicId) {
      return res.status(404).json({
        success: false,
        message: 'No logo found to delete'
      });
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(gym.logo.publicId);
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue even if Cloudinary deletion fails
    }

    // Remove logo from database
    gym.logo = undefined;
    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Logo deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting gym logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gym logo',
      error: error.message
    });
  }
};

// Set primary gym image
export const setPrimaryGymImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageId } = req.body;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update images for this gym'
      });
    }

    // Reset all images to non-primary
    gym.images.forEach(img => {
      img.isPrimary = false;
    });

    // Find and set the selected image as primary
    const imageToUpdate = gym.images.find(img => 
      img._id.toString() === imageId || img.publicId === imageId
    );

    if (!imageToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    imageToUpdate.isPrimary = true;
    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Primary image updated successfully',
      data: {
        primaryImage: imageToUpdate
      }
    });

  } catch (error) {
    console.error('Error setting primary gym image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set primary gym image',
      error: error.message
    });
  }
};

// Delete gym image
export const deleteGymImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    console.log('Deleting gym image:', { gymId: id, imageId });

    // Decode the imageId in case it's URL encoded
    const decodedImageId = decodeURIComponent(imageId);
    console.log('Decoded imageId:', decodedImageId);

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user is the owner or admin
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete images for this gym'
      });
    }

    // Find the image to delete
    console.log('Current gym images:', gym.images.map(img => ({ _id: img._id.toString(), publicId: img.publicId })));
    
    const imageToDelete = gym.images.find(img => 
      img._id.toString() === decodedImageId || img.publicId === decodedImageId
    );

    if (!imageToDelete) {
      console.log('Image not found with ID:', decodedImageId);
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    console.log('Found image to delete:', imageToDelete);

    // Delete from Cloudinary
    if (imageToDelete.publicId) {
      try {
        await deleteFromCloudinary(imageToDelete.publicId);
        console.log('Deleted from Cloudinary:', imageToDelete.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue even if Cloudinary deletion fails
      }
    }

    // Remove image from database using Mongoose's pull method
    // Check if decodedImageId is a valid ObjectId
    const mongoose = await import('mongoose');
    const isObjectId = mongoose.Types.ObjectId.isValid(decodedImageId);
    
    let updateQuery;
    if (isObjectId) {
      // If it's a valid ObjectId, check both _id and publicId
      updateQuery = {
        $pull: {
          images: {
            $or: [
              { publicId: decodedImageId },
              { _id: decodedImageId }
            ]
          }
        }
      };
    } else {
      // If it's not a valid ObjectId, only check publicId
      updateQuery = {
        $pull: {
          images: { publicId: decodedImageId }
        }
      };
    }

    console.log('Update query:', JSON.stringify(updateQuery, null, 2));
    const updatedGym = await Gym.findByIdAndUpdate(id, updateQuery, { new: true });

    if (!updatedGym) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update gym'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        deletedImage: imageToDelete,
        remainingImages: updatedGym.images.length
      }
    });

  } catch (error) {
    console.error('Error deleting gym image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gym image',
      error: error.message
    });
  }
};

// Get workouts (selectedWorkouts) for a gym
export const getGymWorkouts = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch minimal fields first to perform robust authorization without populate
    const gymBasic = await Gym.findById(id).select('owner status');
    if (!gymBasic) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Only owners or admins can view unapproved gyms
    if (gymBasic.status !== 'approved') {
      const ownerId = gymBasic.owner?.toString();
      if (!req.user || ((ownerId !== req.user.id) && req.user.role !== 'admin')) {
        return res.status(403).json({ success: false, message: 'Not authorized to view workouts for this gym' });
      }
    }

    // Now fetch populated workouts for response
    const gym = await Gym.findById(id).select('selectedWorkouts').populate('selectedWorkouts');
    return res.status(200).json({ success: true, data: gym?.selectedWorkouts || [] });
  } catch (error) {
    console.error('Error fetching gym workouts:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch gym workouts', error: error.message });
  }
};

// Add workouts to a gym from admin-created workouts (GIFs)
export const addGymWorkouts = async (req, res) => {
  try {
    const { id } = req.params;
    const { workoutIds } = req.body;

    if (!Array.isArray(workoutIds) || workoutIds.length === 0) {
      return res.status(400).json({ success: false, message: 'workoutIds must be a non-empty array' });
    }

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Owner or admin only
    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify workouts for this gym' });
    }

    // Validate workout IDs exist in Gif collection (admin-managed)
    const validWorkouts = await Gif.find({ _id: { $in: workoutIds } }).select('_id');
    const validIds = validWorkouts.map(w => w._id.toString());
    if (validIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid workouts found for provided IDs' });
    }

    const currentIds = (gym.selectedWorkouts || []).map(id => id.toString());
    const toAdd = validIds.filter(id => !currentIds.includes(id));

    if (toAdd.length === 0) {
      return res.status(200).json({ success: true, message: 'No new workouts to add', data: gym.selectedWorkouts });
    }

    gym.selectedWorkouts = [...(gym.selectedWorkouts || []), ...toAdd];
    await gym.save();

    const populated = await Gym.findById(id).populate('selectedWorkouts');
    return res.status(200).json({ success: true, message: 'Workouts added successfully', data: populated.selectedWorkouts });
  } catch (error) {
    console.error('Error adding gym workouts:', error);
    return res.status(500).json({ success: false, message: 'Failed to add gym workouts', error: error.message });
  }
};

// Remove a workout from a gym
export const removeGymWorkout = async (req, res) => {
  try {
    const { id, workoutId } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    if (gym.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify workouts for this gym' });
    }

    const before = gym.selectedWorkouts?.length || 0;
    gym.selectedWorkouts = (gym.selectedWorkouts || []).filter(w => w.toString() !== workoutId);
    const after = gym.selectedWorkouts.length;
    if (before === after) {
      return res.status(404).json({ success: false, message: 'Workout not found in this gym' });
    }

    await gym.save();
    const populated = await Gym.findById(id).populate('selectedWorkouts');
    return res.status(200).json({ success: true, message: 'Workout removed successfully', data: populated.selectedWorkouts });
  } catch (error) {
    console.error('Error removing gym workout:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove gym workout', error: error.message });
  }
};