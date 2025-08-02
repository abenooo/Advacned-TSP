const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Customer Information
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Company Information
  companyName: {
    type: String,
    trim: true
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+', 'Not specified'],
    default: 'Not specified'
  },
  industry: {
    type: String,
    trim: true
  },
  
  // Services Interested In (Multiple Selection)
  servicesInterested: [{
    type: String,
    enum: [
      'Managed IT Services',
      'Cybersecurity & Risk Management', 
      'Custom Web & Software Development',
      'Cloud Computing & Migration',
      'IT Consulting & Strategy',
      'Learning & Training'
    ]
  }],
  
  // Legacy fields for backward compatibility
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service' 
  },
  subServiceSlug: String,
  task: String, // Will be replaced by message field
  
  // Consultation Details
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    enum: ['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-8PM)', 'Flexible']
  },
  
  // Current IT Provider Status
  hasITProvider: {
    type: String,
    enum: ['Yes', 'No', 'Unsure'],
    default: 'Unsure'
  },
  
  // Detailed Message
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Legacy date field for backward compatibility
  date: Date,
  
  // Booking Status and Management
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending' 
  },
  notes: String,
  handledBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AdminUser' 
  },
  
  // Additional tracking
  consultationType: {
    type: String,
    enum: ['initial', 'follow-up', 'technical', 'sales'],
    default: 'initial'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
