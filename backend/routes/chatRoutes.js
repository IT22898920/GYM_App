import express from 'express';
import {
  getUserChats,
  getOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all chats for the current user
router.get('/', getUserChats);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Get or create chat for a collaboration
router.get('/collaboration/:collaborationId', getOrCreateChat);

// Send a message
router.post('/:chatId/messages', sendMessage);

// Mark messages as read
router.put('/:chatId/read', markMessagesAsRead);

export default router;