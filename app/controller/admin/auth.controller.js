// controllers/admin/auth.controller.js
const Admin = require('../../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const WEBSITE_NAME = "Dcorelab";

// ================= REUSABLE TRANSPORTER (Optimized) =================
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FROM_MAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    transporter.verify((error) => {
      if (error) {
        console.error("❌ Gmail Transporter Error:", error.message);
      } else {
        console.log("✅ Gmail SMTP Transporter is ready");
      }
    });
  }
  return transporter;
};

/* ================= SEND EMAIL HELPER ================= */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailTransporter = getTransporter();

    const mailOptions = {
      from: `"${WEBSITE_NAME}" <${process.env.FROM_MAIL}>`,
      to,
      subject,
      text: text || '',
      html: html || text
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} | Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    if (error.code === 'EAUTH') {
      console.error("→ Check FROM_MAIL and GMAIL_APP_PASSWORD in .env file");
    }
    throw error;
  }
};

class AuthController {

  constructor() {
    // ✅ FIXED: Bind methods correctly (they must be defined first in the class)
    this.getSignup = this.getSignup.bind(this);
    this.signup = this.signup.bind(this);
    this.getLogin = this.getLogin.bind(this);
    this.login = this.login.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.dashboard = this.dashboard.bind(this);
    this.logout = this.logout.bind(this);
    this.generateOTP = this.generateOTP.bind(this);
    this.sendOTP = this.sendOTP.bind(this);
    this.logLogin = this.logLogin.bind(this);
  }

  // ====================== METHODS ======================

  async generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email, otp) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2>Your Verification OTP</h2>
        <h1 style="color: #0066cc; font-size: 42px;">${otp}</h1>
        <p>Expires in 10 minutes</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `Your ${WEBSITE_NAME} Verification OTP`,
      html: htmlContent,
      text: `Your OTP code is: ${otp}. It expires in 10 minutes.`
    });
  }

  async logLogin(admin, req, status) {
    const log = {
      time: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      device: req.headers['user-agent'] || 'Unknown',
      status,
      username: admin.username
    };
    admin.loginHistory.push(log);
    await admin.save();
  }

  async getSignup(req, res) {
    res.render('admin/signup');
  }

  async signup(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.render('admin/error', { message: 'All fields are required.' });
      }

      const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
      if (existingAdmin) {
        return res.render('admin/error', { message: 'Username or email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ username, email, password: hashedPassword });

      await admin.save();

      const otp = await this.generateOTP();
      console.log("Signup OTP:", otp);

      admin.otpHistory.push({
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verified: false
      });

      await admin.save();
      await this.sendOTP(email, otp);

      req.session.tempAdminId = admin._id.toString();
      req.session.purpose = 'signup';

      res.render('admin/verify-otp', { email });
    } catch (err) {
      console.error(err);
      res.render('admin/error', { message: 'Signup failed. Please try again.' });
    }
  }

  async getLogin(req, res) {
    if (req.session.adminId) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/login');
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.render('admin/error', { message: 'Email and password are required.' });
      }

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.render('admin/error', { message: 'Invalid credentials.' });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        await this.logLogin(admin, req, 'failed');
        return res.render('admin/error', { message: 'Invalid credentials.' });
      }

      if (!admin.isVerified) {
        return res.render('admin/error', { message: 'Account not verified. Please signup again.' });
      }

      const otp = await this.generateOTP();
      console.log("Login OTP:", otp);

      admin.otpHistory.push({
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verified: false
      });

      await admin.save();
      await this.sendOTP(email, otp);

      req.session.tempAdminId = admin._id.toString();
      req.session.purpose = 'login';

      res.render('admin/verify-otp', { email });
    } catch (err) {
      console.error(err);
      res.render('admin/error', { message: 'Login failed. Please try again.' });
    }
  }

  async verifyOTP(req, res) {
    try {
      const { otp } = req.body;
      const tempAdminId = req.session.tempAdminId;
      const purpose = req.session.purpose;

      if (!tempAdminId || !otp || !purpose) {
        return res.render('admin/error', { message: 'Session expired. Please try again.' });
      }

      const admin = await Admin.findById(tempAdminId);
      if (!admin) {
        return res.render('admin/error', { message: 'Invalid session.' });
      }

      const latestOtpRecord = admin.otpHistory[admin.otpHistory.length - 1];

      if (
        !latestOtpRecord ||
        latestOtpRecord.verified ||
        latestOtpRecord.otp !== otp ||
        new Date() > latestOtpRecord.expiresAt
      ) {
        return res.render('admin/error', { message: 'Invalid or expired OTP.' });
      }

      latestOtpRecord.verified = true;
      await admin.save();

      delete req.session.tempAdminId;
      delete req.session.purpose;

      req.session.adminId = admin._id.toString();
      await this.logLogin(admin, req, 'success');

      if (purpose === 'signup') {
        admin.isVerified = true;
        await admin.save();
      }

      res.redirect('/admin/dashboard');
    } catch (err) {
      console.error(err);
      res.render('admin/error', { message: 'OTP verification failed.' });
    }
  }

  async dashboard(req, res) {
    try {
      if (!req.session.adminId) {
        return res.redirect('/admin/login');
      }

      const admin = await Admin.findById(req.session.adminId)
        .select('-password -otpHistory');

      if (!admin) {
        return res.redirect('/admin/login');
      }

      const loginHistory = admin.loginHistory.slice(-5);

      res.render('admin/dashboard', { admin, loginHistory });
    } catch (err) {
      console.error(err);
      res.render('admin/error', { message: 'Dashboard access failed.' });
    }
  }

  async logout(req, res) {
    try {
      const adminId = req.session.adminId;
      if (adminId) {
        const admin = await Admin.findById(adminId);
        if (admin) {
          await this.logLogin(admin, req, 'success');
        }
      }

      req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/admin/login');
      });
    } catch (err) {
      console.error(err);
      res.redirect('/admin/login');
    }
  }
}

module.exports = new AuthController();