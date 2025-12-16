const express = require('express');
const router = express.Router();
const { handleVisitorQuery } = require('../controllers/visitorController');

router.post('/query', handleVisitorQuery);


module.exports = router;
