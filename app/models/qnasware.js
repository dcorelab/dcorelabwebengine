const mongoose = require('mongoose');

const ChatbotFAQSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
    unique: true
  },
  answer: {
    type: String,
    required: true
  },
  keywords: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
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

ChatbotFAQSchema.index({ category: 1 });
ChatbotFAQSchema.index({ isActive: 1 });
ChatbotFAQSchema.index({ keywords: 1 });

module.exports = mongoose.model('ChatbotFAQ', ChatbotFAQSchema);
