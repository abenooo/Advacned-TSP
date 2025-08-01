const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllServices,
  getServiceById,
  getServiceWithSubService,
  createService,
  updateService,
  deleteService,
  addSubService,
  updateSubService,
  deleteSubService
} = require('../controller/serviceController');

// Public routes
router.get('/', getAllServices);

// Route for getting a specific sub-service within a service
router.get('/:serviceSlug/:subServiceSlug', getServiceWithSubService);

// Route for getting a single service by slug
router.get('/:slug', getServiceById);

// Protected routes (require authentication)
router.post('/', auth, createService);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);
router.post('/:id/subservice', auth, addSubService);
router.put('/:id/subservice/:subSlug', auth, updateSubService);
router.delete('/:id/subservice/:subSlug', auth, deleteSubService);

module.exports = router;