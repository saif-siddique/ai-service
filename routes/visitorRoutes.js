const express = require('express');
const router = express.Router();
const { handleVisitorQuery } = require('../controllers/visitorController');

router.post('/query', handleVisitorQuery);
router.get("/query", (req, res) => {
    res.send({
        halat: "nazak"
    })
})


module.exports = router;
