const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// Local admin check to avoid external dependency
const requireAdmin = (req, res, next) => {
  if (req?.user?.role === 'admin' || req?.user?.role === 'super_admin') return next();
  return res.status(403).json({ success: false, message: 'Admin access required' });
};

const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact
} = require('../controller/contactController');

// Public route: submit contact form
router.post('/', createContact);

// Protected routes: only admins can view/manage contacts
router.use(auth, requireAdmin);

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
