# Gym Management System

A comprehensive MERN stack application with Flutter mobile app support for managing gyms, instructors, members, and fitness programs.

## 📱 Platform Support

- ✅ **Web Application** - React + Vite
- ✅ **Mobile Application** - Flutter (iOS & Android)
- ✅ **Backend API** - Node.js + Express + MongoDB

## 🚀 Quick Links

### Main Documentation
- [Project Requirements & Tasks](PROJECT_REQUIREMENTS_AND_TASKS.md) - Complete project overview
- [Claude Code Guide](CLAUDE.md) - Development guidelines and architecture

### Mobile App Documentation (NEW! ✨)
- [📱 Mobile Integration Summary](MOBILE_INTEGRATION_SUMMARY.md) - **START HERE!** Overview of mobile integration
- [🔧 Backend Mobile Setup](BACKEND_MOBILE_SETUP.md) - Backend configuration for mobile
- [📦 Flutter App Plan](FLUTTER_MOBILE_APP_PLAN.md) - Complete Flutter development roadmap
- [⚡ Flutter Quick Start](FLUTTER_QUICK_START.md) - Get started with Flutter development

## 🏗️ Architecture

### Backend (MERN)
- **Node.js** + Express.js
- **MongoDB** + Mongoose
- **JWT** authentication with refresh tokens
- **Cloudinary** for file storage
- **Firebase** Cloud Messaging for push notifications
- **Socket.io** for real-time features

### Frontend (Web)
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** v6
- Role-based interfaces (Admin, Gym Owner, Instructor, Customer)

### Mobile (Flutter)
- **Flutter 3.0+** for iOS & Android
- **Firebase** integration
- **Provider** for state management
- **Google Maps** for location features
- **Push Notifications** support

## 👥 User Roles

1. **Admin** - System management, approvals, analytics
2. **Gym Owner** - Gym management, member management, payment verification
3. **Instructor** - Student management, workout plans, class scheduling
4. **Customer** - Find gyms, register, book classes, track workouts

## 🌟 Key Features

### Currently Implemented
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Gym registration & approval workflow
- ✅ Instructor application system
- ✅ Member management with payment verification
- ✅ Real-time notifications (in-app + email)
- ✅ Push notifications (mobile)
- ✅ Location-based gym search
- ✅ File uploads (Cloudinary)
- ✅ Bank transfer payment verification

### In Development
- 🚧 Class scheduling & booking
- 🚧 Workout plan creation
- 🚧 Student progress tracking
- 🚧 Financial reports & analytics
- 🚧 In-app messaging

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Firebase account (for push notifications)
- Cloudinary account (for file storage)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Mobile App Setup

See [FLUTTER_QUICK_START.md](FLUTTER_QUICK_START.md) for complete Flutter setup guide.

## 📚 Development Guide

### For Web Development
1. Read [CLAUDE.md](CLAUDE.md) for architecture overview
2. Check [PROJECT_REQUIREMENTS_AND_TASKS.md](PROJECT_REQUIREMENTS_AND_TASKS.md) for tasks
3. Follow existing code patterns

### For Mobile Development
1. **Start here:** [MOBILE_INTEGRATION_SUMMARY.md](MOBILE_INTEGRATION_SUMMARY.md)
2. Setup backend: [BACKEND_MOBILE_SETUP.md](BACKEND_MOBILE_SETUP.md)
3. Create Flutter app: [FLUTTER_QUICK_START.md](FLUTTER_QUICK_START.md)
4. Follow roadmap: [FLUTTER_MOBILE_APP_PLAN.md](FLUTTER_MOBILE_APP_PLAN.md)

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gym_management
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
```

See [BACKEND_MOBILE_SETUP.md](BACKEND_MOBILE_SETUP.md) for complete configuration guide.

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Mobile
- `POST /api/mobile/register-device` - Register device for push notifications
- `POST /api/mobile/unregister-device` - Unregister device
- `GET /api/mobile/devices` - Get registered devices
- `GET /api/mobile/version-check` - Check app version

### Gyms
- `GET /api/gyms` - Get all gyms
- `GET /api/gyms/search/nearby` - Location-based search
- `POST /api/gyms/register` - Register new gym

### Members
- `POST /api/members/register/:gymId` - Customer registration
- `GET /api/members` - Get gym members
- `PATCH /api/members/:id/confirm-payment` - Verify payment

See complete API documentation in the codebase.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📊 Project Status

- **Overall Progress:** ~35% Complete
- **Backend:** 90% Ready for mobile
- **Web Frontend:** 60% Complete
- **Mobile App:** 0% (Ready to start!)

See [PROJECT_REQUIREMENTS_AND_TASKS.md](PROJECT_REQUIREMENTS_AND_TASKS.md) for detailed progress.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## 📄 License

ISC

## 🆘 Support

For issues and questions:
- Check documentation files above
- Review troubleshooting sections
- Check server logs for errors

---

**Latest Update:** Mobile backend integration complete with push notification support! 🎉
