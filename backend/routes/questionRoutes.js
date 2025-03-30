const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/:id', questionController.getQuestion);
router.put('/:id', questionController.updateQuestion);

module.exports = router;