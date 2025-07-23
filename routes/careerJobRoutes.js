const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllCareerJobs,
  getCareerJobById,
  createCareerJob,
  updateCareerJob,
  deleteCareerJob
} = require('../controller/careerJobController');

// Public
router.get('/', getAllCareerJobs);
router.get('/:id', getCareerJobById);

// Protected
router.post('/', auth, createCareerJob);
router.put('/:id', auth, updateCareerJob);
router.delete('/:id', auth, deleteCareerJob);

module.exports = router;
