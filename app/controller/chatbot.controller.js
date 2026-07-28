const ChatbotFAQ = require('../models/qnasware');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class ChatbotController {
  // Get chatbot response - Search FAQ first, then use AI if not found
  getChatbotResponse = async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || message.trim().length < 2) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please enter a valid message' 
        });
      }

      // Step 1: Search FAQ for matching questions
      const faqMatches = await this.searchFAQ(message);

      if (faqMatches.length > 0) {
        // Return FAQ answer
        const topMatch = faqMatches[0];
        
        // Record view
        await ChatbotFAQ.findByIdAndUpdate(topMatch._id, { $inc: { views: 1 } });

        return res.json({
          success: true,
          type: 'faq',
          answer: topMatch.answer,
          question: topMatch.question,
          faqId: topMatch._id,
          confidence: 'high',
          suggestions: faqMatches.slice(1, 3).map(m => ({
            id: m._id,
            question: m.question
          }))
        });
      }

      // Step 2: If no FAQ match, use AI (ChatGPT)
      const aiResponse = await this.getAIResponse(message);

      return res.json({
        success: true,
        type: 'ai',
        answer: aiResponse,
        confidence: 'medium'
      });

    } catch (error) {
      console.error('Chatbot error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Unable to process your request. Please try again later.' 
      });
    }
  };

  // Search FAQ database
  searchFAQ = async (query) => {
    try {
      const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

      const faqs = await ChatbotFAQ.find({
        $or: [
          { question: { $regex: query, $options: 'i' } },
          { answer: { $regex: query, $options: 'i' } },
          { keywords: { $in: keywords.map(k => new RegExp(k, 'i')) } }
        ],
        isActive: true
      }).limit(5);

      return faqs.sort((a, b) => {
        // Prioritize by question match
        const aMatch = a.question.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        const bMatch = b.question.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        return bMatch - aMatch;
      });
    } catch (error) {
      console.error('FAQ search error:', error);
      return [];
    }
  };

  // Get AI response using ChatGPT via OpenAI API
  getAIResponse = async (message) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return this.getDefaultResponse(message);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: `You are a helpful customer support assistant for Dcore Lab, a web development and digital solutions company. 
                     Provide helpful, friendly, and concise responses. If you don't know something, suggest the user contact support.
                     Keep responses under 200 words.`
          }, {
            role: 'user',
            content: message
          }],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        return this.getDefaultResponse(message);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('AI API error:', error);
      return this.getDefaultResponse(message);
    }
  };

  // Default response when AI is not available
  getDefaultResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    const defaultResponses = {
      'hello|hi|hey': 'Hello! 👋 How can I help you today?',
      'price|cost|charge|quote': 'We offer flexible pricing based on your project requirements. Please contact us for a custom quote!',
      'service|offer|what': 'We offer web development, mobile apps, UI/UX design, and digital consulting. What interests you?',
      'contact|email|phone': 'You can reach us through the contact form below, or email us at info@dcorelab.com',
      'thank|thanks|great': 'Happy to help! Is there anything else? 😊',
      'bye|goodbye': 'Goodbye! Have a great day! 👋'
    };

    for (const [keywords, response] of Object.entries(defaultResponses)) {
      const pattern = new RegExp(keywords.split('|').join('|'), 'i');
      if (pattern.test(lowerMessage)) {
        return response;
      }
    }

    return 'Thank you for your question! Could you please provide more details so I can help you better? You can also contact our team directly through the contact form.';
  };

  // Record FAQ feedback
  recordFeedback = async (req, res) => {
    try {
      const { faqId, helpful } = req.body;

      if (!faqId) {
        return res.status(400).json({ success: false, message: 'FAQ ID required' });
      }

      const updateField = helpful ? 'helpful' : 'notHelpful';
      const updated = await ChatbotFAQ.findByIdAndUpdate(
        faqId,
        { $inc: { [updateField]: 1 } },
        { new: true }
      );

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get chatbot statistics
  getStats = async (req, res) => {
    try {
      const totalFAQs = await ChatbotFAQ.countDocuments({ isActive: true });
      const totalViews = await ChatbotFAQ.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]);
      const totalHelpful = await ChatbotFAQ.aggregate([
        { $group: { _id: null, total: { $sum: '$helpful' } } }
      ]);

      res.json({
        success: true,
        data: {
          totalFAQs,
          totalViews: totalViews[0]?.total || 0,
          totalHelpful: totalHelpful[0]?.total || 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ChatbotController();
