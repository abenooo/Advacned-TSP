const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');

// Helper to remove sensitive data from user object
const sanitizeUser = (user) => {
  const userObject = user.toObject();
  delete userObject.passwordHash;
  return userObject;
};

// Get all admin users
exports.getAllAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find().select('-passwordHash');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error getting admin users:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving admin users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get one admin user by ID
exports.getAdminUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving admin user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create admin user
exports.createAdminUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    
    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userData.passwordHash = await bcrypt.hash(password, salt);
    }

    const user = new AdminUser(userData);
    await user.save();
    
    res.status(201).json({
      success: true,
      data: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    
    // Handle duplicate key error (unique email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update admin user
exports.updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, email, role, ...updateData } = req.body;
    
    // Check if user exists
    const existingUser = await AdminUser.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Prevent updating email to one that's already in use
    if (email && email !== existingUser.email) {
      const emailExists = await AdminUser.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
          code: 'EMAIL_IN_USE'
        });
      }
      updateData.email = email;
    }

    // Only allow super_admins to change roles
    if (role && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can change user roles',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    if (role) updateData.role = role;

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
      updateData.passwordChangedAt = Date.now();
    }

    // Prevent updating certain fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Handle duplicate key error (unique email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating admin user',
      code: 'SERVER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete admin user
exports.deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting self
    if (id === req.user.id || id === req.user._id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
        code: 'SELF_DELETE_NOT_ALLOWED'
      });
    }
    
    // Check if user exists
    const user = await AdminUser.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Only allow super_admins to delete other admins
    if (user.role === 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can delete admin users',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    // Perform the deletion
    await AdminUser.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        deleted: true
      }
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error deleting admin user',
      code: 'SERVER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
