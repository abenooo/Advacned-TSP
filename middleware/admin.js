const AdminUser = require('../models/AdminUser');

module.exports = async function (req, res, next) {
  try {
    // Get the user from the request object (set by auth middleware)
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required.'
      });
    }

    // Verify the user exists and has admin or super_admin role
    const adminUser = await AdminUser.findById(user._id);
    
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin')) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Attach the full admin user object to the request
    req.adminUser = adminUser;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization.'
    });
  }
};
