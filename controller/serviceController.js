const mongoose = require('mongoose');
const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('createdBy', 'name email role');
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get one service by ID or slug
exports.getServiceById = async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'No slug provided'
      });
    }
    
    const service = await Service.findOne({ slug })
      .lean()
      .populate('createdBy', 'name email role');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get service by slug with sub-service
exports.getServiceWithSubService = async (req, res) => {
  try {
    const { serviceSlug, subServiceSlug } = req.params;
    
    const service = await Service.findOne({ slug: serviceSlug })
      .populate('createdBy', 'name email role');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const subService = service.subServices.find(sub => sub.slug === subServiceSlug);
    if (!subService) {
      return res.status(404).json({
        success: false,
        message: 'Sub-service not found',
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            serviceSlug,
            subServiceSlug,
            availableSubServices: service.subServices.map(s => ({
              name: s.subServiceName,
              slug: s.slug
            }))
          }
        })
      });
    }

    res.json({
      success: true,
      data: {
        service: {
          _id: service._id,
          name: service.name,
          slug: service.slug,
          description: service.description,
          moto: service.moto,
          imageUrl: service.imageUrl,
          icon: service.icon
        },
        subService
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create main service
exports.createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.user?.id // Assuming auth middleware sets req.user
    };
    const service = new Service(serviceData);
    await service.save();
    const populatedService = await Service.findById(service._id).populate('createdBy', 'name email role');
    res.status(201).json({
      success: true,
      data: populatedService,
      message: 'Service created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Service with this slug already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error creating service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update main service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete main service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Add subService
exports.addSubService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    // Check if sub-service slug already exists
    const existingSubService = service.subServices.find(sub => sub.slug === req.body.slug);
    if (existingSubService) {
      return res.status(400).json({
        success: false,
        message: 'Sub-service with this slug already exists'
      });
    }
    service.subServices.push(req.body);
    await service.save();
    const populatedService = await Service.findById(service._id).populate('createdBy', 'name email role');
    res.status(201).json({
      success: true,
      data: populatedService,
      message: 'Sub-service added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding sub-service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update subService
exports.updateSubService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    const subService = service.subServices.find(s => s.slug === req.params.subSlug);
    if (!subService) {
      return res.status(404).json({
        success: false,
        message: 'Sub-service not found'
      });
    }
    Object.assign(subService, req.body);
    await service.save();
    const populatedService = await Service.findById(service._id).populate('createdBy', 'name email role');
    res.json({
      success: true,
      data: populatedService,
      message: 'Sub-service updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating sub-service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete subService
exports.deleteSubService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    const initialLength = service.subServices.length;
    service.subServices = service.subServices.filter(s => s.slug !== req.params.subSlug);
    if (service.subServices.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Sub-service not found'
      });
    }
    await service.save();
    const populatedService = await Service.findById(service._id).populate('createdBy', 'name email role');
    res.json({
      success: true,
      data: populatedService,
      message: 'Sub-service deleted successfully'
    });  
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sub-service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};