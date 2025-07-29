const CodeSnippet = require('../models/CodeSnippet');

// Save code snippet
exports.saveCode = async (req, res) => {
    try {
        const { userId, filename, code, language } = req.body;

        if (!userId || !code || !language || !filename) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if a file with this name already exists for this user
        const existingSnippet = await CodeSnippet.findOne({ userId, filename });

        if (existingSnippet) {
            // Update existing snippet
            existingSnippet.code = code;
            existingSnippet.language = language;
            await existingSnippet.save();
            res.status(200).json({ 
                message: 'Code updated successfully', 
                snippet: existingSnippet,
                isUpdate: true 
            });
        } else {
            // Create new snippet
            const codeSnippet = new CodeSnippet({
                userId,
                filename,
                code,
                language,
                createdAt: new Date()
            });
            await codeSnippet.save();
            res.status(201).json({ 
                message: 'Code saved successfully', 
                snippet: codeSnippet,
                isUpdate: false 
            });
        }
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ error: 'Error saving code' });
    }
};

// Get user's code snippets
exports.getUserSnippets = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching snippets for userId:', userId);
        const snippets = await CodeSnippet.find({ userId })
            .sort({ createdAt: -1 });
        console.log('Found snippets:', snippets);
        res.json(snippets);
    } catch (error) {
        console.error('Error fetching snippets:', error);
        res.status(500).json({ error: 'Error fetching snippets' });
    }
};

// Delete code snippet
exports.deleteSnippet = async (req, res) => {
    try {
        const { snippetId } = req.params;
        await CodeSnippet.findByIdAndDelete(snippetId);
        res.json({ message: 'Snippet deleted successfully' });
    } catch (error) {
        console.error('Error deleting snippet:', error);
        res.status(500).json({ error: 'Error deleting snippet' });
    }
};
