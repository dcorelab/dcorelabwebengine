const mongoose = require('mongoose');

const FooterSettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Dcore Lab'
  },
  companyDescription: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  logo: {
    type: String, // Cloudinary URL
    default: null
  },
  socialLinks: {
    facebook: { type: String, default: null },
    twitter: { type: String, default: null },
    linkedin: { type: String, default: null },
    instagram: { type: String, default: null },
    github: { type: String, default: null }
  },
  quickLinks: [{
    title: String,
    url: String
  }],
  services: [{
    title: String,
    url: String
  }],
  copyrightText: {
    type: String,
    default: 'Copyright 2024 Dcore Lab. All rights reserved.'
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

module.exports = mongoose.model('FooterSettings', FooterSettingsSchema);
