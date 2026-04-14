const express = require('express');
const path = require('path');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('dotenv').config();

const connectDB = require('./app/config/db');

const app = express();

// Connect to Database
connectDB();

// ====================== MIDDLEWARE ======================

// 1. Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'dcorelab-super-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // true only in production
  }
}));

// 2. View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Static files
app.use(express.static(path.join(__dirname, 'public')));

// ====================== ROUTES ======================

// Admin routes
app.use('/admin', require('./app/routes/admin/index'));

// Frontend / UI routes
app.use('/', require('./app/routes/ui/home.controller'));

// Inquiry email route
app.post('/send-inquiry', async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || process.env.FROM_MAIL,
      pass: process.env.GMAIL_APP_PASS || process.env.GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: `"${name}" <${process.env.GMAIL_USER || process.env.FROM_MAIL}>`,
    to: process.env.GMAIL_USER || process.env.FROM_MAIL,
    replyTo: email,
    subject: "🚀 New Business Inquiry - Dcore Labs",
    html: `
      <h3>New Lead from Website</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect('/?status=success');
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).send("Error sending message. Please try again.");
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404');
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});