import Member from '../models/Member.js';
import User from '../models/User.js';
import Gym from '../models/Gym.js';
import NotificationService from '../services/notificationService.js';
import SubscriptionHistory from '../models/SubscriptionHistory.js';

// Create manual subscription for a member (Admin only)
export const createManualSubscription = async (req, res) => {
  try {
    const { memberId } = req.params;
    const {
      planName,
      price,
      features,
      startDate,
      duration, // in days
      paymentMethod,
      paymentStatus,
      notes
    } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create manual subscriptions'
      });
    }

    const member = await Member.findById(memberId).populate('gym', 'gymName owner');
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Calculate end date based on duration
    const subscriptionStartDate = startDate ? new Date(startDate) : new Date();
    const subscriptionEndDate = new Date(subscriptionStartDate);
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + (duration || 30));

    // Update member subscription
    member.membershipPlan = {
      name: planName || member.membershipPlan?.name || 'Manual Subscription',
      price: price || member.membershipPlan?.price || 0,
      features: features || member.membershipPlan?.features || [],
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate
    };

    member.paymentDetails = {
      method: paymentMethod || 'manual',
      lastPaymentDate: subscriptionStartDate,
      nextPaymentDate: subscriptionEndDate,
      paymentStatus: paymentStatus || 'paid',
      receiptPath: null
    };

    member.status = 'active';

    // Save previous plan for history
    const previousPlan = member.membershipPlan ? {
      name: member.membershipPlan.name,
      price: member.membershipPlan.price,
      startDate: member.membershipPlan.startDate,
      endDate: member.membershipPlan.endDate,
      features: member.membershipPlan.features || []
    } : null;

    await member.save();

    // Create history record
    try {
      await SubscriptionHistory.create({
        member: member._id,
        action: 'created',
        newPlan: {
          name: member.membershipPlan.name,
          price: member.membershipPlan.price,
          startDate: member.membershipPlan.startDate,
          endDate: member.membershipPlan.endDate,
          features: member.membershipPlan.features || []
        },
        performedBy: req.user.id,
        notes: notes || ''
      });
    } catch (historyError) {
      console.error('Error creating subscription history:', historyError);
    }

    // Send notification to member
    if (member.user) {
      try {
        await NotificationService.createNotification({
          recipient: member.user,
          type: 'subscription_created',
          title: 'New Subscription Activated! 🎉',
          message: `Your subscription "${member.membershipPlan.name}" has been activated. Valid until ${subscriptionEndDate.toLocaleDateString()}.`,
          data: {
            memberId: member._id,
            planName: member.membershipPlan.name,
            endDate: subscriptionEndDate
          },
          link: '/member/subscriptions',
          priority: 'high'
        });
      } catch (notificationError) {
        console.error('Error sending subscription notification:', notificationError);
      }
    }

    // Send notification to gym owner
    if (member.gym && member.gym.owner) {
      try {
        await NotificationService.createNotification({
          recipient: member.gym.owner,
          type: 'member_subscription_created',
          title: 'New Member Subscription',
          message: `Member ${member.firstName} ${member.lastName} has been given a subscription by admin.`,
          data: {
            memberId: member._id,
            memberName: `${member.firstName} ${member.lastName}`,
            planName: member.membershipPlan.name
          },
          link: '/gym-owner/members',
          priority: 'medium'
        });
      } catch (notificationError) {
        console.error('Error sending gym owner notification:', notificationError);
      }
    }

    const updatedMember = await Member.findById(memberId)
      .populate('gym', 'gymName')
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      data: updatedMember
    });

  } catch (error) {
    console.error('Error creating manual subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message
    });
  }
};

// Update existing subscription (Admin only)
export const updateSubscription = async (req, res) => {
  try {
    const { memberId } = req.params;
    const {
      planName,
      price,
      features,
      startDate,
      endDate,
      duration,
      paymentStatus,
      notes
    } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update subscriptions'
      });
    }

    const member = await Member.findById(memberId).populate('gym', 'gymName owner');
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Save previous plan for history
    const previousPlan = member.membershipPlan ? {
      name: member.membershipPlan.name,
      price: member.membershipPlan.price,
      startDate: member.membershipPlan.startDate,
      endDate: member.membershipPlan.endDate,
      features: member.membershipPlan.features || []
    } : null;

    // Update membership plan
    if (planName) member.membershipPlan.name = planName;
    if (price !== undefined) member.membershipPlan.price = price;
    if (features) member.membershipPlan.features = features;
    if (startDate) member.membershipPlan.startDate = new Date(startDate);
    if (endDate) {
      member.membershipPlan.endDate = new Date(endDate);
      member.paymentDetails.nextPaymentDate = new Date(endDate);
    } else if (duration) {
      const start = member.membershipPlan.startDate || new Date();
      const newEndDate = new Date(start);
      newEndDate.setDate(newEndDate.getDate() + duration);
      member.membershipPlan.endDate = newEndDate;
      member.paymentDetails.nextPaymentDate = newEndDate;
    }

    if (paymentStatus) {
      member.paymentDetails.paymentStatus = paymentStatus;
    }

    await member.save();

    // Create history record
    try {
      await SubscriptionHistory.create({
        member: member._id,
        action: 'updated',
        previousPlan: previousPlan,
        newPlan: {
          name: member.membershipPlan.name,
          price: member.membershipPlan.price,
          startDate: member.membershipPlan.startDate,
          endDate: member.membershipPlan.endDate,
          features: member.membershipPlan.features || []
        },
        performedBy: req.user.id,
        notes: notes || ''
      });
    } catch (historyError) {
      console.error('Error creating subscription history:', historyError);
    }

    // Send notification to member
    if (member.user) {
      try {
        await NotificationService.createNotification({
          recipient: member.user,
          type: 'subscription_updated',
          title: 'Subscription Updated',
          message: `Your subscription has been updated. New end date: ${member.membershipPlan.endDate.toLocaleDateString()}.`,
          data: {
            memberId: member._id,
            planName: member.membershipPlan.name
          },
          link: '/member/subscriptions',
          priority: 'medium'
        });
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
    }

    // Send notification to gym owner
    if (member.gym && member.gym.owner) {
      try {
        await NotificationService.createNotification({
          recipient: member.gym.owner,
          type: 'member_subscription_updated',
          title: 'Member Subscription Updated',
          message: `Member ${member.firstName} ${member.lastName}'s subscription has been updated by admin.`,
          data: {
            memberId: member._id,
            memberName: `${member.firstName} ${member.lastName}`,
            planName: member.membershipPlan.name
          },
          link: '/gym-owner/members',
          priority: 'medium'
        });
      } catch (notificationError) {
        console.error('Error sending gym owner notification:', notificationError);
      }
    }

    const updatedMember = await Member.findById(memberId)
      .populate('gym', 'gymName')
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedMember
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
      error: error.message
    });
  }
};

