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

/**
 * @route   GET /api/services
 * @desc    Get all services
 * @access  Public
 */
router.get('/', getAllServices);

/**
 * @route   GET /api/services/:slug/:subSlug
 * @desc    Get a specific sub-service within a service
 * @access  Public
 * @note    This route must come before the single service route
 */
router.get('/:slug/:subSlug', getServiceWithSubService);

/**
 * @route   GET /api/services/:slug
 * @desc    Get a single service by slug
 * @access  Public
 */
router.get('/:slug', getServiceById);

// Protected routes (require authentication)

/**
 * @route   POST /api/services
 * @desc    Create a new service
 * @access  Private (Admin)
 */
router.post('/', auth, createService);

/**
 * @route   PUT /api/services/:id
 * @desc    Update a service by ID
 * @access  Private (Admin)
 */
router.put('/:id', auth, updateService);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service by ID
 * @access  Private (Admin)
 */
router.delete('/:id', auth, deleteService);

/**
 * @route   POST /api/services/:id/subservice
 * @desc    Add a new sub-service to a service
 * @access  Private (Admin)
 */
router.post('/:id/subservice', auth, addSubService);

/**
 * @route   PUT /api/services/:id/subservice/:subSlug
 * @desc    Update a sub-service
 * @access  Private (Admin)
 */
router.put('/:id/subservice/:subSlug', auth, updateSubService);

/**
 * @route   DELETE /api/services/:id/subservice/:subSlug
 * @desc    Delete a sub-service
 * @access  Private (Admin)
 */
router.delete('/:id/subservice/:subSlug', auth, deleteSubService);

module.exports = router;
