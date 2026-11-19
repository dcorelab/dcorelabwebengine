const jwt = require('jsonwebtoken');
const Admin = require('../models/user');
const connectDB = require('../config/db');
const { cookieName, originOK } = require('./adminAuth');
function secret() { if (!process.env.ADMIN_JWT_SECRET || process.env.ADMIN_JWT_SECRET.length < 32) throw new Error('Admin auth is not configured'); return process.env.ADMIN_JWT_SECRET; }
exports.requireAdmin = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies[cookieName];
    if (!token) return req.accepts('html') ? res.redirect('/admin/login') : res.status(401).json({ error: 'Unauthorized' });
    const claims = jwt.verify(token, secret(), { issuer: 'dcorelab-admin', audience: 'dcorelab-admin' });
    await connectDB(); const admin = await Admin.findById(claims.sub);
    if (!admin || admin.sessionVersion !== claims.sv || admin.role !== claims.role) throw new Error('Invalid session');
    req.admin = admin;
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !originOK(req)) return res.status(403).json({ error: 'Invalid request origin' });
    next();
  } catch (_) {
    res.clearCookie(cookieName, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
    return req.accepts('html') ? res.redirect('/admin/login') : res.status(401).json({ error: 'Unauthorized' });
  }
};
exports.requireRole = (...roles) => (req, res, next) => roles.includes(req.admin && req.admin.role) ? next() : res.status(403).json({ error: 'Forbidden' });
