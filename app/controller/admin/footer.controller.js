const FooterSettings = require('../../models/footerSettings');
const { deleteResource } = require('../../config/cloudinary');

class FooterController {
  // Get footer settings
  getFooterSettings = async (req, res) => {
    try {
      let settings = await FooterSettings.findOne();
      if (!settings) {
        settings = new FooterSettings();
        await settings.save();
      }
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update footer settings
  updateFooterSettings = async (req, res) => {
    try {
      const updates = req.body;

      if (req.file) {
        updates.logo = req.file.path;
      }

      if (updates.socialLinks && typeof updates.socialLinks === 'string') {
        updates.socialLinks = JSON.parse(updates.socialLinks);
      }

      if (updates.quickLinks && typeof updates.quickLinks === 'string') {
        updates.quickLinks = JSON.parse(updates.quickLinks);
      }

      if (updates.services && typeof updates.services === 'string') {
        updates.services = JSON.parse(updates.services);
      }

      updates.updatedAt = new Date();

      let settings = await FooterSettings.findOne();
      if (!settings) {
        settings = new FooterSettings(updates);
      } else {
        Object.assign(settings, updates);
      }

      const saved = await settings.save();
      res.json({ success: true, message: 'Footer settings updated', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Add quick link
  addQuickLink = async (req, res) => {
    try {
      const { title, url } = req.body;

      if (!title || !url) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      let settings = await FooterSettings.findOne();
      if (!settings) {
        settings = new FooterSettings();
      }

      settings.quickLinks.push({ title, url });
      await settings.save();

      res.json({ success: true, message: 'Quick link added', data: settings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Remove quick link
  removeQuickLink = async (req, res) => {
    try {
      const { linkId } = req.params;
      
      let settings = await FooterSettings.findOne();
      if (!settings) {
        return res.status(404).json({ success: false, message: 'Settings not found' });
      }

      settings.quickLinks = settings.quickLinks.filter(link => link._id.toString() !== linkId);
      await settings.save();

      res.json({ success: true, message: 'Quick link removed', data: settings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Add service link
  addServiceLink = async (req, res) => {
    try {
      const { title, url } = req.body;

      if (!title || !url) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      let settings = await FooterSettings.findOne();
      if (!settings) {
        settings = new FooterSettings();
      }

      settings.services.push({ title, url });
      await settings.save();

      res.json({ success: true, message: 'Service link added', data: settings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Remove service link
  removeServiceLink = async (req, res) => {
    try {
      const { linkId } = req.params;
      
      let settings = await FooterSettings.findOne();
      if (!settings) {
        return res.status(404).json({ success: false, message: 'Settings not found' });
      }

      settings.services = settings.services.filter(link => link._id.toString() !== linkId);
      await settings.save();

      res.json({ success: true, message: 'Service link removed', data: settings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new FooterController();
