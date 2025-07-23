const Application = require('../models/Application');

// Get all applications
exports.getAllApplications = async (req, res) => {
  const applications = await Application.find()
    .populate('jobId', 'title')
    .populate('processedBy', 'name email');
  res.json(applications);
};

// Get one application by ID
exports.getApplicationById = async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('jobId', 'title')
    .populate('processedBy', 'name email');
  if (!application) return res.status(404).json({ message: 'Not found' });
  res.json(application);
};

// Create an application
exports.createApplication = async (req, res) => {
  const application = new Application(req.body);
  await application.save();
  res.status(201).json(application);
};

// Update an application
exports.updateApplication = async (req, res) => {
  const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!application) return res.status(404).json({ message: 'Not found' });
  res.json(application);
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  await Application.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
