const express = require('express');
const router = express.Router();
const {
    saveCodeSnippet,
    executeCode,
    getUserSnippets
} = require('../controllers/codeController');

// Code snippet routes
router.post('/save', saveCodeSnippet);
router.post('/execute', executeCode);
router.get('/user/:userId', getUserSnippets);

module.exports = router;
