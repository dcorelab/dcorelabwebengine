const Blog = require('../../models/blog');
const { deleteResource } = require('../../config/cloudinary');

// Helper to create slug from title
const createSlug = (title) => {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};

class BlogController {
  // Get all blogs
  getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get blog by ID or slug
  getBlogById = async (req, res) => {
    try {
      let blog = await Blog.findById(req.params.id);
      if (!blog) {
        blog = await Blog.findOne({ slug: req.params.id });
      }
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }
      
      // Increment views
      blog.views += 1;
      await blog.save();

      res.json({ success: true, data: blog });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get blogs by category
  getByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const blogs = await Blog.find({ category, isPublished: true }).sort({ createdAt: -1 });
      res.json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create blog
  createBlog = async (req, res) => {
    try {
      const { title, content, excerpt, author, category, tags, featured, isPublished } = req.body;

      if (!title || !content || !category || !req.file) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const slug = createSlug(title);
      
      // Check if slug already exists
      const existing = await Blog.findOne({ slug });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A blog with this title already exists' });
      }

      const newBlog = new Blog({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150),
        author: author || 'Admin',
        category,
        image: req.file.path,
        tags: tags ? JSON.parse(tags) : [],
        featured: featured === 'true',
        isPublished: isPublished !== 'false'
      });

      const saved = await newBlog.save();
      res.status(201).json({ success: true, message: 'Blog created', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update blog
  updateBlog = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (req.file) {
        updates.image = req.file.path;
      }

      if (updates.tags && typeof updates.tags === 'string') {
        updates.tags = JSON.parse(updates.tags);
      }

      if (updates.featured) {
        updates.featured = updates.featured === 'true';
      }

      if (updates.isPublished !== undefined) {
        updates.isPublished = updates.isPublished !== 'false';
      }

      updates.updatedAt = new Date();

      const updated = await Blog.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      res.json({ success: true, message: 'Blog updated', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Delete blog
  deleteBlog = async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      // Delete image from Cloudinary
      if (blog.image) {
        const publicId = blog.image.split('/').pop().split('.')[0];
        await deleteResource(`dcore-lab/${publicId}`);
      }

      res.json({ success: true, message: 'Blog deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get featured blogs
  getFeaturedBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find({ featured: true, isPublished: true }).limit(3).sort({ createdAt: -1 });
      res.json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new BlogController();
