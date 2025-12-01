import User from '../models/User.js';
import { subscribeToTopic, unsubscribeFromTopic } from '../services/fcmService.js';

/**
 * @desc    Register mobile device for push notifications
 * @route   POST /api/mobile/register-device
 * @access  Private
 */
export const registerDevice = async (req, res) => {
  try {
    const { deviceToken, platform, deviceInfo } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!deviceToken || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Device token and platform are required'
      });
    }

    // Validate platform
    if (!['ios', 'android', 'web'].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Platform must be one of: ios, android, web'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if token already exists
    const existingTokenIndex = user.deviceTokens.findIndex(
      dt => dt.token === deviceToken
    );

    if (existingTokenIndex !== -1) {
      // Update existing token
      user.deviceTokens[existingTokenIndex].lastUsed = new Date();
      user.deviceTokens[existingTokenIndex].platform = platform;
      if (deviceInfo) {
        user.deviceTokens[existingTokenIndex].deviceInfo = deviceInfo;
      }
    } else {
      // Add new token
      user.deviceTokens.push({
        token: deviceToken,
        platform: platform,
        deviceInfo: deviceInfo || {},
        createdAt: new Date(),
        lastUsed: new Date()
      });
    }

    await user.save();

    // Subscribe to role-based topic
    try {
      await subscribeToTopic(deviceToken, `${user.role}_notifications`);
      await subscribeToTopic(deviceToken, 'all_users');
    } catch (error) {
      console.error('Error subscribing to topics:', error.message);
      // Don't fail the request if topic subscription fails
    }

    res.status(200).json({
      success: true,
      message: 'Device registered successfully',
      data: {
        deviceToken: deviceToken,
        platform: platform,
        totalDevices: user.deviceTokens.length
      }
    });
  } catch (error) {
    console.error('Error in registerDevice:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering device',
      error: error.message
    });
  }
};

/**
 * @desc    Unregister mobile device (logout)
 * @route   POST /api/mobile/unregister-device
 * @access  Private
 */
export const unregisterDevice = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    const userId = req.user.id;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    // Find user and remove the device token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove the device token
    user.deviceTokens = user.deviceTokens.filter(
      dt => dt.token !== deviceToken
    );

    await user.save();

    // Unsubscribe from topics
    try {
      await unsubscribeFromTopic(deviceToken, `${user.role}_notifications`);
      await unsubscribeFromTopic(deviceToken, 'all_users');
    } catch (error) {
      console.error('Error unsubscribing from topics:', error.message);
      // Don't fail the request
    }

    res.status(200).json({
      success: true,
      message: 'Device unregistered successfully',
      data: {
        remainingDevices: user.deviceTokens.length
      }
    });
  } catch (error) {
    console.error('Error in unregisterDevice:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering device',
      error: error.message
    });
  }
};

/**
 * @desc    Get all registered devices for current user
 * @route   GET /api/mobile/devices
 * @access  Private
 */
export const getRegisteredDevices = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('deviceTokens');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format device info (hide actual tokens for security)
    const devices = user.deviceTokens.map(dt => ({
      id: dt._id,
      platform: dt.platform,
      deviceInfo: dt.deviceInfo,
      createdAt: dt.createdAt,
      lastUsed: dt.lastUsed,
      tokenPreview: dt.token.substring(0, 20) + '...' // Show only first 20 chars
    }));

    res.status(200).json({
      success: true,
      data: {
        devices: devices,
        totalDevices: devices.length
      }
    });
  } catch (error) {
    console.error('Error in getRegisteredDevices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching devices',
      error: error.message
    });
  }
};

/**
 * @desc    Remove a specific device by ID
 * @route   DELETE /api/mobile/devices/:deviceId
 * @access  Private
 */
export const removeDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the device token to unsubscribe from topics
    const deviceToken = user.deviceTokens.find(
      dt => dt._id.toString() === deviceId
    );

    if (!deviceToken) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Remove the device
    user.deviceTokens = user.deviceTokens.filter(
      dt => dt._id.toString() !== deviceId
    );

    await user.save();

    // Unsubscribe from topics
    try {
      await unsubscribeFromTopic(deviceToken.token, `${user.role}_notifications`);
      await unsubscribeFromTopic(deviceToken.token, 'all_users');
    } catch (error) {
      console.error('Error unsubscribing from topics:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Device removed successfully',
      data: {
        remainingDevices: user.deviceTokens.length
      }
    });
  } catch (error) {
    console.error('Error in removeDevice:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing device',
      error: error.message
    });
  }
};

