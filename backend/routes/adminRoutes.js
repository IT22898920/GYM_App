import express from 'express';
import {
  createManualSubscription,
  updateSubscription,
  extendSubscription,
  getAllSubscriptions,
  getSubscriptionStats
} from '../controllers/adminSubscriptionController.js';
import {
  getSubscriptionHistory,
  getSuspensionHistory,
  getSuspensionStats
} from '../controllers/adminHistoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Subscription management routes
router.post('/subscriptions/:memberId/create', createManualSubscription);
router.put('/subscriptions/:memberId/update', updateSubscription);
router.put('/subscriptions/:memberId/extend', extendSubscription);
router.get('/subscriptions', getAllSubscriptions);
router.get('/subscriptions/stats', getSubscriptionStats);
router.get('/subscriptions/:memberId/history', getSubscriptionHistory);

// Suspension history routes
router.get('/suspensions/history', getSuspensionHistory);
router.get('/suspensions/stats', getSuspensionStats);

export default router;

