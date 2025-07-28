const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

router.post('/login', async (req, res) => {
  try {
    console.log('\n=== Login Attempt ===');
    console.log('Email:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.error('❌ Missing email or password');
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email and include password hash
    const user = await AdminUser.findOne({ email }).select('+passwordHash');
    
    if (!user) {
      console.error('❌ User not found with email:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    console.log('🔑 Verifying password for user:', user.email);
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      console.error('❌ Invalid password for user:', user.email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    console.log('✅ Login successful for user:', user.email, 'Role:', user.role);
    
    // Generate token with user data
    const token = generateToken(user);
    
    // Return user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other non-sensitive user fields here
    };
    
    res.json({ 
      success: true,
      token, 
      user: userResponse 
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
