import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Flag to track if Firebase is initialized
let isFirebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 * This should be called once when the server starts
 */
export const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (isFirebaseInitialized) {
      console.log('Firebase Admin SDK already initialized');
      return true;
    }

    // Check if Firebase credentials are provided
    if (!process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_PRIVATE_KEY ||
        !process.env.FIREBASE_CLIENT_EMAIL) {
      console.warn('Firebase credentials not found in .env file. Push notifications will be disabled.');
      console.warn('To enable push notifications, add FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL to your .env file.');
      return false;
    }

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    isFirebaseInitialized = true;
    console.log('Firebase Admin SDK initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
    console.warn('Push notifications will be disabled. Please check your Firebase configuration.');
    return false;
  }
};

/**
 * Send push notification to a single device
 * @param {string} deviceToken - FCM device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<string|null>} - Message ID or null if failed
 */
export const sendPushNotification = async (deviceToken, title, body, data = {}) => {
  try {
    // Check if Firebase is initialized
    if (!isFirebaseInitialized) {
      console.warn('Firebase not initialized. Skipping push notification.');
      return null;
    }

    // Validate inputs
    if (!deviceToken || !title || !body) {
      throw new Error('Device token, title, and body are required');
    }

    // Prepare the message
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      token: deviceToken,
      // Android specific options
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'gym_app_channel',
        },
      },
      // iOS specific options
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    // Send the message
    const response = await admin.messaging().send(message);
    console.log('Push notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error.message);

    // Handle invalid token error
    if (error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered') {
      console.log('Invalid device token. It should be removed from database.');
      // Return special error code so caller can remove the token
      throw new Error('INVALID_TOKEN');
    }

    throw error;
  }
};

/**
 * Send push notification to multiple devices
 * @param {string[]} deviceTokens - Array of FCM device tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<object>} - Results object with success and failure counts
 */
export const sendPushNotificationToMultipleDevices = async (deviceTokens, title, body, data = {}) => {
  try {
    // Check if Firebase is initialized
    if (!isFirebaseInitialized) {
      console.warn('Firebase not initialized. Skipping push notifications.');
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    // Validate inputs
    if (!deviceTokens || deviceTokens.length === 0) {
      throw new Error('At least one device token is required');
    }

    if (!title || !body) {
      throw new Error('Title and body are required');
    }

    // Prepare the message
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      // Android specific options
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'gym_app_channel',
        },
      },
      // iOS specific options
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    // Send to multiple devices
    const response = await admin.messaging().sendEachForMulticast({
      tokens: deviceTokens,
      ...message,
    });

    console.log(`Push notifications sent: ${response.successCount} successful, ${response.failureCount} failed`);

    // Collect invalid tokens
    const invalidTokens = [];
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const error = resp.error;
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(deviceTokens[idx]);
          }
        }
      });
    }

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens: invalidTokens,
    };
  } catch (error) {
    console.error('Error sending push notifications to multiple devices:', error.message);
    throw error;
  }
};

/**
 * Send push notification to a user (all their devices)
 * @param {object} user - User object with deviceTokens array
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<object>} - Results object
 */
export const sendPushNotificationToUser = async (user, title, body, data = {}) => {
  try {
    // Check if user has any device tokens
    if (!user.deviceTokens || user.deviceTokens.length === 0) {
      console.log(`User ${user._id} has no device tokens registered`);
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    // Extract token strings from device tokens
    const tokens = user.deviceTokens.map(dt => dt.token);

    // Send to all user's devices
    const result = await sendPushNotificationToMultipleDevices(tokens, title, body, data);

    // If there are invalid tokens, remove them from user's device tokens
    if (result.invalidTokens && result.invalidTokens.length > 0) {
      console.log(`Removing ${result.invalidTokens.length} invalid tokens from user ${user._id}`);
      // Note: The caller should handle removing invalid tokens from database
    }

    return result;
  } catch (error) {
    console.error('Error sending push notification to user:', error.message);
    throw error;
  }
};

/**
 * Send topic-based notification (for broadcasting to all users)
 * @param {string} topic - Topic name (e.g., 'all_users', 'gym_owners')
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data
 * @returns {Promise<string|null>} - Message ID or null
 */
export const sendTopicNotification = async (topic, title, body, data = {}) => {
  try {
    // Check if Firebase is initialized
    if (!isFirebaseInitialized) {
      console.warn('Firebase not initialized. Skipping topic notification.');
      return null;
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      topic: topic,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('Topic notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending topic notification:', error.message);
    throw error;
  }
};

/**
 * Subscribe device token to a topic
 * @param {string|string[]} tokens - Device token(s)
 * @param {string} topic - Topic name
 * @returns {Promise<object>} - Subscription result
 */
export const subscribeToTopic = async (tokens, topic) => {
  try {
    if (!isFirebaseInitialized) {
      console.warn('Firebase not initialized. Cannot subscribe to topic.');
      return null;
    }

    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    const response = await admin.messaging().subscribeToTopic(tokenArray, topic);
    console.log(`Subscribed ${response.successCount} devices to topic: ${topic}`);
    return response;
  } catch (error) {
    console.error('Error subscribing to topic:', error.message);
    throw error;
  }
};

/**
 * Unsubscribe device token from a topic
 * @param {string|string[]} tokens - Device token(s)
 * @param {string} topic - Topic name
 * @returns {Promise<object>} - Unsubscription result
 */
export const unsubscribeFromTopic = async (tokens, topic) => {
  try {
    if (!isFirebaseInitialized) {
      console.warn('Firebase not initialized. Cannot unsubscribe from topic.');
      return null;
    }

    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    const response = await admin.messaging().unsubscribeFromTopic(tokenArray, topic);
    console.log(`Unsubscribed ${response.successCount} devices from topic: ${topic}`);
    return response;
  } catch (error) {
    console.error('Error unsubscribing from topic:', error.message);
    throw error;
  }
};

export default {
  initializeFirebase,
  sendPushNotification,
  sendPushNotificationToMultipleDevices,
  sendPushNotificationToUser,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
};
