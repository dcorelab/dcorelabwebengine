const express = require('express');
const router = express.Router();
const Admin = require('../../models/user');
const bcrypt = require('bcryptjs');
const connectDB = require('../../config/db');
const { passwordValid } = require('../../middleware/adminAuth');
(async () => { await connectDB(); const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase(); const password = process.env.ADMIN_PASSWORD || ''; if (!email || !passwordValid(password)) throw new Error('Set ADMIN_EMAIL and a strong ADMIN_PASSWORD (12+ chars with upper, lower, number and symbol).'); if (await Admin.exists({ role: 'owner' })) throw new Error('An owner already exists; refusing to create another.'); await Admin.create({ email, username: email.split('@')[0], role: 'owner', passwordHash: await bcrypt.hash(password, 12) }); console.log('Initial owner created. Remove ADMIN_PASSWORD from the environment after seeding.'); })().catch(err => { console.error(err.message); process.exitCode = 1; });
