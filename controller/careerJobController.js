const CareerJob = require('../models/CareerJob');

// Get all career jobs
exports.getAllCareerJobs = async (req, res) => {
  const jobs = await CareerJob.find().populate('createdBy', 'name email');
  res.json(jobs);
};

// Get one career job by ID
exports.getCareerJobById = async (req, res) => {
  const job = await CareerJob.findById(req.params.id).populate('createdBy', 'name email');
  if (!job) return res.status(404).json({ message: 'Not found' });
  res.json(job);
};

// Create a career job
exports.createCareerJob = async (req, res) => {
  const job = new CareerJob(req.body);
  await job.save();
  res.status(201).json(job);
};

// Update a career job
exports.updateCareerJob = async (req, res) => {
  const job = await CareerJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!job) return res.status(404).json({ message: 'Not found' });
  res.json(job);
};

// Delete a career job
exports.deleteCareerJob = async (req, res) => {
  await CareerJob.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
