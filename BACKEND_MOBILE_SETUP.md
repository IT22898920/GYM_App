# Backend Mobile Integration Setup Guide

This guide walks you through setting up the backend to support the Flutter mobile app.

## 📋 Overview

The backend has been updated with the following changes:
- ✅ CORS configuration updated for mobile compatibility
- ✅ Device token management for push notifications
- ✅ Firebase Cloud Messaging (FCM) integration
- ✅ Mobile-specific API endpoints
- ✅ Automated push notifications with in-app notifications

---

## 🔧 Required Dependencies

### Install Firebase Admin SDK

```bash
cd backend
npm install firebase-admin
```

This package is required for sending push notifications to mobile devices.

---

## 🔐 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard
4. Enable Cloud Messaging:
   - Go to **Project Settings** > **Cloud Messaging**
   - Note down your **Server Key** (used for testing)

### Step 2: Generate Service Account Key

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file
4. Extract the following values:
   - `project_id`
   - `private_key`
   - `client_email`

### Step 3: Add Firebase Credentials to .env

Add these variables to your `/backend/.env` file:

```env
# Firebase Cloud Messaging (for push notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Mobile App Version Control (Optional)
MIN_IOS_VERSION=1.0.0
MIN_ANDROID_VERSION=1.0.0
LATEST_IOS_VERSION=1.0.0
LATEST_ANDROID_VERSION=1.0.0
```

**Important Notes:**
- The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes
- Keep the `\n` characters in the private key (they represent line breaks)
- If push notifications are not configured, the server will still run but push notifications will be disabled

---

## 📝 Complete .env File Example

Here's the complete `.env` file with all required variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/gym_management

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_here_minimum_32_characters

# Client URLs
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Firebase Cloud Messaging (Push Notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Mobile App Version Control (Optional)
MIN_IOS_VERSION=1.0.0
MIN_ANDROID_VERSION=1.0.0
LATEST_IOS_VERSION=1.0.0
LATEST_ANDROID_VERSION=1.0.0
```

---

## 🚀 Start the Server

After configuring the environment variables:

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server is running on port 5000 in development mode
MongoDB Connected: ...
Firebase Admin SDK initialized successfully
```

If Firebase credentials are not configured, you'll see:
```
Firebase credentials not found in .env file. Push notifications will be disabled.
```

**Note:** The server will work fine without Firebase, but push notifications won't be sent to mobile devices.

---

## 📱 New Mobile API Endpoints

### 1. Register Device for Push Notifications

**Endpoint:** `POST /api/mobile/register-device`

**Authentication:** Required (Bearer token)

**Body:**
```json
{
  "deviceToken": "fcm_device_token_from_flutter",
  "platform": "ios",
  "deviceInfo": {
    "model": "iPhone 14 Pro",
    "osVersion": "17.0",
    "appVersion": "1.0.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered successfully",
  "data": {
    "deviceToken": "fcm_...",
    "platform": "ios",
    "totalDevices": 2
  }
}
```

### 2. Unregister Device (Logout)

**Endpoint:** `POST /api/mobile/unregister-device`

**Authentication:** Required

**Body:**
```json
{
  "deviceToken": "fcm_device_token_from_flutter"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device unregistered successfully",
  "data": {
    "remainingDevices": 1
  }
}
```

### 3. Get Registered Devices

**Endpoint:** `GET /api/mobile/devices`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "id": "device_id_123",
        "platform": "ios",
        "deviceInfo": {
          "model": "iPhone 14 Pro",
          "osVersion": "17.0",
          "appVersion": "1.0.0"
        },
        "createdAt": "2025-01-15T10:00:00Z",
        "lastUsed": "2025-01-20T15:30:00Z",
        "tokenPreview": "fcmTokenFirstChars..."
      }
    ],
    "totalDevices": 1
  }
}
```

### 4. Update Device Token

**Endpoint:** `PUT /api/mobile/update-token`

**Authentication:** Required

**Body:**
```json
{
  "oldToken": "old_fcm_token",
  "newToken": "new_fcm_token",
  "platform": "android",
  "deviceInfo": {
    "model": "Samsung Galaxy S23",
    "osVersion": "14.0",
    "appVersion": "1.0.1"
  }
}
```

### 5. Check App Version

**Endpoint:** `GET /api/mobile/version-check?version=1.0.0&platform=ios`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": {
    "currentVersion": "1.0.0",
    "latestVersion": "1.0.5",
    "minVersion": "1.0.0",
    "forceUpdate": false,
    "updateAvailable": true,
    "message": "A new version is available"
  }
}
```

### 6. Remove Specific Device

**Endpoint:** `DELETE /api/mobile/devices/:deviceId`

**Authentication:** Required

---

## 🔔 Push Notification System

### How It Works

1. **User logs in on mobile app**
   - App gets FCM token from Firebase
   - Calls `/api/mobile/register-device` with the token
   - Token stored in user's `deviceTokens` array

2. **When a notification is created**
   - Database notification is created (as before)
   - Push notification is automatically sent to all user's registered devices
   - If device token is invalid, it's marked for removal

3. **User logs out**
   - App calls `/api/mobile/unregister-device`
   - Token removed from database
   - No more push notifications to that device

### Notification Flow Example

