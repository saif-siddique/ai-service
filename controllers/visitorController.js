const { processVisitorQuery } = require('../services/visitorAIService');
const formatResponse = require('../utils/formatResponse');

const handleVisitorQuery = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json(formatResponse('visitor', 'Prompt is required', null));
    }

    const aiResult = await processVisitorQuery(prompt);

    if (aiResult.success) {
      res.json(formatResponse('visitor', 'Query processed', aiResult.response));
    } else {
      res.status(500).json(formatResponse('visitor', 'AI Service failed', null));
    }
  } catch (error) {
    console.error('Visitor Controller Error:', error);
    res.status(500).json(formatResponse('visitor', 'Server error', null));
  }
};

module.exports = { handleVisitorQuery };
