import Gym from '../models/Gym.js';
import User from '../models/User.js';
import { sendGymApprovalEmail, sendGymRejectionEmail, sendGymPendingEmail } from '../utils/emailService.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

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
      message: 'Logo uploaded successfully to Cloudinary',
      data: {
        logo: gym.logo
      }
    });

  } catch (error) {
    console.error('Error uploading gym logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo',
      error: error.message
    });
  }
};

// Upload gym images
export const uploadImages = async (req, res) => {
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

    // Format images for database storage
    const images = req.uploadedImages.map((uploadedImage, index) => ({
      url: uploadedImage.url,
      publicId: uploadedImage.publicId,
      caption: req.body.captions ? req.body.captions[index] || '' : '',
      isPrimary: index === 0, // First image is primary by default
      originalName: uploadedImage.originalName,
      size: uploadedImage.size,
      format: uploadedImage.format,
      width: uploadedImage.width,
      height: uploadedImage.height
    }));

    // Add new images to existing ones
    gym.images.push(...images);
    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully to Cloudinary',
      data: {
        uploadedImages: images,
        totalImages: gym.images.length
      }
    });

  } catch (error) {
    console.error('Error uploading gym images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
};

// Register a new gym
export const registerGym = async (req, res) => {
  try {
    const {
      gymName,
      description,
      contactInfo,
      address,
      location,
      facilities,
      equipment,
      services,
      operatingHours,
      pricing,
      amenities,
      specialPrograms,
      capacity,
      establishedYear,
      certifications,
      socialMedia,
      tags
    } = req.body;

    // Check if gym with same name already exists
    const existingGym = await Gym.findOne({ gymName: { $regex: new RegExp(gymName, 'i') } });
    if (existingGym) {
      return res.status(400).json({
        success: false,
        message: 'A gym with this name already exists'
      });
    }

    // Verify the owner exists and is a gym owner
    const owner = await User.findById(req.user.id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    // Allow customers to register their first gym
    if (owner.role !== 'customer' && owner.role !== 'gymOwner' && owner.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to register a gym'
      });
    }

    // Check if user already has a gym (only customers can register one gym)
    if (owner.role === 'customer') {
      const ownerHasGym = await Gym.findOne({ owner: req.user.id });
      if (ownerHasGym) {
        return res.status(400).json({
          success: false,
          message: 'You already have a gym registration pending. Please wait for admin approval.'
        });
      }
    }

    // Create new gym
    const newGym = new Gym({
      gymName,
      description,
      owner: req.user.id,
      contactInfo,
      address,
      location,
      facilities: facilities || [],
      equipment: equipment || [],
      services: services || [],
      operatingHours: operatingHours || {},
      pricing: pricing || {},
      amenities: amenities || [],
      specialPrograms: specialPrograms || [],
      capacity,
      establishedYear,
      certifications: certifications || [],
      socialMedia: socialMedia || {},
      tags: tags || []
    });

    const savedGym = await newGym.save();

    // Populate owner information
    const populatedGym = await Gym.findById(savedGym._id).populate('owner', 'firstName lastName email');

    // Send confirmation email to gym owner
    try {
      await sendGymPendingEmail(
        owner.email,
        gymName,
        `${owner.firstName} ${owner.lastName}`
      );
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Gym registered successfully. Awaiting admin approval.',
      data: populatedGym
    });

  } catch (error) {
    console.error('Error registering gym:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register gym',
      error: error.message
    });
  }
};