```javascript
// Example: Payment confirmation
import NotificationService from './services/notificationService.js';

// This will create DB notification AND send push notification
await NotificationService.createNotification({
  recipient: customerId,
  type: 'payment_confirmed',
  title: 'Payment Confirmed! ✅',
  message: 'Your gym membership payment has been verified.',
  data: { memberId: member._id },
  link: '/profile',
  priority: 'high',
  sendPush: true // Push notification will be sent automatically
});
```

### Available Notification Templates

All existing notification templates now support push notifications:

- `notifyGymRegistration()` - Gym approval/rejection
- `notifyInstructorApplication()` - Instructor application status
- `notifyCollaborationRequest()` - Collaboration requests
- `notifyInstructorAddedToGym()` - Instructor assignments
- `notifyMemberJoinedGym()` - New member registrations
- `notifyClassScheduled()` - New class schedules
- `notifyProfileUpdate()` - Profile changes
- `notifyPasswordChange()` - Security notifications
- `notifySystemAnnouncement()` - System-wide announcements
- `notifyWorkoutGifUploaded()` - New workout content

---

## 🧪 Testing Push Notifications

### Option 1: Using Postman

1. Register a test device:
```
POST http://localhost:5000/api/mobile/register-device
Headers: Authorization: Bearer <your_jwt_token>
Body: {
  "deviceToken": "test_token_123",
  "platform": "android"
}
```

2. Create a test notification (will trigger push):
```
POST http://localhost:5000/api/notifications
Headers: Authorization: Bearer <admin_jwt_token>
Body: {
  "recipient": "user_id",
  "title": "Test Push",
  "message": "This is a test push notification",
  "type": "test"
}
```

### Option 2: Using Flutter App (Recommended)

See `FLUTTER_MOBILE_APP_PLAN.md` for complete Flutter setup instructions.

---

## 🛡️ Security Considerations

### Device Token Security

- Device tokens are stored securely in MongoDB
- Tokens are never exposed in API responses (only preview shown)
- Invalid tokens are automatically removed
- Each user can have multiple devices registered

### Firebase Security

- Private keys must be kept secure in `.env` file
- Never commit `.env` to version control
- Use environment variables in production
- Regularly rotate Firebase service account keys

### Rate Limiting (Recommended)

Consider adding rate limiting for mobile endpoints:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const mobileRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/mobile', mobileRateLimiter, mobileRoutes);
```

---

## 📊 Monitoring

### Check Firebase Console

1. Go to **Cloud Messaging** tab
2. View message statistics
3. Check delivery rates
4. Monitor invalid tokens

### Server Logs

The server logs all push notification activities:
```
Push notification sent successfully: projects/xxx/messages/xxx
Removing 2 invalid tokens from user xxx
```

### Database Queries

Check registered devices:
```javascript
// MongoDB query to see all registered devices
db.users.find({
  "deviceTokens": { $exists: true, $ne: [] }
}, {
  email: 1,
  "deviceTokens.platform": 1,
  "deviceTokens.createdAt": 1
})
```

---

## 🔄 Migration Guide (Existing Users)

If you have existing users before this update:

1. **No action required for existing data**
   - The `deviceTokens` field is optional
   - Existing users will have empty `deviceTokens` array by default

2. **Users must re-login on mobile app**
   - Mobile app will register device token on first login
   - Push notifications will start working automatically

3. **Database migration (optional)**
```javascript
// Add deviceTokens field to all users (if not exists)
db.users.updateMany(
  { deviceTokens: { $exists: false } },
  { $set: { deviceTokens: [] } }
)
```

---

## ❓ Troubleshooting

### Issue: "Firebase not initialized" error

**Solution:**
- Check if Firebase credentials are in `.env`
- Verify the private key format (must include `\n` characters)
- Restart the server after adding credentials

### Issue: Push notifications not received

**Solution:**
- Verify device token is registered: `GET /api/mobile/devices`
- Check Firebase Console for delivery status
- Ensure mobile app has notification permissions
- Check device token is valid (not expired)

### Issue: Invalid token errors

**Solution:**
- Tokens are automatically removed when invalid
- User should logout and login again to get new token
- Check if FCM token is being refreshed in Flutter app

### Issue: CORS errors from mobile app

**Solution:**
- Mobile apps don't send Origin header, so current CORS config allows them
- If issues persist, check `corsOptions` in `server.js`
- Ensure mobile app is using correct API URL

---

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [FCM HTTP v1 API](https://firebase.google.com/docs/cloud-messaging/http-server-ref)
- [Flutter Firebase Messaging](https://firebase.flutter.dev/docs/messaging/overview)

---

## ✅ Checklist

Before deploying to production:

- [ ] Firebase project created
- [ ] Service account key downloaded
- [ ] Environment variables configured in `.env`
- [ ] Firebase Admin SDK installed (`npm install firebase-admin`)
- [ ] Server starts without errors
- [ ] Test push notification sent successfully
- [ ] Mobile app can register device token
- [ ] Mobile app receives push notifications
- [ ] Invalid tokens are handled properly
- [ ] `.env` file is in `.gitignore`

---

## 🆘 Support

If you encounter any issues:

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with Postman before testing with mobile app
4. Ensure Firebase project has Cloud Messaging enabled
5. Check Firebase Console for quota limits

---

**Note:** Push notifications are optional. The backend will work perfectly fine without Firebase configuration, but mobile push notifications won't be sent. In-app notifications will still work through the regular notification system.
