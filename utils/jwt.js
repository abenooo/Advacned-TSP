const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Generate a JWT token for a user
 * @param {Object} user - The user object from the database
 * @returns {String} JWT token
 */
exports.generateToken = (user) => {
  // Ensure we have a valid user ID
  if (!user._id && !user.id) {
    throw new Error('User must have an ID');
  }
  
  // Convert to string to ensure consistency
  const userId = user._id ? user._id.toString() : user.id.toString();
  
  // Create the token payload
  const payload = {
    id: userId,      // Standard claim
    _id: userId,     // For backward compatibility
    email: user.email,
    role: user.role || 'marketing'  // Default role if not specified
  };
  
  // Sign the token
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

/**
 * Verify and decode a JWT token
 * @param {String} token - The JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
exports.verifyToken = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, SECRET);
    
    // Ensure we have a valid user ID in the token
    if (!decoded.id && !decoded._id) {
      throw new Error('Invalid token: missing user ID');
    }
    
    // Ensure the ID is a valid MongoDB ObjectId if it exists
    if (decoded.id && !mongoose.Types.ObjectId.isValid(decoded.id)) {
      throw new Error('Invalid token: invalid user ID format');
    }
    
    return decoded;
  } catch (error) {
    // Enhance the error message for better debugging
    if (error.name === 'TokenExpiredError') {
      error.message = 'Token has expired. Please log in again.';
    } else if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token. Please log in again.';
    }
    throw error;
  }
};

/**
 * Get the user ID from a token
 * @param {String} token - The JWT token
 * @returns {String} The user ID
 */
exports.getUserIdFromToken = (token) => {
  const decoded = this.verifyToken(token);
  return decoded.id || decoded._id;
};
