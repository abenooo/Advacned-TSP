const express = require('express');
const router = express.Router();

const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../controller/applicationController');

// Public or protect as needed
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);

// Admin or protect as needed
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
