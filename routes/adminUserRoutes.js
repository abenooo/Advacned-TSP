const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Assuming you have an admin middleware
const {
  getAllAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} = require('../controller/adminUserController');

// Apply auth middleware to all routes
router.use(auth);

// Get all admin users (admin only)
router.get('/', admin, getAllAdminUsers);

// Get specific admin user (admin only)
router.get('/:id', admin, getAdminUserById);

// Create new admin user (admin only)
router.post('/', admin, createAdminUser);

// Update admin user (admin only)
router.put('/:id', admin, updateAdminUser);

// Delete admin user (admin only)
router.delete('/:id', admin, deleteAdminUser);

module.exports = router;
