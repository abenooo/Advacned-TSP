const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = (req, res, next) => {
  console.log('Auth middleware triggered');
  console.log('Request URL:', req.originalUrl);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    console.error('No authorization header found');
    return res.status(401).json({ 
      success: false,
      message: 'No authorization token provided' 
    });
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    console.error('Invalid authorization header format');
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token format. Use Bearer <token>' 
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    console.error('No token found in authorization header');
    return res.status(401).json({ 
      success: false,
      message: 'No token provided after Bearer' 
    });
  }
  
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, SECRET);
    console.log('Token verified successfully. User:', decoded);
    
    // Attach the decoded user to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    
    let errorMessage = 'Invalid token';
    
    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token has expired';
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Malformed token';
    }
    
    return res.status(401).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
