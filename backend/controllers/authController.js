import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import NotificationService from '../services/notificationService.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
      phone
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Send welcome notification based on role
    try {
      console.log('🎉 Creating welcome notification for user:', user.email, 'role:', user.role);
      let welcomeTitle = 'Welcome to FitnessHub! 🎉';
      let welcomeMessage = '';
      let link = '';

      switch (user.role) {
        case 'customer':
          welcomeMessage = `Welcome ${user.firstName}! Start your fitness journey by exploring gyms in your area and joining classes that match your goals.`;
          link = '/find-gym';
          break;
        case 'gymOwner':
        case 'gym-owner':
          welcomeMessage = `Welcome ${user.firstName}! Ready to manage your gym? Register your gym and start building your fitness community.`;
          link = '/gym-owner/dashboard';
          break;
        case 'instructor':
          welcomeMessage = `Welcome ${user.firstName}! Apply to become a verified instructor and share your expertise with fitness enthusiasts.`;
          link = '/instructor/dashboard';
          break;
        case 'admin':
          welcomeMessage = `Welcome Admin ${user.firstName}! You have full access to manage the platform and oversee all operations.`;
          link = '/admin/dashboard';
          break;
        default:
          welcomeMessage = `Welcome ${user.firstName}! Thank you for joining our fitness community. Explore and achieve your fitness goals with us.`;
          link = '/';
      }

      console.log('📝 Notification data:', { recipient: user._id, type: 'welcome_message', title: welcomeTitle, message: welcomeMessage });
      
      await NotificationService.createNotification({
        recipient: user._id,
        type: 'welcome_message',
        title: welcomeTitle,
        message: welcomeMessage,
        link: link,
        priority: 'medium'
      });
      
      console.log('✅ Welcome notification created successfully');

      // For admin users, also send a system notification to all admins about new user
      if (user.role !== 'admin') {
        const adminUsers = await User.find({ role: 'admin', isActive: true }).select('_id');
        if (adminUsers.length > 0) {
          await NotificationService.createBulkNotifications({
            recipients: adminUsers.map(admin => admin._id),
            type: 'system_announcement',
            title: 'New User Registration',
            message: `New ${user.role} registered: ${user.firstName} ${user.lastName} (${user.email})`,
            data: { 
              userId: user._id, 
              userRole: user.role,
              userName: `${user.firstName} ${user.lastName}`,
              userEmail: user.email
            },
            link: '/admin/users',
            priority: 'low'
          });
        }
      }
    } catch (notificationError) {
      console.error('❌ Error sending welcome notification:', notificationError);
      console.error('❌ Notification error stack:', notificationError.stack);
      // Don't fail registration if notification fails
    }

    // Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password, role } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password +refreshToken');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user role matches (if role is provided)
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This login is for ${role}s only.`
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    user.updatedAt = Date.now();
    await user.save();

    // Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Clear user's refresh token from database
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        refreshToken: null,
        updatedAt: Date.now()
      });
    }

    // Clear cookies
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user with this refresh token
    const user = await User.findById(decoded.userId).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = generateToken(user._id);

    // Set new access token cookie
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newAccessToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};