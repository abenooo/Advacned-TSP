const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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

// Protected
router.post('/', auth, createService);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);

router.post('/:id/subservice', auth, addSubService);
router.put('/:id/subservice/:subSlug', auth, updateSubService);
router.delete('/:id/subservice/:subSlug', auth, deleteSubService);

module.exports = router;
