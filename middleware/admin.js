const AdminUser = require('../models/AdminUser');

module.exports = async function (req, res, next) {
  try {
    console.log('\n=== Admin Middleware Triggered ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Authorization Header:', req.headers.authorization || 'No Authorization header');
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

    // Log the user ID we're trying to find - handle both id and _id
    const userId = user.id || user._id;
    console.log('🔍 Looking for user with ID:', userId, 'or email:', user.email);
    
    // Build the query to find the user
    const query = {
      $or: [
        { _id: userId },
        { email: user.email }
      ]
    };
    
    console.log('🔍 Database query:', JSON.stringify(query, null, 2));
    
    // Try to find the user by ID or email
    const adminUser = await AdminUser.findOne(query);
    
    if (!adminUser) {
      console.error('❌ User not found in database with query:', JSON.stringify(query, null, 2));
      return res.status(403).json({ 
        success: false,
        message: 'User account not found.',
        debug: {
          query,
          userId: userId,
          userEmail: user.email
        }
      });
    }
    
    // Log the user's role for debugging
    console.log('👤 Found user in database:', {
      _id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
      isAdmin: adminUser.isAdmin(),
      isSuperAdmin: adminUser.isSuperAdmin()
    });
    
    // Check if user has admin privileges using the model method
    if (!adminUser.isAdmin()) {
      console.error('❌ User does not have admin role. User role:', adminUser.role);
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.',
        debug: {
          userId: adminUser._id,
          userEmail: adminUser.email,
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
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      debug: process.env.NODE_ENV === 'development' ? {
        user: req.user,
        headers: req.headers
      } : undefined
    });
  }
};
