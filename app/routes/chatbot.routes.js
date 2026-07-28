const express = require('express');
const router = express.Router();
const chatbotController = require('../controller/chatbot.controller');

// Public chatbot endpoints
router.post('/message', chatbotController.getChatbotResponse);
router.post('/feedback', chatbotController.recordFeedback);
router.get('/stats', chatbotController.getStats);

module.exports = router;
