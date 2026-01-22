import express from 'express';
import {
  registerDevice,
  unregisterDevice,
  getRegisteredDevices,
  removeDevice,
  updateDeviceToken,
  checkAppVersion
} from '../controllers/mobileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/version-check', checkAppVersion);

// Protected routes - require authentication
router.use(protect);

// Device registration and management
router.post('/register-device', registerDevice);
router.post('/unregister-device', unregisterDevice);
router.put('/update-token', updateDeviceToken);
router.get('/devices', getRegisteredDevices);
router.delete('/devices/:deviceId', removeDevice);

export default router;
