const express = require('express');
const router = express.Router();

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  addSubService,
  updateSubService,
  deleteSubService
} = require('../controller/serviceController');

// Public
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Admin
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

// Manage subServices
router.post('/:id/subservice', addSubService);
router.put('/:id/subservice/:subSlug', updateSubService);
router.delete('/:id/subservice/:subSlug', deleteSubService);

module.exports = router;
