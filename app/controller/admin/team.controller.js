const TeamMember = require('../../models/team');
const { deleteResource } = require('../../config/cloudinary');

class TeamController {
  // Get all team members
  getAllTeam = async (req, res) => {
    try {
      const team = await TeamMember.find({ isActive: true }).sort({ order: 1 });
      res.json({ success: true, data: team });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get team member by ID
  getTeamMemberById = async (req, res) => {
    try {
      const member = await TeamMember.findById(req.params.id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      res.json({ success: true, data: member });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create team member
  createTeamMember = async (req, res) => {
    try {
      const { name, position, bio, email, phone, expertise, socialLinks } = req.body;

      if (!name || !position || !req.file) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const newMember = new TeamMember({
        name,
        position,
        bio: bio || null,
        image: req.file.path,
        email: email || null,
        phone: phone || null,
        expertise: expertise ? JSON.parse(expertise) : [],
        socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
        order: (await TeamMember.countDocuments()) + 1
      });

      const saved = await newMember.save();
      res.status(201).json({ success: true, message: 'Team member created', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update team member
  updateTeamMember = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (req.file) {
        updates.image = req.file.path;
      }

      if (updates.expertise && typeof updates.expertise === 'string') {
        updates.expertise = JSON.parse(updates.expertise);
      }

      if (updates.socialLinks && typeof updates.socialLinks === 'string') {
        updates.socialLinks = JSON.parse(updates.socialLinks);
      }

      updates.updatedAt = new Date();

      const updated = await TeamMember.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }

      res.json({ success: true, message: 'Team member updated', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Delete team member
  deleteTeamMember = async (req, res) => {
    try {
      const member = await TeamMember.findByIdAndDelete(req.params.id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }

      if (member.image) {
        const publicId = member.image.split('/').pop().split('.')[0];
        await deleteResource(`dcore-lab/${publicId}`);
      }

      res.json({ success: true, message: 'Team member deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Reorder team members
  reorderTeam = async (req, res) => {
    try {
      const { memberIds } = req.body;
      
      for (let i = 0; i < memberIds.length; i++) {
        await TeamMember.findByIdAndUpdate(memberIds[i], { order: i });
      }

      res.json({ success: true, message: 'Team members reordered' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new TeamController();
