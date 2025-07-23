require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

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

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));