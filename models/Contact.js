const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Optional metadata
  source: {
    type: String,
    trim: true,
    default: 'website-contact-form'
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'contacted', 'archived'],
    default: 'new'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
