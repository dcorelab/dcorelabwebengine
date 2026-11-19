const express = require('express');
const router = express.Router();
const { requireAdmin, requireRole } = require('../../middleware/authmiddlware');
const { Inquiry, Project, Testimonial, Service, SiteSettings, PageView, AuditLog } = require('../../models/adminModels');
const connectDB = require('../../config/db');
const collections = { projects: Project, testimonials: Testimonial, services: Service };
const fields = {
  projects: ['title', 'slug', 'category', 'shortDescription', 'results', 'techTags', 'websiteUrl', 'coverImage', 'gallery', 'published', 'order'],
  testimonials: ['name', 'role', 'company', 'quote', 'photo', 'approved'],
  services: ['title', 'description', 'features', 'icon', 'order']
};
const statuses = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];
const clean = value => {
  if (typeof value === 'string') return value.trim().slice(0, 5000);
  if (Array.isArray(value)) return value.filter(v => typeof v === 'string').slice(0, 30).map(v => v.trim().slice(0, 500));
  return value;
};
const allowed = (kind, role) => role === 'owner' || (role === 'editor' && ['projects', 'testimonials'].includes(kind));
router.use(requireAdmin);
router.use(async (req, res, next) => {
  try {
    await connectDB();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const origin = req.get('origin');
      if (origin) { const parsed = new URL(origin); if (parsed.host !== req.get('host')) return res.status(403).json({ error: 'Invalid request origin' }); }
    }
    next();
  } catch (_) { res.status(400).json({ error: 'Invalid request' }); }
});
router.get('/analytics', requireRole('owner'), async (req, res, next) => {
  try {
    const period = String(req.query.period || '7');
    const days = period === '30' ? 30 : period === 'all' ? null : period === 'today' ? 1 : 7;
    const match = days ? { timestamp: { $gte: new Date(Date.now() - days * 86400000) } } : {};
    const [visits, unique, chart, refs] = await Promise.all([
      PageView.countDocuments(match), PageView.distinct('visitorHash', match).then(v => v.length),
      PageView.aggregate([{ $match: match }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, visits: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      PageView.aggregate([{ $match: match }, { $group: { _id: '$referrer', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }])
    ]);
    res.json({ visits, unique, chart, refs });
  } catch (error) { next(error); }
});
router.get('/inquiries.csv', requireRole('owner', 'editor'), async (_req, res, next) => {
  try { const items = await Inquiry.find().sort({ createdAt: -1 }).lean(); const esc = v => `"${String(v || '').replace(/"/g, '""')}"`; res.type('text/csv').attachment('inquiries.csv').send(['name,email,phone,company,service,status,message,createdAt', ...items.map(i => [i.name,i.email,i.phone,i.company,i.service,i.status,i.message,i.createdAt].map(esc).join(','))].join('\n')); }
  catch (error) { next(error); }
});
router.get('/inquiries', requireRole('owner', 'editor'), async (req, res, next) => {
  try {
    const page = Math.max(1, Math.min(10000, Number.parseInt(req.query.page, 10) || 1));
    const limit = Math.max(1, Math.min(100, Number.parseInt(req.query.limit, 10) || 25));
    const filter = {};
    if (statuses.includes(req.query.status)) filter.status = req.query.status;
    if (typeof req.query.search === 'string' && req.query.search.trim()) { const term = req.query.search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); filter.$or = ['name','email','company','message'].map(key => ({ [key]: { $regex: term, $options: 'i' } })); }
    const [items, total] = await Promise.all([Inquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Inquiry.countDocuments(filter)]);
    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
});
router.patch('/inquiries/:id', requireRole('owner', 'editor'), async (req, res, next) => {
  try {
    const body = req.body || {}; const update = {};
    if (body.status !== undefined) { if (!statuses.includes(body.status)) return res.status(400).json({ error: 'Invalid inquiry status' }); update.status = body.status; }
    if (body.note !== undefined) { if (typeof body.note !== 'string' || body.note.trim().length > 2000) return res.status(400).json({ error: 'Invalid note' }); if (body.note.trim()) update.$push = { notes: { body: body.note.trim(), author: req.admin.email } }; }
    if (!Object.keys(update).length) return res.status(400).json({ error: 'No valid updates supplied' });
    const item = await Inquiry.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) return res.sendStatus(404);
    await AuditLog.create({ actor: req.admin.email, action: 'update', entity: 'inquiry', entityId: item.id, details: Object.keys(update) });
    res.json(item);
  } catch (error) { next(error); }
});
router.delete('/inquiries/:id', requireRole('owner', 'editor'), async (req, res, next) => {
  try { const item = await Inquiry.findByIdAndDelete(req.params.id); if (!item) return res.sendStatus(404); await AuditLog.create({ actor: req.admin.email, action: 'delete', entity: 'inquiry', entityId: item.id }); res.sendStatus(204); }
  catch (error) { next(error); }
});
// Put settings routes ahead of the generic resource route so /settings/current cannot be shadowed.
router.get('/settings/current', requireRole('owner'), async (_req, res, next) => { try { res.json(await SiteSettings.findOne({ key: 'site' }).lean() || {}); } catch (error) { next(error); } });
router.put('/settings/current', requireRole('owner'), async (req, res, next) => {
  try {
    const allowedFields = ['heroHeadline','heroSubHeadline','phone','whatsapp','email','address','workingHours','socialLinks','seoTitle','seoDescription','ogImage','announcementText','announcementEnabled','chatLogsEnabled'];
    const data = Object.fromEntries(allowedFields.filter(key => req.body && req.body[key] !== undefined).map(key => [key, clean(req.body[key])]));
    if (!Object.keys(data).length) return res.status(400).json({ error: 'No settings supplied' });
    const item = await SiteSettings.findOneAndUpdate({ key: 'site' }, { $set: data, $setOnInsert: { key: 'site' } }, { upsert: true, new: true, runValidators: true });
    await AuditLog.create({ actor: req.admin.email, action: 'update', entity: 'settings', entityId: item.id, details: Object.keys(data) });
    res.json(item);
  } catch (error) { next(error); }
});
router.get('/:kind', async (req, res, next) => {
  try { const Model = collections[req.params.kind]; if (!Model) return res.status(404).json({ error: 'Not found' }); if (!allowed(req.params.kind, req.admin.role)) return res.status(403).json({ error: 'Forbidden' }); res.json(await Model.find().sort({ order: 1, createdAt: -1 }).lean()); }
  catch (error) { next(error); }
});
router.post('/:kind', async (req, res, next) => {
  try {
    const kind = req.params.kind; const Model = collections[kind];
    if (!Model) return res.status(404).json({ error: 'Not found' });
    if (!allowed(kind, req.admin.role)) return res.status(403).json({ error: 'Forbidden' });
    const data = Object.fromEntries(fields[kind].filter(key => req.body && req.body[key] !== undefined).map(key => [key, clean(req.body[key])]));
    const item = await Model.create(data);
    await AuditLog.create({ actor: req.admin.email, action: 'create', entity: kind, entityId: item.id });
    res.status(201).json(item);
  } catch (error) { next(error); }
});
router.put('/:kind/:id', async (req, res, next) => {
  try {
    const kind = req.params.kind; const Model = collections[kind];
    if (!Model) return res.status(404).json({ error: 'Not found' });
    if (!allowed(kind, req.admin.role)) return res.status(403).json({ error: 'Forbidden' });
    const data = Object.fromEntries(fields[kind].filter(key => req.body && req.body[key] !== undefined).map(key => [key, clean(req.body[key])]));
    if (!Object.keys(data).length) return res.status(400).json({ error: 'No updates supplied' });
    const item = await Model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!item) return res.sendStatus(404);
    await AuditLog.create({ actor: req.admin.email, action: 'update', entity: kind, entityId: item.id });
    res.json(item);
  } catch (error) { next(error); }
});
router.delete('/:kind/:id', async (req, res, next) => {
  try {
    const kind = req.params.kind; const Model = collections[kind];
    if (!Model) return res.status(404).json({ error: 'Not found' });
    if (!allowed(kind, req.admin.role)) return res.status(403).json({ error: 'Forbidden' });
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.sendStatus(404);
    await AuditLog.create({ actor: req.admin.email, action: 'delete', entity: kind, entityId: item.id });
    res.sendStatus(204);
  } catch (error) { next(error); }
});
module.exports = router;
