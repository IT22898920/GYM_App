import InstructorApplication from '../models/InstructorApplication.js';
import User from '../models/User.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// Submit instructor application
export const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      experience,
      availability,
      preferredLocation,
      isFreelance,
      motivation
    } = req.body;

    // Parse availability if it's a string
    let parsedAvailability = availability;
    if (typeof availability === 'string') {
      try {
        parsedAvailability = JSON.parse(availability);
      } catch (e) {
        parsedAvailability = [availability];
      }
    }

    // Check if user already has a pending application
    const existingApplication = await InstructorApplication.findOne({
      applicant: req.user.id,
      status: { $in: ['pending', 'under_review'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending instructor application. Please wait for review.'
      });
    }

    // Create application data
    const applicationData = {
      applicant: req.user.id,
      firstName,
      lastName,
      email,
      phone,
      specialization,
      experience: parseInt(experience),
      availability: parsedAvailability,
      preferredLocation,
      isFreelance: isFreelance === 'true',
      motivation
    };

    // Handle file uploads from Cloudinary middleware
    if (req.uploadedFiles) {
      if (req.uploadedFiles.resume) {
        applicationData.resume = {
          url: req.uploadedFiles.resume.url,
          publicId: req.uploadedFiles.resume.publicId,
          originalName: req.uploadedFiles.resume.originalName,
          size: req.uploadedFiles.resume.size,
          format: req.uploadedFiles.resume.format
        };
      }

      if (req.uploadedFiles.profilePicture) {
        applicationData.profilePicture = {
          url: req.uploadedFiles.profilePicture.url,
          publicId: req.uploadedFiles.profilePicture.publicId,
          originalName: req.uploadedFiles.profilePicture.originalName,
          size: req.uploadedFiles.profilePicture.size,
          format: req.uploadedFiles.profilePicture.format,
          width: req.uploadedFiles.profilePicture.width,
          height: req.uploadedFiles.profilePicture.height
        };
      }

      if (req.uploadedFiles.certifications && req.uploadedFiles.certifications.length > 0) {
        applicationData.certifications = req.uploadedFiles.certifications.map(cert => ({
          url: cert.url,
          publicId: cert.publicId,
          originalName: cert.originalName,
          size: cert.size,
          format: cert.format
        }));
      }
    }

    // Create the application
    const application = new InstructorApplication(applicationData);
    await application.save();

    // Populate applicant info
    const populatedApplication = await InstructorApplication.findById(application._id)
      .populate('applicant', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      message: 'Instructor application submitted successfully. We will review your application and get back to you soon.',
      data: populatedApplication
    });

  } catch (error) {
    console.error('Error submitting instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit instructor application',
      error: error.message
    });
  }
};

// Get all instructor applications (Admin only)
export const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      specialization,
      search
    } = req.query;

    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Specialization filter
    if (specialization) {
      filter.specialization = specialization;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const applications = await InstructorApplication.find(filter)
      .populate('applicant', 'firstName lastName email role')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InstructorApplication.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching instructor applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor applications',
      error: error.message
    });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role phone')
      .populate('reviewedBy', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    // Check if user can view this application
    if (req.user.role !== 'admin' && application.applicant._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor application',
      error: error.message
    });
  }
};

// Get user's own applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await InstructorApplication.find({ applicant: req.user.id })
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your applications',
      error: error.message
    });
  }
};

// Approve instructor application (Admin only)
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const application = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    if (application.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Application is already approved'
      });
    }

    // Approve the application
    await application.approve(req.user.id, adminNotes);

    // Update user role to instructor if they are a customer
    if (application.applicant.role === 'customer') {
      await User.findByIdAndUpdate(
        application.applicant._id,
        { 
          role: 'instructor',
          specialization: [application.specialization],
          experience: application.experience
        }
      );
    }

    // Populate the updated application
    const updatedApplication = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role')
      .populate('reviewedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Instructor application approved successfully',
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error approving instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve instructor application',
      error: error.message
    });
  }
};

// Reject instructor application (Admin only)
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const application = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    if (application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Application is already rejected'
      });
    }

    // Reject the application
    await application.reject(req.user.id, adminNotes);

    // Populate the updated application
    const updatedApplication = await InstructorApplication.findById(id)
      .populate('applicant', 'firstName lastName email role')
      .populate('reviewedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Instructor application rejected',
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error rejecting instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject instructor application',
      error: error.message
    });
  }
};

// Delete instructor application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await InstructorApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Instructor application not found'
      });
    }

    // Check if user can delete this application
    if (req.user.role !== 'admin' && application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    // Delete files from Cloudinary
    const filesToDelete = [];
    
    if (application.resume?.publicId) {
      filesToDelete.push(application.resume.publicId);
    }
    
    if (application.profilePicture?.publicId) {
      filesToDelete.push(application.profilePicture.publicId);
    }
    
    if (application.certifications?.length > 0) {
      application.certifications.forEach(cert => {
        if (cert.publicId) {
          filesToDelete.push(cert.publicId);
        }
      });
    }

    // Delete files from Cloudinary
    for (const publicId of filesToDelete) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error(`Error deleting file ${publicId} from Cloudinary:`, error);
      }
    }

    // Delete the application
    await InstructorApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Instructor application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting instructor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete instructor application',
      error: error.message
    });
  }
};

// Get instructor application statistics (Admin only)
export const getApplicationStats = async (req, res) => {
  try {
    const totalApplications = await InstructorApplication.countDocuments();
    const pendingApplications = await InstructorApplication.countDocuments({ status: 'pending' });
    const approvedApplications = await InstructorApplication.countDocuments({ status: 'approved' });
    const rejectedApplications = await InstructorApplication.countDocuments({ status: 'rejected' });
    const underReviewApplications = await InstructorApplication.countDocuments({ status: 'under_review' });

    // Get applications by specialization
    const applicationsBySpecialization = await InstructorApplication.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentApplications = await InstructorApplication.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          underReviewApplications,
          recentApplications
        },
        applicationsBySpecialization
      }
    });

  } catch (error) {
    console.error('Error fetching instructor application statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor application statistics',
      error: error.message
    });
  }
};