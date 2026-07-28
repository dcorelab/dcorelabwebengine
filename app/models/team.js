const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: null
  },
  image: {
    type: String, // Cloudinary URL
    required: true
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  expertise: [{
    type: String
  }],
  socialLinks: {
    twitter: { type: String, default: null },
    linkedin: { type: String, default: null },
    github: { type: String, default: null },
    portfolio: { type: String, default: null }
  },
  order: {
    type: Number,
    default: 0
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

TeamSchema.index({ isActive: 1 });

module.exports = mongoose.model('TeamMember', TeamSchema);
