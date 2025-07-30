import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import gymRoutes from './routes/gymRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import gymRequestRoutes from './routes/gymRequestRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import callRoutes from './routes/callRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gym-requests', gymRequestRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/calls', callRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Gym Management API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        getMe: 'GET /api/auth/me',
        refresh: 'POST /api/auth/refresh'
      },
      gyms: {
        register: 'POST /api/gyms/register',
        getAll: 'GET /api/gyms',
        getById: 'GET /api/gyms/:id',
        update: 'PUT /api/gyms/:id',
        delete: 'DELETE /api/gyms/:id',
        getOwnerGyms: 'GET /api/gyms/owner/gyms',
        approve: 'PUT /api/gyms/:id/approve',
        reject: 'PUT /api/gyms/:id/reject',
        searchNearby: 'GET /api/gyms/search/nearby'
      }
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// WebRTC signaling namespace
const webrtcNamespace = io.of('/webrtc');

// Store active call sessions
const activeCalls = new Map();

webrtcNamespace.on('connection', (socket) => {
  console.log(`WebRTC client connected: ${socket.id}`);

  // Join call room
  socket.on('join-call', (callId) => {
    socket.join(callId);
    console.log(`Socket ${socket.id} joined call room: ${callId}`);
    
    // Track active call
    if (!activeCalls.has(callId)) {
      activeCalls.set(callId, new Set());
    }
    activeCalls.get(callId).add(socket.id);
  });

  // Handle WebRTC signaling
  socket.on('webrtc-offer', (data) => {
    console.log(`WebRTC offer from ${socket.id} to room ${data.callId}`);
    socket.to(data.callId).emit('webrtc-offer', {
      offer: data.offer,
      from: socket.id
    });
  });

  socket.on('webrtc-answer', (data) => {
    console.log(`WebRTC answer from ${socket.id} to room ${data.callId}`);
    socket.to(data.callId).emit('webrtc-answer', {
      answer: data.answer,
      from: socket.id
    });
  });

  socket.on('webrtc-ice-candidate', (data) => {
    console.log(`ICE candidate from ${socket.id} to room ${data.callId}`);
    socket.to(data.callId).emit('webrtc-ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });

  // Handle call end
  socket.on('end-call', (callId) => {
    console.log(`Call ended by ${socket.id} in room ${callId}`);
    socket.to(callId).emit('call-ended');
    socket.leave(callId);
    
    // Clean up active call tracking
    if (activeCalls.has(callId)) {
      activeCalls.get(callId).delete(socket.id);
      if (activeCalls.get(callId).size === 0) {
        activeCalls.delete(callId);
      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`WebRTC client disconnected: ${socket.id}`);
    
    // Clean up from all active calls
    for (const [callId, participants] of activeCalls.entries()) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        socket.to(callId).emit('participant-left', socket.id);
        
        if (participants.size === 0) {
          activeCalls.delete(callId);
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`WebRTC Socket.io server initialized on /webrtc namespace`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;