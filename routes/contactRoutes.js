const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleAuth');

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
router.use(auth, isAdmin);

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
