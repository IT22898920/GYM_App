import express from 'express';
import {
  initiateCall,
  acceptCall,
  rejectCall,
  endCall,
  getCallHistory,
  deleteCall
} from '../controllers/callController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Initiate a call
router.post('/initiate', initiateCall);

// Accept a call
router.put('/:callId/accept', (req, res, next) => {
  console.log(`🌐 Route: Accept call request received - CallID: ${req.params.callId}, UserID: ${req.user?.id}`);
  next();
}, acceptCall);

// Reject a call
router.put('/:callId/reject', rejectCall);

// End a call
router.put('/:callId/end', endCall);

// Get call history
router.get('/history', getCallHistory);

// Delete a call
router.delete('/:callId', deleteCall);

export default router;