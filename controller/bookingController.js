const Booking = require('../models/Booking');
const { sendBookingConfirmation, sendBookingNotificationToAdmin } = require('../utils/resendService');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by date range if provided
    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('serviceId', 'name')
      .populate('handledBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get one booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'name')
      .populate('handledBy', 'name email');
      
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a consultation booking with Resend email notifications
exports.createBooking = async (req, res) => {
  try {
    // Updated validation for consultation form
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'preferredDate', 'message'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.customerEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Validate services interested (if provided)
    if (req.body.servicesInterested && Array.isArray(req.body.servicesInterested)) {
      const validServices = [
        'Managed IT Services',
        'Cybersecurity & Risk Management', 
        'Custom Web & Software Development',
        'Cloud Computing & Migration',
        'IT Consulting & Strategy',
        'Learning & Training'
      ];
      
      const invalidServices = req.body.servicesInterested.filter(
        service => !validServices.includes(service)
      );
      
      if (invalidServices.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid services: ${invalidServices.join(', ')}`
        });
      }
    }
    
    // Prepare booking data
    const bookingData = {
      // Customer Information
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      
      // Company Information
      companyName: req.body.companyName,
      companySize: req.body.companySize || 'Not specified',
      industry: req.body.industry,
      
      // Services
      servicesInterested: req.body.servicesInterested || [],
      
      // Consultation Details
      preferredDate: new Date(req.body.preferredDate),
      preferredTime: req.body.preferredTime,
      hasITProvider: req.body.hasITProvider || 'Unsure',
      message: req.body.message,
      
      // Legacy fields for backward compatibility
      serviceId: req.body.serviceId,
      subServiceSlug: req.body.subServiceSlug,
      task: req.body.task || req.body.message, // Use message as task for legacy support
      date: req.body.date || new Date(req.body.preferredDate), // Use preferredDate as date for legacy
      
      // Status and management
      status: 'pending',
      consultationType: req.body.consultationType || 'initial',
      priority: req.body.priority || 'medium'
    };
    
    // Create booking
    const booking = new Booking(bookingData);
    await booking.save();
    
    // Populate service data for response and email (if serviceId exists)
    if (booking.serviceId) {
      await booking.populate('serviceId', 'name');
    }
    
    // Send email notifications using Resend (don't block the response if emails fail)
    try {
      // Send confirmation email to customer
      await sendBookingConfirmation(booking);
      
      // Send notification email to admin
      await sendBookingNotificationToAdmin(booking);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the booking creation if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Consultation booking created successfully',
      data: booking
    });
    
  } catch (error) {
    console.error('Error creating consultation booking:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating consultation booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!booking) return res.status(404).json({ message: 'Not found' });
  res.json(booking);
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
