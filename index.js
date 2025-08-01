require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://advanced-tsp.onrender.com',
    'https://advacned-tsp.onrender.com',
    'https://advanced-stp-dashboard.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Add explicit OPTIONS handling for preflight requests
app.options('*', cors());

// Add debugging middleware BEFORE routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test home route with debugging
app.get('/', (req, res) => {
  console.log('Home route accessed');
  res.json({
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    links: {
      services: '/api/services',
      specific_service: '/api/services/cloud-computing-migration/cloud-migration'
    }
  });
});

// Add a specific test route for debugging
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test route working',
    environment: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI ? 'Connected' : 'Not set',
    timestamp: new Date().toISOString()
  });
});

// API routes
const auth = require('./middleware/auth');

// Public routes (no authentication required)
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const careerJobRoutes = require('./routes/careerJobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes); // Public GET routes
app.use('/api/bookings', bookingRoutes); // Public POST routes
app.use('/api/career-jobs', careerJobRoutes); // Public GET routes
app.use('/api/applications', applicationRoutes); // Public POST routes
app.use('/api/blog-posts', blogPostRoutes);

// Protected routes (require authentication)
const adminUserRoutes = require('./routes/adminUserRoutes');
app.use('/api/admin-users', auth, adminUserRoutes);

// Comment out or remove this line if it's causing conflicts
// const mainRoutes = require('./routes');
// app.use('/api', auth, mainRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));