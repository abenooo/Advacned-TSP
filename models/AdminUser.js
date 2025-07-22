const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'editor' },
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', AdminUserSchema);
