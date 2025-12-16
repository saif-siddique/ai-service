const { processStudentQuery } = require('../services/studentAIService');
const formatResponse = require('../utils/formatResponse');

const handleStudentQuery = async (req, res) => {
  try {
    const { prompt, studentData } = req.body; // studentData should be passed from the main backend or fetched here if we connected DB.
    // For a microservice, receiving context in body is cleaner to avoid duplicating DB logic, 
    // BUT usually microservice fetches its own data.
    // As per prompt requirements: "AI must only describe what data to fetch" (similar to admin) OR context injection.
    // The prompt says: "Responses must stay limited to student’s own information."
    
    // We will assume the Main Backend passes the 'studentData' context in the body when calling this microservice 
    // OR we can't really answer "What is my attendance" without access to the DB.
    // Given 'microservice' separation, context injection is the best pattern.
    
    if (!prompt) {
      return res.status(400).json(formatResponse('student', 'Prompt is required', null));
    }

    // Fallback if no data provided
    const context = studentData || { name: 'Student', attendance: [], fees: [], notifications: [] };

    const aiResult = await processStudentQuery(prompt, context);

    if (aiResult.success) {
      res.json(formatResponse('student', 'Query processed', aiResult.response));
    } else {
      res.status(500).json(formatResponse('student', 'AI Service failed', null));
    }
  } catch (error) {
    console.error('Student Controller Error:', error);
    res.status(500).json(formatResponse('student', 'Server error', null));
  }
};

module.exports = { handleStudentQuery };
