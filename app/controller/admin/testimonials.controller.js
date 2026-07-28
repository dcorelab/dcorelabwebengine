const Testimonial = require('../../models/testimonials');
const { deleteResource } = require('../../config/cloudinary');

class TestimonialsController {
  // Get all testimonials
  getAllTestimonials = async (req, res) => {
    try {
      const testimonials = await Testimonial.find().sort({ order: 1 });
      res.json({ success: true, data: testimonials });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get featured testimonials
  getFeaturedTestimonials = async (req, res) => {
    try {
      const testimonials = await Testimonial.find({ featured: true, isActive: true }).sort({ order: 1 });
      res.json({ success: true, data: testimonials });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create testimonial
  createTestimonial = async (req, res) => {
    try {
      const { clientName, clientTitle, clientCompany, content, rating, featured } = req.body;

      if (!clientName || !clientTitle || !content) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const newTestimonial = new Testimonial({
        clientName,
        clientTitle,
        clientCompany: clientCompany || null,
        content,
        image: req.file ? req.file.path : null,
        rating: rating || 5,
        featured: featured === 'true',
        order: (await Testimonial.countDocuments()) + 1
      });

      const saved = await newTestimonial.save();
      res.status(201).json({ success: true, message: 'Testimonial created', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update testimonial
  updateTestimonial = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (req.file) {
        updates.image = req.file.path;
      }

      if (updates.rating) {
        updates.rating = Math.min(5, Math.max(1, parseInt(updates.rating)));
      }

      if (updates.featured) {
        updates.featured = updates.featured === 'true';
      }

      updates.updatedAt = new Date();

      const updated = await Testimonial.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Testimonial not found' });
      }

      res.json({ success: true, message: 'Testimonial updated', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Delete testimonial
  deleteTestimonial = async (req, res) => {
    try {
      const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ success: false, message: 'Testimonial not found' });
      }

      if (testimonial.image) {
        const publicId = testimonial.image.split('/').pop().split('.')[0];
        await deleteResource(`dcore-lab/${publicId}`);
      }

      res.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Reorder testimonials
  reorderTestimonials = async (req, res) => {
    try {
      const { testimonialIds } = req.body;
      
      for (let i = 0; i < testimonialIds.length; i++) {
        await Testimonial.findByIdAndUpdate(testimonialIds[i], { order: i });
      }

      res.json({ success: true, message: 'Testimonials reordered' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new TestimonialsController();
