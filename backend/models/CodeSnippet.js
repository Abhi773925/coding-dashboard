const mongoose = require('mongoose');

const CodeSnippetSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    terminalHistory: [{
        command: String,
        output: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    settings: {
        theme: {
            type: String,
            default: 'vs-dark'
        },
        fontSize: {
            type: Number,
            default: 14
        },
        tabSize: {
            type: Number,
            default: 4
        },
        autoSave: {
            type: Boolean,
            default: true
        }
    }
});

const CodeSnippet = mongoose.model('CodeSnippet', CodeSnippetSchema);

module.exports = CodeSnippet;
