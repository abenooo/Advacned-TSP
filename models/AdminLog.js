const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  action: String,
  collection: String,
  documentId: mongoose.Schema.Types.ObjectId,
  description: String,
  details: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
