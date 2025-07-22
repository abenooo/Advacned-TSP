const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
  console.log('GET /api/services called');
  const services = await Service.find();
  res.json(services);
};

// Get one service
exports.getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Not found' });
  res.json(service);
};

// Create main service
exports.createService = async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.status(201).json(service);
};

// Update main service
exports.updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) return res.status(404).json({ message: 'Not found' });
  res.json(service);
};

// Delete main service
exports.deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// Add subService
exports.addSubService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  service.subServices.push(req.body);
  await service.save();
  res.json(service);
};

// Update subService
exports.updateSubService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  const subService = service.subServices.find(s => s.slug === req.params.subSlug);
  if (!subService) return res.status(404).json({ message: 'Sub-service not found' });

  Object.assign(subService, req.body);
  await service.save();
  res.json(service);
};

// Delete subService
exports.deleteSubService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  service.subServices = service.subServices.filter(s => s.slug !== req.params.subSlug);
  await service.save();
  res.json(service);
};
