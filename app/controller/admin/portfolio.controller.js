const Project = require('../../models/projects');
const { deleteResource } = require('../../config/cloudinary');

class PortfolioController {
  // Get all projects
  getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find().sort({ order: 1 });
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get project by ID
  getProjectById = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get projects by category
  getByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const projects = await Project.find({ category, isActive: true }).sort({ order: 1 });
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create project
  createProject = async (req, res) => {
    try {
      const { title, description, shortDescription, category, client, technologies, liveLink, gitLink, featured } = req.body;

      if (!title || !description || !category || !req.file) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const newProject = new Project({
        title,
        description,
        shortDescription,
        category,
        image: req.file.path,
        images: [req.file.path],
        client,
        technologies: technologies ? JSON.parse(technologies) : [],
        liveLink,
        gitLink,
        featured: featured === 'true',
        order: (await Project.countDocuments()) + 1
      });

      const saved = await newProject.save();
      res.status(201).json({ success: true, message: 'Project created', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update project
  updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (req.file) {
        updates.image = req.file.path;
        if (!updates.images) updates.images = [];
        updates.images.unshift(req.file.path);
      }

      if (updates.technologies && typeof updates.technologies === 'string') {
        updates.technologies = JSON.parse(updates.technologies);
      }

      if (updates.featured) {
        updates.featured = updates.featured === 'true';
      }

      updates.updatedAt = new Date();

      const updated = await Project.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.json({ success: true, message: 'Project updated', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Delete project
  deleteProject = async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Delete images from Cloudinary
      if (project.images && project.images.length > 0) {
        for (const imageUrl of project.images) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await deleteResource(`dcore-lab/${publicId}`);
        }
      }

      res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Reorder projects
  reorderProjects = async (req, res) => {
    try {
      const { projectIds } = req.body;
      
      for (let i = 0; i < projectIds.length; i++) {
        await Project.findByIdAndUpdate(projectIds[i], { order: i });
      }

      res.json({ success: true, message: 'Projects reordered' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new PortfolioController();
