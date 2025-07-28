const AdminUser = require('../models/AdminUser');

module.exports = async function (req, res, next) {
  try {
    console.log('\n=== Admin Middleware Triggered ===');
    console.log('Request URL:', req.originalUrl);
    console.log('User from auth middleware:', JSON.stringify(req.user, null, 2));
    
    // Get the user from the request object (set by auth middleware)
    const user = req.user;
    
    if (!user) {
      console.error('❌ No user found in request');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required.'
      });
    }

    // Log the user ID we're trying to find
    console.log('🔍 Looking for user with ID:', user.id || user._id, 'or email:', user.email);
    
    // Try to find the user by ID or email
    const adminUser = await AdminUser.findOne({
      $or: [
        { _id: user.id || user._id },
        { email: user.email }
      ]
    }); // Remove lean() to use instance methods
    
    if (!adminUser) {
      console.error('❌ User not found in database');
      return res.status(403).json({ 
        success: false,
        message: 'User account not found.'
      });
    }
    
    // Log the user's role for debugging
    console.log('👤 User role:', adminUser.role);
    console.log('Is admin?', adminUser.isAdmin());
    console.log('Is super admin?', adminUser.isSuperAdmin());
    
    // Check if user has admin privileges using the model method
    if (!adminUser.isAdmin()) {
      console.error('❌ User does not have admin role. User role:', adminUser.role);
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.',
        debug: {
          userId: user.id || user._id,
          userRole: adminUser.role,
          requiredRoles: ['admin', 'super_admin']
        }
      });
    }

    // Attach the admin user to the request (passwordHash is automatically removed by toJSON)
    req.adminUser = adminUser;
    
    console.log('✅ Admin access granted for user:', adminUser.email, 'Role:', adminUser.role);
    next();
  } catch (error) {
    console.error('❌ Admin middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
