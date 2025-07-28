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
    const { password, ...updateData } = req.body;
    
    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const user = await AdminUser.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
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
    console.error('Error updating admin user:', error);
    
    // Handle duplicate key error (unique email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating admin user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete admin user
exports.deleteAdminUser = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting admin user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
