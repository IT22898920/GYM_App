import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendPushNotificationToUser, sendPushNotificationToMultipleDevices } from './fcmService.js';

class NotificationService {
  // Create a single notification
  static async createNotification({ recipient, sender, type, title, message, data = {}, link = null, priority = 'medium', sendPush = true }) {
    try {
      const notification = await Notification.createNotification({
        recipient,
        sender,
        type,
        title,
        message,
        data,
        link,
        priority
      });

      // Send push notification to mobile devices
      if (sendPush) {
        try {
          const user = await User.findById(recipient).select('deviceTokens');
          if (user && user.deviceTokens && user.deviceTokens.length > 0) {
            await sendPushNotificationToUser(user, title, message, {
              type,
              notificationId: notification._id.toString(),
              link: link || '',
              ...data
            });
          }
        } catch (pushError) {
          console.error('Error sending push notification:', pushError.message);
          // Don't fail the whole operation if push notification fails
        }
      }

      // Here you could add real-time notification via Socket.io if implemented
      // io.to(recipient.toString()).emit('newNotification', notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notifications for multiple recipients
  static async createBulkNotifications({ recipients, sender, type, title, message, data = {}, link = null, priority = 'medium', sendPush = true }) {
    try {
      const notifications = await Promise.all(
        recipients.map(recipient =>
          this.createNotification({
            recipient,
            sender,
            type,
            title,
            message,
            data,
            link,
            priority,
            sendPush // Pass the sendPush parameter
          })
        )
      );

      return notifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Notification templates for different actions
  static async notifyGymRegistration(gym, status) {
    const owner = await User.findById(gym.owner);
    const templates = {
      pending: {
        title: 'Gym Registration Submitted',
        message: `Your gym "${gym.gymName}" registration has been submitted and is pending review.`
      },
      approved: {
        title: 'Gym Registration Approved! 🎉',
        message: `Congratulations! Your gym "${gym.gymName}" has been approved and is now active.`
      },
      rejected: {
        title: 'Gym Registration Update',
        message: `Your gym "${gym.gymName}" registration needs attention. Please review the feedback and resubmit.`
      }
    };

    const template = templates[status];
    if (!template) return;

    return this.createNotification({
      recipient: owner._id,
      type: `gym_registration_${status}`,
      title: template.title,
      message: template.message,
      data: { gymId: gym._id, gymName: gym.gymName },
      link: status === 'approved' ? `/gym-owner/dashboard` : `/gym-owner/gym-registrations`,
      priority: status === 'rejected' ? 'high' : 'medium'
    });
  }

  static async notifyInstructorApplication(application, status) {
    const templates = {
      pending: {
        title: 'Instructor Application Received',
        message: 'Your instructor application has been submitted successfully. We will review it soon.'
      },
      approved: {
        title: 'Instructor Application Approved! 🎉',
        message: 'Congratulations! You are now a verified instructor. You can start accepting gym invitations.'
      },
      rejected: {
        title: 'Instructor Application Update',
        message: 'Your instructor application needs additional information. Please review and resubmit.'
      }
    };

    const template = templates[status];
    if (!template) return;

    return this.createNotification({
      recipient: application.applicant,
      type: `instructor_application_${status}`,
      title: template.title,
      message: template.message,
      data: { applicationId: application._id },
      link: status === 'approved' ? `/instructor/dashboard` : `/apply-instructor`,
      priority: status === 'rejected' ? 'high' : 'medium'
    });
  }

  static async notifyCollaborationRequest(request, action) {
    switch (action) {
      case 'sent':
        // Notify instructor about new request
        await this.createNotification({
          recipient: request.toInstructor,
          sender: request.fromGymOwner,
          type: 'collaboration_request_received',
          title: 'New Collaboration Request',
          message: `${request.gym.gymName} wants to collaborate with you as a freelance instructor.`,
          data: { requestId: request._id, gymId: request.gym._id },
          link: `/instructor/collaboration-requests`,
          priority: 'high'
        });
        break;

      case 'accepted':
        // Notify gym owner about acceptance
        await this.createNotification({
          recipient: request.fromGymOwner,
          sender: request.toInstructor,
          type: 'collaboration_request_accepted',
          title: 'Collaboration Request Accepted! 🎉',
          message: `The instructor has accepted your collaboration request for ${request.gym.gymName}.`,
          data: { requestId: request._id, instructorId: request.toInstructor },
          link: `/gym-owner/instructors`,
          priority: 'high'
        });
        break;

      case 'rejected':
        // Notify gym owner about rejection
        await this.createNotification({
          recipient: request.fromGymOwner,
          sender: request.toInstructor,
          type: 'collaboration_request_rejected',
          title: 'Collaboration Request Update',
          message: `The instructor has declined your collaboration request for ${request.gym.gymName}.`,
          data: { requestId: request._id },
          link: `/gym-owner/apply-to-instructors`,
          priority: 'medium'
        });
        break;

      case 'cancelled':
        // Notify instructor about cancellation
        await this.createNotification({
          recipient: request.toInstructor,
          sender: request.fromGymOwner,
          type: 'collaboration_request_cancelled',
          title: 'Collaboration Request Cancelled',
          message: `The collaboration request from ${request.gym.gymName} has been cancelled.`,
          data: { requestId: request._id },
          priority: 'low'
        });
        break;
    }
  }

  static async notifyInstructorAddedToGym(instructor, gym, addedBy) {
    return this.createNotification({
      recipient: instructor._id,
      sender: addedBy,
      type: 'instructor_added_to_gym',
      title: 'Added to Gym',
      message: `You have been added as an instructor at ${gym.gymName}.`,
      data: { gymId: gym._id, gymName: gym.gymName },
      link: `/instructor/dashboard`,
      priority: 'high'
    });
  }

  static async notifyInstructorRemovedFromGym(instructor, gym, removedBy) {
    return this.createNotification({
      recipient: instructor._id,
      sender: removedBy,
      type: 'instructor_removed_from_gym',
      title: 'Removed from Gym',
      message: `You have been removed as an instructor from ${gym.gymName}.`,
      data: { gymId: gym._id, gymName: gym.gymName },
      priority: 'high'
    });
  }

  static async notifyMemberJoinedGym(member, gym) {
    // Notify gym owner
    await this.createNotification({
      recipient: gym.owner,
      type: 'member_joined_gym',
      title: 'New Member Joined',
      message: `${member.firstName} ${member.lastName} has joined your gym.`,
      data: { memberId: member._id, gymId: gym._id },
      link: `/gym-owner/members`,
      priority: 'medium'
    });

    // Welcome notification to member
    await this.createNotification({
      recipient: member._id,
      type: 'welcome_message',
      title: `Welcome to ${gym.gymName}! 🎉`,
      message: `We're excited to have you as a member. Check out our class schedule and start your fitness journey!`,
      data: { gymId: gym._id },
      link: `/class-schedule`,
      priority: 'medium'
    });
  }

  static async notifyClassScheduled(classData, instructor, gym) {
    // Notify gym members
    const members = await User.find({ 
      _id: { $in: gym.members },
      isActive: true 
    });

    await this.createBulkNotifications({
      recipients: members.map(m => m._id),
      sender: instructor._id,
      type: 'class_scheduled',
      title: 'New Class Available',
      message: `New ${classData.className} class scheduled for ${classData.dateTime}`,
      data: { classId: classData._id, className: classData.className },
      link: `/class-schedule`,
      priority: 'medium'
    });
  }

  static async notifyProfileUpdate(user, updatedFields) {
    const fieldsList = Object.keys(updatedFields).join(', ');
    return this.createNotification({
      recipient: user._id,
      type: 'profile_updated',
      title: 'Profile Updated',
      message: `Your profile has been updated successfully. Updated fields: ${fieldsList}`,
      priority: 'low'
    });
  }

  static async notifyPasswordChange(user) {
    return this.createNotification({
      recipient: user._id,
      type: 'password_changed',
      title: 'Password Changed',
      message: 'Your password has been changed successfully. If this wasn\'t you, please contact support immediately.',
      priority: 'high'
    });
  }

  static async notifySystemAnnouncement(title, message, recipients = null, priority = 'medium') {
    if (recipients) {
      // Send to specific users
      return this.createBulkNotifications({
        recipients,
        type: 'system_announcement',
        title,
        message,
        priority
      });
    } else {
      // Send to all active users
      const users = await User.find({ isActive: true }).select('_id');
      return this.createBulkNotifications({
        recipients: users.map(u => u._id),
        type: 'system_announcement',
        title,
        message,
        priority
      });
    }
  }

  // Notify all users about new workout GIF upload
  static async notifyWorkoutGifUploaded(gifData, uploadedBy) {
    try {
      // Get all active users
      const users = await User.find({ isActive: true }).select('_id');
      
      if (users.length === 0) return [];

      const notifications = await this.createBulkNotifications({
        recipients: users.map(u => u._id),
        sender: uploadedBy,
        type: 'workout_gif_uploaded',
        title: 'New Workout Added! 💪',
        message: `A new workout "${gifData.name}" has been added to the system. Check it out!`,
        data: { 
          gifId: gifData._id, 
          gifName: gifData.name,
          gifUrl: gifData.url,
          uploadedBy: uploadedBy
        },
        link: '/workouts', // Link to workouts page
        priority: 'medium'
      });

      return notifications;
    } catch (error) {
      console.error('Error creating workout notifications:', error);
      throw error;
    }
  }
}

export default NotificationService;