# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN stack Gym Management Application built with:
- **Frontend**: React (v19), Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens, role-based access control

The application supports multiple user roles: Admin, Gym Owner, Instructor, and Customer, each with dedicated interfaces and functionality.

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
- **Styling**: Tailwind CSS with custom animations and @headlessui/react
- **Charts**: Recharts for data visualization
- **Payments**: Stripe integration (@stripe/react-stripe-js)
- **PDF Generation**: jspdf with jspdf-autotable
- **Icons**: react-icons

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
- `MapComponent.jsx`: Location-based features

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

## Frontend Routes

### Authentication & Registration
- `/login`: User authentication
- `/signup`: New user registration
- `/apply-instructor`: Instructor application process
- `/register-gym`: Gym registration

### Role-Specific Dashboards
- `/admin`: Admin dashboard
- `/gym-owner`: Gym owner dashboard
- `/instructor`: Instructor dashboard

### Key Features
- Class scheduling and booking system
- Workout plan creation and management
- Financial tracking for multiple user types
- Student progress tracking
- Gym discovery with location features

## Environment Variables

### Backend (.env)
- `NODE_ENV`: development/production
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `CLIENT_URL`: Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_SERVER_URL`: Backend server URL