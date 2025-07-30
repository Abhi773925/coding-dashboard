const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const axios = require('axios');

// Judge0 API Configuration
const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = 'af4a1574a2msh2682c4dc719c971p122eb1jsn51b3589532bf';

// Code snippet routes
router.post('/save', codeController.saveCode);
router.get('/snippets/:userId', codeController.getUserSnippets);
router.delete('/snippets/:snippetId', codeController.deleteSnippet);

// Code execution route
router.post('/execute', async (req, res) => {
    try {
        const { language_id, source_code, stdin } = req.body;

        if (!language_id || !source_code) {
            return res.status(400).json({
                success: false,
                message: 'Language ID and source code are required'
            });
        }

        console.log('Executing code with Judge0 API');
        console.log('Language ID:', language_id);
        console.log('Source code length:', source_code.length);

        // Create submission with Judge0 API
        const response = await axios.post(`${JUDGE0_API}/submissions`, {
            language_id,
            source_code,
            stdin: stdin || '',
            base64_encoded: true,
            wait: true
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key': JUDGE0_API_KEY
            }
        });

        const result = response.data;
        console.log('Judge0 response:', result);

        // Decode base64 responses if they exist
        const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
        const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
        const compile_output = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '';

        console.log('Decoded stdout:', stdout);
        console.log('Decoded stderr:', stderr);
        console.log('Decoded compile_output:', compile_output);

        // Process the result based on status
        if (result.status && result.status.id === 3) { // Accepted
            res.json({
                success: true,
                output: stdout || 'Code executed successfully (no output)',
                status: result.status.description,
                time: result.time,
                memory: result.memory
            });
        } else {
            // Handle errors
            let errorMessage = '';
            if (stderr) {
                errorMessage = stderr;
            } else if (compile_output) {
                errorMessage = compile_output;
            } else if (result.status) {
                errorMessage = result.status.description;
            } else {
                errorMessage = 'Unknown execution error';
            }

            res.json({
                success: false,
                error: errorMessage,
                status: result.status?.description || 'Error',
                time: result.time,
                memory: result.memory
            });
        }
    } catch (error) {
        console.error('Error executing code:', error);
        console.error('Error details:', error.response?.data);
        
        let errorMessage = 'Error executing code';
        if (error.response?.status === 429) {
            errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (error.response?.status === 401) {
            errorMessage = 'API authentication failed.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(500).json({ 
            success: false, 
            error: errorMessage
        });
    }
});

module.exports = router;
