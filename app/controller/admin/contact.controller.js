const Contact = require('../../models/contactus');
const nodemailer = require('nodemailer');

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FROM_MAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

class ContactController {
  // Get all contact messages
  getAllMessages = async (req, res) => {
    try {
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get message by ID
  getMessageById = async (req, res) => {
    try {
      const message = await Contact.findById(req.params.id);
      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      // Mark as read
      if (message.status === 'new') {
        message.status = 'read';
        await message.save();
      }

      res.json({ success: true, data: message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get unread messages count
  getUnreadCount = async (req, res) => {
    try {
      const count = await Contact.countDocuments({ status: 'new' });
      res.json({ success: true, count });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create contact message (from frontend)
  createMessage = async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const newMessage = new Contact({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'new'
      });

      const saved = await newMessage.save();

      // Send confirmation email to user
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.FROM_MAIL,
        to: email,
        subject: 'We received your message',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>Thank you for contacting us!</h2>
            <p>We have received your message and will get back to you soon.</p>
            <p><strong>Message ID:</strong> ${saved._id}</p>
            <hr>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
          </div>
        `
      });

      res.status(201).json({ success: true, message: 'Message sent successfully', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Reply to message
  replyToMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const { response, respondedBy } = req.body;

      if (!response) {
        return res.status(400).json({ success: false, message: 'Response required' });
      }

      const message = await Contact.findById(id);
      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      message.response = response;
      message.respondedBy = respondedBy || 'Admin';
      message.respondedAt = new Date();
      message.status = 'replied';

      await message.save();

      // Send reply email
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.FROM_MAIL,
        to: message.email,
        subject: `Re: ${message.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>Our Response</h2>
            <p>${response}</p>
            <hr>
            <p><small>This is an automated response. Please do not reply to this email.</small></p>
          </div>
        `
      });

      res.json({ success: true, message: 'Reply sent', data: message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Delete message
  deleteMessage = async (req, res) => {
    try {
      const message = await Contact.findByIdAndDelete(req.params.id);
      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Mark message as read
  markAsRead = async (req, res) => {
    try {
      const { id } = req.params;
      const message = await Contact.findByIdAndUpdate(id, { status: 'read' }, { new: true });
      res.json({ success: true, data: message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ContactController();
