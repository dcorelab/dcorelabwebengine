const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OtpSchema = new Schema({
  otp: String,
  expiresAt: Date,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const LoginLogSchema = new Schema({
  time: { type: Date, default: Date.now },
  ipAddress: String,
  device: String,
  status: { type: String, enum: ["success", "failed"], default: "success" },
  username: String,
})

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  loginHistory: [LoginLogSchema],
  otpHistory: [OtpSchema],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Admin", AdminSchema)
