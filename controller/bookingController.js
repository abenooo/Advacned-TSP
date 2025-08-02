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

// Create a booking with Resend email notifications
exports.createBooking = async (req, res) => {
  try {
    // Basic validation
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'serviceId', 'task', 'date'];
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
    
    // Create booking
    const booking = new Booking({
      ...req.body,
      status: 'pending' // Default status
    });
    
    await booking.save();
    
    // Populate service data for response and email
    await booking.populate('serviceId', 'name');
    
    // Send email notifications using Resend (don't block the response if emails fail)
    try {
      console.log('📧 Sending booking confirmation emails via Resend...');
      
      // Send confirmation email to customer
      const customerEmailResult = await sendBookingConfirmation(booking);
      if (customerEmailResult.success) {
        console.log('✅ Customer confirmation email sent successfully via Resend');
      } else {
        console.error('❌ Failed to send customer confirmation email:', customerEmailResult.error);
      }
      
      // Send notification email to admin
      const adminEmailResult = await sendBookingNotificationToAdmin(booking);
      if (adminEmailResult.success) {
        console.log('✅ Admin notification email sent successfully via Resend');
      } else {
        console.error('❌ Failed to send admin notification email:', adminEmailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError);
      // Don't fail the booking creation if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
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