// Get all gyms with optional filters
export const getAllGyms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      state,
      status,
      verified,
      latitude,
      longitude,
      radius = 50, // Default radius in kilometers
      facilities,
      services,
      priceRange
    } = req.query;

    const filter = {};
    
    // Status filter
    if (status) {
      filter.status = status;
    } else if (!req.user || req.user.role !== 'admin') {
      // Only show approved gyms by default for non-admin users
      filter.status = 'approved';
    }
    // Admin users can see all gyms without status filter
    
    // Debug logging
    console.log('getAllGyms - User role:', req.user?.role || 'No user');
    console.log('getAllGyms - Filter applied:', filter);

    // Verification filter
    if (verified) {
      filter.verificationStatus = verified;
    }

    // Location filters
    if (city) {
      filter['address.city'] = { $regex: new RegExp(city, 'i') };
    }
    if (state) {
      filter['address.state'] = { $regex: new RegExp(state, 'i') };
    }

    // Facilities filter
    if (facilities) {
      const facilitiesArray = Array.isArray(facilities) ? facilities : [facilities];
      filter.facilities = { $in: facilitiesArray };
    }

    // Services filter
    if (services) {
      const servicesArray = Array.isArray(services) ? services : [services];
      filter.services = { $in: servicesArray };
    }

    let query = Gym.find(filter).populate('owner', 'firstName lastName email role');

    // Text search
    if (search) {
      query = Gym.find({
        ...filter,
        $text: { $search: search }
      }).populate('owner', 'firstName lastName email role');
    }

    // Location-based search
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInMeters = parseFloat(radius) * 1000; // Convert km to meters

      // Use $geoWithin with $centerSphere instead of $near to avoid sorting issues
      query = Gym.find({
        ...filter,
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], radiusInMeters / 6378100] // Convert to radians
          }
        }
      }).populate('owner', 'firstName lastName email role');
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const gyms = await query
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count for pagination
    let total;
    if (search) {
      total = await Gym.countDocuments({
        ...filter,
        $text: { $search: search }
      });
    } else if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInMeters = parseFloat(radius) * 1000;
      total = await Gym.countDocuments({
        ...filter,
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], radiusInMeters / 6378100] // Convert to radians
          }
        }
      });
    } else {
      total = await Gym.countDocuments(filter);
    }

    res.status(200).json({
      success: true,
      data: gyms,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
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

// Get gym by ID
export const getGymById = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id).populate('owner', 'firstName lastName email phone');

    if (!gym) {
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

// Update gym (owner only)
export const updateGym = async (req, res) => {
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

    const updatedGym = await Gym.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
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
      console.log(`Updated user ${gym.owner.email} role from customer to gymOwner`);
    }

    // Send approval email to gym owner
    try {
      await sendGymApprovalEmail(
        gym.owner.email,
        gym.gymName,
        `${gym.owner.firstName} ${gym.owner.lastName}`
      );
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the approval if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Gym approved successfully and owner role updated',
      data: gym
    });

  } catch (error) {
    console.error('Error approving gym:', error);
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
    const { adminNotes } = req.body;

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
        adminNotes: adminNotes || 'Gym registration rejected',
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

    // Send rejection email to gym owner
    try {
      await sendGymRejectionEmail(
        gym.owner.email,
        gym.gymName,
        `${gym.owner.firstName} ${gym.owner.lastName}`,
        adminNotes
      );
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the rejection if email fails
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

// Search gyms near location
export const searchNearbyGyms = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusInMeters = parseFloat(radius) * 1000;

    const gyms = await Gym.find({
      status: 'approved',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInMeters
        }
      }
    }).populate('owner', 'firstName lastName email');

    // Add distance to each gym
    const gymsWithDistance = gyms.map(gym => {
      const distance = gym.calculateDistance([lng, lat]);
      return {
        ...gym.toObject(),
        distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
      };
    });
    
    res.status(200).json({
      success: true,
      data: gymsWithDistance
    });
// 
  } catch (error) {
    console.error('Error searching nearby gyms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search nearby gyms',
      error: error.message
    });
  }
};

// Get gym statistics (admin only)
export const getGymStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access gym statistics'
      });
    }

    const totalGyms = await Gym.countDocuments();
    const approvedGyms = await Gym.countDocuments({ status: 'approved' });
    const pendingGyms = await Gym.countDocuments({ status: 'pending' });
    const rejectedGyms = await Gym.countDocuments({ status: 'rejected' });
    const verifiedGyms = await Gym.countDocuments({ verificationStatus: 'verified' });

    // Get gyms by location (top 5 cities)
    const gymsByLocation = await Gym.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRegistrations = await Gym.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get gym ratings distribution
    const ratingDistribution = await Gym.aggregate([
      { $match: { status: 'approved', 'rating.average': { $gt: 0 } } },
      { $bucket: {
        groupBy: '$rating.average',
        boundaries: [0, 1, 2, 3, 4, 5],
        default: 'No Rating',
        output: { count: { $sum: 1 } }
      }}
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalGyms,
          approvedGyms,
          pendingGyms,
          rejectedGyms,
          verifiedGyms,
          recentRegistrations
        },
        gymsByLocation,
        ratingDistribution
      }
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

// Get gym dashboard data (owner)
export const getGymDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get gym owned by the user
    const gym = await Gym.findOne({ owner: ownerId });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'No gym found for this owner'
      });
    }

    // Calculate basic statistics
    const stats = {
      status: gym.status,
      verificationStatus: gym.verificationStatus,
      totalImages: gym.images.length,
      totalFacilities: gym.facilities.length,
      totalServices: gym.services.length,
      membershipPlans: gym.pricing.membershipPlans.length,
      rating: gym.rating.average,
      totalReviews: gym.rating.totalReviews
    };

    res.status(200).json({
      success: true,
      data: {
        gym,
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching gym dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gym dashboard',
      error: error.message
    });
  }
};

// Delete individual gym image
export const deleteGymImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    // Decode the imageId in case it was URL encoded
    const decodedImageId = decodeURIComponent(imageId);
    
    console.log('Delete image request:', {
      gymId: id,
      originalImageId: imageId,
      decodedImageId: decodedImageId
    });

    // Find the gym first to check permissions and get image details
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

    // Find the image in the gym's images array
    console.log('Gym images:', gym.images.map(img => ({
      _id: img._id.toString(),
      publicId: img.publicId
    })));
    
    const imageToDelete = gym.images.find(img => 
      img.publicId === decodedImageId || img._id.toString() === decodedImageId
    );

    console.log('Image to delete:', imageToDelete);

    if (!imageToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    try {
      // Delete from Cloudinary first
      await deleteFromCloudinary(imageToDelete.publicId);
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Use findByIdAndUpdate to avoid version conflicts
    // Check if decodedImageId is a valid ObjectId format
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(decodedImageId);
    
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