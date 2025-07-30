import axios from 'axios';

const testJudge0API = async () => {
  try {
    console.log('Testing Judge0 API...');
    
    const code = 'console.log("Hello World");';
    
    const submissionData = {
      language_id: 63, // JavaScript (Node.js)
      source_code: btoa(code), // Base64 encode
      cpu_time_limit: 5,
      memory_limit: 512000,
    };

    console.log('Submission data:', submissionData);

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      submissionData,
      {
        params: { 
          base64_encoded: "true",
          wait: "true" 
        },
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "af4a1574a2msh2682c4dc719c971p122eb1jsn51b3589532bf",
          "Content-Type": "application/json",
        },
      },
    );

    console.log('API Response:', response.data);
    
    // Decode base64 responses
    const stdout = response.data.stdout ? atob(response.data.stdout) : '';
    const stderr = response.data.stderr ? atob(response.data.stderr) : '';
    const compile_output = response.data.compile_output ? atob(response.data.compile_output) : '';
    
    console.log('Decoded stdout:', stdout);
    console.log('Decoded stderr:', stderr);
    console.log('Decoded compile_output:', compile_output);
    
  } catch (error) {
    console.error('API Test Error:', error);
    console.error('Error response:', error.response?.data);
  }
};

export default testJudge0API;
