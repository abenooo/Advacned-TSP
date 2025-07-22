const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerJob' },
  name: String,
  email: String,
  resumeUrl: String,
  coverLetter: String,
  status: { type: String, default: 'pending' },
  notes: String,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
