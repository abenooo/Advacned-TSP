const AdminUser = require('../models/AdminUser');

module.exports = async function (req, res, next) {
  try {
    console.log('Admin middleware triggered');
    console.log('User from auth middleware:', req.user);
    
    // Get the user from the request object (set by auth middleware)
    const user = req.user;
    
    if (!user) {
      console.error('No user found in request');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required.'
      });
    }

    // Log the user ID we're trying to find
    console.log('Looking for user with ID:', user.id || user._id);
    
    // Try to find the user by ID
    const adminUser = await AdminUser.findOne({
      $or: [
        { _id: user.id || user._id },
        { email: user.email }
      ]
    });
    
    console.log('Found admin user:', adminUser);
    
    if (!adminUser) {
      console.error('User not found in database');
      return res.status(403).json({ 
        success: false,
        message: 'User account not found.'
      });
    }
    
    if (adminUser.role !== 'admin' && adminUser.role !== 'super_admin') {
      console.error('User does not have admin role. User role:', adminUser.role);
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Attach the full admin user object to the request
    req.adminUser = adminUser;
    console.log('Admin access granted for user:', adminUser.email, 'Role:', adminUser.role);
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
