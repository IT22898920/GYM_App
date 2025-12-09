import SuspensionHistory from '../models/SuspensionHistory.js';
import SubscriptionHistory from '../models/SubscriptionHistory.js';

// Get suspension history (Admin only)
export const getSuspensionHistory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view suspension history'
      });
    }

    const {
      entityType,
      entityId,
      action,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (action) query.action = action;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const history = await SuspensionHistory.find(query)
      .populate('suspendedBy', 'firstName lastName email')
      .populate('gymId', 'gymName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SuspensionHistory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching suspension history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suspension history',
      error: error.message
    });
  }
};

// Get subscription history (Admin only)
export const getSubscriptionHistory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view subscription history'
      });
    }

    const { memberId } = req.params;
    const {
      action,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (memberId) query.member = memberId;
    if (action) query.action = action;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const history = await SubscriptionHistory.find(query)
      .populate('member', 'firstName lastName email')
      .populate('performedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SubscriptionHistory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription history',
      error: error.message
    });
  }
};

// Get suspension statistics (Admin only)
export const getSuspensionStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view suspension statistics'
      });
    }

    const totalSuspensions = await SuspensionHistory.countDocuments({ action: 'suspended' });
    const totalUnsuspensions = await SuspensionHistory.countDocuments({ action: 'unsuspended' });
    const gymSuspensions = await SuspensionHistory.countDocuments({ entityType: 'gym', action: 'suspended' });
    const instructorSuspensions = await SuspensionHistory.countDocuments({ entityType: 'instructor', action: 'suspended' });

    // Recent suspensions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSuspensions = await SuspensionHistory.countDocuments({
      action: 'suspended',
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSuspensions,
        totalUnsuspensions,
        gymSuspensions,
        instructorSuspensions,
        recentSuspensions
      }
    });

  } catch (error) {
    console.error('Error fetching suspension stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suspension statistics',
      error: error.message
    });
  }
};

