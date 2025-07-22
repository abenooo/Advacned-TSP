const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  subServiceSlug: String,
  task: String,
  date: Date,
  status: { type: String, default: 'pending' },
  notes: String,
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
