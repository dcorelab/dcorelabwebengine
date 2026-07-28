const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
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
  icon: {
    type: String, // Cloudinary URL
    required: true
  },
  image: {
    type: String, // Cloudinary URL
    required: true
  },
  features: [{
    type: String
  }],
  price: {
    type: Number,
    default: null
  },
  pricingPlan: [{
    name: String,
    price: Number,
    features: [String]
  }],
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

ServiceSchema.index({ title: 1 });
ServiceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
