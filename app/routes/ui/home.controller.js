const express = require('express');
const router = express.Router();
const homeController = require('../../controller/ui/home.controller');

// Home route
router.get('/', homeController.home);

// Additional page routes will be added here
router.get('/about', homeController.about);
router.get('/services', homeController.services);
router.get('/portfolio', homeController.portfolio);
router.get('/blog', homeController.blog);
router.get('/contactus', homeController.contactus);
router.get('/projects', homeController.portfolio); // Alias for portfolio

module.exports = router;
