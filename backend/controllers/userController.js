import User from '../models/User.js';

// Admin: list users with filters
export const adminListUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role = 'all', status = 'all', search = '' } = req.query;

    const filter = {};

    if (role !== 'all') {
      filter.role = role;
    }

    if (status !== 'all') {
      filter.isActive = status === 'active';
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error listing users (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Update user bank account details
export const updateBankAccount = async (req, res) => {
  try {
    const bankAccountData = req.body;

    // Check if user is gym owner
    if (req.user.role !== 'gymOwner') {
      return res.status(403).json({
        success: false,
        message: 'Only gym owners can manage bank account details'
      });
    }

    // Update bank account details
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bankAccount: {
          ...bankAccountData,
          lastUpdated: Date.now()
        }
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user with masked account number
    const userResponse = user.toObject();
    if (userResponse.bankAccount && userResponse.bankAccount.accountNumber) {
      // Mask account number for security
      const accountNum = userResponse.bankAccount.accountNumber;
      userResponse.bankAccount.accountNumber = accountNum.slice(0, 4) + '****' + accountNum.slice(-4);
    }

    res.status(200).json({
      success: true,
      message: 'Bank account details updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error updating bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bank account details',
      error: error.message
    });
  }
};

// Get user bank account details
export const getBankAccount = async (req, res) => {
  try {
    // Check if user is gym owner
    if (req.user.role !== 'gymOwner') {
      return res.status(403).json({
        success: false,
        message: 'Only gym owners can view bank account details'
      });
    }

    const user = await User.findById(req.user.id).select('bankAccount');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', req.user.id);
    console.log('User bank account data:', user.bankAccount);

    // Return bank account with masked account number
    const bankAccount = user.bankAccount;
    
    // If no bank account exists, return appropriate response
    if (!bankAccount || Object.keys(bankAccount).length === 0) {
      console.log('No bank account found for user');
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No bank account found'
      });
    }

    // Mask account number if it exists
    const maskedBankAccount = { ...bankAccount.toObject() };
    if (maskedBankAccount.accountNumber) {
      const accountNum = maskedBankAccount.accountNumber;
      maskedBankAccount.accountNumber = accountNum.slice(0, 4) + '****' + accountNum.slice(-4);
    }

    console.log('Returning bank account:', maskedBankAccount);

    res.status(200).json({
      success: true,
      data: maskedBankAccount
    });
  } catch (error) {
    console.error('Error fetching bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bank account details',
      error: error.message
    });
  }
};

// Get user bank account details for editing (returns full account number)
export const getBankAccountForEdit = async (req, res) => {
  try {
    // Check if user is gym owner
    if (req.user.role !== 'gymOwner') {
      return res.status(403).json({
        success: false,
        message: 'Only gym owners can view bank account details'
      });
    }

    const user = await User.findById(req.user.id).select('bankAccount');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return bank account with full account number for editing
    const bankAccount = user.bankAccount;
    
    // If no bank account exists, return appropriate response
    if (!bankAccount || Object.keys(bankAccount).length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No bank account found'
      });
    }

    res.status(200).json({
      success: true,
      data: bankAccount.toObject()
    });
  } catch (error) {
    console.error('Error fetching bank account for edit:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bank account details',
      error: error.message
    });
  }
};

// Get public bank account details for payments (gym owner only)
export const getPublicBankAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('bankAccount role firstName lastName');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Only allow access to gym owner bank details
    if (user.role !== 'gymOwner') {
      return res.status(403).json({
        success: false,
        message: 'Bank details not available for this user type'
      });
    }

    // Return bank account without masking for payment purposes
    const bankAccount = user.bankAccount;
    
    if (!bankAccount || Object.keys(bankAccount).length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No bank account found'
      });
    }

    // Return bank details with owner info for payment
    res.status(200).json({
      success: true,
      data: {
        ...bankAccount.toObject(),
        ownerName: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error('Error fetching public bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bank account details',
      error: error.message
    });
  }
};

// Delete user bank account details
export const deleteBankAccount = async (req, res) => {
  try {
    // Check if user is gym owner
    if (req.user.role !== 'gymOwner') {
      return res.status(403).json({
        success: false,
        message: 'Only gym owners can delete bank account details'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $unset: { bankAccount: 1 } },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bank account details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bank account details',
      error: error.message
    });
  }
};