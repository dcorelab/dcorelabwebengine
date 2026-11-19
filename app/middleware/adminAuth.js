const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/user');
const connectDB = require('../config/db');
const { LoginAttempt, AuditLog } = require('../models/adminModels');
const COOKIE = 'admin_session';
const key = () => { if (!process.env.ADMIN_JWT_SECRET || process.env.ADMIN_JWT_SECRET.length < 32) throw new Error('ADMIN_JWT_SECRET must contain at least 32 characters'); return process.env.ADMIN_JWT_SECRET; };
const passwordValid = p => typeof p === 'string' && p.length >= 12 && p.length <= 128 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);
function cookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 8 * 60 * 60 * 1000, path: '/' }; }
function ipKey(req) { return crypto.createHash('sha256').update(String(req.ip || 'unknown') + (process.env.ANALYTICS_SALT || '')).digest('hex'); }
function originOK(req) { const origin = req.get('origin'); if (!origin) return true; try { const u = new URL(origin); return u.host === req.get('host') && (process.env.NODE_ENV !== 'production' || u.protocol === 'https:'); } catch (_) { return false; } }
async function recordAttempt(keyValue, failed) {
  const now = new Date();
  let row = await LoginAttempt.findOne({ key: keyValue });
  if (!row) row = new LoginAttempt({ key: keyValue, attempts: 0, windowStartedAt: now });
  if (row.lockedUntil && row.lockedUntil > now) return false;
  if (!row.windowStartedAt || now - row.windowStartedAt > 15 * 60 * 1000) { row.attempts = 0; row.windowStartedAt = now; row.lockedUntil = undefined; }
  if (failed) row.attempts += 1;
  if (row.attempts >= 5) row.lockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
  await row.save();
  return !row.lockedUntil;
}
exports.passwordValid = passwordValid;
exports.cookieName = COOKIE;
exports.originOK = originOK;
exports.loginPage = (_req, res) => res.render('admin/login', { error: null });
exports.login = async (req, res) => {
  try {
    if (!originOK(req)) return res.status(403).render('admin/login', { error: 'Invalid credentials' });
    await connectDB();
    const ipHash = ipKey(req); const existing = await LoginAttempt.findOne({ key: ipHash });
    if (existing && existing.lockedUntil > new Date()) return res.status(429).render('admin/login', { error: 'Invalid credentials' });
    const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
    const user = await Admin.findOne({ email }).select('+passwordHash');
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!valid) {
      await recordAttempt(ipHash, true);
      await AuditLog.create({ actor: email || 'unknown', action: 'login_failed', entity: 'user' });
      return res.status(401).render('admin/login', { error: 'Invalid credentials' });
    }
    await recordAttempt(ipHash, false);
    const token = jwt.sign({ sub: user.id, role: user.role, sv: user.sessionVersion }, key(), { expiresIn: '8h', issuer: 'dcorelab-admin', audience: 'dcorelab-admin' });
    res.cookie(COOKIE, token, cookieOptions());
    user.lastLoginAt = new Date(); user.loginHistory.push({ time: new Date(), device: String(req.get('user-agent') || '').slice(0, 300), status: 'success' });
    await user.save(); await AuditLog.create({ actor: user.email, action: 'login', entity: 'user', entityId: user.id });
    res.redirect('/admin');
  } catch (_) { res.status(500).render('admin/login', { error: 'Invalid credentials' }); }
};
exports.logout = async (req, res) => {
  if (req.admin) { await Admin.updateOne({ _id: req.admin._id }, { $inc: { sessionVersion: 1 } }); await AuditLog.create({ actor: req.admin.email, action: 'logout', entity: 'user', entityId: req.admin.id }); }
  res.clearCookie(COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' }); res.redirect('/admin/login');
};
