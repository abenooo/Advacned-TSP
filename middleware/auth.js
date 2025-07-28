const { verifyToken } = require('../utils/jwt');

/**
 * Authentication middleware that verifies JWT token and attaches user to request
 */
module.exports = (req, res, next) => {
  try {
    console.log('\n=== Auth Middleware Triggered ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Method:', req.method);
    
    // Get the authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    // Check if authorization header exists
    if (!authHeader) {
      console.error('❌ No authorization header found');
      return res.status(401).json({ 
        success: false,
        message: 'No authorization token provided',
        code: 'MISSING_AUTH_HEADER'
      });
    }
    
    // Check if the token is in the correct format (Bearer <token>)
    if (!authHeader.startsWith('Bearer ')) {
      console.error('❌ Invalid authorization header format');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format. Use: Bearer <token>',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.error('❌ No token found in authorization header');
      return res.status(401).json({ 
        success: false,
        message: 'No token provided after Bearer',
        code: 'MISSING_TOKEN'
      });
    }
    
    console.log('🔐 Verifying token...');
    
    // Verify the token using our utility
    const decoded = verifyToken(token);
    
    // Log successful verification
    console.log('✅ Token verified successfully');
    console.log('User ID:', decoded.id || decoded._id);
    console.log('User role:', decoded.role);
    
    // Attach the decoded user to the request object
    req.user = {
      id: decoded.id || decoded._id,
      _id: decoded.id || decoded._id,  // For backward compatibility
      email: decoded.email,
      role: decoded.role
    };
    
    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    
    // Determine the appropriate status code and error message
    let statusCode = 401;
    let errorMessage = 'Authentication failed';
    let errorCode = 'AUTH_FAILED';
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Your session has expired. Please log in again.';
      errorCode = 'TOKEN_EXPIRED';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token. Please log in again.';
      errorCode = 'INVALID_TOKEN';
    } else if (error.message && error.message.includes('user ID')) {
      errorMessage = 'Invalid user information in token';
      errorCode = 'INVALID_USER';
    } else {
      // For other unexpected errors
      statusCode = 500;
      errorMessage = 'An error occurred during authentication';
      errorCode = 'AUTH_ERROR';
    }
    
    // Send error response
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      code: errorCode,
      // Include debug info in development
      ...(process.env.NODE_ENV === 'development' ? {
        error: error.message,
        stack: error.stack
      } : {})
    });
  }
};
