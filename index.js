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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

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

// Add debugging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
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
app.use('/api/auth', authRoutes);

const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes); // Public GET routes

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes); // Public POST routes

const careerJobRoutes = require('./routes/careerJobRoutes');
app.use('/api/career-jobs', careerJobRoutes); // Public GET routes

const applicationRoutes = require('./routes/applicationRoutes');
app.use('/api/applications', applicationRoutes); // Public POST routes

// Blog post routes (public GET, protected POST/PUT/DELETE)
const blogPostRoutes = require('./routes/blogPostRoutes');
app.use('/api/blog-posts', blogPostRoutes);

// Protected routes (require authentication)
const adminUserRoutes = require('./routes/adminUserRoutes');
app.use('/api/admin-users', auth, adminUserRoutes);

// Other protected routes can be added here
const mainRoutes = require('./routes');
app.use('/api', auth, mainRoutes);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));