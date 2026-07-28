const ChatbotFAQ = require('../../models/qnasware');

class ChatbotController {
  // Get all FAQs
  getAllFAQs = async (req, res) => {
    try {
      const faqs = await ChatbotFAQ.find({ isActive: true }).sort({ category: 1, order: 1 });
      res.json({ success: true, data: faqs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get FAQs by category
  getFAQsByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const faqs = await ChatbotFAQ.find({ category, isActive: true }).sort({ order: 1 });
      res.json({ success: true, data: faqs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Search FAQs by keywords
  searchFAQs = async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || query.length < 2) {
        return res.json({ success: true, data: [] });
      }

      const faqs = await ChatbotFAQ.find({
        $or: [
          { question: { $regex: query, $options: 'i' } },
          { answer: { $regex: query, $options: 'i' } },
          { keywords: { $in: [new RegExp(query, 'i')] } }
        ],
        isActive: true
      }).limit(5);

      res.json({ success: true, data: faqs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create FAQ
  createFAQ = async (req, res) => {
    try {
      const { category, question, answer, keywords } = req.body;

      if (!category || !question || !answer) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const newFAQ = new ChatbotFAQ({
        category,
        question,
        answer,
        keywords: keywords ? JSON.parse(keywords) : [],
        order: (await ChatbotFAQ.find({ category }).countDocuments()) + 1
      });

      const saved = await newFAQ.save();
      res.status(201).json({ success: true, message: 'FAQ created', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update FAQ
  updateFAQ = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.keywords && typeof updates.keywords === 'string') {
        updates.keywords = JSON.parse(updates.keywords);
      }

      updates.updatedAt = new Date();

      const updated = await ChatbotFAQ.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'FAQ not found' });
      }

      res.json({ success: true, message: 'FAQ updated', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Delete FAQ
  deleteFAQ = async (req, res) => {
    try {
      const faq = await ChatbotFAQ.findByIdAndDelete(req.params.id);
      if (!faq) {
        return res.status(404).json({ success: false, message: 'FAQ not found' });
      }

      res.json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Record FAQ view
  recordView = async (req, res) => {
    try {
      const { id } = req.params;
      await ChatbotFAQ.findByIdAndUpdate(id, { $inc: { views: 1 } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Record FAQ helpful/not helpful
  recordFeedback = async (req, res) => {
    try {
      const { id } = req.params;
      const { helpful } = req.body;

      const updateField = helpful ? 'helpful' : 'notHelpful';
      await ChatbotFAQ.findByIdAndUpdate(id, { $inc: { [updateField]: 1 } });
      
      res.json({ success: true, message: 'Feedback recorded' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get categories
  getCategories = async (req, res) => {
    try {
      const categories = await ChatbotFAQ.distinct('category');
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ChatbotController();