// Extend subscription (Admin only)
export const extendSubscription = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { additionalDays } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can extend subscriptions'
      });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const currentEndDate = member.membershipPlan.endDate || new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + (additionalDays || 30));

    member.membershipPlan.endDate = newEndDate;
    member.paymentDetails.nextPaymentDate = newEndDate;

    // Save previous plan for history
    const previousPlan = {
      name: member.membershipPlan.name,
      price: member.membershipPlan.price,
      startDate: member.membershipPlan.startDate,
      endDate: member.membershipPlan.endDate,
      features: member.membershipPlan.features || []
    };

    await member.save();

    // Create history record
    try {
      await SubscriptionHistory.create({
        member: member._id,
        action: 'extended',
        previousPlan: previousPlan,
        newPlan: {
          name: member.membershipPlan.name,
          price: member.membershipPlan.price,
          startDate: member.membershipPlan.startDate,
          endDate: member.membershipPlan.endDate,
          features: member.membershipPlan.features || []
        },
        performedBy: req.user.id,
        notes: `Extended by ${additionalDays || 30} days`
      });
    } catch (historyError) {
      console.error('Error creating subscription history:', historyError);
    }

    // Send notification
    if (member.user) {
      try {
        await NotificationService.createNotification({
          recipient: member.user,
          type: 'subscription_extended',
          title: 'Subscription Extended! 🎉',
          message: `Your subscription has been extended by ${additionalDays || 30} days. New end date: ${newEndDate.toLocaleDateString()}.`,
          data: {
            memberId: member._id,
            newEndDate: newEndDate
          },
          link: '/member/subscriptions',
          priority: 'high'
        });
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
    }

    const updatedMember = await Member.findById(memberId)
      .populate('gym', 'gymName')
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Subscription extended successfully',
      data: updatedMember
    });

  } catch (error) {
    console.error('Error extending subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extend subscription',
      error: error.message
    });
  }
};

// Get all subscriptions with filters (Admin only)
export const getAllSubscriptions = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all subscriptions'
      });
    }

    const {
      gymId,
      status,
      paymentStatus,
      expiringSoon, // days
      search,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (gymId) query.gym = gymId;
    if (status) query.status = status;
    if (paymentStatus) query['paymentDetails.paymentStatus'] = paymentStatus;

    if (expiringSoon) {
      const days = parseInt(expiringSoon);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      query['membershipPlan.endDate'] = {
        $lte: futureDate,
        $gte: new Date()
      };
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'membershipPlan.name': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const members = await Member.find(query)
      .populate('gym', 'gymName')
      .populate('user', 'firstName lastName email')
      .sort({ 'membershipPlan.endDate': 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Member.countDocuments(query);

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
};

// Get subscription statistics (Admin only)
export const getSubscriptionStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view subscription statistics'
      });
    }

    const totalActive = await Member.countDocuments({ status: 'active' });
    const totalSuspended = await Member.countDocuments({ status: 'suspended' });
    const totalInactive = await Member.countDocuments({ status: 'inactive' });

    const paidSubscriptions = await Member.countDocuments({ 'paymentDetails.paymentStatus': 'paid' });
    const pendingSubscriptions = await Member.countDocuments({ 'paymentDetails.paymentStatus': 'pending' });
    const overdueSubscriptions = await Member.countDocuments({ 'paymentDetails.paymentStatus': 'overdue' });

    // Expiring in next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringSoon = await Member.countDocuments({
      'membershipPlan.endDate': {
        $lte: sevenDaysFromNow,
        $gte: new Date()
      },
      status: 'active'
    });

    // Total revenue (sum of all active subscription prices)
    const activeMembers = await Member.find({ status: 'active' });
    const totalRevenue = activeMembers.reduce((sum, member) => {
      return sum + (member.membershipPlan?.price || 0);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        totalActive,
        totalSuspended,
        totalInactive,
        paymentStatus: {
          paid: paidSubscriptions,
          pending: pendingSubscriptions,
          overdue: overdueSubscriptions
        },
        expiringSoon,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Error fetching subscription stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription statistics',
      error: error.message
    });
  }
};

