const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['owner', 'editor'], default: 'owner', required: true },
  sessionVersion: { type: Number, default: 0 },
  totpSecret: { type: String, select: false },
  lastLoginAt: Date,
  loginHistory: [{ time: { type: Date, default: Date.now }, device: String, status: { type: String, enum: ['success', 'failed'] } }]
}, { timestamps: true });
module.exports = mongoose.models.Admin || mongoose.model('Admin', UserSchema);
