const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  clientTitle: {
    type: String,
    required: true
  },
  clientCompany: {
    type: String,
    default: null
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String, // Cloudinary URL
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TestimonialSchema.index({ featured: 1 });
TestimonialSchema.index({ isActive: 1 });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
