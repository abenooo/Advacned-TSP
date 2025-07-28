const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'marketing'],
    default: 'marketing',
    required: true
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Remove passwordHash when converting to JSON
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

// Add a method to check if the user has admin privileges
AdminUserSchema.methods.isAdmin = function() {
  return ['super_admin', 'admin'].includes(this.role);
};

// Add a method to check if the user is a super admin
AdminUserSchema.methods.isSuperAdmin = function() {
  return this.role === 'super_admin';
};

module.exports = mongoose.model('AdminUser', AdminUserSchema);
