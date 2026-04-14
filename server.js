// server.js - Final Version with MongoDB + Unique IP Tracking + Chart Data

const express = require('express');
const path = require('path');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { inject } = require("@vercel/analytics");
const connectDB = require('./app/config/db');
const HomeVisit = require('./app/models/homevisit');   // ← New Model

const app = express();

inject();
connectDB();

// ====================== MIDDLEWARE ======================
app.use(session({
  secret: process.env.SESSION_SECRET || 'dcorelab-super-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000, httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ====================== REAL VISIT TRACKING (MongoDB) ======================
app.use(async (req, res, next) => {
  if (req.method === 'GET' && req.path === '/') {
    try {
      await HomeVisit.create({
        ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        referrer: req.get('referer') || 'Direct'
      });
      // console.log(`📈 New Home Visit saved to MongoDB | IP: ${req.ip}`);
    } catch (err) {
      console.error("Visit save error:", err);
    }
  }
  next();
});

// ====================== API ROUTES ======================

// 1. Real-time data for dashboard
app.get('/api/vercel-realtime', async (req, res) => {
  try {
    const totalViews = await HomeVisit.countDocuments();
    const uniqueIPs = await HomeVisit.distinct('ip');
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    const activeNow = await HomeVisit.countDocuments({
      timestamp: { $gte: fiveMinAgo }
    });

    res.json({
      homeHits: totalViews,
      uniqueVisitors: uniqueIPs.length,
      activeNow: activeNow,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Chart data - Last 7 days (for the new chart in admin)
// Chart data with period support
app.get('/api/analytics/chart', async (req, res) => {
  try {
    const period = req.query.period || '7';
    let match = {};
    let groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } };
    let limit = 7;

    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      match.timestamp = { $gte: today };
      groupBy = { $hour: "$timestamp" };
      limit = 24;
    } else if (period === '30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      match.timestamp = { $gte: thirtyDaysAgo };
      limit = 30;
    } else if (period === 'total') {
      // For total, show last 12 months or return summary
      const result = [{ label: "Total Views", value: await HomeVisit.countDocuments() }];
      return res.json({ labels: ["All Time"], views: [result[0].value] });
    }

    const result = await HomeVisit.aggregate([
      { $match: match },
      {
        $group: {
          _id: groupBy,
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format labels nicely
    const labels = result.map(item => {
      if (period === 'today') return `${item._id}:00`;
      return new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const views = result.map(item => item.views);

    res.json({ labels, views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== OTHER ROUTES ======================
app.use('/admin', require('./app/routes/admin/index'));
app.use('/', require('./app/routes/ui/home.controller'));

app.post('/send-inquiry', async (req, res) => { /* your existing email code */ });

app.use((req, res) => {
  res.status(404).send(`<h1>404 - Page Not Found</h1><a href="/">Go Home</a>`);
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB Visit Tracking + Unique IP Active`);
});