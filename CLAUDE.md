# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN stack Gym Management Application built with:
- **Frontend**: React (v19), Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens, role-based access control
- **File Storage**: Cloudinary integration for images and documents
- **Notifications**: Real-time notification system with email integration
- **Payment Processing**: Bank transfer verification with receipt upload

The application supports multiple user roles: Admin, Gym Owner, Instructor, and Customer, each with dedicated interfaces and functionality. Features comprehensive member management, payment verification, and notification systems.

## Development Commands

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
npm run preview     # Preview production build
```

### Backend
```bash
cd backend
npm install         # Install dependencies
npm run dev        # Start development server with nodemon
npm start          # Start production server
```

## Architecture Overview

### User Role Structure
The application implements role-based access control with four distinct user types:

1. **Admin** (`/admin/*`): System administration, user management, finance oversight
2. **Gym Owner** (`/gym-owner/*`): Gym management, instructor oversight, member management
3. **Instructor** (`/instructor/*`): Class management, student tracking, workout plans
4. **Customer**: Public routes for gym discovery, class booking, profile management

### Routing Architecture
- Main router configuration in `src/App.jsx`
- Each user role has a dedicated layout component in `src/layouts/`
- Role-specific pages are organized in `src/pages/{role}/`
- Conditional header/footer rendering based on route type

### Key Dependencies
- **UI Framework**: React 19 with React Router v6
- **Styling**: Tailwind CSS with custom animations, gradients, and @headlessui/react
- **Charts**: Recharts for data visualization
- **File Storage**: Cloudinary for image and document storage
- **HTTP Client**: Fetch API for backend communication
- **Form Handling**: FormData for file uploads and form submissions
- **PDF Generation**: jspdf with jspdf-autotable
- **Icons**: react-icons (Feather icons primary)

### State Management Pattern
The application appears to use component-level state management. No global state management library is currently configured.

### Build Configuration
- **Vite**: Standard React plugin configuration
- **Tailwind**: Custom animations (bounce-slow, float, gradient, pulse-glow)
- **ESLint**: Configured with React 18.3 settings and React Refresh rules

## Component Organization

### Shared Components (`src/components/`)
- `Header.jsx`, `Footer.jsx`: Public site navigation
- `AdminHeader.jsx`, `AdminFooter.jsx`, `AdminSidebar.jsx`: Admin-specific UI
- `MapComponent.jsx`: Location-based features with GPS detection
- `Alert.jsx`: Global alert system for notifications
- `ProtectedRoute.jsx`: Route protection based on authentication
- `NotificationBell.jsx`: Real-time notification display

### Layout Components (`src/layouts/`)
Each role has a dedicated layout wrapper that provides consistent navigation and structure for that user type.

### Page Structure
Pages are organized by user role with clear naming conventions:
- Admin pages handle system-wide management
- Gym owner pages focus on gym-specific operations
- Instructor pages manage classes and students
- Public pages handle authentication, gym discovery, and customer features

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login user
- `POST /api/auth/logout`: Logout user
- `GET /api/auth/me`: Get current user
- `POST /api/auth/refresh`: Refresh access token

### Role-specific login endpoints
- `POST /api/auth/admin/login`: Admin login
- `POST /api/auth/gym-owner/login`: Gym owner login
- `POST /api/auth/instructor/login`: Instructor login
- `POST /api/auth/customer/login`: Customer login

### Member Management
- `GET /api/members`: Get all members for a gym (with pagination and search)
- `GET /api/members/:id`: Get single member details
- `POST /api/members/add`: Add new member (gym owner)
- `POST /api/members/register/:gymId`: Customer registration to gym
- `PUT /api/members/:id`: Update member details
- `DELETE /api/members/:id`: Delete member
- `PATCH /api/members/:id/status`: Update member status
- `PATCH /api/members/:id/confirm-payment`: Confirm customer payment
- `GET /api/members/stats`: Get member statistics

### Gym Management
- `GET /api/gyms`: Get all gyms (with location search)
- `GET /api/gyms/:id`: Get single gym details
- `POST /api/gyms/register`: Register new gym
- `GET /api/gyms/owner/gym-profile`: Get gym profile for logged-in owner
- `PUT /api/gyms/:id`: Update gym details
- `PATCH /api/gyms/:id/status`: Update gym status (admin)

### Notifications
- `GET /api/notifications`: Get user notifications
- `GET /api/notifications/unread-count`: Get unread notification count
- `PATCH /api/notifications/:id/read`: Mark notification as read
- `POST /api/notifications`: Create new notification (internal)

### Instructor Applications
- `POST /api/instructors/apply`: Submit instructor application
- `GET /api/instructors/applications`: Get all applications (admin)
- `PATCH /api/instructors/:id/status`: Update application status

## Frontend Routes

### Authentication & Registration
- `/login`: User authentication
- `/signup`: New user registration
- `/apply-instructor`: Instructor application process
- `/register-gym`: Gym registration
- `/gym/:id/register`: Customer registration to specific gym

### Role-Specific Dashboards
- `/admin`: Admin dashboard
- `/gym-owner`: Gym owner dashboard with member management
- `/instructor`: Instructor dashboard
- `/gym-owner/members`: Complete member management interface

### Customer Features
- `/find-gym`: Location-based gym search
- `/gym/:id/register`: Registration form with payment options
- `/profile`: Customer profile management

### Key Features Implemented
- **Member Management**: Complete CRUD with beautiful UI and payment verification
- **Payment System**: Bank transfer with receipt upload and verification
- **Notification System**: Real-time notifications and email integration
- **File Storage**: Cloudinary integration for receipt and image storage
- **Location Services**: GPS-based gym discovery
- **Analytics**: Member statistics and dashboard metrics

### Key Features Pending
- Class scheduling and booking system
- Workout plan creation and management
- Financial tracking for multiple user types
- Student progress tracking
- Advanced reporting and analytics

## Environment Variables

### Backend (.env)
- `NODE_ENV`: development/production
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `CLIENT_URL`: Frontend URL for CORS
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `SMTP_USER`: Email service username
- `SMTP_PASS`: Email service password

### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_SERVER_URL`: Backend server URL

## Database Models

### Key Models Implemented
- **User**: Authentication and role management
- **Gym**: Gym information, location, and status
- **Member**: Customer membership with payment details
- **InstructorApplication**: Instructor application workflow
- **Notification**: Real-time notification system

### Member Model Schema
```javascript
{
  user: ObjectId,              // Reference to User
  gym: ObjectId,               // Reference to Gym
  firstName, lastName, email,  // Personal information
  phoneNumber, gender, dateOfBirth,
  membershipPlan: {            // Plan details
    name, price, features, startDate, endDate
  },
  bodyMeasurements: {          // Fitness tracking
    height, weight, bmi, bodyFat, waist, hips, biceps, thighs
  },
  paymentDetails: {            // Payment management
    method: 'card' | 'manual', // card for online, manual for bank transfer
    paymentStatus: 'pending' | 'paid' | 'failed',
    receiptPath: String,       // Cloudinary URL for receipt
    lastPaymentDate, nextPaymentDate
  },
  status: 'active' | 'inactive' | 'suspended',
  fitnessGoals: [String],      // Member's fitness objectives
  emergencyContact: { name, phone, relationship },
  medicalInfo: { conditions, medications, allergies }
}
```

## File Upload Handling

### Cloudinary Integration
- **Receipt Storage**: `/gym-app/receipts/` folder
- **Gym Images**: `/gym-app/gyms/` folder  
- **Logos**: `/gym-app/logos/` folder
- **Profiles**: `/gym-app/profiles/` folder
- **Supported Formats**: JPG, PNG, PDF (receipts), GIF, WebP
- **Size Limits**: 5MB per file
- **Transformations**: Auto quality, format optimization

### Upload Process
1. Frontend uses FormData for file uploads
2. Multer middleware handles multipart/form-data
3. Files stored in memory buffer
4. Uploaded to Cloudinary via stream
5. Secure URLs returned and stored in database

## Payment Verification Workflow

### Customer Registration Flow
1. Customer fills registration form with personal/fitness details
2. Selects payment method (card or bank transfer)
3. For bank transfer: uploads receipt image/PDF
4. Member created with `inactive` status and `pending` payment
5. Gym owner receives notification with receipt verification request

### Gym Owner Verification Flow
1. Views pending payments in Members dashboard
2. Clicks "View Receipt" to examine uploaded document
3. Uses beautiful confirmation modal to verify payment
4. Upon confirmation:
   - Member status changes to `active`
   - Payment status changes to `paid`
   - Customer receives success notification
   - Member gains full gym access

## UI/UX Design Patterns

### Design System
- **Color Scheme**: Dark theme with violet/purple gradients
- **Components**: Modern cards with glass-morphism effects
- **Typography**: Gradient text effects for headings
- **Animations**: Smooth transitions, hover effects, loading states
- **Icons**: Feather icons from react-icons/fi

### Interactive Elements
- **Buttons**: Gradient backgrounds with scale transforms on hover
- **Modals**: Backdrop blur with animated overlays
- **Cards**: Shadow effects and border gradients
- **Loading States**: Spinner animations and skeleton screens
- **Notifications**: Toast-style alerts with icons and colors

### Responsive Design
- **Mobile-first**: Tailwind CSS responsive utilities
- **Grid Layouts**: CSS Grid and Flexbox for complex layouts
- **Touch-friendly**: Appropriate button sizes and spacing
- **Accessibility**: Proper contrast ratios and keyboard navigation