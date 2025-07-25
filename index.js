require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://advacned-tsp.onrender.com/', 'https://advanced-stp-dashboard.vercel.app/']
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
const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

const mainRoutes = require('./routes'); // your /api
app.use('/api', mainRoutes);

const blogPostRoutes = require('./routes/blogPostRoutes');
app.use('/api/blog-posts', blogPostRoutes);

const adminUserRoutes = require('./routes/adminUserRoutes');
app.use('/api/admin-users', adminUserRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const applicationRoutes = require('./routes/applicationRoutes');
app.use('/api/applications', applicationRoutes);

const careerJobRoutes = require('./routes/careerJobRoutes');
app.use('/api/career-jobs', careerJobRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const auth = require('./middleware/auth');

// Public routes
app.use('/api/services', serviceRoutes); // GET /api/services is public
app.use('/api/bookings', bookingRoutes); // POST /api/bookings is public
app.use('/api/career-jobs', careerJobRoutes); // GET is public
app.use('/api/applications', applicationRoutes); // POST /api/applications is public

// Protect all other routes
app.use(auth);

// Example: these will require JWT
app.use('/api/admin-users', adminUserRoutes);
app.use('/api/blog-posts', blogPostRoutes);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));