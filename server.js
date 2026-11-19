const express = require('express');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const connectDB = require('./app/config/db');
const { PageView, Inquiry } = require('./app/models/adminModels');

const app = express();
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  if (req.path.startsWith('/admin')) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// Connection is cached by app/config/db.js for warm serverless instances.
connectDB().catch(() => {});

function visitorHash(req) {
  const salt = process.env.ANALYTICS_SALT;
  if (!salt) return null;
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : req.ip) || 'unknown';
  return crypto.createHash('sha256').update(`${ip.trim()}${salt}`).digest('hex');
}
app.post('/api/track', async (req, res) => {
  try {
    const pathName = typeof req.body.path === 'string' ? req.body.path.slice(0, 300) : '';
    const agent = String(req.get('user-agent') || '').slice(0, 500);
    if (!pathName.startsWith('/') || pathName.startsWith('/admin') || req.get('DNT') === '1' || /bot|crawler|spider|slurp|headless/i.test(agent)) return res.sendStatus(204);
    const hash = visitorHash(req);
    if (!hash) return res.sendStatus(204);
    await PageView.create({ path: pathName, referrer: String(req.body.referrer || '').slice(0, 500), device: /mobile|android|iphone/i.test(agent) ? 'mobile' : 'desktop', country: String(req.get('x-vercel-ip-country') || '').slice(0, 2), visitorHash: hash });
    res.sendStatus(204);
  } catch (_) { res.sendStatus(204); }
});

app.use('/admin', require('./app/routes/admin/index'));
app.use('/api/admin', require('./app/routes/admin/api'));
app.use('/', require('./app/routes/ui/home.controller'));
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone = '', company = '', service = '', message } = req.body || {};
    if (![name, email, message].every(v => typeof v === 'string' && v.trim()) || name.length > 120 || email.length > 254 || message.length > 5000) return res.status(400).json({ error: 'Please provide valid contact details.' });
    const inquiry = await Inquiry.create({ name: name.trim(), email: email.trim().toLowerCase(), phone: String(phone).slice(0, 50), company: String(company).slice(0, 120), service: String(service).slice(0, 120), message: message.trim(), status: 'New' });
    // Persist first, so an email-provider outage never loses the lead.
    if (process.env.FROM_MAIL && process.env.GMAIL_APP_PASSWORD && process.env.ADMIN_EMAIL) {
      try {
        const nodemailer = require('nodemailer');
        await nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.FROM_MAIL, pass: process.env.GMAIL_APP_PASSWORD } }).sendMail({ from: process.env.FROM_MAIL, to: process.env.ADMIN_EMAIL, subject: 'New website inquiry', text: `${inquiry.name} (${inquiry.email})\n${inquiry.message}` });
      } catch (_) { /* inquiry remains safely stored */ }
    }
    res.status(201).json({ ok: true });
  } catch (_) { res.status(500).json({ error: 'Unable to save your inquiry right now.' }); }
});
app.use((req, res) => res.status(404).send('<h1>404 - Page Not Found</h1><a href="/">Go Home</a>'));

const PORT = process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
module.exports = app;
