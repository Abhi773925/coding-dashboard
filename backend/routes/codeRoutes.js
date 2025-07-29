const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// Code snippet routes
router.post('/save', codeController.saveCode);
router.get('/snippets/:userId', codeController.getUserSnippets);
router.delete('/snippets/:snippetId', codeController.deleteSnippet);

module.exports = router;
