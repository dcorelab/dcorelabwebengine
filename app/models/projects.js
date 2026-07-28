const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String, // Cloudinary URL
    required: true
  },
  images: [{
    type: String // Cloudinary URLs for gallery
  }],
  videoUrl: {
    type: String, // Cloudinary video URL
    default: null
  },
  client: {
    type: String,
    default: null
  },
  technologies: [{
    type: String
  }],
  liveLink: {
    type: String,
    default: null
  },
  gitLink: {
    type: String,
    default: null
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

ProjectSchema.index({ category: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ isActive: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
