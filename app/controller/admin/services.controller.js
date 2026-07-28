const Service = require('../../models/services');
const { deleteResource } = require('../../config/cloudinary');

class ServicesController {
  // Get all services
  getAllServices = async (req, res) => {
    try {
      const services = await Service.find().sort({ order: 1 });
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get service by ID
  getServiceById = async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create service
  createService = async (req, res) => {
    try {
      const { title, description, shortDescription, features, price, pricingPlan } = req.body;

      if (!title || !description || !req.file) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const newService = new Service({
        title,
        description,
        shortDescription,
        icon: req.file.path, // Cloudinary URL
        image: req.file.path,
        features: features ? JSON.parse(features) : [],
        price,
        pricingPlan: pricingPlan ? JSON.parse(pricingPlan) : [],
        order: (await Service.countDocuments()) + 1
      });

      const saved = await newService.save();
      res.status(201).json({ success: true, message: 'Service created', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update service
  updateService = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (req.file) {
        updates.image = req.file.path;
        updates.icon = req.file.path;
      }

      if (updates.features && typeof updates.features === 'string') {
        updates.features = JSON.parse(updates.features);
      }

      if (updates.pricingPlan && typeof updates.pricingPlan === 'string') {
        updates.pricingPlan = JSON.parse(updates.pricingPlan);
      }

      updates.updatedAt = new Date();

      const updated = await Service.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      res.json({ success: true, message: 'Service updated', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Delete service
  deleteService = async (req, res) => {
    try {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      // Delete image from Cloudinary if exists
      if (service.image) {
        const publicId = service.image.split('/').pop().split('.')[0];
        await deleteResource(`dcore-lab/${publicId}`);
      }

      res.json({ success: true, message: 'Service deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Reorder services
  reorderServices = async (req, res) => {
    try {
      const { serviceIds } = req.body;
      
      for (let i = 0; i < serviceIds.length; i++) {
        await Service.findByIdAndUpdate(serviceIds[i], { order: i });
      }

      res.json({ success: true, message: 'Services reordered' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ServicesController();
