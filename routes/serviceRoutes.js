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
router.get('/:slug/sub/:subSlug', getServiceWithSubService); // sub-service route
router.get('/:slug', getServiceById); // id or slug route
router.get('/:slug/:subSlug', getServiceWithSubService); // two segments, both required
router.get('/:slug', getServiceById); // one segment, could be id or slug

// Protected routes
router.post('/', auth, createService);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);

// Sub-service routes
router.post('/:id/subservice', auth, addSubService);
router.put('/:id/subservice/:subSlug', auth, updateSubService);
router.delete('/:id/subservice/:subSlug', auth, deleteSubService);

module.exports = router;
