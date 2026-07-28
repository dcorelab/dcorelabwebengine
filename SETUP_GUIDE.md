# Dcore Lab CMS - Complete Setup Guide

## Overview
This is a full-stack Content Management System with an admin panel for managing website content, services, portfolio, blog posts, team members, testimonials, chatbot FAQs, and contact messages.

## Environment Variables Required

### 1. MongoDB Connection
```env
MONGODB_URI=your_mongodb_connection_string
```

### 2. Cloudinary (for Image/Video Storage)
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

[Get Cloudinary credentials: https://cloudinary.com]

### 3. Email Configuration (Gmail)
```env
FROM_MAIL=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

[Generate Gmail App Password: https://myaccount.google.com/apppasswords]

### 4. OpenAI API (for Chatbot AI)
```env
OPENAI_API_KEY=your_openai_api_key
```

[Get OpenAI key: https://platform.openai.com/api-keys]

### 5. Server Configuration
```env
PORT=4000
NODE_ENV=development
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory and add all the variables above.

### 3. Start Development Server
```bash
npm run dev
```

The server will run on `http://localhost:4000`

## Admin Panel Access

### Admin Login URL
```
http://localhost:4000/admin/login
```

### Default Admin Credentials
You need to create an admin account first. Use the signup endpoint.

## API Endpoints

### Public Endpoints (No Authentication)

#### Chatbot
- `GET /api/chatbot/message` - Send message and get response
- `POST /api/chatbot/feedback` - Record FAQ feedback
- `GET /api/chatbot/stats` - Get chatbot statistics

#### Public Content Endpoints
- `GET /api/admin/public/services` - Get all services
- `GET /api/admin/public/portfolio` - Get all portfolio projects
- `GET /api/admin/public/blog` - Get all blog posts
- `GET /api/admin/public/blog/featured` - Get featured blogs
- `GET /api/admin/public/testimonials` - Get featured testimonials
- `GET /api/admin/public/team` - Get all team members
- `GET /api/admin/public/footer` - Get footer settings
- `GET /api/admin/public/chatbot/faqs` - Get all FAQ
- `GET /api/admin/public/chatbot/search` - Search FAQs
- `POST /api/admin/contact` - Submit contact form

### Protected Endpoints (Requires Authentication)

#### Services Management
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Create service (multipart/form-data with image)
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `POST /api/admin/services/reorder` - Reorder services

#### Portfolio Management
- `GET /api/admin/portfolio` - Get all projects
- `POST /api/admin/portfolio` - Create project
- `PUT /api/admin/portfolio/:id` - Update project
- `DELETE /api/admin/portfolio/:id` - Delete project
- `GET /api/admin/portfolio/category/:category` - Get by category

#### Blog Management
- `GET /api/admin/blog` - Get all blogs
- `POST /api/admin/blog` - Create blog post
- `PUT /api/admin/blog/:id` - Update blog
- `DELETE /api/admin/blog/:id` - Delete blog
- `GET /api/admin/blog/featured` - Get featured blogs

#### Testimonials Management
- `GET /api/admin/testimonials` - Get all testimonials
- `POST /api/admin/testimonials` - Create testimonial
- `PUT /api/admin/testimonials/:id` - Update testimonial
- `DELETE /api/admin/testimonials/:id` - Delete testimonial
- `GET /api/admin/testimonials/featured` - Get featured testimonials

#### Team Management
- `GET /api/admin/team` - Get all team members
- `POST /api/admin/team` - Create team member
- `PUT /api/admin/team/:id` - Update team member
- `DELETE /api/admin/team/:id` - Delete team member

#### Chatbot FAQ Management
- `GET /api/admin/chatbot/faqs` - Get all FAQs
- `POST /api/admin/chatbot/faqs` - Create FAQ
- `PUT /api/admin/chatbot/faqs/:id` - Update FAQ
- `DELETE /api/admin/chatbot/faqs/:id` - Delete FAQ
- `GET /api/admin/chatbot/categories` - Get FAQ categories

#### Contact Management
- `GET /api/admin/contact` - Get all messages
- `GET /api/admin/contact/unread-count` - Get unread count
- `GET /api/admin/contact/:id` - Get message by ID
- `POST /api/admin/contact/:id/reply` - Reply to message
- `DELETE /api/admin/contact/:id` - Delete message

#### Footer Management
- `GET /api/admin/footer` - Get footer settings
- `PUT /api/admin/footer` - Update footer settings
- `POST /api/admin/footer/quick-links` - Add quick link
- `DELETE /api/admin/footer/quick-links/:linkId` - Remove quick link

## Features

### 1. Content Management
- **Services**: Add/edit/delete services with images, features, and pricing plans
- **Portfolio**: Showcase projects with images, videos, technologies, and links
- **Blog**: Full-featured blog with categories, tags, featured posts
- **Team**: Manage team members with bios, expertise, and social links
- **Testimonials**: Add client testimonials with ratings and images

### 2. Chatbot
- **FAQ Database**: Store frequently asked questions with keywords
- **AI Fallback**: Uses OpenAI ChatGPT when FAQ doesn't match
- **Smart Search**: Keyword-based searching for relevant FAQs
- **Feedback System**: Track which answers are helpful
- **Default Responses**: Fallback responses when AI is unavailable

### 3. Footer
- **Dynamic Content**: Manage footer from admin panel
- **Social Links**: Add social media links
- **Quick Links**: Customizable navigation links
- **Contact Info**: Email, phone, address management
- **Services Links**: Direct links to service pages

### 4. Contact Form
- **Email Notifications**: Send confirmation emails to users
- **Admin Replies**: Reply to messages with email notification
- **Message Management**: Mark as read, archive, delete messages

### 5. Image & Video Storage
- **Cloudinary Integration**: All media uploads to Cloudinary CDN
- **Automatic Optimization**: Images automatically optimized for different screen sizes
- **Video Support**: Support for MP4, MOV, AVI, WMV, FLV formats

## Frontend Integration

### Pages
All pages are dynamic and fetch content from MongoDB:
- `/` - Home page
- `/about` - About page with team members
- `/services` - Services list (fetched from DB)
- `/portfolio` - Portfolio projects (fetched from DB)
- `/blog` - Blog listing (fetched from DB)
- `/contactus` - Contact form

### Footer
Footer on every page with:
- Company information
- Social links
- Quick navigation
- Contact details
- Services links

### Chatbot
Interactive chatbot on every page:
- Floating button in bottom-right
- Message history
- FAQ search functionality
- AI responses
- Feedback system
- Responsive design

## Database Schema

### Services
```javascript
{
  title, description, shortDescription,
  icon, image, features[], price,
  pricingPlan[], order, isActive
}
```

### Portfolio/Projects
```javascript
{
  title, description, shortDescription,
  category, image, images[], videoUrl,
  client, technologies[], liveLink, gitLink,
  order, featured, isActive
}
```

### Blog
```javascript
{
  title, slug, excerpt, content,
  author, category, tags[], image,
  featured, isPublished, views
}
```

### Testimonials
```javascript
{
  clientName, clientTitle, clientCompany,
  content, image, rating, order,
  featured, isActive
}
```

### Team
```javascript
{
  name, position, bio, image,
  email, phone, expertise[],
  socialLinks, order, isActive
}
```

### ChatbotFAQ
```javascript
{
  category, question, answer,
  keywords[], order, isActive,
  views, helpful, notHelpful
}
```

### Contact
```javascript
{
  name, email, phone, subject, message,
  status, response, respondedBy, respondedAt,
  attachments[]
}
```

### FooterSettings
```javascript
{
  companyName, companyDescription, email, phone,
  address, logo, socialLinks, quickLinks[],
  services[], copyrightText
}
```

## Troubleshooting

### Cloudinary Images Not Uploading
1. Check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
2. Verify Cloudinary account is active
3. Check folder permissions in Cloudinary dashboard

### Email Not Sending
1. Verify Gmail App Password is correct (not regular password)
2. Enable "Less secure app access" if needed
3. Check spam/trash folder

### Chatbot Not Responding
1. Ensure MongoDB connection is working
2. Add some FAQ entries in admin panel
3. Check OpenAI API key if using AI responses
4. Check browser console for errors

### Admin Login Issues
1. Verify MongoDB connection string
2. Ensure admin user exists in database
3. Check session configuration

## Next Steps

1. **Create Admin Account**: Visit signup page and create credentials
2. **Add Footer Settings**: Go to admin panel and set company info
3. **Create FAQ**: Add common questions for chatbot
4. **Add Services**: Start adding your services
5. **Upload Portfolio**: Add your projects
6. **Create Blog Posts**: Start blogging
7. **Add Team Members**: Showcase your team
8. **Manage Contact Form**: Monitor incoming messages

## Support

For issues or questions:
1. Check the browser console for errors
2. Review MongoDB and Cloudinary credentials
3. Verify all environment variables are set
4. Check server logs for backend errors

## License
All rights reserved © 2024 Dcore Lab
