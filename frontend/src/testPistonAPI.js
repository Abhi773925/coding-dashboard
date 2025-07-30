// Test file to verify Piston API integration
import axios from 'axios';

// Test function to get available runtimes
export const testGetRuntimes = async () => {
  try {
    const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
    console.log('Available runtimes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching runtimes:', error);
    return null;
  }
};

// Test function to execute code
export const testExecuteCode = async () => {
  try {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: 'javascript',
      version: '18.15.0',
      files: [
        {
          name: 'main.js',
          content: 'console.log("Hello from Piston API!");'
        }
      ],
      stdin: '',
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    });
    
    console.log('Execution result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error executing code:', error);
    return null;
  }
};

// Example usage
if (typeof window !== 'undefined') {
  window.testPistonAPI = {
    testGetRuntimes,
    testExecuteCode
  };
}
