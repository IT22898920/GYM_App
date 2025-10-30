import express from 'express';
import {
  updateBankAccount,
  getBankAccount,
  getBankAccountForEdit,
  deleteBankAccount,
  getPublicBankAccount,
  adminListUsers
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateBankAccount } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';

const router = express.Router();

// Public route for getting bank account details for payments
router.get('/:userId/bank-account', getPublicBankAccount);

// Protected routes - require authentication
router.use(protect);

// Admin routes
router.get('/admin', authorize('admin'), adminListUsers);

// Bank account management routes for gym owners
router.put('/bank-account', authorize('gymOwner'), validateBankAccount, handleValidationErrors, updateBankAccount);
router.get('/bank-account', authorize('gymOwner'), getBankAccount);
router.get('/bank-account/edit', authorize('gymOwner'), getBankAccountForEdit);
router.delete('/bank-account', authorize('gymOwner'), deleteBankAccount);

export default router;