const mongoose = require('mongoose');
const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    console.log('GET /api/services called');
    const services = await Service.find().populate('createdBy', 'name email role');
    console.log(`Found ${services.length} services`);
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error in getAllServices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
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
    
    console.log(`[DEBUG] Looking up service with slug: ${slug}`);
    
    // Simple query to find by slug first
    let service = await Service.findOne({ slug })
      .lean()
      .populate('createdBy', 'name email role');
    
    if (service) {
      console.log(`[DEBUG] Found service by slug: ${service.name}`);
      return res.json({
        success: true,
        data: service
      });
    }
    
    // If not found by slug, try by ID if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(slug)) {
      console.log(`[DEBUG] No service found by slug, trying by _id: ${slug}`);
      service = await Service.findById(slug)
        .lean()
        .populate('createdBy', 'name email role');
        
      if (service) {
        console.log(`[DEBUG] Found service by _id: ${service.name}`);
        return res.json({
          success: true,
          data: service
        });
      }
    }
    
    // If still not found, log available services for debugging
    console.log('[DEBUG] Service not found, listing all available services:');
    const allServices = await Service.find({}, 'name slug').lean();
    console.log(JSON.stringify(allServices, null, 2));
    
    // Try to find similar slugs (case-insensitive)
    const similarServices = allServices.filter(s => 
      s.slug && s.slug.toLowerCase().includes(slug.toLowerCase())
    );
    
    return res.status(404).json({
      success: false,
      message: 'Service not found',
      debug: {
        searchedFor: slug,
        availableServices: allServices.map(s => ({ 
          name: s.name, 
          slug: s.slug,
          id: s._id
        })),
        similarServices: similarServices.map(s => ({
          name: s.name,
          slug: s.slug,
          id: s._id
        }))
      }
    });
    
  } catch (error) {
    console.error('Error in getServiceById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Get service by slug with sub-service - FIXED VERSION
exports.getServiceWithSubService = async (req, res) => {
  try {
    const { serviceSlug, subServiceSlug } = req.params;
    
    console.log(`[DEBUG] Looking for service: ${serviceSlug}, subService: ${subServiceSlug}`);
    
    const service = await Service.findOne({ slug: serviceSlug }).populate('createdBy', 'name email role');
    
    if (!service) {
      console.log(`[DEBUG] Service not found: ${serviceSlug}`);
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    console.log(`[DEBUG] Found service: ${service.name}, looking for subService: ${subServiceSlug}`);
    console.log(`[DEBUG] Available subServices:`, service.subServices.map(s => s.slug));
    
    const subService = service.subServices.find(sub => sub.slug === subServiceSlug);
    if (!subService) {
      console.log(`[DEBUG] Sub-service not found: ${subServiceSlug}`);
      return res.status(404).json({
        success: false,
        message: 'Sub-service not found',
        debug: {
          serviceSlug: serviceSlug,
          subServiceSlug: subServiceSlug,
          availableSubServices: service.subServices.map(s => ({
            name: s.subServiceName,
            slug: s.slug
          }))
        }
      });
    }
    
    console.log(`[DEBUG] Found sub-service: ${subService.subServiceName}`);
    
    // Return the response - REMOVED THE DUPLICATE res.json() call
    return res.json({
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
        subService: subService
      }
    });
    
  } catch (error) {
    console.error('Error in getServiceWithSubService:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
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
      error: error.message
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
      error: error.message
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
      error: error.message
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
      error: error.message
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
      error: error.message
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
      error: error.message
    });
  }
};