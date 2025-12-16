const express = require('express');
const router = express.Router();
const { handleStudentQuery } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// Protected Student Route
router.post('/query', protect, handleStudentQuery);

// Test Route
// router.get('/test', (req, res) => {
//   res.json({ message: 'Student AI Service is running' });
// });

module.exports = router;
