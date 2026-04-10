// routes/auth.js
const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/admin/auth.controller'); // Adjust path as needed
const { isAuthenticated, isNotAuthenticated } = require('../../middleware/authmiddlware'); // Adjust path as needed

// Public routes
router.get('/signup', isNotAuthenticated, AuthController.getSignup);
router.post('/signup', isNotAuthenticated, AuthController.signup);

router.get('/login', isNotAuthenticated, AuthController.getLogin);
router.post('/login', isNotAuthenticated, AuthController.login);

router.post('/verify-otp', AuthController.verifyOTP);

// Protected routes
router.get('/dashboard', isAuthenticated, AuthController.dashboard);
router.get('/logout', isAuthenticated, AuthController.logout);

module.exports = router;