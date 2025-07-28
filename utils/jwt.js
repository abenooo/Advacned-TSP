const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.generateToken = (user) => {
  // Ensure we're using the correct user ID format
  const userId = user._id || user.id;
  return jwt.sign(
    { 
      _id: userId,  // Use _id for consistency with Mongoose
      id: userId,   // Also include id for backward compatibility
      email: user.email, 
      role: user.role 
    },
    SECRET,
    { expiresIn: '7d' }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
