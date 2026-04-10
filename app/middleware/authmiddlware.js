// middleware/auth.js
const Admin = require('../models/user'); // Adjust path as needed

// Middleware to check if admin is authenticated
const isAuthenticated = async (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  try {
    const admin = await Admin.findById(req.session.adminId);
    if (!admin || !admin.isVerified) {
      req.session.destroy((err) => {
        if (err) console.error(err);
      });
      return res.redirect('/admin/login');
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error(err);
    res.redirect('/admin/login');
  }
};

// Middleware to check if admin is not authenticated (for public routes like login/signup)
const isNotAuthenticated = (req, res, next) => {
  if (req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

module.exports = { isAuthenticated, isNotAuthenticated };