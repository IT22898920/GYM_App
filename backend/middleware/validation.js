import { body } from 'express-validator';

// User registration validation
export const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  body('role')
    .optional()
    .isIn(['customer', 'instructor', 'gymOwner', 'admin'])
    .withMessage('Invalid role specified'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number')
];

// User login validation
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  body('role')
    .optional()
    .isIn(['customer', 'instructor', 'gymOwner', 'admin'])
    .withMessage('Invalid role specified')
];

// Update profile validation
export const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number')
];

// Change password validation
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/\d/).withMessage('New password must contain at least one number')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password')
];

// Gym registration validation
export const validateGymRegistration = [
  (req, res, next) => {
    console.log('DEBUG - validateGymRegistration middleware called');
    console.log('DEBUG - Request body in validation:', req.body);
    next();
  },
  body('gymName')
    .trim()
    .notEmpty().withMessage('Gym name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Gym name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Gym description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('contactInfo.email')
    .trim()
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Please provide a valid contact email')
    .normalizeEmail(),
  
  body('contactInfo.phone')
    .trim()
    .notEmpty().withMessage('Contact phone is required')
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  
  body('contactInfo.website')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid website URL');
      }
      return true;
    }),
  
  body('address.street')
    .trim()
    .notEmpty().withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty().withMessage('State is required'),
  
  body('address.zipCode')
    .trim()
    .notEmpty().withMessage('ZIP code is required'),
  
  body('address.country')
    .optional()
    .trim()
    .notEmpty().withMessage('Country cannot be empty'),
  
  body('coordinates')
    .custom((value, { req }) => {
      console.log('DEBUG - Validating coordinates:', value);
      console.log('DEBUG - Request body keys:', Object.keys(req.body));
      console.log('DEBUG - Full request body:', req.body);
      return true;
    })
    .isArray({ min: 2, max: 2 }).withMessage('Location coordinates must be an array of [longitude, latitude]')
    .custom((value) => {
      const [lng, lat] = value;
      if (typeof lng !== 'number' || typeof lat !== 'number') {
        throw new Error('Coordinates must be numbers');
      }
      if (lng < -180 || lng > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
      if (lat < -90 || lat > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      return true;
    }),
  
  body('facilities')
    .optional()
    .isArray().withMessage('Facilities must be an array'),
  
  body('equipment')
    .optional()
    .isArray().withMessage('Equipment must be an array'),
  
  body('equipment.*.name')
    .optional()
    .trim()
    .notEmpty().withMessage('Equipment name is required'),
  
  body('equipment.*.quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Equipment quantity must be a non-negative integer'),
  
  body('equipment.*.condition')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid equipment condition'),
  
  body('services')
    .optional()
    .isArray().withMessage('Services must be an array'),
  
  body('pricing.membershipPlans')
    .optional()
    .isArray().withMessage('Membership plans must be an array'),
  
  body('pricing.membershipPlans.*.name')
    .optional()
    .trim()
    .notEmpty().withMessage('Membership plan name is required'),
  
  body('pricing.membershipPlans.*.duration')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).withMessage('Invalid membership duration'),
  
  body('pricing.membershipPlans.*.price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Membership price must be a non-negative number'),
  
  body('pricing.dropInFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('Drop-in fee must be a non-negative number'),
  
  body('capacity')
    .notEmpty().withMessage('Gym capacity is required')
    .isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  
  body('establishedYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Established year must be between 1900 and ${new Date().getFullYear()}`),
  
  body('amenities')
    .optional()
    .isArray().withMessage('Amenities must be an array'),
  
  body('specialPrograms')
    .optional()
    .isArray().withMessage('Special programs must be an array'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];

// Gym update validation (less strict than registration)
export const validateGymUpdate = [
  body('gymName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Gym name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('contactInfo.email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid contact email')
    .normalizeEmail(),
  
  body('contactInfo.phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  
  body('contactInfo.website')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid website URL');
      }
      return true;
    }),
  
  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  
  body('establishedYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Established year must be between 1900 and ${new Date().getFullYear()}`),
  
  body('pricing.dropInFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('Drop-in fee must be a non-negative number'),

  // Social media validations
  body('socialMedia.facebook')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid Facebook URL');
      }
      return true;
    }),

  body('socialMedia.instagram')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid Instagram URL');
      }
      return true;
    }),

  body('socialMedia.twitter')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid Twitter URL');
      }
      return true;
    }),

  body('socialMedia.youtube')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid YouTube URL');
      }
      return true;
    }),

  // Array validations
  body('facilities')
    .optional()
    .isArray().withMessage('Facilities must be an array'),

  body('services')
    .optional()
    .isArray().withMessage('Services must be an array'),

  body('amenities')
    .optional()
    .isArray().withMessage('Amenities must be an array'),

  body('specialPrograms')
    .optional()
    .isArray().withMessage('Special programs must be an array'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),

  body('certifications')
    .optional()
    .isArray().withMessage('Certifications must be an array')
];

// Bank account validation
export const validateBankAccount = [
  body('accountHolderName')
    .trim()
    .notEmpty().withMessage('Account holder name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Account holder name must be between 2 and 100 characters'),
  
  body('accountNumber')
    .trim()
    .notEmpty().withMessage('Account number is required')
    .isLength({ min: 5, max: 30 }).withMessage('Account number must be between 5 and 30 characters')
    .matches(/^[0-9]+$/).withMessage('Account number must contain only numbers'),
  
  body('bankName')
    .trim()
    .notEmpty().withMessage('Bank name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Bank name must be between 2 and 100 characters'),
  
  body('branchName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Branch name cannot exceed 100 characters'),
  
  body('swiftCode')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && !value.match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
        throw new Error('Please provide a valid SWIFT/BIC code');
      }
      return true;
    }),
  
  body('iban')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (value && value.length > 0) {
        if (!value.match(/^[A-Z0-9]+$/)) {
          throw new Error('IBAN must contain only letters and numbers');
        }
        if (value.length < 15 || value.length > 34) {
          throw new Error('IBAN must be between 15 and 34 characters');
        }
      }
      return true;
    }),
  
  body('currency')
    .optional()
    .isIn(['LKR', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency code'),
  
  body('accountType')
    .optional()
    .isIn(['savings', 'current', 'business']).withMessage('Invalid account type')
];