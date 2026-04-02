const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config();
const connectDB = require('./app/config/db');
const app = express();

connectDB();






// 1. Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middleware
// Use 'app' folder for your static CSS/JS/Images as seen in your structure
app.use(express.static(path.join(__dirname, 'app'))); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // For any additional public assets


// 3. Page Routes

app.use('/', require('./app/routes/ui/home.controller'));


// 4. Email Sending Route (For your Startup Inquiry)
app.post('/send-inquiry', async (req, res) => {
    const { name, email, phone, company, message } = req.body;

    // SMTP Configuration for Gmail (2026 standards)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            // MUST use a 16-character App Password, not your login password
            pass: process.env.GMAIL_APP_PASS 
        }
    });

    const mailOptions = {
        from: `"${name}" <${process.env.GMAIL_USER}>`, // Gmail requires 'from' to be the auth user
        to: process.env.GMAIL_USER, 
        replyTo: email, // This lets you reply directly to the client
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
        // Redirect back to a success state or thanks page
        res.redirect('/?status=success');
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).send("Error sending message. Please try again.");
    }
});

// 5. Vercel Export
module.exports = app;

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });  


