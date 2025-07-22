const mongoose = require('mongoose');

const CareerJobSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  requirements: [String],
  postedAt: Date,
  closingAt: Date,
  published: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

module.exports = mongoose.model('CareerJob', CareerJobSchema);
