const express = require('express');
const router = express.Router();

const {
  getAllCareerJobs,
  getCareerJobById,
  createCareerJob,
  updateCareerJob,
  deleteCareerJob
} = require('../controller/careerJobController');

// Public or protect as needed
router.get('/', getAllCareerJobs);
router.get('/:id', getCareerJobById);

// Admin or protect as needed
router.post('/', createCareerJob);
router.put('/:id', updateCareerJob);
router.delete('/:id', deleteCareerJob);

module.exports = router;
