const express = require('express');
const router = express.Router();

const {
  getAllAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} = require('../controller/adminUserController');

// Public (or protect as needed)
router.get('/', getAllAdminUsers);
router.get('/:id', getAdminUserById);

// Admin (protect as needed)
router.post('/', createAdminUser);
router.put('/:id', updateAdminUser);
router.delete('/:id', deleteAdminUser);

module.exports = router;
