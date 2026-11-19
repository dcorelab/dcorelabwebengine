const express = require('express');
const router = express.Router();
const connectDB = require('../../config/db');
const { Project, Testimonial, Service, SiteSettings } = require('../../models/adminModels');
const defaults = { heroHeadline: 'We build digital products that move business forward.', heroSubHeadline: 'Strategy, design and engineering for ambitious teams.', seoTitle: 'Dcore Lab — Digital products, thoughtfully engineered', seoDescription: 'A digital product and growth studio helping ambitious teams build, launch and scale.', phone: '', whatsapp: '', email: '', address: '', workingHours: '', announcementText: '', announcementEnabled: false };
router.get('/', async (_req, res, next) => {
  try {
    await connectDB();
    const [settingsDoc, services, projects, testimonials] = await Promise.all([
      SiteSettings.findOne({ key: 'site' }).lean(),
      Service.find().sort({ order: 1, createdAt: 1 }).lean(),
      Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).limit(12).lean(),
      Testimonial.find({ approved: true }).sort({ createdAt: -1 }).limit(6).lean()
    ]);
    const settings = { ...defaults, ...(settingsDoc || {}) };
    res.render('ui/index', { title: settings.seoTitle || defaults.seoTitle, description: settings.seoDescription || defaults.seoDescription, settings, services, projects, testimonials });
  } catch (error) { next(error); }
});
module.exports = router;
