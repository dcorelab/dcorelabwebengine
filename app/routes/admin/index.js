const express = require('express');
const router = express.Router();
const { requireAdmin, requireRole } = require('../../middleware/authmiddlware');
const { Inquiry, Project, Testimonial, Service, SiteSettings, PageView, AuditLog } = require('../../models/adminModels');
const connectDB = require('../../config/db');
const { loginPage, login, logout } = require('../../middleware/adminAuth');

router.get('/login', loginPage);
router.post('/login', login);
router.post('/logout', requireAdmin, logout);
router.use(requireAdmin);
router.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");
  next();
});
router.get('/', async (req, res, next) => {
  try {
    await connectDB();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [visits, uniques, visitorsToday, inquiries, latest, topRefs, chart] = await Promise.all([
      PageView.countDocuments(), PageView.distinct('visitorHash').then(x => x.length), PageView.countDocuments({ timestamp: { $gte: today } }), Inquiry.countDocuments(), Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(), PageView.aggregate([{ $group: { _id: { $ifNull: ['$referrer', 'Direct'] }, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]), PageView.aggregate([{ $match: { timestamp: { $gte: new Date(Date.now() - 7 * 86400000) } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, visits: { $sum: 1 } } }, { $sort: { _id: 1 } }])
    ]);
    res.render('admin/dashboard', { admin: req.admin, metrics: { visits, uniques, visitorsToday, inquiries, conversion: visits ? (100 * inquiries / visits).toFixed(1) : '0.0' }, latest, topRefs, chart: JSON.stringify(chart) });
  } catch (error) { next(error); }
});
router.get('/inquiries', requireRole('owner', 'editor'), async (req, res, next) => { try { await connectDB(); const items = await Inquiry.find().sort({ createdAt: -1 }).limit(200).lean(); res.render('admin/inquiries', { admin: req.admin, items }); } catch (error) { next(error); } });
router.get('/projects', requireRole('owner', 'editor'), async (req, res, next) => { try { await connectDB(); res.render('admin/collection', { admin: req.admin, title: 'Projects', kind: 'projects', items: await Project.find().sort({ order: 1, createdAt: -1 }).lean(), fields: ['title', 'slug', 'category', 'shortDescription', 'coverImage', 'published'] }); } catch (error) { next(error); } });
router.get('/testimonials', requireRole('owner', 'editor'), async (req, res, next) => { try { await connectDB(); res.render('admin/collection', { admin: req.admin, title: 'Testimonials', kind: 'testimonials', items: await Testimonial.find().sort({ createdAt: -1 }).lean(), fields: ['name', 'role', 'company', 'quote', 'photo', 'approved'], warning: 'Only add real testimonials you have permission to publish.' }); } catch (error) { next(error); } });
router.get('/services', requireRole('owner', 'editor'), async (req, res, next) => { try { await connectDB(); res.render('admin/collection', { admin: req.admin, title: 'Services', kind: 'services', items: await Service.find().sort({ order: 1 }).lean(), fields: ['title', 'description', 'icon', 'order'] }); } catch (error) { next(error); } });
router.get('/settings', requireRole('owner'), async (req, res, next) => { try { await connectDB(); res.render('admin/collection', { admin: req.admin, title: 'Site settings', kind: 'settings', items: [await SiteSettings.findOne({ key: 'site' }).lean() || {}], fields: ['heroHeadline', 'heroSubHeadline', 'phone', 'whatsapp', 'email', 'address', 'workingHours', 'seoTitle', 'seoDescription', 'ogImage', 'announcementText', 'announcementEnabled', 'chatLogsEnabled'] }); } catch (error) { next(error); } });
router.get('/audit-log', requireRole('owner'), async (req, res, next) => { try { await connectDB(); res.render('admin/audit', { admin: req.admin, entries: await AuditLog.find().sort({ createdAt: -1 }).limit(200).lean() }); } catch (error) { next(error); } });
router.get('/account', requireRole('owner'), (req, res) => res.render('admin/account', { admin: req.admin, message: null }));
router.post('/account/password', requireRole('owner'), async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs'); const User = require('../../models/user'); const { passwordValid, cookieName } = require('../../middleware/adminAuth');
    const user = await User.findById(req.admin._id).select('+passwordHash');
    const current = String(req.body.currentPassword || ''); const nextPassword = String(req.body.newPassword || '');
    if (!(await bcrypt.compare(current, user.passwordHash)) || !passwordValid(nextPassword)) return res.status(400).render('admin/account', { admin: req.admin, message: 'Current password is incorrect or the new password does not meet the strong password policy.' });
    user.passwordHash = await bcrypt.hash(nextPassword, 12); user.sessionVersion += 1; await user.save();
    await AuditLog.create({ actor: user.email, action: 'password_changed', entity: 'user', entityId: user.id });
    res.clearCookie(cookieName, { path: '/', sameSite: 'strict', httpOnly: true, secure: process.env.NODE_ENV === 'production' }); res.redirect('/admin/login');
  } catch (error) { next(error); }
});
module.exports = router;
