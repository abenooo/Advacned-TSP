require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://advanced-tsp.onrender.com',
    'https://advanced-stp-dashboard.vercel.app'
  ]
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

// Test home route
app.get('/', (req, res) => {
  res.send('<h1>API is running</h1><p>Try <a href="/api/services">/api/services</a></p>');
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