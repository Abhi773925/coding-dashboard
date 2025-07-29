const CodeSnippet = require('../models/CodeSnippet');
const axios = require('axios');

// Judge0 API Configuration
const JUDGE0_API = process.env.JUDGE0_API || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

// Language ID mapping for Judge0
const LANGUAGE_IDS = {
    'javascript': 63,    // JavaScript (Node.js)
    'python': 71,       // Python 3
    'cpp': 54,         // C++ (GCC)
    'c': 50           // C (GCC)
};

const saveCodeSnippet = async (req, res) => {
    try {
        const { userId, filename, code, language } = req.body;
        
        if (!userId || !filename || !code || !language) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Check if a snippet with this filename already exists for the user
        let snippet = await CodeSnippet.findOne({ userId, filename });
        
        if (snippet) {
            // Update existing snippet
            snippet.code = code;
            snippet.language = language;
            snippet.lastModified = Date.now();
            await snippet.save();
        } else {
            // Create new snippet
            snippet = new CodeSnippet({
                userId,
                filename,
                code,
                language,
                createdAt: Date.now()
            });
            await snippet.save();
        }
        
        res.json({ 
            success: true, 
            message: 'Code saved successfully',
            snippetId: snippet._id,
            filename: snippet.filename,
            lastModified: snippet.lastModified
        });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving code',
            error: error.message
        });
    }
};

const executeCode = async (req, res) => {
    try {
        const { language_id, source_code, stdin } = req.body;

        if (!language_id || !source_code) {
            return res.status(400).json({
                success: false,
                message: 'Language ID and source code are required'
            });
        }

        // Create submission
        const response = await axios.post(`${JUDGE0_API}/submissions`, {
            language_id,
            source_code,
            stdin: stdin || ''
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': JUDGE0_API_KEY
            }
        });

        const { token } = response.data;

        // Get submission result
        const result = await axios.get(`${JUDGE0_API}/submissions/${token}`, {
            headers: {
                'X-RapidAPI-Key': JUDGE0_API_KEY
            }
        });

        // Process status codes
        switch (result.data.status.id) {
            case 1: // In Queue
            case 2: // Processing
                return res.json({
                    success: true,
                    message: 'Code is being processed',
                    status: result.data.status.description
                });
            
            case 3: // Accepted
                return res.json({
                    success: true,
                    output: result.data.stdout || 'Code executed successfully',
                    error: result.data.stderr || null
                });

            case 4: // Wrong Answer
            case 5: // Time Limit Exceeded
            case 6: // Compilation Error
            case 7: // Runtime Error
            case 13: // Internal Error
            default:
                return res.json({
                    success: false,
                    error: result.data.status.description,
                    details: result.data.stderr || result.data.compile_output || 'Execution failed'
                });
        }
    } catch (error) {
        console.error('Error executing code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error executing code',
            error: error.message 
        });
    }
};

const getUserSnippets = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const snippets = await CodeSnippet.find({ userId })
            .select('filename language lastModified')
            .sort('-lastModified');

        res.json({
            success: true,
            snippets
        });
    } catch (error) {
        console.error('Error fetching snippets:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching snippets',
            error: error.message
        });
    }
};

module.exports = {
    saveCodeSnippet,
    executeCode,
    getUserSnippets
};
