const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../controller/applicationController');

// Public
router.post('/', createApplication);

// Protected
router.get('/', auth, getAllApplications);
router.get('/:id', auth, getApplicationById);
router.put('/:id', auth, updateApplication);
router.delete('/:id', auth, deleteApplication);

module.exports = router;
