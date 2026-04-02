const express = require('express');
const router = express.Router();
const homeController = require('../../controller/ui/home.controller');

router.get('/', homeController.home);

module.exports = router;