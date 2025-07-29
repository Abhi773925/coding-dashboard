import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export const useCodeExecution = () => {
    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState(null);
    const [output, setOutput] = useState('');

    const executeCode = useCallback(async (code, language, framework = '') => {
        setIsExecuting(true);
        setError(null);
        setOutput('');
        
        try {
            const response = await axios.post(`${API_BASE_URL}/code/execute`, {
                code,
                language,
                framework
            });
            
            if (response.data.success) {
                setOutput(response.data.output);
                return response.data.output;
            } else {
                throw new Error(response.data.error || 'Execution failed');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message;
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsExecuting(false);
        }
    }, []);

    const saveCode = useCallback(async (filename, code, language) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/code/save`, {
                filename,
                code,
                language
            }, {
                withCredentials: true // Include cookies for authentication
            });
            
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.error || 'Failed to save code');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Please login to save code');
                throw new Error('Please login to save code');
            }
            const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message;
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    const getUserFiles = useCallback(async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/code/user/${userId}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching files');
            throw err;
        }
    }, []);

    const updateTerminalHistory = useCallback(async (snippetId, command, output) => {
        try {
            await axios.post(`${API_BASE_URL}/code/terminal/${snippetId}`, {
                command,
                output
            });
        } catch (err) {
            console.error('Error updating terminal history:', err);
        }
    }, []);

    const getFileContent = useCallback(async (fileId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/code/${fileId}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching file content');
            throw err;
        }
    }, []);

    return {
        executeCode,
        saveCode,
        getUserFiles,
        updateTerminalHistory,
        getFileContent,
        isExecuting,
        error
    };
};
