const mongoose = require('mongoose');

const homeVisitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  referrer: {
    type: String,
    default: 'Direct'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for fast queries
homeVisitSchema.index({ timestamp: -1 });
homeVisitSchema.index({ ip: 1 });

module.exports = mongoose.model('HomeVisit', homeVisitSchema);