import Gif from '../models/Gif.js';
import NotificationService from '../services/notificationService.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

export const uploadGif = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Workout name is required' });
    }

    if (!req.uploadedGif) {
      return res.status(400).json({ success: false, message: 'GIF upload missing' });
    }

    const gif = await Gif.create({
      name: name.trim(),
      url: req.uploadedGif.url,
      publicId: req.uploadedGif.publicId,
      uploadedBy: req.user?._id || null,
    });

    // Create notifications for all users
    try {
      await NotificationService.notifyWorkoutGifUploaded(gif, req.user?._id || null);
      
      // Emit socket event to notify all connected users
      if (req.app.locals.io) {
        req.app.locals.io.of('/notifications').to('general').emit('workoutAdded', {
          type: 'workout_gif_uploaded',
          title: 'New Workout Added! 💪',
          message: `A new workout "${gif.name}" has been added to the system. Check it out!`,
          data: {
            gifId: gif._id,
            gifName: gif.name,
            gifUrl: gif.url,
            uploadedBy: req.user?._id || null
          },
          link: '/workouts'
        });
      }
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Don't fail the upload if notifications fail
    }

    return res.status(201).json({ success: true, data: gif });
  } catch (error) {
    console.error('Upload GIF error:', error);
    return res.status(500).json({ success: false, message: 'Server error uploading GIF' });
  }
};

export const listGifs = async (req, res) => {
  try {
    const gifs = await Gif.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: gifs });
  } catch (error) {
    console.error('List GIFs error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching GIFs' });
  }
};

// Delete a GIF
export const deleteGif = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the GIF first to get the Cloudinary public ID
    const gif = await Gif.findById(id);
    if (!gif) {
      return res.status(404).json({ success: false, message: 'GIF not found' });
    }

    // Delete from Cloudinary if publicId exists
    if (gif.publicId) {
      try {
        await deleteFromCloudinary(gif.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await Gif.findByIdAndDelete(id);

    return res.status(200).json({ 
      success: true, 
      message: 'GIF deleted successfully' 
    });
  } catch (error) {
    console.error('Delete GIF error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting GIF' });
  }
};

// Update a GIF (name only)
export const updateGif = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Workout name is required' });
    }

    const gif = await Gif.findById(id);
    if (!gif) {
      return res.status(404).json({ success: false, message: 'GIF not found' });
    }

    // Update the name
    gif.name = name.trim();
    await gif.save();

    return res.status(200).json({ 
      success: true, 
      message: 'GIF updated successfully',
      data: gif
    });
  } catch (error) {
    console.error('Update GIF error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating GIF' });
  }
};