/**
 * @desc    Update device token (when FCM token is refreshed)
 * @route   PUT /api/mobile/update-token
 * @access  Private
 */
export const updateDeviceToken = async (req, res) => {
  try {
    const { oldToken, newToken, platform, deviceInfo } = req.body;
    const userId = req.user.id;

    if (!oldToken || !newToken) {
      return res.status(400).json({
        success: false,
        message: 'Both old and new tokens are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find and update the token
    const tokenIndex = user.deviceTokens.findIndex(
      dt => dt.token === oldToken
    );

    if (tokenIndex !== -1) {
      user.deviceTokens[tokenIndex].token = newToken;
      user.deviceTokens[tokenIndex].lastUsed = new Date();
      if (platform) user.deviceTokens[tokenIndex].platform = platform;
      if (deviceInfo) user.deviceTokens[tokenIndex].deviceInfo = deviceInfo;

      await user.save();

      // Update topic subscriptions
      try {
        await unsubscribeFromTopic(oldToken, `${user.role}_notifications`);
        await unsubscribeFromTopic(oldToken, 'all_users');
        await subscribeToTopic(newToken, `${user.role}_notifications`);
        await subscribeToTopic(newToken, 'all_users');
      } catch (error) {
        console.error('Error updating topic subscriptions:', error.message);
      }

      res.status(200).json({
        success: true,
        message: 'Device token updated successfully'
      });
    } else {
      // Old token not found, register as new
      user.deviceTokens.push({
        token: newToken,
        platform: platform || 'android',
        deviceInfo: deviceInfo || {},
        createdAt: new Date(),
        lastUsed: new Date()
      });

      await user.save();

      try {
        await subscribeToTopic(newToken, `${user.role}_notifications`);
        await subscribeToTopic(newToken, 'all_users');
      } catch (error) {
        console.error('Error subscribing to topics:', error.message);
      }

      res.status(200).json({
        success: true,
        message: 'New device token registered'
      });
    }
  } catch (error) {
    console.error('Error in updateDeviceToken:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating device token',
      error: error.message
    });
  }
};

/**
 * @desc    Check app version and force update if needed
 * @route   GET /api/mobile/version-check
 * @access  Public
 */
export const checkAppVersion = async (req, res) => {
  try {
    const { version, platform } = req.query;

    // Define minimum required versions
    const minVersions = {
      ios: process.env.MIN_IOS_VERSION || '1.0.0',
      android: process.env.MIN_ANDROID_VERSION || '1.0.0'
    };

    // Latest versions
    const latestVersions = {
      ios: process.env.LATEST_IOS_VERSION || '1.0.0',
      android: process.env.LATEST_ANDROID_VERSION || '1.0.0'
    };

    // Check if update is required
    const currentVersion = version || '0.0.0';
    const minVersion = minVersions[platform] || '1.0.0';
    const latestVersion = latestVersions[platform] || '1.0.0';

    // Simple version comparison (you may want to use a library like semver)
    const forceUpdate = compareVersions(currentVersion, minVersion) < 0;
    const updateAvailable = compareVersions(currentVersion, latestVersion) < 0;

    res.status(200).json({
      success: true,
      data: {
        currentVersion: currentVersion,
        latestVersion: latestVersion,
        minVersion: minVersion,
        forceUpdate: forceUpdate,
        updateAvailable: updateAvailable,
        message: forceUpdate
          ? 'Please update to the latest version to continue using the app'
          : updateAvailable
          ? 'A new version is available'
          : 'You are using the latest version'
      }
    });
  } catch (error) {
    console.error('Error in checkAppVersion:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking app version',
      error: error.message
    });
  }
};

// Helper function to compare versions
const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
};

export default {
  registerDevice,
  unregisterDevice,
  getRegisteredDevices,
  removeDevice,
  updateDeviceToken,
  checkAppVersion
};
