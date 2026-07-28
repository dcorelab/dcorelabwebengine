const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, uploadVideo } = require('../../config/cloudinary');
const { isAuthenticated } = require('../../middleware/authmiddlware');

// Import controllers
const servicesController = require('../../controller/admin/services.controller');
const portfolioController = require('../../controller/admin/portfolio.controller');
const blogController = require('../../controller/admin/blog.controller');
const testimonialsController = require('../../controller/admin/testimonials.controller');
const teamController = require('../../controller/admin/team.controller');
const chatbotController = require('../../controller/admin/chatbot.controller');
const contactController = require('../../controller/admin/contact.controller');
const footerController = require('../../controller/admin/footer.controller');

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// =================== SERVICES ROUTES ===================
router.get('/services', servicesController.getAllServices);
router.get('/services/:id', servicesController.getServiceById);
router.post('/services', uploadSingle, servicesController.createService);
router.put('/services/:id', uploadSingle, servicesController.updateService);
router.delete('/services/:id', servicesController.deleteService);
router.post('/services/reorder', servicesController.reorderServices);

// =================== PORTFOLIO ROUTES ===================
router.get('/portfolio', portfolioController.getAllProjects);
router.get('/portfolio/:id', portfolioController.getProjectById);
router.get('/portfolio/category/:category', portfolioController.getByCategory);
router.post('/portfolio', uploadSingle, portfolioController.createProject);
router.put('/portfolio/:id', uploadSingle, portfolioController.updateProject);
router.delete('/portfolio/:id', portfolioController.deleteProject);
router.post('/portfolio/reorder', portfolioController.reorderProjects);

// =================== BLOG ROUTES ===================
router.get('/blog', blogController.getAllBlogs);
router.get('/blog/featured', blogController.getFeaturedBlogs);
router.get('/blog/:id', blogController.getBlogById);
router.get('/blog/category/:category', blogController.getByCategory);
router.post('/blog', uploadSingle, blogController.createBlog);
router.put('/blog/:id', uploadSingle, blogController.updateBlog);
router.delete('/blog/:id', blogController.deleteBlog);

// =================== TESTIMONIALS ROUTES ===================
router.get('/testimonials', testimonialsController.getAllTestimonials);
router.get('/testimonials/featured', testimonialsController.getFeaturedTestimonials);
router.post('/testimonials', uploadSingle, testimonialsController.createTestimonial);
router.put('/testimonials/:id', uploadSingle, testimonialsController.updateTestimonial);
router.delete('/testimonials/:id', testimonialsController.deleteTestimonial);
router.post('/testimonials/reorder', testimonialsController.reorderTestimonials);

// =================== TEAM ROUTES ===================
router.get('/team', teamController.getAllTeam);
router.get('/team/:id', teamController.getTeamMemberById);
router.post('/team', uploadSingle, teamController.createTeamMember);
router.put('/team/:id', uploadSingle, teamController.updateTeamMember);
router.delete('/team/:id', teamController.deleteTeamMember);
router.post('/team/reorder', teamController.reorderTeam);

// =================== CHATBOT FAQ ROUTES ===================
router.get('/chatbot/faqs', chatbotController.getAllFAQs);
router.get('/chatbot/categories', chatbotController.getCategories);
router.get('/chatbot/category/:category', chatbotController.getFAQsByCategory);
router.get('/chatbot/search', chatbotController.searchFAQs);
router.post('/chatbot/faqs', chatbotController.createFAQ);
router.put('/chatbot/faqs/:id', chatbotController.updateFAQ);
router.delete('/chatbot/faqs/:id', chatbotController.deleteFAQ);
router.post('/chatbot/faqs/:id/view', chatbotController.recordView);
router.post('/chatbot/faqs/:id/feedback', chatbotController.recordFeedback);

// =================== CONTACT ROUTES ===================
router.get('/contact', contactController.getAllMessages);
router.get('/contact/unread-count', contactController.getUnreadCount);
router.get('/contact/:id', contactController.getMessageById);
router.post('/contact', contactController.createMessage); // Public endpoint
router.post('/contact/:id/reply', contactController.replyToMessage);
router.delete('/contact/:id', contactController.deleteMessage);
router.put('/contact/:id/read', contactController.markAsRead);

// =================== FOOTER ROUTES ===================
router.get('/footer', footerController.getFooterSettings);
router.put('/footer', uploadSingle, footerController.updateFooterSettings);
router.post('/footer/quick-links', footerController.addQuickLink);
router.delete('/footer/quick-links/:linkId', footerController.removeQuickLink);
router.post('/footer/services', footerController.addServiceLink);
router.delete('/footer/services/:linkId', footerController.removeServiceLink);

// Public endpoints (without auth)
router.get('/public/services', servicesController.getAllServices);
router.get('/public/portfolio', portfolioController.getAllProjects);
router.get('/public/blog', blogController.getAllBlogs);
router.get('/public/blog/featured', blogController.getFeaturedBlogs);
router.get('/public/testimonials', testimonialsController.getFeaturedTestimonials);
router.get('/public/team', teamController.getAllTeam);
router.get('/public/footer', footerController.getFooterSettings);
router.get('/public/chatbot/faqs', chatbotController.getAllFAQs);
router.get('/public/chatbot/search', chatbotController.searchFAQs);

module.exports = router;
